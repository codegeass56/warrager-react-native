import SplashScreenComponent from "@/components/SplashScreenComponent";
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
import { useAuth } from "@/context/AuthContext";
import { database } from "@/firebaseConfig";
import { useSaveWarranty } from "@/hooks/useSaveWarranty";
import { useWarrantyImage } from "@/hooks/useWarrantyImage";
import { Image } from "expo-image";
import { child, ref as dbRefMethod, get } from "firebase/database";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Platform,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import ProductPriceInput from "../AddWarrantyScreen/ProductPriceInput";
import StoreContactInput from "../AddWarrantyScreen/StoreContactInput";
import WarrantyPeriodInput from "../AddWarrantyScreen/WarrantyPeriodInput";
import DatePicker from "../FormComponents/DatePicker";
import EmailField from "../FormComponents/EmailField";
import FormButton from "../FormComponents/FormButton";
import TextField from "../FormComponents/TextField";
import SectionTitle from "../SectionTitle";
import VerticalDivider from "../VerticalDivider";

function EditWarrantyForm({ productId }: { productId: string }) {
  const { user } = useAuth();
  const { imageUri, setImageUri, openCamera, removeImage } = useWarrantyImage(
    "EditWarrantyScreen",
    productId,
  );
  const { isLoading, saveWarranty } = useSaveWarranty(productId);
  const [isEditable, setIsEditable] = useState(false);
  const colorScheme = useColorScheme();
  const theme = useTheme();
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
          dbRefMethod(database),
          `users/${user?.uid}/warranties/${productId}`,
        ),
      )
        .then((snapshot) => {
          if (snapshot.exists()) {
            let dateString: string = snapshot.val()[DATE_FIELD_NAME];
            let dateParts = dateString.split("/");
            let month = Number(dateParts[1]) - 1;
            let day = Number(dateParts[0]);
            let year = Number(dateParts[2]);
            setImageUri(snapshot.val().imageUrl);
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

  const onSaveEdit = (data: FormData) => saveWarranty(data, imageUri);

  return (
    <View style={styles.mainContainer}>
      {!getValues(DATE_FIELD_NAME) ? (
        <SplashScreenComponent />
      ) : (
        <ScrollView
          style={[
            styles.addWarrantyScreenContainer,
            { backgroundColor: theme.colors.background },
          ]}
          contentContainerStyle={{ padding: 20 }}
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
        >
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
            <View style={styles.imagePreviewContainer}>
              <Text style={styles.attachPictureText}>Receipt Image:</Text>
              {!imageUri && isEditable ? (
                <FormButton
                  text={"Take Picture"}
                  mode="contained"
                  style={styles.selectPictureBtn}
                  onPress={openCamera}
                />
              ) : null}
              {!imageUri && !isEditable ? (
                <Text
                  style={[
                    styles.noImageText,
                    {
                      color: colorScheme === "light" ? "#F63428" : "#FF3B30",
                    },
                  ]}
                >
                  No Image Provided
                </Text>
              ) : null}
            </View>
            {imageUri && isEditable ? (
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

            {imageUri && !isEditable ? (
              <View style={styles.imageNotEditableContainer}>
                <Image
                  style={styles.imageNotEditable}
                  source={{ uri: imageUri }}
                  contentFit="contain"
                />
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
              componentName={STORE_NAME_FIELD_NAME}
              mode="outlined"
              label="Name"
              control={control}
              placeholderText="Apple Store"
              editable={isEditable}
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
              <View style={styles.saveAndCancelBtnContainer}>
                <FormButton
                  text="Save"
                  mode="contained"
                  onPress={handleSubmit(onSaveEdit)}
                  style={styles.saveBtn}
                  isLoading={isLoading}
                />
                <VerticalDivider />
                <FormButton
                  text="Cancel"
                  mode="contained"
                  onPress={() => setIsEditable(false)}
                  style={styles.cancelBtn}
                  disabled={isLoading}
                />
              </View>
            ) : (
              <FormButton
                text="Edit"
                mode="contained"
                onPress={() => setIsEditable(true)}
                style={styles.editBtn}
              />
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
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
    fontWeight: Platform.OS === "ios" ? "500" : "bold",
    alignSelf: "center",
    marginTop: 30,
  },
  dateOfPurchaseContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateOfPurchaseText: {
    fontSize: 16,
    marginRight: 10,
  },
  addWarrantyScreenContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
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
  imageNotEditableContainer: {
    width: "100%",
    height: 300,
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    flex: 1,
  },
  imageNotEditable: {
    width: "50%",
  },
  imagePreviewBtnContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  noImageText: {
    fontSize: 16,
  },
  saveAndCancelBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    gap: 20,
  },
  saveBtn: {
    flex: 1,
  },
  editBtn: {
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
  },
});

export default EditWarrantyForm;
