// File: iwasthere/new-frontend/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import UpgradePage from './pages/UpgradePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

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

function Header() {
    const { isAuthenticated, signOut } = useAuth();
    return (
        <header style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
                iwasthere.watch
            </Link>
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
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/upgrade" element={<ProtectedRoute><UpgradePage /></ProtectedRoute>} />
            </Routes>
        </main>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Header />
                <AppContent />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;