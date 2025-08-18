import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/apiService';

export default function AddSentryForm({ onSentryCreated }) {
    const [contractAddress, setContractAddress] = useState('');
    const [eventName, setEventName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await api.post('/sentries', { contractAddress, eventName });
            onSentryCreated(response.data);
            setContractAddress('');
            setEventName('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create Sentry.');
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
                {error && (
                    <div>
                        <p style={{ color: 'red' }}>{error}</p>
                        {error.includes('limit reached') && <Link to="/upgrade"><button>Upgrade Now</button></Link>}
                    </div>
                )}
            </form>
        </div>
    );
}