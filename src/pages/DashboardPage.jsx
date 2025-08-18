import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/apiService';
import AddSentryForm from '../components/AddSentryForm.jsx';
import SentryList from '../components/SentryList.jsx';
import AddPriceAlertForm from '../components/AddPriceAlertForm.jsx';
import PriceAlertList from '../components/PriceAlertList.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function DashboardPage() {
    const { signOut } = useAuth();
    const [sentries, setSentries] = useState([]);
    const [priceAlerts, setPriceAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

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
            setError('Failed to load your rules. Please try again.');
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
            <AddSentryForm onSentryCreated={handleSentryCreated} />
            <AddPriceAlertForm onAlertCreated={handlePriceAlertCreated} />
            <hr style={{ margin: '2rem 0' }} />
            <h2>Your Active Rules</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <SentryList sentries={sentries} isLoading={isLoading} />
            <PriceAlertList alerts={priceAlerts} isLoading={isLoading} />
        </div>
    );
}