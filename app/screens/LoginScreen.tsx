import LoginForm from "@/components/LoginScreen/LoginForm";
import LoginHeader from "@/components/LoginScreen/LoginHeader";
import { StyleSheet, View } from "react-native";
import { MD3LightTheme, PaperProvider, useTheme } from "react-native-paper";

type Props = {
  onRegister: React.Dispatch<React.SetStateAction<boolean>>;
};

function LoginScreen({ onRegister }: Props) {
  return (
    <PaperProvider>
      <View style={styles.loginScreenContainer}>
        <LoginHeader />
        <LoginForm onRegister={onRegister} />
        <View style={styles.formGap} />
      </View>
    </PaperProvider>
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
