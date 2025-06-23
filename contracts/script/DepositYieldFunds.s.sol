// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {YieldDispatcher} from "../src/YieldDispatcher.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {HelperConfig} from "./utils/HelperConfig.s.sol";

/**
 * @title DepositYieldFunds
 * @author Circle Protocol Team
 * @notice Script to deposit funds from Fuji YieldDispatcher to Sepolia YieldExecutor
 * @dev This script facilitates cross-chain yield farming by sending USDC from Avalanche Fuji
 *      to Ethereum Sepolia where it will be automatically staked in yield protocols
 */
contract DepositYieldFunds is Script {
    uint64 public constant SEPOLIA_CHAIN_SELECTOR = 16015286601757825753;
    uint256 public constant DEFAULT_AMOUNT = 1e18;

    /**
     * @notice Main execution function - deposits default amount to Sepolia
     * @dev Only works on Avalanche Fuji (chain ID 43113)
     */
    function run() external {
        require(block.chainid == 43113, "This script must be run on Avalanche Fuji (43113)");
        depositFunds(DEFAULT_AMOUNT);
    }

    /**
     * @notice Deposits a specific amount of funds to Sepolia via cross-chain transfer
     * @param _amount Amount of USDC to deposit (in wei, 18 decimals for test USDC)
     */
    function depositFunds(uint256 _amount) public {
        console.log("=== DEPOSITING FUNDS FROM FUJI TO SEPOLIA ===");

        HelperConfig helperConfig = new HelperConfig();
        address dispatcherAddress = helperConfig.FUJIDispatcher();
        address tokenAddress = helperConfig.getTokenAddress();

        console.log("YieldDispatcher address:", dispatcherAddress);
        console.log("USDC token address:", tokenAddress);
        console.log("Amount to deposit:", _amount);
        console.log("Destination chain selector:", SEPOLIA_CHAIN_SELECTOR);

        YieldDispatcher dispatcher = YieldDispatcher(payable(dispatcherAddress));
        IERC20 usdc = IERC20(tokenAddress);

        uint256 callerBalance = usdc.balanceOf(msg.sender);
        uint256 dispatcherBalance = usdc.balanceOf(dispatcherAddress);

        console.log("Caller USDC balance:", callerBalance);
        console.log("Dispatcher USDC balance:", dispatcherBalance);

        require(callerBalance >= _amount, "Insufficient USDC balance");

        vm.startBroadcast();

        console.log("Step 1: Authorizing caller as Circle...");
        dispatcher.authorizeCircle(helperConfig.getTokenAdminAddress(), true);

        console.log("Step 2: Approving YieldDispatcher to spend USDC...");
        usdc.approve(dispatcherAddress, _amount);

        console.log("Step 3: Depositing funds to Sepolia...");
        dispatcher.deployFunds(_amount, SEPOLIA_CHAIN_SELECTOR, address(0));

        vm.stopBroadcast();

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

    /**
     * @notice Deposits funds with custom amount in USDC units
     * @param _usdcAmount Amount in USDC (e.g., 5 for 5 USDC, will be converted to wei)
     */
    function depositFundsWithAmount(uint256 _usdcAmount) external {
        require(_usdcAmount > 0, "Amount must be greater than 0");
        depositFunds(_usdcAmount * 1e18);
    }

    /**
     * @notice Checks if the caller is authorized to deposit funds
     */
    function checkAuthorization() external {
        HelperConfig helperConfig = new HelperConfig();
        address dispatcherAddress = helperConfig.FUJIDispatcher();

        YieldDispatcher dispatcher = YieldDispatcher(payable(dispatcherAddress));
        bool isAuthorized = dispatcher.authorizedCircles(helperConfig.getTokenAdminAddress());

        console.log("Caller address:", msg.sender);
        console.log("Is authorized:", isAuthorized);
    }

    /**
     * @notice Checks the USDC balance of the caller
     */
    function checkBalance() external {
        HelperConfig helperConfig = new HelperConfig();
        address tokenAddress = helperConfig.getTokenAddress();

        IERC20 usdc = IERC20(tokenAddress);
        uint256 balance = usdc.balanceOf(helperConfig.getTokenAdminAddress());

        console.log("Caller USDC balance:", balance);
        console.log("Caller USDC balance (in USDC):", balance / 1e18);
    }
}
