import { CIRCLE_ADDRESS, TOKEN_ADDRESS } from "@/mock";
import { getContract } from "thirdweb";
import { defineChain } from "thirdweb";
import { createThirdwebClient } from "thirdweb";

const clientId = import.meta.env.VITE_CLIENT_ID;
const secretKey = import.meta.env.VITE_SECRET_KEY;

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
