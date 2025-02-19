import { Stack } from "expo-router";
import React from "react";
import { Platform, useColorScheme } from "react-native";
import { useTheme } from "react-native-paper";

function _layout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          headerShadowVisible: false,
          title: "Home",
        }}
      />
      <Stack.Screen
        name="screens/home/add-warranty/AddWarrantyScreen"
        options={{
          headerShown: true,
          title: "",
          headerStyle:
            Platform.OS === "android"
              ? {
                  backgroundColor:
                    colorScheme === "dark" ? "#7cacf8" : theme.colors.surface,
                }
              : {
                  backgroundColor:
                    colorScheme === "dark"
                      ? theme.colors.onSurface
                      : theme.colors.surface,
                },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="screens/home/edit-warranty/[productId]"
        options={{
          headerShown: true,
          title: "",
          headerStyle:
            Platform.OS === "android"
              ? {
                  backgroundColor:
                    colorScheme === "dark" ? "#7cacf8" : theme.colors.surface,
                }
              : {
                  backgroundColor:
                    colorScheme === "dark"
                      ? theme.colors.onSurface
                      : theme.colors.surface,
                },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="screens/CameraScreen"
        options={{
          headerShown: true,
          title: "",
          headerStyle:
            Platform.OS === "android"
              ? {
                  backgroundColor:
                    colorScheme === "dark" ? "#7cacf8" : theme.colors.surface,
                }
              : {
                  backgroundColor:
                    colorScheme === "dark"
                      ? theme.colors.onSurface
                      : theme.colors.surface,
                },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}

export default _layout;
