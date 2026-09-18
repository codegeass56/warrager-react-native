import { useAuth } from "@/context/AuthContext";
import { database } from "@/firebaseConfig";
import { useNavigation } from "expo-router";
import { child, get, ref } from "firebase/database";
import { useCallback, useEffect, useState } from "react";

export function useWarrantyList() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [productsList, setProductsList] = useState<Product[] | null>(null);
  const [refreshingProductList, setRefreshingProductList] = useState(false);
  const [brands, setBrands] = useState<BrandObj>({});
  const [closeSwipeable, setCloseSwipeable] = useState(false);

  const buildProductsFromSnapshot = (snapshotVal: any): Product[] | null => {
    if (!snapshotVal?.warranties) return null;
    return Object.keys(snapshotVal.warranties).map((key) => ({
      id: key,
      ...snapshotVal.warranties[key],
    }));
  };

  const deriveBrands = (
    products: Product[],
    prevBrands: BrandObj,
  ): BrandObj => {
    const nextBrands: BrandObj = {};
    products.forEach((product) => {
      nextBrands[product.productBrand] =
        prevBrands[product.productBrand] ?? false;
    });
    return nextBrands;
  };

  const getProducts = useCallback(() => {
    if (!user?.uid) return;

    setRefreshingProductList(true);
    get(child(ref(database), `users/${user.uid}`))
      .then((snapshot) => {
        const fetchedProducts = buildProductsFromSnapshot(snapshot.val());
        setProductsList(fetchedProducts);
        setBrands((prev) => deriveBrands(fetchedProducts ?? [], prev));
      })
      .catch((error) => {
        //TODO: Pass error to custom error screen
        console.error(error);
      })
      .finally(() => {
        setRefreshingProductList(false);
        setCloseSwipeable(false);
      });
  }, [user?.uid]);

  useEffect(() => {
    if (isInitialMount) return;
    const unsubscribe = navigation.addListener("focus", () => {
      setCloseSwipeable(true);
      requestAnimationFrame(() => {
        getProducts();
      });
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, getProducts, isInitialMount]);

  useEffect(() => {
    function getProfileData() {
      if (!user?.uid) return;

      setIsFetching(true);
      get(child(ref(database), `users/${user.uid}`))
        .then((snapshot) => {
          const fetchedProducts = buildProductsFromSnapshot(snapshot.val());
          setProductsList(fetchedProducts);
          setBrands((prev) => deriveBrands(fetchedProducts ?? [], prev));
        })
        .catch((error) => {
          //TODO: Pass error to custom error screen
          console.error(error);
        })
        .finally(() => {
          setIsInitialMount(false);
          setIsFetching(false);
        });
    }
    getProfileData();
  }, [user?.uid]);

  useEffect(() => {
    if (isInitialMount) return;
    const unsubscribe = navigation.addListener("focus", () => {
      setCloseSwipeable(true);
      requestAnimationFrame(() => {
        getProducts();
      });
    });
    return unsubscribe;
  }, [navigation, getProducts, isInitialMount]);

  return {
    productsList,
    brands,
    setBrands,
    isFetching,
    refreshingProductList,
    closeSwipeable,
    getProducts,
  };
}
