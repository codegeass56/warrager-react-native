import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Chip } from "react-native-paper";
import MaterialChip from "../MaterialChip";

type Props = {
  products: Product[];
  onFilter: React.Dispatch<React.SetStateAction<BrandObj>>;
};

function Filter({ products, onFilter }: Props) {
  return (
    <View style={styles.container}>
      {/* <Button
        mode="contained"
        icon={"filter"}
        style={styles.filterBtnStyle}
        onPress={() => {}}
        contentStyle={styles.filterBtnSize}
        buttonColor="#1F41BB"
      >
        Filter
      </Button> */}
      <View style={styles.verticalDivider} />
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollViewContainer}
        showsHorizontalScrollIndicator={false}
        scrollEnabled
      >
        {/* {uniqueProducts.map((p) => (
          <Chip
            key={p.id}
            onPress={() => {
              onFilter(p.productBrand);
            }}
          >
            {p.productBrand}
          </Chip>
        ))} */}
        {products.map((p) => (
          <MaterialChip key={p.id} onSelect={onFilter} brand={p.productBrand} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", columnGap: 7 },
  filterBtnSize: {
    width: 90,
    height: "auto",
  },
  filterBtnStyle: {
    borderRadius: 5,
    margin: 0,
  },
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
