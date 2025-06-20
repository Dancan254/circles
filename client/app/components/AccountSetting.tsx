import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

interface AccountSettingProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const AccountSetting = ({ title, icon }: AccountSettingProps) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color="black" />
        <Text style={styles.text}>{title}</Text>
      </View>
      {title === "Language" ? (
        <Text style={styles.text}>English</Text>
      ) : (
        <Ionicons name="chevron-forward-outline" size={24} color="black" />
      )}
    </TouchableOpacity>
  );
};

export default AccountSetting;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "JakartaRegular",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
