import { auth } from "../../services/firebase";

export default function useUpdateFood() {
    const updateFood = async (foodId, formData) => {
        try {
            const { name, protein, carbs, fiber } = formData;
            const user = auth.currentUser;

            if (!user) throw new Error("Utilizador não autenticado!");

            const token = await user.getIdToken();

            const response = await fetch(`http://localhost:3000/api/foods/${foodId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    name, 
                    protein, 
                    carbs, 
                    fiber
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Erro ao atualizar alimento!");
            return data;
        } catch(err) {
            console.error("Erro ao atualizar alimento: ", err);
            throw err;
        }
    }
    return updateFood;
}
