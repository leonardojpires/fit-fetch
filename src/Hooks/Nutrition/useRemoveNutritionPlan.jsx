import { auth } from "../../services/firebase.js";

export default function useRemoveNutritionPlan() {
  const removePlan = async (planId) => {
    try {
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(
        `http://localhost:3000/api/nutrition-plans/${planId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao remover plano de nutrição");
      }

      return await response.json();
    } catch (err) {
      // console.error("Erro ao remover plano de nutrição:", err);
      throw err;
    }
  };

  return removePlan;
}
