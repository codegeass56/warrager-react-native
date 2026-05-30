import SplashScreenComponent from "@/components/SplashScreenComponent";
import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function App() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        router.replace("/home");
      } else {
        // User is signed out
        router.replace("/LoginScreen");
      }
      setIsLoading(false);
    });
  }, [router]);

  if (isLoading) {
    return <SplashScreenComponent />;
  }

  return null;
}
