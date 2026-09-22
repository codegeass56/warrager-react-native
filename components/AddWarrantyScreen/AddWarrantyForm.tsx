import {
  BRAND_FIELD_NAME,
  CURRENCY_FIELD_NAME,
  DATE_FIELD_NAME,
  PRODUCT_NAME_FIELD_NAME,
  PRODUCT_PRICE_FIELD_NAME,
  STORE_CONTACT_FIELD_NAME,
  STORE_EMAIL_FIELD_NAME,
  STORE_NAME_FIELD_NAME,
  WARRANTY_DURATION_TYPE_FIELD_NAME,
  WARRANTY_PERIOD_FIELD_NAME,
  type FormData,
} from "@/constants/formFields";
import { useSaveWarranty } from "@/hooks/useSaveWarranty";
import { useWarrantyImage } from "@/hooks/useWarrantyImage";
import { Image } from "expo-image";
import { useForm } from "react-hook-form";
import { Platform, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import DatePicker from "../FormComponents/DatePicker";
import EmailField from "../FormComponents/EmailField";
import FormButton from "../FormComponents/FormButton";
import TextField from "../FormComponents/TextField";
import SectionTitle from "../SectionTitle";
import ProductPriceInput from "./ProductPriceInput";
import StoreContactInput from "./StoreContactInput";
import WarrantyPeriodInput from "./WarrantyPeriodInput";

function AddWarrantyForm() {
  const { imageUri, openCamera, removeImage } =
    useWarrantyImage("AddWarrantyScreen");
  const { isLoading, saveWarranty } = useSaveWarranty();
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      [PRODUCT_NAME_FIELD_NAME]: "",
      [DATE_FIELD_NAME]: new Date(),
      [CURRENCY_FIELD_NAME]: "USD",
      [PRODUCT_PRICE_FIELD_NAME]: "0",
      [WARRANTY_PERIOD_FIELD_NAME]: "",
      [WARRANTY_DURATION_TYPE_FIELD_NAME]: "Years",
      [BRAND_FIELD_NAME]: "",
      [STORE_NAME_FIELD_NAME]: "",
      [STORE_EMAIL_FIELD_NAME]: "",
      [STORE_CONTACT_FIELD_NAME]: "",
    },
  });

  const onAddWarranty = (data: FormData) => saveWarranty(data, imageUri);

  return (
    <View style={styles.fieldContainer}>
      <SectionTitle
        text="Product Details"
        style={[
          styles.productDetailsTitle,
          { color: theme.colors.onSurfaceVariant },
        ]}
      />

      <TextField
        control={control}
        componentName={PRODUCT_NAME_FIELD_NAME}
        mode="outlined"
        placeholderText="Name of your product"
        label="Product Name"
        validation={{
          errors,
          rules: {
            required: "Please enter the name of your product",
          },
        }}
        autoCapitalize={"words"}
      />
      <View style={styles.dateOfPurchaseContainer}>
        <Text style={styles.dateOfPurchaseText}>Date of purchase:</Text>
        <DatePicker control={control} componentName={DATE_FIELD_NAME} />
      </View>
      <ProductPriceInput
        control={control}
        validation={{
          errors,
        }}
        dropdownCompName={CURRENCY_FIELD_NAME}
        priceFieldCompName={PRODUCT_PRICE_FIELD_NAME}
      />
      <TextField
        componentName={BRAND_FIELD_NAME}
        mode="outlined"
        label="Brand"
        control={control}
        placeholderText="Apple"
        validation={{
          errors,
          rules: {
            required: "Please enter the brand of your product",
          },
        }}
        autoCapitalize={"words"}
      />
      <WarrantyPeriodInput
        control={control}
        errors={errors}
        durationDropdownCompName={WARRANTY_DURATION_TYPE_FIELD_NAME}
        warrantyPeriodFieldCompName={WARRANTY_PERIOD_FIELD_NAME}
      />
      <View style={styles.imagePreviewContainer}>
        <Text style={styles.attachPictureText}>Attach picture of receipt:</Text>
        {!imageUri ? (
          <FormButton
            text={"Take Picture"}
            mode="contained"
            style={styles.selectPictureBtn}
            onPress={openCamera}
          />
        ) : null}
      </View>
      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{ uri: imageUri }}
            contentFit="contain"
          />

          <View style={styles.imagePreviewBtnContainer}>
            <FormButton
              text={"Change Picture"}
              mode="contained"
              style={styles.selectPictureBtn}
              onPress={openCamera}
            />
            <FormButton
              text={"Remove Picture"}
              mode="contained"
              style={styles.selectPictureBtn}
              onPress={removeImage}
            />
          </View>
        </View>
      ) : null}

      <SectionTitle
        text="Store Details"
        style={[
          styles.storeDetailsTitle,
          { color: theme.colors.onSurfaceVariant },
        ]}
      />
      <TextField
        control={control}
        componentName={STORE_NAME_FIELD_NAME}
        mode="outlined"
        label="Name"
        placeholderText="Apple Store"
      />
      <EmailField
        control={control}
        componentName={STORE_EMAIL_FIELD_NAME}
        mode="outlined"
        label="Email"
        placeholderText="support@apple.com"
        validation={{
          errors,
        }}
      />
      <StoreContactInput
        control={control}
        contactFieldCompName={STORE_CONTACT_FIELD_NAME}
        mode="outlined"
        label="Contact Number"
        validation={{
          errors,
        }}
      />
      <FormButton
        isLoading={isLoading}
        onPress={handleSubmit(onAddWarranty)}
        mode="contained"
        text={isLoading ? "Adding Warranty" : "Add Warranty"}
        style={styles.addWarrantyBtn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    gap: 20,
    paddingBottom: 50,
  },
  productDetailsTitle: {
    fontSize: 20,
    fontWeight: Platform.OS === "ios" ? "500" : "bold",
    alignSelf: "center",
  },
  storeDetailsTitle: {
    fontSize: 20,
    alignSelf: "center",
    marginTop: 30,
    fontWeight: Platform.OS === "ios" ? "500" : "bold",
  },
  dateOfPurchaseContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateOfPurchaseText: {
    fontSize: 18,
    marginRight: 10,
    fontWeight: Platform.OS === "ios" ? "500" : "bold",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  attachPictureText: {
    fontSize: 17,
    marginRight: 10,
    fontWeight: Platform.OS === "ios" ? "500" : "bold",
  },
  selectPictureBtn: {
    borderRadius: 10,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    flexDirection: "row",
  },
  image: {
    flex: 1,
  },
  imagePreviewBtnContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  addWarrantyBtn: {
    marginTop: 20,
  },
});

export default AddWarrantyForm;
