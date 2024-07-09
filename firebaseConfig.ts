import { initializeApp } from "firebase/app";
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDUnjz3QSbXbNyZOrsGI-WkvyAXr3mMpIk",
  authDomain: "warrager-2bb2e.firebaseapp.com",
  projectId: "warrager-2bb2e",
  storageBucket: "warrager-2bb2e.appspot.com",
  messagingSenderId: "473374145367",
  appId: "1:473374145367:web:a6df46528034e724a75c12",
  databaseURL:
    "https://warrager-2bb2e-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
// const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { auth, database };
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
