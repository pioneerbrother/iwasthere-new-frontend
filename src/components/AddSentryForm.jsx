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
            if (err.response?.status === 403) {
                setLimitReached(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <input type="text" value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} placeholder="0x..." required />
            <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="e.g., Transfer" required style={{ marginLeft: '0.5rem' }}/>
            <button type="submit" disabled={isLoading} style={{ marginLeft: '0.5rem' }}>{isLoading ? '...' : 'Deploy Sentry'}</button>
            {error && <p style={{ color: 'red', marginTop: '1rem' }}><strong>Error:</strong> {error}</p>}
            {limitReached && (
                <div style={{ marginTop: '1rem' }}>
                    <Link to="/upgrade">
                        <button style={{ cursor: 'pointer', background: 'green', color: 'white', border: 'none', padding: '10px 15px' }}>
                            Upgrade Plan
                        </button>
                    </Link>
                </div>
            )}
        </form>
    );
}