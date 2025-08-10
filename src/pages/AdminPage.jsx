import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Our custom hook for authentication
import { useNavigate, Link } from 'react-router-dom'; // For redirection after login

const AdminPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isLoading } = useAuth(); // Get the login function from our context
    const navigate = useNavigate(); // Get the navigation function

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Call the login function from our AuthContext.
            // It handles the API call, sets the token, and updates the user state.
            await login({ email, password });

            // If login is successful, redirect to the secure client dashboard.
            navigate('/dashboard');

        } catch (err) {
            setError(err.response?.data?.error || err.message || 'An unknown error occurred.');
        }
    };

    return (
        <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg border">
            <h1 className="text-3xl font-bold text-center text-gray-900">Enterprise Portal Login</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 mt-1 border rounded-md"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 mt-1 border rounded-md"
                    />
                </div>

                {error && <div className="p-3 text-red-800 bg-red-100 rounded-md">{error}</div>}

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </div>
            </form>

            <div className="text-center text-sm">
                <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default AdminPage;