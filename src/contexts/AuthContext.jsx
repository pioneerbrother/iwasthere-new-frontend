// File: new-frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import api from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const setAuthToken = (token) => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    };

    useEffect(() => {
        const handleAuthChange = async (session) => {
            setIsAuthenticated(!!session);
            setAuthToken(session ? session.access_token : null);

            // --- THIS IS THE NEW LOGIC ---
            // If the user is logged in, sync their profile with our backend.
            if (session) {
                try {
                    await api.post('/auth/sync');
                    console.log('User profile synchronized with backend.');
                } catch (error) {
                    console.error('Failed to sync user profile:', error);
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
        setIsAuthenticated(false);
        setAuthToken(null);
    };

    const value = { isAuthenticated, isLoading, signOut };

    if (isLoading) return <div>Loading...</div>;

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);