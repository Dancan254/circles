# 🌍 Circles Frontend - Cross-Chain Savings Circles DApp

A modern React application for managing cross-chain savings circles (ROSCAs) with automated yield farming. Built with React 19, TypeScript, and Thirdweb for seamless Web3 integration.

## 🚀 Features

- **💰 Savings Circle Management**: Join circles, make contributions, and track payouts
- **🔗 Cross-Chain Operations**: Deploy funds across Avalanche and Ethereum for yield farming
- **📊 Real-Time Analytics**: Monitor earnings, claimable balances, and transaction history
- **🎲 Fair Selection**: Transparent recipient selection powered by Chainlink VRF
- **📱 Responsive Design**: Mobile-first interface with smooth animations
- **🔄 Live Transaction Tracking**: Real-time cross-chain transaction monitoring

## 🛠️ Tech Stack

### Core Framework

- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5.8.3** - Type-safe development
- **Vite 7.0.0** - Lightning-fast build tool with HMR

### Web3 Integration

- **Thirdweb SDK v5.105.3** - Modern Web3 development framework
- **Thirdweb React v4.9.4** - React hooks for Web3 interactions
- **Ethers.js 5.7.2** - Ethereum interaction library

### UI & Styling

- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **Framer Motion 12.19.2** - Production-ready motion library
- **Lucide React** - Beautiful, customizable icons
- **Lottie React** - Lightweight animation library

### State Management & Data Fetching

- **TanStack Query 5.81.4** - Powerful data synchronization
- **React Router DOM 7.6.2** - Declarative routing
- **React Hot Toast** - Elegant notifications

### Charts & Visualization

- **Recharts 3.0.2** - Composable charting library

## 🏗️ Project Structure

```
src/
├── 📱 components/          # Reusable UI components
│   ├── app/               # Application-specific components
│   │   ├── Hero.tsx       # Landing page hero section
│   │   ├── Dashboard/     # Dashboard components
│   │   ├── CircleCard.tsx # Circle information display
│   │   ├── Transactions.tsx # Transaction history
│   │   └── Charts/        # Analytics charts
│   └── ui/                # Base UI components (Radix-based)
│
├── 📄 pages/              # Page components
│   ├── Landing.tsx        # Welcome/landing page
│   ├── Dashboard.tsx      # Main user dashboard
│   └── Circle.tsx         # Individual circle management
│
├── 🔗 hooks/              # Custom React hooks for Web3
│   ├── useCircle.tsx      # Circle data and operations
│   ├── useContribute.tsx  # Contribution functionality
│   ├── useClaimUsdc.tsx   # USDC claiming
│   ├── useCrossChainTxn.tsx # Cross-chain operations
│   └── useDeployIdleFunds.tsx # Yield farming deployment
│
├── 📚 lib/                # Utilities and configurations
│   ├── client.ts          # Thirdweb client setup
│   ├── utils.ts           # Helper functions
│   └── contracts.ts       # Contract configurations
│
├── 🎨 assets/             # Static assets
│   ├── images/            # Images and graphics
│   ├── lottie/            # Animation files
│   └── fonts/             # Custom fonts
│
└── 📊 mock/               # Mock data and constants
    └── index.ts           # Contract addresses and test data
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **MetaMask** or compatible Web3 wallet
- **Avalanche Fuji** testnet tokens for testing

### Installation

1. **Clone and navigate to client directory**

   ```bash
   git clone <repository-url>
   cd circles/client
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open application**
   ```
   http://localhost:5173
   ```

### Environment Setup

The application connects to Avalanche Fuji testnet by default. Make sure your wallet is configured for:

- **Network**: Avalanche Fuji Testnet
- **Chain ID**: 43113
- **RPC URL**: https://api.avax-test.network/ext/bc/C/rpc

## 🎯 Key Features & Usage

### 🏠 Dashboard Overview

