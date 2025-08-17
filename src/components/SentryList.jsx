import React from 'react';

export default function SentryList({ sentries, isLoading }) {
    if (isLoading) return <p>Loading your sentries...</p>;
    if (!sentries || sentries.length === 0) return <p>You have no active sentries. Add one to begin.</p>;

    return (
        <div>
            <h2>Your Active Sentries</h2>
            <ul>
                {sentries.map(sentry => (
                    <li key={sentry.id}>
                        <strong>Contract:</strong> {sentry.contractAddress} | <strong>Event:</strong> {sentry.eventName}
                    </li>
                ))}
            </ul>
        </div>
    );
}