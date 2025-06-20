import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { ThirdwebProvider } from "thirdweb/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    JakartSemiBold: require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    JakartaRegular: require("../assets/fonts/PlusJakartaSans-VariableFont_wght.ttf"),
    JakartaLight: require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    MontserratAlternates: require("../assets/fonts/MontserratAlternates-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <StatusBar style="dark" />
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="login"
              options={{
                title: "",
                headerLeft: () => (
                  <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons
                      name="arrow-back-outline"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                ),
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="onboard"
              options={{
                title: "",
                // headerLeft: () => (
                //   <TouchableOpacity onPress={() => router.back()}>
                //     <Ionicons name="arrow-back-outline" size={24} color="black" />
                //   </TouchableOpacity>
                // ),
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="register"
              options={{
                title: "Register",
                // headerLeft: () => (
                //   <TouchableOpacity onPress={() => router.back()}>
                //     <Ionicons name="arrow-back-outline" size={24} color="black" />
                //   </TouchableOpacity>
                // ),
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="createCoinbaseWallet"
              options={{
                title: "Create Wallet",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="otp"
              options={{
                title: "OTP",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{
                title: "Dashboard",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="notifications"
              options={{
                title: "Notifications",
                headerLeft: () => (
                  <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={24} color="black" />
                  </TouchableOpacity>
                ),
                headerStyle: {
                  backgroundColor: "#f0f7f9",
                },
                headerTitle: "Notifications",
                headerTitleStyle: {
                  fontFamily: "MontserratAlternates",
                  fontSize: 16,
                },
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="mychama"
              options={{
                title: "My Chama",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="chama/contributions"
              options={{
                title: "Pay Contribution",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="create/index"
              options={{
                title: "Create a Chama",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="create/chamaDetails"
              options={{
                title: "Chama Details",
                headerShown: false,
                animation: "none",
              }}
            />
            <Stack.Screen
              name="create/membershipDetails"
              options={{
                title: "Membership Details",
                headerShown: false,
                animation: "none",
              }}
            />
            <Stack.Screen
              name="create/contributions"
              options={{
                title: "Contributions Details",
                headerShown: false,
                animation: "none",
              }}
            />
            <Stack.Screen
              name="create/loans"
              options={{
                title: "Loans Details",
                headerShown: false,
                animation: "none",
              }}
            />
            <Stack.Screen
              name="create/overview"
              options={{
                title: "Overview",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="chama/[id]"
              options={{
                title: "Chama",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="chama/loans"
              options={{
                title: "Loans",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="chama/join"
              options={{
                title: "Join Chama",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="chama/members"
              options={{
                title: "Members",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="join/[id]"
              options={{
                title: "Join a Chama",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="loans/[id]"
              options={{
                title: "Loan Overview",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="loans/apply"
              options={{
                title: "Apply Loan",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="loans/overview"
              options={{
                title: "Loan Overview",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="guarantee/[id]"
              options={{
                title: "Guarantee",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="guarantee/overview"
              options={{
                title: "Guarantee Overview",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="settings"
              options={{
                title: "Settings",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="myloans"
              options={{
                title: "My Loans",
                headerShown: false,
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}
