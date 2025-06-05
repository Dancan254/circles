import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import colors from "@/constants/Colors";

const screenWidth = Dimensions.get("window").width;

const MyLoans = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Loans</Text>
        </View>
        <View style={{ width: screenWidth }}>
          <View style={styles.financialContainer}>
            <View style={styles.financialHeader}>
              <Text style={styles.financialTitle}>Pending Loans</Text>
            </View>
            <Text style={styles.amountText}>KES 0</Text>
            <View style={styles.footer}>
              <View style={styles.moreInfo}>
                <Text style={styles.moreInfoText}>
                  Interest Accumulated: KES 0
                </Text>
              </View>
              <Text style={styles.pendingText}>Due in: No loans due</Text>
            </View>
          </View>
          <View style={styles.balanceContainer}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceTitle}>Penalties Incurred</Text>
              <Text style={styles.balanceText}>KES 0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.balanceItem}>
              <Text style={styles.balanceTitle}>Total Loans</Text>
              <Text style={styles.balanceText}>KES 0</Text>
            </View>
            <View style={styles.divider} />
            <TouchableOpacity
              style={[styles.balanceItem]}
              onPress={() => router.push("/loans/apply" as any)}
            >
              <Text style={styles.balanceTitle}>Borrow Loan</Text>
              <Ionicons name="cash-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.previousLoansContainer}>
          <Text style={styles.previousLoansTitle}>Previous Loans</Text>
          <Text style={styles.previousLoansText}>
            You have no previous loans
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyLoans;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f7f9",
  },
  header: {
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "MontserratAlternates",
  },
  financialContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: colors.chamaBlue,
    paddingVertical: 16,
    marginHorizontal: 10,
    marginTop: 16,
    borderTopRightRadius: 14,
    borderTopLeftRadius: 14,
    height: 160,
  },
  financialTitle: {
    fontSize: 16,
    fontFamily: "JakartSemiBold",
    marginTop: 10,
  },
  amountText: {
    fontSize: 32,
    fontFamily: "JakartSemiBold",
    marginTop: 10,
    fontWeight: "bold",
  },
  financialHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  moreInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  moreInfoText: {
    fontFamily: "JakartaRegular",
    fontSize: 13,
  },
  copyIcon: {
    marginLeft: 4,
  },
  pendingText: {
    fontFamily: "JakartaRegular",
    fontSize: 12,
  },
  balanceContainer: {
    height: 80,
    backgroundColor: "#E1E4E5FF",
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    marginTop: 4,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  balanceTitle: {
    fontFamily: "JakartSemiBold",
    fontSize: 14,
  },
  balanceText: {
    fontFamily: "JakartaRegular",
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: "#f0f7f9",
    height: "100%",
  },
  balanceItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  previousLoansContainer: {
    marginHorizontal: 16,
    marginTop: 32,
  },
  previousLoansTitle: {
    fontSize: 20,
    fontFamily: "JakartSemiBold",
    marginTop: 10,
  },
  previousLoansText: {
    fontSize: 14,
    fontFamily: "JakartaRegular",
    marginTop: 10,
    textAlign: "center",
    color: colors.chamaBlue,
  },
});
