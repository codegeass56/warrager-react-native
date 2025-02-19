import EditWarrantyForm from "@/components/EditWarrantyScreen/EditWarrantyForm";
import { useLocalSearchParams } from "expo-router";
import React from "react";

function EditWarrantyScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  return <EditWarrantyForm productId={productId!} />;
}

export default EditWarrantyScreen;
