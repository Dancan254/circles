import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { defaultStyles } from "@/constants/Styles";
import colors from "@/constants/Colors";

interface CustomButtonProps {
  title: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  width?: number;
  bgColor?: string;
}

const CustomButton = ({ title, onPress, icon, bgColor }: CustomButtonProps) => {
  return (
    <TouchableOpacity
      style={[defaultStyles.btn, styles.btnDark]}
      onPress={onPress}
    >
      <View
        style={[
          {
            backgroundColor: bgColor || colors.primary,
          },
          styles.btCover,
        ]}
      >
        <View style={[defaultStyles.btn]}>
          {icon && (
            <Ionicons
              name={icon}
              style={styles.btnIcon}
              size={24}
              color={colors.textprimary}
            />
          )}
          <Text style={styles.buttonDarkText}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  btCover: {
    height: "100%",
    borderRadius: 14,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    marginHorizontal: 10,
  },
  btnDark: {
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 24,
    justifyContent: "flex-start",
  },
  btnIcon: {
    paddingRight: 10,
  },
  buttonDarkText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "JakartaRegular",
  },
});
