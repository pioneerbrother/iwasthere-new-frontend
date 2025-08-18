// File: iwasthere/new-frontend/src/components/AddPriceAlertForm.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import assetList from '../data/assetList.json'; // For the searchable list
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
            setLimitReached(false); // Ensure this is reset
            return;
        }
        setIsLoading(true);
        setError('');
        setLimitReached(false);
        try {
            const response = await api.post('/price-alerts', {
                assetId: selectedAsset.id,
                direction,
                value: parseFloat(value)
            });
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
                {/* --- THIS IS THE COMPLETE FORM UI --- */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'flex-end', marginBottom: '1rem' }}>
                    <div>
                        <label htmlFor="asset-choice">Asset</label>
                        {/* The searchable input that uses the assetList.json data */}
                        <input
                            list="asset-list"
                            id="asset-choice"
                            value={assetName}
                            onChange={(e) => setAssetName(e.target.value)}
                            placeholder="Search (e.g., Bitcoin)"
                            required
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                        <datalist id="asset-list">
                            {assetList.map(asset => (
                                <option key={asset.id} value={asset.name} />
                            ))}
                        </datalist>
                    </div>
                    <div>
                        <label>When price...</label>
                        <select value={direction} onChange={(e) => setDirection(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                            <option value="DECREASE">Decreases to</option>
                            <option value="INCREASE">Increases to</option>
                        </select>
                    </div>
                    <div>
                        <label>Value (USD)</label>
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="e.g., 50000"
                            required
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>
                
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Setting Alert...' : 'Set Price Alert'}
                </button>

                {/* --- THE COMPLETE AND CORRECT ERROR/UPGRADE LOGIC --- */}
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