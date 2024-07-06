import { Controller, FieldError } from "react-hook-form";
import { View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";

function TextField({
  control,
  componentName,
  mode,
  label,
  placeholderText,
  style,
  placeholderTextColor = "#626262",
  keyboardType,
  returnKeyType,
  autocomplete,
  autoFocus,
  right,
  secureTextEntry,
  validation,
  editable,
  autoCapitalize,
}: TextFieldProps) {
  return (
    <Controller
      control={control}
      name={componentName}
      rules={validation?.rules}
      render={({ field: { onChange, value }, fieldState: { error } }) =>
        validation?.errors ? (
          <View>
            <TextInput
              mode={mode}
              label={label}
              placeholder={placeholderText}
              onChangeText={onChange}
              value={value}
              style={style}
              placeholderTextColor={placeholderTextColor}
              keyboardType={keyboardType}
              returnKeyType={returnKeyType}
              error={error !== undefined}
              autoComplete={autocomplete}
              autoFocus={autoFocus}
              right={right}
              secureTextEntry={secureTextEntry}
              editable={editable}
              autoCapitalize={autoCapitalize}
            />
            {validation.errors[`${componentName}`] && (
              <HelperText type="error">
                {(validation.errors[`${componentName}`] as FieldError).message}
              </HelperText>
            )}
          </View>
        ) : (
          <TextInput
            mode={mode}
            label={label}
            placeholder={placeholderText}
            onChangeText={onChange}
            value={value}
            style={style}
            placeholderTextColor={placeholderTextColor}
            keyboardType={keyboardType}
            returnKeyType={returnKeyType}
            editable={editable}
          />
        )
      }
    />
  );
}

export default TextField;
