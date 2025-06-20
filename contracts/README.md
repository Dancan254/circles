# Circle Contribution System

A decentralized rotating savings group (ROSCA) implementation with **cross-chain capabilities** using Chainlink CCIP. Members contribute to shared pools and receive payouts through verifiable random selection, with seamless token transfers between supported blockchains.

## 🌟 Recent Major Updates

### ✨ Chainlink CCIP Integration

- **Cross-chain token transfers** between Ethereum Sepolia and Avalanche Fuji
- **Burn & Mint token pools** for seamless USDC bridging
- **Rate limiting** and security controls for cross-chain operations
- **Automated deployment and configuration** across multiple chains

### 🔧 Enhanced Development Workflow

- **Comprehensive Makefile** with 20+ commands for deployment and management
- **Automated pool configuration** with cross-chain connectivity setup
- **Token admin role management** with claim/accept functionality
- **One-command full deployment** across both test networks

## Project Goals

- Create pools (circles) that people can join across multiple blockchains
- Enable monthly contributions from members with **cross-chain USDC support**
- Randomly select recipients to receive total pool contributions each period
- Maintain minimum of 5 people per circle
- Generate yield on idle funds through high-yield protocols
- **Support cross-chain operations** between Ethereum and Avalanche networks

## Technical Implementation Status

### ✅ Completed Features

#### Cross-Chain Infrastructure (NEW)

- **CCIP Integration**: Full Chainlink Cross-Chain Interoperability Protocol support
- **Multi-Chain USDC**: Burn & Mint token pools for cross-chain USDC transfers
- **Automated Deployment**: Complete deployment pipeline for Sepolia and Fuji testnets
- **Rate Limiting**: Configurable inbound/outbound rate limits for secure cross-chain operations
- **Token Admin Registry**: Automated registration and configuration of token pools

#### Core Circle Functionality

- **Circle Contract**: Main contract implementing the circular contribution system
- **Member Management**: Role-based access control using OpenZeppelin's AccessControl
- **Contribution System**: Fixed-amount monthly contributions with USDC token support
- **Approval-based Joining**: New members require approval from 25% of existing members
- **Safe Exit Mechanism**: Members can leave if they have no outstanding contributions

#### Random Selection System

- **Chainlink VRF Integration**: Verifiable random number generation for fair recipient selection
- **Round Management**: Automatic tracking of remaining recipients in each payout round
- **Payout Distribution**: Secure withdrawal system for selected recipients

#### Security Features

- **SafeERC20 Integration**: Safe token transfers using OpenZeppelin's SafeERC20
- **Access Control**: Role-based permissions (CIRCLER role for members)
- **Input Validation**: Comprehensive error handling and validation
- **CREATE2 Deterministic Deployment**: Same contract addresses across all supported chains

### 🏗️ Contract Architecture

#### Cross-Chain Token Infrastructure

```solidity
// USDC Token with burn/mint capabilities
contract BurnMintUsdc is BurnMintERC20 {
    // Deterministic deployment via CREATE2
    // Same address on Sepolia: 0x0731a41e4caf92D586267230Be3b8718422ba329
    // Same address on Fuji: 0x0731a41e4caf92D586267230Be3b8718422ba329
}

// Cross-chain token pool for CCIP
contract TestUsdcTokenPool is BurnMintTokenPool {
    // Handles cross-chain token transfers
    // Rate limiting and security controls
    // Integration with TokenAdminRegistry
}
```

#### Core Circle Logic

```solidity
contract Circle is AccessControl, VRFConsumerBaseV2Plus {
    // Core member and contribution tracking
    mapping(address => uint256) public contributions;
    mapping(address => uint256) public withdrawableAmount;
    mapping(address => uint256) public approvalCount;

    address[] public members;
    address[] public pendingMembers;
    address[] remainingRecipientsInRound;
}
```

### 🌐 Supported Networks

| Network          | Chain ID | CCIP Chain Selector  | USDC Token Address                         |
| ---------------- | -------- | -------------------- | ------------------------------------------ |
| Ethereum Sepolia | 11155111 | 16015286601757825753 | 0x0731a41e4caf92D586267230Be3b8718422ba329 |
| Avalanche Fuji   | 43113    | 14767482510784806043 | 0x0731a41e4caf92D586267230Be3b8718422ba329 |

### 📋 Key Functions Implemented

#### Cross-Chain Operations (NEW)

- `ccipSend()`: Send tokens across chains via CCIP router
- `applyChainUpdates()`: Configure cross-chain pool connections
- `setPool()`: Register token pools in TokenAdminRegistry
- `claimAdmin()` / `acceptAdminRole()`: Manage token admin permissions

#### Member Management

- `joinCircle()`: Join circle after receiving sufficient approvals
- `approveMember(address)`: Approve a pending member (requires CIRCLER role)
- `leaveCircle()`: Exit the circle (with safety checks)

#### Contribution & Payout

- `contribute(uint256)`: Make monthly contribution (fixed amount)
- `selectNextRecipient()`: Randomly select next payout recipient
- `withdraw(uint256)`: Withdraw available payout funds
- `requestRandomWords(bool)`: Trigger VRF request for random selection

#### Utility Functions

- `getNextPayoutDate()`: View when next payout is due
- `getRequestStatus(uint256)`: Check VRF request status

### 🔧 Technical Stack

