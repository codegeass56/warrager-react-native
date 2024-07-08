import { Platform, ScrollView, StyleSheet, View } from "react-native";
import RegistrationForm from "../../components/RegisterScreen/RegistrationForm";
import RegistrationHeader from "../../components/RegisterScreen/RegistrationHeader";
import { MD3LightTheme, PaperProvider } from "react-native-paper";

type Props = {
  onLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

function RegisterScreen({ onLogin }: Props) {
  return (
    <PaperProvider>
      <View style={styles.registerScreenContainer}>
        <RegistrationHeader />

        <ScrollView
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        >
          <RegistrationForm onLogin={onLogin} />
        </ScrollView>
        <View style={styles.formGap} />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  registerScreenContainer: {
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
  registrationFormContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
});

export default RegisterScreen;
