import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  FlatList,
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
import { UserData } from ".";
import { useGetUser } from "@/hooks/useUser";

const { width } = Dimensions.get("window");

const Profile = () => {
  const activeAccount = useActiveAccount();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: userData } = useGetUser(activeAccount!.address) as {
    data: UserData;
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{userData?.fullName}</Text>
            <MaterialCommunityIcons
              name="check-decagram"
              size={16}
              color={colors.chamaGreen}
            />
          </View>
          <TouchableOpacity onPress={() => router.push("/settings")}>
            <Ionicons name="cog-outline" size={32} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileBody}>
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <Image
                source={
                  userData?.profileImage ||
                  require("@/assets/images/profile.jpg")
                }
                style={styles.profileImage}
              />
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
                    {activeAccount?.address.slice(0, 12)}...
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
                  }}
                >
                  <Text style={styles.addressText}>
                    {userData?.memberChamas.length > 0
                      ? userData?.memberChamas[0].name
                      : "No Chama"}
                  </Text>
                  {userData?.memberChamas.length > 0 && (
                    <Ionicons
                      name="arrow-forward-outline"
                      size={20}
                      color="black"
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.extrasContainer}>
              <View style={styles.extrasItem}>
                <Text style={styles.extraTitle}>{userData?.email}</Text>
                <Text style={styles.extraText}>Email</Text>
              </View>
              <View style={styles.extrasItem}>
                <AccountProvider
                  client={client}
                  address={activeAccount!.address}
                >
                  <AccountBalance style={styles.extraTitle} />
                </AccountProvider>
                <Text style={styles.extraText}>Balance</Text>
              </View>
              <View style={styles.extrasItem}>
                <Text style={styles.extraTitle}>KES 1K</Text>
                <Text style={styles.extraText}>Transactions</Text>
              </View>
            </View>
          </View>
        </View>
        <Text style={styles.profileActionsTitle}>Profile Achievements</Text>
        <FlatList
          style={styles.profileActionsContainer}
          data={profileActions}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <ProfileActions {...item} />}
          numColumns={2}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

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
    width: 100,
    height: 100,
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
    marginTop: 16,
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
});
