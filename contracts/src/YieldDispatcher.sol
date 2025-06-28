// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IRouterClient} from "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";
import {IERC20BurnMint, IERC20} from "src/interfaces/IERC20BurnMint.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {OwnerIsCreator} from "@chainlink/contracts/src/v0.8/shared/access/OwnerIsCreator.sol";
import {IERC4626} from "@openzeppelin/contracts/interfaces/IERC4626.sol";
import {IYieldDispatcher} from "src/interfaces/IYieldDispatcher.sol";

/**
 * @title YieldDispatcher
 * @notice Manages fund deployment across same-chain and cross-chain yield strategies
 * @dev Receives idle funds from Circle contracts and routes them to appropriate yield protocols
 */
contract YieldDispatcher is OwnerIsCreator {
    using SafeERC20 for IERC20;

    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);
    error DestinationChainNotAllowed(uint64 destinationChainSelector);
    error InvalidExecutorAddress();
    error InvalidAmount(uint256 amount);
    error ProtocolNotSupported(address protocol);
    error SameChainDeploymentFailed();

    event FundsDeployedLocally(address indexed protocol, uint256 amount, uint256 timestamp);
    event FundsDeployedCrossChain(
        bytes32 indexed messageId, uint64 indexed destinationChain, address executor, uint256 amount, uint256 fees
    );
    event YieldCollected(address indexed protocol, uint256 amount);
    event ExecutorUpdated(uint64 indexed chainSelector, address oldExecutor, address newExecutor);
    event ChainAllowlistUpdated(uint64 indexed chainSelector, bool allowed);
    event CircleAuthorized(address indexed circle, bool authorized);

    address public s_testUsdcToken;
    IERC20 private immutable s_linkToken;
    IRouterClient private immutable s_router;

    mapping(uint64 => address) public chainExecutors;
    mapping(uint64 => bool) public allowlistedChains;
    mapping(address => bool) public supportedProtocols;
    mapping(uint64 => uint256) public deployedCapital;
    mapping(address => bool) public authorizedCircles;

    uint256 private constant CCIP_GAS_LIMIT = 2_500_000;

    constructor(address _router, address _link, address _testUsdcToken) {
        s_router = IRouterClient(_router);
        s_linkToken = IERC20(_link);
        s_testUsdcToken = _testUsdcToken;
    }

    modifier onlyAllowlistedChain(uint64 _chainSelector) {
        if (!allowlistedChains[_chainSelector]) {
            revert DestinationChainNotAllowed(_chainSelector);
        }
        _;
    }

    modifier onlyAuthorizedCircle() {
        require(authorizedCircles[msg.sender], "Unauthorized circle");
        _;
    }

    /*//////////////////////////////////////////////////////////////
                           ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Set YieldExecutor contract address for a specific chain
     * @param _chainSelector The chain selector for the destination chain
     * @param _executor The address of the YieldExecutor contract
     */
    function setChainExecutor(uint64 _chainSelector, address _executor) external onlyOwner {
        if (_executor == address(0)) revert InvalidExecutorAddress();

        address oldExecutor = chainExecutors[_chainSelector];
        chainExecutors[_chainSelector] = _executor;

        emit ExecutorUpdated(_chainSelector, oldExecutor, _executor);
    }

    /**
     * @notice Update allowlist status for a destination chain
     * @param _chainSelector The chain selector to update
     * @param _allowed Whether the chain should be allowed
     */
    function allowlistChain(uint64 _chainSelector, bool _allowed) external onlyOwner {
        allowlistedChains[_chainSelector] = _allowed;
        emit ChainAllowlistUpdated(_chainSelector, _allowed);
    }

    /**
     * @notice Update supported protocol status for local deployments
     * @param _protocol The protocol address to update
     * @param _supported Whether the protocol should be supported
     */
    function setSupportedProtocol(address _protocol, bool _supported) external onlyOwner {
        supportedProtocols[_protocol] = _supported;
    }

    /**
     * @notice Authorize a Circle contract to deposit funds
     * @param _circle The Circle contract address
     * @param _authorized Whether the Circle should be authorized
     */
    function authorizeCircle(address _circle, bool _authorized) external onlyOwner {
        authorizedCircles[_circle] = _authorized;
        emit CircleAuthorized(_circle, _authorized);
    }

    /**
     * @notice Set the test USDC token address
     * @param _tokenAddress The address of the test USDC token
     */
    function setTestUsdcToken(address _tokenAddress) external onlyOwner {
        require(_tokenAddress != address(0), "Invalid token address");
        s_testUsdcToken = _tokenAddress;
    }

    /*//////////////////////////////////////////////////////////////
                           DEPLOYMENT FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Deploy funds to yield protocol (same chain or cross-chain)
     * @param _amount Amount of tokens to deploy
     * @param _destinationChain Chain selector (0 for same chain)
     * @param _protocol Protocol address for same-chain deployment
     * @dev Only authorized Circle contracts can call this function
     */
    function deployFunds(uint256 _amount, uint64 _destinationChain, address _protocol) external onlyAuthorizedCircle {
        if (_amount == 0) revert InvalidAmount(_amount);

        if (_destinationChain == 0) {
            _deployFundsLocally(_amount, _protocol);
        } else {
            _deployFundsCrossChain(_amount, _destinationChain);
        }
    }

    /**
     * @notice Deploy funds to local yield protocol on same chain
     * @param _amount Amount of tokens to deploy
     * @param _protocol Protocol address
     * @dev Integrates with local yield protocols like Aave or Compound
     */
    function _deployFundsLocally(uint256 _amount, address _protocol) internal {
        if (!supportedProtocols[_protocol]) revert ProtocolNotSupported(_protocol);

        IERC20(s_testUsdcToken).safeTransferFrom(msg.sender, address(this), _amount);
        IERC20(s_testUsdcToken).safeIncreaseAllowance(_protocol, _amount);

        // TODO: Implement actual protocol integration (Aave, Compound, etc.)
        IERC4626(_protocol).deposit(_amount, address(this));

        emit FundsDeployedLocally(_protocol, _amount, block.timestamp);
    }

    /**
     * @notice Deploy funds to cross-chain yield protocol via CCIP
     * @param _amount Amount of tokens to deploy
     * @param _destinationChain Destination chain selector
     * @dev Sends tokens and message via Chainlink CCIP
     */
    function _deployFundsCrossChain(uint256 _amount, uint64 _destinationChain)
        internal
        onlyAllowlistedChain(_destinationChain)
    {
        address executor = chainExecutors[_destinationChain];
        if (executor == address(0)) revert InvalidExecutorAddress();

        IERC20(s_testUsdcToken).safeIncreaseAllowance(address(this), _amount);
        IERC20(s_testUsdcToken).safeTransferFrom(msg.sender, address(this), _amount);

        bytes memory data = abi.encode("DEPLOY_FUNDS", _amount, s_testUsdcToken, address(0));
        (bytes32 messageId, uint256 fees) =
            _sendCrossChainMessage(_destinationChain, executor, data, s_testUsdcToken, _amount);

        deployedCapital[_destinationChain] += _amount;
        emit FundsDeployedCrossChain(messageId, _destinationChain, executor, _amount, fees);
    }

    /**
     * @notice Send cross-chain message via CCIP
     * @param _destinationChain Destination chain selector
     * @param _receiver Receiver address on destination chain
     * @param _data Message data
     * @param _token Token address
     * @param _amount Token amount
     * @return messageId CCIP message ID
     * @return fees CCIP fees paid
     */
    function _sendCrossChainMessage(
        uint64 _destinationChain,
        address _receiver,
        bytes memory _data,
        address _token,
        uint256 _amount
    ) internal returns (bytes32 messageId, uint256 fees) {
        Client.EVM2AnyMessage memory message =
            _buildCCIPMessage(_receiver, _data, _token, _amount, address(s_linkToken));

        fees = s_router.getFee(_destinationChain, message);

        if (fees > s_linkToken.balanceOf(address(this))) {
            revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);
        }

        s_linkToken.safeIncreaseAllowance(address(s_router), fees);
        IERC20(_token).safeIncreaseAllowance(address(s_router), _amount);

        messageId = s_router.ccipSend(_destinationChain, message);
        return (messageId, fees);
    }

    /**
     * @notice Build CCIP message structure
     * @param _receiver Receiver address
     * @param _data Message data
     * @param _token Token address
     * @param _amount Token amount
     * @param _feeToken Fee token address
     * @return CCIP message structure
     */
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

    /*//////////////////////////////////////////////////////////////
                           WITHDRAWAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Request funds withdrawal from cross-chain deployment
     * @param _destinationChain Chain where funds are deployed
     * @param _amount Amount to withdraw
     * @param _recipient Address to receive withdrawn funds
     * @dev Sends withdrawal request to YieldExecutor on destination chain
     */
    function requestWithdrawal(uint64 _destinationChain, uint256 _amount, address _recipient, address _protocol)
        external
    {
        // if (_amount > deployedCapital[_destinationChain]) revert InvalidAmount(_amount);
        if (_destinationChain == 0) {
            IERC4626(_protocol).withdraw(_amount, _recipient, address(this));
            return;
        }

        address executor = chainExecutors[_destinationChain];
        if (executor == address(0)) revert InvalidExecutorAddress();

        bytes memory data = abi.encode("WITHDRAW_FUNDS", _amount, s_testUsdcToken, _recipient);

        IERC20(s_testUsdcToken).safeIncreaseAllowance(address(this), 1);
        IERC20(s_testUsdcToken).safeTransferFrom(msg.sender, address(this), 1);
        _sendCrossChainMessage(_destinationChain, executor, data, s_testUsdcToken, 1);

        // Note: deployedCapital updated when funds actually return
    }

    /*//////////////////////////////////////////////////////////////
                           VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Get deployed capital on specific chain
     * @param _chainSelector Chain selector to query
     * @return Amount of deployed capital on the specified chain
     */
    function getDeployedCapitalOnChain(uint64 _chainSelector) external view returns (uint256) {
        return deployedCapital[_chainSelector];
    }

    /*//////////////////////////////////////////////////////////////
                           EMERGENCY FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Emergency withdrawal of ETH
     * @param _to Address to send ETH to
     */
    function emergencyWithdrawEth(address _to) external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success,) = _to.call{value: balance}("");
        require(success, "ETH transfer failed");
    }

    /**
     * @notice Emergency withdrawal of tokens
     * @param _token Token address to withdraw
     * @param _to Address to send tokens to
     */
    function emergencyWithdrawToken(address _token, address _to) external onlyOwner {
        uint256 balance = IERC20(_token).balanceOf(address(this));
        IERC20(_token).safeTransfer(_to, balance);
    }

    /**
     * @notice Receive ETH for CCIP fees
     */
    receive() external payable {}
}
