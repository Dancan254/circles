import "react-native-url-polyfill/auto";
import { polyfillWebCrypto } from "expo-standard-web-crypto";
import { randomUUID } from "expo-crypto";

polyfillWebCrypto();
crypto.randomUUID =
  randomUUID as unknown as () => `${string}-${string}-${string}-${string}-${string}`;
