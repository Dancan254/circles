import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import colors from "@/constants/Colors";

const screenWidth = Dimensions.get("window").width;

const ChamaLoansOverview = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("1 Day");
  const [selectedLoan, setSelectedLoan] = useState("4");
  const lines = [1, 2, 3, 4, 5, 6];
  const loansGiven = [0, 0, 0, 0, 0, 0];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={[
            styles.headerItem,
            selectedPeriod === "1 Day" && styles.selectedPeriod,
          ]}
          onPress={() => setSelectedPeriod("1 Day")}
        >
          <Text style={styles.headerTitle}>1 Day</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.headerItem,
            selectedPeriod === "1 Week" && styles.selectedPeriod,
          ]}
          onPress={() => setSelectedPeriod("1 Week")}
        >
          <Text style={styles.headerTitle}>1 Week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.headerItem,
            selectedPeriod === "1 Month" && styles.selectedPeriod,
          ]}
          onPress={() => setSelectedPeriod("1 Month")}
        >
          <Text style={styles.headerTitle}>1 Month</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.headerItem,
            selectedPeriod === "1 Year" && styles.selectedPeriod,
          ]}
          onPress={() => setSelectedPeriod("1 Year")}
        >
          <Text style={styles.headerTitle}>1 Year</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chartBodyContainer}>
        <View style={styles.scaleContainer}>
          {lines.map((line) => (
            <Text key={line} style={styles.scaleText}>
              {line * 1}
            </Text>
          ))}
        </View>
        <View style={styles.dataContainer}>
          {lines.map((line) => (
            <View key={line} style={styles.scaleLine} />
          ))}
          <View style={styles.graphContainer}>
            <View
              style={[
                styles.graphItem,
                { height: (loansGiven[0] / 600) * screenWidth * 0.64 },
                selectedLoan === "1" && styles.selectedLoan,
              ]}
            />
            <View
              style={[
                styles.graphItem,
                { height: (loansGiven[1] / 600) * screenWidth * 0.64 },
                selectedLoan === "2" && styles.selectedLoan,
              ]}
            />
            <View
              style={[
                styles.graphItem,
                { height: (loansGiven[2] / 600) * screenWidth * 0.64 },
                selectedLoan === "3" && styles.selectedLoan,
              ]}
            />
            <View
              style={[
                styles.graphItem,
                { height: (loansGiven[3] / 600) * screenWidth * 0.64 },
                selectedLoan === "4" && styles.selectedLoan,
              ]}
            />
            <View
              style={[
                styles.graphItem,
                { height: (loansGiven[4] / 600) * screenWidth * 0.64 },
                selectedLoan === "5" && styles.selectedLoan,
              ]}
            />
            <View
              style={[
                styles.graphItem,
                { height: (loansGiven[5] / 600) * screenWidth * 0.64 },
                selectedLoan === "6" && styles.selectedLoan,
              ]}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          width: screenWidth * 0.85,
        }}
      >
        <View style={styles.footerContainer}>
          <View style={styles.footerItem}>
            <Text style={styles.footerText}>M</Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={styles.footerText}>T</Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={styles.footerText}>W</Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={styles.footerText}>Th</Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={styles.footerText}>F</Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={styles.footerText}>S</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ChamaLoansOverview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    width: screenWidth * 0.9,
    height: screenWidth,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f7f9",
    padding: 8,
    borderRadius: 16,
  },
  headerItem: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "JakartSemiBold",
    fontSize: 14,
  },
  selectedPeriod: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 8,
  },
  chartBodyContainer: {
    flexDirection: "row",
    alignContent: "center",
    height: screenWidth * 0.7,
    marginTop: 16,
  },
  scaleContainer: {
    flexDirection: "column-reverse",
    justifyContent: "space-between",
    width: screenWidth * 0.1,
    height: screenWidth * 0.7,
  },
  scaleText: {
    fontFamily: "JakartSemiBold",
    fontSize: 12,
  },
  scaleLine: {
    width: screenWidth * 0.7,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.chamaBlue,
  },
  dataContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: screenWidth * 0.7,
    position: "relative",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    width: screenWidth * 0.8,
    marginTop: 4,
  },
  footerItem: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 4,
  },
  footerText: {
    fontFamily: "JakartSemiBold",
    fontSize: 12,
  },
  graphContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: screenWidth * 0.67,
    height: screenWidth * 0.7,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginLeft: (screenWidth / 6) * 0.06,
  },
  graphItem: {
    width: screenWidth * 0.06,
    height: screenWidth * 0.7,
    backgroundColor: "#f0f7f9",
    borderTopEndRadius: 4,
    borderTopStartRadius: 4,
    borderBottomEndRadius: 4,
    borderBottomStartRadius: 4,
    marginBottom: 0.5,
  },
  selectedLoan: {
    backgroundColor: colors.chamaGreen,
  },
});
