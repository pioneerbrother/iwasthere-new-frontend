// File: iwasthere/new-frontend/src/components/AddSentryForm.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import the Link component
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
                {/* ... form inputs ... */}
                <button type="submit" disabled={isLoading}>{isLoading ? 'Deploying...' : 'Deploy Sentry'}</button>
                {error && (
                    <div style={{ marginTop: '1rem', color: 'red' }}>
                        <p><strong>Error:</strong> {error}</p>
                        {/* --- THIS IS THE FIX --- */}
                        {error.includes('limit reached') && (
                            <Link to="/upgrade">
                                <button style={{ marginTop: '0.5rem', cursor: 'pointer' }}>
                                    Upgrade Plan
                                </button>
                            </Link>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
}