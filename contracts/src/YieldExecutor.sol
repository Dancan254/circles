// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {CCIPReceiver} from "@chainlink/contracts-ccip/contracts/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";
import {IERC20BurnMint, IERC20} from "src/interfaces/IERC20BurnMint.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {OwnerIsCreator} from "@chainlink/contracts/src/v0.8/shared/access/OwnerIsCreator.sol";
import {IERC4626} from "@openzeppelin/contracts/interfaces/IERC4626.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";
/// @title YieldExecutor - Executes yield strategies on destination chains
/// @notice Receives cross-chain messages and deploys funds to high-yield protocols

contract YieldExecutor is CCIPReceiver, OwnerIsCreator {
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
        s_lastReceivedAction = abi.decode(any2EvmMessage.data, (string));

        // Handle token transfers if present
        if (any2EvmMessage.destTokenAmounts.length > 0) {
            s_lastReceivedToken = any2EvmMessage.destTokenAmounts[0].token;
            s_lastReceivedAmount = any2EvmMessage.destTokenAmounts[0].amount;
        }

        // Execute the requested action
        _executeAction(s_lastReceivedAction, s_lastReceivedToken, s_lastReceivedAmount);

        emit FundsReceived(
            any2EvmMessage.messageId, any2EvmMessage.sourceChainSelector, s_lastReceivedToken, s_lastReceivedAmount
        );
    }

    function _sendCrossChainMessage(
        uint64 _destinationChain,
        address _receiver,
        string memory _action,
        address _token,
        uint256 _amount
    ) internal returns (bytes32 messageId) {
        // Build CCIP message
        Client.EVM2AnyMessage memory message =
            _buildCCIPMessage(_receiver, _action, _token, _amount, address(s_linkToken));

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
        string memory _action,
        address _token,
        uint256 _amount,
        address _feeToken
    ) internal pure returns (Client.EVM2AnyMessage memory) {
        // Set token amounts for transfer
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({token: _token, amount: _amount});

        return Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver),
            data: abi.encode(_action),
            tokenAmounts: tokenAmounts,
            extraArgs: Client._argsToBytes(Client.GenericExtraArgsV2({gasLimit: 500_000, allowOutOfOrderExecution: true})),
            feeToken: _feeToken
        });
    }

    /// @notice Execute the action specified in the CCIP message
    function _executeAction(string memory _action, address _token, uint256 _amount) internal {
        if (keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("DEPLOY_FUNDS"))) {
            _deployToDefaultProtocol(_token, _amount);
        } else if (keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("WITHDRAW_FUNDS"))) {
            _withdrawFromProtocols(_token, _amount);
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

    function _withdrawFundsToSourceChain(uint256 _amount, uint64 _destinationChain, address _token)
        internal
        onlyAllowlistedChain(_destinationChain)
        returns (bytes32)
    {
        address dispatcher = authorizedDispatchers[_destinationChain];

        // Send cross-chain message with tokens
        bytes32 messageId = _sendCrossChainMessage(_destinationChain, dispatcher, "WITHDRAWAL_SUCESS", _token, _amount);

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

    /// @notice Get total value deployed across all protocols for a token
    function getTotalDeployedValue(address _token) external view returns (uint256 total) {
        // TODO: Implement logic to sum across all protocols
        // This would query each supported protocol for deployed amounts
        return 0; // Placeholder
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

    /// @notice Receive ETH (for gas refunds, etc.)
    receive() external payable {}
}
