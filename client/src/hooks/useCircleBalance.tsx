import { useWalletBalance } from "thirdweb/react";
import { avalancheFuji } from "thirdweb/chains";
import { client } from "@/lib/client";
import { TOKEN_ADDRESS } from "@/mock";
import { convertBalance } from "@/lib/utils";

export const useCircleBalance = (circleAddress: string) => {
  const { data, isLoading, isError } = useWalletBalance({
    chain: avalancheFuji,
    address: circleAddress,
    client,
    tokenAddress: TOKEN_ADDRESS,
  });

  return {
    data: convertBalance(data?.value),
    isLoading,
    isError,
  };
};
