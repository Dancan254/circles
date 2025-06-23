// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {CCIPReceiver} from "@chainlink/contracts-ccip/contracts/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";
import {IERC20BurnMint, IERC20} from "src/interfaces/IERC20BurnMint.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {OwnerIsCreator} from "@chainlink/contracts/src/v0.8/shared/access/OwnerIsCreator.sol";
import {IERC4626} from "@openzeppelin/contracts/interfaces/IERC4626.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";

/**
 * @title YieldExecutor
 * @author Circle Protocol Team
 * @notice Executes yield strategies on destination chains through cross-chain communication
 * @dev This contract receives CCIP messages from YieldDispatcher contracts and deploys funds
 *      to high-yield protocols (ERC4626 vaults) on the destination chain. It handles fund
 *      deployment, withdrawal, and cross-chain communication for yield farming operations.
 *
 * Key Features:
 * - Receives cross-chain messages via Chainlink CCIP
 * - Deploys funds to ERC4626-compatible yield protocols
 * - Manages protocol allowlists and authorized dispatchers
 * - Handles emergency withdrawals and fund recovery
 * - Tracks staked amounts and yield earned per protocol
 */
contract YieldExecutor is CCIPReceiver, OwnerIsCreator {
    using SafeERC20 for IERC20;

    /*//////////////////////////////////////////////////////////////
                                CONSTANTS
    //////////////////////////////////////////////////////////////*/

    /// @dev Gas limit for cross-chain transactions
    uint256 private constant CCIP_GAS_LIMIT = 1_500_000;

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    error SourceChainNotAllowed(uint64 sourceChainSelector);
    error SenderNotAllowed(address sender);
    error InvalidAction(string action);
    error ProtocolNotSupported(address protocol);
    error InvalidAmount(uint256 amount);
    error StakingFailed();
    error WithdrawalFailed();
    error ProtocolTokenMismatch(address token, address protocolAsset);
    error NotEnoughBalance(uint256 balance, uint256 required);
    error InvalidProtocolAddress();
    error EthTransferFailed();

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emitted when funds are received via CCIP
    /// @param messageId The CCIP message ID
    /// @param sourceChain The source chain selector
    /// @param token The token address received
    /// @param amount The amount received
    event FundsReceived(bytes32 indexed messageId, uint64 indexed sourceChain, address indexed token, uint256 amount);

    /// @notice Emitted when funds are staked in a protocol
    /// @param protocol The protocol address where funds were staked
    /// @param token The token that was staked
    /// @param amount The amount staked
    /// @param timestamp The timestamp of staking
    event FundsStaked(address indexed protocol, address indexed token, uint256 amount, uint256 timestamp);

    /// @notice Emitted when funds are withdrawn from a protocol
    /// @param protocol The protocol address from which funds were withdrawn
    /// @param token The token that was withdrawn
    /// @param amount The amount withdrawn
    /// @param yield The yield earned (shares redeemed)
    event FundsWithdrawn(address indexed protocol, address indexed token, uint256 amount, uint256 yield);

    /// @notice Emitted when yield is harvested from a protocol
    /// @param protocol The protocol address from which yield was harvested
    /// @param token The token for which yield was harvested
    /// @param yieldAmount The amount of yield harvested
    event YieldHarvested(address indexed protocol, address indexed token, uint256 yieldAmount);

    /// @notice Emitted when a protocol's supported status is updated
    /// @param protocol The protocol address
    /// @param supported Whether the protocol is now supported
    event ProtocolUpdated(address indexed protocol, bool supported);

    /// @notice Emitted when an authorized dispatcher is updated
    /// @param chainSelector The chain selector for the dispatcher
    /// @param dispatcher The dispatcher address
    event DispatcherUpdated(uint64 indexed chainSelector, address dispatcher);

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    /// @notice Mapping to track allowlisted source chains
    mapping(uint64 => bool) public allowlistedSourceChains;

    /// @notice Mapping to track authorized YieldDispatcher contracts per chain
    mapping(uint64 => address) public authorizedDispatchers;

    /// @notice Mapping to track supported yield protocols on this chain
    mapping(address => bool) public supportedProtocols;

    /// @notice Mapping to track staked amounts per protocol and token
    mapping(address => mapping(address => uint256)) public stakedAmounts;

    /// @notice Mapping to track total yield earned per protocol and token
    mapping(address => mapping(address => uint256)) public yieldEarned;

    /// @notice The default protocol to deploy funds to
    address public protocol;

    /// @notice The LINK token contract for paying CCIP fees
    IERC20 private immutable s_linkToken;

    /// @notice The CCIP router contract
    IRouterClient private immutable s_router;

    /// @notice Last received message details for debugging
    bytes32 private s_lastReceivedMessageId;
    string private s_lastReceivedAction;
    address private s_lastReceivedToken;
    uint256 private s_lastReceivedAmount;

    /*//////////////////////////////////////////////////////////////
                                MODIFIERS
    //////////////////////////////////////////////////////////////*/

    /// @dev Ensures the source chain and sender are allowlisted
    /// @param _sourceChainSelector The source chain selector to verify
    /// @param _sender The sender address to verify
    modifier onlyAllowlisted(uint64 _sourceChainSelector, address _sender) {
        if (!allowlistedSourceChains[_sourceChainSelector]) {
            revert SourceChainNotAllowed(_sourceChainSelector);
        }
        if (authorizedDispatchers[_sourceChainSelector] != _sender) {
            revert SenderNotAllowed(_sender);
        }
        _;
    }

    /// @dev Ensures the chain is allowlisted
    /// @param _chainSelector The chain selector to verify
    modifier onlyAllowlistedChain(uint64 _chainSelector) {
        if (!allowlistedSourceChains[_chainSelector]) {
            revert SourceChainNotAllowed(_chainSelector);
        }
        _;
    }

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /// @notice Initializes the YieldExecutor contract
    /// @param _router The address of the CCIP router contract
    /// @param _protocol The address of the default yield protocol (ERC4626 vault)
    /// @param _link The address of the LINK token for CCIP fees
    constructor(address _router, address _protocol, address _link) CCIPReceiver(_router) {
        if (_protocol == address(0)) revert InvalidProtocolAddress();

        protocol = _protocol;
        s_router = IRouterClient(_router);
        s_linkToken = IERC20(_link);

        // Set the default protocol as supported
        supportedProtocols[_protocol] = true;

        emit ProtocolUpdated(_protocol, true);
    }

    /*//////////////////////////////////////////////////////////////
                            ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Updates the allowlist status for a source chain
    /// @dev Only the contract owner can call this function
    /// @param _sourceChainSelector The chain selector to update
    /// @param _allowed Whether the chain should be allowed to send messages
    function allowlistSourceChain(uint64 _sourceChainSelector, bool _allowed) external onlyOwner {
        allowlistedSourceChains[_sourceChainSelector] = _allowed;
    }

    /// @notice Sets the authorized YieldDispatcher for a specific source chain
    /// @dev Only the contract owner can call this function
    /// @param _sourceChainSelector The source chain selector
    /// @param _dispatcher The YieldDispatcher contract address on the source chain
    function setAuthorizedDispatcher(uint64 _sourceChainSelector, address _dispatcher) external onlyOwner {
        authorizedDispatchers[_sourceChainSelector] = _dispatcher;
        emit DispatcherUpdated(_sourceChainSelector, _dispatcher);
    }

    /// @notice Updates the supported status of a yield protocol
    /// @dev Only the contract owner can call this function
    /// @param _protocol The protocol address to update
    /// @param _supported Whether the protocol should be supported for yield farming
    function setSupportedProtocol(address _protocol, bool _supported) external onlyOwner {
        supportedProtocols[_protocol] = _supported;
        emit ProtocolUpdated(_protocol, _supported);
    }

    /// @notice Updates the default protocol address
    /// @dev Only the contract owner can call this function
    /// @param _protocol The new default protocol address (must be ERC4626 compatible)
    function setProtocol(address _protocol) external onlyOwner {
        if (_protocol == address(0)) revert InvalidProtocolAddress();
        protocol = _protocol;
        supportedProtocols[_protocol] = true;
        emit ProtocolUpdated(_protocol, true);
    }

    /*//////////////////////////////////////////////////////////////
                             CCIP FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Handles incoming CCIP messages from authorized dispatchers
    /// @dev Validates source chain and sender before processing the message
    /// @param any2EvmMessage The CCIP message containing action data and tokens
    function _ccipReceive(Client.Any2EVMMessage memory any2EvmMessage)
        internal
        override
        onlyAllowlisted(any2EvmMessage.sourceChainSelector, abi.decode(any2EvmMessage.sender, (address)))
    {
        s_lastReceivedMessageId = any2EvmMessage.messageId;
        (string memory lastReceivedAction, uint256 amount, address token, address receiver) =
            abi.decode(any2EvmMessage.data, (string, uint256, address, address));

        if (any2EvmMessage.destTokenAmounts.length > 0) {
            s_lastReceivedToken = any2EvmMessage.destTokenAmounts[0].token;
            s_lastReceivedAmount = any2EvmMessage.destTokenAmounts[0].amount;
        }

        _executeAction(lastReceivedAction, token, amount, receiver, uint64(any2EvmMessage.sourceChainSelector));

        emit FundsReceived(
            any2EvmMessage.messageId, any2EvmMessage.sourceChainSelector, s_lastReceivedToken, s_lastReceivedAmount
        );
    }

    /// @notice Sends a cross-chain message with tokens back to the source chain
    /// @param _destinationChain The destination chain selector
    /// @param _receiver The receiver address on the destination chain
    /// @param _data The encoded message data
    /// @param _token The token address to transfer
    /// @param _amount The amount of tokens to transfer
    /// @return messageId The CCIP message ID
    function _sendCrossChainMessage(
        uint64 _destinationChain,
        address _receiver,
        bytes memory _data,
        address _token,
        uint256 _amount
    ) internal returns (bytes32 messageId) {
        Client.EVM2AnyMessage memory message =
            _buildCCIPMessage(_receiver, _data, _token, _amount, address(s_linkToken));

        uint256 fees = s_router.getFee(_destinationChain, message);

        if (fees > s_linkToken.balanceOf(address(this))) {
            revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);
        }

        s_linkToken.approve(address(s_router), fees);
        IERC20(_token).approve(address(s_router), _amount);

        messageId = s_router.ccipSend(_destinationChain, message);

        return messageId;
    }

    /// @notice Builds a CCIP message for cross-chain communication
    /// @param _receiver The receiver address on the destination chain
    /// @param _data The encoded message data
    /// @param _token The token address to transfer
    /// @param _amount The amount of tokens to transfer
    /// @param _feeToken The token to pay fees with (LINK)
    /// @return The constructed CCIP message
    function _buildCCIPMessage(
        address _receiver,
        bytes memory _data,
        address _token,
        uint256 _amount,
        address _feeToken
    ) internal pure returns (Client.EVM2AnyMessage memory) {
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({token: _token, amount: _amount});

        return Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver),
            data: _data,
            tokenAmounts: tokenAmounts,
            extraArgs: Client._argsToBytes(
                Client.GenericExtraArgsV2({gasLimit: CCIP_GAS_LIMIT, allowOutOfOrderExecution: true})
            ),
            feeToken: _feeToken
        });
    }

    /// @notice Executes the action specified in the CCIP message
    /// @param _action The action to execute ("DEPLOY_FUNDS" or "WITHDRAW_FUNDS")
    /// @param _token The token address involved in the action
    /// @param _amount The amount of tokens involved
    /// @param receiver The receiver address for withdrawals
    /// @param sourceChain The source chain selector
    function _executeAction(
        string memory _action,
        address _token,
        uint256 _amount,
        address receiver,
        uint64 sourceChain
    ) internal {
        if (keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("DEPLOY_FUNDS"))) {
            _deployToDefaultProtocol(_token, _amount);
        } else if (keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("WITHDRAW_FUNDS"))) {
            _withdrawFromProtocols(_token, _amount);
            _withdrawFundsToSourceChain(_amount, sourceChain, _token, receiver);
        } else {
            revert InvalidAction(_action);
        }
    }

    /*//////////////////////////////////////////////////////////////
                           YIELD DEPLOYMENT
    //////////////////////////////////////////////////////////////*/

    /// @notice Deploys funds to the default high-yield protocol
    /// @dev Selects the best protocol and stakes the tokens
    /// @param _token The token address to deploy
    /// @param _amount The amount of tokens to deploy
    function _deployToDefaultProtocol(address _token, uint256 _amount) internal {
        address bestProtocol = _getBestProtocol(_token);
        if (bestProtocol == address(0)) revert ProtocolNotSupported(address(0));

        _stakeInProtocol(bestProtocol, _token, _amount);
    }

    /// @notice Stakes tokens in a specific ERC4626 protocol
    /// @dev Deposits tokens into the vault and tracks staked amounts
    /// @param _protocol The protocol address to stake in
    /// @param _token The token address to stake
    /// @param _amount The amount of tokens to stake
    function _stakeInProtocol(address _protocol, address _token, uint256 _amount) internal {
        if (!supportedProtocols[_protocol]) revert ProtocolNotSupported(_protocol);
        if (_amount == 0) revert InvalidAmount(_amount);

        IERC20(_token).safeIncreaseAllowance(_protocol, _amount);

        IERC4626(_protocol).deposit(_amount, address(this));

        stakedAmounts[_protocol][_token] += _amount;

        emit FundsStaked(_protocol, _token, _amount, block.timestamp);
    }

    /// @notice Selects the best protocol for a given token
    /// @dev Currently returns the default protocol, future versions will compare yields
    /// @param _token The token address to find a protocol for
    /// @return The best protocol address for the token
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

    /// @notice Withdraws funds from the default protocol
    /// @dev Redeems shares from the ERC4626 vault
    /// @param _token The token address to withdraw
    /// @param _amount The amount of tokens to withdraw
    function _withdrawFromProtocols(address _token, uint256 _amount) internal {
        uint256 sharesRedeemed = IERC4626(protocol).withdraw(_amount, address(this), address(this));
        emit FundsWithdrawn(protocol, _token, _amount, sharesRedeemed);
    }

    /// @notice Sends withdrawn funds back to the source chain via CCIP
    /// @param _amount The amount of tokens to send back
    /// @param _destinationChain The destination chain selector
    /// @param _token The token address to send
    /// @param receiver The receiver address on the destination chain
    /// @return messageId The CCIP message ID
    function _withdrawFundsToSourceChain(uint256 _amount, uint64 _destinationChain, address _token, address receiver)
        internal
        onlyAllowlistedChain(_destinationChain)
        returns (bytes32)
    {
        bytes memory data = abi.encode("WITHDRAWAL_FUNDS", 0, 0, 0);
        bytes32 messageId = _sendCrossChainMessage(_destinationChain, receiver, data, _token, _amount);

        return messageId;
    }

    /// @notice External function to withdraw funds and send them to source chain
    /// @dev Can be called by anyone but only sends to allowlisted chains
    /// @param _destinationChainSelector The destination chain selector
    /// @param _amount The amount of tokens to withdraw and send
    /// @param _token The token address to withdraw
    /// @param receiver The receiver address on the destination chain
    /// @return messageId The CCIP message ID
    function withdrawFundsToSourceChain(
        uint64 _destinationChainSelector,
        uint256 _amount,
        address _token,
        address receiver
    ) external onlyAllowlistedChain(_destinationChainSelector) returns (bytes32) {
        if (!supportedProtocols[protocol]) revert ProtocolNotSupported(protocol);
        if (_amount == 0) revert InvalidAmount(_amount);

        if (IERC20(_token).balanceOf(address(this)) < _amount) {
            _withdrawFromProtocols(_token, _amount);
        }

        bytes32 messageId = _withdrawFundsToSourceChain(_amount, _destinationChainSelector, _token, receiver);

        emit FundsWithdrawn(protocol, _token, _amount, 0);
        return messageId;
    }

    /*//////////////////////////////////////////////////////////////
                             VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Gets the details of the last received CCIP message
    /// @dev Used for debugging and monitoring purposes
    /// @return messageId The message ID of the last received message
    /// @return action The action that was requested in the last message
    /// @return token The token address in the last message
    /// @return amount The amount in the last message
    function getLastReceivedMessageDetails()
        public
        view
        returns (bytes32 messageId, string memory action, address token, uint256 amount)
    {
        return (s_lastReceivedMessageId, s_lastReceivedAction, s_lastReceivedToken, s_lastReceivedAmount);
    }

    /// @notice Gets the total staked amount for a specific protocol and token
    /// @param _protocol The protocol address to query
    /// @param _token The token address to query
    /// @return The total amount staked in the protocol for the token
    function getStakedAmount(address _protocol, address _token) external view returns (uint256) {
        return stakedAmounts[_protocol][_token];
    }

    /// @notice Gets the total yield earned for a specific protocol and token
    /// @param _protocol The protocol address to query
    /// @param _token The token address to query
    /// @return The total yield earned from the protocol for the token
    function getYieldEarned(address _protocol, address _token) external view returns (uint256) {
        return yieldEarned[_protocol][_token];
    }

    /*//////////////////////////////////////////////////////////////
                           EMERGENCY FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emergency withdrawal of any ERC20 token
    /// @dev Only the contract owner can call this function
    /// @param _token The token address to withdraw
    /// @param _to The address to send the tokens to
    function emergencyWithdraw(address _token, address _to) external onlyOwner {
        uint256 balance = IERC20(_token).balanceOf(address(this));
        IERC20(_token).safeTransfer(_to, balance);
    }

    /// @notice Emergency withdrawal of native ETH
    /// @dev Only the contract owner can call this function
    /// @param _to The address to send the ETH to
    function emergencyWithdrawEth(address _to) external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success,) = _to.call{value: balance}("");
        if (!success) revert EthTransferFailed();
    }

    /// @notice Allows the contract to receive ETH
    /// @dev Used for gas refunds and other ETH transfers
    receive() external payable {}
}
