import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import colors from "@/constants/Colors";
import contract, { client } from "@/utils/client";
import {
  useGetChama,
  useIsMemberOfChama,
  useJoinChama,
} from "@/hooks/useChama";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import * as Clipboard from "expo-clipboard";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { UserData } from "../(tabs)";
import { useGetUser } from "@/hooks/useUser";
import { tokenAddresses } from "@/constants/Styles";
import { transfer } from "thirdweb/extensions/erc20";
import { baseSepolia } from "thirdweb/chains";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

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

const updateUserOnboardingStep = async () => {
  try {
    const userStep = await AsyncStorage.getItem("userStep");
    if (userStep) {
      await AsyncStorage.setItem(
        "userStep",
        (parseInt(userStep) + 1).toString()
      );
    }
  } catch (error) {
    console.error(error);
  }
};

const convertKesToUsd = (amount: number) => {
  return (amount / 129.33).toFixed(2);
};

const JoinChama = () => {
  const activeAccount = useActiveAccount();
  const { id } = useLocalSearchParams();
  const { data: chamaData } = useGetChama(id as string) as {
    data: ChamaData;
  };
  const { data: userData } = useGetUser(activeAccount!.address) as {
    data: UserData;
  };
  const { data: isMember } = useIsMemberOfChama(
    chamaData?.chamaAddress,
    activeAccount?.address as string
  );
  const { mutateAsync: sendTransaction } = useSendTransaction();
  const { mutateAsync: joinChama } = useJoinChama(
    chamaData?.chamaAddress,
    activeAccount?.address as string
  );
  const [loading, setLoading] = useState(false);

  if (!chamaData) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.chamaBlue} />
      </View>
    );
  }
  const formatted = new Date(chamaData?.dateCreated).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleCopyChamaAddress = () => {
    Clipboard.setString(chamaData?.chamaAddress);
    Alert.alert("Address Copied", "Chama Address Copied to Clipboard");
  };

  const handleJoinChama = async () => {
    if (!activeAccount || !userData) {
      Alert.alert("Error", "Please connect your wallet");
      return;
    }
    try {
      setLoading(true);
      // if the chama requires a reg fee, transfer the reg fee to the chama address
      const usdcContract = getContract({
        address: tokenAddresses.usdc,
        client,
        chain: baseSepolia,
      });
      const convertedAmount = convertKesToUsd(chamaData?.registrationFeeAmount);
      console.log(convertedAmount);
      const transaction = transfer({
        contract: usdcContract,
        to: chamaData?.chamaAddress,
        amount: convertedAmount,
      });
      const result = await sendTransaction(transaction);
      console.log(result);
      // call the addMember to chama on the backend
      const response = await joinChama();
      updateUserOnboardingStep();
      console.log(response);
      // navigate to the chama dashboard.
      Alert.alert("Request Sent", "Request to join Chama Sent", [
        {
          text: "OK",
          onPress: () => router.push(`/chama/${chamaData?.chamaAddress}`),
        },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{chamaData?.name}</Text>
      </View>
      <View style={styles.chamaContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.membersText}>
            {chamaData?.members?.length}{" "}
            {chamaData?.members?.length === 1 ? "member" : "members"}
          </Text>
          <Text style={styles.registrationFeeText}>
            Registration Fee: KSH {chamaData?.registrationFeeAmount}
          </Text>
        </View>
        <View style={styles.chamaInfoContainer}>
          <View style={styles.chamaInfoItem}>
            <Image
              source="https://cdn-icons-png.flaticon.com/512/745/745650.png"
              style={styles.chamaImage}
            />
            <Text style={styles.chamaName}>{chamaData?.name}</Text>
          </View>
          <View style={styles.financialInfoContainer}>
            <View style={styles.financialInfoItem}>
              <Text style={styles.financialInfoText}>
                {chamaData?.contributionPeriod} Contribution
              </Text>
              <Text style={styles.amountText}>
                KES {chamaData?.contributionAmount?.toLocaleString()}
              </Text>
            </View>
            <View style={styles.financialInfoItem}>
              <Text style={styles.financialInfoText}>Date Created</Text>
              <Text style={styles.amountText}>{formatted}</Text>
            </View>
          </View>
          <View style={styles.footer}>
            <View style={styles.chamaCode}>
              <Text style={styles.footerText}>
                Chama Code: {chamaData?.chamaId?.slice(0, 4)}{" "}
                {chamaData?.chamaId?.slice(4, 8)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.chamaCode}
              onPress={handleCopyChamaAddress}
            >
              <Text style={styles.footerText}>
                {chamaData?.chamaAddress?.slice(0, 12)}...
              </Text>
              <Ionicons
                name="copy-outline"
                size={14}
                color={colors.chamaBlack}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.btn,
            {
              opacity: !chamaData || isMember || loading ? 0.5 : 1,
            },
          ]}
          disabled={!chamaData || isMember || loading}
          onPress={handleJoinChama}
        >
          <Text
            style={[
              styles.financialInfoText,
              {
                color: colors.chamaGray,
                textAlign: "center",
                fontSize: 18,
                fontFamily: "JakartSemiBold",
              },
            ]}
          >
            {loading ? "Joining..." : "Request to join Chama"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default JoinChama;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
    fontFamily: "MontserratAlternates",
  },
  chamaContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  chamaImage: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  chamaName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
    fontFamily: "MontserratAlternates",
  },
  membersText: {
    fontSize: 14,
    color: "#212121",
    fontFamily: "JakartSemiBold",
    marginBottom: 16,
    marginHorizontal: 4,
  },
  registrationFeeText: {
    fontSize: 12,
    color: "#212121",
    fontFamily: "JakartRegular",
    marginBottom: 16,
    marginHorizontal: 4,
  },
  chamaInfoContainer: {
    width: width - 32,
    height: width / 1.8 - 32,
    backgroundColor: colors.chamaBlue,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  chamaInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  financialInfoContainer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "space-between",
  },
  financialInfoText: {
    fontSize: 14,
    color: "#212121",
    fontFamily: "JakartRegular",
  },
  amountText: {
    fontSize: 24,
    color: "#212121",
    fontFamily: "MontserratAlternates",
  },
  financialInfoItem: {
    gap: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  footerText: {
    fontSize: 12,
    color: "#212121",
    fontFamily: "JakartRegular",
  },
  chamaCode: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  btn: {
    backgroundColor: colors.chamaBlack,
    borderRadius: 18,
    padding: 16,
    marginTop: 32,
  },
});
