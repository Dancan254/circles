import { useReadContract } from "thirdweb/react";
import { protocolContract } from "@/lib/client";
import { DESTINATION_CHAIN_SELECTOR } from "@/mock";

export default function useGetDeployedCapital() {
  const { data, isPending } = useReadContract({
    contract: protocolContract,
    method: "function getDeployedCapitalOnChain(uint64) view returns (uint256)",
    params: [BigInt(DESTINATION_CHAIN_SELECTOR)],
  });

  return { data, isPending };
}
