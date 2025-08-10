import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // While we are checking the session, don't render anything yet.
    if (isLoading) {
        return <div>Loading session...</div>; // Or a loading spinner
    }

    // If the session is loaded and the user is authenticated, render the requested page.
    if (isAuthenticated) {
        return <Outlet />;
    }

    // If the user is not authenticated, redirect them to the login page.
    return <Navigate to="/admin" />;
};

export default ProtectedRoute;