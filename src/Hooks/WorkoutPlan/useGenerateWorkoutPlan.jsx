import { useState } from "react";
import { auth } from "../../services/firebase.js";

export default function useGenerateWorkoutPlan() {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  const generatePlan = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const user = formData.user;
      if (!user) throw new Error("Utilizador não autenticado!");

      const token = await auth.currentUser.getIdToken();
      const { user: _, ...planData } = formData;

      const responses = await fetch(
        "http://localhost:3000/api/workout-plans/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(planData),
        }
      );
      const data = await responses.json();

      if (responses.status === 422) {
        setValidationErrors(data.errors || []);
        setLoading(false);
        return;
      }

      if (!responses.ok)
        throw new Error(data.message || "Erro ao gerar plano de treino!");

      // Normalize backend snake_case to frontend camelCase for consistency
      const normalizedPlan = {
        ...data.plan,
        workoutType: data.plan?.workout_type,
        exercises: data.plan?.exercises || [],
      };
      setWorkoutPlan(normalizedPlan);
    } catch (err) {
      setError(err.message);
      // console.error("Erro ao gerar plano de treino: ", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearErrors = () => {
    setValidationErrors([]);
  }

  return { workoutPlan, loading, error, validationErrors, generatePlan, clearErrors };
}
