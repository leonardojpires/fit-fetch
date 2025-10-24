import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase.js';

function useRedirectIfAuth() {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                navigate('/');
            }
        });

        return () => unsubscribe();
    }, [ navigate ]);
}

export default useRedirectIfAuth;
