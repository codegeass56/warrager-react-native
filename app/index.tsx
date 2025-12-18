import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        router.navigate("/home");
      } else {
        // User is signed out
        router.navigate("/LoginScreen");
      }
    });
  }, []);

  return null;
}
