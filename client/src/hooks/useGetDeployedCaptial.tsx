import { useWalletBalance } from "thirdweb/react";
import { client } from "@/lib/client";
import { MOCK_VAULT_ADDRESS, TOKEN_ADDRESS } from "@/mock";
import { sepolia } from "thirdweb/chains";
import { convertBalance } from "@/lib/utils";

export default function useGetDeployedCapital() {
  const { data, isLoading, isError } = useWalletBalance({
    chain: sepolia,
    address: MOCK_VAULT_ADDRESS,
    client,
    tokenAddress: TOKEN_ADDRESS,
  });

  return { data: convertBalance(data?.value), isLoading, isError };
}
