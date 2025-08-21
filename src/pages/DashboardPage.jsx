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
    const [fetchError, setFetchError] = useState('');

    const fetchAllRules = useCallback(async () => {
        // ... (This data fetching logic is correct and remains the same)
        setIsLoading(true);
        setFetchError('');
        try {
            const results = await Promise.allSettled([
                api.get('/sentries'),
                api.get('/price-alerts')
            ]);
            if (results[0].status === 'fulfilled') setSentries(results[0].value.data.sentries || []);
            if (results[1].status === 'fulfilled') setPriceAlerts(results[1].value.data.alerts || []);
        } catch (err) {
            setFetchError('A network error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllRules();
    }, [fetchAllRules]);

    const handleSentryCreated = (newSentry) => setSentries(prev => [newSentry, ...prev]);
    const handlePriceAlertCreated = (newAlert) => setPriceAlerts(prev => [newAlert, ...prev]);

    return (
        <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Sentry Command Center</h1>
                <button onClick={signOut}>Sign Out</button>
            </nav>
            <main style={{ marginTop: '2rem' }}>

                {/* --- THIS IS THE UPGRADED SENTRY SECTION --- */}
                <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
                    <h2>Add New Sentry</h2>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '-5px', marginBottom: '1rem' }}>
                        A Sentry monitors a specific smart contract for on-chain events, like a token transfer or NFT sale.
                    </p>
                    <AddSentryForm onSentryCreated={handleSentryCreated} />
                </div>

                {/* --- THIS IS THE UPGRADED PRICE ALERT SECTION --- */}
                <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '2rem' }}>
                    <h2>Add New Price Alert</h2>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '-5px', marginBottom: '1rem' }}>
                        A Price Alert monitors an asset and notifies you when it crosses a specific USD value.
                    </p>
                    <AddPriceAlertForm onAlertCreated={handlePriceAlertCreated} />
                </div>

                <hr style={{ margin: '2rem 0' }} />
                <h2>Your Active Rules</h2>
                {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}
                <SentryList sentries={sentries} isLoading={isLoading} />
                <PriceAlertList alerts={priceAlerts} isLoading={isLoading} />
            </main>
        </div>
    );
}