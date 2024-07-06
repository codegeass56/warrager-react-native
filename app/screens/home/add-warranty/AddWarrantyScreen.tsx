import AddWarrantyForm from "@/components/AddWarrantyScreen/AddWarrantyForm";
import { Platform, ScrollView, StyleSheet, useColorScheme } from "react-native";
import { PaperProvider, useTheme } from "react-native-paper";

function AddWarrantyScreen() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  return (
    <PaperProvider>
      <ScrollView
        style={[
          styles.addWarrantyScreenContainer,
          {
            backgroundColor:
              colorScheme === "dark"
                ? theme.colors.onSurface
                : theme.colors.surface,
          },
        ]}
        contentContainerStyle={{ padding: 20 }}
        automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
      >
        <AddWarrantyForm />
      </ScrollView>
    </PaperProvider>
  );
}
const styles = StyleSheet.create({
  addWarrantyScreenContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
});

export default AddWarrantyScreen;
