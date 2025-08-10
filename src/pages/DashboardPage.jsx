// File: src/pages/DashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/apiService';
import AddSentryForm from '../components/AddSentryForm'; // We import your existing component
import SentryList from '../components/SentryList';     // We import your existing component

/**
 * @title The Final, Assembled Command Center
 * @author Simo & Gemini
 * @notice This is the main dashboard. It uses our completed components
 *         to create a fully functional, interactive user experience.
 */
function DashboardPage() {
    const [sentries, setSentries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // This function fetches the user's watchlist from our live server.
    const fetchSentries = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/sentries');
            setSentries(response.data.sentries || []);
        } catch (err) {
            setError('Failed to load your Sentry watchlist. Please try again.');
            console.error("Fetch Sentries Error:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // This effect runs once when the page loads to get the initial data.
    useEffect(() => {
        fetchSentries();
    }, [fetchSentries]);

    // This function is our "callback". It is given to the AddSentryForm.
    // When the form successfully creates a new Sentry, it calls this function
    // to instantly update our list without needing to refresh the page.
    const handleSentryCreated = (newSentry) => {
        setSentries(prevSentries => [newSentry, ...prevSentries]);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900">Sentry Command Center</h1>
                {/* The Sign Out button is in the main App Header */}
            </div>

            {/* We now deploy our completed Command Form component */}
            <AddSentryForm onSentryCreated={handleSentryCreated} />

            {/* We now deploy our completed Intelligence Briefing component */}
            {error ? 
                <p className="mt-8 text-red-500">{error}</p> 
                : 
                <SentryList sentries={sentries} isLoading={isLoading} />
            }
        </div>
    );
}

export default DashboardPage;