import { CIRCLE_ADDRESS, PROTOCOL_ADDRESS, TOKEN_ADDRESS } from "@/mock";
import { getContract } from "thirdweb";
import { defineChain } from "thirdweb";
import { createThirdwebClient } from "thirdweb";

const clientId = "e7c8824f4ac35a5d95af9a90be42f461";
const secretKey =
  "Z8dbpHxaUqVxNwzVxYLNE-IrbNzp8mXmeoBQx8ZZM88OaL2WPdHLkGOLjUVox_Rc6Bv8Ic5or7P6XNEzmgH5Xg";

if (!clientId || !secretKey) {
  throw new Error(
    "VITE_THIRDWEB_CLIENT_ID and VITE_THIRDWEB_SECRET_KEY must be set"
  );
}

export const client = createThirdwebClient({
  clientId: clientId,
  secretKey: secretKey,
});

export const contract = getContract({
  client,
  chain: defineChain(43113),
  address: CIRCLE_ADDRESS,
});

export const tokenContract = getContract({
  client,
  chain: defineChain(43113),
  address: TOKEN_ADDRESS,
});

export const protocolContract = getContract({
  client,
  chain: defineChain(43113),
  address: PROTOCOL_ADDRESS,
});

// export const vaultContract = getContract({
//   client,
//   chain: defineChain(43113),
//   address: MOCK_VAULT_ADDRESS,
// });

export const myChain = defineChain({
  id: 43113,
  name: "Mock Avalanche",
  rpc: "https://endpoints.omniatech.io/v1/avax/fuji/public",
  nativeCurrency: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
  },
});
