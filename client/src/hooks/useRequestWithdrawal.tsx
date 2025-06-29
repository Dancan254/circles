import { contract } from "@/lib/client";
import { DESTINATION_CHAIN_SELECTOR, PROTOCOL_ADDRESS } from "@/mock";
import { toast } from "react-hot-toast";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";

export default function useRequestWithdrawal() {
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const onRequestWithdrawal = ({
    amount,
    circleAddress,
  }: {
    amount: bigint | undefined;
    circleAddress: string;
  }) => {
    if (amount === BigInt(0) || !amount) {
      toast.error("Amount cannot be 0", {
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
        },
      });
      return;
    }
    const transaction = prepareContractCall({
      contract: contract,
      method: "function requestWithdrawal(uint64, uint256, address, address)",
      params: [
        BigInt(DESTINATION_CHAIN_SELECTOR),
        BigInt(amount),
        circleAddress,
        PROTOCOL_ADDRESS,
      ],
    });
    sendTransaction(transaction);
  };

  return { onRequestWithdrawal, isPending };
}
