import { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { TextInput } from "react-native-paper";
import DropDown, { DropDownPropsInterface } from "react-native-paper-dropdown";

type Props = {
  componentName: string;
  control: Control<any>;
  mode?: "flat" | "outlined" | undefined;
  label?: string;
  style?: StyleProp<ViewStyle>;
  dropdownItems: DropDownPropsInterface["list"];
  editable?: boolean;
};

function FormDropdown({
  componentName,
  control,
  style,
  label,
  mode,
  dropdownItems,
  editable,
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <Controller
      control={control}
      name={componentName}
      render={({ field: { onChange, value } }) => (
        <View style={style}>
          <DropDown
            label={label}
            mode={mode}
            visible={showDropdown}
            showDropDown={editable ? () => setShowDropdown(true) : null}
            onDismiss={() => setShowDropdown(false)}
            value={value}
            setValue={onChange}
            list={dropdownItems}
            dropDownStyle={
              Platform.OS === "android"
                ? styles.androidDropdownStyle
                : styles.iosDropdownStyle
            }
            inputProps={
              editable
                ? {
                    right: (
                      <TextInput.Icon
                        icon={showDropdown ? "menu-up" : "menu-down"}
                      />
                    ),
                  }
                : null
            }
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  androidDropdownStyle: {
    marginTop: 0,
  },
  iosDropdownStyle: {
    marginTop: -40,
  },
});

export default FormDropdown;
