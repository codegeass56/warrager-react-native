import { Slot } from "expo-router";
import { StyleSheet, useColorScheme, View } from "react-native";
import {
  DefaultTheme,
  MD2Colors,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";

function HomeLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const theme = {
    ...DefaultTheme,
    colors: {
      primary: MD2Colors.blue500,
      error: "#dc2626",
      primaryContainer: isDarkMode ? "#ffffff" : "#1F41BB",
      onSurface: isDarkMode ? "#ffffff" : "#000000", //for text color in Text components
      background: isDarkMode
        ? MD3LightTheme.colors.onSurface
        : MD3LightTheme.colors.surface, //for app background
      onSurfaceVariant: isDarkMode ? "#7cacf8" : "#1F41BB", //for text color in datepicker, dropdown, label
      outline: isDarkMode ? "#7cacf8" : "#1F41BB", //for outline of input fields, dropdowns
      elevation: {
        level2: isDarkMode ? "rgba(25, 24, 24, 0.75)" : "#ffffff", //for menu background
        level5: isDarkMode ? "rgba(25, 24, 24, 0.75)" : "#ffffff", //for dropdown menu background
        level3: isDarkMode ? "#2B2930" : "#ECE6F0", //for dialog background
      },
      outlineVariant: isDarkMode ? "#f1f5f94d" : "#e5e7eb", //for borders
      onBackground: isDarkMode ? "#ffffff" : "#1F41BB", //for color of menu items in dropdown
      surfaceDisabled: "#94a3b8", //for disabled buttons
    },
  };

  return (
    <PaperProvider theme={theme}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <Slot />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeLayout;
