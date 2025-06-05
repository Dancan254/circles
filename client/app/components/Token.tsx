import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "@/constants/Colors";
import { Image } from "expo-image";

export interface TokenProps {
  id: string;
  name: string;
  price: number;
  amount: string;
  logo: any;
  hidden?: boolean;
}

const Token = ({ id, name, price, amount, logo, hidden }: TokenProps) => {
  return (
    <View style={[styles.container]}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
        <View style={styles.tokenNameContainer}>
          <Text style={styles.tokenName}>{name}</Text>
          <Text style={styles.tokenPrice}>
            {hidden ? "****" : `${amount} ${name}`}
          </Text>
        </View>
      </View>
      <View style={styles.tokenAmountContainer}>
        <Text style={styles.tokenAmount}>
          KSH {hidden ? "****" : (Number(amount) * price).toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

export default Token;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.chamaBlue,
    marginVertical: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    borderRadius: 100,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  tokenNameContainer: {
    flexDirection: "column",
    gap: 4,
  },
  tokenName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.chamaBlack,
    fontFamily: "JakartaRegular",
  },
  tokenPrice: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.textsecondary,
    fontFamily: "JakartaRegular",
  },
  tokenAmountContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  tokenAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.chamaBlack,
    fontFamily: "JakartSemiBold",
  },
});
