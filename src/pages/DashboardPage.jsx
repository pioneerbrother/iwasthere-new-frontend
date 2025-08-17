// File: iwasthere/new-frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/apiService';

import AddSentryForm from '../components/AddSentryForm.jsx';
import SentryList from '../components/SentryList.jsx';
import AddPriceAlertForm from '../components/AddPriceAlertForm.jsx';
import PriceAlertList from '../components/PriceAlertList.jsx'; // We'll create this

function DashboardPage() {
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

    const handleSentryCreated = (newSentry) => {
        setSentries(prev => [newSentry, ...prev]);
    };
    
    const handlePriceAlertCreated = (newAlert) => {
        setPriceAlerts(prev => [newAlert, ...prev]);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold">Sentry Command Center</h1>
            
            <AddSentryForm onSentryCreated={handleSentryCreated} />
            <AddPriceAlertForm onAlertCreated={handlePriceAlertCreated} />

            <hr className="my-8" />

            <h2 className="text-3xl font-bold">Your Active Rules</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <SentryList sentries={sentries} isLoading={isLoading} />
            <PriceAlertList alerts={priceAlerts} isLoading={isLoading} />
        </div>
    );
}

export default DashboardPage;