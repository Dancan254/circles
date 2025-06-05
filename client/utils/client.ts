import { createThirdwebClient, getContract, defineChain } from "thirdweb";

const clientId = process.env.EXPO_PUBLIC_THIRD_WEB_CLIENT_ID_B;
const secretKey = process.env.EXPO_PUBLIC_THIRD_WEB_SECRET_KEY_B;

if (!clientId || !secretKey) {
  throw new Error(
    "THIRD_WEB_CLIENT_ID or THIRD_WEB_SECRET_KEY is not set in environment variables."
  );
}

export const client = createThirdwebClient({
  clientId,
  secretKey,
});

const contract = getContract({
  client,
  chain: defineChain(84532),
  address: "0xC2f4fc5416d96ac447388EAD98c8eeDb45d6Ba82",
});

export default contract;
