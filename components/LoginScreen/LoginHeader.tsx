import { StyleSheet, useColorScheme, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

function LoginHeader() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  return (
    <View style={styles.headingContainer}>
      <Text
        style={[
          styles.title,
          { color: colorScheme === "dark" ? "#7cacf8" : "#1F41BB" },
        ]}
      >
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
