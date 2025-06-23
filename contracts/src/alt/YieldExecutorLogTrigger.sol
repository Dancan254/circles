// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {CCIPReceiver} from "@chainlink/contracts-ccip/contracts/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";
import {IERC20BurnMint, IERC20} from "src/interfaces/IERC20BurnMint.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {OwnerIsCreator} from "@chainlink/contracts/src/v0.8/shared/access/OwnerIsCreator.sol";
import {ILogAutomation, Log} from "@chainlink/contracts/src/v0.8/automation/interfaces/ILogAutomation.sol";
import {IERC4626} from "@openzeppelin/contracts/interfaces/IERC4626.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";
/// @title YieldExecutor - Executes yield strategies on destination chains
/// @notice Receives cross-chain messages and deploys funds to high-yield protocols

contract YieldExecutor is CCIPReceiver, OwnerIsCreator, ILogAutomation {
    using SafeERC20 for IERC20;

    // Custom errors
    error SourceChainNotAllowed(uint64 sourceChainSelector);
    error SenderNotAllowed(address sender);
    error InvalidAction(string action);
    error ProtocolNotSupported(address protocol);
    error InvalidAmount(uint256 amount);
    error StakingFailed();
    error WithdrawalFailed();
    error ProtocolTokenMismatch(address token, address protocolAsset);
    error NotEnoughBalance(uint256 balance, uint256 required);

    // Events
    event FundsReceived(bytes32 indexed messageId, uint64 indexed sourceChain, address indexed token, uint256 amount);

    event FundsStaked(address indexed protocol, address indexed token, uint256 amount, uint256 timestamp);

    event FundsWithdrawn(address indexed protocol, address indexed token, uint256 amount, uint256 yield);

    event YieldHarvested(address indexed protocol, address indexed token, uint256 yieldAmount);

    event ProtocolUpdated(address indexed protocol, bool supported);
    event DispatcherUpdated(uint64 indexed chainSelector, address dispatcher);
    event WithdrawalRequested(
        address indexed token, uint256 indexed amount, address indexed receiver, uint64 sourceChain
    );

    // State variables

    // Mapping to track allowlisted source chains
    mapping(uint64 => bool) public allowlistedSourceChains;

    // Mapping to track authorized YieldDispatcher contracts
    mapping(uint64 => address) public authorizedDispatchers;

    // Mapping to track supported yield protocols on this chain
    mapping(address => bool) public supportedProtocols;

    // Mapping to track staked amounts per protocol
    mapping(address => mapping(address => uint256)) public stakedAmounts; // protocol => token => amount

    // Mapping to track total yield earned per protocol/token
    mapping(address => mapping(address => uint256)) public yieldEarned; // protocol => token => yield

    // Last received message details
    bytes32 private s_lastReceivedMessageId;
    string private s_lastReceivedAction;
    address private s_lastReceivedToken;
    uint256 private s_lastReceivedAmount;
    address protocol;
    IERC20 private s_linkToken;
    IRouterClient private s_router;

    /// @notice Constructor initializes the contract with the router address
    /// @param _router The address of the CCIP router contract
    constructor(address _router, address _protocol, address _link) CCIPReceiver(_router) {
        protocol = _protocol;
        s_router = IRouterClient(_router);
        s_linkToken = IERC20(_link);

        // Set the default protocol as supported
        supportedProtocols[_protocol] = true;

        // Emit initial events
        emit ProtocolUpdated(_protocol, true);
    }

    /// @dev Modifier that checks if the source chain and sender are allowlisted
    modifier onlyAllowlisted(uint64 _sourceChainSelector, address _sender) {
        if (!allowlistedSourceChains[_sourceChainSelector]) {
            revert SourceChainNotAllowed(_sourceChainSelector);
        }
        if (authorizedDispatchers[_sourceChainSelector] != _sender) {
            revert SenderNotAllowed(_sender);
        }
        _;
    }

    modifier onlyAllowlistedChain(uint64 _chainSelector) {
        if (!allowlistedSourceChains[_chainSelector]) {
            revert SourceChainNotAllowed(_chainSelector);
        }
        _;
    }

    /*//////////////////////////////////////////////////////////////
                           ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Update allowlist status for a source chain
    /// @param _sourceChainSelector The chain selector to update
    /// @param _allowed Whether the chain should be allowed
    function allowlistSourceChain(uint64 _sourceChainSelector, bool _allowed) external onlyOwner {
        allowlistedSourceChains[_sourceChainSelector] = _allowed;
    }

    /// @notice Set authorized YieldDispatcher for a specific source chain
    /// @param _sourceChainSelector The source chain selector
    /// @param _dispatcher The YieldDispatcher contract address
    function setAuthorizedDispatcher(uint64 _sourceChainSelector, address _dispatcher) external onlyOwner {
        authorizedDispatchers[_sourceChainSelector] = _dispatcher;
        emit DispatcherUpdated(_sourceChainSelector, _dispatcher);
    }

    /// @notice Update supported protocol status
    /// @param _protocol The protocol address to update
    /// @param _supported Whether the protocol should be supported
    function setSupportedProtocol(address _protocol, bool _supported) external onlyOwner {
        supportedProtocols[_protocol] = _supported;
        emit ProtocolUpdated(_protocol, _supported);
    }

    /*//////////////////////////////////////////////////////////////
                           CCIP FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Handle incoming CCIP messages
    function _ccipReceive(Client.Any2EVMMessage memory any2EvmMessage)
        internal
        override
        onlyAllowlisted(any2EvmMessage.sourceChainSelector, abi.decode(any2EvmMessage.sender, (address)))
    {
        // Store message details
        s_lastReceivedMessageId = any2EvmMessage.messageId;
        (string memory lastReceivedAction, uint256 amount, address token, address reciever) =
            abi.decode(any2EvmMessage.data, (string, uint256, address, address));

        // Handle token transfers if present
        if (any2EvmMessage.destTokenAmounts.length > 0) {
            s_lastReceivedToken = any2EvmMessage.destTokenAmounts[0].token;
            s_lastReceivedAmount = any2EvmMessage.destTokenAmounts[0].amount;
        }

        // Execute the requested action
        _executeAction(lastReceivedAction, token, amount, reciever, uint64(any2EvmMessage.sourceChainSelector));

        emit FundsReceived(
            any2EvmMessage.messageId, any2EvmMessage.sourceChainSelector, s_lastReceivedToken, s_lastReceivedAmount
        );
    }

    function _sendCrossChainMessage(
        uint64 _destinationChain,
        address _receiver,
        bytes memory _data,
        address _token,
        uint256 _amount
    ) internal returns (bytes32 messageId) {
        // Build CCIP message
        Client.EVM2AnyMessage memory message =
            _buildCCIPMessage(_receiver, _data, _token, _amount, address(s_linkToken));

        // Calculate fees
        uint256 fees = s_router.getFee(_destinationChain, message);

        if (fees > s_linkToken.balanceOf(address(this))) {
            revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);
        }

        // Approve router to spend LINK for fees and tokens for transfer
        s_linkToken.approve(address(s_router), fees);
        IERC20(_token).approve(address(s_router), _amount);

        // Send the message
        messageId = s_router.ccipSend(_destinationChain, message);

        return messageId;
    }

    function _buildCCIPMessage(
        address _receiver,
        bytes memory _data,
        address _token,
        uint256 _amount,
        address _feeToken
    ) internal pure returns (Client.EVM2AnyMessage memory) {
        // Set token amounts for transfer
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({token: _token, amount: _amount});

        return Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver),
            data: _data,
            tokenAmounts: tokenAmounts,
            extraArgs: Client._argsToBytes(Client.GenericExtraArgsV2({gasLimit: 1_500_000, allowOutOfOrderExecution: true})),
            feeToken: _feeToken
        });
    }

    /// @notice Execute the action specified in the CCIP message
    function _executeAction(
        string memory _action,
        address _token,
        uint256 _amount,
        address reciever,
        uint64 sourceChain
    ) internal {
        if (keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("DEPLOY_FUNDS"))) {
            _deployToDefaultProtocol(_token, _amount);
        } else if (keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("WITHDRAW_FUNDS"))) {
            _withdrawFromProtocols(_token, _amount);
            emit WithdrawalRequested(_token, _amount, reciever, sourceChain);
        } else {
            revert InvalidAction(_action);
        }
    }

    /*//////////////////////////////////////////////////////////////
                           STAKING FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Deploy funds to the default high-yield protocol
    function _deployToDefaultProtocol(address _token, uint256 _amount) internal {
        // TODO: Implement logic to select best protocol based on current rates
        // For now, we'll use a placeholder approach

        address bestProtocol = _getBestProtocol(_token);
        if (bestProtocol == address(0)) revert ProtocolNotSupported(address(0));

        _stakeInProtocol(bestProtocol, _token, _amount);
    }

    /// @notice Stake tokens in a specific protocol
    // We are going to work with ERC4626 protocols for now
    function _stakeInProtocol(address _protocol, address _token, uint256 _amount) internal {
        if (!supportedProtocols[_protocol]) revert ProtocolNotSupported(_protocol);
        if (_amount == 0) revert InvalidAmount(_amount);

        // Approve protocol to spend tokens
        IERC20(_token).safeIncreaseAllowance(_protocol, _amount);

        IERC4626(_protocol).deposit(_amount, address(this));

        // For now, just track the staked amount
        stakedAmounts[_protocol][_token] += _amount;

        emit FundsStaked(_protocol, _token, _amount, block.timestamp);
    }

    function setProtocol(address _protocol) external onlyOwner {
        require(_protocol != address(0), "Invalid protocol address");
        protocol = _protocol;
        supportedProtocols[_protocol] = true;
    }

    /// @notice Get the best protocol for a given token
    /// @notice We want to compare yields against multiple protocols, but in this case we'll hardcode a single protocol
    function _getBestProtocol(address _token) internal view returns (address) {
        address protocolAsset = IERC4626(protocol).asset();
        if (protocolAsset != _token) {
            revert ProtocolTokenMismatch(_token, protocolAsset);
        }

        return protocol;
    }

    /*//////////////////////////////////////////////////////////////
                           WITHDRAWAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Withdraw funds from protocols
    // @notice We should also impliment a way to return the tokens to the source chain
    function _withdrawFromProtocols(address _token, uint256 _amount) internal {
        uint256 sharesRedeemed = IERC4626(protocol).withdraw(_amount, address(this), address(this));
        emit FundsWithdrawn(protocol, _token, _amount, sharesRedeemed);
    }

    function _withdrawFundsToSourceChain(uint256 _amount, uint64 _destinationChain, address _token, address reciever)
        internal
        onlyAllowlistedChain(_destinationChain)
        returns (bytes32)
    {
        // Send cross-chain message with tokens
        bytes memory data = abi.encode("WITHDRAWAL_FUNDS", 0, 0, 0);
        bytes32 messageId = _sendCrossChainMessage(_destinationChain, reciever, data, _token, _amount);

        return messageId;
    }

    function withdrawFundsToSourceChain(uint64 _destinationChain, uint256 _amount, address _token, address reciever)
        external
        onlyAllowlistedChain(_destinationChain)
        returns (bytes32)
    {
        if (_amount == 0) revert InvalidAmount(_amount);
        if (!supportedProtocols[protocol]) revert ProtocolNotSupported(protocol);

        // Withdraw from the protocol
        _withdrawFromProtocols(_token, _amount);

        // Send the funds back to the source chain
        bytes32 messageId = _withdrawFundsToSourceChain(_amount, _destinationChain, _token, reciever);

        emit FundsWithdrawn(protocol, _token, _amount, _amount);
        return messageId;
    }

    /*//////////////////////////////////////////////////////////////
                           VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Get last received message details
    function getLastReceivedMessageDetails()
        public
        view
        returns (bytes32 messageId, string memory action, address token, uint256 amount)
    {
        return (s_lastReceivedMessageId, s_lastReceivedAction, s_lastReceivedToken, s_lastReceivedAmount);
    }

    /// @notice Get total staked amount for a protocol and token
    function getStakedAmount(address _protocol, address _token) external view returns (uint256) {
        return stakedAmounts[_protocol][_token];
    }

    /// @notice Get total yield earned for a protocol and token
    function getYieldEarned(address _protocol, address _token) external view returns (uint256) {
        return yieldEarned[_protocol][_token];
    }

    /*//////////////////////////////////////////////////////////////
                           EMERGENCY FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emergency withdrawal of tokens
    function emergencyWithdraw(address _token, address _to) external onlyOwner {
        uint256 balance = IERC20(_token).balanceOf(address(this));
        IERC20(_token).safeTransfer(_to, balance);
    }

    /// @notice Emergency withdrawal of ETH
    function emergencyWithdrawEth(address _to) external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success,) = _to.call{value: balance}("");
        require(success, "ETH transfer failed");
    }

    /// @notice Check if log-triggered upkeep is needed for withdrawal automation
    /// @param log The log data from the WithdrawalRequested event
    /// @param checkData Additional check data (not used in this implementation)
    /// @return upkeepNeeded Whether upkeep should be performed
    /// @return performData Encoded data to pass to performUpkeep
    function checkLog(Log calldata log, bytes memory checkData)
        external
        pure
        returns (bool upkeepNeeded, bytes memory performData)
    {
        // Verify this is a WithdrawalRequested event
        // event WithdrawalRequested(address indexed token, uint256 indexed amount, address indexed receiver, uint64 sourceChain);
        // Event signature: keccak256("WithdrawalRequested(address,uint256,address,uint64)")
        bytes32 expectedEventSignature = 0x90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a15;

        // Check if this is the correct event (topics[0] contains the event signature)
        if (log.topics[0] != expectedEventSignature) {
            return (false, "");
        }

        // Decode the event data - all parameters are now indexed
        // topics[1] = indexed token (address)
        // topics[2] = indexed amount (uint256)
        // topics[3] = indexed receiver (address)
        // Note: sourceChain would be in topics[4] but events can only have up to 3 indexed parameters
        // So sourceChain will be in the data field

        address token = address(uint160(uint256(log.topics[1])));
        uint256 amount = uint256(log.topics[2]);
        address receiver = address(uint160(uint256(log.topics[3])));
        uint64 sourceChain = abi.decode(log.data, (uint64));

        // Always trigger upkeep for withdrawal requests
        upkeepNeeded = true;
        performData = abi.encode(amount, sourceChain, token, receiver);

        // Silence unused parameter warning
        checkData;
    }

    /// @notice Perform the withdrawal automation upkeep
    /// @param performData Encoded withdrawal parameters
    function performUpkeep(bytes calldata performData) external {
        (uint256 amount, uint64 sourceChain, address token, address receiver) =
            abi.decode(performData, (uint256, uint64, address, address));

        // Verify the source chain is allowed before processing
        if (!allowlistedSourceChains[sourceChain]) {
            revert SourceChainNotAllowed(sourceChain);
        }

        // Execute the withdrawal to source chain
        _withdrawFundsToSourceChain(amount, sourceChain, token, receiver);
    }

    /// @notice Receive ETH (for gas refunds, etc.)
    receive() external payable {}
}
