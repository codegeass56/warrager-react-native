import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Keyboard, Platform, StyleSheet, View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import ErrorMessage from "../ErrorMessage";
import EmailField from "../FormComponents/EmailField";
import FormButton from "../FormComponents/FormButton";
import PasswordField from "../FormComponents/PasswordField";
import SectionTitle from "../SectionTitle";

type FormData = {
  email: string;
  password: string;
};

const EMAIL_FIELD_NAME = "email";
const PASSWORD_FIELD_NAME = "password";

function LoginForm() {
  const router = useRouter();
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      [EMAIL_FIELD_NAME]: "",
      [PASSWORD_FIELD_NAME]: "",
    },
  });

  const onLogin = async (data: FormData) => {
    Keyboard.dismiss();
    try {
      setLoginError("");
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (e) {
      if (e instanceof FirebaseError) {
        let errorCode = e.code;
        let errorMessage = e.message;
        if (errorCode === "auth/user-disabled") {
          setLoginError("This account has been deactivated.");
        } else if (errorCode === "auth/wrong-password") {
          setLoginError("Incorrect password");
        } else if (errorCode === "auth/invalid-email") {
          setLoginError("Invalid email");
        } else if (errorCode === "auth/user-not-found") {
          setLoginError("User not found. Did you sign up?");
        } else if (errorCode === "auth/invalid-credential") {
          setLoginError("Incorrect user name or password");
        } else {
          setLoginError(errorMessage);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.fieldContainer}>
      <SectionTitle
        text="Login to your account"
        style={[styles.formTitle, { color: theme.colors.onSurfaceVariant }]}
      />
      <EmailField
        control={control}
        componentName={EMAIL_FIELD_NAME}
        validation={{
          errors,
          rules: {
            required: "Please enter your email",
          },
        }}
        mode="outlined"
        label="Email"
        placeholderText="Enter your email"
        autoFocus={true}
      />
      <PasswordField
        componentName={PASSWORD_FIELD_NAME}
        control={control}
        validation={{
          errors,
          rules: {
            required: "Please enter your password",
          },
        }}
        mode="outlined"
        label="Enter Password"
        placeholderText="Enter your password"
      />
      <FormButton
        text="Login"
        mode="contained"
        onPress={handleSubmit(onLogin)}
      />
      {isLoading ? (
        <ActivityIndicator animating={true} color={theme.colors.onSurface} />
      ) : null}

      {loginError !== "" ? <ErrorMessage message={loginError} /> : null}

      <View style={styles.registerLinkContainer}>
        <Text>Don't have an account?</Text>
        <FormButton
          text="Sign up"
          mode="text"
          onPress={() => router.navigate("/RegisterScreen")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    gap: 20,
  },
  registerLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  formTitle: {
    fontSize: 20,
    fontWeight: Platform.OS === "ios" ? "500" : "bold",
  },
});

export default LoginForm;
