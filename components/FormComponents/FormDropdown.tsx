import { Control, Controller } from "react-hook-form";
import { StyleProp, View, ViewStyle } from "react-native";
import { Dropdown, Option } from "react-native-paper-dropdown";

type Props = {
  componentName: string;
  control: Control<any>;
  mode?: "flat" | "outlined" | undefined;
  label?: string;
  style?: StyleProp<ViewStyle>;
  dropdownItems: Option[];
  menuContentStyle?: ViewStyle;
  placeholder?: string;
  hideMenuHeader?: boolean;
  disabled?: boolean;
};

function FormDropdown({
  componentName,
  control,
  style,
  label,
  mode,
  dropdownItems,
  menuContentStyle,
  placeholder = "Select an option",
  hideMenuHeader = false,
  disabled,
}: Props) {
  return (
    <Controller
      control={control}
      name={componentName}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={style}>
          <Dropdown
            label={label}
            mode={mode}
            value={value}
            options={dropdownItems}
            onSelect={onChange}
            menuContentStyle={menuContentStyle}
            placeholder={placeholder}
            hideMenuHeader={hideMenuHeader}
            disabled={disabled}
            error={error !== undefined}
          />
        </View>
      )}
    />
  );
}

export default FormDropdown;
