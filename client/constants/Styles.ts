import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ke = require("../assets/images/ke.png");
const ng = require("../assets/images/ng.png");
const tz = require("../assets/images/tz.png");
const sa = require("../assets/images/sa.png");
const rw = require("../assets/images/rw.png");

const myChama = require("../assets/images/mychama.svg");
const myLoans = require("../assets/images/loan.svg");
const myContributions = require("../assets/images/pay.svg");
const joinChama = require("../assets/images/join.svg");
const createChama = require("../assets/images/create.svg");
const meeting = require("../assets/images/meeting.svg");
const settings = require("../assets/images/settings.svg");

const usdc = require("../assets/images/usdc.svg");
const eth = require("../assets/images/eth-logo.svg");
const transactions = require("../assets/images/transactions.png");
const user = require("../assets/images/badge.png");
const streak = require("../assets/images/streak.png");
const health = require("../assets/images/health.png");

const blockbusters = require("../assets/images/blockbusters.jpg");
const wandaes = require("../assets/images/wandaes.jpg");
const chamadao = require("../assets/images/Subtract.png");

interface AccountSettingProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const defaultStyles = StyleSheet.create({
  btn: {
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  pageContainer: {
    flex: 1,
    backgroundColor: Colors.textprimary,
  },
});

export const countryFlags = {
  ke,
  ng,
  tz,
  sa,
  rw,
};

export const quickActions = [
  {
    name: "My Circle",
    icon: myChama,
    route: "/mychama",
  },
  {
    name: "My Loans",
    icon: myLoans,
    route: "/myloans",
  },
  {
    name: "Contribute",
    icon: myContributions,
    route: "chama/contributions",
  },
  {
    name: "Settings",
    icon: settings,
    route: "/settings",
  },
];

export const trendingChamas = [
  {
    name: "Blockbusters",
    icon: blockbusters,
    members: 21,
    contributionAmount: 1000,
    contributionPeriod: "Monthly",
  },
  {
    name: "Wandaes",
    icon: wandaes,
    members: 21,
    contributionAmount: 420,
    contributionPeriod: "Monthly",
  },
  {
    name: "The Chamadao",
    icon: chamadao,
    members: 420,
    contributionAmount: 1000,
    contributionPeriod: "Annual",
  },
];

export const notifications = [
  {
    id: "1",
    title: "Welcome to Circles",
    message: "You are now a member of the Circles community.",
    read: false,
    createdAt: new Date().toDateString(),
    icon: require("../assets/images/Subtract.png"),
  },
];

export const chamaActions = [
  {
    title: "Contributions",
    route: "chama/proposals",
    icon: myContributions,
    description: "View contribution history of the chama.",
  },
  {
    title: "Circle Loans",
    route: "chama/loans",
    icon: myLoans,
    description: "An overview of the chama's loan details.",
  },
  {
    title: "View Members",
    route: "chama/members",
    icon: joinChama,
    description: "View all members of the chama",
  },
  {
    title: "Meetings",
    route: "chama/meeting",
    icon: meeting,
    description: "View all meetings and their details.",
  },
  {
    title: "Circle Profile",
    route: "chama/profile",
    icon: createChama,
    description: "View the full chama profile",
  },
  {
    title: "Leave Circle",
    route: "chama/leave",
    icon: settings,
    description: "Leave the chama",
  },
];

export const contributionHistory = [];

export const backgroundTokenColors = ["#E6F0F6", "#FCDBE9", "#CBFDD3"];

export const tokens = [
  {
    id: "usdc",
    name: "USDC",
    price: 129,
    amount: 4.12,
    logo: usdc,
  },
  // {
  //   id: "ksh",
  //   name: "KSHC",
  //   price: 1,
  //   amount: 40.02,
  //   logo: kshc,
  // },
  {
    id: "eth",
    name: "ETH",
    price: 238456.98,
    amount: 0.012,
    logo: eth,
  },
];

export const profileActions = [
  {
    name: "Transactions",
    description: "In the top 1% of transactors on ChamaDAO",
    data: "KES 1K",
    icon: transactions,
  },
  {
    name: "Founder",
    description: "One of our oldest members",
    data: "2 Months",
    icon: user,
  },
  {
    name: "Streak",
    description: "On a 5 consecutive rounds streak. Keep it up!",
    data: "5/5",
    icon: streak,
  },
  {
    name: "Health",
    description: "Reputation is in good health. Keep it up!",
    data: "100%",
    icon: health,
  },
];

export const accountSettings: AccountSettingProps[] = [
  {
    title: "Email",
    icon: "mail-outline",
  },
  {
    title: "Currency",
    icon: "logo-bitcoin",
  },
  {
    title: "Language",
    icon: "language-outline",
  },
  {
    title: "ID Number",
    icon: "id-card-outline",
  },
  {
    title: "Phone Number",
    icon: "call-outline",
  },
];

export const tokenAddresses = {
  usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
};

export const onboardingSteps = [
  {
    title: "Create / Join a Circle",
    description: "Create a circle to start saving and borrowing.",
    icon: createChama,
  },
  {
    title: "Make a Contribution",
    description: "Make a contribution to the circle.",
    icon: myContributions,
  },
  {
    title: "Request a Loan",
    description: "Request a loan from the circle.",
    icon: myLoans,
  },
];
