import { StyleSheet, useColorScheme, View } from "react-native";
import { Text } from "react-native-paper";

function HomeScreenHeader() {
  const colorScheme = useColorScheme();

  return (
    <View>
      <Text
        style={[
          styles.text,
          { color: colorScheme === "dark" ? "#7cacf8" : "#1F41BB" },
        ]}
      >
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
