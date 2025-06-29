import { contract } from "@/lib/client";
import { useReadContract } from "thirdweb/react";

export default function useMembers() {
  const { data, isLoading, isError } = useReadContract({
    contract: contract,
    method: "function getMembers() view returns (address[] memory)",
  });
  return { data, isLoading, isError };
}
