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
                direction,
                value: parseFloat(value)
            });
            onAlertCreated(response.data);
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label>Asset</label>
                        <input
                            list="asset-list"
                            value={assetName}
                            onChange={(e) => setAssetName(e.target.value)}
                            placeholder="Search (e.g., Bitcoin)"
                            required
                            style={{ width: '100%', padding: '8px' }}
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
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Setting Alert...' : 'Set Price Alert'}
                </button>
                {error && (
                    <div style={{ marginTop: '1rem', color: 'red' }}>
                        <p>{error}</p>
                        {error.includes('limit reached') && (
                            <Link to="/upgrade"><button>Upgrade Now</button></Link>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
}