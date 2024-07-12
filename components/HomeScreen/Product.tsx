import { useRouter } from "expo-router";
import { Alert, StyleSheet, useColorScheme, View } from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { Icon, IconButton, Text, useTheme } from "react-native-paper";
import VerticalDivider from "../VerticalDivider";
import { useRef, useState } from "react";
import { ref as dbRefMethod, update } from "firebase/database";
import { auth, database, storage } from "@/firebaseConfig";
import { deleteObject, ref as storageRefMethod } from "firebase/storage";
import { Image } from "expo-image";
import SectionTitle from "../SectionTitle";

type Props = {
  imgSrc?: string;
  brand: string;
  productName: string;
  dateOfPurchase: string;
  expiryDate: string;
  warrantyPeriod: string;
  warrantyDurationType: string;
  price: string;
  currencyType: string;
  productId: string;
  closeSwipeable: boolean;
  onRefresh: () => void;
};

export default function Product({
  imgSrc,
  brand,
  productName,
  dateOfPurchase,
  expiryDate,
  warrantyPeriod,
  warrantyDurationType,
  price,
  currencyType,
  productId,
  closeSwipeable,
  onRefresh,
}: Props) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const swipeableRef = useRef<Swipeable>(null);
  const currentUser = auth.currentUser;

  if (closeSwipeable) {
    swipeableRef.current?.close();
  }

  async function onDelete() {
    const updates: { [key: string]: any } = {};
    updates[`users/${auth.currentUser?.uid}/warranties/${productId}`] = null;
    let storageRef = storageRefMethod(
      storage,
      `${currentUser?.uid}/images/${productId}`
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
  }

  function showDeleteConfirmation() {
    Alert.alert(
      "Are you sure you want to delete this warranty?",
      "This action cannot be undone.",
      [
        {
          text: "Confirm",
          onPress: onDelete,
        },
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
      ]
    );
  }

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={() => {
          return (
            <View style={styles.rightActions}>
              <IconButton
                icon="pencil"
                size={40}
                onPress={() =>
                  router.push(`/screens/home/edit-warranty/${productId}`)
                }
                iconColor="white"
                style={[
                  styles.editIcon,
                  {
                    backgroundColor:
                      colorScheme === "light" ? "#007AFF" : "#2094FA",
                  },
                ]}
              />
              <IconButton
                icon="trash-can"
                size={40}
                onPress={showDeleteConfirmation}
                iconColor="white"
                style={[
                  styles.trashIcon,
                  {
                    backgroundColor:
                      colorScheme === "light" ? "#F63428" : "#FF3B30",
                  },
                ]}
              />
            </View>
          );
        }}
        overshootLeft={true}
        overshootFriction={5}
      >
        <View style={styles.container}>
          {imgSrc ? (
            <Image
              source={{ uri: imgSrc }}
              style={styles.image}
              contentFit="cover"
            />
          ) : (
            <View
              style={[
                styles.noImageContainer,
                {
                  backgroundColor:
                    colorScheme === "light"
                      ? theme.colors.onSecondary
                      : "#0d2136",
                },
              ]}
            >
              <View style={styles.noImage}>
                <SectionTitle
                  text="No Image Provided"
                  style={styles.noImageText}
                />
                <Icon source={"close"} size={40} color="red" />
              </View>
            </View>
          )}
          <VerticalDivider />
          <View
            style={[
              styles.productDetails,
              {
                backgroundColor:
                  colorScheme === "light"
                    ? theme.colors.onSecondary
                    : "#0d2136",
              },
            ]}
          >
            <Text
              style={[
                styles.productName,
                { color: colorScheme === "light" ? "#000" : "#7cacf8" },
              ]}
              numberOfLines={2}
            >
              {productName}
            </Text>
            <Text
              style={{ color: colorScheme === "light" ? "#000" : "#7cacf8" }}
            >
              Brand: {brand}
            </Text>
            <Text
              style={{ color: colorScheme === "light" ? "#000" : "#7cacf8" }}
            >
              Date of Expiry: {expiryDate}
            </Text>
            <Text
              style={{ color: colorScheme === "light" ? "#000" : "#7cacf8" }}
            >
              Date of Purchase: {dateOfPurchase}
            </Text>
            <Text
              style={{ color: colorScheme === "light" ? "#000" : "#7cacf8" }}
            >
              Warranty Period: {warrantyPeriod} {warrantyDurationType}
            </Text>
            <Text
              style={{ color: colorScheme === "light" ? "#000" : "#7cacf8" }}
            >
              Price: {currencyType} {price}
            </Text>
          </View>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    overflow: "scroll",
    width: "100%",
    height: 300,
  },
  image: { flex: 1 },
  noImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productDetails: {
    justifyContent: "center",
    gap: 10,
    flex: 1,
    padding: 20,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginBottom: 10,
    width: "100%",
    textAlign: "center",
    color: "#7cacf8",
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  editIcon: {
    height: "100%",
    borderRadius: 0,
    margin: 0,
    width: 70,
  },
  trashIcon: {
    height: "100%",
    borderRadius: 0,
    margin: 0,
    width: 70,
  },
  textColor: {
    color: "#7cacf8",
  },
});
