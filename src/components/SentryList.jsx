import React from 'react';

const formatAddress = (address) => {
    if (typeof address === 'string' && address.startsWith('0x') && address.length === 42) {
        return `${address.substring(0, 6)}...${address.substring(38)}`;
    }
    return <span style={{ color: 'orange' }}>[Invalid Data]</span>;
};

export default function SentryList({ sentries, isLoading }) {
    if (isLoading) return <p>Loading rules...</p>;
    return (
        <div style={{ marginTop: '1rem' }}>
            <h4>Your Active Sentries</h4>
            {(!sentries || sentries.length === 0) ? (
                <p>You have no active on-chain sentries.</p>
            ) : (
                <ul>{sentries.map(sentry => (<li key={sentry.id}><strong>Contract:</strong> {formatAddress(sentry.contractAddress)} | <strong>Event:</strong> {sentry.eventName}</li>))}</ul>
            )}
        </div>
    );
}