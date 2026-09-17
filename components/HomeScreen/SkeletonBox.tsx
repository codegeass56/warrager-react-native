import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function SkeletonBox({
  width,
  height = 20,
  borderRadius = 8,
  flex,
}: {
  width?: number;
  height?: number;
  borderRadius?: number;
  flex?: number;
}) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const translateX = useSharedValue(-(width ?? 100));

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width ?? 100, { duration: 1000 }),
      -1,
      true,
    );
  }, [width, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={{
        width: flex ? undefined : width,
        flex,
        height,
        borderRadius,
        backgroundColor: isDarkMode ? "#333" : "#e0e0e0",
        overflow: "hidden",
      }}
    >
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={
            isDarkMode
              ? ["transparent", "rgba(255,255,255,0.08)", "transparent"]
              : ["transparent", "rgba(255,255,255,0.6)", "transparent"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}
