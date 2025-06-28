import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import usdc from "@/assets/lottie/usdc.svg";
import { Copy, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { useTransactions } from "@/hooks/useTransactions";
import Loading from "./Loading";
import { getEcosystemImage } from "@/lib/utils";

const ADDRESS = "0x4D2BEa56B2A2f894ceaee449E81242235984FC54";

function Transactions() {
  const { data, isLoading, error } = useTransactions(ADDRESS);

  if (isLoading) {
    return <Loading size="xs" />;
  }

  if (error || !data) {
    return <div>Error: {error?.message}</div>;
  }

  if (data.length === 0) {
    return (
      <div className="text-muted-foreground text-center text-sm mt-4">
        No transactions found
      </div>
    );
  }

  return (
    <Table className="mx-2 md:mx-0 mb-8">
      <TableCaption className="text-gray-500">
        A list of recent pool transactions.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] text-muted-foreground">
            Ecosystem
          </TableHead>
          <TableHead className="text-muted-foreground">Token</TableHead>
          <TableHead className="text-muted-foreground">Address</TableHead>
          <TableHead className="text-muted-foreground text-center">
            Txn Hash
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((transaction) => (
          <TableRow key={transaction.txHash} className="my-2">
            <TableCell className="w-[100px]">
              {transaction.ecosystems.map((ecosystem) => (
                <img
                  src={getEcosystemImage(ecosystem)}
                  alt={ecosystem}
                  className="w-4 h-4"
                />
              ))}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <img src={usdc} alt="usdc" className="w-6 h-6" />
                <span className="text-muted-foreground text-sm">USDC</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground text-sm flex items-center gap-1 cursor-pointer">
                  {transaction.from.id.slice(0, 6)}...
                  {transaction.from.id.slice(-4)}
                  <Copy
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(transaction.from.id);
                      toast.success("Copied to clipboard", {
                        style: {
                          background: "var(--background)",
                          color: "var(--foreground)",
                        },
                      });
                    }}
                  />
                </span>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex items-center gap-1 text-primary underline justify-center">
                {transaction.txHash.slice(0, 6)}...
                {transaction.txHash.slice(-4)}
                <ExternalLink
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => {
                    window.open(
                      `https://testnet.snowtrace.io/tx/${transaction.txHash}`,
                      "_blank"
                    );
                  }}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default Transactions;
