import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type History } from "@/mock";
import usdc from "@/assets/lottie/usdc.svg";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

function Transactions({ transactions }: { transactions: History[] }) {
  return (
    <Table className="mx-2 md:mx-0 mb-8">
      <TableCaption className="text-gray-500">
        A list of recent pool transactions.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Network</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Address</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id} className="my-2">
            <TableCell>
              <img
                src={transaction.chain.icon}
                alt={transaction.chain.name}
                className="w-4 h-4"
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <img src={usdc} alt="usdc" className="w-4 h-4" />
                {transaction.amount}
                <span className="text-muted-foreground text-sm">USDC</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground text-sm flex items-center gap-1 cursor-pointer">
                  {transaction.address.slice(0, 6)}...
                  {transaction.address.slice(-4)}
                  <Copy
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(transaction.address);
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
            <TableCell className="text-right">{transaction.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default Transactions;
