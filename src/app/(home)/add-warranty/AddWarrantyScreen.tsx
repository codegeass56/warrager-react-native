import AddWarrantyForm from "@/components/AddWarrantyScreen/AddWarrantyForm";
import { Platform, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

function AddWarrantyScreen() {
  const theme = useTheme();
  return (
    <ScrollView
      style={[
        styles.addWarrantyScreenContainer,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
      contentContainerStyle={{ padding: 20 }}
      automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
    >
      <AddWarrantyForm />
    </ScrollView>
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
