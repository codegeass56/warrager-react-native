import LoginForm from "@/components/LoginScreen/LoginForm";
import LoginHeader from "@/components/LoginScreen/LoginHeader";
import { StyleSheet, View } from "react-native";

function LoginScreen() {
  return (
    <View style={styles.loginScreenContainer}>
      <LoginHeader />
      <LoginForm />
      <View style={styles.formGap} />
    </View>
  );
}

const styles = StyleSheet.create({
  loginScreenContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    padding: 20,
    gap: 50,
    paddingTop: 150,
  },
  formGap: {
    height: 30,
  },
});

export default LoginScreen;
