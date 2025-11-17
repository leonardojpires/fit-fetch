import { auth } from "../../services/firebase.js";

export default function useAddFood() {
  const addFood = async (formData) => {
    try {
      const { name, protein, carbs, fiber } = formData;
      const user = auth.currentUser;

      if (!user) throw new Error("Utilizador não autenticado!");

      const token = await user.getIdToken();

      const response = await fetch("http://localhost:3000/api/foods/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          name, 
          protein, 
          carbs, 
          fiber
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Erro ao adicionar alimento!");
      return data;
    } catch (err) {
      console.error("Erro ao adicionar alimento: ", err);
      throw err;
    }
  };

  return addFood;
}
