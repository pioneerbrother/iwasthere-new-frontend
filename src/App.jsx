// File: iwasthere/new-frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import UpgradePage from './pages/UpgradePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx'; // For user settings

// --- THIS IS THE FIX: The ProtectedRoute component was missing ---
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

function Header() {
    const { isAuthenticated, signOut } = useAuth();
    return (
        <header style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ fontWeight: 'bold' }}>iwasthere.watch</Link>
            <div>
                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
                        <Link to="/profile" style={{ marginRight: '1rem' }}>Profile</Link>
                        <button onClick={signOut}>Sign Out</button>
                    </>
                ) : (
                    <Link to="/login">
                        <button>Login / Sign Up</button>
                    </Link>
                )}
            </div>
        </header>
    );
}

function AppContent() {
    return (
        <main>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/upgrade" element={<ProtectedRoute><UpgradePage /></ProtectedRoute>} />
            </Routes>
        </main>
    );
}

function App() {
    return (
        <AuthProvider>
            <Header />
            <AppContent />
        </AuthProvider>
    );
}

export default App;