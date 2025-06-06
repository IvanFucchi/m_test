import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import VerifyEmail from './components/auth/VerifyEmail';


import Header from './components/layout/Footer';
// Pages
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ExplorePage from './pages/ExplorePage';
import SpotDetailPage from './pages/SpotDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ShadLoginPage from './pages/ShadLoginPage';
import OAuthCallback from './components/auth/OAuthCallback';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Componente per route admin (richiede ruolo admin)
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<ShadLoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            {/* Dynamic route for spot details */}
            <Route path="spots/:id" element={<SpotDetailPage />} />
            
            {/* Protected routes */}
            <Route 
              path="profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            
              {/* Route admin */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              } />
            
            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
