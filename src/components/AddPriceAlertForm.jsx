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
        // --- THIS IS THE FIX: The catch block was missing its opening brace ---
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
        <form onSubmit={handleSubmit} noValidate style={{ marginTop: '1rem' }}>
            <input list="asset-list" value={assetName} onChange={(e) => setAssetName(e.target.value)} placeholder="Search (e.g., Bitcoin)" required />
            <datalist id="asset-list">{assetList.map(asset => (<option key={asset.id} value={asset.name} />))}</datalist>
            <select value={direction} onChange={(e) => setDirection(e.target.value)} style={{ marginLeft: '0.5rem' }}><option value="DECREASE">Decreases to</option><option value="INCREASE">Increases to</option></select>
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g., 50000" required style={{ marginLeft: '0.5rem' }}/>
            <button type="submit" disabled={isLoading} style={{ marginLeft: '0.5rem' }}>{isLoading ? '...' : 'Set Price Alert'}</button>
            {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
            {limitReached && (
                <Link to="/upgrade">
                    <button style={{ display: 'block', marginTop: '0.5rem', cursor: 'pointer', background: 'green', color: 'white', border: 'none', padding: '10px 15px' }}>
                        Upgrade Plan
                    </button>
                </Link>
            )}
        </form>
    );
}