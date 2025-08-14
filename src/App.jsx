// File: new-frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';

// --- THIS IS THE FIX ---
// The router was trying to use these components without importing them first.
import BlogPage from './pages/BlogPage';
import PostPage from './pages/PostPage';


function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

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
            <div>
                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard" className="mr-4 hover:underline">Dashboard</Link>
                        <Link to="/profile" className="mr-4 hover:underline">Profile</Link>
                        <button onClick={handleSignOut} className="px-4 py-2 font-bold text-white bg-gray-800 rounded-lg">Sign Out</button>
                    </>
                ) : (
                    <>
                        <Link to="/blog" className="mr-4 hover:underline">Blog</Link>
                        <Link to="/login" className="px-4 py-2 font-bold text-white bg-gray-800 rounded-lg">Login / Sign Up</Link>
                    </>
                )}
            </div>
        </div>
      </header>
    );
}

// This component uses BlogPage and PostPage, which are now correctly imported.
function AppRoutes() {
    const { isAuthenticated } = useAuth();
    return (
        <Routes>
            <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<PostPage />} />
        </Routes>
    );
}

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