import { useEffect, useState } from "react";
import { auth } from "../services/firebase.js";

export default function useGetUserInformation() {
    const [ userInfo, setUserInfo ] = useState(null);

    useEffect(() => {

        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) return;

            try {
                const token = await auth.currentUser.getIdToken();
                const response = await fetch("http://localhost:3000/api/users/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Erro ao buscar os dados do utilizador");

                const data = await response.json();
                setUserInfo(data);
                console.log("UserInfo recebido:", data);
            } catch(err) {
                console.error("Erro ao buscar os dados do utilizador: ", err);
            }
        });
        return () => {
            unsubscribe();
        }
    }, []);
    return userInfo;
}