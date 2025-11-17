import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";

export default function useGetAllExercises() {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const response = await fetch("http://localhost:3000/api/exercises/all", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Erro ao buscar exercícios");

        const data = await response.json();
        setExercises(data);
      } catch (err) {
        console.error("Erro ao buscar todos os exercícios: ", err);
      }
    });
    return () => unsubscribe();
  }, []);
  return { exercises, setExercises };
}
