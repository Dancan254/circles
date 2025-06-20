import { client } from "@/utils/client";
import { useWalletBalance } from "thirdweb/react";
import { baseSepolia } from "thirdweb/chains";
import { useEffect, useState } from "react";
import { getTokenPriceInUSDT } from "@/utils/getTokenPrice";

const useChamaBalance = (chamaAddress: string) => {
  const [loading, setLoading] = useState<boolean>(false);

  const usdcToKesRate = 129.33;

  const { data: usdcBalance, error: usdcError } = useWalletBalance({
    tokenAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    address: chamaAddress,
    chain: baseSepolia,
    client: client,
  });

  const chamaBalanceInUsdc = Number(usdcBalance?.displayValue);
  const usdcBalanceInKes = chamaBalanceInUsdc * usdcToKesRate;

  return { usdcBalanceInKes, loading, usdcError };
};

export default useChamaBalance;
