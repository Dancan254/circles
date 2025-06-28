// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {HelperUtils} from "./utils/HelperUtils.s.sol";
import {HelperConfig} from "./utils/HelperConfig.s.sol";
import {TokenAdminRegistry} from "@chainlink/contracts-ccip/contracts/tokenAdminRegistry/TokenAdminRegistry.sol";
import {TokenPool} from "@chainlink/contracts-ccip/contracts/pools/TokenPool.sol";
import {RateLimiter} from "@chainlink/contracts-ccip/contracts/libraries/RateLimiter.sol";

/**
 * @title SetPool
 * @author Circle Protocol Team
 * @notice Script to set and configure token pools in the TokenAdminRegistry
 * @dev This script sets up cross-chain token pool configurations for CCIP transfers
 *      between Ethereum Sepolia and Avalanche Fuji networks
 */
contract SetPool is Script {
    /**
     * @notice Main execution function - sets pool and configures cross-chain settings
     */
    function run() external {
        setPool();
        configurePools();
    }

    /**
     * @notice Sets the token pool in the TokenAdminRegistry
     * @dev Associates a token with its corresponding pool for CCIP operations
     */
    function setPool() public {
        HelperConfig helperConfig = new HelperConfig();
        HelperConfig.NetworkConfigDeployed memory localNetworkConfig = helperConfig.getConfigsForNetwork(block.chainid);
        address tokenAddress = localNetworkConfig.tokenAddress;
        address poolAddress = localNetworkConfig.deployedTokenPoolAddress;

        (,,, address tokenAdminRegistry,,,,) = helperConfig.activeNetworkConfig();

        require(tokenAddress != address(0), "Invalid token address");
        require(poolAddress != address(0), "Invalid pool address");
        require(tokenAdminRegistry != address(0), "TokenAdminRegistry is not defined for this network");

        vm.startBroadcast();

        TokenAdminRegistry tokenAdminRegistryContract = TokenAdminRegistry(tokenAdminRegistry);

        TokenAdminRegistry.TokenConfig memory config = tokenAdminRegistryContract.getTokenConfig(tokenAddress);
        address tokenAdministratorAddress = config.administrator;

        console.log("Setting pool for token:", tokenAddress);
        console.log("New pool address:", poolAddress);
        console.log("Action performed by admin:", tokenAdministratorAddress);

        tokenAdminRegistryContract.setPool(tokenAddress, poolAddress);

        console.log("Pool set for token", tokenAddress, "to", poolAddress);

        vm.stopBroadcast();
    }

    /**
     * @notice Configures cross-chain pool settings for token transfers
     * @dev Sets up rate limiting and remote chain configurations
     */
    function configurePools() public {
        HelperConfig helperConfig = new HelperConfig();
        address poolAddress;
        address remotePoolAddress;
        address remoteTokenAddress;
        uint256 remoteChainId;

        if (block.chainid == 11155111) {
            HelperConfig.NetworkConfigDeployed memory remoteNetworkConfigDep = helperConfig.getConfigsForNetwork(43113);
            poolAddress = 0x7c84f757F4DB3a80be60B269e6B993740F24E5e9;
            remotePoolAddress = remoteNetworkConfigDep.deployedTokenPoolAddress;
            remoteTokenAddress = remoteNetworkConfigDep.tokenAddress;
            remoteChainId = 43113;
        } else if (block.chainid == 43113) {
            HelperConfig.NetworkConfigDeployed memory remoteNetworkConfigDep =
                helperConfig.getConfigsForNetwork(11155111);
            poolAddress = 0x2D9bf08C367fe7CF2d5d76E43fCFE46cE7660691;
            remotePoolAddress = remoteNetworkConfigDep.deployedTokenPoolAddress;
            remoteTokenAddress = remoteNetworkConfigDep.tokenAddress;
            remoteChainId = 11155111;
        } else {
            revert("Unsupported chain for pool configuration");
        }

        address[] memory remotePoolAddresses = new address[](1);
        remotePoolAddresses[0] = remotePoolAddress;

        HelperConfig.NetworkConfig memory remoteNetworkConfig =
            HelperUtils.getNetworkConfig(helperConfig, remoteChainId);

        uint64 remoteChainSelector = remoteNetworkConfig.chainSelector;

        require(poolAddress != address(0), "Invalid pool address");
        require(remotePoolAddress != address(0), "Invalid remote pool address");
        require(remoteTokenAddress != address(0), "Invalid remote token address");
        require(remoteChainSelector != 0, "chainSelector is not defined for the remote chain");

        vm.startBroadcast();

        TokenPool poolContract = TokenPool(poolAddress);

        TokenPool.ChainUpdate[] memory chainUpdates = new TokenPool.ChainUpdate[](1);

        bytes[] memory remotePoolAddressesEncoded = new bytes[](remotePoolAddresses.length);
        for (uint256 i = 0; i < remotePoolAddresses.length; i++) {
            remotePoolAddressesEncoded[i] = abi.encode(remotePoolAddresses[i]);
        }

        chainUpdates[0] = TokenPool.ChainUpdate({
            remoteChainSelector: remoteChainSelector,
            remotePoolAddresses: remotePoolAddressesEncoded,
            remoteTokenAddress: abi.encode(remoteTokenAddress),
            outboundRateLimiterConfig: RateLimiter.Config({isEnabled: false, capacity: 0, rate: 0}),
            inboundRateLimiterConfig: RateLimiter.Config({isEnabled: false, capacity: 0, rate: 0})
        });

        uint64[] memory chainSelectorRemovals = new uint64[](0);

        poolContract.applyChainUpdates(chainSelectorRemovals, chainUpdates);

        console.log("Chain update applied to pool at address:", poolAddress);

        vm.stopBroadcast();
    }
}
