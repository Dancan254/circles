import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router } from "expo-router";
import colors from "@/constants/Colors";
import { BlurView } from "expo-blur";
import CustomTextInput from "../components/CustomTextInput";
import MemberSelector from "../components/MemberSelector";

const { width } = Dimensions.get("window");

const Apply = () => {
  const [isHealthModalVisible, setIsHealthModalVisible] = useState(false);
  const [isStreakModalVisible, setIsStreakModalVisible] = useState(false);
  const [loanTitle, setLoanTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedGuarantors, setSelectedGuarantors] = useState<string[]>([]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loan Application</Text>
          <View style={styles.gauges}>
            <TouchableOpacity
              style={styles.healthContainer}
              onPress={() => setIsHealthModalVisible(true)}
            >
              <Ionicons name="pulse" size={24} color={colors.chamaGreen} />
              <Text style={styles.gaugeText}>100</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.streakContainer}
              onPress={() => setIsStreakModalVisible(true)}
            >
              <Ionicons name="flame" size={24} color={colors.accent} />
              <Text style={styles.gaugeText}>4</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.loanApplicationForm}>
          <Text style={styles.loanApplicationTitle}>Loan Application Form</Text>
          <CustomTextInput
            placeholder="Emergency Loan Application"
            title="Loan Title"
            value={loanTitle}
            onChangeText={setLoanTitle}
          />
          <CustomTextInput
            placeholder="1000"
            title="Loan Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <Text
            style={{
              marginVertical: 4,
              fontFamily: "JakartaRegular",
              fontSize: 14,
            }}
          >
            Pick Guarantors
          </Text>
          <MemberSelector
            selected={selectedGuarantors}
            onChange={setSelectedGuarantors}
          />
        </View>
      </ScrollView>
      <Modal visible={isHealthModalVisible} transparent animationType="fade">
        <BlurView intensity={20} tint="light" style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Health Points</Text>
              <TouchableOpacity onPress={() => setIsHealthModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.accent} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>
              Your Health Factor is the percentage of your on-time contributions
              over the last cycle. A higher Health Factor (closer to 100%) shows
              you consistently pay when due, which builds trust in the group.
              Other members see this score when deciding whether to guarantee
              your loan, and a strong Health Factor can reduce the extra
              collateral they require.
            </Text>
            <Text style={styles.learnMore}>Learn More.</Text>
          </View>
        </BlurView>
      </Modal>
      <Modal visible={isStreakModalVisible} transparent animationType="fade">
        <BlurView intensity={20} tint="light" style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Streak</Text>
              <TouchableOpacity onPress={() => setIsStreakModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.accent} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>
              Your Streak counts how many payments in a row you've made on time
              (e.g. "Weekly Streak: 5"). Every consecutive on-time payment
              increases your reputation—longer streaks signal reliability and
              lower perceived risk. This directly boosts your creditworthiness
              in the chama's lending process, making members more comfortable
              acting as guarantors.
            </Text>
            <Text style={styles.learnMore}>Learn More.</Text>
          </View>
        </BlurView>
      </Modal>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.push("/loans/overview")}
      >
        <Ionicons name="send-outline" size={24} color={colors.chamaGray} />
        <Text style={styles.closeText}>Send Requests & Apply</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Apply;

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
  gauges: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    gap: 10,
  },
  healthContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#E5E8E8FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 40,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.chamaYellow,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 40,
  },
  gaugeText: {
    fontSize: 12,
    fontFamily: "JakartaRegular",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#f0f7f9",
    borderRadius: 10,
    padding: 16,
    width: width * 0.9,
    borderWidth: 1,
    borderColor: colors.chamaBlue,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  modalTitle: {
    fontFamily: "MontserratAlternates",
    fontSize: 16,
    color: colors.accent,
  },
  modalText: {
    fontFamily: "JakartaRegular",
    fontSize: 14,
    color: colors.chamaBlack,
    lineHeight: 24,
  },
  learnMore: {
    fontFamily: "JakartaRegular",
    fontSize: 14,
    color: colors.accent,
    marginTop: 6,
    textDecorationLine: "underline",
  },
  loanApplicationForm: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  loanApplicationTitle: {
    fontSize: 20,
    fontFamily: "JakartSemiBold",
    marginVertical: 10,
    textAlign: "center",
  },
  closeText: {
    fontFamily: "JakartaRegular",
    fontSize: 16,
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
    marginTop: 20,
    height: 50,
    marginHorizontal: 16,
    marginBottom: 20,
  },
});
