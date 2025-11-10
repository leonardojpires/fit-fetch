import { auth } from "../../services/firebase";

export default function useUpdateUser() {
    const updateUser = async (userId, formData) => {
        try {
            const { name, email, role } = formData;
            const user = auth.currentUser;

            if (!user) throw new Error("Utilizador não autenticado!");

            const token = await user.getIdToken();

            const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name, email, role })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Erro ao atualizar utilizador!");
            return data;
        } catch(err) {
            console.error("Erro ao atualizar utilizador: ", err);
        }
    }
    return updateUser;
}