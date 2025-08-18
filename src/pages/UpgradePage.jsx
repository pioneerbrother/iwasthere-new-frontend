// File: iwasthere/new-frontend/src/pages/UpgradePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// ... (all the viem and ABI imports are correct) ...

// --- Test Treasury and USDC addresses are correct ---
const TEST_TREASURY_ADDRESS = '0xF5F80D53b62a6f4173Ea826E0DB7707E3979B749';
const USDC_CONTRACT_ADDRESS = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

// ... (the publicClient and handleSubscription logic are correct) ...

function UpgradePage() {
    // ... (all the state and the handleSubscription function are correct) ...

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center' }}>Upgrade Your Plan (Test Mode)</h1>
            <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
                Unlock the full power of Sentry. All payments are processed on the Polygon network.
            </p>
            
            {/* --- THIS IS THE FIX --- */}
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2rem' }}>
                {/* Pro Tier Card */}
                <div style={{ border: '1px solid #ccc', padding: '1.5rem', width: '300px', textAlign: 'center' }}>
                    <h2>Pro Tier</h2>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>$1 <span style={{ fontSize: '1rem' }}>/ month</span></p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
                        <li>Up to 25 Total Rules</li>
                        <li>High-Speed Alerts</li>
                        <li>Telegram Notifications</li>
                    </ul>
                    <button onClick={() => handleSubscription('PRO', 1)} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Upgrade to Pro (1 USDC)'}
                    </button>
                </div>

                {/* Whale Tier Card */}
                <div style={{ border: '1px solid #000', padding: '1.5rem', width: '300px', textAlign: 'center' }}>
                    <h2>Whale Tier</h2>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>$2 <span style={{ fontSize: '1rem' }}>/ month</span></p>
                     <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
                        <li>Unlimited Rules</li>
                        <li>Institutional Speed</li>
                        <li>API & Webhook Access</li>
                    </ul>
                    <button onClick={() => handleSubscription('WHALE', 2)} disabled={isLoading}>
                        Upgrade to Whale (2 USDC)
                    </button>
                </div>
            </div>

            {message && <p style={{ marginTop: '2rem', textAlign: 'center', fontWeight: 'bold' }}>Status: {message}</p>}
        </div>
    );
}

export default UpgradePage;
