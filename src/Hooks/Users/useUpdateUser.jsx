import { auth } from "../../services/firebase";

export default function useUpdateUser() {
    const updateUser = async (userId, formData) => {
        try {
            const { name, email, role } = formData;
            const user = auth.currentUser;

            if (!user) throw new Error("Utilizador não autenticado!");

            const token = await user.getIdToken();

            const data = new FormData();
            data.append("name", name);
            data.append("email", email);
            if (role) data.append("role", role);

            const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.message || "Erro ao atualizar utilizador!");
            return responseData;
        } catch(err) {
            // console.error("Erro ao atualizar utilizador: ", err);
        }
    }
    return updateUser;
}