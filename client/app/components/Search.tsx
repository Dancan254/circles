import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface SearchProps {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

const Search = ({ placeholder, value, onChangeText }: SearchProps) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={24} color={colors.chamaGreen} />
      <TextInput
        placeholder={placeholder}
        style={styles.inputField}
        autoCapitalize="none"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.primary,
    borderRadius: 24,
    backgroundColor: "#F0F9F7",
    marginBottom: 20,
    paddingHorizontal: 20,
    marginVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  inputField: {
    height: 50,
    padding: 10,
    fontFamily: "JakartaRegular",
    flex: 1,
  },
});
