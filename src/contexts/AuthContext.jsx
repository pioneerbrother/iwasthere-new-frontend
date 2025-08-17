import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import api from '../services/apiService'; // It now imports the simple api instance.

const AuthContext = createContext(null);

// --- THIS IS YOUR BRILLIANT FIX ---
// The token logic now lives safely inside this file, where it cannot cause a loop.
const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false); 

    // Your brilliant useEffect hook remains unchanged, as it was already perfect.
    useEffect(() => {
        const getSessionAndSync = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setAuthToken(session?.access_token || null);
            if (session) {
                try { await api.post('/users/sync'); } catch (error) { console.error("Initial sync failed:", error); }
            }
            setIsLoading(false);
        };
        getSessionAndSync();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setUser(session?.user ?? null);
                setAuthToken(session?.access_token || null);
                if (_event === 'SIGNED_IN') {
                    setIsSyncing(true);
                    try { await api.post('/users/sync'); } catch (error) { console.error("Sign-in sync failed:", error); }
                    finally { setIsSyncing(false); }
                }
            }
        );
        return () => authListener.subscription.unsubscribe();
    }, []);

    const value = {
        isAuthenticated: !!user, 
        user,
        isLoading,
        isSyncing,
        signOut: () => supabase.auth.signOut(),
    };
    
    // The loading state is now correctly handled inside App.jsx,
    // so we can safely render children here.
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};