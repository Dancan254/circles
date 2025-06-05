import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/Colors";
import { Image } from "expo-image";
import { contributionHistory } from "@/constants/Styles";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

const TableHeader = () => {
  return (
    <View style={styles.tableHeader}>
      <Text style={styles.tableHeaderText}>Date</Text>
      <Text style={styles.tableHeaderText}>Amount(KES)</Text>
      <Text style={styles.tableHeaderText}>Status</Text>
    </View>
  );
};

const TableRow = ({ item }: { item: any }) => {
  return (
    <View style={styles.tableRow}>
      <Text style={styles.tableDateRowText}>{item.date}</Text>
      <Text style={styles.tableAmountRowText}>{item.amount}</Text>
      <Text style={styles.tableStatusRowText}>
        {item.icon} {item.status}
      </Text>
    </View>
  );
};

const MakeContribution = () => {
  const [isHealthModalVisible, setIsHealthModalVisible] = useState(false);
  const [isStreakModalVisible, setIsStreakModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pay Contribution</Text>
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
      <ScrollView
        contentContainerStyle={{ paddingBottom: 4 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.nextContributionContainer}>
          <View style={styles.financialContainer}>
            <View style={styles.financialHeader}>
              <Text style={styles.financialTitle}>Next Contribution</Text>
            </View>
            <Text style={styles.amountText}>KES 420</Text>
            <View style={styles.footer}>
              <View style={styles.moreInfo}>
                <Text style={styles.moreInfoText}>Due Wednesday, 10th May</Text>
              </View>
              <Text style={styles.pendingText}>4 days left.</Text>
            </View>
          </View>
          <View style={styles.balanceContainer}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceTitle}>Already Paid</Text>
              <Text style={styles.balanceText}>17 of 21 Members</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.balanceItem}>
              <Text style={styles.balanceTitle}>Contribution</Text>
              <Text style={styles.balanceText}>KES 420 / Month</Text>
            </View>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.balanceItem}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Text style={styles.balanceTitle}>Pending Fine</Text>
              </View>
              <Text style={styles.balanceText}>KES 0</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.paymentContainer}>
            <TouchableOpacity style={styles.btn}>
              <Image
                source={require("@/assets/images/mpesa.png")}
                style={styles.mpesaIcon}
                contentFit="contain"
              />
              <Text style={styles.btnText}>Pay with Mpesa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
              <Image
                source={require("@/assets/images/cbw.svg")}
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 20,
                }}
                contentFit="contain"
              />
              <Text style={styles.btnText}>Pay with Wallet</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={colors.accent}
              />
              <Text style={styles.infoTitle}>Did You Know</Text>
            </View>
            <Text style={styles.infoText}>
              Paying your contributions on time will help you earn more health
              points and boost your chama streak.
            </Text>
          </View>
          <Text style={styles.contributionHistoryTitle}>
            Contribution History
          </Text>
          <FlatList
            data={contributionHistory}
            renderItem={({ item }) => <TableRow item={item} />}
            style={{ marginTop: 8, paddingHorizontal: 16 }}
            ListHeaderComponent={<TableHeader />}
            scrollEnabled={false}
          />
          <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.footerBtn}>
              <Text style={styles.footerBtnText}>Load More</Text>
            </TouchableOpacity>
          </View>
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
              Your Streak counts how many payments in a row you’ve made on time
              (e.g. “Weekly Streak: 5”). Every consecutive on-time payment
              increases your reputation—longer streaks signal reliability and
              lower perceived risk. This directly boosts your creditworthiness
              in the chama’s lending process, making members more comfortable
              acting as guarantors.
            </Text>
            <Text style={styles.learnMore}>Learn More.</Text>
          </View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
};

export default MakeContribution;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f7f9",
  },
  headerContainer: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
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
  nextContributionContainer: {
    paddingHorizontal: 6,
    marginTop: 6,
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
    fontSize: 14,
    fontFamily: "JakartaRegular",
    marginTop: 10,
  },
  amountText: {
    fontSize: 32,
    fontFamily: "JakartSemiBold",
    marginTop: 10,
    fontWeight: "bold",
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
  btn: {
    backgroundColor: "#f0f7f9",
    borderRadius: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.chamaBlue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    width: "45%",
  },
  mpesaIcon: {
    width: 40,
    height: 40,
  },
  btnText: {
    fontFamily: "JakartRegular",
    fontSize: 14,
    paddingHorizontal: 4,
  },
  contributionHistoryTitle: {
    fontFamily: "JakartSemiBold",
    fontSize: 20,
    marginHorizontal: 10,
    marginTop: 32,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.chamaGray,
    paddingVertical: 10,
    borderRadius: 4,
  },
  tableHeaderText: {
    fontFamily: "JakartSemiBold",
    fontSize: 14,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: colors.chamaGreen,
  },
  tableRowText: {
    fontFamily: "JakartaRegular",
    fontSize: 14,
    width: "33%",
  },
  tableDateRowText: {
    fontFamily: "JakartaRegular",
    fontSize: 14,
    width: "33%",
  },
  tableAmountRowText: {
    fontFamily: "JakartaRegular",
    fontSize: 14,
    width: "33%",
  },
  tableStatusRowText: {
    fontFamily: "JakartaRegular",
    fontSize: 14,
  },
  footerContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  footerBtn: {
    paddingVertical: 10,
    borderRadius: 10,
  },
  footerBtnText: {
    fontFamily: "MontserratAlternates",
    fontSize: 14,
    color: colors.chamaBlue,
    alignSelf: "center",
  },
  infoContainer: {
    backgroundColor: "#EDF1F2FF",
    borderRadius: 10,
    height: 100,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginTop: 32,
    paddingHorizontal: 16,
  },
  infoTitle: {
    fontFamily: "MontserratAlternates",
    fontSize: 16,
    color: colors.accent,
  },
  infoText: {
    fontFamily: "JakartaRegular",
    fontSize: 14,
    color: colors.chamaBlack,
    lineHeight: 24,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
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
  paymentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginTop: 16,
  },
});
