// File: new-frontend/src/components/AddPriceAlertForm.jsx
import React, { useState } from 'react';
// Import the static list of assets we created
import assetList from '../data/assetList.json';

export default function AddPriceAlertForm({ onAlertCreated }) {
    const [assetName, setAssetName] = useState(''); // Stores the user's text input
    const [direction, setDirection] = useState('DECREASE');
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Find the selected asset from our list to get its ID
        const selectedAsset = assetList.find(asset => asset.name.toLowerCase() === assetName.toLowerCase());
        
        if (!selectedAsset) {
            setError('Please select a valid cryptocurrency from the list.');
            return;
        }

        setError('');
        // The API call will go here in the next step, using selectedAsset.id
        alert(`Ready to create alert for ${selectedAsset.name} (${selectedAsset.id})`);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Price Alert</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* --- NEW: Searchable Asset Input --- */}
                    <div>
                        <label htmlFor="asset-choice" className="block text-gray-700 text-sm font-bold mb-2">Asset</label>
                        <input
                            list="asset-list"
                            id="asset-choice"
                            name="asset-choice"
                            value={assetName}
                            onChange={(e) => setAssetName(e.target.value)}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            placeholder="Search (e.g., Bitcoin)"
                            required
                        />
                        <datalist id="asset-list">
                            {assetList.map(asset => (
                                <option key={asset.id} value={asset.name} />
                            ))}
                        </datalist>
                    </div>
                    {/* Direction Selection */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">When price...</label>
                        <select
                            value={direction}
                            onChange={(e) => setDirection(e.target.value)}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                        >
                            <option value="DECREASE">Decreases by</option>
                            <option value="INCREASE">Increases by</option>
                        </select>
                    </div>
                    {/* Value Input */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Value (%)</label>
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            placeholder="e.g., 5"
                            required
                        />
                    </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Set Price Alert
                </button>
                {error && <p className="mt-4 text-center text-red-500">{error}</p>}
            </form>
        </div>
    );
}