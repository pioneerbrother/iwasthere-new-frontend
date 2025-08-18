// File: iwasthere/new-frontend/src/components/AddPriceAlertForm.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import assetList from '../data/assetList.json';
import api from '../services/apiService';

export default function AddPriceAlertForm({ onAlertCreated }) {
    const [assetName, setAssetName] = useState('');
    const [direction, setDirection] = useState('DECREASE');
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [limitReached, setLimitReached] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedAsset = assetList.find(asset => asset.name.toLowerCase() === assetName.toLowerCase());
        if (!selectedAsset) {
            setError('Please select a valid cryptocurrency from the list.');
            return;
        }
        setIsLoading(true);
        setError('');
        setLimitReached(false);
        try {
            const response = await api.post('/price-alerts', { assetId: selectedAsset.id, direction, value: parseFloat(value) });
            onAlertCreated(response.data);
            setAssetName('');
            setValue('');
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to create price alert.';
            setError(errorMessage);
            if (err.response?.status === 403) {
                setLimitReached(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
            <h2>Add New Price Alert</h2>
            <form onSubmit={handleSubmit} noValidate>
                {/* ... your form inputs here ... */}
                <button type="submit" disabled={isLoading}>{isLoading ? 'Setting Alert...' : 'Set Price Alert'}</button>
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
        </div>
    );
}