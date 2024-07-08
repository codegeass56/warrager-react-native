import SearchBar from "@/components/HomeScreen/SearchBar";
import ProductList from "@/components/HomeScreen/ProductList";
import Filter from "@/components/HomeScreen/Filter";
import { auth, database } from "@/firebaseConfig";
import { useNavigation, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { child, get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, useColorScheme, View } from "react-native";
import { FAB, PaperProvider } from "react-native-paper";
import LoadingScreen from "../LoadingScreen";
import { useForm } from "react-hook-form";
import HeaderAndAccountMenu from "@/components/HeaderAndAccountMenu";
import SectionTitle from "@/components/SectionTitle";

function HomeScreen() {
  const [profileColor, setProfileColor] = useState("red");
  const [isFetchingProducts, setIsFetchingProducts] = useState(true);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [refreshingProductList, setRefreshingProductList] = useState(false);
  const [brands, setBrands] = useState<BrandObj>({});
  const [sortOrder, setSortOrder] = useState("Recently Added");
  const [closeSwipeable, setCloseSwipeable] = useState(false);

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });
  const searchQuery = watch("search");
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const currentUser = auth.currentUser;

  //TODO: Handle error when avatar label doesn't load
  const avatarLabel =
    currentUser?.displayName?.charAt(0).toUpperCase() ||
    currentUser?.email?.charAt(0).toUpperCase() ||
    "Er";
  let searchedProducts: Product[] = productsList.slice();
  let uniqueProducts: Product[];

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getProducts();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  function getProducts() {
    setCloseSwipeable(true);
    setRefreshingProductList(true);
    get(child(ref(database), `users/${currentUser?.uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          if (snapshot.val().warranties) {
            setProductsList(
              Object.keys(snapshot.val().warranties).map((key) => {
                return {
                  id: key,
                  ...snapshot.val().warranties[key],
                };
              })
            );
          } else {
            setProductsList([]);
          }
        } else {
          //TODO: Pass error to custom error screen
          console.log("No data available");
        }
      })
      .catch((error) => {
        //TODO: Pass error to custom error screen
        console.error(error);
      })
      .finally(() => {
        setRefreshingProductList(false);
        setCloseSwipeable(false);
      });
  }

  useEffect(() => {
    function getProfileData() {
      get(child(ref(database), `users/${currentUser?.uid}`))
        .then((snapshot) => {
          if (!snapshot.val()) {
            //TODO: Pass error to custom error screen
            console.log("No data available");
            return;
          }

          if (snapshot.val().profile_color) {
            setProfileColor(snapshot.val().profile_color);
          } else {
            //TODO: Show toast to user
            console.log("Profile color unavailable");
            setProfileColor("red");
          }

          if (snapshot.val().warranties) {
            setProductsList(
              Object.keys(snapshot.val().warranties).map((key) => {
                return {
                  id: key,
                  ...snapshot.val().warranties[key],
                };
              })
            );
            setBrands(
              productsList.slice().reduce((acc: BrandObj, product) => {
                if (!acc[product.productBrand]) {
                  acc[product.productBrand] = false;
                }
                return acc;
              }, {})
            );
          }
        })
        .catch((error) => {
          //TODO: Pass error to custom error screen
          console.error(error);
        })
        .finally(() => {
          setIsFetchingProducts(false);
        });
    }
    getProfileData();
  }, []);

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

  function getUniqueBrandsWithId(products: Product[]) {
    const brandSet: Set<string> = new Set();
    return products.filter((product) => {
      if (!brandSet.has(product.productBrand)) {
        brandSet.add(product.productBrand);
        return true;
      }

      return false;
    });
  }

  if (searchQuery !== "") {
    searchedProducts = searchedProducts.filter(
      (p) =>
        p.productName
          .toLowerCase()
          .trim()
          .includes(searchQuery.toLowerCase().trim()) ||
        p.productBrand
          .toLowerCase()
          .trim()
          .includes(searchQuery.toLowerCase().trim()) ||
        p.productPrice.includes(searchQuery.trim())
    );
    uniqueProducts = getUniqueBrandsWithId(searchedProducts);
  } else {
    uniqueProducts = getUniqueBrandsWithId(productsList);
  }

  if (sortOrder === "Recently Added") {
    searchedProducts.sort((p1, p2) => {
      return (
        new Date(p2.dateCreated).getTime() - new Date(p1.dateCreated).getTime()
      );
    });
  } else if (sortOrder === "Title") {
    searchedProducts.sort((p1, p2) =>
      p1.productName.localeCompare(p2.productName)
    );
  } else if (sortOrder === "Last Modified") {
    searchedProducts.sort((p1, p2) => {
      return (
        new Date(p2.dateModified).getTime() -
        new Date(p1.dateModified).getTime()
      );
    });
  }

  if (Object.values(brands).some((brand) => brand === true)) {
    searchedProducts = searchedProducts.filter(
      (product) => brands[product.productBrand] === true
    );
  }

  return (
    <PaperProvider>
      {isFetchingProducts ? <LoadingScreen /> : null}
      {!isFetchingProducts ? (
        <View style={styles.container}>
          <HeaderAndAccountMenu
            avatarLabel={avatarLabel}
            profileColor={profileColor}
            onLogout={onLogout}
          />
          <View style={styles.searchFilterContainer}>
            <SearchBar control={control} />
            <Filter products={uniqueProducts} onFilter={setBrands} />
          </View>
          {searchedProducts.length === 0 ? (
            <View style={styles.noProductsTextContainer}>
              <SectionTitle
                text="No products yet? Try adding one!"
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
                backgroundColor: colorScheme === "dark" ? "#a9a5e2" : "white",
              },
            ]}
            onPress={() =>
              router.push("/screens/home/add-warranty/AddWarrantyScreen")
            }
            color={colorScheme === "dark" ? "black" : "#1F41BB"}
            mode="elevated"
            label="Product Warranty"
          />
        </View>
      ) : null}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 75,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 30,
  },
  searchFilterContainer: {
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
    gap: 10,
    marginTop: 30,
    marginBottom: 15,
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
