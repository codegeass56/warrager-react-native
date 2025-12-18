import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

function LoginHeader() {
  const theme = useTheme();
  return (
    <View style={styles.headingContainer}>
      <Text style={[styles.title, { color: theme.colors.onSurfaceVariant }]}>
        Warrager
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headingContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
  },
});

export default LoginHeader;
