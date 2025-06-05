import { TokenBalance } from "@/app/(tabs)/wallet";
import { TokenProps } from "@/app/components/Token";

export const getWalletBalanceInKes = (tokens: TokenProps[]) => {
  return tokens.reduce((acc, token) => {
    return acc + Number(token.amount) * token.price;
  }, 0);
};
