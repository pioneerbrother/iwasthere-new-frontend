// File: iwasthere/new-frontend/src/pages/ProfilePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/apiService';
import { useAuth } from '../contexts/AuthContext.jsx';
import { createWalletClient, custom, parseUnits, createPublicClient, http } from 'viem';
import { polygon } from 'viem/chains';
import usdcAbi from '../usdcAbi.json';
import testTreasuryAbi from '../testTreasuryAbi.json';

const TEST_TREASURY_ADDRESS = '0xF5F80D53b62a6f4173Ea826E0DB7707E3979B749';
const USDC_CONTRACT_ADDRESS = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

const publicClient = createPublicClient({ chain: polygon, transport: http() });

export default function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/user/profile');
            setProfile(data);
            setEmail(data.email || '');
            setPhone(data.phone || '');
        } catch (error) {
            setMessage('Error: Could not load your profile.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setMessage('Saving...');
        try {
            const { data } = await api.post('/user/profile', { email, phone });
            setMessage('Profile updated successfully!');
            setProfile(data.user);
        } catch (error) {
            setMessage('Error: Failed to update profile.');
        }
    };

    const handlePurchaseCredits = async () => {
        setIsLoading(true);
        setMessage('Initiating credit purchase...');
        try {
            const walletClient = createWalletClient({ chain: polygon, transport: custom(window.ethereum) });
            const [account] = await walletClient.requestAddresses();
            const amountInSmallestUnit = parseUnits("5", 6);

            setMessage('Please approve USDC spending...');
            const approveHash = await walletClient.writeContract({
                address: USDC_CONTRACT_ADDRESS,
                abi: usdcAbi,
                functionName: 'approve',
                args: [TEST_TREASURY_ADDRESS, amountInSmallestUnit],
                account,
            });
            await publicClient.waitForTransactionReceipt({ hash: approveHash });

            setMessage('Please confirm payment...');
            const payHash = await walletClient.writeContract({
                address: TEST_TREASURY_ADDRESS,
                abi: testTreasuryAbi,
                functionName: 'paySubscription',
                args: [amountInSmallestUnit],
                account,
            });
            await publicClient.waitForTransactionReceipt({ hash: payHash });

            setMessage('Verifying payment and adding credits...');
            await api.post('/credits/purchase', { transactionHash: payHash, creditAmount: 100 });
            
            setMessage('Success! 100 Alert Credits added.');
            fetchProfile();
        } catch (err) {
            setMessage(`Error: ${err.shortMessage || err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading your profile...</div>;
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Your Profile</h1>
            <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
                <h2>Notification Settings</h2>
                <form onSubmit={handleProfileUpdate}>
                    <div>
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        <label>Phone Number (for SMS alerts, include country code e.g., +1)</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <button type="submit" style={{ marginTop: '1rem' }}>Save Settings</button>
                </form>
            </div>
            <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
                <h2>Alert Credits</h2>
                <p>Your current balance: <strong>{profile?.alertCredits || 0} credits</strong></p>
                <p>Purchase credits to receive premium SMS alerts. Each SMS costs 1 credit.</p>
                <button onClick={handlePurchaseCredits} disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Buy 100 Credits (5 USDC)'}
                </button>
            </div>
            {message && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Status: {message}</p>}
        </div>
    );
}