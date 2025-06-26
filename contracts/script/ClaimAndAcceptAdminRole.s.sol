    // SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {HelperUtils} from "./utils/HelperUtils.s.sol";
import {HelperConfig} from "./utils/HelperConfig.s.sol";
import {RegistryModuleOwnerCustom} from
    "@chainlink/contracts-ccip/contracts/tokenAdminRegistry/RegistryModuleOwnerCustom.sol";
import {BurnMintERC20} from "@chainlink/contracts/src/v0.8/shared/token/ERC20/BurnMintERC20.sol";
import {TokenAdminRegistry} from "@chainlink/contracts-ccip/contracts/tokenAdminRegistry/TokenAdminRegistry.sol";

/**
 * @title ClaimAdmin
 * @author Circle Protocol Team
 * @notice Script to claim and accept admin role for tokens in the CCIP Token Admin Registry
 * @dev This script handles the two-step process of claiming admin rights and accepting the role
 *      for cross-chain token transfers via Chainlink CCIP
 */
contract ClaimAdmin is Script {
    /**
     * @notice Main execution function - claims and accepts admin role
     */
    function run() external {
        claimAndAcceptAdminRole();
    }

    /**
     * @notice Claims and accepts admin role for the token in two steps
     * @dev First claims admin via CCIP admin, then accepts the pending role
     */
    function claimAndAcceptAdminRole() public {
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

        (,,, address tokenAdminRegistry,,,,) = helperConfig.activeNetworkConfig();

        require(tokenAddress != address(0), "Invalid token address");
        require(tokenAdminRegistry != address(0), "TokenAdminRegistry is not defined for this network");

        vm.startBroadcast();

        TokenAdminRegistry tokenAdminRegistryContract = TokenAdminRegistry(tokenAdminRegistry);

        TokenAdminRegistry.TokenConfig memory tokenConfig = tokenAdminRegistryContract.getTokenConfig(tokenAddress);

        address pendingAdministrator = tokenConfig.pendingAdministrator;

        require(pendingAdministrator == tokenAdmin, "Only the pending administrator can accept the admin role");

        tokenAdminRegistryContract.acceptAdminRole(tokenAddress);

        console.log("Accepted admin role for token:", tokenAddress);

        vm.stopBroadcast();
    }

    /**
     * @notice Claims admin role using the token's CCIP admin functionality
     * @param tokenAddress The address of the token to claim admin for
     * @param tokenAdmin The expected token admin address
     * @param registryModuleOwnerCustom The registry module owner custom address
     */
    function claimAdminWithCCIPAdmin(address tokenAddress, address tokenAdmin, address registryModuleOwnerCustom)
        internal
    {
        BurnMintERC20 tokenContract = BurnMintERC20(tokenAddress);
        RegistryModuleOwnerCustom registryContract = RegistryModuleOwnerCustom(registryModuleOwnerCustom);

        address tokenContractCCIPAdmin = tokenContract.getCCIPAdmin();
        console.log("Current token admin:", tokenContractCCIPAdmin);

        require(tokenContractCCIPAdmin == tokenAdmin, "CCIP admin of token doesn't match the token admin address.");

        console.log("Claiming admin of the token via getCCIPAdmin() for CCIP admin:", tokenAdmin);
        registryContract.registerAdminViaGetCCIPAdmin(tokenAddress);
        console.log("Admin claimed successfully for token:", tokenAddress);
    }
}
