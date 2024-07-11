import { StyleSheet, useColorScheme, View } from "react-native";
import { Text } from "react-native-paper";

function RegistrationHeader() {
  const colorScheme = useColorScheme();
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
    color: "#1F41BB",
    fontSize: 45,
    fontWeight: "bold",
  },
});

export default RegistrationHeader;
