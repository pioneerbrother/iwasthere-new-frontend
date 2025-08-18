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
                <input list="asset-list" value={assetName} onChange={(e) => setAssetName(e.target.value)} placeholder="Search (e.g., Bitcoin)" required />
                <datalist id="asset-list">{assetList.map(asset => <option key={asset.id} value={asset.name} />)}</datalist>
                <select value={direction} onChange={(e) => setDirection(e.target.value)}><option value="DECREASE">Decreases to</option><option value="INCREASE">Increases to</option></select>
                <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g., 50000" required />
                <button type="submit" disabled={isLoading}>{isLoading ? 'Setting Alert...' : 'Set Price Alert'}</button>
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