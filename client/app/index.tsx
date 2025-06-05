import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import { Link } from "expo-router";

const { width } = Dimensions.get("window");
const index = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image
          style={styles.bannerImage}
          source={require("../assets/images/Subtract.png")}
        />
      </View>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome to ChamaDAO</Text>
        <Text style={styles.welcomeText2}>
          A decentralized platform inspired by Kenya’s trusted chamas.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Link href={"/onboard"} asChild style={styles.btn}>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              paddingVertical: 20,
              fontSize: 20,
            }}
          >
            Create an Account
          </Text>
        </Link>
      </View>
      <Text
        style={{
          marginTop: 20,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Text style={styles.memberLoginText}>Already a member? </Text>
        <Link href={{ pathname: "/login" }} asChild>
          <Text
            style={{
              textDecorationLine: "underline",
              fontFamily: "JakartaLight",
              fontSize: 18,
              width: 400,
              paddingHorizontal: 40,
              marginTop: 10,
              textAlign: "center",
            }}
          >
            Login
          </Text>
        </Link>
      </Text>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  bannerContainer: {
    marginTop: 32,
  },
  bannerImage: {
    width: width * 0.7,
    height: width * 0.7,
  },
  welcomeContainer: {
    marginTop: 70,
  },
  buttonContainer: {
    marginTop: 50,
    alignContent: "center",
  },
  welcomeText: {
    fontFamily: "PoppinsRegular",
    fontSize: 40,
    width: 400,
    paddingHorizontal: 40,
  },
  welcomeText2: {
    fontFamily: "JakartaLight",
    fontSize: 20,
    width: 400,
    paddingHorizontal: 40,
    marginTop: 10,
  },
  memberLoginText: {
    fontFamily: "JakartaLight",
    fontSize: 18,
    width: 400,
    paddingHorizontal: 40,
    marginTop: 10,
    textAlign: "center",
  },
  btn: {
    backgroundColor: "#1A1A1A",
    padding: 10,
    borderRadius: 100,
    width: 350,
    textAlign: "center",
  },
});
