import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AppBaner from "./components/AppBanner";
import CustomTextInput from "./components/CustomTextInput";
import colors from "@/constants/Colors";
import { router } from "expo-router";

const OTP = () => {
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const handleResend = () => {
    setIsResendDisabled(true);
    setResendTimer(60);
  };

  useEffect(() => {
    if (resendTimer > 0) {
      setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
  }, [resendTimer]);

  const handleVerify = () => {
    console.log("OTP verified");
    router.navigate("/createCoinbaseWallet");
  };
  return (
    <SafeAreaView style={styles.container}>
      <AppBaner />
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>
        Enter the OTP sent to your phone number
      </Text>
      <View style={styles.otpContainer}>
        <CustomTextInput
          placeholder="OTP"
          title="Enter OTP"
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={[
            styles.resendButton,
            {
              opacity: isResendDisabled ? 0.5 : 1,
            },
          ]}
          onPress={handleResend}
          disabled={isResendDisabled}
        >
          <Text style={styles.resendButtonText}>Resend OTP </Text>
          {isResendDisabled && (
            <Text style={styles.resendTimer}>{resendTimer}s</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OTP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f7f9",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    fontFamily: "MontserratAlternates",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "JakartaRegular",
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  otpContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  resendButton: {
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  resendButtonText: {
    color: colors.accent,
    fontFamily: "JakartaRegular",
    fontSize: 16,
    textAlign: "center",
  },
  verifyButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  verifyButtonText: {
    color: colors.textprimary,
    fontFamily: "JakartSemiBold",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 5,
  },
  resendTimer: {
    fontFamily: "JakartaRegular",
    fontSize: 14,
    textAlign: "center",
    color: colors.accent,
  },
});
