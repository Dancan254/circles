import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Home from ".";
import Profile from "./profile";
import Proposals from "./wallet";
import Loans from "./loans";
import { BlurView } from "expo-blur";
import { StyleSheet, Text } from "react-native";
import colors from "@/constants/Colors";
import Wallet from "./wallet";

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarBackground: () => (
          <BlurView
            intensity={100}
            tint="light"
            style={{
              flex: 1,
              borderRadius: 24,
              overflow: "hidden",
            }}
          />
        ),
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 28,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: 24,
          backgroundColor: "transparent",
          marginHorizontal: 16,
          borderColor: colors.accent,
          overflow: "hidden",
          height: 64,
        },
        tabBarShowLabel: true,
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "600",
          marginTop: 4,
          fontFamily: "JakartSemiBold",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name="home" color={color} size={32} />
          ),
        }}
      />

      <Tab.Screen
        name="Wallet"
        component={Wallet}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name="wallet" color={color} size={32} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name="person" color={color} size={32} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
