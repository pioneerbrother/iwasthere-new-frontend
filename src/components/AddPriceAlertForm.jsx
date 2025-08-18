// File: iwasthere/new-frontend/src/components/AddPriceAlertForm.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import the Link component
import assetList from '../data/assetList.json';
import api from '../services/apiService';

export default function AddPriceAlertForm({ onAlertCreated }) {
    // ... (all the state and handleSubmit logic is correct and remains the same)

    return (
        <div /* ... */ >
            <h2>Add New Price Alert</h2>
            <form onSubmit={handleSubmit} noValidate>
                {/* ... all the form inputs are correct ... */}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Setting Alert...' : 'Set Price Alert'}
                </button>
                
                {/* --- THIS IS THE FIX --- */}
                {error && (
                    <div style={{ marginTop: '1rem', color: 'red' }}>
                        <p>{error}</p>
                        {/* If the error is the specific "limit reached" message, show the Upgrade button. */}
                        {error.includes('limit reached') && (
                            <Link to="/upgrade">
                                <button style={{ marginTop: '0.5rem', cursor: 'pointer' }}>Upgrade Now</button>
                            </Link>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
}