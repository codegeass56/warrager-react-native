import { StyleProp, TextStyle, useColorScheme } from "react-native";
import { Text } from "react-native-paper";

type Props = {
  style?: StyleProp<TextStyle>;
  text: string;
};

function SectionTitle({ style, text }: Props) {
  const colorScheme = useColorScheme();
  return (
    <Text
      style={[style, { color: colorScheme === "dark" ? "#7cacf8" : "#1F41BB" }]}
    >
      {text}
    </Text>
  );
}

export default SectionTitle;
