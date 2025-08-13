// File: new-frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient'; // Your Supabase client
import { setAuthToken } from '../services/apiService'; // The function to arm our API

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // --- THIS IS THE CRITICAL LOGIC ---
        // 1. Check for an existing session when the app loads.
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsAuthenticated(true);
                // Arm the API client with the token from the existing session.
                setAuthToken(session.access_token);
            }
            setIsLoading(false);
        };
        getSession();

        // 2. Listen for future changes in authentication state (login/logout).
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
            // Arm or disarm the API client whenever the session changes.
            setAuthToken(session ? session.access_token : null);
            setIsLoading(false);
        });

        // Cleanup the listener when the component unmounts.
        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setAuthToken(null); // Disarm the API client on logout
    };

    const value = {
        isAuthenticated,
        isLoading,
        signOut,
    };

    // Do not render the rest of the app until the initial auth check is complete.
    if (isLoading) {
        return <div>Loading...</div>; // Or a proper spinner component
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context easily in other components
export const useAuth = () => {
    return useContext(AuthContext);
};