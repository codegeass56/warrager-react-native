import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import {
  Platform,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Icon,
  PaperProvider,
  Text,
  useTheme,
} from "react-native-paper";
import * as Localization from "expo-localization";
import TextField from "../FormComponents/TextField";
import EmailField from "../FormComponents/EmailField";
import DatePicker from "../FormComponents/DatePicker";
import ProductPriceInput from "../AddWarrantyScreen/ProductPriceInput";
import WarrantyPeriodInput from "../AddWarrantyScreen/WarrantyPeriodInput";
import StoreContactInput from "../AddWarrantyScreen/StoreContactInput";
import CategoryDropdown from "../AddWarrantyScreen/CategoryDropdown";
import { child, get, push, ref, set, update } from "firebase/database";
import { auth, database } from "@/firebaseConfig";
import { useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import LoadingScreen from "@/app/screens/LoadingScreen";
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
  dateCreated: string;
};

function EditWarrantyForm({ productId }: { productId: string }) {
  const [isEditable, setIsEditable] = useState(false);
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const router = useRouter();
  const currentUser = auth.currentUser;
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: () =>
      get(
        child(
          ref(database),
          `users/${currentUser?.uid}/warranties/${productId}`
        )
      )
        .then((snapshot) => {
          if (snapshot.exists()) {
            let dateString: string = snapshot.val()[DATE_FIELD_NAME];
            let dateParts = dateString.split("/");
            let month = Number(dateParts[1]) - 1;
            let day = Number(dateParts[0]);
            let year = Number(dateParts[2]);

            return {
              ...snapshot.val(),
              [DATE_FIELD_NAME]: new Date(year, month, day),
              dateCreated: snapshot.val().dateCreated,
            };
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        }),
  });
  async function onSaveEdit(data: FormData) {
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
      dateCreated: data.dateCreated,
      dateModified: new Date(),
    };
    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates: { [key: string]: any } = {};
    updates["/users/" + currentUser?.uid + "/warranties/" + productId] =
      warrantyData;

    try {
      // setIsLoading(true);
      await update(ref(database), updates);
    } catch (error) {
      console.log(error);
    } finally {
      // setIsLoading(false);
      router.back();
    }
  }

  //Record purchases’ info (info: date, price, category (default and create your
  // own), warranty period (years), seller name, seller phone, seller email...)
  return (
    <PaperProvider>
      {!getValues(DATE_FIELD_NAME) ? (
        <LoadingScreen />
      ) : (
        <ScrollView
          style={[
            styles.addWarrantyScreenContainer,
            colorScheme === "dark"
              ? { backgroundColor: theme.colors.onSurface }
              : { backgroundColor: theme.colors.surface },
          ]}
          contentContainerStyle={{ padding: 20 }}
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
        >
          <View style={styles.fieldContainer}>
            <SectionTitle
              text="Product Details"
              style={styles.productDetailsTitle}
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
              editable={isEditable}
            />
            <View style={styles.dateOfPurchaseContainer}>
              <Text style={styles.dateOfPurchaseText}>Date of purchase:</Text>
              <DatePicker
                control={control}
                componentName={DATE_FIELD_NAME}
                disabled={!isEditable}
              />
            </View>
            <ProductPriceInput
              control={control}
              validation={{
                errors,
              }}
              dropdownCompName={CURRENCY_FIELD_NAME}
              priceFieldCompName={PRODUCT_PRICE_FIELD_NAME}
              editable={isEditable}
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
              editable={isEditable}
            />
            <WarrantyPeriodInput
              control={control}
              errors={errors}
              durationDropdownCompName={WARRANTY_DURATION_TYPE_FIELD_NAME}
              warrantyPeriodFieldCompName={WARRANTY_PERIOD_FIELD_NAME}
              editable={isEditable}
            />
            {/* <View style={styles.dateOfPurchaseContainer}>
        <Text style={styles.dateOfPurchaseText}>
          Attach picture of receipt:{" "}
        </Text>
      </View> */}
            <SectionTitle
              text="Store Details"
              style={styles.storeDetailsTitle}
            />
            <TextField
              componentName={STORE_NAME_FIELD_NAME}
              mode="outlined"
              label="Name"
              control={control}
              placeholderText="Apple Store"
              editable={isEditable}
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
              editable={isEditable}
            />
            <StoreContactInput
              control={control}
              contactFieldCompName={STORE_CONTACT_FIELD_NAME}
              mode="outlined"
              label="Contact Number"
              validation={{
                errors,
              }}
              editable={isEditable}
            />
            {isEditable ? (
              <Button
                onPress={handleSubmit(onSaveEdit)}
                mode="contained"
                buttonColor={colorScheme === "dark" ? "#a9a5e2" : "#1F41BB"}
                textColor={colorScheme === "dark" ? "black" : "white"}
              >
                Save
              </Button>
            ) : (
              <Button
                onPress={() => setIsEditable(true)}
                mode="contained"
                buttonColor={colorScheme === "dark" ? "#a9a5e2" : "#1F41BB"}
                textColor={colorScheme === "dark" ? "black" : "white"}
              >
                Edit
              </Button>
            )}
          </View>
        </ScrollView>
      )}
    </PaperProvider>
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
    fontWeight: Platform.OS === "ios" ? "500" : "bold",
    alignSelf: "center",
    marginTop: 30,
  },
  dateOfPurchaseContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencyContainer: {
    flexDirection: "row",
  },
  currencyDropdownWidth: {
    width: 100,
  },
  priceInput: {
    flex: 1,
  },
  dateOfPurchaseText: {
    fontSize: 16,
    marginRight: 10,
  },
  warrantyPeriodContainer: {
    flexDirection: "row",
  },
  warrantyPeriodInput: {
    flex: 1,
  },
  androidDatePickerBtn: {
    borderRadius: 7,
  },
  androidDatePickerBtnText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  addWarrantyBtn: {
    color: "#1F41BB",
  },
  addWarrantyScreenContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
});

export default EditWarrantyForm;
