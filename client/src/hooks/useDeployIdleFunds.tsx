import { protocolContract } from "@/lib/client";
import { DESTINATION_CHAIN_SELECTOR, MOCK_VAULT_ADDRESS } from "@/mock";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";

export default function useDeployIdleFunds() {
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const onClick = ({ amount }: { amount: bigint }) => {
    const transaction = prepareContractCall({
      contract: protocolContract,
      method: "function deployIdleYield(uint256, uint64, address)",
      params: [
        BigInt(amount),
        BigInt(DESTINATION_CHAIN_SELECTOR),
        MOCK_VAULT_ADDRESS,
      ],
    });
    sendTransaction(transaction);
  };

  return { onClick, isPending };
}
