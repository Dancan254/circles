// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {MockERC4626Vault} from "test/mocks/MockERC4626Vault.sol";
import {IBurnMintERC20} from "@chainlink/contracts/src/v0.8/shared/token/ERC20/IBurnMintERC20.sol";

interface ITokenAdmin {
    function grantMintAndBurnRoles(address vault) external;
}

/**
 * @title DeployMockVault
 * @author Circle Protocol Team
 * @notice Deployment script for the Mock ERC4626 Vault used for testing yield strategies
 * @dev Deploys a mock vault that simulates yield generation for testing purposes
 */
contract DeployMockVault is Script {
    /**
     * @notice Main execution function - deploys the mock vault
     */
    function run() external {
        vm.startBroadcast();

        MockERC4626Vault vault = new MockERC4626Vault(0x60A15CA6b63508562d0Cdc9Cf896A9e3bBF79463);
        ITokenAdmin(0x60A15CA6b63508562d0Cdc9Cf896A9e3bBF79463).grantMintAndBurnRoles(address(vault));

        vm.stopBroadcast();

        console.log("=== DEPLOYMENT COMPLETE ===");
        console.log("MockERC4626Vault deployed at:", address(vault));
    }
}
