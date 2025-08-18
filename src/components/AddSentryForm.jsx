// File: iwasthere/new-frontend/src/components/AddSentryForm.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/apiService';

export default function AddSentryForm({ onSentryCreated }) {
    const [contractAddress, setContractAddress] = useState('');
    const [eventName, setEventName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [limitReached, setLimitReached] = useState(false); // The definitive state for the link

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setLimitReached(false); // Reset on every new attempt
        try {
            const response = await api.post('/sentries', { contractAddress, eventName });
            onSentryCreated(response.data);
            setContractAddress('');
            setEventName('');
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to create Sentry.';
            setError(errorMessage);
            // If the specific error occurs, set our boolean to true
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
                <input type="text" value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} placeholder="0x..." required style={{ width: 'calc(100% - 120px)', padding: '8px' }}/>
                <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="e.g., Transfer" required style={{ width: 'calc(100% - 120px)', padding: '8px', marginTop: '0.5rem' }}/>
                <button type="submit" disabled={isLoading} style={{ marginLeft: '1rem' }}>{isLoading ? '...' : 'Deploy Sentry'}</button>
                
                {/* --- THIS IS THE FINAL FIX --- */}
                {error && <p style={{ color: 'red', marginTop: '1rem' }}><strong>Error:</strong> {error}</p>}
                {limitReached && (
                    <Link to="/upgrade">
                        <button style={{ marginTop: '0.5rem', cursor: 'pointer', background: 'green', color: 'white' }}>
                            Upgrade Plan
                        </button>
                    </Link>
                )}
            </form>
        </div>
    );
}