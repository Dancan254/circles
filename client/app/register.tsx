import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppBanner from "./components/AppBanner";
import CustomTextInput from "./components/CustomTextInput";
import PhoneNumberInput from "./components/PhoneNumberInput";
import CountrySelector from "./components/CountrySelector";
import colors from "@/constants/Colors";
import { useRouter } from "expo-router";

interface RegisterDetails {
  fullName: string;
  email: string;
  country: string;
  role: string;
  idNumber: string;
  mobileNumber: string;
}

const register = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("39296079");
  const [mobileNumber, setPhoneNumber] = useState("+712345678");
  const [country, setCountry] = useState("ke");
  const [role, setRole] = useState("member");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string[] | null>(null);
  const [countryCode, setCountryCode] = useState("+254");

  const handleRegistration = () => {
    const registerDetails: RegisterDetails = {
      fullName,
      email,
      country,
      role,
      idNumber,
      mobileNumber,
    };
    const errors = Object.keys(registerDetails).filter(
      (key) => registerDetails[key as keyof RegisterDetails] === ""
    );
    if (errors.length > 0) {
      setError(errors);
      return;
    }
    try {
      console.log("Registration successful");
      // save user details to local storage
      AsyncStorage.setItem(
        "userRegistrationDetails",
        JSON.stringify(registerDetails)
      );
      router.navigate("/otp");
    } catch (error) {
      console.log(error);
      setError(["An error occurred while registering"]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AppBanner />
        <Text style={styles.title}>Get Started</Text>
        <Text style={styles.subtitle}>Create an account to get started</Text>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ paddingHorizontal: 20 }}>
              <CustomTextInput
                placeholder="Sylus Abel"
                title="Full Name"
                value={fullName}
                onChangeText={setFullName}
              />
              <CustomTextInput
                placeholder="sylusabel@example.com"
                title="Email Address"
                value={email}
                onChangeText={setEmail}
              />
              <CountrySelector
                value={country}
                onChange={setCountry}
                setCountryCode={setCountryCode}
              />
              <Text
                style={{
                  marginBottom: 6,
                  fontFamily: "JakartaRegular",
                  fontSize: 14,
                }}
              >
                Phone Number
              </Text>
              <PhoneNumberInput
                countryCode={countryCode}
                value={mobileNumber}
                onChangeText={setPhoneNumber}
              />
              <CustomTextInput
                placeholder="39296079"
                title="ID Number"
                keyboardType="numeric"
                value={idNumber}
                onChangeText={setIdNumber}
              />
              <TouchableOpacity
                style={[
                  styles.registerButton,
                  {
                    opacity:
                      fullName === "" ||
                      email === "" ||
                      idNumber === "" ||
                      mobileNumber === ""
                        ? 0.5
                        : 1,
                  },
                ]}
                onPress={() => handleRegistration()}
                disabled={
                  fullName === "" ||
                  email === "" ||
                  idNumber === "" ||
                  mobileNumber === ""
                }
              >
                <Text style={styles.registerButtonText}>Register</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        {error && (
          <Text style={styles.errorText}>
            {error.map((error) => error).join(", ")} required!
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f7f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    fontFamily: "MontserratAlternates",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "PoppinsRegular",
    marginBottom: 20,
  },
  registerButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  registerButtonText: {
    color: colors.textprimary,
    fontFamily: "JakartSemiBold",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  errorText: {
    color: "red",
    fontFamily: "JakartaRegular",
    fontSize: 14,
    textAlign: "center",
  },
});
