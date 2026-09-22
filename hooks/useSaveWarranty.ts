import {
  BRAND_FIELD_NAME,
  CURRENCY_FIELD_NAME,
  DATE_FIELD_NAME,
  PRODUCT_NAME_FIELD_NAME,
  PRODUCT_PRICE_FIELD_NAME,
  STORE_CONTACT_FIELD_NAME,
  STORE_EMAIL_FIELD_NAME,
  STORE_NAME_FIELD_NAME,
  WARRANTY_DURATION_TYPE_FIELD_NAME,
  WARRANTY_PERIOD_FIELD_NAME,
  type FormData,
} from "@/constants/formFields";
import { useAuth } from "@/context/AuthContext";
import { database, storage } from "@/firebaseConfig";
import * as Localization from "expo-localization";
import { useRouter } from "expo-router";
import { child, ref as dbRefMethod, push, update } from "firebase/database";
import {
  deleteObject,
  getDownloadURL,
  ref as storageRefMethod,
  uploadBytes,
} from "firebase/storage";
import { useCallback, useState } from "react";

function calculateExpiryDate(
  purchaseDate: Date,
  period: number,
  durationType: string,
): number {
  const date = new Date(purchaseDate.getTime());
  switch (durationType) {
    case "Years":
      return date.setFullYear(date.getFullYear() + period);
    case "Months":
      return date.setMonth(date.getMonth() + period);
    case "Days":
      return date.setDate(date.getDate() + period);
    default:
      return date.getTime();
  }
}

function formatDate(date: number | Date | Intl.FormattableTemporalObject) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: Localization.getCalendars()[0].timeZone!,
  }).format(date);
}

// productId present = edit mode (reuse key, preserve dateCreated, allow image deletion)
// productId absent = add mode (generate key, set dateCreated fresh)
export function useSaveWarranty(productId?: string) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const saveWarranty = useCallback(
    async (data: FormData, imageUri: string) => {
      const dateOfPurchase = new Date(data[DATE_FIELD_NAME].getTime());
      const warrantyPeriod = Number(data[WARRANTY_PERIOD_FIELD_NAME]);
      const dateOfExpiry = calculateExpiryDate(
        dateOfPurchase,
        warrantyPeriod,
        data[WARRANTY_DURATION_TYPE_FIELD_NAME],
      );

      const warrantyKey =
        productId ?? push(child(dbRefMethod(database), "warranties")).key;

      const warrantyData: Record<string, any> = {
        [PRODUCT_NAME_FIELD_NAME]: data[PRODUCT_NAME_FIELD_NAME],
        [DATE_FIELD_NAME]: formatDate(data[DATE_FIELD_NAME]),
        dateOfExpiry: formatDate(dateOfExpiry),
        [CURRENCY_FIELD_NAME]: data[CURRENCY_FIELD_NAME],
        [PRODUCT_PRICE_FIELD_NAME]: data[PRODUCT_PRICE_FIELD_NAME],
        [WARRANTY_PERIOD_FIELD_NAME]: data[WARRANTY_PERIOD_FIELD_NAME],
        [WARRANTY_DURATION_TYPE_FIELD_NAME]:
          data[WARRANTY_DURATION_TYPE_FIELD_NAME],
        [BRAND_FIELD_NAME]: data[BRAND_FIELD_NAME],
        [STORE_NAME_FIELD_NAME]: data[STORE_NAME_FIELD_NAME],
        [STORE_EMAIL_FIELD_NAME]: data[STORE_EMAIL_FIELD_NAME],
        [STORE_CONTACT_FIELD_NAME]: data[STORE_CONTACT_FIELD_NAME],
        dateCreated: productId ? data.dateCreated : new Date(),
        dateModified: new Date(),
        imageUrl: "",
      };

      try {
        setIsLoading(true);
        const storageRef = storageRefMethod(
          storage,
          `${user?.uid}/images/${warrantyKey}`,
        );

        if (imageUri !== "") {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          await uploadBytes(storageRef, blob);
          warrantyData.imageUrl = await getDownloadURL(storageRef);
        } else if (productId) {
          const hasImage = await getDownloadURL(storageRef)
            .then(() => true)
            .catch(() => false);
          if (hasImage) await deleteObject(storageRef);
        }

        const updates: { [key: string]: any } = {};
        updates[`/users/${user?.uid}/warranties/${warrantyKey}`] = warrantyData;
        await update(dbRefMethod(database), updates);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
        router.back();
      }
    },
    [productId, user?.uid, router],
  );

  return { isLoading, saveWarranty };
}
