// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {stdJson} from "forge-std/StdJson.sol";
import {Vm} from "forge-std/Vm.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

/**
 * @title HelperUtils
 * @author Circle Protocol Team
 * @notice Utility library for deployment scripts and chain-specific operations
 * @dev Provides helper functions for chain identification, network configuration
 *      retrieval, and string formatting utilities used across deployment scripts.
 */
library HelperUtils {
    using stdJson for string;

    /**
     * @notice Gets the human-readable chain name for a given chain ID
     * @param chainId The chain ID to get the name for
     * @return The chain name string
     */
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

    /**
     * @notice Gets the network configuration for a specific chain
     * @param helperConfig The HelperConfig instance to query
     * @param chainId The chain ID to get configuration for
     * @return The network configuration struct
     */
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

    /**
     * @notice Converts a bytes32 value to its hexadecimal string representation
     * @param _bytes The bytes32 value to convert
     * @return The hexadecimal string representation without 0x prefix
     */
    function bytes32ToHexString(bytes32 _bytes) internal pure returns (string memory) {
        bytes memory hexChars = "0123456789abcdef";
        bytes memory result = new bytes(64);

        for (uint256 i = 0; i < 32; i++) {
            result[i * 2] = hexChars[uint8(_bytes[i] >> 4)];
            result[i * 2 + 1] = hexChars[uint8(_bytes[i] & 0x0f)];
        }

        return string(result);
    }
}
