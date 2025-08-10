// File: src/components/SentryList.jsx
import React from 'react';

function SentryList({ sentries, isLoading }) {
    if (isLoading) {
        return <p className="p-4 text-gray-500">Loading your watchlist...</p>;
    }

    return (
        <div className="mt-8 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 p-4 border-b">Your Active Sentries</h2>
            <ul className="divide-y divide-gray-200">
                {sentries.length > 0 ? (
                    sentries.map(sentry => (
                        <li key={sentry.id} className="p-4">
                            <p className="font-mono text-sm text-gray-700">
                                <strong>Contract:</strong> {sentry.contractAddress}
                            </p>
                            <p className="font-mono text-sm text-gray-500">
                                <strong>Event:</strong> {sentry.eventName}
                            </p>
                        </li>
                    ))
                ) : (
                    <p className="p-4 text-gray-500">
                        You have no active Sentries. Add one above to begin monitoring.
                    </p>
                )}
            </ul>
        </div>
    );
}

export default SentryList;