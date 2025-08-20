// File: iwasthere/new-frontend/src/components/AddPriceAlertForm.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import assetList from '../data/assetList.json';
import api from '../services/apiService';

export default function AddPriceAlertForm({ onAlertCreated }) {
    const [assetName, setAssetName] = useState('');
    const [direction, setDirection] = useState('DECREASE');
    const [value, setValue] = useState('');
    const [notificationChannel, setNotificationChannel] = useState('EMAIL'); // Default to EMAIL
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [limitReached, setLimitReached] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // ... (form validation logic is the same) ...
        try {
            const response = await api.post('/price-alerts', { 
                assetId: selectedAsset.id, 
                direction, 
                value: parseFloat(value),
                notificationChannel // Send the selected channel to the backend
            });
            onAlertCreated(response.data);
            setAssetName('');
            setValue('');
        } catch (err) {
            // ... (error handling logic is the same) ...
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
            <h2>Add New Price Alert</h2>
            <form onSubmit={handleSubmit} noValidate>
                {/* Asset, Direction, Value Inputs */}
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
                    {isLoading ? 'Setting Alert...' : 'Set Price Alert'}
                </button>
                
                {/* Error and Upgrade Link Logic */}
                {/* ... */}
            </form>
        </div>
    );
}