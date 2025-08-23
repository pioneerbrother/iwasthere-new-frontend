// File: iwasthere/new-frontend/src/components/AddSentryForm.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/apiService';

export default function AddSentryForm({ onSentryCreated }) {
    const [contractAddress, setContractAddress] = useState('');
    const [eventName, setEventName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [limitReached, setLimitReached] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setLimitReached(false);
        try {
            const response = await api.post('/sentries', { contractAddress, eventName });
            onSentryCreated(response.data);
            setContractAddress('');
            setEventName('');
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to create Sentry.';
            setError(errorMessage);
            if (errorMessage.includes('limit reached')) {
                setLimitReached(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <h2>Add New Sentry</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} placeholder="0x..." required />
                <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="e.g., Transfer" required />
                <button type="submit" disabled={isLoading}>{isLoading ? 'Deploying...' : 'Deploy Sentry'}</button>
                {error && !limitReached && <p style={{ color: 'red', marginTop: '1rem' }}><strong>Error:</strong> {error}</p>}
                {limitReached && (
                    <div style={{ marginTop: '1rem' }}>
                        <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>
                        <Link to="/upgrade">
                            <button style={{ marginTop: '0.5rem', cursor: 'pointer', background: 'green', color: 'white', border: 'none', padding: '10px 15px' }}>
                                Upgrade Plan
                            </button>
                        </Link>
                    </div>
                )}
            </form>
        </div>
    );
}