// File: src/components/AddSentryForm.jsx
import React, { useState } from 'react';
import api from '../services/apiService';
// We need ethers to perform the signature for the POST request
import { ethers } from 'ethers';

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
            if (!window.ethereum) throw new Error("MetaMask is not installed.");

            // --- THIS IS THE CRITICAL LOGIC THAT WAS MISSING ---
            // We must perform the signature authentication before we can create a Sentry.

            // 1. Connect to wallet and get the signer
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const walletAddress = await signer.getAddress();

            // 2. Create the unique challenge message
            const message = `Sign this message to create a Sentry for ${contractAddress}. Nonce: ${Date.now()}`;
            
            // 3. Get the cryptographic proof
            const signature = await signer.signMessage(message);

            // 4. Send the command AND the proof to our secure back-end
            const response = await api.post('/sentries', {
                // The signature proof for the middleware
                walletAddress,
                message,
                signature,
                // The actual data for the new Sentry
                contractAddress,
                eventName
            });
            
            onSentryCreated(response.data); // Notify the dashboard of our victory
            setContractAddress('');
            setEventName(''); // Reset the form

        } catch (err) {
            setError(err.response?.data?.error || "Failed to create Sentry.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Sentry</h2>
            
            {/* The form tag now correctly uses the handleSubmit function */}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Contract Address</label>
                    <input
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                        className="font-mono w-full p-2 border rounded"
                        placeholder="0x..."
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700">Event Name</label>
                    <input
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        className="font-mono w-full p-2 border rounded"
                        placeholder="e.g., Transfer"
                        required
                    />
                </div>
                {/* The button is now a proper submit button for the form */}
                <button type="submit" disabled={isLoading} className="bg-blue-600 text-white font-bold py-2 px-4 rounded w-full">
                    {isLoading ? 'Deploying...' : 'Deploy Sentry'}
                </button>
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </form>
        </div>
    );
}

export default AddSentryForm;