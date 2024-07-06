import { useRouter } from "expo-router";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { Button, Icon, IconButton, Text, useTheme } from "react-native-paper";
import VerticalDivider from "../VerticalDivider";
import { useRef, useState } from "react";
import { ref, update } from "firebase/database";
import { auth, database } from "@/firebaseConfig";

type Props = {
  imgSrc?: string;
  brand: string;
  productName: string;
  dateOfPurchase: string;
  expiryDate: string;
  purchaseLocation?: string;
  warrantyPeriod: string;
  warrantyDurationType: string;
  price: string;
  currencyType: string;
  productId: string;
  closeSwipeable: boolean;
  onRefresh: () => void;
};

export default function Product({
  imgSrc = "https://picsum.photos/200",
  brand,
  productName,
  dateOfPurchase,
  expiryDate,
  purchaseLocation,
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

  if (closeSwipeable) {
    swipeableRef.current?.close();
  }

  async function onDelete() {
    const updates: { [key: string]: any } = {};
    updates[`users/${auth.currentUser?.uid}/warranties/${productId}`] = null;

    try {
      await update(ref(database), updates);
      onRefresh();
    } catch (error) {
      //TODO: Deal with deletion error
      console.log(error);
    }
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
                onPress={() => onDelete()}
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
          <Image
            source={{ uri: imgSrc }}
            style={styles.image}
            resizeMode="cover"
          />
          <VerticalDivider />
          <View
            style={[
              styles.productDetails,
              {
                backgroundColor: theme.colors.onSecondary,
              },
            ]}
          >
            <Text style={styles.productName} numberOfLines={2}>
              {productName}
            </Text>
            <Text>Brand: {brand}</Text>
            <Text>Date of Expiry: {expiryDate}</Text>
            <Text>Date of Purchase: {dateOfPurchase}</Text>
            <Text>
              Warranty Period: {warrantyPeriod} {warrantyDurationType}
            </Text>
            <Text>
              Price: {currencyType} {price}
            </Text>
            {purchaseLocation ? <Text>{purchaseLocation}</Text> : null}
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
    // height: 300,
  },
  image: { flex: 1 },
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
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "yellow",
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
});
