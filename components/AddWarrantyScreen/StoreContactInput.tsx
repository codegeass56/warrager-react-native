import { Control, FieldErrors, RegisterOptions } from "react-hook-form";
import TextField from "../FormComponents/TextField";

type Props = {
  control: Control<any>;
  contactFieldCompName: string;
  mode?: "outlined" | "flat";
  label?: string;
  validation: {
    errors: FieldErrors<any>;
    rules?: Omit<
      RegisterOptions<any, string>,
      "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
    >;
  };
  editable?: boolean;
};

function isValidContact(contactInput: string) {
  const regEx = /^\+?\d+$/g;
  if (regEx.test(contactInput)) {
    return true;
  }

  return contactInput === "" || "Please enter a valid contact number";
}

function StoreContactInput({
  control,
  contactFieldCompName,
  mode,
  label,
  validation,
  editable,
}: Props) {
  return (
    <TextField
      control={control}
      componentName={contactFieldCompName}
      mode={mode}
      label={label}
      keyboardType="numeric"
      returnKeyType="done"
      validation={{
        ...validation,
        rules: {
          validate: isValidContact,
        },
      }}
      editable={editable}
    />
  );
}

export default StoreContactInput;
