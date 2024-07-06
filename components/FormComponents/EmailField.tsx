import { FieldErrors, RegisterOptions } from "react-hook-form";
import TextField from "./TextField";

function isEmail(emailInput: string) {
  const regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  if (regEx.test(emailInput)) {
    return true;
  }

  return emailInput === "" || "Invalid Email";
}

type Props = Omit<TextFieldProps, "validation"> & {
  validation: {
    errors: FieldErrors<any>;
    rules?: Omit<
      RegisterOptions<any, string>,
      "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
    >;
  };
};

function EmailField({
  control,
  componentName,
  placeholderText,
  autoFocus,
  mode,
  label,
  placeholderTextColor = "#626262",
  validation,
  editable,
  autoCapitalize = "none",
}: Props) {
  return (
    <TextField
      componentName={componentName}
      control={control}
      keyboardType="email-address"
      mode={mode}
      label={label}
      placeholderText={placeholderText}
      autocomplete="email"
      autoFocus={autoFocus}
      placeholderTextColor={placeholderTextColor}
      validation={{
        ...validation,
        rules: {
          ...validation.rules,
          validate: isEmail,
        },
      }}
      editable={editable}
      autoCapitalize={autoCapitalize}
    />
  );
}

export default EmailField;
