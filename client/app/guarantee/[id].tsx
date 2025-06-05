import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import colors from "@/constants/Colors";
import CustomTextInput from "../components/CustomTextInput";
import Guarantor from "../components/Guarantor";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const applicant = {
  name: "Sylus Abel",
  avatar: require("@/assets/images/profile.jpg"),
  wallet: "0x1234...abcd",
};

const loan = {
  amount: "KES 10,000",
  purpose: "Emergency Medical Loan",
  status: "Pending",
  dueDate: "2024-07-30",
};

const existingGuarantors = [
  {
    id: "1",
    icon: require("@/assets/images/profile.jpg"),
    user: "Brian Otieno",
    amount: "KES 2,000",
  },
  {
    id: "2",
    icon: require("@/assets/images/profile.jpg"),
    user: "Cynthia Mwangi",
    amount: "KES 1,500",
  },
];

const getTotalGuaranteeAmount = (guaranteeAmount: number) => {
  return existingGuarantors.reduce((acc, curr) => {
    // Remove non-digit characters except for the decimal point
    const numeric = curr.amount.replace(/[^0-9.]/g, "");
    return acc + Number(numeric);
  }, 0);
};

console.log(getTotalGuaranteeAmount(0));

const Guarantee = () => {
  const [guaranteeAmount, setGuaranteeAmount] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Guarantee Loan</Text>
          <View style={{ width: 28 }} />
        </View>
        {/* Applicant Info */}
        <View style={styles.applicantCard}>
          <Image source={applicant.avatar} style={styles.avatar} />
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.applicantName}>{applicant.name}</Text>
            <Text style={styles.walletText}>{applicant.wallet}</Text>
          </View>
        </View>
        {/* Loan Summary */}
        <View style={styles.loanSummary}>
          <Text style={styles.loanAmount}>{loan.amount}</Text>
          <Text style={{ fontSize: 12, color: "red" }}>
            KES {(10000 - getTotalGuaranteeAmount(Number(0))).toLocaleString()}
          </Text>
          <Text style={styles.loanPurpose}>{loan.purpose}</Text>
          <View style={styles.loanMetaRow}>
            <Text style={styles.loanMetaLabel}>Status:</Text>
            <Text style={styles.loanMetaValue}>{loan.status}</Text>
            <Text style={styles.loanMetaLabel}>Due:</Text>
            <Text style={styles.loanMetaValue}>{loan.dueDate}</Text>
          </View>
        </View>
        {/* Existing Guarantors */}
        <View style={styles.guarantorsSection}>
          <Text style={styles.guarantorsTitle}>Current Guarantors</Text>
          {existingGuarantors.map((g) => (
            <Guarantor key={g.id} {...g} />
          ))}
        </View>
        {/* Guarantee Input */}
        <View style={styles.guaranteeInputSection}>
          <Text style={styles.guaranteePrompt}>
            How much would you like to guarantee for this loan?
          </Text>
          <CustomTextInput
            title="Guarantee Amount"
            placeholder="e.g. 2000"
            keyboardType="numeric"
            value={guaranteeAmount}
            onChangeText={setGuaranteeAmount}
          />
          <TouchableOpacity
            style={styles.guaranteeButton}
            onPress={() => router.push(`/guarantee/overview`)}
          >
            <Ionicons
              name="shield-checkmark"
              size={22}
              color={colors.chamaGray}
            />
            <Text style={styles.guaranteeButtonText}>Guarantee Loan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Guarantee;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f7f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "MontserratAlternates",
    color: colors.primary,
  },
  applicantCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.chamaGray,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.chamaGreen,
  },
  applicantName: {
    fontFamily: "JakartaRegular",
    fontSize: 16,
    color: colors.primary,
  },
  walletText: {
    fontFamily: "JakartaRegular",
    fontSize: 12,
    color: colors.textsecondary,
    marginTop: 2,
  },
  loanSummary: {
    backgroundColor: colors.chamaGray,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accent,
  },
  loanAmount: {
    fontFamily: "JakartaRegular",
    fontSize: 20,
    color: colors.primary,
    fontWeight: "bold",
  },
  loanPurpose: {
    fontFamily: "JakartaRegular",
    fontSize: 14,
    color: colors.primary,
    marginTop: 4,
    marginBottom: 8,
  },
  loanMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  loanMetaLabel: {
    fontFamily: "JakartaRegular",
    fontSize: 12,
    color: colors.primary,
    marginRight: 2,
  },
  loanMetaValue: {
    fontFamily: "JakartaRegular",
    fontSize: 12,
    color: colors.accent,
    marginRight: 8,
  },
  guarantorsSection: {
    backgroundColor: colors.chamaGray,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  guarantorsTitle: {
    fontFamily: "JakartaRegular",
    fontSize: 16,
    color: colors.primary,
    marginBottom: 8,
    fontWeight: "bold",
  },
  guaranteeInputSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    alignItems: "center",
  },
  guaranteePrompt: {
    fontFamily: "JakartaRegular",
    fontSize: 15,
    color: colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  guaranteeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    backgroundColor: colors.chamaBlack,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 8,
    height: 48,
    width: width * 0.7,
  },
  guaranteeButtonText: {
    fontFamily: "JakartaRegular",
    fontSize: 16,
    color: colors.chamaGray,
  },
});
