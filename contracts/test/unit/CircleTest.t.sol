// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {Test} from "forge-std/Test.sol";
import {Circle} from "src/Circle.sol";
import {BurnMintUsdc} from "src/TestUsdc.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CircleTest is Test {
    Circle circle;
    BurnMintUsdc usdc;

    address bob = makeAddr("bob");

    function setUp() external {
        usdc = new BurnMintUsdc();
        vm.prank(bob);
        circle = new Circle(IERC20(usdc), uint256(10e18), 1);
        vm.deal(bob, 1 ether);
        deal(address(usdc), bob, 10000e18);
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

    function testAddingMembers() external {}
}
