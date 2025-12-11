import { auth, database } from "@/firebaseConfig";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged } from "firebase/auth";
import { child, get, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { PaperProvider, useTheme } from "react-native-paper";
import HomeScreen from "./screens/home/HomeScreen";
import LoadingScreen from "./screens/LoadingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
const randomMC = require("random-material-color");

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

//Done:

/*
  Editing the warranty.

  Back button to go back to home screen.

  Dark Mode.

  Refreshing the list when returning back from the save screen (need to fix the
  list getting stuck on refresh).

  Deleting the warranty.

  Swipe gesture to edit or delete.

  Saving the image to Firebase and retrieving it on the home screen.

  Implement saving the warranty in the EditWarrantyScreen similarly as in
  AddWarrantyScreen.

  Implement deleting the image from storage after deleting warranty.
*/

// Core Features:
/*
 */

// Fixed:
/*
  Fix the image preview not showing in the forms on Android.
  Increase image preview height in AddWarrantyScreen and EditWarrantyScreen.

*/

// Issues:
/*
  Fix render error on adding new warranty. Error seems to be in Product.tsx.
*/

//Testing:
/*
  Test different user flows(with existing account and with new
  account). Check for any errors.
  
  Need to find a robust method of loading different screens in the index file
  of expo router
*/

// QOL Features:
/*
  Improving the UI. 

  Adding a bouncing arrow pointing to the add warranty button on the home screen
  when no products are found.

  Traversing form components with the keyboard 'Next' button.
*/

// Future:
/*
  Push Notifications for expiring warranties.

  User Settings for photo and name.

  App settings with dark mode options for system and manual toggle.

  Select receipt photo from device gallery.

  Image carousel with multiple warranty images.
*/

export default function RootLayout() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notRegistered, setNotRegistered] = useState(false);
  const theme = useTheme();
  const colorScheme = useColorScheme();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          const userId = auth.currentUser?.uid;
          const snapshot = await get(child(ref(database), `users/${userId}`));
          if (!snapshot.exists()) {
            const profileColor = randomMC.getColor();
            await set(ref(database, "users/" + userId), {
              profile_color: profileColor,
            });
          }
          setUserLoggedIn(true);
        } else {
          // User is signed out
          setUserLoggedIn(false);
        }
        setIsLoading(false);
      });
    }, 1000);
  }, []);

  if (userLoggedIn) {
    const userId = auth.currentUser?.uid;
    get(child(ref(database), `users/${userId}`)).then((snapshot) => {
      if (!snapshot.exists()) {
        const profileColor = randomMC.getColor();
        set(ref(database, "users/" + userId), {
          profile_color: profileColor,
        });
      }
    });
  }

  return (
    <PaperProvider>
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              colorScheme === "light"
                ? theme.colors.surface
                : theme.colors.onSurface,
          },
        ]}
      >
        {userLoggedIn && <HomeScreen />}
        {!userLoggedIn && !isLoading && !notRegistered && (
          <LoginScreen onRegister={setNotRegistered} />
        )}
        {isLoading && <LoadingScreen />}
        {notRegistered && <RegisterScreen onLogin={setNotRegistered} />}
        <StatusBar style="auto" />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
