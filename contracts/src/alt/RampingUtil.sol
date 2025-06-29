// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract RampingUtil {
    using SafeERC20 for IERC20;

    address public token;

    constructor(address _token) {
        token = _token;
    }

    function concludeOnRampTransfer(address _to, uint256 _amount) external {
        require(_to != address(0), "Invalid recipient address");
        require(_amount > 0, "Amount must be greater than zero");

        IERC20(token).safeTransfer(_to, _amount);
    }

    function concludeOffRampTransfer(address _from, uint256 _amount) external {
        require(_from != address(0), "Invalid sender address");
        require(_amount > 0, "Amount must be greater than zero");

        IERC20(token).safeTransferFrom(_from, address(this), _amount);
    }

    function changeToken(address _newToken) external {
        require(_newToken != address(0), "Invalid token address");
        token = _newToken;
    }
}
