import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import avax from "@/assets/lottie/avax.png";
import { TOKEN_DECIMALS } from "@/mock";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitBalance(balance: number | undefined) {
  if (!balance) return { integerPart: "0", decimalPart: "00" };
  const realNumber = balance.toString().split(".");
  const integerPart = realNumber[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const decimalPart = realNumber[1] || "00";
  return { integerPart, decimalPart };
}

export function getConversionRate(
  amount: number | undefined,
  from: "usdc" | "usd"
): number {
  if (!amount) return 0;
  switch (from) {
    case "usdc":
      return Number((amount * 0.99789).toFixed(2));
    case "usd":
      return Number((amount * 1.00211).toFixed(2));
  }
}

export function getChainImage(chain: string): string {
  switch (chain) {
    case "avalanche-testnet-fuji":
      return avax;
    case "ethereum-testnet-sepolia":
      return "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1746003173";
    case "polygon-testnet-mumbai":
      return "https://developers.moralis.com/wp-content/uploads/web3wiki/116-mumbai/637adca2e1a09547acd85968_Y_44LwHNRnOEvnRExgnO1UujtZwn7zq7BCb4oxxHgpI-300x300.jpeg";
    default:
      return "";
  }
}

export function getChainName(chain: string): string {
  switch (chain) {
    case "avalanche-testnet-fuji":
      return "Avalanche Testnet";
    case "ethereum-testnet-sepolia":
      return "Ethereum Testnet";
    case "polygon-testnet-mumbai":
      return "Polygon Testnet";
    default:
      return "";
  }
}

export function getEcosystemImage(ecosystem: string): string {
  switch (ecosystem) {
    case "avalanche":
      return avax;
    case "ethereum":
      return "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1746003173";
    case "polygon":
      return "https://developers.moralis.com/wp-content/uploads/web3wiki/116-mumbai/637adca2e1a09547acd85968_Y_44LwHNRnOEvnRExgnO1UujtZwn7zq7BCb4oxxHgpI-300x300.jpeg";
    default:
      return "";
  }
}

export function convertBalance(balance: bigint | undefined) {
  if (!balance) return 0;
  return Number(balance) / 10 ** TOKEN_DECIMALS;
}

export function convertBalanceToWei(balance: number | undefined): bigint {
  if (!balance) return BigInt(0);
  return BigInt(balance) * BigInt(10 ** TOKEN_DECIMALS);
}
