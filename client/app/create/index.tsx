import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Linking,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Lottie from "lottie-react-native";
import AppBanner from "../components/AppBanner";
const width = Dimensions.get("window").width;
import colors from "@/constants/Colors";

const Create = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppBanner />
        <Text style={styles.title}>Create a Chama</Text>
        <Text style={styles.subtitle}>
          Create a chama to start saving and borrowing money with your friends
          and family.
        </Text>
      </View>
      <View style={styles.animationContainer}>
        <Lottie
          source={require("../../assets/images/write.json")}
          autoPlay
          loop
          style={styles.animationContainer}
        />
        <Text style={styles.footerText}>
          Creating a chama is like drafting a constitution for your group which
          will be used to govern the chama.{" "}
          <Text
            style={styles.learnMoreText}
            onPress={() => Linking.openURL("https://www.thechamadao.xyz/")}
          >
            Learn why.
          </Text>
        </Text>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => router.push("/create/chamaDetails")}
        >
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 24,
          }}
        >
          <Text style={styles.footerText}>Back Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9F7",
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212121",
    fontFamily: "MontserratAlternates",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textsecondary,
    fontFamily: "JakartaRegular",
    marginTop: 4,
    textAlign: "center",
  },
  animationContainer: {
    width: width * 0.9,
    height: width,
    alignSelf: "center",
  },
  footerText: {
    fontSize: 16,
    color: colors.chamaBlack,
    fontFamily: "JakartaRegular",
    marginTop: 4,
    lineHeight: 24,
    marginBottom: 14,
  },
  learnMoreText: {
    color: colors.accent,
    fontFamily: "JakartaRegular",
    textDecorationLine: "underline",
  },
  getStartedButton: {
    backgroundColor: colors.chamaBlack,
    borderRadius: 14,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 32,
  },
  getStartedButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "JakartSemiBold",
  },
});
