import { Platform, StyleSheet, useColorScheme, View } from "react-native";
import { Image } from "expo-image";
import VerticalDivider from "./VerticalDivider";
import { useTheme } from "react-native-paper";
import FormButton from "./FormComponents/FormButton";
import { router } from "expo-router";
import { useEffect } from "react";

type Props = {
  imageUri: string;
  onRetake: React.Dispatch<React.SetStateAction<string>>;
  previousScreenName: string;
  productId?: string;
};

function ImagePreview({
  imageUri,
  onRetake,
  previousScreenName,
  productId,
}: Props) {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj\
    [ayj[j[fQayWCoeoeaya} j[ayfQa{oLj ? j[WVj[ayayj[fQoff7azayj[ayj[j[\
    ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <View
      style={[
        styles.imagePreviewContainer,
        {
          backgroundColor:
            colorScheme === "light"
              ? theme.colors.surface
              : theme.colors.onSurface,
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={imageUri}
          placeholder={blurhash}
          contentFit="contain"
        />
      </View>
      <View style={styles.imagePreviewBtnContainer}>
        <View style={styles.retakeBtnContainer}>
          <FormButton
            text="Retake"
            onPress={() => onRetake("")}
            mode="contained"
            style={styles.retakeBtn}
          />
        </View>
        <VerticalDivider />

        <View style={styles.doneBtnContainer}>
          <FormButton
            text="Done"
            onPress={() => {
              // Pass and merge params back to home screen
              if (previousScreenName === "AddWarrantyScreen") {
                router.navigate({
                  pathname: "/screens/home/add-warranty/AddWarrantyScreen",
                  params: { imageUri: imageUri },
                });
              } else if (previousScreenName === "EditWarrantyScreen") {
                router.navigate({
                  pathname: `/screens/home/edit-warranty/${productId}`,
                  params: { imageUri: imageUri },
                });
              }
            }}
            mode="contained"
            style={styles.doneBtn}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  closeBtnContainer: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  imagePreviewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: Platform.OS === "ios" ? 50 : 35,
  },
  imageContainer: {
    flex: 10,
    width: "100%",
  },
  image: {
    flex: 1,
  },
  imagePreviewBtnContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
  },
  retakeBtnContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: "center",
  },
  retakeBtn: {
    borderRadius: 10,
  },
  doneBtnContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: "center",
  },
  doneBtn: {
    borderRadius: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

export default ImagePreview;
