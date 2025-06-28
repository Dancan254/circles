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
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { useCrossChainTxn } from "@/hooks/useCrossChainTxn";
import { loadingStates, type CrossChainTxn } from "@/mock";
import Loading from "./Loading";
import { CheckCircle, ExternalLink, Loader2, X } from "lucide-react";
import { getChainImage, getChainName } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useState } from "react";
import loading from "@/assets/lottie/success.json";
import Lottie from "lottie-react";

const ADDRESS = "0xc089c6574ba12ef9db724757fd3886ed49940e1f";

export default function CrossChainTxn() {
  const { data: transactions, isLoading, error } = useCrossChainTxn(ADDRESS);
  const [showTxnStatus, setShowTxnStatus] = useState(false);
  const [showSuccessTxn, setShowSuccessTxn] = useState(false);

  if (isLoading) {
    return <Loading size="xs" />;
  }

  if (error || !transactions) {
    return (
      <div className="flex items-center justify-center h-[300px] text-primary">
        Error: {error?.message}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-primary">
        No Cross-Chain transactions found
      </div>
    );
  }

  if (showTxnStatus) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader
          loadingStates={loadingStates}
          loading={showTxnStatus}
          duration={2000}
          closeCallback={closeSuccessTxn}
        />
      </div>
    );
  }

  if (showSuccessTxn) {
    return (
      <div className="flex items-center flex-col h-screen justify-center backdrop-blur-sm bg-black/20 absolute top-0 left-0 w-full z-[100]">
        <Lottie
          animationData={loading}
          loop={true}
          className="md:h-1/2 md:w-1/2"
        />
        <p className="text-muted-foreground text-lg font-bold">
          Transaction Successful
        </p>
        <button
          className="text-primary underline text-md font-bold mt-4"
          onClick={() => setShowSuccessTxn(false)}
        >
          Close
        </button>
      </div>
    );
  }

  function onRowClick(transaction: CrossChainTxn) {
    if (transaction.state === 2) {
      setShowSuccessTxn(true);
    } else {
      setShowTxnStatus(true);
    }
  }

  function closeSuccessTxn() {
    setShowTxnStatus(false);
  }

  return (
    <Table className="mt-4">
      <TableCaption className="text-gray-400">
        Five of your circle's latest cross-chain transactions.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px] text-muted-foreground text-lg hidden md:table-cell">
            Message ID
          </TableHead>
          <TableHead className="text-muted-foreground text-lg hidden md:table-cell">
            Source Txn
          </TableHead>
          <TableHead className="text-muted-foreground text-lg">From</TableHead>
          <TableHead className="text-muted-foreground text-lg">To</TableHead>
          <TableHead className="text-muted-foreground text-lg hidden md:table-cell">
            Rcpt Timestamp
          </TableHead>
          <TableHead className="text-muted-foreground text-lg text-center">
            Status
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.slice(0, 5).map((transaction) => (
          <TableRow
            key={transaction.messageId}
            className="h-12"
            onClick={() => onRowClick(transaction)}
          >
            <TableCell className="font-medium md:flex items-center gap-2 text-primary text-md hidden">
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
            <TableCell className="text-md text-muted-foreground hidden md:table-cell">
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
            <TableCell className="text-md hidden md:table-cell">
              {new Date(transaction.receiptTimestamp).toLocaleString()}
            </TableCell>
            <TableCell className="flex justify-center">
              <div
                className={`border rounded-2xl p-2 w-[100px] ${
                  transaction.state === 2
                    ? "border-green-500 bg-green-500/20"
                    : transaction.state === null
                    ? "border-yellow-500 bg-yellow-500/20"
                    : "bg-primary/20"
                }`}
              >
                <div className="flex items-center gap-1 ">
                  {transaction.state === 2 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : transaction.state === null ? (
                    <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                  <p className="text-xs">
                    {transaction.state === 2
                      ? "Success"
                      : transaction.state === null
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
