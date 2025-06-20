import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import AppBanner from "./components/AppBanner";
import Lottie from "lottie-react-native";
import colors from "@/constants/Colors";
import { client } from "@/utils/client";
import { ConnectButton, lightTheme, useActiveAccount } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { defineChain } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SignUpData } from "@/hooks/useAuth";
import useAuth from "@/hooks/useAuth";
const width = Dimensions.get("window").width;

const CreateCoinbaseWallet = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUpMutation, user, error } = useAuth();
  const activeAccount = useActiveAccount();
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
  const completeRegistration = async () => {
    setLoading(true);
    try {
      // get registration data from local storage
      const registrationData = await AsyncStorage.getItem(
        "userRegistrationDetails"
      );
      await AsyncStorage.setItem("userStep", "0");
      if (!registrationData) {
        console.log("No registration data found");
        return;
      }
      const data: SignUpData = JSON.parse(registrationData);
      data.walletAddress = activeAccount!.address;
      data.reputationScore = 0;
      data.createdChamas = [];
      data.memberChamas = [];
      data.profileImage = "https://www.svgrepo.com/show/491108/profile.svg";
      const response = await signUpMutation.mutateAsync(data);
      console.log(response);
      router.push("/(tabs)");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AppBanner />
        <Text style={styles.title}>Smart Wallet</Text>
        <Text style={styles.subtitle}>
          With a smart wallet, you can manage your wallet on the go.
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
              label: "Create a Smart Wallet",
            }}
            connectModal={{
              title: "Coinbase Wallet",
              titleIcon: "https://www.thechamadao.xyz/logo.svg",
              size: "compact",
            }}
            onConnect={(wallet) => {
              setWalletConnected(true);
              localStorage.setItem(
                "wallet",
                JSON.stringify(activeAccount?.address)
              );
            }}
          />
        </TouchableOpacity>
        {walletConnected && (
          <TouchableOpacity
            style={styles.completeRegistrationButton}
            onPress={completeRegistration}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.chamaGray} />
            ) : (
              <Text style={styles.completeRegistrationButtonText}>
                Complete Registration
              </Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateCoinbaseWallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    fontFamily: "MontserratAlternates",
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
  createWalletButton: {
    marginTop: 32,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.chamaGreen,
    padding: 2,
    marginHorizontal: 16,
    flexDirection: "column",
  },
  animationContainer: {
    width: width * 0.9,
    height: width,
  },
  completeRegistrationButton: {
    backgroundColor: colors.chamaBlack,
    borderRadius: 14,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 32,
  },
  completeRegistrationButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "JakartSemiBold",
  },
});
