import { auth } from "../../services/firebase";

export default function useDeleteExercise() {
    const deleteExercise = async (exerciseId) => {
        try {
            if (!exerciseId) throw new Error("Exercício não encontrado!");

            const user = auth.currentUser;
            if (!user) throw new Error("Utilizador não autenticado!");

            const token = await user.getIdToken();

            const response = await fetch(`http://localhost:3000/api/exercises/${exerciseId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Erro ao eliminar exercício!");

            return data;
        } catch(err) {
            console.error("Erro ao eliminar exercício: ", err);
            throw err;
        }
    }
    return deleteExercise;
}