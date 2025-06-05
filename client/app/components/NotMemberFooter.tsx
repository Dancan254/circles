import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const NotMemberFooter = () => {
  return (
    <View
      style={{
        marginTop: 20,
        alignItems: "center",
        position: "absolute",
        bottom: 50,
      }}
    >
      <Text style={styles.memberLoginText}>Already a member?</Text>
      <Link href={{ pathname: "/login" }} asChild>
        <Text
          style={{
            textDecorationLine: "underline",
            marginLeft: 2,
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
    </View>
  );
};

export default NotMemberFooter;

const styles = StyleSheet.create({
  memberLoginText: {
    fontFamily: "JakartaLight",
    fontSize: 18,
    width: 400,
    paddingHorizontal: 40,
    marginTop: 10,
    textAlign: "center",
  },
});
