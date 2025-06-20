import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { countryFlags } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/Colors";
import { BlurView } from "expo-blur";

const COUNTIES = [
  { name: "Nairobi" },
  { name: "Mombasa" },
  { name: "Kisumu" },
  { name: "Nakuru" },
  { name: "Eldoret" },
  { name: "Nyeri" },
  { name: "Meru" },
  { name: "Nanyuki" },
  { name: "Kisii" },
  { name: "Other" },
];
interface CountySelectorProps {
  value: string;
  onChange: (code: string) => void;
}

const { width } = Dimensions.get("window");

const LocationSelector = ({ value, onChange }: CountySelectorProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selected = COUNTIES.find((c) => c.name === value) || COUNTIES[0];
  return (
    <View style={{ marginBottom: 20 }}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
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
                data={COUNTIES}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => {
                      onChange(item.name);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.optionText}>{item.name}</Text>
                    {item.name === selected.name && (
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
};

export default LocationSelector;

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
    width: width * 0.9,
    paddingVertical: 14,
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
