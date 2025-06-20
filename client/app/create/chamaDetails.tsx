import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import FormTitleWithToolTip from "../components/FormTitleWithToolTip";
import colors from "@/constants/Colors";
import LocationSelector from "../components/LocationSelector";
import StepFormIndicator from "../components/StepFormIndicator";
const { width } = Dimensions.get("window");
import { createChamaSchema } from "./schema";
import { z } from "zod";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import useCreateStore from "./store";

const createChamaDetailsSchema = createChamaSchema.pick({
  name: true,
  description: true,
  location: true,
  profileImage: true,
  chamaId: true,
});

type CreateChamaDetailsSchema = z.infer<typeof createChamaDetailsSchema>;

const ChamaDetails = () => {
  const form = useForm<CreateChamaDetailsSchema>({
    resolver: zodResolver(createChamaDetailsSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "Nairobi",
      profileImage: "",
      chamaId: "",
    },
  });
  const [error, setError] = useState<string | null>(null);
  const setData = useCreateStore((state) => state.setData);

  const onsubmit = async (data: CreateChamaDetailsSchema) => {
    console.log(data);
    setData(data);
    router.push("/create/membershipDetails");
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        `Sorry, we need camera 
             roll permission to upload images.`
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync();

      if (!result.canceled) {
        form.setValue("profileImage", result.assets[0].uri);
        setError(null);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/create")}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Chama Details</Text>
        </View>
        <StepFormIndicator step={1} />
        <KeyboardAvoidingView
          style={styles.formContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.formItemContainer}>
            <FormTitleWithToolTip
              title="Profile Image"
              subtitle="The profile image associated with you chama"
              tooltipText="A profile image helps other members easily identify you chama. Choose a picture you took together or any other image that is familiar to you and your chama members."
            />
            <View style={styles.profileImageContainer}>
              {form.watch("profileImage") ? (
                <Image
                  source={{ uri: form.watch("profileImage") }}
                  style={styles.profileImage}
                  contentFit="cover"
                />
              ) : (
                <TouchableOpacity onPress={pickImage}>
                  <Ionicons name="image-outline" size={44} color="black" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.formItemContainer}>
            <FormTitleWithToolTip
              title="Chama Name"
              subtitle="The name of your chama"
              tooltipText="The name of your chama will be used to identify your chama in the app. Other members will also use this name to search it when trying to join the chama."
            />
            <TextInput
              placeholder="Enter your chama name"
              value={form.watch("name")}
              onChangeText={(text) => form.setValue("name", text)}
              style={styles.inputField}
            />
          </View>
          <View style={styles.formItemContainer}>
            <FormTitleWithToolTip
              title="Description"
              subtitle="What is your chama about?"
              tooltipText="Briefly describe your chama and its purpose. This will help other members understand your chama better. Additionally, this will be used to uniquely categorize your chama in the app."
            />
            <TextInput
              placeholder="Enter your chama description"
              value={form.watch("description")}
              onChangeText={(text) => form.setValue("description", text)}
              style={[styles.inputField, styles.descriptionInputField]}
              multiline={true}
              numberOfLines={4}
            />
          </View>
          <View style={styles.formItemContainer}>
            <FormTitleWithToolTip
              title="Location"
              subtitle="Where is your chama located?"
              tooltipText="Where are most of your chama members located? Which town or city are you closest to? This will help us when organizing events and meetings."
            />
            <LocationSelector
              value={form.watch("location")}
              onChange={(value) => form.setValue("location", value)}
            />
          </View>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={form.handleSubmit(onsubmit)}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChamaDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    justifyContent: "space-between",
    paddingHorizontal: 16,
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
    marginVertical: 16,
  },
  profileImageContainer: {
    borderRadius: width,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.chamaBlack,
    padding: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: width * 0.3,
    height: width * 0.3,
    marginTop: 16,
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
  descriptionInputField: {
    height: 100,
    textAlignVertical: "top",
    paddingVertical: 14,
  },
  nextButton: {
    backgroundColor: colors.chamaBlack,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "JakartSemiBold",
  },
  profileImage: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width,
  },
});
