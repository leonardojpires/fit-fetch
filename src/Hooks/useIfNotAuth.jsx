import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase.js';

export default function useRedirectIfNotAuth(redirectPath = '/entrar') {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate(redirectPath, { replace: true });
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [ navigate, redirectPath ]);
    return { loading };
}
