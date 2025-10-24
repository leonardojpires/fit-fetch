import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase.js';

export default function useRedirectIfNotAuth() {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate('/entrar');
            }
        });

        return () => unsubscribe();
    }, [ navigate ]);
}
