// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {IGetCCIPAdmin} from "@chainlink/contracts-ccip/contracts/interfaces/IGetCCIPAdmin.sol";
import {IBurnMintERC20} from "@chainlink/contracts/src/v0.8/shared/token/ERC20/IBurnMintERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

/**
 * @title BurnMintUsdc
 * @author Circle Protocol Team
 * @notice A test USDC token contract with burn and mint capabilities for testing purposes
 * @dev This contract implements the IBurnMintERC20 interface for CCIP compatibility
 *      and includes role-based access control for minting and burning operations.
 *
 * Key Features:
 * - ERC20 compliant token with 18 decimals
 * - Role-based minting and burning (MINTER_ROLE, BURNER_ROLE)
 * - CCIP admin functionality for cross-chain operations
 * - AccessControl for permission management
 * - Optional maximum supply enforcement
 */
contract BurnMintUsdc is IBurnMintERC20, IGetCCIPAdmin, IERC165, ERC20Burnable, AccessControl {
    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    error MaxSupplyExceeded(uint256 supplyAfterMint);
    error InvalidRecipient(address recipient);

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emitted when the CCIP admin role is transferred
    /// @param previousAdmin The previous CCIP admin address
    /// @param newAdmin The new CCIP admin address
    event CCIPAdminTransferred(address indexed previousAdmin, address indexed newAdmin);

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    /// @notice The number of decimals for the token
    uint8 internal immutable i_decimals;

    /// @notice The maximum supply of the token (0 if unlimited)
    uint256 internal immutable i_maxSupply;

    /// @notice The CCIP admin address for token admin registry registration
    /// @dev Can only be transferred by the owner, has no other special powers
    address internal s_ccipAdmin;

    /// @notice Role identifier for accounts that can mint tokens
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Role identifier for accounts that can burn tokens
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /// @notice Initializes the BurnMintUsdc token contract
    /// @dev Sets up initial roles and token parameters
    constructor() ERC20("Test USDC", "USDC") {
        i_decimals = 18;
        i_maxSupply = 0;

        s_ccipAdmin = tx.origin;

        _grantRole(DEFAULT_ADMIN_ROLE, tx.origin);
    }

    /*//////////////////////////////////////////////////////////////
                          INTERFACE SUPPORT
    //////////////////////////////////////////////////////////////*/

    /// @notice Checks if the contract supports a given interface
    /// @dev Implements IERC165 for interface detection
    /// @param interfaceId The interface identifier to check
    /// @return True if the interface is supported, false otherwise
    function supportsInterface(bytes4 interfaceId)
        public
        pure
        virtual
        override(AccessControl, IERC165)
        returns (bool)
    {
        return interfaceId == type(IERC20).interfaceId || interfaceId == type(IBurnMintERC20).interfaceId
            || interfaceId == type(IERC165).interfaceId || interfaceId == type(IAccessControl).interfaceId
            || interfaceId == type(IGetCCIPAdmin).interfaceId;
    }

    /*//////////////////////////////////////////////////////////////
                             ERC20 FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Returns the number of decimals used for token amounts
    /// @dev Override of ERC20 decimals function
    /// @return The number of decimals (18 for this token)
    function decimals() public view virtual override returns (uint8) {
        return i_decimals;
    }

    /*//////////////////////////////////////////////////////////////
                          BURNING & MINTING
    //////////////////////////////////////////////////////////////*/

    /// @notice Burns tokens from the caller's account
    /// @dev Implements IBurnMintERC20 and ERC20Burnable burn function
    /// @param amount The amount of tokens to burn
    function burn(uint256 amount) public override(IBurnMintERC20, ERC20Burnable) {
        super.burn(amount);
    }

    /// @notice Burns tokens from a specific account (compatibility function)
    /// @dev Alias for burnFrom to maintain compatibility with older naming conventions
    /// @param account The account to burn tokens from
    /// @param amount The amount of tokens to burn
    function burn(address account, uint256 amount) public virtual override {
        burnFrom(account, amount);
    }

    /// @notice Burns tokens from a specific account with allowance check
    /// @dev Requires BURNER_ROLE and proper allowance/ownership
    /// @param account The account to burn tokens from
    /// @param amount The amount of tokens to burn
    function burnFrom(address account, uint256 amount)
        public
        override(IBurnMintERC20, ERC20Burnable)
        onlyRole(BURNER_ROLE)
    {
        super.burnFrom(account, amount);
    }

    /// @notice Mints new tokens to a specified account
    /// @dev Requires MINTER_ROLE and respects maximum supply limits
    /// @param account The account to mint tokens to
    /// @param amount The amount of tokens to mint
    function mint(address account, uint256 amount) external onlyRole(MINTER_ROLE) {
        if (account == address(this)) revert InvalidRecipient(account);
        if (i_maxSupply != 0 && totalSupply() + amount > i_maxSupply) {
            revert MaxSupplyExceeded(totalSupply() + amount);
        }

        _mint(account, amount);
    }

    /*//////////////////////////////////////////////////////////////
                          ROLE MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    /// @notice Grants both minter and burner roles to an account
    /// @dev Convenience function to grant both roles at once
    /// @param burnAndMinter The account to grant both roles to
    function grantMintAndBurnRoles(address burnAndMinter) external {
        grantRole(MINTER_ROLE, burnAndMinter);
        grantRole(BURNER_ROLE, burnAndMinter);
    }

    /*//////////////////////////////////////////////////////////////
                           CCIP ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Returns the current CCIP admin address
    /// @dev Used for CCIP token admin registry integration
    /// @return The current CCIP admin address
    function getCCIPAdmin() external view returns (address) {
        return s_ccipAdmin;
    }

    /// @notice Transfers the CCIP admin role to a new address
    /// @dev Only the DEFAULT_ADMIN_ROLE can call this function
    /// @param newAdmin The new CCIP admin address (can be address(0) to revoke)
    function setCCIPAdmin(address newAdmin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        address currentAdmin = s_ccipAdmin;

        s_ccipAdmin = newAdmin;

        emit CCIPAdminTransferred(currentAdmin, newAdmin);
    }
}
