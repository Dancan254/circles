import type { CrossChainTxn } from "@/mock";
import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_BACKEND_URL;

if (!API_URL) {
  throw new Error("VITE_BACKEND_URL is not set");
}

export function useCrossChainTxn(address: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cross-chain-txn", address],
    queryFn: async () => {
      const res = await fetch(`${API_URL}${address}`);
      console.log(res);
      const data = await res.json();
      console.log(data);
      return data as CrossChainTxn[];
    },
  });

  return { data, isLoading, error };
}
