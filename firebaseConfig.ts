import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
// @ts-ignore
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUnjz3QSbXbNyZOrsGI-WkvyAXr3mMpIk",
  authDomain: "warrager-2bb2e.firebaseapp.com",
  databaseURL:
    "https://warrager-2bb2e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "warrager-2bb2e",
  storageBucket: "warrager-2bb2e.appspot.com",
  messagingSenderId: "473374145367",
  appId: "1:473374145367:web:a6df46528034e724a75c12",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
// const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
const storage = getStorage();

export { auth, database, storage };
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
