import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/apiService';
import { ethers } from 'ethers';

function DashboardPage() {
    const [sentries, setSentries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [contractAddress, setContractAddress] = useState('');
    const [eventName, setEventName] = useState('');

    // --- GETTING the list of sentries ---
    // This now correctly uses a simple, body-less GET request.
    const fetchSentries = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/sentries');
            setSentries(response.data.sentries);
        } catch (err) {
            setError('Failed to load watchlist.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSentries();
    }, [fetchSentries]);

    // --- CREATING a new sentry ---
    // This correctly uses a POST request with a signature in the body.
    const handleCreateSentry = async (e) => {
        e.preventDefault();
        try {
            if (!window.ethereum) throw new Error("MetaMask is not installed.");
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const walletAddress = await signer.getAddress();
            const message = `Sign to create a Sentry for ${contractAddress}. Nonce: ${Date.now()}`;
            const signature = await signer.signMessage(message);

            const response = await api.post('/sentries/create', {
                walletAddress,
                message,
                signature,
                contractAddress, // The actual data for the new sentry
                eventName,
            });
            
            // Add the new sentry to the top of the list
            setSentries(prev => [response.data, ...prev]);
            setContractAddress('');
            setEventName('');

        } catch (error) {
            alert("Failed to create Sentry.");
        }
    };

    return (
        <div className="p-8">
            <h1>Sentry Command Center</h1>
            <form onSubmit={handleCreateSentry}>
                <input value={contractAddress} onChange={e => setContractAddress(e.target.value)} placeholder="Contract Address" required />
                <input value={eventName} onChange={e => setEventName(e.target.value)} placeholder="Event Name" required />
                <button type="submit">Deploy Sentry</button>
            </form>
            <hr />
            <h2>Your Active Sentries</h2>
            {isLoading ? <p>Loading...</p> : <ul>{sentries.map(s => <li key={s.id}>{s.contractAddress}</li>)}</ul>}
        </div>
    );
}

export default DashboardPage;