  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { auth } from "../services/firebase.js";

  export default function useAdminRedirect() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      let isMounted = true;

      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
          if (isMounted) navigate("/", { replace: true });
          return;
        }

        try {
          const token = await auth.currentUser.getIdToken();
          const response = await fetch("http://localhost:3000/api/users/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok)
            throw new Error("Erro ao buscar os dados do utilizador");

          const user = await response.json();

          // console.log("Dados do utilizador:", user);

          if (isMounted && user.role !== "admin") {
            navigate("/");
          } else if (isMounted) {
            setLoading(false);
          }
        } catch (err) {
          console.error("Erro ao buscar os dados do utilizador: ", err);
          if (isMounted) navigate("/", { replace: true });
        }
      });
      return () => {
        isMounted = false;
        unsubscribe();
      }
    }, [navigate]);

    return { loading };
  }
