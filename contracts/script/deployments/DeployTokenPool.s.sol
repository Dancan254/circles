// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {HelperUtils} from "script/utils/HelperUtils.s.sol";
import {HelperConfig} from "script/utils/HelperConfig.s.sol";
import {TestUsdcTokenPool} from "src/BurnMintUsdcPool.sol";
import {BurnMintUsdc} from "src/TestUsdc.sol";
import {IBurnMintERC20} from "@chainlink/contracts/src/v0.8/shared/token/ERC20/IBurnMintERC20.sol";

contract DeployBurnMintTokenPool is Script {
    function run() external {
        // Fetch network configuration (router and RMN proxy addresses)
        HelperConfig helperConfig = new HelperConfig();
        (, address router, address rmnProxy,,,,,) = helperConfig.activeNetworkConfig();

        // Ensure that the token address, router, and RMN proxy are valid
        address tokenAddress = helperConfig.getTokenAddress();
        require(tokenAddress != address(0), "Invalid token address");
        require(router != address(0) && rmnProxy != address(0), "Router or RMN Proxy not defined for this network");

        // Cast the token address to the IBurnMintERC20 interface
        IBurnMintERC20 token = IBurnMintERC20(tokenAddress);

        vm.startBroadcast();

        // Deploy the BurnMintTokenPool contract associated with the token
        TestUsdcTokenPool tokenPool = new TestUsdcTokenPool(
            token,
            new address[](0), // Empty array for initial operators
            rmnProxy,
            router
        );

        console.log("Burn & Mint token pool deployed to:", address(tokenPool));

        // Grant mint and burn roles to the token pool on the token contract
        BurnMintUsdc(tokenAddress).grantMintAndBurnRoles(address(tokenPool));
        console.log("Granted mint and burn roles to token pool:", address(tokenPool));

        vm.stopBroadcast();
    }
}
