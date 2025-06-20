import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import colors from "@/constants/Colors";
import ChamaLoansOverview from "../components/ChamaLoansOverview";
import LoanItemRow from "../components/LoanItemRow";
import { useGetChama } from "@/hooks/useChama";
const screenWidth = Dimensions.get("window").width;

const Loans = () => {
  const { id } = useLocalSearchParams();
  const { data: chamaData } = useGetChama(id as string);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chama Loans</Text>
        </View>
        <View style={{ width: screenWidth }}>
          <View style={styles.financialContainer}>
            <View style={styles.financialHeader}>
              <Text style={styles.financialTitle}>Total Loans Given</Text>
            </View>
            <Text style={styles.amountText}>
              KES {chamaData?.totalLoans?.toLocaleString()}
            </Text>
            <View style={styles.footer}>
              <View style={styles.moreInfo}>
                <Text style={styles.moreInfoText}>
                  Chama Code: {chamaData?.chamaId?.slice(0, 4)}{" "}
                  {chamaData?.chamaId?.slice(4, 8)}
                </Text>
                <Ionicons
                  name="copy-outline"
                  size={14}
                  color="black"
                  style={styles.copyIcon}
                />
              </View>
              <Text style={styles.pendingText}>
                Pending Loans: {chamaData?.totalLoanRepayments}
              </Text>
            </View>
          </View>
          <View style={styles.balanceContainer}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceTitle}>Interest Earned</Text>
              <Text style={styles.balanceText}>
                KES {chamaData?.totalLoanPenalties?.toLocaleString()}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.balanceItem}>
              <Text style={styles.balanceTitle}>Payment Period</Text>
              <Text style={styles.balanceText}>
                {chamaData?.loanTerm?.toUpperCase()}
              </Text>
            </View>
            <View style={styles.divider} />
            <TouchableOpacity
              style={[styles.balanceItem]}
              onPress={() => router.push("/myloans")}
            >
              <Text style={styles.balanceTitle}>My Loans</Text>
              <Ionicons name="arrow-forward-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Loans Overview</Text>
          <ChamaLoansOverview />
        </View>
        <View style={styles.loansGivenContainer}>
          <Text style={styles.chartTitle}>Loans Given</Text>
          <View style={styles.loansGivenList}>
            <View style={styles.loansGivenHeader}>
              <Text style={styles.loansMemberHeaderText}>Member</Text>
              <Text style={styles.loansAmountHeaderText}>Loan Amount</Text>
              <Text style={styles.loansStatusHeaderText}>Loan Status</Text>
            </View>
            {/* <LoanItemRow
              id="1"
              icon={require("@/assets/images/profile.jpg")}
              user="Sylus Abel"
              amount="KES 1,000"
              status="Pending"
            /> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Loans;

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
    fontSize: 14,
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
  chartContainer: {
    marginHorizontal: 16,
    marginTop: 32,
  },
  chartTitle: {
    fontFamily: "JakartSemiBold",
    fontSize: 20,
  },
  loansGivenContainer: {
    marginHorizontal: 16,
    marginTop: 32,
  },
  loansGivenList: {
    marginTop: 16,
  },
  loansGivenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 0,
    marginBottom: 10,
    backgroundColor: colors.chamaGray,
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  loansMemberHeaderText: {
    fontFamily: "JakartSemiBold",
    fontSize: 14,
    width: 100,
  },
  loansAmountHeaderText: {
    fontFamily: "JakartSemiBold",
    fontSize: 14,
    width: 100,
  },
  loansStatusHeaderText: {
    fontFamily: "JakartSemiBold",
    fontSize: 14,
  },
});
