// File: iwasthere/new-frontend/src/components/SentryList.jsx
import React from 'react';

// A helper function to safely shorten an address
const shortenAddress = (address) => {
    if (typeof address === 'string' && address.startsWith('0x') && address.length > 10) {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }
    // If the address is invalid or too short, return it as is but truncated
    return typeof address === 'string' ? address.substring(0, 30) : 'Invalid Address';
};

export default function SentryList({ sentries, isLoading }) {
    if (isLoading) return <p>Loading rules...</p>;
    
    return (
        <div style={{ marginTop: '1rem' }}>
            <h3>Your Active Sentries</h3>
            {(!sentries || sentries.length === 0) ? (
                <p>You have no active on-chain sentries.</p>
            ) : (
                <ul>
                    {sentries.map(sentry => (
                        <li key={sentry.id}>
                            {/* --- THIS IS THE FIX --- */}
                            <strong>Contract:</strong> {shortenAddress(sentry.contractAddress)} | <strong>Event:</strong> {sentry.eventName}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}