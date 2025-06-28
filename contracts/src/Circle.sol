// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {VRFConsumerBaseV2Plus} from "src/libraries/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "src/libraries/VRFV2PlusClient.sol";
import {IYieldDispatcher} from "src/interfaces/IYieldDispatcher.sol";

/**
 * @title Circle
 * @notice A decentralized rotating savings group (ROSCA) with cross-chain yield farming capabilities
 * @dev Implements member management, contributions, random payouts via VRF, and yield delegation
 */
contract Circle is AccessControl, VRFConsumerBaseV2Plus {
    using SafeERC20 for IERC20;

    struct RequestStatus {
        bool fulfilled;
        bool exists;
        uint256[] randomWords;
    }

    error InvalidAmount(uint256 amount);
    error InvalidWithdrawAmount(uint256 amount, uint256 withdrawable);
    error PayoutPeriodNotReached(uint256 lastPayoutDate, uint256 payoutPeriod);
    error InvalidLocalProtocol(address localProtocol);

    IERC20 public immutable circleToken;
    address public immutable s_yieldDispatcher;
    address public localProtocol;

    mapping(address => uint256) public contributions;
    mapping(address => uint256) public withdrawableAmount;
    mapping(address => uint256) public approvalCount;
    mapping(uint256 => RequestStatus) public s_requests;

    address[] internal members;
    address[] public pendingMembers;
    address[] internal remainingRecipientsInRound;

    uint256 public lastPayoutDate;
    uint256 public contributionAmount;
    uint256 public immutable s_subscriptionId;
    uint256[] public requestIds;
    uint256 public lastRequestId;

    uint256 public constant PAYOUT_PERIOD = 30 days;
    uint32 public constant CALLBACK_GAS_LIMIT = 2_500_000;
    uint16 public constant REQUEST_CONFIRMATIONS = 3;
    uint32 public constant NUM_WORDS = 1;

    bytes32 public constant CIRCLER = keccak256("CIRCLER");
    bytes32 public constant KEY_HASH = 0xc799bd1e3bd4d1a41cd4968997a4e03dfd2a3c7c04b695881138580163f42887;

    event RequestSent(uint256 indexed requestId, uint32 numWords);
    event RequestFulfilled(uint256 indexed requestId, uint256[] randomWords);
    event SelectedRecipient(address indexed recipient, uint256 amount);
    event ContributionMade(address indexed contributor, uint256 amount);
    event MemberApproved(address indexed member, uint256 approvalCount);
    event MemberJoined(address indexed member);
    event MemberLeft(address indexed member);

    constructor(
        IERC20 _circleToken,
        uint256 _contributionAmount,
        uint256 _subscriptionId,
        address _vrfCoordinator,
        address _yieldDispatcher
    ) VRFConsumerBaseV2Plus(_vrfCoordinator) {
        circleToken = _circleToken;
        contributionAmount = _contributionAmount;
        s_subscriptionId = _subscriptionId;
        s_yieldDispatcher = _yieldDispatcher;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CIRCLER, msg.sender);
        members.push(msg.sender);
    }

    /*//////////////////////////////////////////////////////////////
                           CONTRIBUTION FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Make a contribution to the circle
     * @param _amount Amount to contribute (must equal contributionAmount)
     * @dev Only circle members can contribute
     */
    function contribute(uint256 _amount) external onlyRole(CIRCLER) {
        if (_amount == 0) revert InvalidAmount(_amount);
        if (_amount != contributionAmount) revert InvalidAmount(contributionAmount);

        contributions[msg.sender] += _amount;
        circleToken.safeTransferFrom(msg.sender, address(this), _amount);

        emit ContributionMade(msg.sender, _amount);
    }

    /**
     * @notice Withdraw available funds from the circle
     * @param _amount Amount to withdraw
     * @dev Requests withdrawal from yield protocols if insufficient local balance
     */
    function withdraw(uint256 _amount) external {
        uint256 withdrawable = withdrawableAmount[msg.sender];
        if (_amount > withdrawable) revert InvalidWithdrawAmount(_amount, withdrawable);

        if (circleToken.balanceOf(address(this)) < _amount) {
            if (localProtocol == address(0)) {
                revert InvalidLocalProtocol(localProtocol);
            }
            _requestWithdrawal(0, _amount, msg.sender, localProtocol);
        }

        withdrawableAmount[msg.sender] -= _amount;
        contributions[msg.sender] -= _amount;
        circleToken.safeTransfer(msg.sender, _amount);
    }

    /*//////////////////////////////////////////////////////////////
                           MEMBER MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Join the circle after receiving sufficient approvals
     * @dev Requires 25% of current members to approve
     */
    function joinCircle() external {
        require(!hasRole(CIRCLER, msg.sender), "Already a member of the circle");

        if (approvalCount[msg.sender] >= members.length / 4) {
            _grantRole(CIRCLER, msg.sender);
            approvalCount[msg.sender] = 0;
            members.push(msg.sender);

            for (uint256 i; i < pendingMembers.length; i++) {
                if (pendingMembers[i] == msg.sender) {
                    pendingMembers[i] = pendingMembers[pendingMembers.length - 1];
                    pendingMembers.pop();
                    break;
                }
            }

            emit MemberJoined(msg.sender);
        } else {
            revert("Not enough approvals to join the circle");
        }
    }

    /**
     * @notice Approve a member to join the circle
     * @param _member Address of the member to approve
     * @dev Only existing circle members can approve new members
     */
    function approveMember(address _member) external onlyRole(CIRCLER) {
        bool memberExists = false;

        for (uint256 i = 0; i < pendingMembers.length; i++) {
            if (pendingMembers[i] == _member) {
                approvalCount[_member]++;
                memberExists = true;
                break;
            }
        }

        if (!memberExists) {
            pendingMembers.push(_member);
            approvalCount[_member]++;
        }

        emit MemberApproved(_member, approvalCount[_member]);
    }

    /**
     * @notice Leave the circle
     * @dev Cannot leave if you're the only member or have outstanding contributions
     */
    function leaveCircle() external onlyRole(CIRCLER) {
        require(members.length > 1, "Cannot leave circle with only one member");
        require(contributions[msg.sender] == 0, "Cannot leave circle with contributions");

        renounceRole(CIRCLER, msg.sender);

        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == msg.sender) {
                members[i] = members[members.length - 1];
                members.pop();
                break;
            }
        }

        emit MemberLeft(msg.sender);
    }

    /*//////////////////////////////////////////////////////////////
                           PAYOUT FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Select the next recipient for payout using VRF randomness
     * @dev Requires VRF request to be fulfilled first
     */
    function selectNextRecipient() external {
        if (remainingRecipientsInRound.length == 0) {
            for (uint256 i = 0; i < members.length; i++) {
                remainingRecipientsInRound.push(members[i]);
            }
        }

        uint256 randomIndex = s_requests[lastRequestId].randomWords[0] % remainingRecipientsInRound.length;
        address selectedRecipient = remainingRecipientsInRound[randomIndex];

        withdrawableAmount[selectedRecipient] += contributionAmount;
        lastPayoutDate = block.timestamp;

        remainingRecipientsInRound[randomIndex] = remainingRecipientsInRound[remainingRecipientsInRound.length - 1];
        remainingRecipientsInRound.pop();

        emit SelectedRecipient(selectedRecipient, contributionAmount);
    }

    /**
     * @notice Request random words from Chainlink VRF for recipient selection
     * @param enableNativePayment True to pay with native tokens, false to pay with LINK
     * @return requestId The VRF request ID
     */
    function requestRandomWords(bool enableNativePayment) external returns (uint256 requestId) {
        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: KEY_HASH,
                subId: s_subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATIONS,
                callbackGasLimit: CALLBACK_GAS_LIMIT,
                numWords: NUM_WORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment: enableNativePayment}))
            })
        );

        s_requests[requestId] = RequestStatus({randomWords: new uint256[](0), exists: true, fulfilled: false});
        requestIds.push(requestId);
        lastRequestId = requestId;

        emit RequestSent(requestId, NUM_WORDS);
        return requestId;
    }

    /**
     * @notice Callback function for VRF randomness fulfillment
     * @param _requestId The request ID
     * @param _randomWords Array of random words
     */
    function fulfillRandomWords(uint256 _requestId, uint256[] calldata _randomWords) internal override {
        require(s_requests[_requestId].exists, "Request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(_requestId, _randomWords);
    }

    /*//////////////////////////////////////////////////////////////
                           YIELD FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Deploy idle funds to yield farming protocols
     * @param _amount Amount of tokens to deploy
     * @param _destinationChain Chain selector (0 for same chain)
     * @param _protocol Protocol address for same-chain deployment
     * @dev Only circle members can deploy idle yield
     */
    function deployIdleYield(uint256 _amount, uint64 _destinationChain, address _protocol) external onlyRole(CIRCLER) {
        require(s_yieldDispatcher != address(0), "Yield dispatcher not set");
        require(_amount > 0, "Amount must be greater than zero");
        require(circleToken.balanceOf(address(this)) >= _amount, "Insufficient balance");

        circleToken.safeIncreaseAllowance(s_yieldDispatcher, _amount);
        IYieldDispatcher(s_yieldDispatcher).deployFunds(_amount, _destinationChain, _protocol);
    }

    /**
     * @notice Request withdrawal from yield farming protocols
     * @param _destinationChain Chain where funds are deployed
     * @param _amount Amount to withdraw
     * @param _recipient Address to receive withdrawn funds
     * @dev Only circle members can request withdrawals
     */
    function requestWithdrawal(uint64 _destinationChain, uint256 _amount, address _recipient, address _protocol)
        external
        onlyRole(CIRCLER)
    {
        circleToken.safeIncreaseAllowance(s_yieldDispatcher, 1);
        _requestWithdrawal(_destinationChain, _amount, _recipient, _protocol);
    }

    /**
     * @notice Internal function to request withdrawal from yield dispatcher
     * @param _destinationChain Chain where funds are deployed
     * @param _amount Amount to withdraw
     * @param _recipient Address to receive withdrawn funds
     */
    function _requestWithdrawal(uint64 _destinationChain, uint256 _amount, address _recipient, address _protocol)
        internal
    {
        require(s_yieldDispatcher != address(0), "Yield dispatcher not set");
        require(_amount > 0, "Amount must be greater than zero");

        IYieldDispatcher(s_yieldDispatcher).requestWithdrawal(_destinationChain, _amount, _recipient, _protocol);
    }

    function setLocalProtocol(address _protocol) external onlyRole(CIRCLER) {
        require(_protocol != address(0), "Invalid protocol address");
        localProtocol = _protocol;
    }

    /*//////////////////////////////////////////////////////////////
                           ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Change the contribution amount for the circle
     * @param _newAmount New contribution amount
     * @dev Only circle members can change the contribution amount
     */
    function changeContributionAmount(uint256 _newAmount) external onlyRole(CIRCLER) {
        require(_newAmount > 0, "Contribution amount must be greater than zero");
        contributionAmount = _newAmount;
    }

    /*//////////////////////////////////////////////////////////////
                           VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Get the status of a VRF request
     * @param _requestId The request ID
     * @return fulfilled Whether the request is fulfilled
     * @return randomWords Array of random words
     */
    function getRequestStatus(uint256 _requestId)
        external
        view
        returns (bool fulfilled, uint256[] memory randomWords)
    {
        require(s_requests[_requestId].exists, "Request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }

    /**
     * @notice Get the next payout date
     * @return Next payout timestamp
     */
    function getNextPayoutDate() public view returns (uint256) {
        return lastPayoutDate + PAYOUT_PERIOD;
    }

    /**
     * @notice Get all circle members
     * @return Array of member addresses
     */
    function getMembers() external view returns (address[] memory) {
        return members;
    }

    /**
     * @notice Get remaining recipients in the current round
     * @return Array of addresses yet to receive payout in current round
     */
    function getRemainingRecipientsInRound() external view returns (address[] memory) {
        return remainingRecipientsInRound;
    }
}
