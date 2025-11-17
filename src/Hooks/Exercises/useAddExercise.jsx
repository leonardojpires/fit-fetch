import { auth } from "../../services/firebase.js";

export default function useAddExercise() {
  const addExercise = async (formData) => {
    try {
      const { name, muscle_group, description, image_url, video_url } = formData;
      const user = auth.currentUser;

      if (!user) throw new Error("Utilizador não autenticado!");

      const token = await user.getIdToken();

      const response = await fetch("http://localhost:3000/api/exercises/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          name, 
          muscle_group, 
          description, 
          image_url, 
          video_url
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Erro ao adicionar exercício!");
      return data;
    } catch (err) {
      console.error("Erro ao adicionar exercício: ", err);
      throw err;
    }
  };

  return addExercise;
}
