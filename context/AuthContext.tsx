import { auth, database } from "@/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { child, get, ref } from "firebase/database";
import { createContext, use, useEffect, useState } from "react";

const AuthContext = createContext<{
  user: User | null;
  isLoading: boolean;
  profileColor: string;
}>({
  user: null,
  isLoading: true,
  profileColor: "red",
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profileColor, setProfileColor] = useState("red");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        setUser(user);
        try {
          const snapshot = await get(
            child(ref(database), `users/${user.uid}/profile_color`),
          );
          setProfileColor(snapshot.exists() ? snapshot.val() : "red");
        } catch (e) {
          //TODO: Show toast to user
          console.error(e);
          setProfileColor("red");
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext value={{ user, isLoading, profileColor }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useAuth must be wrapped in a <AuthProvider />");
  }

  return value;
}

//Three things
//1. Context
//2. Provider
//function to for accessing the context with useContext

// export default function App() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         // User is signed in
//         router.replace("/home");
//       } else {
//         // User is signed out
//         router.replace("/LoginScreen");
//       }
//       setIsLoading(false);
//     });

//     return unsubscribe;
//   }, [router]);

//   if (isLoading) {
//     return <SplashScreenComponent />;
//   }

//   return null;
// }
