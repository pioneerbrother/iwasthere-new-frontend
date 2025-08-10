// src/pages/CreateLedgerPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiService'; // Our Axios instance

function CreateLedgerPage() {
    const [projectName, setProjectName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!projectName) {
            setError('Project name is required.');
            setIsLoading(false);
            return;
        }

        try {
            // The auth token (JWT from Web3 login) should already be set by your main app's logic.
            // We just need to call the create endpoint.
            const response = await api.post('/ledgers/create', {
                name: projectName,
            });

            // On success, go back to the dashboard to see the new project.
            navigate('/dashboard');

        } catch (err) {
            console.error("Failed to create ledger:", err);
            setError(err.response?.data?.error || "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Create New Asset Ledger</h1>
            
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
                <div className="mb-4">
                    <label htmlFor="projectName" className="block text-gray-700 text-sm font-bold mb-2">
                        Project Name
                    </label>
                    <input
                        id="projectName"
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="e.g., 'Superyacht Hull #802 - M/Y Neptune'"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

                <div className="flex items-center justify-end">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
                    >
                        {isLoading ? 'Creating...' : 'Create Ledger'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateLedgerPage;