import { auth } from "../../services/firebase";


export default function useDeleteUser() {
    const deleteUser = async (userId) => {
        try {
            if (!userId) throw new Error("Utilizador não encontrado!");
            if (userId === auth.currentUser.userId) throw new Error("Não podes eliminar a tua conta!");

            const user = auth.currentUser;
            if (!user) throw new Error("Utilizador não autenticado!");

            const token = await user.getIdToken();

            const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Erro ao eliminar utilizador!");

            return data;
        } catch(err) {
            console.error("Erro ao eliminar utilizador: ", err);
        }
    }
    return deleteUser;
}