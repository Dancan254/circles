// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {HelperUtils} from "./utils/HelperUtils.s.sol"; // Utility functions for JSON parsing and chain info
import {HelperConfig} from "./utils/HelperConfig.s.sol"; // Network configuration helper
import {TokenAdminRegistry} from "@chainlink/contracts-ccip/contracts/tokenAdminRegistry/TokenAdminRegistry.sol";
import {TokenPool} from "@chainlink/contracts-ccip/contracts/pools/TokenPool.sol";
import {RateLimiter} from "@chainlink/contracts-ccip/contracts/libraries/RateLimiter.sol";

// Script contract to set the token pool in the TokenAdminRegistry
contract SetPool is Script {
    function run() external {
        setPool();
        configurePools();
    }

    function setPool() public {
        HelperConfig helperConfig = new HelperConfig();
        HelperConfig.NetworkConfigDeployed memory localNetworkConfig = helperConfig.getConfigsForNetwork(block.chainid);
        address tokenAddress = localNetworkConfig.tokenAddress;
        address poolAddress = localNetworkConfig.deployedTokenPoolAddress;

        // Fetch the network configuration to get the TokenAdminRegistry address
        (,,, address tokenAdminRegistry,,,,) = helperConfig.activeNetworkConfig();

        require(tokenAddress != address(0), "Invalid token address");
        require(poolAddress != address(0), "Invalid pool address");
        require(tokenAdminRegistry != address(0), "TokenAdminRegistry is not defined for this network");

        vm.startBroadcast();

        // Instantiate the TokenAdminRegistry contract
        TokenAdminRegistry tokenAdminRegistryContract = TokenAdminRegistry(tokenAdminRegistry);

        // Fetch the token configuration to get the administrator's address
        TokenAdminRegistry.TokenConfig memory config = tokenAdminRegistryContract.getTokenConfig(tokenAddress);
        address tokenAdministratorAddress = config.administrator;

        console.log("Setting pool for token:", tokenAddress);
        console.log("New pool address:", poolAddress);
        console.log("Action performed by admin:", tokenAdministratorAddress);

        // Use the administrator's address to set the pool for the token
        tokenAdminRegistryContract.setPool(tokenAddress, poolAddress);

        console.log("Pool set for token", tokenAddress, "to", poolAddress);

        vm.stopBroadcast();
    }

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

        // For remotePoolAddresses, create an array with the remotePoolAddress
        address[] memory remotePoolAddresses = new address[](1);
        remotePoolAddresses[0] = remotePoolAddress;

        // Fetch the remote network configuration to get the chain selector
        HelperConfig.NetworkConfig memory remoteNetworkConfig =
            HelperUtils.getNetworkConfig(helperConfig, remoteChainId);

        uint64 remoteChainSelector = remoteNetworkConfig.chainSelector;

        require(poolAddress != address(0), "Invalid pool address");
        require(remotePoolAddress != address(0), "Invalid remote pool address");
        require(remoteTokenAddress != address(0), "Invalid remote token address");
        require(remoteChainSelector != 0, "chainSelector is not defined for the remote chain");

        vm.startBroadcast();

        // Instantiate the local TokenPool contract
        TokenPool poolContract = TokenPool(poolAddress);

        // Prepare chain update data for configuring cross-chain transfers
        TokenPool.ChainUpdate[] memory chainUpdates = new TokenPool.ChainUpdate[](1);

        // Encode remote pool addresses
        bytes[] memory remotePoolAddressesEncoded = new bytes[](remotePoolAddresses.length);
        for (uint256 i = 0; i < remotePoolAddresses.length; i++) {
            remotePoolAddressesEncoded[i] = abi.encode(remotePoolAddresses[i]);
        }

        chainUpdates[0] = TokenPool.ChainUpdate({
            remoteChainSelector: remoteChainSelector, // Chain selector of the remote chain
            remotePoolAddresses: remotePoolAddressesEncoded, // Array of encoded addresses of the remote pools
            remoteTokenAddress: abi.encode(remoteTokenAddress), // Encoded address of the remote token
            outboundRateLimiterConfig: RateLimiter.Config({
                isEnabled: false, // Set to true to enable outbound rate limiting
                capacity: 0, // Max tokens allowed in the outbound rate limiter
                rate: 0 // Refill rate per second for the outbound rate limiter
            }),
            inboundRateLimiterConfig: RateLimiter.Config({
                isEnabled: false, // Set to true to enable inbound rate limiting
                capacity: 0, // Max tokens allowed in the inbound rate limiter
                rate: 0 // Refill rate per second for the inbound rate limiter
            })
        });

        // Create an empty array for chainSelectorRemovals
        uint64[] memory chainSelectorRemovals = new uint64[](0);

        // Apply the chain updates to configure the pool
        poolContract.applyChainUpdates(chainSelectorRemovals, chainUpdates);

        console.log("Chain update applied to pool at address:", poolAddress);

        vm.stopBroadcast();
    }
}
