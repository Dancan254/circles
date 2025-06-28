# 🌍 **Circles: Cross-Chain Savings Circles for Everyone**

_Bringing traditional African savings circles to DeFi with Chainlink-powered automation and cross-chain yield optimization_

---

## 🎯 **The Problem We're Solving**

Across Africa and many emerging markets, **savings circles** (known as tandas in Latin America, chamas in Kenya or tontines in West Africa) are a cornerstone of financial life. These rotating credit associations help millions of people save, invest, and access credit. However, traditional savings circles face significant challenges:

**Manual Coordination Nightmare**: Members rely on WhatsApp groups, Excel spreadsheets and manual reminders. Disputes arise when someone misses a payment or questions the payout order. There's no transparent, neutral mechanism to enforce rules or determine winners.

**Lost Earning Potential**: Pooled money sits idle in bank accounts earning minimal interest. Members miss out on DeFi yields that could 10x their returns, with no way to earn while waiting for their payout turn.

**Trust and Transparency Issues**: Traditional circles usually rely on a treasurer who manages all funds manually. These treasurers sometimes misplace or lose funds, creating disputes and eroding trust. With blockchain technology, everyone maintains individual ownership and all funds are viewable on-chain, eliminating the single point of failure and ensuring complete transparency.

**DeFi Complexity Barrier**: Accessing yield requires navigating multiple chains, bridges, and protocols. High gas fees and technical knowledge exclude most potential users. Fragmented liquidity means missing better opportunities on other chains.

Circles transforms traditional savings circles into automated, yield-generating, cross-chain financial instruments powered by Chainlink's oracle infrastructure. Members' USDC automatically deploys to highest-yielding protocols across multiple chains, earning 5-15% APY while waiting for their payout turn (vs 0% in traditional circles). Chainlink VRF provides unbiased recipient selection, while CCIP enables seamless cross-chain fund deployment without complex bridging.

---

## 🛠️ **Problems Encountered**

**Cross-Chain Withdrawal Zero Token Error**: We encountered a critical bug during the implementation of our cross-chain withdrawal flow. When users requested withdrawals, we first send a withdrawal message from Fuji to our YieldExecutor on Sepolia, which withdraws funds from yield protocols and sends them back cross-chain to the user's destination. However, we kept getting the error `0x5cf04449` when sending the initial withdrawal signal from Fuji to Sepolia. After extensive debugging and digging through Chainlink's GitHub documentation, we discovered this error translates to "Thrown when attempting to send a token with amount zero." The issue was that we were sending a pure message without any token transfer since we're requesting a withdrawal, not depositing. We solved this by including a negligible amount of 1 wei in the CCIP message to satisfy the non-zero token requirement while maintaining the withdrawal logic.

**Cross-Chain State Synchronization Bug**: We ran into a critical issue where member balances and yield earnings were getting out of sync across chains during high-frequency operations. The problem occurred when CCIP messages arrived out of order, causing the Avalanche hub to show different balances than what was actually deployed on Ethereum. We solved this by implementing a hub-and-spoke model with sequence numbers and message acknowledgments, ensuring Avalanche remains the authoritative state layer while using CCIP for reliable cross-chain messaging with proper ordering guarantees.

**VRF Randomness Integration Hurdle**: Initially, we struggled with integrating Chainlink VRF V2 Plus for fair recipient selection. The callback function wasn't properly handling the randomness fulfillment, causing payout selections to fail silently. After debugging, we discovered we needed to properly implement the subscription model and handle both native and LINK payment methods. We fixed this by restructuring our VRF integration with proper error handling and implementing a robust callback mechanism that stores the random words and triggers recipient selection only after successful fulfillment.

**Gas Optimization Challenge**: Our automated yield dispatcher was consuming excessive gas when monitoring rates across multiple protocols and triggering rebalancing operations. The initial implementation was calling external price feeds too frequently and making unnecessary cross-chain calls. We optimized this by implementing a threshold-based system using Chainlink Data Feeds that only triggers rebalancing when yield differentials exceed gas costs, and batching multiple operations into single CCIP messages to reduce overall transaction costs.

---

## 🏆 **Hackathon Track Alignment**

