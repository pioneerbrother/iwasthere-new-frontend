// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
        else navigate('/dashboard');
        setIsLoading(false);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setError(error.message);
        else alert('Sign up successful! Check your email to verify.');
        setIsLoading(false);
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Sign In / Sign Up</h1>
            <form className="bg-white shadow-md rounded-lg p-8">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3"/>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3"/>
                </div>
                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                <div className="flex items-center justify-between">
                    <button onClick={handleLogin} disabled={isLoading} className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">Sign In</button>
                    <button onClick={handleSignUp} disabled={isLoading} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Sign Up</button>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;