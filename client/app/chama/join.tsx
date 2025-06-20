import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import colors from "@/constants/Colors";
import { Image } from "expo-image";
import { useGetAllChamas } from "@/hooks/useChama";

export interface ChamaMember {
  walletAddress: string;
  fullName: string;
  profileImage: string | null;
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

const Join = () => {
  const { data: chamas } = useGetAllChamas() as {
    data: ChamaData[];
  };
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const filteredChamas = chamas?.filter((chama: ChamaData) =>
    chama?.name?.toLowerCase()?.includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Join a Chama</Text>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <View style={styles.searchInputIconContainer}>
              <Ionicons name="search" size={24} color={colors.chamaGreen} />
              <TextInput
                placeholder="Find a Chama"
                style={styles.inputField}
                autoCapitalize="none"
                onChangeText={handleSearch}
                value={searchQuery}
              />
            </View>
            <View style={{}}>
              {searchQuery === "" && (
                <Text style={styles.searchInputText}>
                  Start typing to search
                </Text>
              )}
              {searchQuery !== "" && (
                <View style={styles.filteredChamasContainer}>
                  {filteredChamas.map((chama) => (
                    <TouchableOpacity
                      style={styles.filteredChama}
                      onPress={() => router.push(`/join/${chama.chamaAddress}`)}
                      key={chama.name}
                    >
                      <Image
                        source="https://cdn-icons-png.flaticon.com/512/745/745650.png"
                        style={styles.filteredChamaImage}
                      />
                      <Text>{chama.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Join;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f7f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
    fontFamily: "MontserratAlternates",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchInputContainer: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.primary,
    borderRadius: 24,
    backgroundColor: "#F0F9F7",
  },
  searchInputIconContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.primary,
  },
  inputField: {
    height: 50,
    padding: 10,
    fontFamily: "JakartaRegular",
  },
  searchInputText: {
    fontFamily: "JakartaRegular",
    fontSize: 12,
    color: colors.chamaBlue,
    textAlign: "center",
    marginBottom: 10,
  },
  filteredChamasContainer: {
    paddingHorizontal: 20,
  },
  filteredChama: {
    padding: 10,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  filteredChamaImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});
