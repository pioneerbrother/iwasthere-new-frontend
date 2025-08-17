// File: iwasthere/new-frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setError(error.message);
        }
        // On success, the AuthContext's onAuthStateChange listener will handle the redirect.
        setIsLoading(false);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage('Sign-up successful! Please check your email to verify your account.');
        }
        setIsLoading(false);
    };
    
    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({ provider: 'google' });
    };

    return (
        <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc' }}>
            <h2>Sign In / Sign Up</h2>
            
            <form>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
                    />
                </div>
                
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {message && <p style={{ color: 'green' }}>{message}</p>}

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <button type="submit" onClick={handleLogin} disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                    <button type="submit" onClick={handleSignUp} disabled={isLoading}>
                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </div>
            </form>

            <hr style={{ margin: '1rem 0' }} />

            <button onClick={handleGoogleLogin} disabled={isLoading} style={{ width: '100%' }}>
                Sign In with Google
            </button>
        </div>
    );
}