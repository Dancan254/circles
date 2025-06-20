import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useRef, useState } from "react";
import colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { chamaActions } from "@/constants/Styles";
import ChamaAction from "./components/ChamaAction";
import { useGetChama } from "@/hooks/useChama";

const screenWidth = Dimensions.get("window").width;

const MyChama = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wandaes</Text>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 4 }}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x /
                e.nativeEvent.layoutMeasurement.width
            );
            setCurrentIndex(index);
          }}
          scrollEventThrottle={16}
          style={{ marginBottom: 10 }}
        >
          <View style={{ width: screenWidth }}>
            <View style={styles.financialContainer}>
              <View style={styles.financialHeader}>
                <Text style={styles.financialTitle}>Total Contributions</Text>
                <Ionicons name="eye" size={24} color="black" />
              </View>
              <Text style={styles.amountText}>KES 10,000</Text>
              <View style={styles.footer}>
                <View style={styles.moreInfo}>
                  <Text style={styles.moreInfoText}>Chama Code: 1234 5678</Text>

                  <Ionicons
                    name="copy-outline"
                    size={14}
                    color="black"
                    style={styles.copyIcon}
                  />
                </View>
                <Text style={styles.pendingText}>Pending Contributions: 4</Text>
              </View>
            </View>
            <View style={styles.balanceContainer}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceTitle}>Balance</Text>
                <Text style={styles.balanceText}>KES 120,000</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.balanceItem}>
                <Text style={styles.balanceTitle}>Address</Text>
                <Text style={styles.balanceText}>
                  0xhdh...
                  <Ionicons name="copy-outline" size={14} color="black" />
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.balanceItem}>
                <Text style={styles.balanceTitle}>Contributions</Text>
                <Text style={styles.balanceText}>KES 1, 000 / Month</Text>
              </View>
            </View>
          </View>
          <View style={{ width: screenWidth }}>
            <View style={styles.financialContainer}>
              <View style={styles.financialHeader}>
                <Text style={styles.financialTitle}>Total Loans</Text>
                <Ionicons name="eye" size={24} color="black" />
              </View>
              <Text style={styles.amountText}>KES 66,000</Text>
              <View style={styles.footer}>
                <View style={styles.moreInfo}>
                  <Text style={styles.moreInfoText}>Chama Code: 1234 5678</Text>

                  <Ionicons
                    name="copy-outline"
                    size={14}
                    color="black"
                    style={styles.copyIcon}
                  />
                </View>
                <Text style={styles.pendingText}>Pending Loans: 4</Text>
              </View>
            </View>
            <View style={styles.balanceContainer}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceTitle}>Interest Rate</Text>
                <Text style={styles.balanceText}>10%</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.balanceItem}>
                <Text style={styles.balanceTitle}>Payment Period</Text>
                <Text style={styles.balanceText}>1 Month</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.balanceItem}>
                <Text style={styles.balanceTitle}>Penalty</Text>
                <Text style={styles.balanceText}>KSH 100</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.indicatorsContainer}>
          {[0, 1].map((_, idx) => (
            <View
              key={idx}
              style={
                idx === currentIndex ? styles.mainIndicator : styles.indicator
              }
            />
          ))}
        </View>
        <View style={styles.chamaActionsContainer}>
          <FlatList
            data={chamaActions}
            renderItem={({ item }) => (
              <ChamaAction
                title={item.title}
                route={item.route}
                icon={item.icon}
                description={item.description}
              />
            )}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 10,
            }}
            scrollEnabled={false}
            keyExtractor={(item) => item.title}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyChama;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f7f9",
  },
  backButton: {
    marginTop: 16,
    marginLeft: 16,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "MontserratAlternates",
  },
  financialContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: colors.chamaBlue,
    paddingVertical: 16,
    marginHorizontal: 10,
    marginTop: 16,
    borderTopRightRadius: 14,
    borderTopLeftRadius: 14,
    height: 160,
  },
  financialTitle: {
    fontSize: 16,
    fontFamily: "JakartSemiBold",
    marginTop: 10,
  },
  amountText: {
    fontSize: 32,
    fontFamily: "JakartSemiBold",
    marginTop: 10,
    fontWeight: "bold",
  },
  financialHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  moreInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  moreInfoText: {
    fontFamily: "JakartaRegular",
    fontSize: 14,
  },
  copyIcon: {
    marginLeft: 4,
  },
  pendingText: {
    fontFamily: "JakartaRegular",
    fontSize: 12,
  },
  balanceContainer: {
    height: 80,
    backgroundColor: "#E1E4E5FF",
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    marginTop: 4,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  balanceTitle: {
    fontFamily: "JakartSemiBold",
    fontSize: 14,
  },
  balanceText: {
    fontFamily: "JakartaRegular",
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: "#f0f7f9",
    height: "100%",
  },
  balanceItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 0,
    marginTop: 10,
  },
  indicator: {
    width: 40,
    height: 10,
    backgroundColor: colors.chamaBlue,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  mainIndicator: {
    width: 60,
    height: 10,
    backgroundColor: colors.chamaBlack,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  chamaActionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 32,
  },
});
