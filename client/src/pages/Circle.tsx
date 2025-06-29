import { FullEarningsChart } from "@/components/app/FullEarningsChart";
import Transactions from "@/components/app/Transactions";
import { getConversionRate, splitBalance } from "@/lib/utils";
import { networks } from "@/mock";
import {
  ArrowLeft,
  Copy,
  DollarSign,
  ExternalLink,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { prepareEvent } from "thirdweb";
import { useContractEvents } from "thirdweb/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCircle from "@/hooks/useCircle";
import Loading from "@/components/app/Loading";
import { toast } from "react-hot-toast";
import { contract } from "@/lib/client";
import useNextRecipient from "@/hooks/useNextRecipient";

function Circle() {
  const { address } = useParams();
  const preparedEvent = prepareEvent({
    signature:
      "event SelectedRecipient(address indexed recipient, uint256 amount)",
  });

  const { data: event } = useContractEvents({
    contract,
    events: [preparedEvent],
  });
  const recipient =
    event?.length !== 0 ? event?.[event.length - 1]?.args.recipient : address;
  const { onClick, isPending } = useNextRecipient();

  const { circle, isLoading } = useCircle(address as string);
  const { integerPart, decimalPart } = splitBalance(circle?.balance);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
  const [amount, setAmount] = useState(0);

  if (isLoading) {
    return <Loading size="lg" />;
  }
  return (
    <motion.div
      className="my-0 max-w-7xl mx-auto mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/dashboard" className="flex items-center gap-2 mb-4 mx-2">
        <ArrowLeft />
        <p>Back Home</p>
      </Link>
      <motion.div
        className="flex items-center justify-start px-2 md:px-0"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.div
          className="flex flex-col w-full max-w-5xl mx-auto"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        >
          <p className="text-muted-foreground text-md md:text-2xl mx-2">
            Circle Balance
          </p>
          <h1 className="text-2xl md:text-5xl flex items-center mt-2">
            <DollarSign className="w-10 h-10 text-primary" />
            <span className="text-muted-foreground text-3xl md:text-5xl">
              {integerPart}
              <span className="text-lg text-primary">.{decimalPart}</span>
            </span>
          </h1>
          <p className="text-muted-foreground text-sm mt-2 mx-2">
            ≈ Approx. {getConversionRate(circle?.balance, "usdc")} USDC
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col items-center md:flex-row gap-2 md:gap-4 mx-0 md:mx-2"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <div className="flex gap-2 items-center">
            <p className="text-muted-foreground text-sm md:text-lg">
              <span className="text-primary text-md md:text-2xl">0x</span>
              {circle?.address.slice(2, 6)}...
              {circle?.address.slice(-4)}
            </p>
            <Copy
              className="w-4 h-4 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(circle?.address || "");
                toast.success("Circle Address copied to clipboard", {
                  style: {
                    background: "var(--background)",
                    color: "var(--foreground)",
                  },
                });
              }}
            />
          </div>
          <div className="flex flex-row gap-1 items-center justify-center rounded-2xl mr-4">
            <img
              src={circle?.onChain.icon}
              alt={circle?.onChain.name}
              className="w-6 h-6"
            />
            <h1 className="text-sm flex items-center">
              {circle?.onChain.name}
            </h1>
          </div>
        </motion.div>
      </motion.div>
      <div className="max-w-7xl mx-auto mt-8">
        <div className="flex gap-2 md:items-center mx-2 md:mx-0 flex-row justify-between w-full overflow-x-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="flex flex-row gap-2 items-center mx-2 md:mx-0"
          >
            <button
              className="text-sm w-[200px] font-bold bg-transparent text-white border border-gray-700 rounded-3xl py-2 px-4 flex items-center gap-1"
              onClick={onClick}
            >
              Refresh Recipient
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="text-sm font-bold w-[200px]  bg-transparent hover:bg-primary/20 text-primary border border-primary rounded-3xl py-2 px-4 flex items-center gap-1"
            >
              Deploy Idle USDC
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="flex flex-row gap-2 items-center mx-2 md:mx-0"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="text-sm font-bold w-[200px]  flex items-center gap-1 hover:bg-primary/20 transition-colors duration-300 bg-transparent text-primary border border-primary rounded-3xl py-2 px-4"
            >
              Add Member
              <Plus className="w-4 h-4" />
            </button>
            <button
              className="text-sm font-bold w-[200px]  bg-transparent text-white border border-gray-700 rounded-3xl py-2 px-4 flex items-center gap-1"
              onClick={onClick}
            >
              Withdraw Investment
            </button>
          </motion.div>
        </div>
        <div className="flex flex-row md:items-center justify-between">
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-muted-foreground text-sm mx-2 md:mx-0 mt-4"
          >
            Next Recipient Address:
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Link
                to={`https://etherscan.io/address/${circle?.address}`}
                target="_blank"
                className="text-gray-400 underline text-sm w-fit flex items-center gap-1 mt-1 hover:text-primary transition-colors duration-300"
              >
                {recipient?.slice(0, 6)}...
                {recipient?.slice(-4)}
                <ExternalLink className="w-4 h-4 cursor-pointer" />
              </Link>
            )}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-muted-foreground text-sm mx-2 md:mx-0 mt-4"
          >
            Available Investment:
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Link
                to={`https://etherscan.io/address/${circle?.address}`}
                target="_blank"
                className="text-gray-400 underline text-sm w-fit flex items-center gap-1 mt-1 hover:text-primary transition-colors duration-300"
              >
                {circle?.balance} USDC
                <ExternalLink className="w-4 h-4 cursor-pointer" />
              </Link>
            )}
          </motion.p>
        </div>
      </div>
      <motion.div
        className="max-w-7xl mx-auto mt-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
      >
        <motion.h1
          className="text-muted-foreground text-2xl md:text-3xl mx-2 my-4 md:mx-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        >
          Investment Report
        </motion.h1>
        <motion.h1
          className="text-muted-foreground text-sm mx-2 md:mx-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
        >
          Invested on:
        </motion.h1>
        <motion.div
          className="flex flex-row gap-2 items-center mb-4 mx-2 md:mx-0"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.5,
              },
            },
          }}
        >
          {circle?.investedChain.map((chain) => (
            <motion.div
              key={chain.name}
              className="flex flex-row items-center justify-center border border-gray-700 rounded-2xl p-2 mt-2 gap-1 cursor-pointer"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, ease: "easeOut" },
                },
              }}
            >
              <img
                src={chain.icon}
                alt={chain.name}
                className="w-6 h-6 rounded-full"
              />
              <h1 className="text-sm flex items-center">{chain.name}</h1>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          <FullEarningsChart />
        </motion.div>
        <motion.h1
          className="text-muted-foreground text-2xl md:text-3xl mx-2 my-2 md:mx-0 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
        >
          Transactions
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <Transactions />
        </motion.div>
      </motion.div>
      {isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-5xl bg-transparent border border-gray-700 rounded-2xl p-1 md:p-2 mx-2 md:mx-0"
            >
              <div className="flex flex-col gap-2 bg-background rounded-2xl p-4">
                <div className="flex items-center justify-between w-full">
                  <h1 className="text-muted-foreground text-2xl md:text-3xl mx-2 md:mx-0">
                    Deploy Idle USDC
                  </h1>
                  <X
                    className="w-6 h-6 cursor-pointer text-muted-foreground"
                    onClick={() => setIsOpen(false)}
                  />
                </div>
                <p className="text-gray-400 text-sm mx-2 md:mx-0">
                  Deploy idle USDC cross-chain and earn rewards.
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <Input
                      placeholder="Amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="bg-background border border-gray-700 rounded-2xl p-2 w-full md:w-1/2 mt-4 h-12 placeholder:text-gray-400"
                    />
                    <Select>
                      <SelectTrigger
                        className="w-full md:w-1/2 rounded-2xl mt-2"
                        value={selectedNetwork.name}
                      >
                        <SelectValue
                          placeholder="Select Network"
                          className=""
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {networks.map((network) => (
                          <SelectItem
                            key={network.name}
                            value={network.name}
                            className="flex items-center  justify-between my-1 cursor-pointer"
                            onClick={() => {
                              setSelectedNetwork(network);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={network.icon}
                                alt={network.name}
                                className="w-7 h-7 rounded-full"
                              />
                              <p className="text-sm">{network.name}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center md:justify-end justify-center w-full mt-4">
                      <button className="text-sm font-bold bg-transparent text-primary border border-primary rounded-3xl py-2 px-4 flex items-center gap-1">
                        Deploy {amount} USDC to {selectedNetwork.name}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}

export default Circle;
