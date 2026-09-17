import { useState, useEffect } from 'react'
import { CheckAuth } from '../services/AuthService'
import { Navigate } from 'react-router-dom'


function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {

        async function checkAuth() {
            const authStatus = await CheckAuth();
            setIsAuthenticated(authStatus);
        }

        checkAuth();

    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated === false) {
        return <Navigate to="/login" />;
    }

    return children;
}