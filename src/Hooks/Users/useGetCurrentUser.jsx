import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";


export default function useCurrentUser() {
    const [user, setUser] = useState();
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
            setUser(u || null);
            setLoadingUser(false);
        });
        return () => unsubscribe();
    }, []);
    
    return { user, loadingUser };
}