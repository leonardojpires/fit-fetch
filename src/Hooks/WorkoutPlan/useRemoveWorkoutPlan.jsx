import { auth } from "../../services/firebase.js";

export default function useRemoveWorkoutPlan() {
  const removeWorkoutPlan = async (planId) => {
    try {
      if (!auth.currentUser) {
        throw new Error("Utilizador não autenticado");
      }

      const token = await auth.currentUser.getIdToken();

      const response = await fetch(
        `http://localhost:3000/api/workout-plans/${planId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao remover plano de treino");

      return await response.json();
    } catch (err) {
      console.error("Erro ao remover plano de treino: ", err);
      throw err;
    }
  };

  return removeWorkoutPlan;
}
