import { StyleSheet, useColorScheme, View } from "react-native";
import { Text } from "react-native-paper";

function HomeScreenHeader() {
  const colorScheme = useColorScheme();

  return (
    <View>
      <Text
        style={[
          styles.text,
          { color: colorScheme === "dark" ? "#a9a5e2" : "#1F41BB" },
        ]}
      >
        Warrager
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#1F41BB",
    fontWeight: "bold",
    fontSize: 40,
  },
});

export default HomeScreenHeader;
