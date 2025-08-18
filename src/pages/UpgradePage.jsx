import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createWalletClient, custom, parseUnits, createPublicClient, http } from 'viem';
import { polygon } from 'viem/chains';
import api from '../services/apiService';
import usdcAbi from '../usdcAbi.json';
import testTreasuryAbi from '../testTreasuryAbi.json';

const TEST_TREASURY_ADDRESS = '0xF5F80D53b62a6f4173Ea826E0DB7707E3979B749';
const USDC_CONTRACT_ADDRESS = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

const publicClient = createPublicClient({ chain: polygon, transport: http() });

export default function UpgradePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubscription = async (tier, amount) => {
        // ... (the handleSubscription function is correct and remains the same)
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center' }}>Upgrade Your Plan (Test Mode)</h1>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2rem' }}>
                {/* Pro Tier Card */}
                <div style={{ border: '1px solid #ccc', padding: '1.5rem', width: '300px', textAlign: 'center' }}>
                    <h2>Pro Tier</h2>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>$1 <span style={{ fontSize: '1rem' }}>/ month</span></p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
                        <li>Up to 25 Total Rules</li>
                        <li>High-Speed Alerts</li>
                    </ul>
                    <button onClick={() => handleSubscription('PRO', 1)} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Upgrade (1 USDC)'}
                    </button>
                </div>
                {/* Whale Tier Card */}
                <div style={{ border: '1px solid #000', padding: '1.5rem', width: '300px', textAlign: 'center' }}>
                    <h2>Whale Tier</h2>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>$2 <span style={{ fontSize: '1rem' }}>/ month</span></p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
                        <li>Unlimited Rules</li>
                        <li>API & Webhook Access</li>
                    </ul>
                    <button onClick={() => handleSubscription('WHALE', 2)} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Upgrade (2 USDC)'}
                    </button>
                </div>
            </div>
            {message && <p style={{ marginTop: '2rem', textAlign: 'center' }}><strong>Status:</strong> {message}</p>}
        </div>
    );
}