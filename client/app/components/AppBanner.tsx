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
          source={require("../../assets/images/Union.png")}
          style={styles.logo}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>The ChamaDAO</Text>
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
    backgroundColor: "#f0f7f9",
    borderRadius: 15,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    width: 200,
  },
  logo: {
    width: 20,
    height: 20,
    objectFit: "contain",
  },
  titleContainer: {
    marginLeft: 4,
  },
  title: {
    fontFamily: "MontserratAlternates",
    fontSize: 16,
  },
});
