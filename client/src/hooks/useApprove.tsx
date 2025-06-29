import { tokenContract } from "@/lib/client";
import { CIRCLE_ADDRESS } from "@/mock";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";

export default function useApprove() {
  const { mutate: sendTransaction, isPending, error } = useSendTransaction();

  const onApprove = ({ amount }: { amount: bigint }): boolean => {
    const transaction = prepareContractCall({
      contract: tokenContract,
      method: "function approve(address, uint256) returns (bool)",
      params: [CIRCLE_ADDRESS, amount],
    });
    sendTransaction(transaction);
    return true;
  };

  return { onApprove, isPending, error };
}
