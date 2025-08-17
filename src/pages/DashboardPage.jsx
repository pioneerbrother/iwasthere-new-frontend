// File: iwasthere/new-frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/apiService';
import AddSentryForm from '../components/AddSentryForm.jsx';
import SentryList from '../components/SentryList.jsx';
// --- NEW IMPORTS ---
import AddPriceAlertForm from '../components/AddPriceAlertForm.jsx';
import PriceAlertList from '../components/PriceAlertList.jsx';

function DashboardPage() {
    const { signOut } = useAuth();
    const [sentries, setSentries] = useState([]);
    const [priceAlerts, setPriceAlerts] = useState([]); // New state for price alerts
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // This function now fetches BOTH types of rules in parallel.
    const fetchAllRules = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const [sentryRes, priceAlertRes] = await Promise.all([
                api.get('/sentries'),
                api.get('/price-alerts')
            ]);
            setSentries(sentryRes.data.sentries || []);
            setPriceAlerts(priceAlertRes.data.alerts || []);
        } catch (err) {
            setError('Could not load your rules. Please try logging out and back in.');
            console.error("Fetch All Rules Error:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllRules();
    }, [fetchAllRules]);

    const handleSentryCreated = (newSentry) => {
        setSentries(prev => [newSentry, ...prev]);
    };
    
    const handlePriceAlertCreated = (newAlert) => {
        setPriceAlerts(prev => [newAlert, ...prev]);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <nav style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Sentry Command Center</h1>
                <button onClick={signOut}>Sign Out</button>
            </nav>
            <main style={{ padding: '1rem' }}>
                <AddSentryForm onSentryCreated={handleSentryCreated} />
                <AddPriceAlertForm onAlertCreated={handlePriceAlertCreated} />

                <hr style={{ margin: '2rem 0' }} />

                <h2>Your Active Rules</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                <SentryList sentries={sentries} isLoading={isLoading} />
                <PriceAlertList alerts={priceAlerts} isLoading={isLoading} />
            </main>
        </div>
    );
}
export default DashboardPage;