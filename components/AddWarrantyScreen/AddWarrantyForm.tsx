import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Platform, StyleSheet, useColorScheme, View } from "react-native";
import { ActivityIndicator, Button, Icon, Text } from "react-native-paper";
import * as Localization from "expo-localization";
import TextField from "../FormComponents/TextField";
import EmailField from "../FormComponents/EmailField";
import DatePicker from "../FormComponents/DatePicker";
import ProductPriceInput from "./ProductPriceInput";
import WarrantyPeriodInput from "./WarrantyPeriodInput";
import StoreContactInput from "./StoreContactInput";
import CategoryDropdown from "./CategoryDropdown";
import { child, push, ref, set, update } from "firebase/database";
import { auth, database } from "@/firebaseConfig";
import { useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import SectionTitle from "../SectionTitle";

const PRODUCT_NAME_FIELD_NAME = "productName";
const DATE_FIELD_NAME = "dateOfPurchase";
const CURRENCY_FIELD_NAME = "currencyType";
const PRODUCT_PRICE_FIELD_NAME = "productPrice";
const CATEGORY_FIELD_NAME = "productCategory";
const WARRANTY_PERIOD_FIELD_NAME = "warrantyPeriod";
const WARRANTY_DURATION_TYPE_FIELD_NAME = "warrantyDurationType";
const BRAND_FIELD_NAME = "productBrand";
const STORE_NAME_FIELD_NAME = "storeName";
const STORE_LOCATION_FIELD_NAME = "storeLocation";
const STORE_EMAIL_FIELD_NAME = "storeEmail";
const STORE_CONTACT_FIELD_NAME = "storeContact";

type FormData = {
  [PRODUCT_NAME_FIELD_NAME]: string;
  [DATE_FIELD_NAME]: Date;
  [CURRENCY_FIELD_NAME]: string;
  [PRODUCT_PRICE_FIELD_NAME]: string;
  [CATEGORY_FIELD_NAME]: string;
  [WARRANTY_PERIOD_FIELD_NAME]: string;
  [WARRANTY_DURATION_TYPE_FIELD_NAME]: string;
  [BRAND_FIELD_NAME]: string;
  [STORE_NAME_FIELD_NAME]: string;
  [STORE_LOCATION_FIELD_NAME]: string;
  [STORE_EMAIL_FIELD_NAME]: string;
  [STORE_CONTACT_FIELD_NAME]: string;
};

function AddWarrantyForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const currentUser = auth.currentUser;
  const colorScheme = useColorScheme();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      [PRODUCT_NAME_FIELD_NAME]: "",
      [DATE_FIELD_NAME]: new Date(),
      [CURRENCY_FIELD_NAME]: "AED",
      [PRODUCT_PRICE_FIELD_NAME]: "0",
      [CATEGORY_FIELD_NAME]: "Product Category",
      [WARRANTY_PERIOD_FIELD_NAME]: "",
      [WARRANTY_DURATION_TYPE_FIELD_NAME]: "Years",
      [BRAND_FIELD_NAME]: "",
      [STORE_NAME_FIELD_NAME]: "",
      [STORE_LOCATION_FIELD_NAME]: "",
      [STORE_EMAIL_FIELD_NAME]: "",
      [STORE_CONTACT_FIELD_NAME]: "",
    },
  });

  async function onAddWarranty(data: FormData) {
    //Create deep copy of date input
    const dateOfPurchase = new Date(data[DATE_FIELD_NAME].getTime());

    let warrantyPeriod = Number(data[WARRANTY_PERIOD_FIELD_NAME]);
    let dateOfExpiry;
    switch (data[WARRANTY_DURATION_TYPE_FIELD_NAME]) {
      case "Years":
        dateOfExpiry = dateOfPurchase.setFullYear(
          dateOfPurchase.getFullYear() + warrantyPeriod
        );
        break;
      case "Months":
        dateOfExpiry = dateOfPurchase.setMonth(
          dateOfPurchase.getMonth() + warrantyPeriod
        );
        break;
      case "Days":
        dateOfExpiry = dateOfPurchase.setDate(
          dateOfPurchase.getDate() + warrantyPeriod
        );
        break;
    }
    const newProductWarrantyKey = push(child(ref(database), "posts")).key;
    const warrantyData = {
      [PRODUCT_NAME_FIELD_NAME]: data[PRODUCT_NAME_FIELD_NAME],
      [DATE_FIELD_NAME]: new Intl.DateTimeFormat("en-GB", {
        timeZone: Localization.getCalendars()[0].timeZone!,
      }).format(data[DATE_FIELD_NAME]),
      dateOfExpiry: new Intl.DateTimeFormat("en-GB", {
        timeZone: Localization.getCalendars()[0].timeZone!,
      }).format(dateOfExpiry),
      [CURRENCY_FIELD_NAME]: data[CURRENCY_FIELD_NAME],
      [PRODUCT_PRICE_FIELD_NAME]: data[PRODUCT_PRICE_FIELD_NAME],
      // [CATEGORY_FIELD_NAME]: data[CATEGORY_FIELD_NAME],
      [WARRANTY_PERIOD_FIELD_NAME]: data[WARRANTY_PERIOD_FIELD_NAME],
      [WARRANTY_DURATION_TYPE_FIELD_NAME]:
        data[WARRANTY_DURATION_TYPE_FIELD_NAME],
      [BRAND_FIELD_NAME]: data[BRAND_FIELD_NAME],
      [STORE_NAME_FIELD_NAME]: data[STORE_NAME_FIELD_NAME],
      // [STORE_LOCATION_FIELD_NAME]: data[STORE_LOCATION_FIELD_NAME],
      [STORE_EMAIL_FIELD_NAME]: data[STORE_EMAIL_FIELD_NAME],
      [STORE_CONTACT_FIELD_NAME]: data[STORE_CONTACT_FIELD_NAME],
      // dateCreated: new Intl.DateTimeFormat("en-GB", {
      //   timeZone: Localization.getCalendars()[0].timeZone!,
      // }).format(new Date()),
      dateCreated: new Date(),
      dateModified: new Date(),
    };
    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates: { [key: string]: any } = {};
    updates[
      "/users/" + currentUser?.uid + "/warranties/" + newProductWarrantyKey
    ] = warrantyData;

    try {
      setIsLoading(true);
      await update(ref(database), updates);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      router.back();
    }
  }

  //Record purchases’ info (info: date, price, category (default and create your own), warranty period (years), seller name, seller
  // phone, seller email...)
  return (
    <View style={styles.fieldContainer}>
      <SectionTitle text="Product Details" style={styles.productDetailsTitle} />

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
      {/* <CategoryDropdown
        control={control}
        componentName={CATEGORY_FIELD_NAME}
        label="Category"
        mode="outlined"
      /> */}
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
      <View style={styles.dateOfPurchaseContainer}>
        <Text style={styles.dateOfPurchaseText}>
          Attach picture of receipt:{" "}
        </Text>
      </View>
      <SectionTitle text="Store Details" style={styles.storeDetailsTitle} />
      <TextField
        control={control}
        componentName={STORE_NAME_FIELD_NAME}
        mode="outlined"
        label="Name"
        placeholderText="Apple Store"
      />
      {/* <TextField
        componentName={STORE_LOCATION_FIELD_NAME}
        control={control}
        mode={"outlined"}
        label={"Location"}
        placeholderText="Mall of the Emirates"
      /> */}
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
      <Button
        loading={isLoading}
        onPress={handleSubmit(onAddWarranty)}
        mode="contained"
        buttonColor={colorScheme === "dark" ? "#a9a5e2" : "#1F41BB"}
        textColor={colorScheme === "dark" ? "black" : "white"}
      >
        {isLoading ? "Adding Warranty" : "Add Warranty"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    gap: 20,
  },
  productDetailsTitle: {
    color: "#1F41BB",
    fontSize: 20,
    fontWeight: Platform.OS === "ios" ? "500" : "bold",
    alignSelf: "center",
  },
  storeDetailsTitle: {
    color: "#1F41BB",
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
    fontSize: 16,
    marginRight: 10,
  },
});

export default AddWarrantyForm;
