import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AccountSetting from "./components/AccountSetting";
import { accountSettings } from "@/constants/Styles";
import { Image, ImageBackground } from "expo-image";
import colors from "@/constants/Colors";

interface AccountSettingProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const Settings = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Settings</Text>
          </View>
        </View>
        <View style={styles.accountContainer}>
          {accountSettings.map((setting: AccountSettingProps) => (
            <AccountSetting
              key={setting.title}
              title={setting.title}
              icon={setting.icon}
            />
          ))}
        </View>
        <View style={styles.premiumContainer}>
          <View style={styles.premiumHeader}>
            <Image
              source={require("@/assets/images/premium.png")}
              style={styles.premiumImage}
            />
            <Text style={styles.premiumText}>Premium Status</Text>
          </View>
          <View style={styles.premiumStatus}>
            <Text style={styles.premiumStatusText}>Active</Text>
            <Ionicons name="chevron-forward-outline" size={24} color="black" />
          </View>
        </View>

        <ImageBackground
          source={require("@/assets/images/reffer.png")}
          style={styles.referralContainer}
          contentFit="fill"
        >
          <Text style={styles.referralText}>Refer and Earn</Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: "JakartaRegular",
              color: colors.chamaBlack,
              marginTop: 5,
              maxWidth: "60%",
              lineHeight: 20,
            }}
          >
            Get 1 free money transfer for every 10 friends you refer.
          </Text>
          <TouchableOpacity style={styles.referralButton}>
            <Text style={styles.referralButtonText}>Share</Text>
            <Ionicons name="share-social-outline" size={24} color="white" />
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.appSettingsContainer}>
          <View style={styles.appSettingsItem}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Image
                source={require("@/assets/images/Subtract.png")}
                style={styles.appSettingsImage}
              />
              <Text style={styles.appSettingsItemText}>App Icon</Text>
            </View>
            <View style={styles.appSettingsItem}>
              <Ionicons
                name="chevron-forward-outline"
                size={24}
                color="black"
              />
            </View>
          </View>
          <View style={styles.appSettingsItem}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Ionicons name="apps-outline" size={44} color="black" />
              <Text style={styles.appSettingsItemText}>Widgets</Text>
            </View>
            <View style={styles.appSettingsItem}>
              <Ionicons
                name="chevron-forward-outline"
                size={24}
                color="black"
              />
            </View>
          </View>
        </View>
        <Text style={styles.footerText}>v0.0.1</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f7f9",
  },
  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  textContainer: {
    flexDirection: "column",
    gap: 2,
    justifyContent: "center",
    alignItems: "center",
    width: "85%",
  },
  backButton: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: "white",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "JakartaSemiBold",
  },
  accountContainer: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  premiumContainer: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  premiumHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  premiumText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "JakartaRegular",
  },
  premiumImage: {
    width: 40,
    height: 40,
  },
  premiumStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  premiumStatusText: {
    fontSize: 16,
    fontFamily: "JakartSemiBold",
    color: colors.chamaGreen,
  },
  referralContainer: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    height: 150,
    overflow: "hidden",
  },
  referralText: {
    fontSize: 16,
    fontFamily: "JakartSemiBold",
    color: colors.chamaBlack,
  },
  referralButton: {
    backgroundColor: colors.chamaBlack,
    padding: 4,
    borderRadius: 10,
    width: "40%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: 20,
  },
  referralButtonText: {
    fontSize: 16,
    fontFamily: "JakartaRegular",
    color: colors.chamaGray,
    alignSelf: "center",
  },
  appSettingsContainer: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  appSettingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  appSettingsItemText: {
    fontSize: 16,
    fontFamily: "JakartaRegular",
    color: colors.chamaBlack,
  },
  appSettingsImage: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  footerText: {
    fontSize: 12,
    fontFamily: "JakartaRegular",
    color: colors.chamaBlue,
    marginHorizontal: 16,
    marginTop: 8,
    textAlign: "center",
  },
});
