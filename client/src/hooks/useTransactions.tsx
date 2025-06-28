import { useQuery } from "@tanstack/react-query";
import type { Txn } from "@/mock";

export function useTransactions(address: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions", address],
    queryFn: async () => {
      const res = await fetch(
        `https://cdn.testnet.routescan.io/api/evm/all/transactions?count=true&ecosystem=avalanche&fromAddresses=${address}&limit=10&sort=desc&toAddresses=${address}`
      );
      const data = await res.json();
      return data.items as Txn[];
    },
  });

  return { data, isLoading, error };
}
