import { useEffect, useState } from "react";
import { auth } from "../services/firebase.js";

export default function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async (firebaseUser) => {
      try {
        const token = await firebaseUser.getIdToken();

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

  return { user, setUser, loading, error };
}
