// File: iwasthere/new-frontend/src/pages/ProfilePage.jsx
// This is your own excellent code, with minor UX refinements.

import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/apiService';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [webhookUrl, setWebhookUrl] = useState('');
    const [newApiKey, setNewApiKey] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // --- REFINEMENT 1: Better state for user feedback ---
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const clearMessages = () => {
        setSuccessMessage('');
        setErrorMessage('');
    };

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/user/profile');
            setProfile(data);
            setEmail(data.email || '');
            setPhone(data.phone || '');
            setWebhookUrl(data.webhookUrl || '');
        } catch (error) {
            setErrorMessage('Could not load your profile.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        clearMessages();
        try {
            const { data } = await api.post('/user/profile', { email, phone, webhookUrl });
            setSuccessMessage('Profile updated successfully!');
            setProfile(data.user);
        } catch (error) {
            setErrorMessage('Failed to update profile.');
        }
    };

    const handleGenerateKey = async () => {
        clearMessages();
        try {
            const { data } = await api.post('/user/api-key/generate');
            setNewApiKey(data.apiKey);
            setSuccessMessage(data.message); // The backend provides a good success message
            fetchProfile(); // Refresh profile to show 'Active' status
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'Failed to generate key.');
        }
    };
    
    const handleRevokeKey = async () => {
        clearMessages();
        if (!window.confirm("Are you sure? This will break any existing integrations using this key.")) {
            return;
        }
        try {
            const { data } = await api.post('/user/api-key/revoke');
            setNewApiKey(null);
            setSuccessMessage(data.message);
            fetchProfile(); // Refresh profile to show 'None' status
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'Failed to revoke key.');
        }
    };

    if (isLoading) {
        return <div>Loading your profile...</div>;
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
            <h1>Your Profile</h1>

            {/* --- REFINEMENT 2: Display feedback messages clearly --- */}
            {successMessage && <p style={{ padding: '1rem', background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' }}>{successMessage}</p>}
            {errorMessage && <p style={{ padding: '1rem', background: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' }}>{errorMessage}</p>}
            
            <div style={{ border: '1px solid #ccc', padding: '1.5rem', marginTop: '1rem' }}>
                <h2>Notification Settings</h2>
                <form onSubmit={handleProfileUpdate}>
                    {/* ... your form inputs are perfect ... */}
                    <div>
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{width: '100%', padding: '8px', marginTop: '4px'}}/>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        <label>Phone Number (for SMS alerts)</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={{width: '100%', padding: '8px', marginTop: '4px'}}/>
                    </div>
                    {profile?.subscriptionStatus === 'WHALE' && (
                        <div style={{ marginTop: '1rem' }}>
                            <label>Webhook URL</label>
                            <input type="url" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} style={{width: '100%', padding: '8px', marginTop: '4px'}}/>
                        </div>
                    )}
                    <button type="submit" style={{ marginTop: '1rem' }}>Save Settings</button>
                </form>
            </div>

            {profile?.subscriptionStatus === 'WHALE' && (
                <div style={{ border: '1px solid #ccc', padding: '1.5rem', marginTop: '2rem' }}>
                    <h2>API Settings (Whale Tier)</h2>
                    
                    {/* --- REFINEMENT 3: Better API Key Display --- */}
                    {newApiKey && (
                        <div style={{ border: '1px dashed #c9302c', background: '#f5f5f5', padding: '1rem', marginBottom: '1rem' }}>
                            <p style={{marginTop: 0}}><strong>Please copy your new API Key.</strong></p>
                            <p style={{color: '#c9302c', fontWeight: 'bold'}}>This is the only time you will be able to see it.</p>
                            <code style={{ background: '#e0e0e0', padding: '10px', display: 'block', wordWrap: 'break-word' }}>
                                {newApiKey}
                            </code>
                        </div>
                    )}

                    <p>Your current API Key status: <strong>{profile.apiKey ? '✅ Active' : '⚪ None'}</strong></p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button onClick={handleGenerateKey}>Generate New API Key</button>
                        {profile.apiKey && <button onClick={handleRevokeKey} style={{background: '#d9534f', color: 'white'}}>Revoke API Key</button>}
                    </div>
                </div>
            )}
        </div>
    );
}