import React from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import DashboardPage from './pages/DashboardPage';
import CreateLedgerPage from './pages/CreateLedgerPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage'; // Assuming this is your professional marketing page
import BlogPage from './pages/BlogPage';
import PostPage from './pages/PostPage';

// Your brilliant ProtectedRoute component. It requires no changes.
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

// Your brilliant Header component, now with the new "Intelligence" link.
function Header() {
    const { isAuthenticated, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold">iwasthere.watch</Link>
            
            <div className="flex items-center gap-4">
                {/* --- THIS IS THE FINAL ADDITION --- */}
                {/* A public link to our new "Intelligence" hub. */}
                <Link to="/blog" className="text-sm font-semibold hover:underline">Intelligence</Link>

                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard" className="text-sm font-semibold hover:underline">Dashboard</Link>
                        <button onClick={handleSignOut} className="px-3 py-1.5 text-sm font-bold text-white bg-gray-800 rounded-md">Sign Out</button>
                    </>
                ) : (
                    <Link to="/login" className="px-3 py-1.5 text-sm font-bold text-white bg-gray-800 rounded-md">Login / Sign Up</Link>
                )}
            </div>
        </div>
      </header>
    );
}

// Your brilliant AppRoutes component, now with the new blog routes.
function AppRoutes() {
    const { isAuthenticated } = useAuth();
    return (
        <Routes>
            <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
            
            {/* Blog routes are public and available to everyone */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<PostPage />} />

            {/* These routes are protected by your secure logic */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/create-ledger" element={<ProtectedRoute><CreateLedgerPage /></ProtectedRoute>} />
        </Routes>
    );
}

// The main App component that assembles the empire. It requires no changes.
function App() {
    return (
        <AuthProvider>
            <Header />
            <main>
                <AppRoutes />
            </main>
        </AuthProvider>
    );
}

export default App;