### 🔗 **Onchain Finance Track**

Circles brings a completely new financial primitive to DeFi by digitizing traditional savings circles used by hundreds of millions of people worldwide. Unlike existing DeFi lending protocols that focus on individual borrowers and lenders, we've created the first automated rotating savings group (ROSCA) that combines the social trust of community finance with the transparency and efficiency of blockchain technology.

**Technical Innovation**: Our smart contracts implement sophisticated member management with 25% approval thresholds for new joiners, automated monthly contribution collection, and Chainlink VRF-powered fair recipient selection. While members wait for their payout turn, idle funds automatically deploy to yield-generating protocols via CCIP, earning 5-15% APY compared to 0% in traditional circles.

**Chainlink Integration (5 Services = Maximum Bonus Points)**: VRF V2 Plus for cryptographically secure recipient selection, CCIP for cross-chain fund deployment and yield optimization, Automation for scheduled monthly payout cycles, Data Feeds for real-time yield rate monitoring, and Cross-Chain Tokens for seamless USDC bridging with burn/mint pools.

**Market Impact**: This represents genuine financial innovation that extends existing DeFi infrastructure, creating new use cases for the 200M+ people who participate in traditional savings circles globally. We're tokenizing $100B+ in annual informal savings volume while maintaining the familiar social structure that users trust.

### 🌐 **Cross-Chain Solutions Track**

Traditional DeFi forces users to choose a single chain and manually bridge funds to access better yields. Circles eliminates this friction entirely by creating a unified cross-chain experience where users deposit once on Avalanche and their funds work across Ethereum and other networks automatically.

**True Cross-Chain Architecture**: Our CCIP integration enables intelligent fund deployment where idle USDC from savings circles automatically flows to the highest-yielding protocols across chains. The YieldDispatcher on Avalanche communicates with YieldExecutor contracts on Ethereum, deploying funds to ERC4626 vaults and harvesting yields seamlessly.

**Technical Implementation**: We've implemented custom burn/mint USDC tokens that maintain identical addresses across chains, making cross-chain transfers feel as seamless as local transactions. Rate limiting (1M USDC capacity, 100K/second refill) and allowlisted destinations ensure security while maintaining efficiency.

**User Experience**: Members can deposit on Avalanche, earn yield on Ethereum, and withdraw on any supported chain without ever thinking about bridges or gas tokens. The system automatically rebalances funds based on yield opportunities, moving capital to where it generates the highest returns while maintaining the social savings circle structure.

### ⛷️ **Avalanche Track**

We chose Avalanche as our primary deployment chain because its fast finality and low costs make it perfect for the frequent small transactions that characterize savings circles. Our complete smart contract suite is deployed on Fuji testnet, showcasing a fully functional DeFi application that leverages Chainlink's full oracle infrastructure.

**Core Deployed Contracts on Fuji**: Circle Contract (`0x57a867C0410c98C1BF637D933B46367E489088DF`) manages member pools and contributions, YieldDispatcher (`0xa3e73B9E6261A950616881a8A084842efB9bdC49`) routes funds cross-chain for yield, Custom USDC Token (`0x60A15CA6b63508562d0Cdc9Cf896A9e3bBF79463`) enables burn/mint bridging, and CCIP Token Pool (`0x2D9bf08C367fe7CF2d5d76E43fCFE46cE7660691`) handles cross-chain transfers.

**Technical Innovation**: Uses 5 Chainlink services (VRF, CCIP, Automation, Data Feeds, Cross-Chain Tokens) for maximum bonus points. Automated recipient selection using Chainlink VRF every 30 days, cross-chain yield optimization deploying idle funds from Avalanche to Ethereum vaults, and custom burn/mint USDC implementation enabling seamless cross-chain transfers.

**Market Impact**: Our DeFi innovation creates entirely new financial products - programmable savings circles with automated yield generation serving the 200M+ people who participate in traditional savings circles globally (representing $100B+ annual volume). This opens possibilities for financial inclusion in emerging markets where traditional banking is limited but informal savings groups are widespread, creating a technology bridge that connects traditional community finance to modern DeFi.

---

_Built with ❤️ for the Chainlink Constellation Hackathon_
