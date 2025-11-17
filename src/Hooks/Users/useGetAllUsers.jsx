import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";

export default function useGetAllUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const response = await fetch("http://localhost:3000/api/users/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erro ao buscar utilizadores");

        const data = await response.json();
        console.log(data);
        setUsers(data);
      } catch (err) {
        console.error("Erro ao buscar todos os utilizadores:", err);
      }
    });
    return () => unsubscribe();
  }, []);
  return { users, setUsers };
}
