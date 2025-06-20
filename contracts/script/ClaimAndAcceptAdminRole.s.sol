    // SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {HelperUtils} from "./utils/HelperUtils.s.sol";
import {HelperConfig} from "./utils/HelperConfig.s.sol";
import {RegistryModuleOwnerCustom} from
    "@chainlink/contracts-ccip/contracts/tokenAdminRegistry/RegistryModuleOwnerCustom.sol";
import {BurnMintERC20} from "@chainlink/contracts/src/v0.8/shared/token/ERC20/BurnMintERC20.sol";
import {TokenAdminRegistry} from "@chainlink/contracts-ccip/contracts/tokenAdminRegistry/TokenAdminRegistry.sol";

contract ClaimAdmin is Script {
    function run() external {
        claimAndAcceptAdminRole();
    }

    function claimAndAcceptAdminRole() public {
        // Fetch the network configuration
        HelperConfig helperConfig = new HelperConfig();
        HelperConfig.NetworkConfigDeployed memory localNetworkConfig = helperConfig.getConfigsForNetwork(block.chainid);
        address tokenAddress = localNetworkConfig.tokenAddress;
        address tokenAdmin = localNetworkConfig.tokenAdminAddress;
        (,,,, address registryModuleOwnerCustom,,,) = helperConfig.activeNetworkConfig();

        require(tokenAddress != address(0), "Invalid token address");
        require(registryModuleOwnerCustom != address(0), "Registry module owner custom is not defined for this network");

        vm.startBroadcast();

        claimAdminWithCCIPAdmin(tokenAddress, tokenAdmin, registryModuleOwnerCustom);

        vm.stopBroadcast();
        /*//////////////////////////////////////////////////////////////
                           ACCEPT ADMIN ROLE
        //////////////////////////////////////////////////////////////*/

        // Fetch the network configuration to get the TokenAdminRegistry address
        (,,, address tokenAdminRegistry,,,,) = helperConfig.activeNetworkConfig();

        // Ensure the token address and TokenAdminRegistry address are valid
        require(tokenAddress != address(0), "Invalid token address");
        require(tokenAdminRegistry != address(0), "TokenAdminRegistry is not defined for this network");

        vm.startBroadcast();

        // Instantiate the TokenAdminRegistry contract
        TokenAdminRegistry tokenAdminRegistryContract = TokenAdminRegistry(tokenAdminRegistry);

        // Fetch the token configuration for the given token address
        TokenAdminRegistry.TokenConfig memory tokenConfig = tokenAdminRegistryContract.getTokenConfig(tokenAddress);

        // Get the pending administrator for the token
        address pendingAdministrator = tokenConfig.pendingAdministrator;

        // Ensure the signer is the pending administrator
        require(pendingAdministrator == tokenAdmin, "Only the pending administrator can accept the admin role");

        // Accept the admin role for the token
        tokenAdminRegistryContract.acceptAdminRole(tokenAddress);

        console.log("Accepted admin role for token:", tokenAddress);

        vm.stopBroadcast();
    }

    function claimAdminWithCCIPAdmin(address tokenAddress, address tokenAdmin, address registryModuleOwnerCustom)
        internal
    {
        // Instantiate the token contract with CCIP admin functionality
        BurnMintERC20 tokenContract = BurnMintERC20(tokenAddress);
        // Instantiate the registry contract
        RegistryModuleOwnerCustom registryContract = RegistryModuleOwnerCustom(registryModuleOwnerCustom);

        // Get the current CCIP admin of the token
        address tokenContractCCIPAdmin = tokenContract.getCCIPAdmin();
        console.log("Current token admin:", tokenContractCCIPAdmin);

        // Ensure the CCIP admin matches the expected token admin address
        require(tokenContractCCIPAdmin == tokenAdmin, "CCIP admin of token doesn't match the token admin address.");

        // Register the admin via getCCIPAdmin() function
        console.log("Claiming admin of the token via getCCIPAdmin() for CCIP admin:", tokenAdmin);
        registryContract.registerAdminViaGetCCIPAdmin(tokenAddress);
        console.log("Admin claimed successfully for token:", tokenAddress);
    }
}
