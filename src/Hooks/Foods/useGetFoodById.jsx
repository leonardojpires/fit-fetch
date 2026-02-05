import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";

export default function useGetFoodById(foodId) {
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!foodId) {
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const response = await fetch(`http://localhost:3000/api/foods/${foodId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Erro ao buscar alimento");

        const data = await response.json();
        setFood(data);
        setError(null);
      } catch (err) {
        // console.error("Erro ao buscar alimento por ID: ", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [foodId]);

  return { food, loading, error };
}
