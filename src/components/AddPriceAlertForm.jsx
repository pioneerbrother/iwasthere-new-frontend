// File: iwasthere/new-frontend/src/components/AddPriceAlertForm.jsx
import React, { useState } from 'react';
// We need to create this assetList.json file in the next step.
import assetList from '../data/assetList.json';
import api from '../services/apiService';

export default function AddPriceAlertForm({ onAlertCreated }) {
    const [assetName, setAssetName] = useState('');
    const [direction, setDirection] = useState('DECREASE');
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedAsset = assetList.find(asset => asset.name.toLowerCase() === assetName.toLowerCase());
        if (!selectedAsset) {
            setError('Please select a valid cryptocurrency from the list.');
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            const response = await api.post('/price-alerts', {
                assetId: selectedAsset.id,
                direction: direction,
                value: parseFloat(value)
            });
            onAlertCreated(response.data); // Notify parent component
            setAssetName('');
            setValue('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create price alert.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
            <h2>Add New Price Alert</h2>
            <form onSubmit={handleSubmit} noValidate>
                {/* UI for the form (asset search, direction, value) */}
                {/* ... (full form UI as designed previously) ... */}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Setting Alert...' : 'Set Price Alert'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
}