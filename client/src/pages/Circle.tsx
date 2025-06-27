import { FullEarningsChart } from "@/components/app/FullEarningsChart";
import Transactions from "@/components/app/Transactions";
import { getConversionRate, splitBalance } from "@/lib/utils";
import { CIRCLE_DETAILS } from "@/mock";
import { ArrowLeft, Copy, DollarSign } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

function Circle() {
  const { address } = useParams();
  const circle = CIRCLE_DETAILS.find((circle) => circle.address === address);
  const { integerPart, decimalPart } = splitBalance(circle?.balance);
  return (
    <motion.div
      className="my-0 max-w-screen-2xl mx-auto mt-4"
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
            <Copy className="w-4 h-4" />
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
          <Transactions transactions={circle?.txnHistory || []} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Circle;
