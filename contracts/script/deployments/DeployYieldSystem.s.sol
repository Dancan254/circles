// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {YieldDispatcher} from "src/YieldDispatcher.sol";
import {YieldExecutor} from "src/YieldExecutor.sol";
import {HelperConfig} from "script/utils/HelperConfig.s.sol";

/**
 * @title DeployYieldSystem
 * @author Circle Protocol Team
 * @notice Deployment script for the cross-chain yield farming system
 * @dev Deploys YieldDispatcher on Fuji and YieldExecutor on Sepolia with proper configuration
 */
contract DeployYieldSystem is Script {
    uint64 public constant FUJI_CHAIN_SELECTOR = 14767482510784806043;
    uint64 public constant SEPOLIA_CHAIN_SELECTOR = 16015286601757825753;

    address public yieldDispatcher;
    address public yieldExecutor;

    /**
     * @notice Main execution function - deploys contracts based on current chain
     */
    function run() external {
        if (block.chainid == 43113) {
            deployYieldDispatcherOnFuji();
        } else if (block.chainid == 11155111) {
            deployYieldExecutorOnSepolia();
        } else {
            revert("Unsupported chain for deployment");
        }
    }

    /**
     * @notice Deploys and configures YieldDispatcher on Avalanche Fuji
     */
    function deployYieldDispatcherOnFuji() internal {
        console.log("=== DEPLOYING YIELD DISPATCHER ON FUJI ===");

        HelperConfig helperConfig = new HelperConfig();
        (, address router,,,, address link,,) = helperConfig.activeNetworkConfig();
        address tokenAddress = helperConfig.getTokenAddress();

        vm.startBroadcast();

        yieldDispatcher = address(new YieldDispatcher(router, link, tokenAddress));

        console.log("YieldDispatcher deployed at:", yieldDispatcher);
        console.log("Router:", router);
        console.log("LINK token:", link);
        console.log("Token address:", tokenAddress);

        YieldDispatcher dispatcher = YieldDispatcher(payable(yieldDispatcher));
        dispatcher.allowlistChain(SEPOLIA_CHAIN_SELECTOR, true);
        console.log("Allowlisted Sepolia chain selector:", SEPOLIA_CHAIN_SELECTOR);

        vm.stopBroadcast();

        console.log("=== FUJI DEPLOYMENT COMPLETE ===");
        console.log("Next: Deploy YieldExecutor on Sepolia and configure cross-chain connectivity");
    }

    /**
     * @notice Deploys and configures YieldExecutor on Ethereum Sepolia
     */
    function deployYieldExecutorOnSepolia() internal {
        console.log("=== DEPLOYING YIELD EXECUTOR ON SEPOLIA ===");

        HelperConfig helperConfig = new HelperConfig();
        (, address router,,,, address link,,) = helperConfig.activeNetworkConfig();

        vm.startBroadcast();

        yieldExecutor = address(new YieldExecutor(router, helperConfig.ERC4626VaultSepolia(), link));

        console.log("YieldExecutor deployed at:", yieldExecutor);
        console.log("Router:", router);
        console.log("LINK token:", link);

        YieldExecutor executor = YieldExecutor(payable(yieldExecutor));

        executor.allowlistSourceChain(FUJI_CHAIN_SELECTOR, true);
        console.log("Allowlisted Fuji chain selector:", FUJI_CHAIN_SELECTOR);

        vm.stopBroadcast();

        console.log("=== SEPOLIA DEPLOYMENT COMPLETE ===");
        console.log("Next: Configure cross-chain connectivity between contracts");
    }

    /**
     * @notice Configures cross-chain connectivity between deployed contracts
     * @dev Call this after both contracts are deployed on their respective chains
     */
    function configureCrossChainConnectivity() external {
        HelperConfig helperConfig = new HelperConfig();
        address dispatcherAddress = helperConfig.FUJIDispatcher();
        address executorAddress = helperConfig.SEPOLIAExecutor();

        if (block.chainid == 43113) {
            vm.startBroadcast();

            YieldDispatcher dispatcher = YieldDispatcher(payable(dispatcherAddress));
            dispatcher.setChainExecutor(SEPOLIA_CHAIN_SELECTOR, executorAddress);

            console.log("Configured YieldDispatcher on Fuji to use executor:", executorAddress);
            console.log("For Sepolia chain:", SEPOLIA_CHAIN_SELECTOR);

            vm.stopBroadcast();
        } else if (block.chainid == 11155111) {
            vm.startBroadcast();

            YieldExecutor executor = YieldExecutor(payable(executorAddress));
            executor.setAuthorizedDispatcher(FUJI_CHAIN_SELECTOR, dispatcherAddress);

            console.log("Configured YieldExecutor on Sepolia to accept from dispatcher:", dispatcherAddress);
            console.log("For Fuji chain:", FUJI_CHAIN_SELECTOR);

            vm.stopBroadcast();
        }
    }
}
