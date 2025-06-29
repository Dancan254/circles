import { contract } from "@/lib/client";
import { toast } from "react-hot-toast";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";

export default function useClaimUsdc() {
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const onClaim = ({ amount }: { amount: bigint }) => {
    const transaction = prepareContractCall({
      contract: contract,
      method: "function withdraw(uint256)",
      params: [amount],
    });
    sendTransaction(transaction);
    toast.success("USDC claimed!", {
      style: {
        background: "var(--background)",
        color: "var(--foreground)",
      },
    });
  };

  return { onClaim, isPending };
}
