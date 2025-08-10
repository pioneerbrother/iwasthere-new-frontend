import { useMemo } from 'react';
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";

const API_BASE_URL = 'http://localhost:5001/api';

/**
 * @title The Final, State-Aware Authenticated API Hook
 * @author Simo & Gemini
 * @notice This hook now uses the `useAuth` hook itself to get the token,
 *         ensuring that it is always in sync with the user's session.
 */
export const useApi = () => {
    const { getToken } = useAuth();

    const api = useMemo(() => {
        const instance = axios.create({
            baseURL: API_BASE_URL,
        });

        // This interceptor runs before every request.
        instance.interceptors.request.use(async (config) => {
            // It now uses the getToken function from the hook's current scope.
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        return instance;
    }, [getToken]); // The hook now correctly depends on getToken

    return api;
};