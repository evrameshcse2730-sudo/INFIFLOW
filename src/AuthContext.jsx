
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAdmin(false);
      setLoading(true);

      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const adminRef = doc(db, "admins", currentUser.uid);
        const adminSnap = await getDoc(adminRef);

        // Debug information
        console.log("Logged-in UID:", currentUser.uid);
        console.log("Admin document exists:", adminSnap.exists());
        console.log("Admin active:", adminSnap.data()?.active);

        setIsAdmin(
          adminSnap.exists() && adminSnap.data().active === true
        );
      } catch (error) {
        console.error("Admin verification failed:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
