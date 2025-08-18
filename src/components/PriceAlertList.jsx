// File: iwasthere/new-frontend/src/components/PriceAlertList.jsx
import React from 'react';

export default function PriceAlertList({ alerts, isLoading }) {
    if (isLoading) return null;
    return (
        <div style={{ marginTop: '1rem' }}>
            <h3>Your Active Price Alerts</h3>
            {(!alerts || alerts.length === 0) ? (
                <p>You have no active price alerts.</p>
            ) : (
                <ul>
                    {alerts.map(alert => (
                        <li key={alert.id}>
                            Alert for <strong>{alert.assetId}</strong> to <strong>{alert.direction.toLowerCase()}</strong> to 
                            <strong> ${alert.value.toLocaleString()}</strong>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}