import { auth } from "../../services/firebase";

export default function useUpdateExercise() {
    const updateExercise = async (exerciseId, formData) => {
        try {
            const { name, muscle_group, description, video_url, type, difficulty } = formData;
            const user = auth.currentUser;

            if (!user) throw new Error("Utilizador não autenticado!");

            const token = await user.getIdToken();

            const response = await fetch(`http://localhost:3000/api/exercises/${exerciseId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    name, 
                    muscle_group, 
                    description, 
                    video_url,
                    type,
                    difficulty
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Erro ao atualizar exercício!");
            return data;
        } catch(err) {
            // console.error("Erro ao atualizar exercício: ", err);
            throw err;
        }
    }
    return updateExercise;
}
