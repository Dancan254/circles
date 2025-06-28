import { contract } from "@/lib/client";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";

export default function useNextRecipient() {
  const { mutate: sendTransaction, isPending } = useSendTransaction();
  const onClick = () => {
    const transaction = prepareContractCall({
      contract,
      method: "function selectNextRecipient()",
      params: [],
    });
    sendTransaction(transaction);
  };

  return { onClick, isPending };
}
