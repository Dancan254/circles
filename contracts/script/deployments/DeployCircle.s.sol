// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {Circle} from "src/Circle.sol";
import {HelperConfig} from "script/utils/HelperConfig.s.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title DeployCircle
 * @author Circle Protocol Team
 * @notice Deployment script for the Circle ROSCA contract
 * @dev Deploys the main Circle contract with proper configuration for the target network
 */
contract DeployCircle is Script {
    error CircleDeploymentFailed();
    error InvalidParameters();

    /**
     * @notice Main execution function
     */
    function run() public {
        deployCircle();
    }

    /**
     * @notice Deploys the Circle contract with proper configuration
     * @return circle The deployed Circle contract instance
     */
    function deployCircle() public returns (Circle) {
        HelperConfig helperConfig = new HelperConfig();

        address tokenAddress = helperConfig.getTokenAddress();
        address yieldDispatcherAddress = getYieldDispatcherAddress();
        address vrfCoordinatorAddress = getVRFCoordinatorAddress();

        uint256 subscriptionId = vm.envUint("SUBSCRIPTION_ID");
        uint256 contributionAmount = 10e18;

        if (tokenAddress == address(0)) revert InvalidParameters();
        if (yieldDispatcherAddress == address(0)) revert InvalidParameters();
        if (vrfCoordinatorAddress == address(0)) revert InvalidParameters();
        if (subscriptionId == 0) revert InvalidParameters();

        console.log("Deploying Circle contract with:");
        console.log("Token Address:", tokenAddress);
        console.log("Contribution Amount:", contributionAmount);
        console.log("Subscription ID:", subscriptionId);
        console.log("VRF Coordinator:", vrfCoordinatorAddress);
        console.log("Yield Dispatcher:", yieldDispatcherAddress);
        console.log("Chain ID:", block.chainid);

        vm.startBroadcast();

        Circle circle = new Circle(
            IERC20(tokenAddress), contributionAmount, subscriptionId, vrfCoordinatorAddress, yieldDispatcherAddress
        );

        if (address(circle) == address(0)) revert CircleDeploymentFailed();

        vm.stopBroadcast();

        console.log("Circle deployed at:", address(circle));
        console.log("Deployer:", msg.sender);

        return circle;
    }

    /**
     * @notice Gets the YieldDispatcher address for the current network
     * @return The YieldDispatcher contract address
     */
    function getYieldDispatcherAddress() internal returns (address) {
        if (block.chainid == 43113) {
            HelperConfig helperConfig = new HelperConfig();
            return helperConfig.FUJIDispatcher();
        } else {
            revert InvalidParameters();
        }
    }

    /**
     * @notice Gets the VRF Coordinator address for the current network
     * @return The VRF Coordinator contract address
     */
    function getVRFCoordinatorAddress() internal returns (address) {
        if (block.chainid == 43113) {
            HelperConfig helperConfig = new HelperConfig();
            return helperConfig.VRFCoordinatorFuji();
        } else {
            revert InvalidParameters();
        }
    }
}
