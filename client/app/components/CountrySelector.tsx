import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { countryFlags } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/Colors";
import { BlurView } from "expo-blur";

const COUNTRIES = [
  { code: "ke", name: "Kenya", phoneCode: "+254" },
  { code: "ng", name: "Nigeria", phoneCode: "+234" },
  { code: "tz", name: "Tanzania", phoneCode: "+255" },
  { code: "rw", name: "Rwanda", phoneCode: "+250" },
  { code: "sa", name: "South Africa", phoneCode: "+27" },
];

const flagImages: { [key: string]: any } = {
  ...countryFlags,
};

interface CountrySelectorProps {
  value: string;
  onChange: (code: string) => void;
  setCountryCode: (code: string) => void;
}

export default function CountrySelector({
  value,
  onChange,
  setCountryCode,
}: CountrySelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const selected = COUNTRIES.find((c) => c.code === value) || COUNTRIES[0];

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.label}>Country</Text>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Image source={flagImages[selected.code]} style={styles.flag} />
        <Text style={styles.selectedText}>{selected.name}</Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color="#222"
          style={{ marginLeft: "auto" }}
        />
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <BlurView intensity={30} tint="light" style={styles.overlay}>
            <View style={styles.dropdown}>
              <FlatList
                data={COUNTRIES}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => {
                      onChange(item.code);
                      setCountryCode(item.phoneCode);
                      setModalVisible(false);
                    }}
                  >
                    <Image source={flagImages[item.code]} style={styles.flag} />
                    <Text style={styles.optionText}>{item.name}</Text>
                    {item.code === selected.code && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#4caf50"
                        style={{ marginLeft: "auto" }}
                      />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </BlurView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    fontFamily: "JakartaRegular",
    fontSize: 14,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.primary,
    borderRadius: 24,
    padding: 10,
    backgroundColor: "#F0F9F7",
  },
  flag: {
    width: 34,
    height: 24,
    borderRadius: 2,
    marginRight: 8,
  },
  selectedText: {
    fontFamily: "JakartaRegular",
    fontSize: 16,
    color: "#222",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    width: "80%",
    backgroundColor: "#f0f9f7",
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderColor: colors.accent,
    borderWidth: StyleSheet.hairlineWidth,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    fontFamily: "JakartaRegular",
    color: "#222",
  },
});
