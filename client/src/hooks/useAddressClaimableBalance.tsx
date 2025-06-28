import { useReadContract } from "thirdweb/react";
import { contract } from "@/lib/client";

export default function useAddressClaimableBalance(address: string) {
  const { data, isLoading, error } = useReadContract({
    contract,
    method: "function withdrawableAmount(address) returns(uint256)",
    params: [address],
  });
  return { data, isLoading, error };
}
