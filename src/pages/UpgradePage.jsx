// File: iwasthere/new-frontend/src/pages/UpgradePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createWalletClient, custom, parseUnits, createPublicClient, http } from 'viem';
import { polygon } from 'viem/chains';
import api from '../services/apiService';
import usdcAbi from '../usdcAbi.json';
import testTreasuryAbi from '../testTreasuryAbi.json';

// --- TEST MODE CONFIGURATION ---
const TEST_TREASURY_ADDRESS = '0xF5F80D53b62a6f4173Ea826E0DB7707E3979B749';
const USDC_CONTRACT_ADDRESS = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

const publicClient = createPublicClient({ chain: polygon, transport: http() });

function UpgradePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubscription = async (tier, amount) => {
        setIsLoading(true);
        setMessage(`1/4: Initiating ${tier} test subscription...`);
        try {
            if (!window.ethereum) throw new Error("Wallet not found.");
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
            
            setMessage('4/4: Payment confirmed! Verifying and upgrading account...');
            const response = await api.post('/user/upgrade', { newTier: tier, transactionHash: payHash });
            
            setMessage(`SUCCESS! ${response.data.message}`);
            setTimeout(() => navigate('/dashboard'), 3000);
        } catch (err) {
            setMessage(`Error: ${err.shortMessage || err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Upgrade Plan (Test Mode)</h1>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <div>
                    <h2>Pro Tier (Test)</h2>
                    <p>$1 USDC</p>
                    <button onClick={() => handleSubscription('PRO', 1)} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Upgrade to Pro (1 USDC)'}
                    </button>
                </div>
                <div>
                    <h2>Whale Tier (Test)</h2>
                    <p>$2 USDC</p>
                    <button onClick={() => handleSubscription('WHALE', 2)} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Upgrade to Whale (2 USDC)'}
                    </button>
                </div>
            </div>
            {message && <p style={{ marginTop: '1rem' }}><strong>Status:</strong> {message}</p>}
        </div>
    );
}

export default UpgradePage;