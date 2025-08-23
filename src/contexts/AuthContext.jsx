// File: iwasthere/new-frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import api from '../services/apiService';

const AuthContext = createContext(null);

const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleAuthChange = async (session) => {
            const isLoggedIn = !!session;
            setIsAuthenticated(isLoggedIn);
            setAuthToken(session ? session.access_token : null);

            if (isLoggedIn) {
                try {
                    console.log("User is authenticated. Syncing profile with backend...");
                    await api.post('/users/sync');
                    console.log("User profile synchronized successfully.");
                } catch (error) {
                    console.error("Critical error during user sync:", error);
                }
            }
            setIsLoading(false);
        };

        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            await handleAuthChange(session);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            handleAuthChange(session);
        });

        return () => subscription?.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const value = { isAuthenticated, isLoading, signOut };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};