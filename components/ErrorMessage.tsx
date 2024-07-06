import { StyleSheet, useColorScheme, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

function ErrorMessage({ message }: { message: string }) {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  return (
    <View style={styles.failedMessageContainer}>
      <Text style={[styles.failedMessage, { color: theme.colors.error }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  failedMessageContainer: {
    alignItems: "center",
  },
  failedMessage: {
    fontWeight: "600",
    fontSize: 15,
  },
});

export default ErrorMessage;
