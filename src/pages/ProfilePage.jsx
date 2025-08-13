// File: new-frontend/src/pages/ProfilePage.jsx

import React, { useState } from 'react';
import api from '../services/apiService'; // Our configured axios instance

function ProfilePage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            // Send the update command to our secure back-end endpoint
            const response = await api.post('/user/profile', { email });
            setSuccessMessage(response.data.message || 'Profile updated successfully!');
        } catch (err) {
            setError(err.response?.data?.error || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Profile</h1>

            <div className="bg-white shadow-md rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Notification Settings</h2>
                <p className="text-gray-600 mb-6">
                    This is the email address where your Sentry alerts will be sent.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-400"
                    >
                        {isLoading ? 'Saving...' : 'Save Settings'}
                    </button>

                    {error && <p className="mt-4 text-center text-red-500 text-sm">{error}</p>}
                    {successMessage && <p className="mt-4 text-center text-green-500 text-sm">{successMessage}</p>}
                </form>
            </div>
        </div>
    );
}

export default ProfilePage;