import { useEffect, useState } from "react";
import { auth } from "../../services/firebase.js";
import useCurrentUser from "../useCurrentUser.jsx";

export default function useGetWorkoutPlanById(planId) {
    const [workoutPlan, setWorkoutPlan] = useState(null);
    const [loadingPlan, setLoadingPlan] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const { user } = useCurrentUser();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(() => {
            setIsAuthReady(true);
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!planId || !isAuthReady || !user) {
            if (!planId) setLoadingPlan(false);
            return;
        };

        const fetchWorkoutPlan = async () => {
            try {
                if (!auth.currentUser) {
                    throw new Error("Utilizador não autenticado");
                }
                const token = await auth.currentUser.getIdToken();

                const response = await fetch(`http://localhost:3000/api/workout-plans/${planId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) throw new Error("Erro ao buscar plano de treino");
                
                const data = await response.json();
                console.log("Plano de treino buscado: ", data.plan);
                console.log("User ID atual: ", user.id);
                console.log("Plan user_id: ", data.plan.user_id);

                if (user.id !== data.plan.user_id) {
                    throw new Error("Acesso negado ao plano de treino");
                }

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
    }, [planId, isAuthReady, user]);
    return { workoutPlan, loadingPlan, error };
}
