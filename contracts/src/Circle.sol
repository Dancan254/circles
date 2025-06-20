// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {VRFConsumerBaseV2Plus} from "src/libraries/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "src/libraries/VRFV2PlusClient.sol";

contract Circle is AccessControl, VRFConsumerBaseV2Plus {
    struct RequestStatus {
        bool fulfilled;
        bool exists;
        uint256[] randomWords;
    }

    mapping(uint256 => RequestStatus) public s_requests;

    using SafeERC20 for IERC20;

    error InvalidAmount(uint256 amount);
    error PayoutPeriodNotReached(uint256 lastPayoutDate, uint256 payoutPeriod);

    IERC20 circleToken; // we plan to use usdc for that

    mapping(address => uint256) public contributions;
    mapping(address => uint256) public withdrawableAmount;
    mapping(address => uint256) public approvalCount;

    address[] public members;
    address[] public pendingMembers;
    address[] remainingRecipientsInRound;
    uint256 lastPayoutDate;
    uint256 contributionAmount;

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

    constructor(IERC20 _circleToken, uint256 _contributionAmount, uint256 subscriptionId)
        VRFConsumerBaseV2Plus(0x5C210eF41CD1a72de73bF76eC39637bB0d3d7BEE)
    {
        circleToken = _circleToken;
        contributionAmount = _contributionAmount;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CIRCLER, msg.sender);
        members.push(msg.sender);

        s_subscriptionId = subscriptionId;
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
    }

    function withdraw(uint256 _amount) external {
        uint256 withdrawable = withdrawableAmount[msg.sender];
        if (_amount > withdrawable) revert InvalidAmount(_amount);
        withdrawableAmount[msg.sender] -= _amount;
        circleToken.safeTransfer(msg.sender, _amount);
    }

    function joinCircle() external {
        // we want a member to be able to join if they have reached an approval threshold from current members of 1/n of current members
        if (approvalCount[msg.sender] >= members.length / 4) {
            _grantRole(CIRCLER, msg.sender);
            approvalCount[msg.sender] = 0;
            for (uint256 i; i < pendingMembers.length; i++) {
                if (pendingMembers[i] == msg.sender) {
                    pendingMembers[i] = pendingMembers[pendingMembers.length - 1];
                    pendingMembers.pop();
                    break;
                }
            }
        }
    }

    function approveMember(address _member) external onlyRole(CIRCLER) {
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

    // @param enableNativePayment: Set to `true` to enable payment in native tokens, or
    // `false` to pay in LINK
    function requestRandomWords(bool enableNativePayment) external returns (uint256 requestId) {
        if (getNextPayoutDate() > block.timestamp) {
            revert PayoutPeriodNotReached(lastPayoutDate, payoutPeriod);
        }
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
}
