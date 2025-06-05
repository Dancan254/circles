import { Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import colors from "@/constants/Colors";

const { width } = Dimensions.get("window");
const StepFormIndicator = ({ step }: { step: number }) => {
  return (
    <View style={styles.indicatorContainer}>
      <View
        style={[
          styles.indicator,
          {
            backgroundColor: step >= 1 ? colors.chamaBlack : colors.chamaBlue,
          },
        ]}
      ></View>
      <View
        style={[
          styles.indicator,
          {
            backgroundColor: step >= 2 ? colors.chamaBlack : colors.chamaBlue,
          },
        ]}
      ></View>
      <View
        style={[
          styles.indicator,
          {
            backgroundColor: step >= 3 ? colors.chamaBlack : colors.chamaBlue,
          },
        ]}
      ></View>
      <View
        style={[
          styles.indicator,
          {
            backgroundColor: step >= 4 ? colors.chamaBlack : colors.chamaBlue,
          },
        ]}
      ></View>
    </View>
  );
};

export default StepFormIndicator;

const styles = StyleSheet.create({
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginVertical: 16,
  },
  indicator: {
    width: width / 5,
    height: width * 0.01,
    borderRadius: width,
    backgroundColor: colors.chamaBlue,
  },
});
