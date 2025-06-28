import { contract } from "@/lib/client";
import { useReadContract } from "thirdweb/react";
import { useCircleBalance } from "./useCircleBalance";
import { CIRCLE_ADDRESS } from "@/mock";
import type { Circle } from "@/mock";
import banner from "@/assets/images/pool.png";
import avax from "@/assets/lottie/avax.png";

export default function useCircle(address: string) {
  const { data: circleBalance, isLoading: circleBalanceLoading } =
    useCircleBalance(CIRCLE_ADDRESS);

  const { data, isLoading, error } = useReadContract({
    contract,
    method: "function getMembers() returns(address[])",
    params: [address],
  });

  const circle: Circle = {
    address,
    balance: circleBalance,
    members: data?.length || 0,
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
    apy: 30,
    icon: banner,
  };

  return { circle, isLoading: circleBalanceLoading || isLoading, error };
}
