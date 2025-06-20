import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Linking,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Lottie from "lottie-react-native";
import AppBanner from "../components/AppBanner";
const width = Dimensions.get("window").width;
import colors from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Clipboard from "@react-native-clipboard/clipboard";

const Overview = () => {
  const [chamaName, setChamaName] = useState("");
  const [chamaAddress, setChamaAddress] = useState("");

  useEffect(() => {
    const fetchChamaName = async () => {
      const chamaName = await AsyncStorage.getItem("chamaName");
      if (chamaName) {
        setChamaName(chamaName);
      }
      const chamaAddress = await AsyncStorage.getItem("chamaAddress");
      if (chamaAddress) {
        setChamaAddress(chamaAddress);
      }
    };
    fetchChamaName();
  }, []);

  const copyChamaPageAppDeepLink = () => {
    Clipboard.setString(`myapp://chama/${chamaAddress}`);
    Alert.alert("Chama Page App Deep Link Copied to Clipboard");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppBanner />
        <Text style={styles.title}>{chamaName} Chama Created</Text>
        <Text style={styles.subtitle}>
          Your chama has been created successfully. You can now view it and
          share it with your friends and family.
        </Text>
      </View>
      <View style={styles.animationContainer}>
        <Lottie
          source={require("../../assets/images/success.json")}
          autoPlay
          loop={false}
          style={styles.animationContainer}
        />
        <TouchableOpacity
          style={styles.shareButton}
          onPress={copyChamaPageAppDeepLink}
        >
          <Text style={styles.footerText}>Share Invite</Text>
          <Ionicons name="share-social-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => router.push(`/chama/${chamaAddress}`)}
        >
          <Text style={styles.getStartedButtonText}>View Chama</Text>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 34,
          }}
        >
          <Text style={styles.footerText}>Back Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Overview;

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
    fontSize: 22,
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
    fontFamily: "JakartSemiBold",
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
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  getStartedButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "JakartSemiBold",
  },
  shareButton: {
    backgroundColor: "#f0f7f9",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accent,
    padding: 16,
  },
});
