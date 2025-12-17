import { Controller } from "react-hook-form";
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
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View>
          <TextInput
            mode={mode}
            label={label}
            placeholder={placeholderText}
            onChangeText={onChange}
            value={value}
            style={[
              style,
              editable === false ? { backgroundColor: "#94a3b84e" } : {},
            ]}
            placeholderTextColor={placeholderTextColor}
            keyboardType={keyboardType}
            returnKeyType={returnKeyType}
            editable={editable}
            activeOutlineColor={activeOutlineColor}
            outlineColor={outlineColor}
            error={error !== undefined}
            autoComplete={autocomplete}
            autoFocus={autoFocus}
            right={right}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
          />
          {error?.message && (
            <HelperText type="error" style={{ paddingLeft: 0 }}>
              {error.message}
            </HelperText>
          )}
        </View>
      )}
    />
  );
}

export default TextField;
