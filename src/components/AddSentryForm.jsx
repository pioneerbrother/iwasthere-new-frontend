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
            // Set the error message from the server's response
            setError(err.response?.data?.error || 'Failed to create Sentry.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #555' }}>
            <h2>Add New Sentry</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Contract Address</label><br />
                    <input
                        type="text"
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                        placeholder="0x..."
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Event Name</label><br />
                    <input
                        type="text"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        placeholder="e.g., Transfer"
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Deploying...' : 'Deploy Sentry'}
                </button>

                {/* --- THIS IS THE FIX --- */}
                {/* If there is an error message, display it. */}
                {error && (
                    <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid red', color: 'red' }}>
                        <p><strong>Error:</strong> {error}</p>
                        {/* If the error is the specific "limit reached" message, show the Upgrade button. */}
                        {error.includes('limit reached') && (
                            <Link to="/upgrade">
                                <button style={{ marginTop: '0.5rem' }}>Upgrade Now</button>
                            </Link>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
}