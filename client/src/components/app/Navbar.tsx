import { BadgeCheck, ChevronDown } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { networks } from "@/mock";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/client";
import { sepolia, avalancheFuji } from "thirdweb/chains";
import logo from "../../assets/images/circles-dark.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
  const navigate = useNavigate();

  const handleNetworkChange = (network: { name: string; icon: string }) => {
    setSelectedNetwork(network);
    setIsOpen(false);
  };
  return (
    <div className="flex items-center justify-between mt-4 mx-2">
      <div
        className="flex items-center justify-center text-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <h1 className="text-3xl font-bold flex items-baseline">circles.</h1>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="flex items-center w-20 h-10 bg-muted rounded-full p-2 justify-between cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <img
            src={selectedNetwork.icon}
            alt="network"
            className="w-8 h-8 rounded-full"
          />
          <ChevronDown className="w-4 h-4" />
        </div>
        <ConnectButton
          client={client}
          theme="dark"
          autoConnect
          connectButton={{
            label: "Launch App",
            style: {
              backgroundColor: "var(--primary)",
              borderRadius: "30px",
            },
          }}
          chains={[avalancheFuji, sepolia]}
          connectModal={{
            title: "Sign in to Circles",
            titleIcon: logo,
            size: "compact",
          }}
          onConnect={() => {
            navigate("/dashboard");
          }}
        />
      </div>
      {isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-screen h-screen backdrop-blur-sm fixed top-0 left-0 z-10 flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center text-center bg-transparent rounded-xl border border-gray-500 w-full md:w-1/4 p-4 mx-2"
            >
              <div className="bg-background rounded-xl p-4 w-full">
                <h1 className="text-xl font-bold flex text-center text-muted-foreground">
                  Supported Networks
                </h1>
                <div className="flex flex-col gap-4 mt-4">
                  {networks.map((network) => (
                    <div
                      className="flex items-center  justify-between my-1 cursor-pointer"
                      onClick={() => handleNetworkChange(network)}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={network.icon}
                          alt={network.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <p className="text-sm">{network.name}</p>
                      </div>
                      {selectedNetwork.name === network.name && (
                        <BadgeCheck className="w-8 h-8 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default Navbar;
