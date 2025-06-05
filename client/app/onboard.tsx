import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import Lottie from "lottie-react-native";
import colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import CustomButton from "./components/CustomButton";

const { width, height } = Dimensions.get("window");

const onboard = () => {
  const router = useRouter();

  const handleDone = () => {
    router.push("/register");
  };
  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        bottomBarHighlight={false}
        DoneButtonComponent={() => (
          <CustomButton title="Register" onPress={handleDone} />
        )}
        // NextButtonComponent={() => <CustomButton title="Next" />}
        containerStyles={{ paddingHorizontal: 15 }}
        pages={[
          {
            backgroundColor: colors.chamaYellow,
            titleStyles: {
              fontFamily: "JakartaRegular",
            },
            subTitleStyles: {
              fontFamily: "PoppinsRegular",
              lineHeight: 24,
              fontSize: 16,
            },
            image: (
              <Lottie
                source={require("../assets/images/how.json")}
                autoPlay
                loop
                style={{
                  width: 300,
                  height: 400,
                }}
              />
            ),
            title: "Welcome to ChamaDAO",
            subtitle:
              "ChamaDAO is a decentralized platform that empowers communities to pool funds, invest together, and grow wealth collectively.",
          },
          {
            backgroundColor: colors.primary,
            titleStyles: {
              fontFamily: "JakartaRegular",
            },
            subTitleStyles: {
              fontFamily: "PoppinsRegular",
              lineHeight: 24,
              fontSize: 16,
            },
            image: (
              <View>
                <Lottie
                  source={require("../assets/images/two.json")}
                  autoPlay
                  loop
                  style={styles.animationContainer}
                />
              </View>
            ),
            title: "How it Works",
            subtitle:
              "Secure contributions with smart contracts, vote on proposals, and track investments in a fully transparent treasury",
          },
          {
            backgroundColor: colors.chamaGreen,

            titleStyles: {
              color: colors.chamaBlack,
              fontFamily: "JakartaRegular",
            },
            subTitleStyles: {
              color: colors.chamaBlack,
              fontFamily: "PoppinsRegular",
              lineHeight: 24,
              fontSize: 16,
            },
            image: (
              <View style={styles.animationContainer}>
                <Lottie
                  source={require("../assets/images/start.json")}
                  autoPlay
                  loop
                  style={styles.animationContainer}
                />
              </View>
            ),
            title: "Get Started",
            subtitle:
              "Create an account, join or create a Chama, and collaborate for a brighter, decentralized financial future",
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  animationContainer: {
    width: width * 0.9,
    height: width,
  },
});

export default onboard;
