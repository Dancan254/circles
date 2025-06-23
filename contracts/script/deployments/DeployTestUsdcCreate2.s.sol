// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {BurnMintUsdc} from "src/TestUsdc.sol";

/**
 * @title DeployTestUsdcCreate2
 * @author Circle Protocol Team
 * @notice Deployment script for TestUsdc using CREATE2 for deterministic addresses
 * @dev Uses CREATE2 to deploy TestUsdc with the same address across multiple chains
 */
contract DeployTestUsdcCreate2 is Script {
    bytes32 public constant SALT = keccak256("TestUsdc_v1.0.1");

    /**
     * @notice Main execution function - deploys TestUsdc using CREATE2
     */
    function run() external {
        vm.startBroadcast();

        address deployedAddress = deployTestUsdcCreate2();

        vm.stopBroadcast();

        console.log("=== DEPLOYMENT COMPLETE ===");
        console.log("TestUsdc deployed at:", deployedAddress);
        console.log("Salt used:", vm.toString(SALT));
        console.log("This address will be identical on all chains when using the same deployer!");
    }

    /**
     * @notice Deploys TestUsdc using CREATE2 for deterministic addresses
     * @return The address of the deployed contract
     */
    function deployTestUsdcCreate2() internal returns (address) {
        address predictedAddress = getDeploymentAddress();
        console.log("Predicted address:", predictedAddress);

        if (predictedAddress.code.length > 0) {
            console.log("Contract already exists at predicted address");
            return predictedAddress;
        }

        BurnMintUsdc deployedContract = new BurnMintUsdc{salt: SALT}();

        require(address(deployedContract) != address(0), "Deployment failed");
        require(address(deployedContract) == predictedAddress, "Address mismatch");

        console.log("Successfully deployed TestUsdc");
        return address(deployedContract);
    }

    /**
     * @notice Predicts the deployment address using CREATE2
     * @param bytecode The contract bytecode
     * @param salt The salt for CREATE2
     * @return The predicted deployment address
     */
    function predictAddress(bytes memory bytecode, bytes32 salt) internal pure returns (address) {
        address deployer = 0x4e59b44847b379578588920cA78FbF26c0B4956C;
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0xff), deployer, salt, keccak256(bytecode)));
        return address(uint160(uint256(hash)));
    }

    /**
     * @notice Gets the predicted deployment address for TestUsdc
     * @return The address where TestUsdc will be deployed
     */
    function getDeploymentAddress() public pure returns (address) {
        bytes memory bytecode = type(BurnMintUsdc).creationCode;
        return predictAddress(bytecode, SALT);
    }
}
