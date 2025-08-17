import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import UpgradePage from './pages/UpgradePage.jsx';

function Header() {
    const { isAuthenticated, signOut } = useAuth();
    return (
        <header>
                 <nav>
                <Link to="/">Sentry</Link>
                {/* The Web3Modal button will automatically show "Connect Wallet" or the user's address */}
                <w3m-button /> 
                {isAuthenticated && <button onClick={signOut}>Sign Out</button>}
            </nav>
            <h1>iwasthere.watch</h1>
            {isAuthenticated && <button onClick={signOut}>Sign Out</button>}
        </header>
    );
}

// This is the main router component.
function AppContent() {
    const { isAuthenticated, isLoading } = useAuth();

    // --- THIS IS THE FINAL FIX ---
    // We now correctly handle the loading state here.
    // This will show a message and prevent the blank screen.
    if (isLoading) {
        return <div>Loading Application...</div>;
    }

    return (
        <Routes>
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <HomePage />} />
            <Route path="/upgrade" element={<ProtectedRoute><UpgradePage /></ProtectedRoute>} />
        </Routes>
    );
}

// The App component assembles everything.
function App() {
  return (
    <AuthProvider>
      <Header />
      <main>
        <AppContent />
      </main>
    </AuthProvider>
  );
}

export default App;