import HeaderAndAccountMenu from "@/components/HeaderAndAccountMenu";
import Filter from "@/components/HomeScreen/Filter";
import ProductList from "@/components/HomeScreen/ProductList";
import SearchBar from "@/components/HomeScreen/SearchBar";
import SectionTitle from "@/components/SectionTitle";
import { auth, database } from "@/firebaseConfig";
import { useNavigation, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { child, get, ref } from "firebase/database";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Platform, StyleSheet, useColorScheme, View } from "react-native";
import { FAB, useTheme } from "react-native-paper";
import SplashScreenComponent from "../../components/SplashScreenComponent";

function HomeScreen() {
  const [profileColor, setProfileColor] = useState("red");
  const [isInitialMount, setIsInitialMount] = useState(true);
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
  const theme = useTheme();
  const currentUser = auth.currentUser;

  //TODO: Handle error when avatar label doesn't load
  const avatarLabel =
    currentUser?.displayName?.charAt(0).toUpperCase() ||
    currentUser?.email?.charAt(0).toUpperCase() ||
    "Er";
  let searchedProducts: Product[] = productsList.slice();
  let uniqueBrands: string[];

  useEffect(() => {
    console.log(brands);
  }, [brands]);

  const getProducts = useCallback(() => {
    if (!currentUser?.uid) return;

    setCloseSwipeable(true);
    setRefreshingProductList(true);
    get(child(ref(database), `users/${currentUser.uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          if (snapshot.val().warranties) {
            const fetchedProducts: Product[] = Object.keys(
              snapshot.val().warranties,
            ).map((key) => {
              return {
                id: key,
                ...snapshot.val().warranties[key],
              };
            });
            setProductsList(fetchedProducts);
            setBrands((prevBrands) => {
              const nextBrands: BrandObj = {};
              fetchedProducts.forEach((product) => {
                const brandName = product.productBrand;
                nextBrands[brandName] = prevBrands[brandName] ?? false;
              });
              return nextBrands;
            });
          } else {
            setProductsList([]);
            setBrands({});
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
  }, [currentUser?.uid]);

  useEffect(() => {
    if (isInitialMount) return;
    const unsubscribe = navigation.addListener("focus", () => {
      getProducts();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, getProducts, isInitialMount]);

  useEffect(() => {
    function getProfileData() {
      if (!currentUser?.uid) return;

      get(child(ref(database), `users/${currentUser.uid}`))
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
            const fetchedProducts = Object.keys(snapshot.val().warranties).map(
              (key) => {
                return {
                  id: key,
                  ...snapshot.val().warranties[key],
                };
              },
            );
            setProductsList(fetchedProducts);
            const derivedBrands = fetchedProducts.reduce(
              (acc: BrandObj, product) => {
                if (!acc[product.productBrand]) {
                  acc[product.productBrand] = false;
                }
                return acc;
              },
              {},
            );
            setBrands(derivedBrands);
          }
        })
        .catch((error) => {
          //TODO: Pass error to custom error screen
          console.error(error);
        })
        .finally(() => {
          setIsInitialMount(false);
        });
    }
    getProfileData();
  }, [currentUser?.uid]);

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

  function getUniqueBrands(products: Product[]): string[] {
    const brandSet: Set<string> = new Set();
    products.forEach((product) => {
      if (!brandSet.has(product.productBrand)) {
        brandSet.add(product.productBrand);
      }
    });
    return Array.from(brandSet);
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
        p.productPrice.includes(searchQuery.trim()),
    );
    uniqueBrands = getUniqueBrands(searchedProducts);
  } else {
    uniqueBrands = getUniqueBrands(productsList); //update name of uniqueProducts and function name
  }

  if (sortOrder === "Recently Added") {
    searchedProducts.sort((p1, p2) => {
      return (
        new Date(p2.dateCreated).getTime() - new Date(p1.dateCreated).getTime()
      );
    });
  } else if (sortOrder === "Title") {
    searchedProducts.sort((p1, p2) =>
      p1.productName.localeCompare(p2.productName),
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
      (product) => brands[product.productBrand] === true,
    );
  }

  if (isInitialMount) {
    return <SplashScreenComponent />;
  }

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
          <Filter brands={uniqueBrands} onFilter={setBrands} />
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
              backgroundColor: colorScheme === "dark" ? "white" : "#1F41BB",
            },
          ]}
          onPress={() => router.push("/home/add-warranty/AddWarrantyScreen")}
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
