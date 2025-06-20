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

/// @notice A basic ERC20 compatible token contract with burn and minting roles.
/// @dev The total supply can be limited during deployment.
contract BurnMintUsdc is IBurnMintERC20, IGetCCIPAdmin, IERC165, ERC20Burnable, AccessControl {
    error MaxSupplyExceeded(uint256 supplyAfterMint);
    error InvalidRecipient(address recipient);

    event CCIPAdminTransferred(address indexed previousAdmin, address indexed newAdmin);

    /// @dev The number of decimals for the token
    uint8 internal immutable i_decimals;

    /// @dev The maximum supply of the token, 0 if unlimited
    uint256 internal immutable i_maxSupply;

    /// @dev the CCIPAdmin can be used to register with the CCIP token admin registry, but has no other special powers,
    /// and can only be transferred by the owner.
    address internal s_ccipAdmin;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    /// @dev the underscores in parameter names are used to suppress compiler warnings about shadowing ERC20 functions
    constructor() ERC20("Test USDC", "USDC") {
        i_decimals = 18;
        i_maxSupply = 0;

        s_ccipAdmin = tx.origin;

        // Set up the owner as the initial minter and burner
        _grantRole(DEFAULT_ADMIN_ROLE, tx.origin);
    }

    /// @inheritdoc IERC165
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

    // ================================================================
    // │                            ERC20                             │
    // ================================================================

    /// @dev Returns the number of decimals used in its user representation.
    function decimals() public view virtual override returns (uint8) {
        return i_decimals;
    }

    // ================================================================
    // │                      Burning & minting                       │
    // ================================================================

    /// @inheritdoc ERC20Burnable
    /// @dev Uses OZ ERC20 _burn to disallow burning from address(0).
    /// @dev Decreases the total supply.
    function burn(uint256 amount) public override(IBurnMintERC20, ERC20Burnable) {
        super.burn(amount);
    }

    /// @inheritdoc IBurnMintERC20
    /// @dev Alias for BurnFrom for compatibility with the older naming convention.
    /// @dev Uses burnFrom for all validation & logic.
    function burn(address account, uint256 amount) public virtual override {
        burnFrom(account, amount);
    }

    /// @inheritdoc ERC20Burnable
    /// @dev Uses OZ ERC20 _burn to disallow burning from address(0).
    /// @dev Decreases the total supply.
    function burnFrom(address account, uint256 amount)
        public
        override(IBurnMintERC20, ERC20Burnable)
        onlyRole(BURNER_ROLE)
    {
        super.burnFrom(account, amount);
    }

    /// @inheritdoc IBurnMintERC20
    /// @dev Uses OZ ERC20 _mint to disallow minting to address(0).
    /// @dev Disallows minting to address(this)
    /// @dev Increases the total supply.
    function mint(address account, uint256 amount) external onlyRole(MINTER_ROLE) {
        if (account == address(this)) revert InvalidRecipient(account);
        if (i_maxSupply != 0 && totalSupply() + amount > i_maxSupply) revert MaxSupplyExceeded(totalSupply() + amount);

        _mint(account, amount);
    }

    // ================================================================
    // │                            Roles                             │
    // ================================================================

    /// @notice grants both mint and burn roles to `burnAndMinter`.
    /// @dev calls public functions so this function does not require
    /// access controls. This is handled in the inner functions.
    function grantMintAndBurnRoles(address burnAndMinter) external {
        grantRole(MINTER_ROLE, burnAndMinter);
        grantRole(BURNER_ROLE, burnAndMinter);
    }

    /// @notice Returns the current CCIPAdmin
    function getCCIPAdmin() external view returns (address) {
        return s_ccipAdmin;
    }

    /// @notice Transfers the CCIPAdmin role to a new address
    /// @dev only the owner can call this function, NOT the current ccipAdmin, and 1-step ownership transfer is used.
    /// @param newAdmin The address to transfer the CCIPAdmin role to. Setting to address(0) is a valid way to revoke
    /// the role
    function setCCIPAdmin(address newAdmin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        address currentAdmin = s_ccipAdmin;

        s_ccipAdmin = newAdmin;

        emit CCIPAdminTransferred(currentAdmin, newAdmin);
    }
}
