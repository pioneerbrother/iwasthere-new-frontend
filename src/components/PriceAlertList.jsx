// File: iwasthere/new-frontend/src/components/PriceAlertList.jsx
import React from 'react';

export default function PriceAlertList({ alerts, isLoading }) {
  if (isLoading) {
    return <p>Loading price alerts...</p>;
  }
  if (!alerts || alerts.length === 0) {
    return <p>You have no active price alerts.</p>;
  }
  return (
    <div>
      <h3>Your Price Alerts</h3>
      <ul>
        {alerts.map(alert => (
          <li key={alert.id}>
            Alert for <strong>{alert.assetId}</strong> to <strong>{alert.direction}</strong> by <strong>{alert.value}%</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}