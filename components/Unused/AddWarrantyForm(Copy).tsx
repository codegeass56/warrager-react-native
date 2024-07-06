import { router, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Platform, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  HelperText,
  Icon,
  Text,
  TextInput,
} from "react-native-paper";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import DropDown from "react-native-paper-dropdown";
import * as Localization from "expo-localization";

type FormData = {
  productName: string;
  date: Date;
  price: string;
  category: string;
  warrantyPeriod: string;
  warrantyPeriodType: string;
  brand: string;
  storeName: string;
  storeLocation: string;
  storeEmail: string;
  storeContact: string;
};

function AddWarrantyForm() {
  // const [isLoading, setIsLoading] = useState(false);
  // const router = useRouter();
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showWarrantyPeriodDropdown, setShowWarrantyPeriodDropdown] =
    useState(false);

  function isEmail(emailInput: string) {
    const regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (regEx.test(emailInput)) {
      return true;
    }

    return "The store email is invalid";
  }

  const categoryList = [
    {
      label: "Electronics",
      value: "electronics",
    },
    {
      label: "Toys",
      value: "toys",
    },
    {
      label: "Others",
      value: "others",
    },
  ];

  const currencyList = [
    {
      label: "AED",
      value: "AED",
    },
    {
      label: "USD",
      value: "USD",
    },
    {
      label: "Other",
      value: "other",
    },
  ];

  const warrantyPeriodTypes = [
    {
      label: "Years",
      value: "Years",
    },
    {
      label: "Months",
      value: "Months",
    },
    {
      label: "Days",
      value: "Days",
    },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      productName: "",
      date: new Date(),
      currency: "AED",
      price: "0",
      category: "Product Category",
      warrantyPeriod: "",
      warrantyPeriodType: "Years",
      brand: "",
      storeName: "",
      storeLocation: "",
      storeEmail: "",
      storeContact: "",
    },
  });
  const onSubmit = (data: FormData) => {
    console.log(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: Localization.getCalendars()[0].timeZone!,
      }).format(data.date)
    );
    //Calculate date of expiry based on warrantyPeriod and type
    // console.log(typeof data.date);
  };
  // console.log(Localization.getCalendars()[0].timeZone!);

  //Record purchases’ info (info: date, price, category (default and create your own), warranty period (years), seller name, seller
  // phone, seller email...)
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.productDetailsTitle}>Product Details</Text>
      <View>
        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, value } }) => (
            <View style={styles.dateOfPurchaseContainer}>
              <Text style={styles.dateOfPurchaseText}>Date of purchase:</Text>
              {Platform.OS === "ios" ? (
                <DateTimePicker
                  value={value}
                  onChange={(event, selectedDate) => {
                    onChange(selectedDate);
                  }}
                  themeVariant="light"
                  timeZoneName={Localization.getCalendars()[0].timeZone!}
                />
              ) : (
                <Button
                  onPress={() =>
                    DateTimePickerAndroid.open({
                      value: value,
                      onChange: (event, selectedDate) => {
                        onChange(selectedDate);
                      },
                      mode: "date",
                      is24Hour: true,
                    })
                  }
                  style={styles.androidDatePickerBtn}
                  textColor="black"
                  buttonColor="#f2f2f7"
                >
                  <Text style={styles.androidDatePickerBtnText}>
                    {value.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </Button>
              )}
            </View>
          )}
        />
      </View>
      {/* TODO: Validation */}
      <View style={styles.currencyContainer}>
        <Controller
          control={control}
          name="currency"
          render={({ field: { onChange, value } }) => (
            <View style={styles.currencyDropdownWidth}>
              <DropDown
                label={"Currency"}
                mode={"outlined"}
                visible={showCurrencyDropdown}
                showDropDown={() => setShowCurrencyDropdown(true)}
                onDismiss={() => setShowCurrencyDropdown(false)}
                value={value}
                setValue={onChange}
                list={currencyList}
                dropDownStyle={{ marginTop: 0 }}
                inputProps={{
                  right: (
                    <TextInput.Icon
                      icon={showCurrencyDropdown ? "menu-up" : "menu-down"}
                    />
                  ),
                }}
              />
            </View>
          )}
        />
        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, value } }) => (
            <TextInput
              mode="outlined"
              label="Price"
              placeholder="AED"
              placeholderTextColor={"#626262"}
              onChangeText={onChange}
              keyboardType="numeric"
              returnKeyType="done"
              style={styles.priceInput}
              value={value}
            />
          )}
        />
      </View>
      <View>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <DropDown
              label={"Category"}
              mode={"outlined"}
              visible={showCategoryDropdown}
              showDropDown={() => setShowCategoryDropdown(true)}
              onDismiss={() => setShowCategoryDropdown(false)}
              value={value}
              setValue={onChange}
              list={categoryList}
              dropDownStyle={{ marginTop: 0 }}
              inputProps={{
                right: (
                  <TextInput.Icon
                    icon={showCategoryDropdown ? "menu-up" : "menu-down"}
                  />
                ),
              }}
            />
          )}
        />
      </View>
      <View>
        <Controller
          control={control}
          name="brand"
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                mode="outlined"
                label="Brand"
                placeholder="Apple"
                placeholderTextColor={"#626262"}
                onChangeText={onChange}
                value={value}
              />
            </>
          )}
        />
      </View>
      {/* TODO: Validation */}
      <View style={styles.warrantyPeriodContainer}>
        <Controller
          control={control}
          name="warrantyPeriod"
          render={({ field: { onChange, value } }) => (
            <TextInput
              mode="outlined"
              label="Warranty Period"
              placeholder="1"
              placeholderTextColor={"#626262"}
              onChangeText={onChange}
              keyboardType="numeric"
              returnKeyType="done"
              style={styles.warrantyPeriodInput}
              value={value}
            />
          )}
        />
        <Controller
          control={control}
          name="warrantyPeriodType"
          render={({ field: { onChange, value } }) => (
            <View>
              <DropDown
                label={"Duration"}
                mode={"outlined"}
                visible={showWarrantyPeriodDropdown}
                showDropDown={() => setShowWarrantyPeriodDropdown(true)}
                onDismiss={() => setShowWarrantyPeriodDropdown(false)}
                value={value}
                setValue={onChange}
                list={warrantyPeriodTypes}
                dropDownStyle={{ marginTop: 0 }}
                inputProps={{
                  right: (
                    <TextInput.Icon
                      icon={
                        showWarrantyPeriodDropdown ? "menu-up" : "menu-down"
                      }
                    />
                  ),
                }}
              />
            </View>
          )}
        />
      </View>
      <Text style={styles.storeDetailsTitle}>Store Details</Text>
      <View>
        <Controller
          control={control}
          name="storeName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              mode="outlined"
              label="Name"
              placeholder="Apple Store"
              placeholderTextColor={"#626262"}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
      </View>
      <View>
        <Controller
          control={control}
          name="storeLocation"
          render={({ field: { onChange, value } }) => (
            <TextInput
              mode="outlined"
              label="Location"
              placeholder="Apple Store"
              placeholderTextColor={"#626262"}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
      </View>
      <View>
        <Controller
          name="storeEmail"
          control={control}
          rules={{
            validate: isEmail,
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextInput
                keyboardType="email-address"
                mode="outlined"
                label="Email"
                placeholder="support@apple.com"
                autoComplete="email"
                error={error !== undefined}
                onChangeText={onChange}
                placeholderTextColor={"#626262"}
                value={value}
              />
              {errors.storeEmail ? (
                <HelperText type="error">
                  {errors.storeEmail.message}
                </HelperText>
              ) : null}
            </>
          )}
        />
      </View>
      <View>
        <Controller
          control={control}
          name="storeContact"
          render={({ field: { onChange, value } }) => (
            <TextInput
              mode="outlined"
              label="Contact Number"
              placeholder="1234567890"
              placeholderTextColor={"#626262"}
              onChangeText={onChange}
              keyboardType="numeric"
              returnKeyType="done"
              style={{ flex: 1 }}
              value={value}
            />
          )}
        />
      </View>
      <Button onPress={handleSubmit(onSubmit)}>Submit</Button>
    </View>
  );
}

