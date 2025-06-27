import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
  from: "usdc" | "usdt"
): number {
  if (!amount) return 0;
  switch (from) {
    case "usdc":
      return Number((amount * 0.99789).toFixed(2));
    case "usdt":
      return Number((amount * 1.00211).toFixed(2));
  }
}
