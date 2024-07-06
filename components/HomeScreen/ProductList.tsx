import { useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Button, Icon, Menu } from "react-native-paper";
import Product from "./Product";

type Props = {
  products: Product[];
  onSetSortOrder: React.Dispatch<React.SetStateAction<string>>;
  sortOrder: string;
  refreshing: boolean;
  onRefresh: () => void;
  closeSwipeable: boolean;
};

export default function ProductList({
  products,
  onSetSortOrder,
  sortOrder,
  refreshing = false,
  onRefresh,
  closeSwipeable,
}: Props) {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const colorScheme = useColorScheme();

  return (
    <>
      <View style={styles.sortDropdownContainer}>
        <Menu
          visible={showSortMenu}
          onDismiss={() => setShowSortMenu(false)}
          anchor={
            <Button
              onPress={() => setShowSortMenu(true)}
              icon={({}) => (
                <Icon
                  source="sort-variant"
                  size={25}
                  color={colorScheme === "dark" ? "#fff" : "#000"}
                />
              )}
            >
              {sortOrder}
            </Button>
          }
          anchorPosition="bottom"
        >
          {sortOrder !== "Recently Added" && (
            <Menu.Item
              onPress={() => {
                onSetSortOrder("Recently Added");
                setShowSortMenu(false);
              }}
              title="Recently Added"
            />
          )}
          {sortOrder !== "Title" && (
            <Menu.Item
              onPress={() => {
                onSetSortOrder("Title");
                setShowSortMenu(false);
              }}
              title="Title"
            />
          )}
          {sortOrder !== "Last Modified" && (
            <Menu.Item
              onPress={() => {
                onSetSortOrder("Last Modified");
                setShowSortMenu(false);
              }}
              title="Last Modified"
            />
          )}
        </Menu>
      </View>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <Product
            productId={item.id}
            productName={item.productName}
            brand={item.productBrand}
            warrantyPeriod={item.warrantyPeriod}
            // imgSrc={item.imgSrc}
            dateOfPurchase={item.dateOfPurchase}
            expiryDate={item.dateOfExpiry}
            warrantyDurationType={item.warrantyDurationType}
            price={item.productPrice}
            currencyType={item.currencyType}
            closeSwipeable={closeSwipeable}
            // purchaseLocation={item.purchaseLocation}
            onRefresh={onRefresh}
          />
        )}
        keyExtractor={(item) => item.id}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </>
  );
}

const styles = StyleSheet.create({
  search: {
    alignItems: "center",
  },
  sortDropdownContainer: {
    alignSelf: "flex-end",
  },
});
