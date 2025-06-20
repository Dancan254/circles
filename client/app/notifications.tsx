import { StyleSheet, FlatList, View } from "react-native";
import React from "react";
import Search from "./components/Search";
import { notifications } from "@/constants/Styles";
import Notification from "./components/Notification";
const Notifications = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Notification {...item} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Search placeholder="Search Notifications" />}
      />
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f7f9",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  notificationContainer: {
    paddingHorizontal: 20,
  },
});
