import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

function HomeScreenHeader() {
  const theme = useTheme();
  return (
    <View>
      <Text style={[styles.text, { color: theme.colors.onSurfaceVariant }]}>
        Warrager
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    fontSize: 40,
  },
});

export default HomeScreenHeader;
