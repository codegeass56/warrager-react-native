import { Control, FieldErrors, RegisterOptions } from "react-hook-form";
import TextField from "../FormComponents/TextField";
import { StyleSheet, View } from "react-native";
import FormDropdown from "../FormComponents/FormDropdown";

type Props = {
  control: Control<any>;
  dropdownCompName: string;
  priceFieldCompName: string;
  validation: {
    errors: FieldErrors<any>;
    rules?: Omit<
      RegisterOptions<any, string>,
      "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
    >;
  };
  editable?: boolean;
};

function isValidPrice(priceInput: string) {
  const regEx = /^\d+(\.\d+)?$/g;
  if (regEx.test(priceInput)) {
    return true;
  }

  if (priceInput === "") {
    return true;
  }

  return "Invalid Price";
}

function ProductPriceInput({
  control,
  dropdownCompName,
  priceFieldCompName,
  validation,
  editable = true,
}: Props) {
  const currencyList = [
    {
      label: "USD",
      value: "USD",
    },
    {
      label: "INR",
      value: "INR",
    },
    {
      label: "AED",
      value: "AED",
    },
  ];

  return (
    <View style={styles.currencyContainer}>
      <FormDropdown
        control={control}
        componentName={dropdownCompName}
        label="Currency"
        mode="outlined"
        dropdownItems={currencyList}
        style={styles.currencyDropdownWidth}
        editable={editable}
      />

      <View style={styles.priceInput}>
        <TextField
          control={control}
          componentName={priceFieldCompName}
          mode="outlined"
          label="Price"
          placeholderText="1000"
          keyboardType="numeric"
          returnKeyType="done"
          validation={{
            ...validation,
            rules: {
              ...validation.rules,
              validate: isValidPrice,
            },
          }}
          editable={editable}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  priceInput: {
    flex: 1,
  },
  currencyContainer: {
    flexDirection: "row",
  },
  currencyDropdownWidth: {
    width: 100,
  },
});

export default ProductPriceInput;
