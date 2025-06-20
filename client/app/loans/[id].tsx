import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  FlatList,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  AccountBalance,
  AccountProvider,
  useActiveAccount,
} from "thirdweb/react";
import colors from "@/constants/Colors";
import { Image } from "expo-image";
import { client } from "@/utils/client";
import ProfileActions from "../components/ProfileActions";
import { profileActions } from "@/constants/Styles";

const { width } = Dimensions.get("window");
import { BlurView } from "expo-blur";
import { useLocalSearchParams } from "expo-router";
import Guarantor from "../components/Guarantor";

const LoanOverview = () => {
  const { id } = useLocalSearchParams();
  console.log(id);
  const activeAccount = useActiveAccount();
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={32} color="black" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Loan Details</Text>
          </View>
        </View>

        <View style={styles.profileBody}>
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <View>
                <Image
                  source={require("@/assets/images/profile.jpg")}
                  style={styles.profileImage}
                />
                <Text style={styles.profileTitle}>Sylus Abel</Text>
              </View>
              <View style={styles.addressContainer}>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.chamaBlack,
                    padding: 8,
                    borderRadius: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: width * 0.4,
                  }}
                >
                  <Text
                    style={{
                      color: colors.chamaGray,
                      fontSize: 12,
                      fontWeight: "bold",
                      fontFamily: "JakartSemiBold",
                    }}
                  >
                    Wallet Address
                  </Text>
                  <Ionicons
                    name="link-outline"
                    size={20}
                    color={colors.chamaGray}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: width * 0.4,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: colors.accent,
                    borderRadius: 10,
                    padding: 8,
                  }}
                  onPress={() => setIsModalVisible(true)}
                >
                  <Text style={styles.addressText}>View More</Text>
                  <Ionicons
                    name="arrow-forward-outline"
                    size={20}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.extrasContainer}>
              <View style={styles.extrasItem}>
                <Text style={styles.extraTitle}>KES 1K</Text>
                <Text style={styles.extraText}>Loan Amount</Text>
              </View>
              <View style={styles.extrasItem}>
                <Text style={styles.extraTitle}>Pending</Text>
                <Text style={styles.extraText}>Loan Status</Text>
              </View>
              <View style={styles.extrasItem}>
                <Text style={styles.extraTitle}>1</Text>
                <Text style={styles.extraText}>Guarantors</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.guarantorContainer}>
          <Text style={styles.guarantorTitle}>Guarantors</Text>
          <View style={styles.loansGivenHeader}>
            <Text style={styles.loansMemberHeaderText}>Member</Text>
            <Text style={styles.loansStatusHeaderText}>Guaranteed Amount</Text>
          </View>
          <Guarantor
            id="1"
            icon={require("@/assets/images/profile.jpg")}
            user="Sylus Abel"
            amount="KES 1,000"
          />
        </View>

        <TouchableOpacity
          style={[
            {
              marginHorizontal: 16,
              height: 40,
            },
            styles.closeButton,
          ]}
          onPress={() => router.push(`/guarantee/1`)}
        >
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={colors.chamaGray}
          />
          <Text style={styles.closeText}>Guarantee this loan</Text>
        </TouchableOpacity>

        <Modal visible={isModalVisible} transparent={true} animationType="fade">
          <BlurView intensity={10} style={styles.overlay}>
            <View style={styles.tooltipContainer}>
              <Text style={styles.profileActionsTitle}>
                Profile Achievements
              </Text>
              <Text style={[styles.tooltipText, { marginHorizontal: 16 }]}>
                These are Sylus's profile statistics
              </Text>
              <FlatList
                style={styles.profileActionsContainer}
                data={profileActions}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => <ProfileActions {...item} />}
                numColumns={2}
                scrollEnabled={false}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoanOverview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f7f9",
  },
  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "MontserratAlternates",
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "JakartaRegular",
    marginTop: 6,
  },
  profileBody: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  profileHeader: {},
  profileImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 100,
  },
  addressContainer: {
    flexDirection: "column",
    gap: 16,
  },
  addressText: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "JakartaRegular",
  },
  addressIcon: {
    fontSize: 20,
    color: "black",
  },
  extrasContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 32,
  },
  extrasText: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "JakartaRegular",
  },
  extrasItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  extraTitle: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "JakartSemiBold",
  },
  extraText: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "JakartaRegular",
    marginTop: 4,
  },
  profileActionsContainer: {
    marginTop: 16,
    width: width,
    marginHorizontal: 2,
  },
  profileActionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "JakartSemiBold",
    marginHorizontal: 16,
    marginTop: 32,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
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
    marginTop: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tooltipContainer: {
    width: width * 0.99,
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
  guarantorContainer: {
    marginHorizontal: 16,
    marginTop: 32,
  },
  guarantorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "JakartSemiBold",
  },
  loansGivenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 0,
    marginBottom: 10,
    backgroundColor: "#f6f5f5",
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 8,
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
