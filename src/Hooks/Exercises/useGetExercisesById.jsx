import { useEffect, useState } from "react";
import { auth } from "../../services/firebase.js";
import useCurrentUser from "../useCurrentUser";

export default function useGetExerciseById(exerciseId) {
    const [exercise, setExercise] = useState(null);
    const [loadingExercise, setLoadingExercise] = useState(true);
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
        if (!exerciseId || !isAuthReady || !user) {
            if (!exerciseId) setLoadingExercise(false);
            return;
        }

        const fetchExercise = async () => {
            try {
                if (!auth.currentUser) throw new Error("Utilizador não autenticado");

                const token = await auth.currentUser.getIdToken();

                const response = await fetch(`http://localhost:3000/api/exercises/${exerciseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Erro ao buscar exercício");

                }

                const data = await response.json();
                                
                setExercise(data);
                setError(null);
            } catch(err) {
                console.error("Erro ao buscar exercício: ", err);
                setError(err.message || "Erro desconhecido");
            } finally {
                setLoadingExercise(false);
            }
        };

        fetchExercise();
    }, [exerciseId, isAuthReady, user]);
    return { exercise, loadingExercise, error };
}
