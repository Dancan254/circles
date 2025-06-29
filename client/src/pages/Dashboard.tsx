import usdc from "@/assets/lottie/usdc.svg";
import { DollarSign, Loader2, Plus, X } from "lucide-react";
import { BriefEarningsChart } from "@/components/app/BriefEarningsChart";
import { CIRCLE_ADDRESS, networks, ROLE } from "@/mock";
import CircleCard from "@/components/app/CircleCard";
import { AnimatePresence, motion } from "framer-motion";
import { convertBalance, convertBalanceToWei, splitBalance } from "@/lib/utils";
import CrossChainTxn from "@/components/app/CrossChainTxn";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { contract } from "@/lib/client";
import Loading from "@/components/app/Loading";
import { useCircleBalance } from "@/hooks/useCircleBalance";
import useUserContributed from "@/hooks/useUserContributed";
import useAddressClaimableBalance from "@/hooks/useAddressClaimableBalance";
import useCircles from "@/hooks/useCircles";
import { useState } from "react";
import useClaimUsdc from "@/hooks/useClaimUsdc";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useContribute from "@/hooks/useContribute";
import useApprove from "@/hooks/useApprove";
import toast from "react-hot-toast";

function Dashboard() {
  const activeAccount = useActiveAccount();

  // STATES
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimAmount, setClaimAmount] = useState(0);
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
  const [isApproved, setIsApproved] = useState(false);

  // HOOKS
  const { data, isPending } = useReadContract({
    contract,
    method:
      "function hasRole(bytes32 role, address account) view returns (bool)",
    params: [ROLE, activeAccount?.address || ""],
  });
  const { data: circleBalance, isLoading: circleBalanceLoading } =
    useCircleBalance(CIRCLE_ADDRESS);
  const { data: userContributed, isLoading: userContributedLoading } =
    useUserContributed(activeAccount?.address || "");
  const { data: claimableBalance, isLoading: claimableBalanceLoading } =
    useAddressClaimableBalance(activeAccount?.address || "");
  const { onClaim, isPending: isClaimingPending } = useClaimUsdc();
  const { onContribute, isPending: isContributingPending } = useContribute();

  const { onApprove, isPending: isApprovePending } = useApprove();

  // COMPUTED
  const {
    integerPart: claimableIntegerPart,
    decimalPart: claimableDecimalPart,
  } = splitBalance(convertBalance(claimableBalance));
  const { data: circles, isLoading: circlesLoading } = useCircles();

  const { integerPart, decimalPart } = splitBalance(circleBalance);
  function handleApprove({ amount }: { amount: number }) {
    const approved = onApprove({
      amount: convertBalanceToWei(amount),
    });
    setIsApproved(approved);
  }

  function handleContribute() {
    if (isApproved) {
      onContribute({
        amount: convertBalanceToWei(10),
      });
      toast.success("USDC contributed!", {
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
        },
      });
      setIsApproved(false);
    } else {
      toast("Please approve the contract to contribute!", {
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
        },
      });
      handleApprove({ amount: 10 });
    }
  }

  if (isPending) {
    return <Loading size="lg" />;
  }

  return (
    <motion.div
      className="my-0 max-w-screen-xl mx-auto px-2 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-card mt-10 rounded-3xl p-4 flex flex-col md:flex-row justify-between"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {data ? (
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            <h1 className="text-md font-light text-muted-foreground mb-1">
              My Circle Balance
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <DollarSign className="w-7 h-7 text-muted-foreground" />
                <p className="text-3xl font-bold text-primary">
                  {integerPart}
                  <span className="text-2xl font-bold text-muted-foreground">
                    .{decimalPart}
                  </span>
                </p>
              </div>
              <button
                className="text-sm font-bold bg-transparent text-primary border border-primary rounded-2xl py-1 px-4 flex items-center gap-1"
                onClick={handleContribute}
              >
                {isContributingPending || isApprovePending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <p className="text-sm font-bold">
                      {isApproved ? "Contribute" : "Approve"}
                    </p>
                  </>
                )}
              </button>
            </div>
            {circleBalanceLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <div className="flex items-center gap-1 border border-gray-700 rounded-full py-1 w-fit px-2">
                {circleBalance}
                <img src={usdc} alt="USDC" className="w-4 h-4" />
                <p className="text-sm font-bold">USDC</p>
              </div>
            )}
            <div className="flex items-center justify-between">
              {userContributedLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <div className="flex items-center">
                  <p className="text-sm font-light text-gray-400 ml-2 mr-1">
                    You've contributed{" "}
                  </p>
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <p className="text-lg font-bold">
                    {convertBalance(userContributed).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                  </p>
                  <p className="text-sm font-light text-gray-400 ml-1">
                    in this circle.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="bg-background animate-pulse h-[150px] rounded-xl w-full md:w-1/3 mb-2 md:mb-0"></div>
        )}
        {data ? (
          <motion.div
            className="flex flex-col md:flex-row gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.3,
                },
              },
            }}
          >
            <motion.div
              className="flex flex-col border border-gray-700 rounded-xl p-4 mt-4 md:mt-0 md:max-h-[150px]"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
            >
              <p className="text-xs font-light text-gray-400">
                Earnings from locked USDC in the last 6 months
              </p>
              <BriefEarningsChart />
            </motion.div>
            <motion.div
              className="flex flex-col bg-[#262223] rounded-xl p-4 mt-4 md:mt-0 relative h-[150px] min-w-[250px]"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
            >
              <h1 className="text-sm font-light mb-1">Claimable Balance</h1>
              {claimableBalanceLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <div className="">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                    <p className="font-bold text-2xl text-primary">
                      {claimableIntegerPart}
                      <span className="text-md font-bold text-muted-foreground">
                        .{claimableDecimalPart}
                      </span>
                    </p>
                  </div>
                  {convertBalance(claimableBalance) > 1 && (
                    <button
                      className="text-sm font-bold mt-8 w-full bg-primary border-none rounded-2xl py-1 px-4 text-[#262223]"
                      onClick={() => setIsClaiming(true)}
                    >
                      {isClaimingPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Claim USDC"
                      )}
                    </button>
                  )}
                  {convertBalance(claimableBalance) < 1 && (
                    <p className="text-sm text-secondary mt-2 absolute bottom-4">
                      You currently have no USDC to claim
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <div className="bg-background animate-pulse h-[150px] rounded-xl w-full md:w-1/2"></div>
        )}
      </motion.div>
      <motion.h1
        className="text-2xl font-bold mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
      >
        Cross-Chain Transactions
      </motion.h1>
      <motion.div>
        {data ? (
          <CrossChainTxn />
        ) : (
          <div className="bg-card mt-4 animate-pulse h-[250px] rounded-xl w-full "></div>
        )}
      </motion.div>
      <motion.h1
        className="text-2xl font-bold mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
      >
        Trending Circles
      </motion.h1>
      {circlesLoading ? (
        <Loading size="lg" />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.7,
              },
            },
          }}
        >
          {circles.map((circle, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
            >
              <CircleCard circle={circle} />
            </motion.div>
          ))}
        </motion.div>
      )}
      {isClaiming && (
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
                    Claim USDC
                  </h1>
                  <X
                    className="w-6 h-6 cursor-pointer text-muted-foreground"
                    onClick={() => setIsClaiming(false)}
                  />
                </div>
                <p className="text-gray-400 text-sm mx-2 md:mx-0">
                  Claimed USDC will be transferred directly to your wallet.
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Claim Amount"
                        type="number"
                        value={claimAmount}
                        onChange={(e) => setClaimAmount(Number(e.target.value))}
                        className="bg-background border border-gray-700 rounded-2xl p-2 w-full md:w-1/2 mt-4 h-12 placeholder:text-gray-400"
                      />
                      <button
                        className="text-sm font-bold bg-transparent hover:bg-primary/10 transition-all duration-300 h-12 w-24 text-center flex items-center justify-center text-primary border border-primary mt-4 rounded-2xl px-4 gap-1"
                        onClick={() =>
                          setClaimAmount(convertBalance(claimableBalance))
                        }
                      >
                        Max
                      </button>
                    </div>
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
                      <button
                        className="text-sm font-bold hover:bg-primary/10 transition-all duration-300 bg-transparent text-primary border border-primary rounded-3xl py-2 px-4 flex items-center gap-1"
                        onClick={() => {
                          onClaim({
                            amount: convertBalanceToWei(claimAmount),
                          });
                        }}
                      >
                        {isClaimingPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          `Claim ${claimAmount} USDC to ${selectedNetwork.name}`
                        )}
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

export default Dashboard;
