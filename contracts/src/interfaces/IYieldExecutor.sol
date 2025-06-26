// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ILogAutomation, Log} from "lib/chainlink-evm/contracts/src/v0.8/automation/interfaces/ILogAutomation.sol";

/**
 * @title IYieldExecutor
 * @author Circle Protocol Team
 * @notice Interface for the YieldExecutor contract that executes yield strategies on destination chains
 * @dev Defines the contract interface for receiving cross-chain messages and deploying funds
 *      to yield-generating protocols on destination chains via Chainlink CCIP.
 */
interface IYieldExecutor is ILogAutomation {
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

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event FundsReceived(bytes32 indexed messageId, uint64 indexed sourceChain, address indexed token, uint256 amount);
    event FundsStaked(address indexed protocol, address indexed token, uint256 amount, uint256 timestamp);
    event FundsWithdrawn(address indexed protocol, address indexed token, uint256 amount, uint256 yield);
    event YieldHarvested(address indexed protocol, address indexed token, uint256 yieldAmount);
    event ProtocolUpdated(address indexed protocol, bool supported);
    event DispatcherUpdated(uint64 indexed chainSelector, address dispatcher);
    event WithdrawalRequested(
        address indexed token, uint256 indexed amount, address indexed receiver, uint64 sourceChain
    );

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Get allowlist status for a source chain
    function allowlistedSourceChains(uint64) external view returns (bool);

    /// @notice Get authorized dispatcher for a source chain
    function authorizedDispatchers(uint64) external view returns (address);

    /// @notice Get support status for a yield protocol
    function supportedProtocols(address) external view returns (bool);

    /// @notice Get staked amounts per protocol and token
    function stakedAmounts(address protocol, address token) external view returns (uint256);

    /// @notice Get yield earned per protocol and token
    function yieldEarned(address protocol, address token) external view returns (uint256);

    /// @notice Get last received message details
    function getLastReceivedMessageDetails()
        external
        view
        returns (bytes32 messageId, string memory action, address token, uint256 amount);

    /// @notice Get total staked amount for a protocol and token
    function getStakedAmount(address _protocol, address _token) external view returns (uint256);

    /// @notice Get total yield earned for a protocol and token
    function getYieldEarned(address _protocol, address _token) external view returns (uint256);

    /*//////////////////////////////////////////////////////////////
                            ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Update allowlist status for a source chain
    /// @param _sourceChainSelector The chain selector to update
    /// @param _allowed Whether the chain should be allowed
    function allowlistSourceChain(uint64 _sourceChainSelector, bool _allowed) external;

    /// @notice Set authorized YieldDispatcher for a specific source chain
    /// @param _sourceChainSelector The source chain selector
    /// @param _dispatcher The YieldDispatcher contract address
    function setAuthorizedDispatcher(uint64 _sourceChainSelector, address _dispatcher) external;

    /// @notice Update supported protocol status
    /// @param _protocol The protocol address to update
    /// @param _supported Whether the protocol should be supported
    function setSupportedProtocol(address _protocol, bool _supported) external;

    /// @notice Set the default yield protocol
    /// @param _protocol The protocol address
    function setProtocol(address _protocol) external;

    /*//////////////////////////////////////////////////////////////
                         WITHDRAWAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Withdraw funds to source chain
    /// @param _destinationChain The destination chain selector
    /// @param _amount The amount to withdraw
    /// @param _token The token address
    /// @param reciever The receiver address
    /// @return messageId The CCIP message ID
    function withdrawFundsToSourceChain(uint64 _destinationChain, uint256 _amount, address _token, address reciever)
        external
        returns (bytes32 messageId);

    /*//////////////////////////////////////////////////////////////
                         EMERGENCY FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emergency withdrawal of tokens
    /// @param _token The token address to withdraw
    /// @param _to The address to send tokens to
    function emergencyWithdraw(address _token, address _to) external;

    /// @notice Emergency withdrawal of ETH
    /// @param _to The address to send ETH to
    function emergencyWithdrawEth(address _to) external;

    /*//////////////////////////////////////////////////////////////
                      CHAINLINK AUTOMATION
    //////////////////////////////////////////////////////////////*/

    /// @notice Check if log-triggered upkeep is needed for withdrawal automation
    /// @param log The log data from the WithdrawalRequested event
    /// @param checkData Additional check data
    /// @return upkeepNeeded Whether upkeep should be performed
    /// @return performData Encoded data to pass to performUpkeep
    function checkLog(Log calldata log, bytes memory checkData)
        external
        pure
        returns (bool upkeepNeeded, bytes memory performData);

    /// @notice Perform the withdrawal automation upkeep
    /// @param performData Encoded withdrawal parameters
    function performUpkeep(bytes calldata performData) external;
}
