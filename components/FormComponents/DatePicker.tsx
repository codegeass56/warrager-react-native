import { Control, Controller } from "react-hook-form";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import {
  Platform,
  StyleProp,
  StyleSheet,
  TextStyle,
  useColorScheme,
  View,
} from "react-native";
import { Button, MD3LightTheme, Text } from "react-native-paper";
import * as Localization from "expo-localization";
type Props = {
  componentName: string;
  control: Control<any>;
  placeholderText?: string;
  disabled?: boolean;
};

function DatePicker({ control, componentName, disabled }: Props) {
  const colorScheme = useColorScheme();
  return (
    <Controller
      control={control}
      name={componentName}
      render={({ field: { onChange, value } }) =>
        Platform.OS === "ios" ? (
          <DateTimePicker
            value={value}
            onChange={(event, selectedDate) => {
              onChange(selectedDate);
            }}
            timeZoneName={Localization.getCalendars()[0].timeZone!}
            disabled={disabled}
          />
        ) : (
          <Button
            onPress={() =>
              DateTimePickerAndroid.open({
                value: value,
                onChange: (event, selectedDate) => {
                  onChange(selectedDate);
                },
              })
            }
            style={styles.androidDatePickerBtn}
            textColor={colorScheme === "dark" ? "#f2f2f7" : "#2C2C2E"}
            buttonColor={colorScheme === "dark" ? "#2C2C2E" : "#f2f2f7"}
            disabled={disabled}
          >
            <Text style={styles.androidDatePickerBtnText}>
              {value.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </Button>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  androidDatePickerBtn: {
    borderRadius: 7,
  },
  androidDatePickerBtnText: {
    fontSize: 17,
    fontWeight: "bold",
  },
});

export default DatePicker;
