// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {MockERC4626Vault} from "test/mocks/MockERC4626Vault.sol";
import {IBurnMintERC20} from "@chainlink/contracts/src/v0.8/shared/token/ERC20/IBurnMintERC20.sol";

interface ITokenAdmin {
    function grantMintAndBurnRoles(address vault) external;
}

contract DeployMockVault is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy the MockERC4626Vault contract
        MockERC4626Vault vault = new MockERC4626Vault(0x60A15CA6b63508562d0Cdc9Cf896A9e3bBF79463);
        ITokenAdmin(0x60A15CA6b63508562d0Cdc9Cf896A9e3bBF79463).grantMintAndBurnRoles(address(vault));

        vm.stopBroadcast();

        console.log("=== DEPLOYMENT COMPLETE ===");
        console.log("MockERC4626Vault deployed at:", address(vault));
    }
}
