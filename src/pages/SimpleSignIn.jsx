import React, { useState } from 'react';
// --- CORRECTED: Using a named import to match apiService.js ---
import { login } from '../services/apiService';

function SimpleSignIn() {
    const [email, setEmail] = useState('simouzel@gmail.com');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const response = await login({ email, password }); // Direct call
            setMessage(`VICTORY! Login Successful. Token: ${response.data.token.substring(0, 30)}...`);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;
            setMessage(`Login Failed: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto' }}>
            <h1>Direct Sign-In Test</h1>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '1rem' }}><label>Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px' }} required /></div>
                <div style={{ marginBottom: '1rem' }}><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '8px' }} required /></div>
                <button type="submit" disabled={isLoading} style={{ padding: '10px 20px' }}>{isLoading ? 'Logging In...' : 'Attempt Login'}</button>
            </form>
            {message && <div style={{ marginTop: '20px', padding: '10px', border: '1px solid black' }}><h3>Result:</h3><p>{message}</p></div>}
        </div>
    );
}

export default SimpleSignIn;