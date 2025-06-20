import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import { Image } from "expo-image";
import colors from "@/constants/Colors";

interface GuarantorProps {
  id: string;
  icon: string;
  user: string;
  amount: string;
}

const Guarantor = ({ id, icon, user, amount }: GuarantorProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/profiles/${id}`)}
    >
      <View style={styles.iconContainer}>
        <Image
          source={icon}
          style={styles.icon}
          contentFit="cover"
          transition={100}
        />
        <View style={styles.userContainer}>
          <Link href="/(tabs)/profile" style={styles.userText}>
            {user}
          </Link>
        </View>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amountText}>{amount}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Guarantor;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.chamaGreen,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: 100,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  userText: {
    fontFamily: "JakartSemiBold",
    fontSize: 14,
    textDecorationLine: "underline",
    color: colors.accent,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: 100,
  },
  amountText: {
    fontFamily: "JakartaRegular",
    fontSize: 12,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: 70,
  },
  statusText: {
    fontFamily: "JakartaRegular",
    fontSize: 12,
  },
});
