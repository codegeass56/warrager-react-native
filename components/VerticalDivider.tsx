import { StyleSheet, View } from "react-native";

function VerticalDivider() {
  return <View style={styles.verticalDivider} />;
}

const styles = StyleSheet.create({
  verticalDivider: {
    height: "100%",
    width: 1,
    backgroundColor: "#909090",
  },
});

export default VerticalDivider;
