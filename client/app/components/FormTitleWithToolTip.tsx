import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/Colors";
import { BlurView } from "expo-blur";

const FormTitleWithToolTip = ({
  title,
  subtitle,
  tooltipText,
}: {
  title: string;
  subtitle: string;
  tooltipText: string;
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={() => setIsTooltipVisible(true)}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={colors.chamaBlack}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Modal visible={isTooltipVisible} transparent={true} animationType="fade">
        <BlurView intensity={10} style={styles.overlay}>
          <View style={styles.tooltipContainer}>
            <Text style={styles.tooltipText}>{tooltipText}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsTooltipVisible(false)}
            >
              <Ionicons
                name="close-outline"
                size={24}
                color={colors.chamaGray}
              />
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

export default FormTitleWithToolTip;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 4,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  title: {
    fontFamily: "JakartSemiBold",
    fontSize: 18,
    color: colors.chamaBlack,
  },
  subtitle: {
    fontFamily: "JakartaRegular",
    fontSize: 14,
    color: colors.textsecondary,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tooltipContainer: {
    width: "80%",
    backgroundColor: "#f0f9f7",
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderColor: colors.accent,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
  },
  tooltipText: {
    fontFamily: "JakartaRegular",
    fontSize: 14,
    color: colors.chamaBlack,
    lineHeight: 24,
  },
  closeText: {
    fontFamily: "JakartaRegular",
    fontSize: 14,
    color: colors.chamaGray,
  },
  closeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    justifyContent: "center",
    backgroundColor: colors.chamaBlack,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 12,
  },
});
