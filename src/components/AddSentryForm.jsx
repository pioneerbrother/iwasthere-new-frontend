// File: iwasthere/new-frontend/src/components/AddSentryForm.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/apiService';

export default function AddSentryForm({ onSentryCreated }) {
    const [contractAddress, setContractAddress] = useState('');
    const [eventName, setEventName] = useState('');
    const [notificationChannel, setNotificationChannel] = useState('EMAIL'); // Default to EMAIL
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [limitReached, setLimitReached] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setLimitReached(false);
        try {
            const response = await api.post('/sentries', { 
                contractAddress, 
                eventName,
                notificationChannel // Send the selected channel to the backend
            });
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
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <h2>Add New Sentry</h2>
            <form onSubmit={handleSubmit}>
                {/* Contract and Event Inputs */}
                {/* ... */}

                {/* --- THIS IS THE NEW DROPDOWN --- */}
                <div style={{ marginTop: '1rem' }}>
                    <label>Notification Method</label><br />
                    <select 
                        value={notificationChannel} 
                        onChange={(e) => setNotificationChannel(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="EMAIL">Email (Free)</option>
                        <option value="SMS">SMS (1 Credit per alert)</option>
                    </select>
                </div>
                
                <button type="submit" disabled={isLoading} style={{ marginTop: '1rem' }}>
                    {isLoading ? 'Deploying...' : 'Deploy Sentry'}
                </button>
                
                {/* Error and Upgrade Link Logic */}
                {/* ... */}
            </form>
        </div>
    );
}