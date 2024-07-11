import { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Platform, StyleSheet, useColorScheme, View } from "react-native";
import { Text, ActivityIndicator, TextInputProps } from "react-native-paper";
import { FirebaseError } from "firebase/app";
import EmailField from "../FormComponents/EmailField";
import PasswordField from "../FormComponents/PasswordField";
import FormButton from "../FormComponents/FormButton";
import SectionTitle from "../SectionTitle";

type Props = {
  onLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

function RegistrationForm({ onLogin }: Props) {
  const [signUpError, setSignUpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function OnRegister(data: FormData) {
    try {
      setSignUpError("");
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      onLogin(false);
    } catch (e) {
      if (e instanceof FirebaseError) {
        let errorCode = e.code;
        let errorMessage = e.message;
        if (errorCode === "auth/email-already-in-use") {
          setSignUpError("The email address is already in use");
        } else if (errorCode === "auth/weak-password") {
          setSignUpError("The password is not strong enough");
        } else if (errorCode === "auth/invalid-email") {
          setSignUpError("The email address is invalid");
        } else if (errorCode === "auth/operation-not-allowed") {
          setSignUpError("Email/password accounts are not enabled");
        } else {
          setSignUpError(errorMessage);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  const signUpDisabled = !isValid;

  return (
    <View style={styles.fieldContainer}>
      <SectionTitle text="Create your account" style={styles.formTitle} />
      <EmailField
        control={control}
        componentName="email"
        validation={{
          errors,
          rules: {
            required: "Please enter your email",
          },
        }}
        mode="outlined"
        label="Email"
        placeholderText="user@example.com"
        autoFocus
      />
      <PasswordField
        control={control}
        componentName="password"
        validation={{
          errors,
          rules: {
            required: "Please create your password",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          },
        }}
        mode="outlined"
        label="Create Password"
        placeholderText="Must be at least 8 characters"
      />
      <PasswordField
        componentName="confirmPassword"
        control={control}
        validation={{
          errors,
          rules: {
            required: "Please confirm your password",
            validate: (value: TextInputProps["value"]) =>
              getValues("password") === value || "Passwords do not match",
          },
        }}
        mode="outlined"
        label="Confirm Password"
        placeholderText="Retype your password"
      />
      <FormButton
        mode="contained"
        onPress={handleSubmit(OnRegister)}
        text="Sign Up"
        disabled={signUpDisabled}
      />
      {isLoading && (
        <ActivityIndicator
          animating={true}
          color={colorScheme === "dark" ? "#a9a5e2" : "#1F41BB"}
        />
      )}
      {signUpError !== "" && (
        <View style={styles.failedMessageContainer}>
          <Text style={styles.failedMessage}>{signUpError}</Text>
        </View>
      )}
      <View style={styles.loginLinkContainer}>
        <Text>Already have an account?</Text>
        <FormButton text="Login" mode="text" onPress={() => onLogin(false)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    gap: 20,
  },
  failedMessageContainer: {
    alignItems: "center",
  },
  failedMessage: {
    color: "red",
    fontWeight: "bold",
    fontSize: 15,
  },
  loginLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  formTitle: {
    color: "#1F41BB",
    fontSize: 20,
    fontWeight: Platform.OS === "ios" ? "500" : "bold",
  },
});

export default RegistrationForm;
