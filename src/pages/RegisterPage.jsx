import React, { useState } from 'react';
import { apiService } from '../services/apiService'; // Import our new, professional API service
import { Link } from 'react-router-dom'; // Import Link for navigation

const RegisterPage = () => {
    // --- State Management ---
    // We use state to manage the form inputs, loading status, and any errors or successes.
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        companyName: '',
        role: 'SHIPYARD', // We default the role to SHIPYARD for our primary clients
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // --- Handlers ---
    // This function updates our state whenever a user types in a form field.
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // This function is triggered when the user submits the form.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default browser form submission
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            // Call our new apiService to send the registration data to the server.
            const response = await apiService.register(formData);
            const newUser = response.data; // Axios nests the response data under a 'data' property
            setSuccess(`Registration Successful! Welcome, ${newUser.companyName}. You can now proceed to login.`);
            
        } catch (err) {
            // If the API call fails, we catch the error and display it to the user.
            setError(err.response?.data?.error || err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <h1 className="text-3xl font-bold text-center text-gray-900">Enterprise Partner Registration</h1>
            <p className="text-center text-gray-600">
                Create an account to begin managing your Immutable Asset Ledgers.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Lürssen Shipyard"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Work Email Address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., project.manager@lurssen.com"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength="8"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Minimum 8 characters"
                    />
                </div>

                {/* Display error or success messages */}
                {error && <div className="p-3 text-sm text-red-800 bg-red-100 border border-red-300 rounded-md">{error}</div>}
                {success && <div className="p-3 text-sm text-green-800 bg-green-100 border border-green-300 rounded-md">{success}</div>}
                
                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                        {isLoading ? 'Creating Account...' : 'Create Secure Account'}
                    </button>
                </div>
            </form>

            <div className="text-center text-sm">
                <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link to="/admin" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;