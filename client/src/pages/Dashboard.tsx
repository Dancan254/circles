import usdc from "@/assets/lottie/usdc.svg";
import { DollarSign, Loader2, Plus } from "lucide-react";
import { BriefEarningsChart } from "@/components/app/BriefEarningsChart";
import { CIRCLE_ADDRESS, CIRCLES, ROLE } from "@/mock";
import CircleCard from "@/components/app/CircleCard";
import { motion } from "framer-motion";
import { splitBalance } from "@/lib/utils";
import CrossChainTxn from "@/components/app/CrossChainTxn";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { contract } from "@/lib/client";
import Loading from "@/components/app/Loading";
import { useCircleBalance } from "@/hooks/useCircleBalance";

const CLAIMABLE_BALANCE = 10.67;
const CIRCLE_INVESTMENT = 200.89;

function Dashboard() {
  const {
    integerPart: claimableIntegerPart,
    decimalPart: claimableDecimalPart,
  } = splitBalance(CLAIMABLE_BALANCE);
  const activeAccount = useActiveAccount();
  const { data, isPending } = useReadContract({
    contract,
    method:
      "function hasRole(bytes32 role, address account) view returns (bool)",
    params: [ROLE, activeAccount?.address || ""],
  });
  const { data: circleBalance, isLoading: circleBalanceLoading } =
    useCircleBalance(CIRCLE_ADDRESS);
  const { integerPart, decimalPart } = splitBalance(circleBalance);

  if (isPending) {
    return <Loading size="lg" />;
  }

  return (
    <motion.div
      className="my-0 max-w-screen-xl mx-auto px-2"
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
              <button className="text-sm font-bold bg-transparent text-primary border border-primary rounded-2xl py-1 px-4 flex items-center gap-1">
                <Plus className="w-4 h-4" />
                <p className="text-sm font-bold">Contribute</p>
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
              <div className="flex items-center">
                <p className="text-sm font-light text-gray-400 ml-2 mr-1">
                  You've contributed{" "}
                </p>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <p className="text-lg font-bold">
                  {CIRCLE_INVESTMENT.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                </p>
                <p className="text-sm font-light text-gray-400 ml-1">
                  in this circle.
                </p>
              </div>
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
                {CLAIMABLE_BALANCE > 1 && (
                  <button className="text-sm font-bold mt-8 w-full bg-primary border-none rounded-2xl py-1 px-4 text-[#262223]">
                    Claim USDC
                  </button>
                )}
                {CLAIMABLE_BALANCE < 1 && (
                  <p className="text-sm text-secondary mt-2 absolute bottom-4">
                    You currently have no USDC to claim
                  </p>
                )}
              </div>
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
        {CIRCLES.map((circle) => (
          <motion.div
            key={circle.address}
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
    </motion.div>
  );
}

export default Dashboard;