- **Solidity**: ^0.8.24
- **Framework**: Foundry
- **Cross-Chain**: Chainlink CCIP
- **Dependencies**:
  - OpenZeppelin Contracts (AccessControl, SafeERC20)
  - Chainlink CCIP (Cross-chain messaging and token transfers)
  - Chainlink VRF V2Plus (for verifiable randomness)
- **Token Standard**: ERC20 with Burn & Mint capabilities (USDC)
- **Deployment**: CREATE2 for deterministic addresses across chains

### ⚙️ Configuration

#### Circle Settings

- **Payout Period**: 30 days
- **Minimum Approval Threshold**: 25% of current members
- **VRF Settings**:
  - Callback Gas Limit: 2,500,000
  - Request Confirmations: 3

#### CCIP Rate Limits

- **Capacity**: 1,000,000 USDC (maximum tokens that can be transferred)
- **Refill Rate**: 100,000 USDC per second

## 🚀 Quick Start

### Prerequisites

1. **Environment Setup**

   ```bash
   cp .env.example .env
   # Add your RPC URLs:
   # ETH_SEPOLIA_RPC_URL=your_sepolia_rpc_url
   # AVALANCHE_FUJI_RPC_URL=your_fuji_rpc_url
   ```

2. **Install Dependencies**

   ```bash
   forge install
   ```

3. **Setup Foundry Account**
   ```bash
   cast wallet import dev --interactive
   # Follow prompts to import your private key
   ```

### 🎯 One-Command Deployment

Deploy everything across both chains with cross-chain connectivity:

```bash
make full-deploy-all
```

This single command will:

- Deploy USDC tokens on both Sepolia and Fuji
- Deploy token pools on both chains
- Configure pools in token admin registry
- Set up bidirectional cross-chain connectivity

### 📝 Available Make Commands

#### Basic Operations

```bash
make setup                     # Copy .env.example to .env
make build                     # Build contracts
make test                      # Run tests
make clean                     # Clean build artifacts
```

#### Token Deployment

```bash
make deploy-sepolia            # Deploy USDC token to Sepolia
make deploy-fuji               # Deploy USDC token to Fuji
make deploy-all                # Deploy USDC token to both chains
```

#### Pool Deployment

```bash
make deploy-pool-sepolia       # Deploy token pool to Sepolia
make deploy-pool-fuji          # Deploy token pool to Fuji
make deploy-pools              # Deploy token pools to both chains
```

#### Configuration

```bash
make configure-pool-sepolia    # Configure pool on Sepolia
make configure-pool-fuji       # Configure pool on Fuji
make configure-cross-chain     # Setup bidirectional connectivity
```

#### Token Transfers

```bash
make transfer-tokens-sepolia   # Transfer tokens from Sepolia to Fuji
```

#### Admin Management

```bash
make claim-admin-sepolia       # Claim admin role on Sepolia
make claim-admin-fuji          # Claim admin role on Fuji
make claim-admin               # Claim admin role on both chains
```

### 🚧 Development Features

- [ ] Treasury/Vault system for yield generation on idle funds
- [ ] Integration with high-yield DeFi protocols
- [ ] Minimum member enforcement (5 members)
- [ ] Contribution period enforcement
- [ ] Emergency pause/unpause functionality
- [ ] Cross-chain circle synchronization
- [ ] Gas optimization across chains

### 📁 Project Structure

```
contracts/
├── src/
│   ├── Circle.sol                    # Main circle contract
│   ├── TestUsdc.sol                  # Cross-chain USDC token with burn/mint
│   ├── BurnMintUsdcPool.sol         # CCIP token pool for cross-chain transfers
│   ├── YieldDispatcher.sol          # Yield farming dispatcher
│   ├── YieldExecutor.sol            # Yield farming executor
│   ├── interfaces/                  # Interface definitions
│   └── libraries/                   # VRF and utility libraries
├── script/
│   ├── DeployTestUsdcCreate2.s.sol  # USDC token deployment (CREATE2)
│   ├── DeployTokenPool.s.sol        # Token pool deployment
│   ├── SetAndConfigureTokenPool.s.sol # Pool configuration and cross-chain setup
│   ├── ClaimAndAcceptAdminRole.s.sol # Admin role management
│   ├── TokenTransfer.s.sol          # Cross-chain token transfer
│   └── utils/
│       ├── HelperConfig.s.sol       # Network configurations
│       └── HelperUtils.s.sol        # Utility functions
├── test/
│   └── unit/
│       └── CircleTest.t.sol         # Unit tests
├── broadcast/                       # Deployment artifacts
├── Makefile                         # 20+ deployment and management commands
└── POOL_DEPLOYMENT_GUIDE.md        # Detailed deployment guide
```

### 🧪 Testing

```bash
# Run all tests
forge test

# Run tests with gas reporting
forge test --gas-report

# Run specific test file
forge test --match-path test/unit/CircleTest.t.sol
```

### 🔍 Verification

Check cross-chain message status at:

- [CCIP Explorer](https://ccip.chain.link)
- Message ID will be displayed after cross-chain transfers

### 📚 Additional Resources

- [Pool Deployment Guide](./POOL_DEPLOYMENT_GUIDE.md) - Detailed deployment instructions
- [Chainlink CCIP Documentation](https://docs.chain.link/ccip)
- [Foundry Documentation](https://book.getfoundry.sh/)

---

**⚠️ Testnet Only**: This implementation is currently configured for testnets (Sepolia & Fuji). Do not use with mainnet funds.
