import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

interface NotificationProps {
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  icon: React.ReactNode;
}
const Notification = ({
  title,
  message,
  read,
  createdAt,
  icon,
}: NotificationProps) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.iconContainer}>
        <Image
          source={icon}
          style={styles.icon}
          contentFit="contain"
          transition={100}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Text style={{ fontFamily: "JakartaRegular", fontSize: 10 }}>
            {createdAt}
          </Text>
        </View>
        <Ionicons
          name="arrow-forward-outline"
          size={24}
          color={colors.chamaGreen}
        />
      </View>
    </TouchableOpacity>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 4,
    borderRadius: 16,
    backgroundColor: "#F0F9F7",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f7f9",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 34,
    height: 34,
  },
  contentContainer: {
    flexDirection: "column",
    gap: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
    fontFamily: "JakartSemiBold",
  },
  message: {
    fontSize: 12,
    fontFamily: "JakartaRegular",
  },
});
