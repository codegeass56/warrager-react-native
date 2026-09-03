import { auth } from "@/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, use, useEffect, useState } from "react";

const AuthContext = createContext<{
  user: User | null;
  isLoading: boolean;
}>({
  user: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return <AuthContext value={{ user, isLoading }}>{children}</AuthContext>;
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
