// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import {BurnMintTokenPool, IBurnMintERC20} from "@chainlink/contracts-ccip/contracts/pools/BurnMintTokenPool.sol";

contract TestUsdcTokenPool is BurnMintTokenPool {
    constructor(IBurnMintERC20 _token, address[] memory _allowlist, address _rmnProxy, address _router)
        BurnMintTokenPool(_token, 18, _allowlist, _rmnProxy, _router)
    {}
}
