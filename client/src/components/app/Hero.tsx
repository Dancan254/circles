import hero from "@/assets/lottie/pools.json";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center text-center h-full">
      <motion.h1
        className="text-4xl font-bold text-center md:mt-0 mt-12"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Power Your Savings with Cross‑Chain Lending Pools
      </motion.h1>
      <motion.p
        className="text-lg text-center text-muted-foreground mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >
        Create a private USDC savings pool, earn yield, and invest across
        Avalanche, Ethereum, and Polygon — all in one click.
      </motion.p>
      <motion.div
        className="flex items-center justify-center mt-10 mb-5"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
      >
        <Lottie animationData={hero} loop={true} className="w-[400px]" />
      </motion.div>
      <motion.div
        className="flex items-center justify-center mt-10 gap-4 flex-col md:flex-row w-full px-2 mb-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.6,
            },
          },
        }}
      >
        <motion.button
          className="px-4 py-2 bg-primary rounded-full text-muted font-bold w-full md:w-1/6 text-lg"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: "easeOut" },
            },
          }}
          onClick={() => navigate("/dashboard")}
        >
          Launch App
        </motion.button>
        <motion.button
          className="px-4 py-2 bg-background border border-border rounded-full text-white font-bold w-full md:w-1/8 text-lg"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: "easeOut" },
            },
          }}
          onClick={() => navigate("/dashboard")}
        >
          Join a Circle
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Hero;
