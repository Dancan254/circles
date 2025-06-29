// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Script, console} from "forge-std/Script.sol";
import {RampingUtil} from "src/alt/RampingUtil.sol";
import {HelperConfig} from "script/utils/HelperConfig.s.sol";

contract DeployRampingUtil is Script {
    bytes32 SALT = keccak256("RAMP V.0.1");

    function run() external {
        HelperConfig helperConfig = new HelperConfig();
        address tokenAddress = helperConfig.getTokenAddress();
        vm.startBroadcast();

        RampingUtil rampingUtil = new RampingUtil{salt: SALT}(tokenAddress);
        console.log("RampingUtil deployed at:", address(rampingUtil));
        vm.stopBroadcast();
    }
}
