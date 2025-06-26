// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {MockERC4626Vault} from "test/mocks/MockERC4626Vault.sol";
import {Test, console} from "forge-std/Test.sol";
import {BurnMintUsdc} from "src/TestUsdc.sol";

contract TestMockVault is Test {
    MockERC4626Vault vault;

    BurnMintUsdc asset;
    address alice = makeAddr("alice");

    function setUp() external {
        vm.startPrank(alice);
        asset = new BurnMintUsdc();
        vault = new MockERC4626Vault(address(asset));
        vm.stopPrank();
        vm.startPrank(0x1804c8AB1F12E6bbf3894d4083f33e07309d1f38);
        asset.grantMintAndBurnRoles(address(vault));
        asset.grantRole(0x0000000000000000000000000000000000000000000000000000000000000000, address(alice));
        vm.stopPrank();

        deal(address(asset), alice, 100000e18);
    }

    function testAccrueYield() external {
        vm.startPrank(alice);
        // First deposit some assets
        uint256 assetsToDeposit = 100e18;
        asset.approve(address(vault), assetsToDeposit);
        vault.deposit(assetsToDeposit, alice);

        uint256 initialBalance = vault.totalAssets();

        // Advance time to allow yield accrual
        vm.warp(block.timestamp + 1 days);
        vault.accrueYield();

        uint256 newBalance = vault.totalAssets();
        vm.stopPrank();

        assertGt(newBalance, initialBalance, "Yield should be accrued");
    }

    function testDepositAccruesYield() external {
        vm.startPrank(alice);
        uint256 assetsToDeposit = 100e18;
        asset.approve(address(vault), assetsToDeposit);
        vault.deposit(assetsToDeposit, alice);
        uint256 balanceAfterDeposit = vault.totalAssets();
        vm.warp(block.timestamp + 1 minutes);
        vm.roll(block.number + 1 minutes);
        vault.redeem(100e18, alice, alice);
        vm.stopPrank();
        uint256 finalBalance = asset.balanceOf(alice);
        console.log("Value Accrued", finalBalance - assetsToDeposit);
        console.log("Balance After withdrawal", vault.balanceOf(alice));

        assertEq(balanceAfterDeposit, assetsToDeposit, "Deposit should match deposited amount");
    }
}
