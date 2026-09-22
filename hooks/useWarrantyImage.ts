import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

export function useWarrantyImage(screenName: string, productId?: string) {
  const [imageUri, setImageUri] = useState("");
  const params = useLocalSearchParams<{ imageUri: string }>();
  const router = useRouter();

  useEffect(() => {
    function setImageURIFromParams() {
      if (
        Object.hasOwn(params, "imageUri") &&
        params["imageUri"] &&
        params["imageUri"] !== "undefined"
      ) {
        setImageUri(params["imageUri"]);
      }
    }
    setImageURIFromParams();
  }, [params]);

  const openCamera = useCallback(() => {
    router.navigate({
      pathname: `/(home)/CameraScreen`,
      params: {
        previousScreenName: screenName,
        ...(productId ? { productId } : {}),
      },
    });
  }, [router, screenName, productId]);

  const removeImage = useCallback(() => {
    router.setParams({ imageUri: undefined });
    setImageUri("");
  }, [router]);

  return { imageUri, setImageUri, openCamera, removeImage };
}
