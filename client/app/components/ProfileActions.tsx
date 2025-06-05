import {
  Dimensions,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { Image } from "expo-image";

interface ProfileActionsProps {
  name: string;
  description: string;
  data: string;
  icon: ImageSourcePropType;
}

const { width } = Dimensions.get("window");

const ProfileActions = ({
  name,
  description,
  data,
  icon,
}: ProfileActionsProps) => {
  return (
    <View style={styles.container}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.dataText}>{data}</Text>
      <Text style={styles.nameText}>{name}</Text>
      <Text style={styles.descriptionText}>{description}</Text>
    </View>
  );
};

export default ProfileActions;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#f7f0f0",
    width: width * 0.47,
    height: width * 0.47,
    borderRadius: 10,
    padding: 10,
    margin: 5,
  },
  icon: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: 10,
  },
  dataText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "MontserratAlternates",
    marginTop: 10,
  },
  nameText: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "JakartaSemiBold",
    marginTop: 5,
  },
  descriptionText: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "JakartaRegular",
    marginTop: 10,
  },
});
