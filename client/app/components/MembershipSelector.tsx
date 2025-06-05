import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/Colors";
import { BlurView } from "expo-blur";

const MEMBER_OPTIONS = [
  { label: "5 Members", value: 5 },
  { label: "10 Members", value: 10 },
  { label: "15 Members", value: 15 },
  { label: "20 Members", value: 20 },
  { label: "25 Members", value: 25 },
  { label: "50 Members", value: 50 },
  { label: "100 Members", value: 100 },
  { label: "200 Members", value: 200 },
  { label: "500 Members", value: 500 },
  { label: "1000 Members", value: 1000 },
  { label: "Unlimited", value: "Unlimited" },
];

interface MembershipSelectorProps {
  value: number | string;
  onChange: (value: number | string) => void;
}

const { width } = Dimensions.get("window");

const MembershipSelector = ({ value, onChange }: MembershipSelectorProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selected =
    MEMBER_OPTIONS.find((c) => c.value === value) || MEMBER_OPTIONS[0];
  return (
    <View style={{ marginBottom: 20 }}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.selectedText}>{selected.label}</Text>
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
                data={MEMBER_OPTIONS}
                keyExtractor={(item) => item.label}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => {
                      onChange(item.value);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.optionText}>{item.label}</Text>
                    {item.value === selected.value && (
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

export default MembershipSelector;

const styles = StyleSheet.create({
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
