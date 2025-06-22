// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {YieldDispatcher} from "../src/YieldDispatcher.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {HelperConfig} from "./utils/HelperConfig.s.sol";

/// @title DepositYieldFunds - Simple script to deposit funds from Fuji YieldDispatcher to Sepolia YieldExecutor
/// @notice This script calls the YieldDispatcher on Fuji to send funds to YieldExecutor on Sepolia
contract DepositYieldFunds is Script {
    // Chain selectors
    uint64 public constant SEPOLIA_CHAIN_SELECTOR = 16015286601757825753;

    // Default amount to deposit (10 USDC)
    uint256 public constant DEFAULT_AMOUNT = 1e18;

    function run() external {
        // Only works on Fuji
        require(block.chainid == 43113, "This script must be run on Avalanche Fuji (43113)");

        depositFunds(DEFAULT_AMOUNT);
    }

    /// @notice Deposit a specific amount of funds to Sepolia
    /// @param _amount Amount of USDC to deposit (in wei, 6 decimals)
    function depositFunds(uint256 _amount) public {
        console.log("=== DEPOSITING FUNDS FROM FUJI TO SEPOLIA ===");

        // Get deployed contract addresses
        HelperConfig helperConfig = new HelperConfig();
        address dispatcherAddress = helperConfig.FUJIDispatcher();
        address tokenAddress = helperConfig.getTokenAddress();

        console.log("YieldDispatcher address:", dispatcherAddress);
        console.log("USDC token address:", tokenAddress);
        console.log("Amount to deposit:", _amount);
        console.log("Destination chain selector:", SEPOLIA_CHAIN_SELECTOR);

        YieldDispatcher dispatcher = YieldDispatcher(payable(dispatcherAddress));
        IERC20 usdc = IERC20(tokenAddress);

        // Check balances before
        uint256 callerBalance = usdc.balanceOf(msg.sender);
        uint256 dispatcherBalance = usdc.balanceOf(dispatcherAddress);

        console.log("Caller USDC balance:", callerBalance);
        console.log("Dispatcher USDC balance:", dispatcherBalance);

        require(callerBalance >= _amount, "Insufficient USDC balance");

        vm.startBroadcast();

        // Step 1: Authorize this script to call depositFunds
        console.log("Step 1: Authorizing caller as Circle...");
        dispatcher.authorizeCircle(helperConfig.getTokenAdminAddress(), true);

        // Step 2: Approve YieldDispatcher to spend our USDC
        console.log("Step 2: Approving YieldDispatcher to spend USDC...");
        usdc.approve(dispatcherAddress, _amount);

        // Step 3: Deposit funds cross-chain to Sepolia
        console.log("Step 3: Depositing funds to Sepolia...");
        dispatcher.deployFunds(_amount, SEPOLIA_CHAIN_SELECTOR, address(0));

        vm.stopBroadcast();

        // Check balances after
        uint256 callerBalanceAfter = usdc.balanceOf(msg.sender);
        uint256 dispatcherBalanceAfter = usdc.balanceOf(dispatcherAddress);

        console.log("=== DEPOSIT COMPLETE ===");
        console.log("Caller USDC balance after:", callerBalanceAfter);
        console.log("Dispatcher USDC balance after:", dispatcherBalanceAfter);
        console.log("USDC deposited:", callerBalance - callerBalanceAfter);

        console.log("");
        console.log("Funds have been sent to YieldExecutor on Sepolia!");
        console.log("The YieldExecutor will automatically stake the funds in the configured ERC4626 vault.");
    }

    /// @notice Deposit funds with custom amount (in USDC, e.g., 5 for 5 USDC)
    /// @param _usdcAmount Amount in USDC (will be converted to wei)
    function depositFundsWithAmount(uint256 _usdcAmount) external {
        require(_usdcAmount > 0, "Amount must be greater than 0");
        depositFunds(_usdcAmount * 1e6); // Convert to 6 decimal places
    }

    /// @notice Check if the caller is authorized to deposit funds
    function checkAuthorization() external {
        HelperConfig helperConfig = new HelperConfig();
        address dispatcherAddress = helperConfig.FUJIDispatcher();

        YieldDispatcher dispatcher = YieldDispatcher(payable(dispatcherAddress));
        bool isAuthorized = dispatcher.authorizedCircles(helperConfig.getTokenAdminAddress());

        console.log("Caller address:", msg.sender);
        console.log("Is authorized:", isAuthorized);
    }

    /// @notice Check USDC balance of the caller
    function checkBalance() external {
        HelperConfig helperConfig = new HelperConfig();
        address tokenAddress = helperConfig.getTokenAddress();

        IERC20 usdc = IERC20(tokenAddress);
        uint256 balance = usdc.balanceOf(helperConfig.getTokenAdminAddress());

        console.log("Caller USDC balance:", balance);
        console.log("Caller USDC balance (in USDC):", balance / 1e18);
    }
}
