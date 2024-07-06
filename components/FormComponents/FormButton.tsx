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
  return (
    <Button
      onPress={onPress}
      mode={mode}
      buttonColor={colorScheme === "dark" ? "#a9a5e2" : "#1F41BB"}
      textColor={colorScheme === "dark" ? "black" : "white"}
      loading={isLoading}
      disabled={disabled}
      contentStyle={contentStyle}
      style={style}
    >
      {text}
    </Button>
  );
}

{
  /* <Button
  onPress={handleSubmit(onSaveEdit)}
  mode="contained"
  buttonColor={colorScheme === "dark" ? "#a9a5e2" : "#1F41BB"}
  textColor={colorScheme === "dark" ? "black" : "white"}
>
  Save
</Button>; */
}

{
  /* <Button
  loading={isLoading}
  onPress={handleSubmit(onAddWarranty)}
  mode="contained"
  buttonColor={colorScheme === "dark" ? "#a9a5e2" : "#1F41BB"}
  textColor={colorScheme === "dark" ? "black" : "white"}
>
  {isLoading ? "Adding Warranty" : "Add Warranty"}
</Button>; */
}

{
  /* <Button
  buttonColor={colorScheme === "dark" ? "#a9a5e2" : "#1F41BB"}
  textColor={colorScheme === "dark" ? "black" : "white"}
  mode="contained"
  onPress={handleSubmit(OnRegister)}
  disabled={signUpDisabled}
>
  Sign Up
</Button>; */
}

//  <Button
//    onPress={() => setIsEditable(true)}
//    mode="contained"
//    buttonColor={colorScheme === "dark" ? "#a9a5e2" : "#1F41BB"}
//    textColor={colorScheme === "dark" ? "black" : "white"}
//  >
//    Edit
//  </Button>;

export default FormButton;
