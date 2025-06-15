# Circle Contribution System

A decentralized rotating savings group (ROSCA) implementation where members contribute to a shared pool and receive payouts in a circular manner through verifiable random selection.

## Project Goals

- Create pools (circles) that people can join
- Enable monthly contributions from members
- Randomly select recipients to receive the total pool contributions each period
- Maintain a minimum of 5 people per circle
- Generate yield on idle funds through high-yield protocols
- Primarily use USDC for contributions

## Technical Implementation Status

### ✅ Completed Features

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

### 🏗️ Contract Architecture

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

### 📋 Key Functions Implemented

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

- **Solidity**: ^0.8.19
- **Framework**: Foundry
- **Dependencies**:
  - OpenZeppelin Contracts (AccessControl, SafeERC20)
  - Chainlink VRF V2Plus (for verifiable randomness)
- **Token Standard**: ERC20 (USDC)

### ⚙️ Configuration

- **Payout Period**: 30 days
- **Minimum Approval Threshold**: 25% of current members
- **VRF Settings**:
  - Callback Gas Limit: 2,500,000
  - Request Confirmations: 3
  - Key Hash: Avalanche Fuji testnet

### 🚧 Pending Features

- [ ] Treasury/Vault system for yield generation on idle funds
- [ ] Integration with high-yield DeFi protocols
- [ ] Minimum member enforcement (5 members)
- [ ] Contribution period enforcement (prevent multiple contributions per period)
- [ ] Emergency pause/unpause functionality
- [ ] Comprehensive event emission
- [ ] Gas optimization

### 📁 Project Structure

```
contracts/
├── src/
│   ├── Circle.sol              # Main circle contract
│   ├── interfaces/             # Interface definitions
│   └── libraries/              # VRF and utility libraries
├── test/
│   └── unit/
│       └── CircleTest.t.sol    # Unit tests
└── script/                     # Deployment scripts
```

### 🧪 Testing

Unit tests are implemented using Foundry's testing framework. Run tests with:

```bash
forge test
```

### 🚀 Deployment

The contract is configured for Avalanche Fuji testnet with Chainlink VRF integration. Deployment requires:

1. USDC token address
2. Fixed contribution amount
3. Chainlink VRF subscription ID
