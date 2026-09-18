import HeaderAndAccountMenu from "@/components/HeaderAndAccountMenu";
import BrandsSkeleton from "@/components/HomeScreen/BrandsSkeleton";
import Filter from "@/components/HomeScreen/Filter";
import ProductList from "@/components/HomeScreen/ProductList";
import ProductListSkeleton from "@/components/HomeScreen/ProductListSkeleton";
import SearchBar from "@/components/HomeScreen/SearchBar";
import SectionTitle from "@/components/SectionTitle";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/firebaseConfig";
import { useWarrantyList } from "@/hooks/useWarrantyList";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Platform, StyleSheet, useColorScheme, View } from "react-native";
import { FAB, useTheme } from "react-native-paper";

function HomeScreen() {
  const { profileColor, user } = useAuth();
  const [sortOrder, setSortOrder] = useState("Recently Added");
  const {
    productsList,
    brands,
    setBrands,
    isFetching,
    refreshingProductList,
    closeSwipeable,
    getProducts,
  } = useWarrantyList();

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });
  const searchQuery = watch("search");
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = useTheme();

  //TODO: Handle error when avatar label doesn't load
  const avatarLabel =
    user?.displayName?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "Er";

  async function onLogout() {
    try {
      await signOut(auth);
    } catch (e) {
      {
        /*//TODO: Show toast to user with error */
      }

      console.log("There was a problem signing out.", e);
    }
  }
  let searchedProducts: Product[] = productsList ? productsList.slice() : [];

  if (searchQuery !== "") {
    const query = searchQuery.toLowerCase().trim();
    searchedProducts = searchedProducts.filter(
      (p) =>
        p.productName.toLowerCase().trim().includes(query) ||
        p.productBrand.toLowerCase().trim().includes(query) ||
        p.productPrice.includes(searchQuery.trim()),
    );
  }

  const uniqueBrands = Array.from(
    new Set(searchedProducts.map((p) => p.productBrand)),
  );

  if (Object.values(brands).some((b) => b === true)) {
    searchedProducts = searchedProducts.filter(
      (product) => brands[product.productBrand] === true,
    );
  }

  const sortFns: Record<string, (p1: Product, p2: Product) => number> = {
    "Recently Added": (p1, p2) =>
      new Date(p2.dateCreated).getTime() - new Date(p1.dateCreated).getTime(),
    Title: (p1, p2) => p1.productName.localeCompare(p2.productName),
    "Last Modified": (p1, p2) =>
      new Date(p2.dateModified).getTime() - new Date(p1.dateModified).getTime(),
  };
  searchedProducts.sort(sortFns[sortOrder]);

  // if (isInitialMount) {
  //   return <SplashScreenComponent />;
  // }
  const hasNoProducts = productsList === null && searchQuery === "";
  const hasNoSearchResults =
    searchQuery !== "" && searchedProducts.length === 0;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.container}>
        <HeaderAndAccountMenu
          avatarLabel={avatarLabel}
          profileColor={profileColor}
          onLogout={onLogout}
        />
        <View style={styles.searchFilterContainer}>
          <SearchBar control={control} />
          {isFetching ? (
            <BrandsSkeleton />
          ) : (
            <Filter
              uniqueBrandNames={uniqueBrands}
              onFilter={setBrands}
              activeBrands={brands}
            />
          )}
        </View>
        {isFetching ? (
          <ProductListSkeleton />
        ) : hasNoProducts ? (
          <View style={styles.noProductsTextContainer}>
            <SectionTitle
              text="No products yet? Try adding one!"
              style={styles.noProductsText}
            />
          </View>
        ) : hasNoSearchResults ? (
          <View style={styles.noProductsTextContainer}>
            <SectionTitle
              text={`No products found matching "${searchQuery}"`}
              style={styles.noProductsText}
            />
          </View>
        ) : (
          <ProductList
            products={searchedProducts}
            onSetSortOrder={setSortOrder}
            sortOrder={sortOrder}
            refreshing={refreshingProductList}
            onRefresh={getProducts}
            closeSwipeable={closeSwipeable}
          />
        )}
        <FAB
          icon="plus"
          style={[
            styles.fab,
            {
              backgroundColor: colorScheme === "dark" ? "white" : "#1F41BB",
            },
          ]}
          onPress={() => router.push("/(home)/add-warranty/AddWarrantyScreen")}
          color={colorScheme === "dark" ? "#031525" : "white"}
          mode="elevated"
          label="Product Warranty"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 30,
  },
  searchFilterContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    gap: 10,
    marginTop: 30,
    marginBottom: 30,
  },
  noProductsTextContainer: {
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  noProductsText: {
    fontSize: 20,
    fontWeight: Platform.OS === "ios" ? "500" : "bold",
  },
});

export default HomeScreen;
