import React from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";

function LoadingScreen() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  return (
    <View
      style={[
        styles.loadingScreenContainer,
        {
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <ActivityIndicator
        animating={true}
        color={colorScheme === "dark" ? "#7cacf8" : "#1F41BB"}
        size={84}
      />
      <Text
        style={[
          styles.loadingText,
          { color: colorScheme === "dark" ? "white" : "black" },
        ]}
      >
        Loading your account...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 25,
  },
});

export default LoadingScreen;
