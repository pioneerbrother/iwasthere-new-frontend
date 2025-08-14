// File: new-frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
// We now import the 'api' instance directly, not the function.
import api from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // --- The setAuthToken logic now lives inside the AuthContext ---
    const setAuthToken = (token) => {
        if (token) {
            // Modify the imported 'api' instance directly.
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    };

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsAuthenticated(true);
                setAuthToken(session.access_token);
            }
            setIsLoading(false);
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
            setAuthToken(session ? session.access_token : null);
            setIsLoading(false);
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setAuthToken(null);
    };

    const value = { isAuthenticated, isLoading, signOut };

    if (isLoading) {
        return <div>Loading Sentry...</div>; // Or a better loading component
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};