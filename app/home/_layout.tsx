import { Stack } from "expo-router";
import { Platform, useColorScheme } from "react-native";
import { useTheme } from "react-native-paper";

function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        title: "",
        headerStyle:
          Platform.OS === "android"
            ? {
                backgroundColor:
                  colorScheme === "dark" ? "#7cacf8" : theme.colors.surface,
              }
            : {
                backgroundColor: theme.colors.background,
              },
      }}
    >
      <Stack.Screen
        name="add-warranty/AddWarrantyScreen"
        options={{
          headerShown: true,
          title: "",
        }}
      />
      <Stack.Screen
        name="edit-warranty/[productId]"
        options={{
          headerShown: true,
          title: "",
        }}
      />
      <Stack.Screen
        name="CameraScreen"
        options={{
          headerShown: true,
          title: "",
        }}
      />
    </Stack>
  );
}

export default RootLayout;
