// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {VRFConsumerBaseV2Plus} from "src/libraries/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "src/libraries/VRFV2PlusClient.sol";
import {IYieldDispatcher} from "src/interfaces/IYieldDispatcher.sol";

contract Circle is AccessControl, VRFConsumerBaseV2Plus {
    struct RequestStatus {
        bool fulfilled;
        bool exists;
        uint256[] randomWords;
    }

    using SafeERC20 for IERC20;

    error InvalidAmount(uint256 amount);
    error InvalidWithdrawAmount(uint256 amount, uint256 withdrawable);
    error PayoutPeriodNotReached(uint256 lastPayoutDate, uint256 payoutPeriod);

    IERC20 circleToken; // we plan to use usdc for that

    mapping(address => uint256) public contributions;
    mapping(address => uint256) public withdrawableAmount;
    mapping(address => uint256) public approvalCount;
    mapping(uint256 => RequestStatus) public s_requests;

    address[] internal members;
    address[] public pendingMembers;
    address[] remainingRecipientsInRound;
    address public s_yieldDispatcher;
    uint256 lastPayoutDate;
    uint256 public contributionAmount;

    uint256 public s_subscriptionId;
    uint256[] public requestIds;
    uint256 public lastRequestId;

    uint256 public constant payoutPeriod = 30 days;
    uint32 public callbackGasLimit = 2_500_000; // for avalanche fuji
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 1;

    bytes32 public constant CIRCLER = keccak256("CIRCLER");
    bytes32 public keyHash = 0xc799bd1e3bd4d1a41cd4968997a4e03dfd2a3c7c04b695881138580163f42887;

    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);
    event SelectedRecipient(address recipient, uint256 amount);

    constructor(
        IERC20 _circleToken,
        uint256 _contributionAmount,
        uint256 subscriptionId,
        address _vrfCoordinator,
        address _yieldDispatcher
    ) VRFConsumerBaseV2Plus(_vrfCoordinator) {
        circleToken = _circleToken;
        contributionAmount = _contributionAmount;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CIRCLER, msg.sender);
        members.push(msg.sender);

        s_subscriptionId = subscriptionId;
        s_yieldDispatcher = _yieldDispatcher;
    }

    /*//////////////////////////////////////////////////////////////
                           EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function contribute(uint256 _amount) external onlyRole(CIRCLER) {
        // if (block.timestamp < lastPayoutDate + payoutPeriod) {} looking for a machanism to allow only one coribution per payout period from each member
        if (_amount == 0) revert InvalidAmount(_amount);
        if (_amount != contributionAmount) revert InvalidAmount(contributionAmount);
        contributions[msg.sender] += _amount;
        circleToken.safeTransferFrom(msg.sender, address(this), _amount);
    }

    function selectNextRecipient() external {
        if (remainingRecipientsInRound.length == 0) {
            for (uint256 i = 0; i < members.length; i++) {
                remainingRecipientsInRound.push(members[i]);
            }
        }

        // Select a random recipient from the remaining recipients
        uint256 randomIndex = s_requests[lastRequestId].randomWords[0] % remainingRecipientsInRound.length;
        address selectedRecipient = remainingRecipientsInRound[randomIndex];

        withdrawableAmount[selectedRecipient] += contributionAmount;

        lastPayoutDate = block.timestamp;

        // Remove the selected recipient from the remaining recipients
        remainingRecipientsInRound[randomIndex] = remainingRecipientsInRound[remainingRecipientsInRound.length - 1];
        remainingRecipientsInRound.pop();
        emit SelectedRecipient(selectedRecipient, contributionAmount);
    }

    function withdraw(uint256 _amount) external {
        uint256 withdrawable = withdrawableAmount[msg.sender];
        if (_amount > withdrawable) revert InvalidWithdrawAmount(_amount, withdrawable);
        if (circleToken.balanceOf(address(this)) < _amount) {
            _requestWithdrawal(0, _amount, msg.sender);
        }

        withdrawableAmount[msg.sender] -= _amount;
        contributions[msg.sender] -= _amount;
        circleToken.safeTransfer(msg.sender, _amount);
    }

    function joinCircle() external {
        require(!hasRole(CIRCLER, msg.sender), "Already a member of the circle");
        // we want a member to be able to join if they have reached an approval threshold from current members of 1/n of current members
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
        } else {
            revert("Not enough approvals to join the circle");
        }
    }

    function approveMember(address _member) external onlyRole(CIRCLER) {
        for (uint256 i = 0; i < pendingMembers.length; i++) {
            if (pendingMembers[i] == _member) {
                approvalCount[_member]++;
                return;
            }
        }
        pendingMembers.push(_member);
        approvalCount[_member]++;
    }

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
    }

    /**
     * @notice Deploys idle yield to the yield dispatcher.
     * @param _amount The amount of tokens to deploy.
     * @param _destinationChain The chain selector (0 for same chain).
     * @param _protocol The protocol address for same-chain deployment.
     * @dev This function transfers the specified amount of tokens to the yield dispatcher
     */
    function deployIdleYield(uint256 _amount, uint64 _destinationChain, address _protocol) external onlyRole(CIRCLER) {
        require(s_yieldDispatcher != address(0), "Yield dispatcher not set");
        require(_amount > 0, "Amount must be greater than zero");
        require(circleToken.balanceOf(address(this)) >= _amount, "Insufficient balance");

        // Call the yield dispatcher to deploy the idle yield
        IYieldDispatcher(s_yieldDispatcher).deployFunds(_amount, _destinationChain, _protocol);
    }

    function requestWithdrawal(uint64 _destinationChain, uint256 _amount, address _recipient)
        external
        onlyRole(CIRCLER)
    {
        _requestWithdrawal(_destinationChain, _amount, _recipient);
    }

    function _requestWithdrawal(uint64 _destinationChain, uint256 _amount, address _recipient) internal {
        require(s_yieldDispatcher != address(0), "Yield dispatcher not set");
        require(_amount > 0, "Amount must be greater than zero");

        // Call the yield dispatcher to request withdrawal
        IYieldDispatcher(s_yieldDispatcher).requestWithdrawal(_destinationChain, _amount, _recipient);
    }

    // @param enableNativePayment: Set to `true` to enable payment in native tokens, or
    // `false` to pay in LINK
    function requestRandomWords(bool enableNativePayment) external returns (uint256 requestId) {
        // if (getNextPayoutDate() > block.timestamp) {
        //     revert PayoutPeriodNotReached(lastPayoutDate, payoutPeriod);
        // }
        // Will revert if subscription is not set and funded.
        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment: enableNativePayment}))
            })
        );
        s_requests[requestId] = RequestStatus({randomWords: new uint256[](0), exists: true, fulfilled: false});
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(uint256 _requestId, uint256[] calldata _randomWords) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(_requestId, _randomWords);
    }

    function getRequestStatus(uint256 _requestId)
        external
        view
        returns (bool fulfilled, uint256[] memory randomWords)
    {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }

    function getNextPayoutDate() public view returns (uint256) {
        return lastPayoutDate + payoutPeriod; // Example: next payout in 30 days
    }

    function getMembers() external view returns (address[] memory) {
        return members;
    }

    function getRemainingRecipientsInRound() external view returns (address[] memory) {
        return remainingRecipientsInRound;
    }
}
