// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Circle} from "src/Circle.sol";
import {BurnMintUsdc} from "src/TestUsdc.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {VRFCoordinatorV2PlusMock} from "test/mocks/VRFCoordinatorV2PlusMock.sol";
import {IYieldDispatcher} from "src/interfaces/IYieldDispatcher.sol";

// We need to do fork tests for this due to the VRF aspect
contract CircleTest is Test {
    Circle circle;
    BurnMintUsdc usdc;
    uint256 subscriptionId;
    bytes32 SALT = keccak256("CircleTest");
    VRFCoordinatorV2PlusMock vrfCoordinator;
    // This is not yet declayed
    IYieldDispatcher yieldDispatcher;

    uint96 public MOCK_BASE_FEE = 0.001 ether;
    uint96 public MOCK_GAS_PRICE_LINK = 1e9;

    address bob = makeAddr("bob");
    address alice = makeAddr("alice");
    address charlie = makeAddr("charlie");

    function setUp() external {
        vm.startPrank(bob);
        vrfCoordinator = new VRFCoordinatorV2PlusMock(MOCK_BASE_FEE, MOCK_GAS_PRICE_LINK);
        subscriptionId = vrfCoordinator.createSubscription();
        vrfCoordinator.fundSubscription(subscriptionId, 10 ether);

        // string memory FUJI_RPC_URL = vm.envString("AVALANCHE_FUJI_RPC_URL");
        // subscriptionId = vm.envUint("SUBSCRIPTION_ID");

        // vm.createSelectFork(FUJI_RPC_URL);

        usdc = new BurnMintUsdc();

        bytes memory constructorArgs =
            abi.encode(IERC20(usdc), uint256(10e18), uint256(subscriptionId), address(vrfCoordinator));
        bytes32 initCodeHash = keccak256(abi.encodePacked(type(Circle).creationCode, constructorArgs));
        address expectedCircleAddress = vm.computeCreate2Address(SALT, initCodeHash, bob);
        vrfCoordinator.addConsumer(subscriptionId, expectedCircleAddress);

        circle = new Circle{salt: SALT}(
            IERC20(usdc), uint256(10e18), uint256(subscriptionId), address(vrfCoordinator), address(yieldDispatcher)
        );
        vm.stopPrank();

        require(address(circle) == expectedCircleAddress, "Circle address mismatch");

        vm.deal(bob, 1 ether);
        deal(address(usdc), bob, 10000e18);
        deal(address(usdc), alice, 10000e18);
        deal(address(usdc), charlie, 10000e18);
    }

    modifier contribute() {
        vm.startPrank(bob);
        uint256 balanceBefore = usdc.balanceOf(bob);
        usdc.approve(address(circle), 10e18);
        circle.contribute(10e18);
        uint256 balanceAfter = usdc.balanceOf(bob);
        vm.stopPrank();
        assertEq(balanceBefore - balanceAfter, 10e18);
        assertEq(usdc.balanceOf(address(circle)), 10e18);
        _;
    }

    modifier requestRandomNumber() {
        vm.startPrank(bob);
        usdc.approve(address(circle), 10e18);
        circle.contribute(10e18);

        // Ensure the contract has enough balance to pay for the VRF request
        assertEq(usdc.balanceOf(address(circle)), 10e18);

        // Request a random number
        uint256 requestId = circle.requestRandomWords(true);
        assertTrue(requestId > 0, "Request ID should be greater than zero");

        // Check that the request was recorded
        (bool fulfilled, bool exists) = circle.s_requests(requestId);
        assertTrue(exists, "Request should exist");
        assertFalse(fulfilled, "Request should not be fulfilled yet");

        vm.stopPrank();
        _;
    }

    function testContribute() external {
        vm.startPrank(bob);
        uint256 balanceBefore = usdc.balanceOf(bob);
        usdc.approve(address(circle), 10e18);
        circle.contribute(10e18);
        uint256 balanceAfter = usdc.balanceOf(bob);
        vm.stopPrank();
        assertEq(balanceBefore - balanceAfter, 10e18);
        assertEq(usdc.balanceOf(address(circle)), 10e18);
    }

    function testRequestRandomNumber() public {
        vm.startPrank(bob);
        usdc.approve(address(circle), 10e18);
        circle.contribute(10e18);

        // Ensure the contract has enough balance to pay for the VRF request
        assertEq(usdc.balanceOf(address(circle)), 10e18);

        // Request a random number
        uint256 requestId = circle.requestRandomWords(true);
        assertTrue(requestId > 0, "Request ID should be greater than zero");

        // Check that the request was recorded
        (bool fulfilled, bool exists) = circle.s_requests(requestId);
        assertTrue(exists, "Request should exist");
        assertFalse(fulfilled, "Request should not be fulfilled yet");

        vm.stopPrank();
    }

    function testSelectNextRecipientAndWithdraw() public requestRandomNumber {
        // vm.warp(1 days);
        // vm.roll(1 days);
        vrfCoordinator.fulfillRandomWords(circle.lastRequestId(), address(circle));

        (bool fullfilled,) = circle.s_requests(circle.lastRequestId());
        require(fullfilled, "Request should be fulfilled");

        vm.startPrank(bob);
        circle.selectNextRecipient();
        uint256 balanceBefore = usdc.balanceOf(bob);
        circle.withdraw(usdc.balanceOf(address(circle)));
        uint256 balanceAfter = usdc.balanceOf(bob);
        assertEq(balanceAfter - balanceBefore, 10e18);
        assertEq(usdc.balanceOf(address(circle)), 0);
    }

    function testCycleWithThreeMembers() public {
        // We should add them to the circle first
        vm.startPrank(bob);
        circle.approveMember(alice);
        circle.approveMember(charlie);
        vm.stopPrank();

        vm.prank(alice);
        circle.joinCircle();

        vm.prank(charlie);
        circle.joinCircle();

        // Bob contributes
        vm.startPrank(bob);
        usdc.approve(address(circle), 10e18);
        circle.contribute(10e18);
        vm.stopPrank();

        // Alice contributes
        vm.startPrank(alice);
        usdc.approve(address(circle), 10e18);
        circle.contribute(10e18);
        vm.stopPrank();

        // Charlie contributes
        vm.startPrank(charlie);
        usdc.approve(address(circle), 10e18);
        circle.contribute(10e18);
        vm.stopPrank();

        // Request random number
        uint256 requestId = circle.requestRandomWords(true);
        assertTrue(requestId > 0, "Request ID should be greater than zero");

        // Fulfill the request
        vrfCoordinator.fulfillRandomWords(requestId, address(circle));

        (bool fulfilled, uint256[] memory randomWord) = circle.getRequestStatus(requestId);
        require(fulfilled, "Request should be fulfilled");
        console.log("Random word:", randomWord[0]);

        // Select next recipient and withdraw
        vm.prank(bob);

        circle.selectNextRecipient();
        uint256 balanceBeforeBob = usdc.balanceOf(bob);
        uint256 balanceBeforeAlice = usdc.balanceOf(alice);
        uint256 balanceBeforeCharlie = usdc.balanceOf(charlie);
        address[] memory members = circle.getMembers();

        address successfulMember;
        bool found = false;

        for (uint256 i = 0; i < members.length && !found; i++) {
            address member = members[i];
            vm.prank(member);
            try circle.withdraw(10e18) {
                successfulMember = member;
                found = true;
            } catch {}
        }

        require(found, "No member was able to withdraw");

        // Verify the correct member received funds
        if (successfulMember == bob) {
            assertGt(usdc.balanceOf(bob), balanceBeforeBob, "Bob should receive funds");
        } else if (successfulMember == alice) {
            assertGt(usdc.balanceOf(alice), balanceBeforeAlice, "Alice should receive funds");
        } else if (successfulMember == charlie) {
            assertGt(usdc.balanceOf(charlie), balanceBeforeCharlie, "Charlie should receive funds");
        }

        assertEq(circle.getRemainingRecipientsInRound().length, 2);

        for (uint256 j; j < 2; j++) {
            uint256 requestId1 = circle.requestRandomWords(true);
            assertTrue(requestId1 > 0, "Request ID should be greater than zero");

            // Fulfill the request
            vrfCoordinator.fulfillRandomWords(requestId1, address(circle));

            (bool fulfilled1, uint256[] memory randomWord1) = circle.getRequestStatus(requestId1);
            require(fulfilled1, "Request should be fulfilled");
            console.log("Random word:", randomWord1[0]);

            // Select next recipient and withdraw
            vm.prank(bob);

            circle.selectNextRecipient();
            uint256 balanceBeforeBob1 = usdc.balanceOf(bob);
            uint256 balanceBeforeAlice1 = usdc.balanceOf(alice);
            uint256 balanceBeforeCharlie1 = usdc.balanceOf(charlie);
            address[] memory members1 = circle.getMembers();

            address successfulMember1;
            bool found1 = false;

            for (uint256 i = 0; i < members.length && !found1; i++) {
                address member = members1[i];
                vm.prank(member);
                try circle.withdraw(10e18) {
                    successfulMember1 = member;
                    found = true;
                } catch {}
            }

            require(found, "No member was able to withdraw");

            // Verify the correct member received funds
            if (successfulMember1 == bob) {
                assertGt(usdc.balanceOf(bob), balanceBeforeBob1, "Bob should receive funds");
            } else if (successfulMember1 == alice) {
                assertGt(usdc.balanceOf(alice), balanceBeforeAlice1, "Alice should receive funds");
            } else if (successfulMember1 == charlie) {
                assertGt(usdc.balanceOf(charlie), balanceBeforeCharlie1, "Charlie should receive funds");
            }
        }
        assertEq(circle.getRemainingRecipientsInRound().length, 0);
    }
}
