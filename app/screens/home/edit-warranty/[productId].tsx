import EditWarrantyForm from "@/components/EditWarrantyScreen/EditWarrantyForm";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Platform, StyleSheet, ScrollView } from "react-native";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import LoadingScreen from "../../LoadingScreen";

function EditWarrantyScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  return <EditWarrantyForm productId={productId!} />;
}

export default EditWarrantyScreen;
