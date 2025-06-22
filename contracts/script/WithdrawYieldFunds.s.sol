// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {YieldDispatcher} from "../src/YieldDispatcher.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {HelperConfig} from "./utils/HelperConfig.s.sol";
import {IYieldExecutor} from "src/interfaces/IYieldExecutor.sol";

/// @title WithdrawYieldFunds - Simple script to withdraw funds from Sepolia YieldExecutor back to Fuji
/// @notice This script calls the YieldDispatcher on Fuji to request withdrawal from YieldExecutor on Sepolia
contract WithdrawYieldFunds is Script {
    // Chain selectors
    uint64 public constant SEPOLIA_CHAIN_SELECTOR = 16015286601757825753;
    uint64 public constant FUJI_CHAIN_SELECTOR = 14767482510784806043;

    // Default amount to withdraw (5 USDC)
    uint256 public constant DEFAULT_AMOUNT = 0.5e18;

    function run() external {
        // Only works on Fuji
        require(block.chainid == 11155111, "This script must be run on Sepolia (11155111)");

        withdrawFunds(DEFAULT_AMOUNT);
    }

    /// @notice Withdraw a specific amount of funds from Sepolia back to Fuji
    /// @param _amount Amount of USDC to withdraw (in wei, 6 decimals)
    function withdrawFunds(uint256 _amount) public {
        console.log("=== WITHDRAWING FUNDS FROM SEPOLIA TO FUJI ===");

        // Get deployed contract addresses
        HelperConfig helperConfig = new HelperConfig();
        // address dispatcherAddress = helperConfig.FUJIDispatcher();
        address executorAddress = helperConfig.SEPOLIAExecutor();
        address tokenAddress = helperConfig.getTokenAddress();
        address _recipient = helperConfig.getTokenAdminAddress();

        // console.log("YieldDispatcher address:", dispatcherAddress);

        console.log("USDC token address:", tokenAddress);
        console.log("Amount to withdraw:", _amount);
        console.log("Recipient address:", _recipient);
        console.log("Source chain selector (Sepolia):", SEPOLIA_CHAIN_SELECTOR);

        // YieldDispatcher dispatcher = YieldDispatcher(payable(dispatcherAddress));
        IYieldExecutor executor = IYieldExecutor(executorAddress);
        IERC20 usdc = IERC20(tokenAddress);

        // Check deployed capital on Sepolia before withdrawal
        // uint256 deployedCapital = dispatcher.getDeployedCapitalOnChain(SEPOLIA_CHAIN_SELECTOR);
        // uint256 recipientBalanceBefore = usdc.balanceOf(_recipient);

        // console.log("Deployed capital on Sepolia:", deployedCapital);
        // console.log("Recipient USDC balance before:", recipientBalanceBefore);

        // require(deployedCapital >= _amount, "Insufficient deployed capital on Sepolia");

        vm.startBroadcast();

        // Request withdrawal from Sepolia YieldExecutor
        console.log("Requesting withdrawal from Sepolia...");
        // dispatcher.requestWithdrawal(SEPOLIA_CHAIN_SELECTOR, _amount, _recipient);
        executor.withdrawFundsToSourceChain(FUJI_CHAIN_SELECTOR, _amount, address(usdc), _recipient);

        vm.stopBroadcast();

        console.log("=== WITHDRAWAL REQUEST SENT ===");
        console.log("Withdrawal request has been sent to YieldExecutor on Sepolia!");
        console.log("The YieldExecutor will:");
        console.log("1. Withdraw funds from the ERC4626 vault (including yield)");
        console.log("2. Send the funds back to the recipient on Fuji via CCIP");
        console.log("");
        console.log("Note: The withdrawal process is cross-chain and may take a few minutes to complete.");
        console.log("Check the recipient balance after a few minutes to see the withdrawn funds.");
    }

    /// @notice Withdraw funds with custom amount (in USDC, e.g., 3 for 3 USDC)
    /// @param _usdcAmount Amount in USDC (will be converted to wei)
    function withdrawFundsWithAmount(uint256 _usdcAmount) external {
        require(_usdcAmount > 0, "Amount must be greater than 0");
        withdrawFunds(_usdcAmount); // Convert to 6 decimal places
    }

    /// @notice Check deployed capital on Sepolia
    function checkDeployedCapital() external {
        HelperConfig helperConfig = new HelperConfig();
        address dispatcherAddress = helperConfig.FUJIDispatcher();

        YieldDispatcher dispatcher = YieldDispatcher(payable(dispatcherAddress));
        uint256 deployedCapital = dispatcher.getDeployedCapitalOnChain(SEPOLIA_CHAIN_SELECTOR);

        console.log("Deployed capital on Sepolia:", deployedCapital);
        console.log("Deployed capital (in USDC):", deployedCapital / 1e6);
    }

    /// @notice Check USDC balance of a specific address
    /// @param _address Address to check balance for
    function checkBalance(address _address) external {
        HelperConfig helperConfig = new HelperConfig();
        address tokenAddress = helperConfig.getTokenAddress();

        IERC20 usdc = IERC20(tokenAddress);
        uint256 balance = usdc.balanceOf(_address);

        console.log("Address:", _address);
        console.log("USDC balance:", balance);
        console.log("USDC balance (in USDC):", balance / 1e18);
    }
}
