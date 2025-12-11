import FormButton from "@/components/FormComponents/FormButton";
import SectionTitle from "@/components/SectionTitle";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { IconButton } from "react-native-paper";
import ImagePreview from "../../components/ImagePreview";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const { productId, previousScreenName } = useLocalSearchParams<{
    productId: string;
    previousScreenName: string;
  }>();
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "undetermined"
  >("undetermined");
  const cameraRef = useRef<CameraView>(null);
  const [pictureSize, setPictureSize] = useState<string | undefined>();
  const [imageUri, setImageUri] = useState("");
  const [facing, setFacing] = useState<CameraType>("back");

  async function getPictureSizes() {
    setPictureSize("1920x1080");
  }

  async function takePicture() {
    // if (!iosCameraRef.current) return;
    const rawPhoto = await cameraRef.current?.takePictureAsync({
      quality: 0.5,
    });

    if (!rawPhoto) {
      console.log("Error taking picture");
      return;
    }
    const manipulateContext = ImageManipulator.manipulate(rawPhoto.uri);
    let processedImage;
    if (facing === "front") {
      processedImage = await manipulateContext
        .rotate(180)
        .flip("vertical")
        .renderAsync();

      processedImage = await processedImage.saveAsync({
        compress: 0.5,
        format: SaveFormat.JPEG,
      });

      if (!processedImage) {
        console.log("Error flipping picture");
        return;
      }
    } else {
      processedImage = await manipulateContext.renderAsync();
      processedImage = await processedImage.saveAsync({
        compress: 0.5,
        format: SaveFormat.JPEG,
      });
    }

    setImageUri(processedImage.uri);
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  async function getPermissions() {
    await requestPermission();
    setPermissionStatus(permission?.granted ? "granted" : "denied");
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <SectionTitle
          text={`We need your permission to show the camera. ${
            permissionStatus === "denied"
              ? "Please enable the camera permission in the app settings."
              : ""
          }`}
          style={styles.grantPermissionText}
        />
        {permissionStatus === "undetermined" ? (
          <FormButton
            onPress={getPermissions}
            text="Grant Permission"
            style={styles.grantPermissionBtn}
          />
        ) : (
          <FormButton
            onPress={() => Linking.openSettings()}
            text="Open Settings"
            style={styles.grantPermissionBtn}
          />
        )}
      </View>
    );
  }

  return imageUri ? (
    <ImagePreview
      imageUri={imageUri}
      onRetake={setImageUri}
      previousScreenName={previousScreenName}
      productId={productId}
    />
  ) : (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        flash="auto"
        ref={cameraRef}
        onCameraReady={getPictureSizes}
        pictureSize={pictureSize}
        facing={facing}
        autofocus="on"
      />
      <View style={styles.cameraBtnContainer}>
        <View style={styles.emptyView} />
        <View style={styles.captureBtnContainer}>
          <TouchableOpacity
            style={styles.captureBtnTouchable}
            onPress={takePicture}
          >
            <View style={styles.captureBtn} />
          </TouchableOpacity>
        </View>
        <View style={styles.flipBtnContainer}>
          <IconButton
            icon={"camera-flip"}
            size={50}
            iconColor="white"
            onPress={() => setFacing(facing === "back" ? "front" : "back")}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  emptyView: {
    flex: 1,
  },
  captureBtnContainer: {
    flex: 1,
    alignItems: "center",
  },
  flipBtnContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  cameraBtnContainer: {
    flexDirection: "row",
    height: "20%",
    width: "100%",
    backgroundColor: "black",
    justifyContent: "space-between",
    alignItems: "center",
  },
  captureBtnTouchable: {
    backgroundColor: "black",
    borderRadius: 50,
    height: 85,
    width: 85,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "white",
    borderWidth: 4,
  },
  captureBtn: {
    height: 70,
    width: 70,
    borderRadius: 50,
    backgroundColor: "white",
  },
  grantPermissionBtn: {
    borderRadius: 10,
  },
  grantPermissionText: {
    fontSize: 18,
    fontWeight: Platform.OS === "ios" ? "500" : "bold",
    textAlign: "center",
  },
});