{
  /* <Button
          style={styles.storeLocationButton}
          labelStyle={styles.storeLocationButtonText}
          mode="text"
          onPress={() => {}}
          icon={"map-marker"}
          textColor="#1F41BB"
        >
          Select store location
        </Button> */
}

const styles =
  Platform.OS === "ios"
    ? StyleSheet.create({
        fieldContainer: {
          // width: 400,
          gap: 20,
        },
        productDetailsTitle: {
          color: "#1F41BB",
          fontSize: 20,
          fontWeight: "500",
          alignSelf: "center",
        },
        storeDetailsTitle: {
          color: "#1F41BB",
          fontSize: 20,
          fontWeight: "500",
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
        },
        // storeLocationButton: {
        //   alignSelf: "flex-start",
        // },
        // storeLocationButtonText: {
        //   fontSize: 16,
        // },
        warrantyPeriodContainer: {
          flexDirection: "row",
        },
        warrantyPeriodInput: {
          flex: 1,
        },
        androidDatePickerBtn: {
          borderRadius: 7,
          marginLeft: 10,
        },
        androidDatePickerBtnText: {
          fontSize: 17,
          fontWeight: "bold",
        },
      })
    : StyleSheet.create({
        fieldContainer: {
          // width: 400,
          gap: 20,
        },
        productDetailsTitle: {
          color: "#1F41BB",
          fontSize: 20,
          fontWeight: "bold",
          alignSelf: "center",
        },
        storeDetailsTitle: {
          color: "#1F41BB",
          fontSize: 20,
          fontWeight: "bold",
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
        },
        // storeLocationButton: {
        //   alignSelf: "flex-start",
        // },
        // storeLocationButtonText: {
        //   fontSize: 16,
        // },
        warrantyPeriodContainer: {
          flexDirection: "row",
        },
        warrantyPeriodInput: {
          flex: 1,
        },
        androidDatePickerBtn: {
          borderRadius: 7,
          marginLeft: 10,
        },
        androidDatePickerBtnText: {
          fontSize: 17,
          fontWeight: "bold",
        },
      });

export default AddWarrantyForm;
