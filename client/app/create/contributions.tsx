import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  Dimensions,
} from "react-native";
import React from "react";
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
import { createChamaSchema } from "./schema";

const { width } = Dimensions.get("window");

const contributionDetailsSchema = createChamaSchema.pick({
  contributionAmount: true,
  contributionPeriod: true,
  contributionPenalty: true,
});
type ContributionDetailsSchema = z.infer<typeof contributionDetailsSchema>;

const ContributionDetails = () => {
  const form = useForm<ContributionDetailsSchema>({
    resolver: zodResolver(contributionDetailsSchema),
    defaultValues: {
      contributionAmount: 0,
      contributionPeriod: "weekly",
      contributionPenalty: 0,
    },
  });
  const setData = useCreateStore((state) => state.setData);

  const onsubmit = async (data: ContributionDetailsSchema) => {
    setData(data);
    router.push("/create/loans");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="calendar-number-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Contributions Details</Text>
        </View>
        <StepFormIndicator step={3} />
        <KeyboardAvoidingView
          style={styles.formContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.formItemContainer}>
            <FormTitleWithToolTip
              title="Contribution Amount"
              subtitle="How much is the contribution amount?"
              tooltipText="This is the amount in KES that members will contribute during each contribution cycle choose below. It's advisable to set an amount that you and your chama already use or one you have agreed on."
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
                placeholder="Enter the contribution amount"
                value={form.watch("contributionAmount").toString()}
                onChangeText={(text) =>
                  form.setValue("contributionAmount", Number(text))
                }
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={styles.formItemContainer}>
            <FormTitleWithToolTip
              title="Contribution Period"
              subtitle="How often will members contribute?"
              tooltipText="This is the period in which members will have to pay their contribution amount entered above. Choose below the period that you and your chama have agreed on."
            />
            <PeriodSelector
              value={form.watch("contributionPeriod")}
              onChange={(value) =>
                form.setValue("contributionPeriod", value as any)
              }
            />
            <View style={styles.formItemContainer}>
              <FormTitleWithToolTip
                title="Contribution Penalty"
                subtitle="How much is the penalty for every late contribution?"
                tooltipText="This is the extra amount the member will have to pay for every late contribution. This is to ensure that members are disciplined and contribute on time."
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
                  placeholder="Enter the contribution penalty amount"
                  value={form.watch("contributionPenalty").toString()}
                  onChangeText={(text) =>
                    form.setValue("contributionPenalty", Number(text))
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
          <View style={styles.formBtnContainer}>
            <TouchableOpacity
              style={styles.previousButton}
              onPress={() => router.push("/create/membershipDetails")}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
              <Text style={styles.previousButtonText}>Membership Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={form.handleSubmit(onsubmit)}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContributionDetails;

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
