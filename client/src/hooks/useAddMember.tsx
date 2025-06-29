import { contract } from "@/lib/client";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";

export default function useAddMember() {
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const onAddMember = (address: string) => {
    const transaction = prepareContractCall({
      contract,
      method: "function approveMember(address _member)",
      params: [address],
    });
    sendTransaction(transaction);
  };
  return { onAddMember, isPending };
}
