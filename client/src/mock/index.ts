import circle from "@/assets/images/pool.png";
import avax from "@/assets/lottie/avax.png";

export const ROLE =
  "0x0eef666beafdac323f3c3096f2bd07e212d61fe2936864cef12d518ed6522f83";

export const TOKEN_ADDRESS = "0x60A15CA6b63508562d0Cdc9Cf896A9e3bBF79463";
export const TOKEN_DECIMALS = 18;
export const CIRCLE_ADDRESS = "0xb8c7fb66D2f2d71F47378CAcA7f9ca32008F3286";
export const CIRCLE_DISPATCHER_ADDRESS =
  "0xc089c6574ba12ef9db724757fd3886ed49940e1f";
export const PROTOCOL_ADDRESS = "0xC089C6574bA12ef9Db724757Fd3886Ed49940e1f";
export const DESTINATION_CHAIN_SELECTOR = "16015286601757825753";
export const MOCK_VAULT_ADDRESS = "0xB96C5d0a79B7901A49DB43782CdD8E35720971Be";

export interface Network {
  name: string;
  chainId: number;
  icon: string;
}

export interface History {
  type: "deposit" | "withdraw" | "borrow" | "repay";
  amount: number;
  address: string;
  chain: Network;
  date: string;
  id: number;
}

export interface Circle {
  address: string;
  members: number;
  balance: number;
  investedChain: Network[];
  onChain: Network;
  apy: number;
  icon: string;
}

export interface CircleDetails extends Circle {
  txnHistory: History[];
}

export const CIRCLES: Circle[] = [
  {
    address: "0x1234567890123456789012345678901234567890",
    members: 2,
    balance: 1000,
    investedChain: [
      {
        name: "Ethereum",
        chainId: 1,
        icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1747033579",
      },
      {
        name: "Polygon Mumbai",
        chainId: 80001,
        icon: "https://developers.moralis.com/wp-content/uploads/web3wiki/116-mumbai/637adca2e1a09547acd85968_Y_44LwHNRnOEvnRExgnO1UujtZwn7zq7BCb4oxxHgpI-300x300.jpeg",
      },
    ],
    onChain: {
      name: "Avalanche",
      chainId: 43114,
      icon: avax,
    },
    apy: 100,
    icon: circle,
  },
];

export const CIRCLE_DETAILS: CircleDetails[] = [
  {
    ...CIRCLES[0],
    txnHistory: [
      {
        type: "deposit",
        id: 1,
        amount: 1,
        address: "0x123456789012345678901234567890124567890",
        chain: CIRCLES[0].onChain,
        date: "June 27, 2025",
      },
      {
        type: "deposit",
        id: 2,
        amount: 1,
        address: "0x123456789012345678901234567890124567890",
        chain: CIRCLES[0].onChain,
        date: "June 27, 2025",
      },
      {
        type: "withdraw",
        id: 3,
        amount: 1,
        address: "0x123456789012345678901234567890124567890",
        chain: CIRCLES[0].onChain,
        date: "June 27, 2025",
      },
    ],
  },
];

export interface CrossChainTxn {
  messageId: string;
  state: number;
  transactionHash: string;
  onrampAddress: string;
  sender: string;
  origin: string;
  receiver: string;
  blockTimestamp: string; // ISO date string
  receiptTimestamp: string; // ISO date string
  sourceNetworkName: string;
  destNetworkName: string;
  tokenAmounts: {
    token: string;
    amount: string;
  }[];
  feeToken: string;
  feeTokenAmount: string;
  nonce: number;
  strict: boolean;
  data: string;
  gasLimit: string;
  sequenceNumber: number;
  destTransactionHash: string;
  offrampAddress: string;
  commitStoreAddress: string;
  infoRaw: string; // JSON string
}

export const networks = [
  {
    name: "Avalanche Fuji",
    icon: avax,
  },
  {
    name: "Ethereum Sepolia",
    icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1746003173",
  },
  {
    name: "Polygon Mumbai",
    icon: "https://developers.moralis.com/wp-content/uploads/web3wiki/116-mumbai/637adca2e1a09547acd85968_Y_44LwHNRnOEvnRExgnO1UujtZwn7zq7BCb4oxxHgpI-300x300.jpeg",
  },
];

export const loadingStates = [
  {
    text: "Preparing Transaction on Origin Chain",
  },
  {
    text: "Submitting to Source Chain",
  },
  {
    text: "Onramp: Locking/Transferring Tokens",
  },
  {
    text: "Message Sent via CCIP Network",
  },
  {
    text: "Relaying to Destination Chain",
  },
  {
    text: "Offramp: Receiving Tokens",
  },
  {
    text: "Transaction Finalized on Destination Chain",
  },
  {
    text: "Cross-Chain Transfer Complete",
  },
];

export interface Txn {
  chainId: string;
  ecosystems: string[];
  blockNumber: number;
  txIndex: number;
  timestamp: string; // ISO date string
  from: {
    id: string;
    isContract: boolean;
  };
  to: {
    id: string;
    isContract: boolean;
  };
  blockHash: string;
  txHash: string;
  value: string;
  gasLimit: string;
  gasUsed: string;
  gasPrice: string;
  burnedFees: string;
  methodId: string;
  type: string;
  status: boolean;
}
