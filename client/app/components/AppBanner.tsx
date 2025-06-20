import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const AppBanner = () => {
  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        marginVertical: 10,
      }}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Circles</Text>
        </View>
      </View>
    </View>
  );
};

export default AppBanner;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderColor: "#A3A1A1",
    borderWidth: 1,
    backgroundColor: "#f6f7f9",
    borderRadius: 40,
    alignItems: "center",
    paddingVertical: 1,
    paddingHorizontal: 10,
    justifyContent: "center",
    width: 200,
  },
  logo: {
    width: 30,
    height: 30,
    objectFit: "cover",
  },
  titleContainer: {
    marginLeft: 4,
  },
  title: {
    fontFamily: "MontserratAlternates",
    fontSize: 16,
  },
});
