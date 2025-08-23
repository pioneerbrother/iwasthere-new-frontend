// File: iwasthere/new-frontend/src/pages/UpgradePage.jsx
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
        setIsLoading(true);
        setMessage(`1/4: Initiating ${tier} subscription...`);
        try {
            if (!window.ethereum) throw new Error("Wallet not found. Please install MetaMask.");

            const walletClient = createWalletClient({ chain: polygon, transport: custom(window.ethereum) });
            const [account] = await walletClient.requestAddresses();
            const amountInSmallestUnit = parseUnits(amount.toString(), 6);

            setMessage('2/4: Please approve USDC spending in your wallet...');
            const approveHash = await walletClient.writeContract({
                address: USDC_CONTRACT_ADDRESS,
                abi: usdcAbi,
                functionName: 'approve',
                args: [TEST_TREASURY_ADDRESS, amountInSmallestUnit],
                account,
            });
            
            setMessage('3/4: Waiting for approval to be confirmed...');
            await publicClient.waitForTransactionReceipt({ hash: approveHash });

            setMessage('3/4: Approval confirmed. Please confirm payment...');
            const payHash = await walletClient.writeContract({
                address: TEST_TREASURY_ADDRESS,
                abi: testTreasuryAbi,
                functionName: 'paySubscription',
                args: [amountInSmallestUnit],
                account,
            });
            
            setMessage('4/4: Waiting for payment to be confirmed...');
            await publicClient.waitForTransactionReceipt({ hash: payHash });
            
            setMessage('4/4: Payment confirmed! Upgrading your account...');
            const response = await api.post('/user/upgrade', { newTier: tier, transactionHash: payHash });
            
            setMessage(`SUCCESS! ${response.data.message}. Redirecting...`);
            setTimeout(() => navigate('/dashboard'), 3000);

        } catch (err) {
            setMessage(`Error: ${err.shortMessage || err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center' }}>Upgrade Your Plan (Test Mode)</h1>
            <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Payments are processed on the Polygon network using USDC.</p>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2rem' }}>
                <div style={{ border: '1px solid #ccc', padding: '1.5rem', width: '300px', textAlign: 'center' }}>
                    <h2>Pro Tier</h2>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>$1 <span style={{ fontSize: '1rem' }}>/ month</span></p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
                        <li>Up to 25 Total Rules</li>
                        <li>High-Speed Alerts</li>
                        <li>Telegram Notifications</li>
                    </ul>
                    <button onClick={() => handleSubscription('PRO', 1)} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Upgrade (1 USDC)'}
                    </button>
                </div>
                <div style={{ border: '1px solid #000', padding: '1.5rem', width: '300px', textAlign: 'center' }}>
                    <h2>Whale Tier</h2>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>$2 <span style={{ fontSize: '1rem' }}>/ month</span></p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
                        <li>Unlimited Rules</li>
                        <li>Institutional Speed</li>
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