// File: new-frontend/src/pages/DashboardPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/apiService';
import AddSentryForm from '../components/AddSentryForm';
import SentryList from '../components/SentryList';

/**
 * @title The Command Center Dashboard
 * @notice This is the main interactive page for authenticated users.
 */
function DashboardPage() {
    const [sentries, setSentries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSentries = useCallback(async () => {
        setIsLoading(true);
        setError(''); // Clear previous errors
        try {
            const response = await api.get('/sentries');
            setSentries(response.data.sentries || []);
        } catch (err) {
            setError('Failed to load your Sentry watchlist. Please try logging out and back in.');
            console.error("Fetch Sentries Error:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSentries();
    }, [fetchSentries]);

    const handleSentryCreated = (newSentry) => {
        setError(''); // Clear any previous errors (like the "limit reached" error)
        setSentries(prevSentries => [newSentry, ...prevSentries]);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Sentry Command Center</h1>

            {/* The form for adding new sentries */}
            <AddSentryForm onSentryCreated={handleSentryCreated} />

            <hr className="my-8" />

            {/* The list of existing sentries */}
            {error && !isLoading && <p className="mt-4 text-red-500">{error}</p>}
            <SentryList sentries={sentries} isLoading={isLoading} />
        </div>
    );
}

export default DashboardPage;