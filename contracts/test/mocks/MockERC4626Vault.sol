// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IMintable {
    function mint(address to, uint256 amount) external;
}

contract MockERC4626Vault is ERC4626 {
    uint256 private constant YIELD_RATE = 30; // 30% annual yield
    uint256 private constant SECONDS_PER_YEAR = 365 days;
    uint256 private _lastYieldTime;

    constructor(address _asset) ERC4626(IERC20(_asset)) ERC20("Mock Vault Token", "MVT") {
        _lastYieldTime = block.timestamp;
    }

    /**
     * @notice Accrues yield by minting new asset tokens to the vault
     * @dev Can be called by anyone to trigger yield accrual
     */
    function accrueYield() public {
        uint256 currentAssets = IERC20(asset()).balanceOf(address(this));
        if (currentAssets == 0) return;

        uint256 timeElapsed = block.timestamp - _lastYieldTime;
        if (timeElapsed == 0) return;

        // Simple but correct approach: Calculate yield since last accrual only
        // This prevents compound interest issues by only calculating on time since last accrual
        uint256 yieldAmount = (currentAssets * YIELD_RATE * timeElapsed) / (100 * SECONDS_PER_YEAR);

        if (yieldAmount > 0) {
            // Mint new tokens directly to the vault to simulate yield
            IMintable(asset()).mint(address(this), yieldAmount);
            _lastYieldTime = block.timestamp;
        }
    }

    /**
     * @notice Manually add yield for testing purposes
     * @param yieldAmount Amount of yield to add
     */
    function addYield(uint256 yieldAmount) external {
        if (yieldAmount > 0) {
            IMintable(asset()).mint(address(this), yieldAmount);
        }
    }

    /**
     * @notice Override deposit to accrue yield before deposit
     */
    function deposit(uint256 assets, address receiver) public override returns (uint256) {
        accrueYield();
        return super.deposit(assets, receiver);
    }

    /**
     * @notice Override mint to accrue yield before minting
     */
    function mint(uint256 shares, address receiver) public override returns (uint256) {
        accrueYield();
        return super.mint(shares, receiver);
    }

    /**
     * @notice Override withdraw to accrue yield before withdrawal
     */
    function withdraw(uint256 assets, address receiver, address owner) public override returns (uint256) {
        accrueYield();
        return super.withdraw(assets, receiver, owner);
    }

    /**
     * @notice Override redeem to accrue yield before redemption
     */
    function redeem(uint256 shares, address receiver, address owner) public override returns (uint256) {
        accrueYield();
        return super.redeem(shares, receiver, owner);
    }

    /**
     * @notice Get the current yield rate (30%)
     */
    function getYieldRate() external pure returns (uint256) {
        return YIELD_RATE;
    }

    /**
     * @notice Get time since last yield accrual
     */
    function getTimeSinceLastYield() external view returns (uint256) {
        return block.timestamp - _lastYieldTime;
    }
}
