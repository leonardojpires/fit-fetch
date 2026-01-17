import { useState, useEffect } from "react";
import { auth } from "../../services/firebase.js";

export default function useGetNutritionPlanById(planId) {
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId) {
        setError("ID do plano não fornecido");
        setLoadingPlan(false);
        return;
      }

      try {
        setLoadingPlan(true);
        const token = await auth.currentUser.getIdToken();

        const response = await fetch(
          `http://localhost:3000/api/nutrition-plans/${planId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar plano de nutrição");
        }

        const data = await response.json();
        setNutritionPlan(data.plan);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar plano:", err);
        setError(err.message || "Erro ao buscar plano");
        setNutritionPlan(null);
      } finally {
        setLoadingPlan(false);
      }
    };

    fetchPlan();
  }, [planId]);

  return { nutritionPlan, loadingPlan, error };
}
