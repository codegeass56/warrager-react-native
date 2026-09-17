import { StyleSheet, View } from "react-native";
import SkeletonBox from "./SkeletonBox";
function BrandsSkeleton() {
  return (
    <View style={styles.container}>
      <SkeletonBox width={150} height={32} />
      <SkeletonBox width={75} height={32} />
      <SkeletonBox width={100} height={32} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", columnGap: 7 },
});

export default BrandsSkeleton;
