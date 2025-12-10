import { useEffect, useState } from "react";
import { auth } from "../../services/firebase.js";

export default function useGetWorkoutPlanById(planId) {
    const [workoutPlan, setWorkoutPlan] = useState(null);
    const [loadingPlan, setLoadingPlan] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!planId) {
            setLoadingPlan(false);
            return;
        };

        const fetchWorkoutPlan = async () => {
            try {
                const token = await auth.currentUser.getIdToken();

                const response = await fetch(`http://localhost:3000/api/workout-plans/${planId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) throw new Error("Erro ao buscar plano de treino");

                const data = await response.json();
                setWorkoutPlan(data.plan);
                setError(null);
            } catch(err) {
                console.error("Erro ao buscar plano de treino: ", err);
                setError(err.message || "Erro desconhecido");
            } finally {
                setLoadingPlan(false);
            }
        };

        fetchWorkoutPlan();
    }, [planId]);
    return { workoutPlan, loadingPlan, error };
}
