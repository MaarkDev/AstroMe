import { auth } from "./Firebase";
import { useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';

const LoginRoute = ({ user, children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(currentUser => {
            if (!currentUser) {
                navigate('/login');
            }else{
                navigate('/home');
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return <>{children}</>;
}

export default LoginRoute;
