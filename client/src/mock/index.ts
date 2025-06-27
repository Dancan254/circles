import circle from "@/assets/images/pool.png";
import avax from "@/assets/lottie/avax.png";

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
