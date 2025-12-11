import { auth, database, storage } from "@/firebaseConfig";
import { Image } from "expo-image";
import * as Localization from "expo-localization";
import { useLocalSearchParams, useRouter } from "expo-router";
import { child, ref as dbRefMethod, push, update } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRefMethod,
  uploadBytes,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Platform, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import DatePicker from "../FormComponents/DatePicker";
import EmailField from "../FormComponents/EmailField";
import FormButton from "../FormComponents/FormButton";
import TextField from "../FormComponents/TextField";
import SectionTitle from "../SectionTitle";
import ProductPriceInput from "./ProductPriceInput";
import StoreContactInput from "./StoreContactInput";
import WarrantyPeriodInput from "./WarrantyPeriodInput";

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
  const [imageUri, setImageUri] = useState("");
  const params = useLocalSearchParams<{ imageUri: string }>();
  const router = useRouter();
  const currentUser = auth.currentUser;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      [PRODUCT_NAME_FIELD_NAME]: "",
      [DATE_FIELD_NAME]: new Date(),
      [CURRENCY_FIELD_NAME]: "USD",
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

  useEffect(() => {
    if (params["imageUri"]) {
      setImageUri(params["imageUri"]);
    }
  }, [params]);

  useEffect(() => {
    return () => setImageUri("");
  }, []);

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
    const newProductWarrantyKey = push(
      child(dbRefMethod(database), "warranties")
    ).key;
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
      [WARRANTY_PERIOD_FIELD_NAME]: data[WARRANTY_PERIOD_FIELD_NAME],
      [WARRANTY_DURATION_TYPE_FIELD_NAME]:
        data[WARRANTY_DURATION_TYPE_FIELD_NAME],
      [BRAND_FIELD_NAME]: data[BRAND_FIELD_NAME],
      [STORE_NAME_FIELD_NAME]: data[STORE_NAME_FIELD_NAME],
      [STORE_EMAIL_FIELD_NAME]: data[STORE_EMAIL_FIELD_NAME],
      [STORE_CONTACT_FIELD_NAME]: data[STORE_CONTACT_FIELD_NAME],
      dateCreated: new Date(),
      dateModified: new Date(),
      imageUrl: "",
    };

    try {
      setIsLoading(true);
      let storageRef = storageRefMethod(
        storage,
        `${currentUser?.uid}/images/${newProductWarrantyKey}`
      );

      if (imageUri !== "") {
        const response = await fetch(imageUri);
        const blob = await response.blob();

        await uploadBytes(storageRef, blob);
        const imageUrl = await getDownloadURL(
          storageRefMethod(
            storage,
            `${currentUser?.uid}/images/${newProductWarrantyKey}`
          )
        );

        warrantyData["imageUrl"] = imageUrl;
      }
      const updates: { [key: string]: any } = {};
      updates[
        "/users/" + currentUser?.uid + "/warranties/" + newProductWarrantyKey
      ] = warrantyData;

      await update(dbRefMethod(database), updates);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      router.back();
    }
  }

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
            onPress={() => {
              router.navigate({
                pathname: `/screens/CameraScreen`,
                params: {
                  previousScreenName: "AddWarrantyScreen",
                },
              });
            }}
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
              onPress={() => {
                router.navigate({
                  pathname: `/screens/CameraScreen`,
                  params: {
                    previousScreenName: "AddWarrantyScreen",
                  },
                });
              }}
            />
            <FormButton
              text={"Remove Picture"}
              mode="contained"
              style={styles.selectPictureBtn}
              onPress={() => {
                setImageUri("");
              }}
            />
          </View>
        </View>
      ) : null}

      <SectionTitle text="Store Details" style={styles.storeDetailsTitle} />
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
