import { auth } from "../../services/firebase.js";

export default function useUpdateCurrentUser() {
    const updateCurrentUser = async (formData) => {
        try {
            const { name, avatar } = formData;
            const user = auth.currentUser;

            if (!user) throw new Error("Utilizador não autenticado!");

            const token = await user.getIdToken();

            const data = new FormData();
            data.append("name", name);
            if (avatar) data.append("avatar", avatar);

            const response = await fetch("http://localhost:3000/api/users/me", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: data
            });

            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.message || "Erro ao atualizar o utilizador atual!");
            return responseData;
        } catch(err) {
            // console.error("Erro ao atualizar o utilizador atual: ", err);
        }
    }
    return updateCurrentUser;
}
