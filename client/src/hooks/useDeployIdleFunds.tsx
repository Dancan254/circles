import { contract } from "@/lib/client";
import { DESTINATION_CHAIN_SELECTOR, MOCK_VAULT_ADDRESS } from "@/mock";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";

export default function useDeployIdleFunds() {
  const { mutate: sendTransaction, isPending, error } = useSendTransaction();

  const onClick = ({ amount }: { amount: bigint }) => {
    console.log("Amount", amount);
    const transaction = prepareContractCall({
      contract: contract,
      method: "function deployIdleYield(uint256, uint64, address)",
      params: [
        BigInt(amount),
        BigInt(DESTINATION_CHAIN_SELECTOR),
        MOCK_VAULT_ADDRESS,
      ],
    });
    sendTransaction(transaction);
    console.log("Error", error);
  };

  return { onClick, isPending };
}
