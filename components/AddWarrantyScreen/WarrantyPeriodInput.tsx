import { Control, FieldErrors } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import FormDropdown from "../FormComponents/FormDropdown";
import TextField from "../FormComponents/TextField";

type Props = {
  control: Control<any>;
  errors: FieldErrors<any>;
  warrantyPeriodFieldCompName: string;
  durationDropdownCompName: string;
  editable?: boolean;
};

const durationTypes = [
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

function WarrantyPeriodInput({
  control,
  errors,
  durationDropdownCompName,
  warrantyPeriodFieldCompName,
  editable = true,
}: Props) {
  function isValidTimePeriod(warrantyPeriodInput: string) {
    const regEx = /^\d+$/g;
    if (regEx.test(warrantyPeriodInput)) {
      return true;
    }

    return warrantyPeriodInput === "" || "Must be a whole number";
  }
  return (
    <View style={styles.warrantyPeriodContainer}>
      <View style={styles.warrantyPeriodInput}>
        <TextField
          componentName={warrantyPeriodFieldCompName}
          control={control}
          mode="outlined"
          label="Warranty Period"
          placeholderText="1"
          keyboardType="numeric"
          returnKeyType="done"
          validation={{
            errors,
            rules: {
              validate: isValidTimePeriod,
              required: "Please enter the warranty period",
            },
          }}
          editable={editable}
        />
      </View>

      <FormDropdown
        control={control}
        componentName={durationDropdownCompName}
        label="Duration"
        mode="outlined"
        dropdownItems={durationTypes}
        editable={editable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  warrantyPeriodContainer: {
    flexDirection: "row",
  },
  warrantyPeriodInput: {
    flex: 1,
  },
});

export default WarrantyPeriodInput;
