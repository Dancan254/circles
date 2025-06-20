// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {stdJson} from "forge-std/StdJson.sol";
import {Vm} from "forge-std/Vm.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

library HelperUtils {
    using stdJson for string;

    function getChainName(uint256 chainId) internal pure returns (string memory) {
        if (chainId == 43113) {
            return "avalancheFuji";
        } else if (chainId == 11155111) {
            return "ethereumSepolia";
        } else if (chainId == 421614) {
            return "arbitrumSepolia";
        } else if (chainId == 84532) {
            return "baseSepolia";
        } else {
            revert("Unsupported chain ID");
        }
    }

    function getNetworkConfig(HelperConfig helperConfig, uint256 chainId)
        internal
        pure
        returns (HelperConfig.NetworkConfig memory)
    {
        if (chainId == 43113) {
            return helperConfig.getAvalancheFujiConfig();
        } else if (chainId == 11155111) {
            return helperConfig.getEthereumSepoliaConfig();
        } else if (chainId == 421614) {
            return helperConfig.getArbitrumSepolia();
        } else if (chainId == 84532) {
            return helperConfig.getBaseSepoliaConfig();
        } else {
            revert("Unsupported chain ID");
        }
    }

    function bytes32ToHexString(bytes32 _bytes) internal pure returns (string memory) {
        bytes memory hexChars = "0123456789abcdef";
        bytes memory result = new bytes(64); // 32 bytes = 64 hex characters

        for (uint256 i = 0; i < 32; i++) {
            result[i * 2] = hexChars[uint8(_bytes[i] >> 4)];
            result[i * 2 + 1] = hexChars[uint8(_bytes[i] & 0x0f)];
        }

        return string(result);
    }
}
