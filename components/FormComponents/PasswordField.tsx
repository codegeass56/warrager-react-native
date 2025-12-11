import { useState } from "react";
import { TextInput } from "react-native-paper";
import TextField from "./TextField";

function PasswordField({
  control,
  componentName,
  placeholderText,
  autoFocus,
  mode,
  label,
  placeholderTextColor = "#626262",
  validation,
  autoCapitalize = "none",
}: TextFieldProps) {
  const [hidePassword, setHidePassword] = useState(true);

  return validation?.errors ? (
    <TextField
      componentName={componentName}
      control={control}
      mode={mode}
      label={label}
      placeholderText={placeholderText}
      secureTextEntry={hidePassword}
      placeholderTextColor={placeholderTextColor}
      right={
        <TextInput.Icon
          icon={hidePassword ? "eye" : "eye-off"}
          onPress={() => setHidePassword((hidePassword) => !hidePassword)}
          forceTextInputFocus={false}
        />
      }
      autoFocus={autoFocus}
      validation={validation}
      autoCapitalize={autoCapitalize}
    />
  ) : (
    <TextField
      componentName={componentName}
      control={control}
      mode={mode}
      label={label}
      placeholderText={placeholderText}
      secureTextEntry={hidePassword}
      right={
        <TextInput.Icon
          icon={hidePassword ? "eye" : "eye-off"}
          onPress={() => setHidePassword((hidePassword) => !hidePassword)}
          forceTextInputFocus={false}
        />
      }
      autoCapitalize={autoCapitalize}
    />
  );
}

export default PasswordField;
