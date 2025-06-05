import { useQuery } from "@tanstack/react-query";

const BASE_URL = "http://localhost:8080";

export function useGetUser(walletAddress?: string) {
  return useQuery({
    queryKey: ["user", walletAddress],
    enabled: !!walletAddress,
    queryFn: async ({ queryKey }) => {
      const walletAddress = queryKey[1] as string;
      const response = await fetch(`${BASE_URL}/api/v1/users/${walletAddress}`);
      return response.json();
    },
  });
}
