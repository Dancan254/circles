import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCrossChainTxn } from "@/hooks/useCrossChainTxn";
import type { CrossChainTxn } from "@/mock";
import Loading from "./Loading";
import { CheckCircle, ExternalLink, Loader2, X } from "lucide-react";
import { getChainImage, getChainName } from "@/lib/utils";
import { Link } from "react-router-dom";

const ADDRESS = "0x0bd7dd9a885d9526ff82813829ef5c7d8afdb8c4";

export default function CrossChainTxn() {
  const { data: transactions, isLoading, error } = useCrossChainTxn(ADDRESS);
  console.log(transactions);

  if (isLoading) {
    return <Loading size="xs" />;
  }

  if (error || !transactions) {
    return (
      <div className="flex items-center justify-center h-screen text-primary">
        Error: {error?.message}
      </div>
    );
  }

  return (
    <Table className="mt-4">
      <TableCaption className="text-gray-400">
        A five of your latest cross-chain transactions.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px] text-muted-foreground text-lg">
            Message ID
          </TableHead>
          <TableHead className="text-muted-foreground text-lg">
            Source Txn
          </TableHead>
          <TableHead className="text-muted-foreground text-lg">From</TableHead>
          <TableHead className="text-muted-foreground text-lg">To</TableHead>
          <TableHead className="text-muted-foreground text-lg text-center">
            Status
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.slice(0, 5).map((transaction) => (
          <TableRow key={transaction.messageId} className="h-12">
            <TableCell className="font-medium flex items-center gap-2 text-primary text-md">
              {transaction.messageId.slice(0, 6)}...
              {transaction.messageId.slice(-4)}
              <ExternalLink
                className="w-4 h-4 cursor-pointer"
                onClick={() => {
                  window.open(
                    `https://ccip.chain.link/tx/${transaction.messageId}`,
                    "_blank"
                  );
                }}
              />
            </TableCell>
            <TableCell className="text-md text-muted-foreground">
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    to={`https://ccip.chain.link/tx/${transaction.transactionHash}`}
                    target="_blank"
                    className="flex items-center gap-1"
                  >
                    {transaction.transactionHash.slice(0, 6)}...
                    {transaction.transactionHash.slice(-4)}
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View on Etherscan</p>
                </TooltipContent>
              </Tooltip>
            </TableCell>
            <TableCell className="text-md">
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-1">
                    <img
                      src={getChainImage(transaction.sourceNetworkName)}
                      alt="sender"
                      className="w-6 h-6"
                    />
                    {transaction.sender.slice(0, 6)}...
                    {transaction.sender.slice(-4)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getChainName(transaction.sourceNetworkName)}</p>
                </TooltipContent>
              </Tooltip>
            </TableCell>
            <TableCell className="text-md">
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-1">
                    <img
                      src={getChainImage(transaction.destNetworkName)}
                      alt="sender"
                      className="w-6 h-6"
                    />
                    {transaction.receiver.slice(0, 6)}...
                    {transaction.receiver.slice(-4)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getChainName(transaction.destNetworkName)}</p>
                </TooltipContent>
              </Tooltip>
            </TableCell>
            <TableCell className="flex justify-center">
              <div
                className={`border rounded-2xl p-2 w-[100px] ${
                  transaction.state === 2
                    ? "border-green-500 bg-green-500/20"
                    : transaction.state === 2
                    ? "border-yellow-500 bg-yellow-500/20"
                    : "bg-primary/20"
                }`}
              >
                <div className="flex items-center gap-1 ">
                  {transaction.state === 2 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : transaction.state === 1 ? (
                    <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                  <p className="text-xs">
                    {transaction.state === 2
                      ? "Success"
                      : transaction.state === 1
                      ? "Pending"
                      : "Failed"}
                  </p>
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
