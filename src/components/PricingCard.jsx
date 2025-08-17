// File: iwasthere/new-frontend/src/components/PricingCard.jsx
import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import api from '../services/apiService';

// --- SMART CONTRACT CONFIGURATION ---
const TREASURY_CONTRACT_ADDRESS = "0xa3DAae3fc1F9BEDaDADA9B0e49d4eb075FedC231";
const USDC_CONTRACT_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const TREASURY_ABI = [ /* We will add the ABI here */ ];
const USDC_ABI = [ /* We will add the ABI here */ ];


function PricingCard({ tier, price, description, features }) {
    const { address } = useAccount();
    const [status, setStatus] = useState('');
    const [txHash, setTxHash] = useState(null);

    // Wagmi hook for writing to contracts
    const { writeContract, data: writeData, error: writeError } = useWriteContract();

    // Wagmi hook to wait for a transaction to be mined
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ 
        hash: writeData, 
    });

    const handleUpgrade = async () => {
        setStatus('1/3: Preparing transaction...');
        const amountInSmallestUnit = parseUnits(price, 6); // USDC has 6 decimals

        // 1. APPROVE
        setStatus('2/3: Please approve USDC spending in your wallet...');
        writeContract({
            address: USDC_CONTRACT_ADDRESS,
            abi: USDC_ABI,
            functionName: 'approve',
            args: [TREASURY_CONTRACT_ADDRESS, amountInSmallestUnit],
        });

        // After writeContract is called, `writeData` will get the tx hash,
        // and the `useWaitForTransactionReceipt` hook will start listening.
    };

    // This effect runs when the approval transaction is successful
    React.useEffect(() => {
        if (isSuccess && status === '2/3: Please approve USDC spending in your wallet...') {
            const amountInSmallestUnit = parseUnits(price, 6);
            
            // 2. PAY
            setStatus('3/3: Approval successful! Please confirm the payment...');
            writeContract({
                address: TREASURY_CONTRACT_ADDRESS,
                abi: TREASURY_ABI,
                functionName: 'paySubscription',
                args: [amountInSmallestUnit],
            });
        }
    }, [isSuccess, status, writeContract, price]);

    // This effect runs when the final payment transaction is successful
    React.useEffect(() => {
        if (isSuccess && status === '3/3: Approval successful! Please confirm the payment...') {
            // 3. VERIFY with our backend
            const verify = async () => {
                setStatus('Verification: Confirming payment on-chain...');
                try {
                    await api.post('/user/upgrade', { newTier: tier, transactionHash: writeData });
                    setStatus(`SUCCESS! Your upgrade to ${tier} is complete.`);
                } catch (error) {
                    setStatus('ERROR: Payment was successful, but failed to update your account. Please contact support.');
                }
            }
            verify();
        }
    }, [isSuccess, status, tier, writeData]);


    return (
        <div style={{ border: '1px solid #ddd', padding: '1.5rem', width: '300px' }}>
            <h3>{tier}</h3>
            <h1>${price} <span style={{fontSize: '1rem'}}>/ month</span></h1>
            <p>{description}</p>
            <ul>
                {features.map(f => <li key={f}>{f}</li>)}
            </ul>
            <button onClick={handleUpgrade} disabled={isLoading || isSuccess}>
                {isLoading ? 'Processing...' : `Upgrade to ${tier}`}
            </button>
            {status && <p style={{marginTop: '1rem', fontSize: '0.9rem'}}>{status}</p>}
            {writeError && <p style={{color: 'red'}}>Error: {writeError.message}</p>}
        </div>
    );
}

export default PricingCard;