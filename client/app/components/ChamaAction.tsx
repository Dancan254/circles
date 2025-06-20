import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React from "react";
import colors from "@/constants/Colors";
import { Image } from "expo-image";
import { router } from "expo-router";
interface ChamaActionProps {
  title: string;
  route: string;
  icon: any;
  description: string;
  id: string;
}

const { width } = Dimensions.get("window");

const ChamaAction = ({
  title,
  route,
  icon,
  description,
  id,
}: ChamaActionProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`${route}?id=${id}` as any)}
    >
      <Image source={icon} style={styles.icon} contentFit="contain" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
};

export default ChamaAction;

const styles = StyleSheet.create({
  container: {
    width: width / 2 - 20,
    minHeight: width / 2.7 - 20,
    backgroundColor: "#f0f7f9",
    borderRadius: 10,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.chamaBlue,
  },
  icon: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 15,
    fontFamily: "JakartaSemiBold",
    marginTop: 10,
  },
  description: {
    fontSize: 12,
    fontFamily: "JakartaRegular",
    marginTop: 5,
    color: colors.textsecondary,
  },
});
