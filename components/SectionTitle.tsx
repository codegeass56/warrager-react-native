import { StyleProp, TextStyle } from "react-native";
import { Text } from "react-native-paper";

type Props = {
  style?: StyleProp<TextStyle>;
  text: string;
};

function SectionTitle({ style, text }: Props) {
  return <Text style={style}>{text}</Text>;
}

export default SectionTitle;
