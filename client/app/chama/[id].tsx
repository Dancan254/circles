import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useRef, useState } from "react";
import colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { chamaActions } from "@/constants/Styles";
import ChamaAction from "../components/ChamaAction";
import { useGetChama } from "@/hooks/useChama";
import * as Clipboard from "expo-clipboard";
import useChamaBalance from "@/hooks/useChamaBalance";
const screenWidth = Dimensions.get("window").width;

export interface ChamaMember {
  walletAddress: string;
  fullName: string;
  profileImage: string;
}

export interface ChamaData {
  chamaAddress: string;
  chamaId: string;
  name: string;
  description: string;
  location: string;
  profileImage: string;
  creator: ChamaMember;
  maximumMembers: number;
  registrationFeeRequired: boolean;
  registrationFeeAmount: number;
  registrationFeeCurrency: string;
  payoutPeriod: string;
  payoutPercentageAmount: number;
  contributionAmount: number;
  contributionPeriod: string;
  contributionPenalty: number;
  penaltyExpirationPeriod: number;
  maximumLoanAmount: number;
  loanInterestRate: number;
  loanTerm: string;
  loanPenalty: number;
  loanPenaltyExpirationPeriod: number;
  minContributionRatio: number;
  totalContributions: number;
  totalPayouts: number;
  totalLoans: number;
  totalLoanRepayments: number;
  totalLoanPenalties: number;
  members: ChamaMember[];
  dateCreated: string;
  updatedAt: string;
}

const MyChama = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { id } = useLocalSearchParams();
  const scrollRef = useRef(null);
  const { data: chamaData } = useGetChama(id as string);
  const { usdcBalanceInKes, loading, usdcError } = useChamaBalance(
    chamaData?.chamaAddress as string
  );

  if (!chamaData) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.chamaBlue} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const copyChamaAddress = () => {
    Clipboard.setString(chamaData?.chamaAddress as string);
    Alert.alert("Chama Address Copied", "Chama Address Copied to Clipboard");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push("/(tabs)")}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{chamaData?.name}</Text>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 4 }}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x /
                e.nativeEvent.layoutMeasurement.width
            );
            setCurrentIndex(index);
          }}
          scrollEventThrottle={16}
          style={{ marginBottom: 10 }}
        >
          <View style={{ width: screenWidth }}>
            <View style={styles.financialContainer}>
              <View style={styles.financialHeader}>
                <Text style={styles.financialTitle}>Total Contributions</Text>
                <Ionicons name="eye" size={24} color="black" />
              </View>
              <Text style={styles.amountText}>
                KES {chamaData?.totalContributions?.toLocaleString()}
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
                  Location: {chamaData?.location}
                </Text>
              </View>
            </View>
            <View style={styles.balanceContainer}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceTitle}>Balance</Text>
                <Text style={styles.balanceText}>
                  KES {loading ? "..." : usdcBalanceInKes?.toLocaleString()}
                </Text>
              </View>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.balanceItem}
                onPress={copyChamaAddress}
              >
                <Text style={styles.balanceTitle}>Address</Text>
                <Text style={styles.balanceText}>
                  {chamaData?.chamaAddress?.slice(0, 4)}...
                  <Ionicons name="copy-outline" size={14} color="black" />
                </Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <View style={styles.balanceItem}>
                <Text style={styles.balanceTitle}>Contributions</Text>
                <Text style={styles.balanceText}>
                  KES {chamaData?.contributionAmount?.toLocaleString()} /{" "}
                  {chamaData?.contributionPeriod}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ width: screenWidth }}>
            <View style={styles.financialContainer}>
              <View style={styles.financialHeader}>
                <Text style={styles.financialTitle}>Total Loans</Text>
                <Ionicons name="eye" size={24} color="black" />
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
                  Location: {chamaData?.location}
                </Text>
              </View>
            </View>
            <View style={styles.balanceContainer}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceTitle}>Interest Rate</Text>
                <Text style={styles.balanceText}>
                  {chamaData?.loanInterestRate}%
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
              <View style={styles.balanceItem}>
                <Text style={styles.balanceTitle}>Penalty</Text>
                <Text style={styles.balanceText}>
                  KES {chamaData?.loanPenalty?.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.indicatorsContainer}>
          {[0, 1].map((_, idx) => (
            <View
              key={idx}
              style={
                idx === currentIndex ? styles.mainIndicator : styles.indicator
              }
            />
          ))}
        </View>
        <View style={styles.chamaActionsContainer}>
          <FlatList
            data={chamaActions}
            renderItem={({ item }) => (
              <ChamaAction
                title={item.title}
                route={item.route}
                icon={item.icon}
                description={item.description}
                id={id as string}
              />
            )}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 10,
            }}
            scrollEnabled={false}
            keyExtractor={(item) => item.title}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyChama;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f7f9",
  },
  backButton: {
    marginTop: 16,
    marginLeft: 16,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 2,
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
  indicatorsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 0,
    marginTop: 10,
  },
  indicator: {
    width: 40,
    height: 10,
    backgroundColor: colors.chamaBlue,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  mainIndicator: {
    width: 60,
    height: 10,
    backgroundColor: colors.chamaBlack,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  chamaActionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 32,
  },
  loadingText: {
    fontFamily: "JakartaRegular",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
});
