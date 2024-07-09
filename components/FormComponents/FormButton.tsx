import {
  GestureResponderEvent,
  StyleProp,
  useColorScheme,
  ViewStyle,
} from "react-native";
import { Button } from "react-native-paper";

type Props = {
  onPress?: (e: GestureResponderEvent) => void;
  mode?: "text" | "contained" | "outlined" | "elevated" | "contained-tonal";
  isLoading?: boolean;
  text: string;
  disabled?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

function FormButton({
  onPress,
  mode,
  isLoading,
  text,
  disabled,
  contentStyle,
  style,
}: Props) {
  const colorScheme = useColorScheme();

  let buttonColor;
  let textColor;
  if (mode === "contained") {
    buttonColor = colorScheme === "dark" ? "#a9a5e2" : "#1F41BB";
    colorScheme === "dark" ? "black" : "white";
  } else {
    buttonColor = undefined;
    colorScheme === "dark" ? "#a9a5e2" : "#1F41BB";
  }

  return (
    <Button
      onPress={onPress}
      mode={mode}
      buttonColor={buttonColor}
      textColor={textColor}
      loading={isLoading}
      disabled={disabled}
      contentStyle={contentStyle}
      style={style}
    >
      {text}
    </Button>
  );
}

export default FormButton;
