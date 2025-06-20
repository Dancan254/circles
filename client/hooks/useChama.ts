import { useMutation, useQuery } from "@tanstack/react-query";

const BASE_URL = "http://localhost:8080";

export function useGetChama(walletAddress?: string) {
  return useQuery({
    queryKey: ["chama", walletAddress],
    enabled: !!walletAddress,
    queryFn: async ({ queryKey }) => {
      const walletAddress = queryKey[1] as string;
      const response = await fetch(
        `${BASE_URL}/api/v1/chamas/${walletAddress}`
      );
      return response.json();
    },
  });
}

export function useGetAllChamas() {
  return useQuery({
    queryKey: ["chamas"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/api/v1/chamas`);
      return response.json();
    },
  });
}

export function useIsMemberOfChama(
  chamaAddress: string,
  walletAddress: string
) {
  return useQuery({
    queryKey: ["isMemberOfChama", chamaAddress, walletAddress],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/api/v1/chamas/${chamaAddress}`);
      const data = await response.json();

      return data.members.includes(walletAddress);
    },
  });
}

export function useJoinChama(chamaAddress: string, walletAddress: string) {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${BASE_URL}/api/v1/chamas/${chamaAddress}/members/${walletAddress}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.json();
    },
  });
}
