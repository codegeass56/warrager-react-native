import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  GestureUpdateEvent,
  PinchGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { IconButton } from "react-native-paper";
import ImagePreview from "../../components/ImagePreview";
import { FlipType, manipulateAsync, SaveFormat } from "expo-image-manipulator";
import FormButton from "@/components/FormComponents/FormButton";
import SectionTitle from "@/components/SectionTitle";
import { useLocalSearchParams } from "expo-router";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const params = useLocalSearchParams();
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "undetermined"
  >("undetermined");
  const cameraRef = useRef<CameraView>(null);
  const [pictureSize, setPictureSize] = useState<string | undefined>();
  const [zoom, setZoom] = useState(0);
  const [lastZoom, setLastZoom] = useState(0);
  const [imageUri, setImageUri] = useState("");
  const [facing, setFacing] = useState<CameraType>("back");

  const onPinch = useCallback(
    (e: GestureUpdateEvent<PinchGestureHandlerEventPayload>) => {
      const velocity = e.velocity / 20;
      const outFactor = lastZoom * (Platform.OS === "ios" ? 40 : 15);
      let newZoom =
        velocity > 0
          ? zoom + e.scale * velocity * (Platform.OS === "ios" ? 0.01 : 50)
          : zoom -
            e.scale *
              (outFactor || 1) *
              Math.abs(velocity) *
              (Platform.OS === "ios" ? 0.02 : 50);

      if (newZoom < 0) newZoom = 0;
      else if (newZoom > 1) newZoom = 1;

      setZoom(newZoom);
    },
    [zoom, setZoom, lastZoom, setLastZoom]
  );

  const onPinchEnd = useCallback(() => {
    setLastZoom(zoom);
  }, [zoom, setLastZoom]);

  const pinchGesture = useMemo(
    () => Gesture.Pinch().onUpdate(onPinch).onEnd(onPinchEnd),
    [onPinch, onPinchEnd]
  );

  async function getPictureSizes() {
    if (!cameraRef.current) return;
    const pictureSizes =
      await cameraRef.current.getAvailablePictureSizesAsync();
    if (Platform.OS === "android") {
      setPictureSize(pictureSizes[0]);
    } else {
      setPictureSize("High");
    }
  }

  async function takePicture() {
    if (!cameraRef.current) return;
    let photo = await cameraRef.current.takePictureAsync();

    if (!photo) {
      console.log("Error taking picture");
      return;
    }

    if (facing === "front") {
      photo = await manipulateAsync(
        photo.uri,
        [{ rotate: 180 }, { flip: FlipType.Vertical }],
        { compress: 1, format: SaveFormat.PNG }
      );
      if (!photo) {
        console.log("Error flipping picture");
        return;
      }
    }

    setImageUri(photo.uri);
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
      previousScreenName={params["previousScreenName"] as string}
      productId={params["productId"] as string}
    />
  ) : (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={pinchGesture}>
        <CameraView
          style={styles.camera}
          mode="picture"
          flash="auto"
          ref={cameraRef}
          onCameraReady={getPictureSizes}
          pictureSize={pictureSize}
          zoom={zoom}
          facing={facing}
        >
          <View />
        </CameraView>
      </GestureDetector>
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
    </GestureHandlerRootView>
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
