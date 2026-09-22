import { StyleSheet, View } from "react-native";
import VerticalDivider from "../VerticalDivider";
import SkeletonBox from "./SkeletonBox";

export default function ProductListSkeleton() {
  return (
    <View style={[styles.container]}>
      <View style={styles.sortDropdownContainer}>
        <SkeletonBox width={150} height={32} borderRadius={16} />
      </View>
      <View style={styles.product}>
        <SkeletonBox flex={1} height={300} />
        <VerticalDivider />
        <SkeletonBox flex={1} height={300} />
      </View>
      <View style={styles.product}>
        <SkeletonBox flex={1} height={300} />
        <VerticalDivider />
        <SkeletonBox flex={1} height={300} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sortDropdownContainer: {
    alignSelf: "flex-end",
  },
  product: {
    flexDirection: "row",
    borderTopWidth: 1,
    width: "100%",
    height: 300,
  },
});
