import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/Colors";
import { BlurView } from "expo-blur";
import Search from "./Search";

const { width } = Dimensions.get("window");

// Mock members
const MOCK_MEMBERS = [
  {
    id: "1",
    name: "Alice Kimani",
    avatar: require("@/assets/images/profile.jpg"),
  },
  {
    id: "2",
    name: "Brian Otieno",
    avatar: require("@/assets/images/profile.jpg"),
  },
  {
    id: "3",
    name: "Cynthia Mwangi",
    avatar: require("@/assets/images/profile.jpg"),
  },
  {
    id: "4",
    name: "David Njoroge",
    avatar: require("@/assets/images/profile.jpg"),
  },
  {
    id: "5",
    name: "Eunice Wambui",
    avatar: require("@/assets/images/profile.jpg"),
  },
  {
    id: "6",
    name: "Felix Kiptoo",
    avatar: require("@/assets/images/profile.jpg"),
  },
  {
    id: "7",
    name: "Grace Achieng",
    avatar: require("@/assets/images/profile.jpg"),
  },
  {
    id: "8",
    name: "Henry Mutua",
    avatar: require("@/assets/images/profile.jpg"),
  },
  {
    id: "9",
    name: "Irene Chebet",
    avatar: require("@/assets/images/profile.jpg"),
  },
  {
    id: "10",
    name: "James Mwenda",
    avatar: require("@/assets/images/profile.jpg"),
  },
];

interface MemberSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

const MemberSelector = ({ selected, onChange }: MemberSelectorProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filteredMembers = useMemo(() => {
    if (!search) return MOCK_MEMBERS;
    return MOCK_MEMBERS.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <View style={{ marginBottom: 20 }}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.selectedText}>
          {selected.length === 0
            ? "Select Guarantors"
            : `${selected.length} selected`}
        </Text>
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
              <Search
                placeholder="Search members..."
                value={search}
                onChangeText={setSearch}
              />
              <FlatList
                data={filteredMembers}
                keyExtractor={(item) => item.id}
                style={{ maxHeight: 300 }}
                renderItem={({ item }) => {
                  const isSelected = selected.includes(item.id);
                  return (
                    <TouchableOpacity
                      style={styles.option}
                      onPress={() => {
                        let newSelected;
                        if (isSelected) {
                          newSelected = selected.filter((id) => id !== item.id);
                        } else {
                          newSelected = [...selected, item.id];
                        }
                        onChange(newSelected);
                      }}
                    >
                      <Image source={item.avatar} style={styles.avatar} />
                      <Text style={styles.optionText}>{item.name}</Text>
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color={colors.chamaGreen}
                          style={{ marginLeft: "auto" }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </BlurView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default MemberSelector;

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
    marginTop: 4,
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
    paddingHorizontal: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
    fontFamily: "JakartaRegular",
    color: "#222",
    marginLeft: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.chamaGray,
  },
});
