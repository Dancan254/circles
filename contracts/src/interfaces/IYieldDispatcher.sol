// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IYieldDispatcher
 * @author Circle Protocol Team
 * @notice Interface for managing fund deployment across same-chain and cross-chain yield strategies
 * @dev Defines the contract interface for deploying Circle contribution funds to yield-generating
 *      protocols either locally or on other blockchains via Chainlink CCIP.
 */
interface IYieldDispatcher {
    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    // error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);
    // error DestinationChainNotAllowed(uint64 destinationChainSelector);
    // error InvalidExecutorAddress();
    // error InvalidAmount(uint256 amount);
    // error ProtocolNotSupported(address protocol);
    // error SameChainDeploymentFailed();

    // /*//////////////////////////////////////////////////////////////
    //                             EVENTS
    // //////////////////////////////////////////////////////////////*/

    // event FundsDeployedLocally(address indexed protocol, uint256 amount, uint256 timestamp);

    // event FundsDeployedCrossChain(
    //     bytes32 indexed messageId, uint64 indexed destinationChain, address executor, uint256 amount, uint256 fees
    // );

    // event YieldCollected(address indexed protocol, uint256 amount);

    // event ExecutorUpdated(uint64 indexed chainSelector, address oldExecutor, address newExecutor);

    // event ChainAllowlistUpdated(uint64 indexed chainSelector, bool allowed);

    /*//////////////////////////////////////////////////////////////
                           ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Set YieldExecutor contract address for a specific chain
    /// @param _chainSelector The chain selector for the destination chain
    /// @param _executor The address of the YieldExecutor contract
    function setChainExecutor(uint64 _chainSelector, address _executor) external;

    /// @notice Update allowlist status for a destination chain
    /// @param _chainSelector The chain selector to update
    /// @param _allowed Whether the chain should be allowed
    function allowlistChain(uint64 _chainSelector, bool _allowed) external;

    /// @notice Update supported protocol status for local deployments
    /// @param _protocol The protocol address to update
    /// @param _supported Whether the protocol should be supported
    function setSupportedProtocol(address _protocol, bool _supported) external;

    /// @notice Authorize a Circle contract to deposit funds
    /// @param _circle The Circle contract address
    /// @param _authorized Whether the Circle should be authorized
    function authorizeCircle(address _circle, bool _authorized) external;

    /*//////////////////////////////////////////////////////////////
                           DEPLOYMENT FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Deploy funds to yield protocol (same chain or cross-chain)
    /// @param _amount Amount of tokens to deploy
    /// @param _destinationChain Chain selector (0 for same chain)
    /// @param _protocol Protocol address for same-chain deployment
    function deployFunds(uint256 _amount, uint64 _destinationChain, address _protocol) external;

    /*//////////////////////////////////////////////////////////////
                           WITHDRAWAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Request funds withdrawal from cross-chain deployment
    /// @param _destinationChain Chain where funds are deployed
    /// @param _amount Amount to withdraw
    /// @param _recipient Address to receive the withdrawn funds
    function requestWithdrawal(uint64 _destinationChain, uint256 _amount, address _recipient, address _protocol)
        external;

    /*//////////////////////////////////////////////////////////////
                               VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Get deployed capital on specific chain
    /// @param _chainSelector Chain selector to query
    /// @return Amount of deployed capital on the specified chain
    function getDeployedCapitalOnChain(uint64 _chainSelector) external view returns (uint256);

    /*//////////////////////////////////////////////////////////////
                           EMERGENCY FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emergency withdrawal of ETH
    /// @param _to Address to send ETH to
    function emergencyWithdrawEth(address _to) external;

    /// @notice Emergency withdrawal of tokens
    /// @param _token Token address to withdraw
    /// @param _to Address to send tokens to
    function emergencyWithdrawToken(address _token, address _to) external;

    /*//////////////////////////////////////////////////////////////
                               STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    /// @notice Get the test USDC token address
    function s_testUsdcToken() external view returns (address);

    /// @notice Check if a chain executor is set for a specific chain
    /// @param chainSelector The chain selector
    /// @return executor The executor address
    function chainExecutors(uint64 chainSelector) external view returns (address executor);

    /// @notice Check if a destination chain is allowlisted
    /// @param chainSelector The chain selector
    /// @return allowed Whether the chain is allowed
    function allowlistedChains(uint64 chainSelector) external view returns (bool allowed);

    /// @notice Check if a protocol is supported for local deployments
    /// @param protocol The protocol address
    /// @return supported Whether the protocol is supported
    function supportedProtocols(address protocol) external view returns (bool supported);

    /// @notice Get deployed capital on a specific chain
    /// @param chainSelector The chain selector
    /// @return amount The deployed capital amount
    function deployedCapital(uint64 chainSelector) external view returns (uint256 amount);

    /// @notice Check if a Circle contract is authorized
    /// @param circle The Circle contract address
    /// @return authorized Whether the Circle is authorized
    function authorizedCircles(address circle) external view returns (bool authorized);
}
