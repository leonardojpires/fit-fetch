import { auth } from "../../services/firebase.js";

export default function useAddUser() {
  const addUser = async (formData) => {
    try {
      const { name, email, password, role } = formData;
      const user = auth.currentUser;

      if (!user) throw new Error("Utilizador não autenticado!");

      const token = await user.getIdToken();

      const response = await fetch("http://localhost:3000/api/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Erro ao adicionar utilizador!");
      return data;
    } catch (err) {
      console.error("Erro ao adicionar utilizador: ", err);
    }
  };

  return addUser;
}
