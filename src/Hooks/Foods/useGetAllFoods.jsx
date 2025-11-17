import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";

export default function useGetAllFoods() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const response = await fetch("http://localhost:3000/api/foods/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Erro ao buscar alimentos");

        const data = await response.json();
        setFoods(data);
      } catch (err) {
        console.error("Erro ao buscar todos os alimentos: ", err);
      }
    });
    return () => unsubscribe();
  }, []);
  return { foods, setFoods };
}
