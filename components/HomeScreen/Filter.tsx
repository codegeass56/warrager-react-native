import { ScrollView, StyleSheet, View } from "react-native";
import MaterialChip from "../MaterialChip";

type Props = {
  uniqueBrandNames: string[];
  onFilter: React.Dispatch<React.SetStateAction<BrandObj>>;
  activeBrands: BrandObj;
};

function Filter({ uniqueBrandNames, onFilter, activeBrands }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.verticalDivider} />
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollViewContainer}
        showsHorizontalScrollIndicator={false}
        scrollEnabled
      >
        {uniqueBrandNames.map((brand) => (
          <MaterialChip
            key={brand}
            onSelect={onFilter}
            brand={brand}
            isSelected={!!activeBrands[brand]}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", columnGap: 7 },
  verticalDivider: {
    height: "100%",
    width: 1,
    backgroundColor: "#909090",
  },
  scrollViewContainer: {
    columnGap: 7,
    alignItems: "center",
  },
});

export default Filter;
