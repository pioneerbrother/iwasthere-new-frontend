// File: iwasthere/new-frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';

// Import our new custom wallet connect button
import ConnectWallet from './components/ConnectWallet.jsx';

// Import all page components
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import UpgradePage from './pages/UpgradePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

// This component protects routes that require a user to be logged in
function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading session...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

// This is the main header for the application
function Header() {
    const { isAuthenticated, signOut } = useAuth();
    return (
        <header style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
                iwasthere.watch
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* --- THIS IS OUR NEW, CUSTOM CONNECT BUTTON --- */}
                <ConnectWallet />
                
                {/* This section only appears if the user is logged in via Supabase */}
                {isAuthenticated && (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/profile">Profile</Link>
                        <button onClick={signOut}>Sign Out</button>
                    </>
                )}
            </div>
        </header>
    );
}

// This component defines all the URL routes for the application
function AppRoutes() {
    return (
        <main style={{ padding: '1rem' }}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes */}
                <Route 
                    path="/dashboard"
                    element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
                />
                <Route 
                    path="/profile"
                    element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
                />
                <Route 
                    path="/upgrade"
                    element={<ProtectedRoute><UpgradePage /></ProtectedRoute>}
                />
            </Routes>
        </main>
    );
}

// This is the top-level App component
function App() {
    return (
        <AuthProvider>
            <Header />
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;