// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @dev Interface of the ERC20 Burn and Mint extension.
 */
interface IERC20BurnMint is IERC20 {
    /**
     * @dev Burns a `value` amount of tokens from the caller.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     */
    function burn(uint256 value) external;

    /**
     * @dev Burns a `value` amount of tokens from `account`, deducting from
     * the caller's allowance.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * Requirements:
     *
     * - the caller must have allowance for `account`'s tokens of at least
     * `value`.
     */
    function burnFrom(address account, uint256 value) external;

    /**
     * @dev Mints `value` amount of tokens to `to`.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     */
    function mint(address to, uint256 amount) external;
}
