// src/pages/CreateLedgerWizardPage.jsx
import React, { useState } from 'react'; // <-- CORRECTED IMPORT
import { useNavigate } from 'react-router-dom';
import api from '../services/apiService';

function CreateLedgerWizardPage() {
    const [step, setStep] = useState(1);
    const [assetName, setAssetName] = useState('');
    const [initialOwnerAddress, setInitialOwnerAddress] = useState('');
    const [foundationalDocument, setFoundationalDocument] = useState(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleNextStep = () => {
        if (step === 1 && (!assetName || !initialOwnerAddress)) {
            setError("Asset name and owner address are required.");
            return;
        }
        setError('');
        setStep(step + 1);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault(); // <-- Add this to prevent default form submission
        setIsLoading(true);
        setError('');
        try {
            const response = await api.post('/ledgers/create', {
                name: assetName,
                ownerAddress: initialOwnerAddress 
            });
            
            const newLedgerId = response.data.id; 
            navigate(`/ledger/${newLedgerId}`);

        } catch (err) {
            setError(err.response?.data?.error || "Failed to create the asset ledger.");
            console.error("Ledger creation failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Step 1: Asset Details</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Asset Name</label>
                            <input type="text" placeholder="e.g., M/Y OPERA" value={assetName} onChange={e => setAssetName(e.target.value)} className="w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Initial Owner's Wallet Address</label>
                            <input type="text" placeholder="0x..." value={initialOwnerAddress} onChange={e => setInitialOwnerAddress(e.target.value)} className="w-full p-2 border rounded" />
                        </div>
                        <div className="flex justify-end mt-4">
                            <button onClick={handleNextStep} className="px-4 py-2 bg-gray-800 text-white rounded">Next</button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Step 2: Upload Foundational Document</h2>
                        <p className="text-sm text-gray-600 mb-2">Upload the primary blueprint or sales agreement (PDF).</p>
                        <input type="file" onChange={e => setFoundationalDocument(e.target.files[0])} className="w-full" />
                        <div className="flex justify-between mt-4">
                            <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-300 text-black rounded">Back</button>
                            <button onClick={handleNextStep} className="px-4 py-2 bg-gray-800 text-white rounded">Next</button>
                        </div>
                    </div>
                );
            case 3:
                 return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Step 3: Review and Confirm</h2>
                        <p><strong>Name:</strong> {assetName}</p>
                        <p><strong>Owner:</strong> {initialOwnerAddress}</p>
                        <p><strong>Document:</strong> {foundationalDocument?.name || 'No document selected'}</p>
                        <p className="mt-4 font-bold">The one-time creation fee for this asset class is X,XXX USDC.</p>
                        <div className="flex justify-between mt-4">
                            <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-300 text-black rounded">Back</button>
                            <button onClick={handleFormSubmit} disabled={isLoading} className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50">
                                {isLoading ? 'Processing...' : 'Confirm and Create Ledger'}
                            </button>
                        </div>
                    </div>
                );
            default:
                return <div>Unknown step</div>;
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Create New Immortal Asset Ledger</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                {error && <p className="text-red-600 bg-red-100 p-2 rounded mb-4">{error}</p>}
                {renderStep()}
            </div>
        </div>
    );
}

export default CreateLedgerWizardPage;