interface TokenBalance {
  symbol: string;
  price: string;
}

const binanceURL = "https://api.binance.com/api/v3/ticker/price?symbol=";

export async function getTokenPriceInUSDT(symbol: string): Promise<number> {
  if (symbol === "eth") {
    const response = await fetch(binanceURL + "ETHUSDT");
    const data = (await response.json()) as TokenBalance;
    return Number(data.price);
  } else if (symbol === "usdc") {
    // TODO: Get the price of USDC from the API
    return 129.33;
  }
  return 0;
}