- **Circle Balance**: View total USDC in your circle
- **Claimable Balance**: Check available payouts
- **Earnings Chart**: Monitor yield generation over time
- **Cross-Chain Transactions**: Track operations across chains

### 💰 Circle Operations

- **Join Circle**: Request membership with 25% approval threshold
- **Contribute**: Make monthly USDC contributions
- **Deploy Funds**: Send idle funds for cross-chain yield farming
- **Claim Rewards**: Withdraw payouts and yield earnings

### 🔄 Cross-Chain Features

- **Yield Deployment**: Automatically deploy funds to Ethereum for higher yields
- **Transaction Tracking**: Monitor CCIP messages and confirmations
- **Multi-Chain Balance**: View assets across Avalanche and Ethereum

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with HMR
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Type Checking
tsc --noEmit        # Type check without compilation
```

### Key Configuration Files

- **`vite.config.ts`** - Vite configuration with React and Tailwind
- **`tsconfig.json`** - TypeScript configuration
- **`eslint.config.js`** - ESLint rules and settings
- **`tailwind.config.js`** - Tailwind CSS customization

### Custom Hooks Overview

```typescript
// Circle management
const { data: circle, isLoading } = useCircle(address);
const { mutate: contribute } = useContribute();
const { mutate: claimUsdc } = useClaimUsdc();

// Cross-chain operations
const { mutate: deployFunds } = useDeployIdleFunds();
const { data: transactions } = useCrossChainTxn();

// Balance tracking
const circleBalance = useCircleBalance(circleAddress);
const claimableBalance = useAddressClaimableBalance(userAddress);
```

## 🎨 UI Components

### Design System

- **Color Scheme**: Dark theme optimized for DeFi applications
- **Typography**: Clean, readable font hierarchy
- **Animations**: Smooth transitions with Framer Motion
- **Responsive**: Mobile-first design approach

### Component Library

- **CircleCard**: Display circle information and stats
- **TransactionHistory**: Real-time transaction tracking
- **EarningsChart**: Visualize yield performance
- **Loading**: Elegant loading states with Lottie animations

## 🔗 Smart Contract Integration

### Connected Contracts

- **Circle Contract**: `0x2B17ec13D1E6bA06d06B39e02d0ad7FaE33D6520`
- **USDC Token**: `0x60A15CA6b63508562d0Cdc9Cf896A9e3bBF79463`
- **Yield Dispatcher**: `0xC089C6574bA12ef9Db724757Fd3886Ed49940e1f`

### Contract Interactions

- **Member Management**: Join, approve, and leave circles
- **Financial Operations**: Contribute, withdraw, deploy funds
- **Cross-Chain**: CCIP message handling and token transfers

## 🧪 Testing

```bash
# Run component tests
npm run test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

The app uses hardcoded testnet configurations. For production:

1. Set up environment variables for RPC URLs
2. Update contract addresses in `src/mock/index.ts`
3. Configure proper network settings

### Deployment Platforms

- **Vercel**

## 📊 Performance

- **Bundle Size**: Optimized with Vite tree-shaking
- **Loading**: Lazy loading for route components
- **Caching**: TanStack Query for efficient data management
- **Animations**: GPU-accelerated with Framer Motion

## 🔧 Troubleshooting

### Common Issues

1. **Wallet Connection**

   - Ensure MetaMask is installed and connected
   - Check network is set to Avalanche Fuji (43113)

2. **Transaction Failures**

   - Verify sufficient AVAX for gas fees
   - Check contract addresses are correct

3. **Cross-Chain Operations**
   - Allow extra time for CCIP message processing
   - Monitor transactions via CCIP Explorer

### Debug Mode

Enable detailed logging by setting `localStorage.debug = "circles:*"` in browser console.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Add TypeScript types for new components
- Include JSDoc comments for complex functions
- Test components thoroughly before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**⚡ Built with modern Web3 technologies for the future of decentralized finance**
