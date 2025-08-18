// File: iwasthere/new-frontend/src/components/SentryList.jsx
import React from 'react';

// This is a much safer function to display addresses.
const formatAddress = (address) => {
    // Check if the address is a valid-looking Ethereum address string.
    if (typeof address === 'string' && address.startsWith('0x') && address.length === 42) {
        return `${address.substring(0, 6)}...${address.substring(38)}`;
    }
    // If the data is corrupted or invalid, we display a safe message.
    return <span style={{ color: 'orange' }}>[Invalid Data]</span>;
};

export default function SentryList({ sentries, isLoading }) {
    if (isLoading) return <p>Loading your sentries...</p>;
    
    return (
        <div style={{ marginTop: '1rem' }}>
            <h3>Your Active Sentries</h3>
            {(!sentries || sentries.length === 0) ? (
                <p>You have no active on-chain sentries.</p>
            ) : (
                <ul>
                    {sentries.map(sentry => (
                        <li key={sentry.id}>
                            <strong>Contract:</strong> {formatAddress(sentry.contractAddress)} | <strong>Event:</strong> {sentry.eventName}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}