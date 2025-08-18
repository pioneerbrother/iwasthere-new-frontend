// File: iwasthere/new-frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../services/apiService';

import AddSentryForm from '../components/AddSentryForm.jsx';
import SentryList from '../components/SentryList.jsx';
import AddPriceAlertForm from '../components/AddPriceAlertForm.jsx';
import PriceAlertList from '../components/PriceAlertList.jsx';

export default function DashboardPage() {
    const { signOut } = useAuth();
    const [sentries, setSentries] = useState([]);
    const [priceAlerts, setPriceAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(''); // Use a separate state for fetch errors

    const fetchAllRules = useCallback(async () => {
        setIsLoading(true);
        setFetchError('');
        try {
            // Promise.allSettled is more robust and will not fail if one of the API calls fails.
            const results = await Promise.allSettled([
                api.get('/sentries'),
                api.get('/price-alerts')
            ]);
            
            // Correctly handle the results for each API call
            if (results[0].status === 'fulfilled') {
                setSentries(results[0].value.data.sentries || []);
            } else {
                console.error("Failed to fetch sentries:", results[0].reason);
                setFetchError('Could not load your on-chain sentries.');
            }
            
            if (results[1].status === 'fulfilled') {
                setPriceAlerts(results[1].value.data.alerts || []);
            } else {
                console.error("Failed to fetch price alerts:", results[1].reason);
                setFetchError(prev => prev ? `${prev} And could not load price alerts.` : 'Could not load your price alerts.');
            }

        } catch (err) {
            // This catch is for total network failures
            setFetchError('A network error occurred while loading your rules.');
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
        <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Sentry Command Center</h1>
                <button onClick={signOut}>Sign Out</button>
            </nav>
            <main style={{ marginTop: '2rem' }}>
                <AddSentryForm onSentryCreated={handleSentryCreated} />
                <AddPriceAlertForm onAlertCreated={handlePriceAlertCreated} />
                <hr style={{ margin: '2rem 0' }} />
                <h2>Your Active Rules</h2>
                {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}
                <SentryList sentries={sentries} isLoading={isLoading} />
                <PriceAlertList alerts={priceAlerts} isLoading={isLoading} />
            </main>
        </div>
    );
}