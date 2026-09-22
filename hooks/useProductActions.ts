// hooks/useProductActions.ts   → onDelete, showDeleteConfirmation
// Product.tsx                  → pure display + swipeable wrapper, calls the hook
import { useAuth } from "@/context/AuthContext";
import { database, storage } from "@/firebaseConfig";
import { ref as dbRefMethod, update } from "firebase/database";
import { deleteObject, ref as storageRefMethod } from "firebase/storage";
import { useCallback } from "react";
import { Alert } from "react-native";

export function useProductActions(
  productId: string,
  onRefresh: () => void,
  imgSrc?: string,
) {
  const { user } = useAuth();

  const deleteWarranty = useCallback(async () => {
    const updates: { [key: string]: any } = {};
    updates[`users/${user?.uid}/warranties/${productId}`] = null;
    let storageRef = storageRefMethod(
      storage,
      `${user?.uid}/images/${productId}`,
    );
    try {
      const updateTask = update(dbRefMethod(database), updates);
      const deletionTask = deleteObject(storageRef);
      if (imgSrc) {
        await Promise.all([updateTask, deletionTask]);
      } else {
        await updateTask;
      }
      onRefresh();
    } catch (error) {
      //TODO: Deal with deletion error
      console.log(error);
    }
  }, [productId, user?.uid, imgSrc, onRefresh]);

  const showDeleteConfirmation = useCallback(() => {
    Alert.alert(
      "Are you sure you want to delete this warranty?",
      "This action cannot be undone.",
      [
        {
          text: "Confirm",
          onPress: deleteWarranty,
        },
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
      ],
    );
  }, [deleteWarranty]);

  return { showDeleteConfirmation };
}
