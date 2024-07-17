import { Controller, FieldError } from "react-hook-form";
import { useColorScheme, View } from "react-native";
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
  const colorScheme = useColorScheme();

  let outlineColor: string;
  let activeOutlineColor: string;
  if (mode === "outlined") {
    outlineColor = colorScheme === "dark" ? "#7cacf8" : "#1F41BB";
    activeOutlineColor = colorScheme === "dark" ? "#7cacf8" : "#1F41BB";
  }
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
              activeOutlineColor={activeOutlineColor}
              outlineColor={outlineColor}
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
            activeOutlineColor={activeOutlineColor}
            outlineColor={outlineColor}
          />
        )
      }
    />
  );
}

export default TextField;
