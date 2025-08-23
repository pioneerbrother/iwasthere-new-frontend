// File: iwasthere/new-frontend/src/components/SentryList.jsx
import React from 'react';

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
                            <strong>Contract:</strong> {sentry.contractAddress} | <strong>Event:</strong> {sentry.eventName}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}