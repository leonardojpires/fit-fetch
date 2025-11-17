import { auth } from "../../services/firebase";

export default function useDeleteFood() {
    const deleteFood = async (foodId) => {
        try {
            if (!foodId) throw new Error("Alimento não encontrado!");

            const user = auth.currentUser;
            if (!user) throw new Error("Utilizador não autenticado!");

            const token = await user.getIdToken();

            const response = await fetch(`http://localhost:3000/api/foods/${foodId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Erro ao eliminar alimento!");

            return data;
        } catch(err) {
            console.error("Erro ao eliminar alimento: ", err);
            throw err;
        }
    }
    return deleteFood;
}
