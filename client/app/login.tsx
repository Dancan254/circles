import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import colors from "@/constants/Colors";
import { Image } from "expo-image";
import { client } from "@/utils/client";
import { ConnectButton, lightTheme, useActiveAccount } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { defineChain } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { router } from "expo-router";
import Lottie from "lottie-react-native";
import AppBanner from "./components/AppBanner";

const width = Dimensions.get("window").width;

const Page = () => {
  const wallets = [
    createWallet("com.coinbase.wallet", {
      mobileConfig: {
        callbackURL: "myapp://createCoinbaseWallet",
      },
      walletConfig: {
        options: "smartWalletOnly",
      },
      appMetadata: {
        name: "The ChamaDAO",
        description: "The complete savings platform for EVERYONE!",
        url: "https://www.thechamadao.xyz",
        logoUrl: "https://www.thechamadao.xyz/logo.svg",
      },
    }),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={1}
        style={{
          paddingHorizontal: 20,
        }}
      >
        <AppBanner />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          One-tap login with your Coinbase smart wallet
        </Text>
        <View style={styles.animationContainer}>
          <Lottie
            source={require("../assets/images/smart-wallet.json")}
            autoPlay
            loop
            style={styles.animationContainer}
          />
        </View>
        <TouchableOpacity style={styles.createWalletButton}>
          <ConnectButton
            client={client}
            theme={lightTheme({
              colors: {
                modalBg: "#f0f7f9",
                modalOverlayBg: "#f0f7f9",
                primaryButtonBg: "#f0f7f9",
                primaryButtonText: colors.chamaBlack,
              },
              fontFamily: "Poppins",
            })}
            wallets={wallets}
            chain={defineChain(baseSepolia)}
            connectButton={{
              label: "Sign in with Smart Wallet",
            }}
            connectModal={{
              title: "Coinbase Wallet",
              titleIcon: "https://www.thechamadao.xyz/logo.svg",
              size: "compact",
            }}
            onConnect={(wallet) => {
              router.push("/(tabs)");
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Text style={styles.memberLoginText}>Need an account? </Text>
          <Link href={{ pathname: "/onboard" }} asChild>
            <Text
              style={{
                textDecorationLine: "underline",
                marginLeft: 2,
                fontFamily: "JakartaLight",
                fontSize: 18,
                width: 400,
                paddingHorizontal: 40,
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Signup
            </Text>
          </Link>
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f7f9",
  },
  logo: {
    width: "100%",

    alignSelf: "center",
    marginVertical: 40,
    objectFit: "contain",
  },
  title: {
    fontSize: 38,
    textAlign: "center",
    marginBottom: 4,
    fontFamily: "JakartSemiBold",
    marginTop: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.primary,
    borderRadius: 24,
    padding: 10,
    backgroundColor: "#F0F9F7",
    fontFamily: "MontserratAlternates",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  createWalletButton: {
    marginTop: 32,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.chamaGreen,
    padding: 2,
    marginHorizontal: 16,
    flexDirection: "column",
  },
  btnIcon: {
    paddingRight: 10,
  },
  btnDark: {
    backgroundColor: "#1A1A1A",
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 24,
  },
  avaxLogo: {
    backgroundColor: "#fff",
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 24,
  },
  animationContainer: {
    width: width * 0.9,
    height: width,
    alignSelf: "center",
  },
  buttonDarkText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "JakartaRegular",
  },
  memberLoginText: {
    fontFamily: "JakartaLight",
    fontSize: 18,
    width: 400,
    paddingHorizontal: 40,
    marginTop: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "JakartaRegular",
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    marginHorizontal: 16,
  },
});
