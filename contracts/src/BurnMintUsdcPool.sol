// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BurnMintTokenPool, IBurnMintERC20} from "@chainlink/contracts-ccip/contracts/pools/BurnMintTokenPool.sol";

/**
 * @title TestUsdcTokenPool
 * @author Circle Protocol Team
 * @notice A CCIP token pool for Test USDC tokens supporting burn and mint operations
 * @dev This contract extends Chainlink's BurnMintTokenPool to enable cross-chain
 *      transfers of Test USDC tokens via the CCIP protocol. It handles burning
 *      tokens on the source chain and minting them on the destination chain.
 *
 * Key Features:
 * - Integrates with Chainlink CCIP for cross-chain token transfers
 * - Burns tokens when sending to other chains
 * - Mints tokens when receiving from other chains
 * - Supports allowlist for authorized chains
 * - Compatible with Risk Management Network (RMN)
 */
contract TestUsdcTokenPool is BurnMintTokenPool {
    /**
     * @notice Initializes the Test USDC token pool
     * @param _token The Test USDC token contract address
     * @param _allowlist Array of addresses allowed to interact with this pool
     * @param _rmnProxy The Risk Management Network proxy address
     * @param _router The CCIP router address
     */
    constructor(IBurnMintERC20 _token, address[] memory _allowlist, address _rmnProxy, address _router)
        BurnMintTokenPool(_token, 18, _allowlist, _rmnProxy, _router)
    {}
}
