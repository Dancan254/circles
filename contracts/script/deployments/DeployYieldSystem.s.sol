// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {YieldDispatcher} from "src/YieldDispatcher.sol";
import {YieldExecutor} from "src/YieldExecutor.sol";
import {HelperConfig} from "script/utils/HelperConfig.s.sol";

contract DeployYieldSystem is Script {
    // Chain selectors
    uint64 public constant FUJI_CHAIN_SELECTOR = 14767482510784806043;
    uint64 public constant SEPOLIA_CHAIN_SELECTOR = 16015286601757825753;

    // Contract addresses will be stored here after deployment
    address public yieldDispatcher;
    address public yieldExecutor;

    function run() external {
        if (block.chainid == 43113) {
            // Deploy on Fuji
            deployYieldDispatcherOnFuji();
        } else if (block.chainid == 11155111) {
            // Deploy on Sepolia
            deployYieldExecutorOnSepolia();
        } else {
            revert("Unsupported chain for deployment");
        }
    }

    function deployYieldDispatcherOnFuji() internal {
        console.log("=== DEPLOYING YIELD DISPATCHER ON FUJI ===");

        // Get network configuration
        HelperConfig helperConfig = new HelperConfig();
        (, address router,,,, address link,,) = helperConfig.activeNetworkConfig();
        address tokenAddress = helperConfig.getTokenAddress();

        vm.startBroadcast();

        // Deploy YieldDispatcher
        yieldDispatcher = address(new YieldDispatcher(router, link, tokenAddress));

        console.log("YieldDispatcher deployed at:", yieldDispatcher);
        console.log("Router:", router);
        console.log("LINK token:", link);
        console.log("Token address:", tokenAddress);

        // Configure YieldDispatcher
        YieldDispatcher dispatcher = YieldDispatcher(payable(yieldDispatcher));

        // Allowlist Sepolia chain
        dispatcher.allowlistChain(SEPOLIA_CHAIN_SELECTOR, true);
        console.log("Allowlisted Sepolia chain selector:", SEPOLIA_CHAIN_SELECTOR);

        vm.stopBroadcast();

        console.log("=== FUJI DEPLOYMENT COMPLETE ===");
        console.log("Next: Deploy YieldExecutor on Sepolia and configure cross-chain connectivity");
    }

    function deployYieldExecutorOnSepolia() internal {
        console.log("=== DEPLOYING YIELD EXECUTOR ON SEPOLIA ===");

        // Get network configuration
        HelperConfig helperConfig = new HelperConfig();
        (, address router,,,, address link,,) = helperConfig.activeNetworkConfig();

        vm.startBroadcast();

        // Deploy YieldExecutor
        yieldExecutor = address(new YieldExecutor(router, helperConfig.ERC4626VaultSepolia(), link));

        console.log("YieldExecutor deployed at:", yieldExecutor);
        console.log("Router:", router);
        console.log("LINK token:", link);

        // Configure YieldExecutor
        YieldExecutor executor = YieldExecutor(payable(yieldExecutor));

        // Allowlist Fuji chain
        executor.allowlistSourceChain(FUJI_CHAIN_SELECTOR, true);
        console.log("Allowlisted Fuji chain selector:", FUJI_CHAIN_SELECTOR);

        vm.stopBroadcast();

        console.log("=== SEPOLIA DEPLOYMENT COMPLETE ===");
        console.log("Next: Configure cross-chain connectivity between contracts");
    }

    // Helper function to configure cross-chain connectivity
    // Call this after both contracts are deployed
    function configureCrossChainConnectivity() external {
        // Get deployed addresses from environment or previous deployments
        HelperConfig helperConfig = new HelperConfig();
        address dispatcherAddress = helperConfig.FUJIDispatcher();
        address executorAddress = helperConfig.SEPOLIAExecutor();

        if (block.chainid == 43113) {
            // Configure on Fuji (YieldDispatcher)
            vm.startBroadcast();

            YieldDispatcher dispatcher = YieldDispatcher(payable(dispatcherAddress));
            dispatcher.setChainExecutor(SEPOLIA_CHAIN_SELECTOR, executorAddress);

            console.log("Configured YieldDispatcher on Fuji to use executor:", executorAddress);
            console.log("For Sepolia chain:", SEPOLIA_CHAIN_SELECTOR);

            vm.stopBroadcast();
        } else if (block.chainid == 11155111) {
            // Configure on Sepolia (YieldExecutor)
            vm.startBroadcast();

            YieldExecutor executor = YieldExecutor(payable(executorAddress));
            executor.setAuthorizedDispatcher(FUJI_CHAIN_SELECTOR, dispatcherAddress);

            console.log("Configured YieldExecutor on Sepolia to accept from dispatcher:", dispatcherAddress);
            console.log("For Fuji chain:", FUJI_CHAIN_SELECTOR);

            vm.stopBroadcast();
        }
    }
}
