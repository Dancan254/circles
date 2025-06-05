import {
  KeyboardAvoidingView,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import StepFormIndicator from "../components/StepFormIndicator";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import FormTitleWithToolTip from "../components/FormTitleWithToolTip";
import colors from "@/constants/Colors";
import PeriodSelector from "../components/PeriodSelector";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useCreateStore from "./store";
import { CreateChamaSchema, createChamaSchema } from "./schema";
import contract from "@/utils/client";
import { useActiveAccount } from "thirdweb/react";
const { width } = Dimensions.get("window");
import { prepareContractCall, prepareEvent } from "thirdweb";
import { useSendTransaction, useContractEvents } from "thirdweb/react";
import { useCreateChama } from "@/hooks/useCreateChama";
import { setDefaults } from "@/utils/format";
import { UserData } from "../(tabs)";
import { useGetUser } from "@/hooks/useUser";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ChamaCreatedEvent {
  address: string;
  args: {
    admin: string;
    contributions: string;
    [key: string]: any;
  };
  blockHash: string;
  blockNumber: number | string | bigint;
  blockTimestamp: number;
  chainId: string;
  data: string;
  eventName: string;
  logIndex: number;
  topics: string[];
  transactionHash: string;
  transactionIndex: number;
}
export interface TransactionResult {
  chain: {
    id: number;
    rpc: string;
  };
  client: {
    clientId: string;
    secretKey: string;
  };
  transactionHash: string;
}

const loansDetailsSchema = createChamaSchema.pick({
  maximumLoanAmount: true,
  loanInterestRate: true,
  loanTerm: true,
  loanPenalty: true,
});
type LoansDetailsSchema = z.infer<typeof loansDetailsSchema>;

const preparedEvent = prepareEvent({
  signature: "event chamaCreated(address indexed admin, address contributions)",
});

const Loans = () => {
  const { mutateAsync: sendTransaction } = useSendTransaction();

  const { data: event } = useContractEvents({
    contract,
    events: [preparedEvent],
  });

  const {
    createChamaMutation,
    loading: creatingChama,
    error,
  } = useCreateChama();

  const createChama = async (
    _admin: string,
    _name: string,
    _interestRate: bigint
  ) => {
    const transaction = await prepareContractCall({
      contract,
      method:
        "function createChama(address _admin, string _name, uint256 _interestRate) returns (address)",
      params: [_admin, _name, _interestRate],
    });
    console.warn(transaction);
    return sendTransaction(transaction, {
      onSuccess: (result) => {
        // Parse result here for the address
        console.log("Transaction result:", result);
      },
      onError: () => console.error("Transaction error"),
    });
  };
  const name = useCreateStore((state) => state.name);
  const description = useCreateStore((state) => state.description);
  const location = useCreateStore((state) => state.location);
  const profileImage = useCreateStore((state) => state.profileImage);
  const maximumMembers = useCreateStore((state) => state.maximumMembers);
  const [loading, setLoading] = useState(false);
  const activeAccount = useActiveAccount();
  const { data: userData } = useGetUser(activeAccount!.address) as {
    data: UserData;
  };

  const updateUserOnboardingStep = async () => {
    try {
      const userStep = await AsyncStorage.getItem("userStep");
      if (userStep) {
        await AsyncStorage.setItem(
          "userStep",
          (parseInt(userStep) + 1).toString()
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  const saveChamaDetails = async (chamaName: string, chamaAddress: string) => {
    try {
      await AsyncStorage.setItem("chamaName", chamaName);
      await AsyncStorage.setItem("chamaAddress", chamaAddress);
    } catch (error) {
      console.error(error);
    }
  };

  const registrationFeeRequired = useCreateStore(
    (state) => state.registrationFeeRequired
  );
  const registrationFeeAmount = useCreateStore(
    (state) => state.registrationFeeAmount
  );
  const registrationFeeCurrency = useCreateStore(
    (state) => state.registrationFeeCurrency
  );
  const contributionAmount = useCreateStore(
    (state) => state.contributionAmount
  );
  const contributionPeriod = useCreateStore(
    (state) => state.contributionPeriod
  );
  const contributionPenalty = useCreateStore(
    (state) => state.contributionPenalty
  );

  const form = useForm<LoansDetailsSchema>({
    resolver: zodResolver(loansDetailsSchema),
    defaultValues: {
      maximumLoanAmount: 0,
      loanInterestRate: 0,
      loanTerm: "",
      loanPenalty: 0,
    },
  });

  const onsubmit = async (data: LoansDetailsSchema) => {
    setLoading(true);
    try {
      if (!activeAccount || !name || !data.loanInterestRate) {
        console.log("Missing required fields");
        return;
      }

      const result = await createChama(
        activeAccount.address,
        name,
        BigInt(data.loanInterestRate)
      );
      console.log("Transaction result:", result);
      const chamaAddress = event?.[0]?.args?.contributions;
      console.log(event?.[0]);
      // const chamaAddress =
      //   "0xa5cc7f7c9c40a5dbf7893a7cec19bc595fb7900b5950e82cd298d8f466d4afe4";
      console.log("chamaAddress", chamaAddress);

      if (
        !chamaAddress ||
        !name ||
        !description ||
        !location ||
        !profileImage ||
        !maximumMembers ||
        !registrationFeeRequired ||
        !registrationFeeAmount ||
        !registrationFeeCurrency ||
        !contributionAmount ||
        !contributionPeriod ||
        !contributionPenalty
      ) {
        console.log("Missing required fields");
        return;
      }
      const chamaData = setDefaults({
        chamaAddress,
        name,
        description,
        location,
        profileImage,
        maximumMembers,
        registrationFeeRequired,
        registrationFeeAmount,
        contributionAmount: contributionAmount,
        contributionPeriod: contributionPeriod,
        contributionPenalty: contributionPenalty,
        maximumLoanAmount: data.maximumLoanAmount,
        loanInterestRate: data.loanInterestRate,
        loanTerm: data.loanTerm,
        loanPenalty: data.loanPenalty,
      });
      const updatedCreator = {
        ...userData,
        profileImage: "https://www.svgrepo.com/show/491108/profile.svg",
      };

      const response = await createChamaMutation.mutateAsync({
        chamaData,
        creator: updatedCreator,
      });
      console.log(response);
      await updateUserOnboardingStep();
      await saveChamaDetails(name, chamaAddress);
      setLoading(false);

      router.push("/create/overview");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="cash-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Loans Details</Text>
        </View>
        <StepFormIndicator step={4} />
        <KeyboardAvoidingView
          style={styles.formContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.formItemContainer}>
            <FormTitleWithToolTip
              title="Maximum Loan Amount"
              subtitle="What is the maximum loan amount?"
              tooltipText="This is the maximum amount of money that a member can borrow from the chama. It's advisable to set an amount that you and your chama already use or one you have agreed on."
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: colors.primary,
                borderRadius: 24,
                height: 50,
                width: width * 0.9,
                backgroundColor: "#F0F9F7",
                gap: 10,
                paddingHorizontal: 16,
              }}
            >
              <Text style={{ fontFamily: "JakartaRegular" }}>KES</Text>
              <TextInput
                placeholder="Enter the maximum loan amount"
                value={form.watch("maximumLoanAmount").toString()}
                onChangeText={(text) =>
                  form.setValue("maximumLoanAmount", Number(text))
                }
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={styles.formItemContainer}>
            <FormTitleWithToolTip
              title="Loan Interest"
              subtitle="What is the interest on borrowed amounts?"
              tooltipText="This is a percentage of the loan that a member will to pay together with the loan borrowed. "
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: colors.primary,
                borderRadius: 24,
                height: 50,
                width: width * 0.9,
                backgroundColor: "#F0F9F7",
                gap: 10,
                paddingHorizontal: 16,
              }}
            >
              <Text style={{ fontFamily: "JakartaRegular" }}>%</Text>
              <TextInput
                placeholder="Enter the loan interest"
                value={form.watch("loanInterestRate").toString()}
                onChangeText={(text) =>
                  form.setValue("loanInterestRate", Number(text))
                }
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={styles.formItemContainer}>
            <FormTitleWithToolTip
              title="Maximum Loan Term"
              subtitle="What is the maximum loan period?"
              tooltipText="This is the period of time in which a loan borrowed can be repaid with no penalty. "
            />
            <PeriodSelector
              value={form.watch("loanTerm").toString()}
              onChange={(value) => form.setValue("loanTerm", value as any)}
            />
          </View>
          <View style={styles.formItemContainer}>
            <FormTitleWithToolTip
              title="Loan Penalty"
              subtitle="What is the penalty on a defaulted loan?"
              tooltipText="This is a percentage of the loan that a member will to pay together with the loan borrowed and interest. "
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: colors.primary,
                borderRadius: 24,
                height: 50,
                width: width * 0.9,
                backgroundColor: "#F0F9F7",
                gap: 10,
                paddingHorizontal: 16,
              }}
            >
              <Text style={{ fontFamily: "JakartaRegular" }}>%</Text>
              <TextInput
                placeholder="Enter the loan penalty"
                value={form.watch("loanPenalty").toString()}
                onChangeText={(text) =>
                  form.setValue("loanPenalty", Number(text))
                }
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={styles.formBtnContainer}>
            <TouchableOpacity
              style={styles.previousButton}
              onPress={() => router.push("/create/contributions")}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
              <Text style={styles.previousButtonText}>
                Contributions Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={form.handleSubmit(onsubmit)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Text style={styles.nextButtonText}>Finish</Text>
                  <Ionicons name="arrow-forward" size={24} color="white" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Loans;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
    fontFamily: "MontserratAlternates",
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  formItemContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 10,
    marginVertical: 14,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.primary,
    borderRadius: 24,
    padding: 10,
    backgroundColor: "#F0F9F7",
    fontFamily: "JakartaRegular",
    paddingHorizontal: 16,
    width: width * 0.9,
  },
  nextButton: {
    backgroundColor: colors.chamaBlack,
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
    width: width * 0.4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  previousButton: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "JakartSemiBold",
  },
  previousButtonText: {
    color: colors.chamaBlack,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "JakartSemiBold",
  },
  formBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 24,
  },
});
