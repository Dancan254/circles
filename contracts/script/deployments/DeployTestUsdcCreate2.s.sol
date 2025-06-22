// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {BurnMintUsdc} from "src/TestUsdc.sol";

contract DeployTestUsdcCreate2 is Script {
    // Fixed salt for deterministic addresses across chains
    bytes32 public constant SALT = keccak256("TestUsdc_v1.0.1");

    function run() external {
        vm.startBroadcast();

        // Deploy TestUsdc using CREATE2
        address deployedAddress = deployTestUsdcCreate2();

        vm.stopBroadcast();

        console.log("=== DEPLOYMENT COMPLETE ===");
        console.log("TestUsdc deployed at:", deployedAddress);
        console.log("Salt used:", vm.toString(SALT));
        console.log("This address will be identical on all chains when using the same deployer!");
    }

    function deployTestUsdcCreate2() internal returns (address) {
        // Predict the address before deployment
        address predictedAddress = getDeploymentAddress();
        console.log("Predicted address:", predictedAddress);

        // Check if contract already exists
        if (predictedAddress.code.length > 0) {
            console.log("Contract already exists at predicted address");
            return predictedAddress;
        }

        // Deploy using Solidity's built-in CREATE2 with salt
        BurnMintUsdc deployedContract = new BurnMintUsdc{salt: SALT}();

        require(address(deployedContract) != address(0), "Deployment failed");
        require(address(deployedContract) == predictedAddress, "Address mismatch");

        console.log("Successfully deployed TestUsdc");
        return address(deployedContract);
    }

    function predictAddress(bytes memory bytecode, bytes32 salt) internal pure returns (address) {
        // Use the current deployer address (msg.sender during broadcast)
        address deployer = 0x4e59b44847b379578588920cA78FbF26c0B4956C;
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0xff), deployer, salt, keccak256(bytecode)));
        return address(uint160(uint256(hash)));
    }

    // Helper function to check what address will be used on any chain
    function getDeploymentAddress() public pure returns (address) {
        bytes memory bytecode = type(BurnMintUsdc).creationCode;
        return predictAddress(bytecode, SALT);
    }
}
