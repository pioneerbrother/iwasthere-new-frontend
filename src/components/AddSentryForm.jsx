// File: new-frontend/src/components/AddSentryForm.jsx
import React, { useState } from 'react';
import api from '../services/apiService';

// We pass the onSentryCreated callback function from the parent
export default function AddSentryForm({ onSentryCreated }) {
    const [contractAddress, setContractAddress] = useState('');
    const [eventName, setEventName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // State to hold any error message from the API
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(''); // Clear previous errors on a new submission

        try {
            const response = await api.post('/sentries', { contractAddress, eventName });
            // On success, call the parent's function to update the UI
            onSentryCreated(response.data);
            // Reset form fields
            setContractAddress('');
            setEventName('');
        } catch (err) {
            // --- CATCH THE NEW 403 ERROR ---
            // Set the error state with the message from the server's response
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
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
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300"
                >
                    {isLoading ? 'Deploying...' : 'Deploy Sentry'}
                </button>

                {/* --- DISPLAY THE ERROR MESSAGE --- */}
                {/* If the error state has a message, display it here */}
                {error && (
                    <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        <p>{error}</p>
                        {/* We can add an "Upgrade" button here later */}
                    </div>
                )}
            </form>
        </div>
    );
}