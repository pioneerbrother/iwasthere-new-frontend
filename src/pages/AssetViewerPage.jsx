import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams to get the asset ID from the URL.
import { apiService } from '../services/apiService'; // Our secure channel to the backend.

/**
 * @title Asset Viewer Page
 * @author Simo (iwasthere.watch)
 * @notice This is the secure data room for viewing a single Immortal Asset Ledger.
 * It displays the asset's core details, its complete event history, and all
 * associated documents. This is the final product our clients are paying for.
 */
function AssetViewerPage() {
    // Get the asset ID from the URL (e.g., /ledger/83)
    const { assetId } = useParams();
    
    const [ledger, setLedger] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLedgerDetails = async () => {
            try {
                // We call our backend to get the full details for this specific ledger.
                const response = await apiService.getLedgerDetails(assetId); // We will add this to apiService.
                setLedger(response.data.ledger);
            } catch (err) {
                setError("Failed to load asset ledger details.");
                console.error("Error fetching ledger details:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLedgerDetails();
    }, [assetId]); // This effect re-runs if the assetId in the URL changes.

    if (isLoading) {
        return <div className="p-8">Loading Asset Ledger...</div>;
    }

    if (error || !ledger) {
        return <div className="p-8 text-red-600">Error: {error || "Asset not found."}</div>;
    }

    return (
        <div className="p-8">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">{ledger.name}</h1>
                <p className="text-lg text-gray-500">{ledger.assetType} - Ledger ID: {ledger.id}</p>
                <a 
                    href={`https://polygonscan.com/tx/${ledger.blockchainTx}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:underline"
                >
                    View Initial Creation on Blockchain
                </a>
            </div>

            {/* Event History Timeline */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Event History</h2>
                <div className="space-y-6">
                    {ledger.eventHistory && ledger.eventHistory.length > 0 ? (
                        ledger.eventHistory.map((event, index) => (
                            <div key={index} className="flex">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 text-white font-bold">
                                        {index + 1}
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">{event.eventType}</h3>
                                    <p className="text-sm text-gray-500">
                                        Recorded on: {new Date(event.timestamp).toLocaleString()} by {event.recordedBy}
                                    </p>
                                    {/* This is the link to the permanent document on Arweave */}
                                    <a 
                                        href={`https://arweave.net/${event.documentURI}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:underline font-semibold"
                                    >
                                        View Document
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No events have been recorded for this asset yet.</p>
                    )}
                </div>
            </div>

            <div className="text-center mt-12">
                <Link to="/dashboard" className="font-bold text-gray-700 hover:text-gray-900 hover:underline">
                    ← Back to Dashboard
                </Link>
            </div>
        </div>
    );
}

export default AssetViewerPage;