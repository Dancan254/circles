// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {HelperUtils} from "script/utils/HelperUtils.s.sol";
import {HelperConfig} from "script/utils/HelperConfig.s.sol";
import {TestUsdcTokenPool} from "src/BurnMintUsdcPool.sol";
import {BurnMintUsdc} from "src/TestUsdc.sol";
import {IBurnMintERC20} from "@chainlink/contracts/src/v0.8/shared/token/ERC20/IBurnMintERC20.sol";

/**
 * @title DeployBurnMintTokenPool
 * @author Circle Protocol Team
 * @notice Deployment script for the Burn & Mint Token Pool for CCIP transfers
 * @dev Deploys a token pool that enables cross-chain transfers via burn/mint mechanism
 */
contract DeployBurnMintTokenPool is Script {
    /**
     * @notice Main execution function - deploys the token pool
     */
    function run() external {
        HelperConfig helperConfig = new HelperConfig();
        (, address router, address rmnProxy,,,,,) = helperConfig.activeNetworkConfig();

        address tokenAddress = helperConfig.getTokenAddress();
        require(tokenAddress != address(0), "Invalid token address");
        require(router != address(0) && rmnProxy != address(0), "Router or RMN Proxy not defined for this network");

        IBurnMintERC20 token = IBurnMintERC20(tokenAddress);

        vm.startBroadcast();

        TestUsdcTokenPool tokenPool = new TestUsdcTokenPool(token, new address[](0), rmnProxy, router);

        console.log("Burn & Mint token pool deployed to:", address(tokenPool));

        BurnMintUsdc(tokenAddress).grantMintAndBurnRoles(address(tokenPool));
        console.log("Granted mint and burn roles to token pool:", address(tokenPool));

        vm.stopBroadcast();
    }
}
