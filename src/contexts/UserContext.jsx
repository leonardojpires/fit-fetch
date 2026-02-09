import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase.js";
import { onAuthStateChanged } from "firebase/auth";

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndSyncUser = async (firebaseUser) => {
      try {
        // Force refresh to avoid stale token after sign-in
        // Using 'true' will fetch a new token from the server, even if the current token hasn't expired yet
        const token = await firebaseUser.getIdToken(true);
        // console.log("Firebase Token:", token);

        // Ensure user exists/updated in DB before fetching
/*         await fetch("http://localhost:3000/api/users/sync", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }); */
        const syncResponse = await fetch("http://localhost:3000/api/users/sync", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
          }
        });

        if (!syncResponse.ok) {
          const syncError = await syncResponse.text();
          // console.error(`Erro em /api/users/sync: (${syncResponse.status}): `, syncError)
        } else {
          // console.log("/api/users/shync sucesso!");
        }

        const response = await fetch("http://localhost:3000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar dados do utilizador");

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        // console.error("Erro ao sincronizar/buscar dados do utilizador: ", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        fetchAndSyncUser(firebaseUser);
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
