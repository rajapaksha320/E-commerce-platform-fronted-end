/* eslint-disable no-unused-vars */
// components/auth/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '../../store/slices/authSlice';
import AuthModal from '../authComponents/AuthModal';

const ProtectedRoute = ({ children, allowedRoles = [], requireAuth = true }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Define routes for each role
  const roleRoutes = {
    buyer: ['/wish-list', '/shopping-cart', '/profile', '/orders', '/track-parcel'],
    seller: ['/seller-dashboard', '/create-listing', '/seller/*'],
  };

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      // Show login modal instead of redirecting
      setShowAuthModal(true);
    }
  }, [requireAuth, isAuthenticated]);

  const handleModalClose = () => {
    setShowAuthModal(false);
    // Optionally redirect to home if not authenticated
    if (!isAuthenticated) {
      <Navigate to="/" replace />;
    }
  };

  const handleLogin = (email) => {
    setShowAuthModal(false);
  };

  // Check if user has access to the current route
  const hasAccess = () => {
    if (!requireAuth) return true;
    if (!isAuthenticated) return false;
    
    // If no specific roles required, just check authentication
    if (allowedRoles.length === 0) return true;
    
    // Check if user role is in allowed roles
    return allowedRoles.includes(userRole);
  };

  // Check if current path is allowed for user role
  const isPathAllowedForRole = () => {
    if (!userRole || !roleRoutes[userRole]) return true;
    
    const currentPath = location.pathname;
    const allowedPaths = roleRoutes[userRole];
    
    return allowedPaths.some(path => {
      if (path.endsWith('/*')) {
        const basePath = path.slice(0, -2);
        return currentPath.startsWith(basePath);
      }
      return currentPath === path;
    });
  };

  // Show auth modal if not authenticated and auth is required
  if (requireAuth && !isAuthenticated) {
    return (
      <>
        <AuthModal
          isOpen={showAuthModal}
          onClose={handleModalClose}
          initialView="login"
          onLogin={handleLogin}
        />
        {/* Optionally show a loading state or redirect */}
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-500">Please log in to access this page.</p>
          </div>
        </div>
      </>
    );
  }

  // Check role-based access
  if (!hasAccess()) {
    return <Navigate to="/" replace />;
  }

  // Check if path is allowed for user role
  if (!isPathAllowedForRole()) {
    // Redirect sellers trying to access buyer routes to seller dashboard
    if (userRole === 'seller') {
      return <Navigate to="/seller-dashboard" replace />;
    }
    // Redirect buyers trying to access seller routes to home
    if (userRole === 'buyer') {
      return (
        <>
          <AuthModal
            isOpen={showAuthModal}
            onClose={handleModalClose}
            initialView="login"
            onLogin={handleLogin}
          />
          <Navigate to="/" replace />
        </>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;