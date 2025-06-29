import { contract } from "@/lib/client";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";

export default function useContribute() {
  const { mutate: sendTransaction, isPending, error } = useSendTransaction();

  const onContribute = ({ amount }: { amount: bigint }) => {
    const transaction = prepareContractCall({
      contract: contract,
      method: "function contribute(uint256)",
      params: [amount],
    });
    sendTransaction(transaction);
  };

  return { onContribute, isPending, error };
}
