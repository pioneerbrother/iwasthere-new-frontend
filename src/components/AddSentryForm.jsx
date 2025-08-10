// File: src/components/AddSentryForm.jsx
import React, { useState } from 'react';
import api from '../services/apiService'; // Our back-end API client

function AddSentryForm({ onSentryCreated }) {
    const [contractAddress, setContractAddress] = useState('');
    const [eventName, setEventName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            // Send the command to our back-end fortress
            const response = await api.post('/sentries', { contractAddress, eventName });
            // Notify the parent component of our victory
            onSentryCreated(response.data);
            // Reset the form for the next command
            setContractAddress('');
            setEventName('');
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create Sentry.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Sentry</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Contract Address</label>
                    <input
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                        className="font-mono shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        placeholder="0x..."
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Event Name</label>
                    <input
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        className="font-mono shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        placeholder="e.g., Transfer"
                        required
                    />
                </div>
                <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                    {isLoading ? 'Deploying Sentry...' : 'Deploy Sentry'}
                </button>
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </form>
        </div>
    );
}

export default AddSentryForm;