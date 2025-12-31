import { auth } from "./Firebase";
import { useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(currentUser => {
            if (!currentUser) {
                navigate('/login');
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return <>{children}</>;
}

export default ProtectedRoute;
