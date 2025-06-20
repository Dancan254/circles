import { StyleSheet, TextInput, View, Text } from "react-native";
import { Image } from "expo-image";
import colors from "@/constants/Colors";
const ken = require("../../assets/images/ke.png");

const PhoneNumberInput = ({
  countryCode,
  value,
  onChangeText,
}: {
  countryCode: string;
  value: string;
  onChangeText: (text: string) => void;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.flagContainer}>
        <Text style={styles.flag}>{countryCode}</Text>
      </View>
      <TextInput
        placeholder="712345678"
        style={styles.inputField}
        keyboardType="phone-pad"
        maxLength={10}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default PhoneNumberInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.primary,
    borderRadius: 24,
    backgroundColor: "#F0F9F7",
    padding: 8,
    marginBottom: 20,
  },
  flag: {
    fontFamily: "JakartaRegular",
    fontSize: 14,
    color: colors.primary,
  },
  flagContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  inputField: {
    fontFamily: "JakartaRegular",
    paddingHorizontal: 20,
    height: 30,
  },
});
