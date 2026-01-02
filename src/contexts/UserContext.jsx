import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase.js";

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async (firebaseUser) => {
      try {
        const token = await firebaseUser.getIdToken();
        console.log("🔑 Firebase Token:", token);

        const response = await fetch(`http://localhost:3000/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar dados do utilizador");

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error("Erro ao buscar dados do utilizador: ", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        fetchUserData(firebaseUser);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, error }}>
        { children }
    </UserContext.Provider>
  )
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) throw new Error("useUser deve ser utilizador dentro de UserProvider");

    return context;
}
