import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useActiveAccount } from "thirdweb/react";
import { useGetUser } from "@/hooks/useUser";
import { UserData } from "../(tabs)";
import { useGetChama } from "@/hooks/useChama";
import MemberView from "../components/MemberView";
import colors from "@/constants/Colors";

interface Member {
  walletAddress: string;
  fullName: string;
  profileImage: string;
}
const Members = () => {
  const activeAccount = useActiveAccount();
  const { data: userData } = useGetUser(activeAccount!.address) as {
    data: UserData;
  };
  const chamaAddress = userData?.createdChamas[0]?.chamaAddress;
  const { data: chamaData } = useGetChama(chamaAddress as string);
  if (!userData || !chamaData) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chama Members</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Member</Text>
          <Text style={styles.title}>Wallet Address</Text>
        </View>
        <View style={styles.membersContainer}>
          {chamaData?.members?.map((member: Member) => (
            <MemberView
              key={member.walletAddress}
              fullName={member.fullName}
              icon={member.profileImage}
              id={member.walletAddress}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Members;

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
  titleContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: "white",
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "JakartSemiBold",
  },
  membersContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
});
