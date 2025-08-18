/* eslint-disable no-unused-vars */
// components/auth/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '../../store/slices/authSlice';
import AuthModal from '../authComponents/AuthModal';


const LoginRequiredUI = ({ onShowLogin, routeName, intendedDestination }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Login Required
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-2 leading-relaxed">
            Please sign in to access {routeName || 'this page'}
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Join thousands of users enjoying our platform
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => onShowLogin('login')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>
            
            <button
              onClick={() => onShowLogin('register')}
              className="w-full border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              Create Account
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Continue Browsing */}
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
          >
            ← Continue browsing without login
          </button>
        </div>

        {/* Features */}
        <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-600 font-medium mb-3 text-center uppercase tracking-wide">
            Why Create an Account?
          </p>
          <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
              Save your favorite items
            </div>
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
              Track your orders
            </div>
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
              Get personalized recommendations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const AccessDeniedUI = ({ userRole, requiredRoles }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Access Restricted
          </h2>
          
          <p className="text-gray-600 mb-6">
            This area is restricted to {requiredRoles?.join(' or ')} accounts only.
          </p>
          
          <div className="text-sm text-gray-500 mb-6">
            Current role: <span className="font-medium capitalize">{userRole || 'None'}</span>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
            >
              Go Back
            </button>
            
            <a
              href="/"
              className="block w-full border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              Return Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children, allowedRoles = [], requireAuth = true }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const location = useLocation();
  
  // Local state for modal handling
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hasTriedModal, setHasTriedModal] = useState(false);
  const [intendedDestination, setIntendedDestination] = useState(null);

  const roleRoutes = {
    buyer: [
      '/wish-list', 
      '/shopping-cart', 
      '/profile', 
      '/orders', 
      '/track-parcel', 
      '/checkout', 
      '/leave-review'
    ],
    seller: [
      '/seller-dashboard', 
      '/create-listing', 
      '/seller/*'
    ],
  };

  const getRouteName = (path) => {
    const routeNames = {
      '/profile': 'your profile',
      '/orders': 'your orders', 
      '/wish-list': 'your wishlist',
      '/checkout': 'checkout',
      '/track-parcel': 'order tracking',
      '/leave-review': 'leave a review',
      '/seller-dashboard': 'seller dashboard',
      '/create-listing': 'create listing',
      '/shopping-cart': 'shopping cart'
    };
    return routeNames[path] || 'this feature';
  };

  useEffect(() => {
    if (requireAuth && !isAuthenticated && !hasTriedModal) {
      // Store the current location as intended destination
      setIntendedDestination(location.pathname + location.search);
      setShowAuthModal(true);
      setHasTriedModal(true);
    }
  }, [requireAuth, isAuthenticated, hasTriedModal, location]);

  useEffect(() => {
    if (isAuthenticated && intendedDestination && hasTriedModal) {
      // User has successfully logged in, reset flags
      setHasTriedModal(false);
      setIntendedDestination(null);
    }
  }, [isAuthenticated, intendedDestination, hasTriedModal]);

  // Modal event handlers
  const handleModalClose = () => {
    setShowAuthModal(false);
  };

  const handleLogin = () => {
    setShowAuthModal(false);
  };

  const handleShowLogin = (view = 'login') => {
    // Store current location when user manually opens login
    if (!intendedDestination) {
      setIntendedDestination(location.pathname + location.search);
    }
    setShowAuthModal(true);
  };

  const hasAccess = () => {
    if (!requireAuth) return true;
    if (!isAuthenticated) return false;
    
    // If no specific roles required, just check authentication
    if (allowedRoles.length === 0) return true;
    
    // Check if user role is in allowed roles
    return allowedRoles.includes(userRole);
  };

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


  // Show auth modal
  if (showAuthModal) {
    return (
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleModalClose}
        initialView="login"
        onLogin={handleLogin}
        intendedDestination={intendedDestination}
      />
    );
  }

  // Show login required UI if not authenticated and auth is required
  if (requireAuth && !isAuthenticated) {
    return (
      <LoginRequiredUI 
        onShowLogin={handleShowLogin} 
        routeName={getRouteName(location.pathname)}
        intendedDestination={intendedDestination}
      />
    );
  }

  // Check role-based access
  if (!hasAccess()) {
    return (
      <AccessDeniedUI 
        userRole={userRole} 
        requiredRoles={allowedRoles}
      />
    );
  }

  // Check if path is allowed for user role
  if (!isPathAllowedForRole()) {
    // Redirect sellers trying to access buyer routes to seller dashboard
    if (userRole === 'seller') {
      return <Navigate to="/seller-dashboard" replace />;
    }
    // Redirect buyers trying to access seller routes to home
    if (userRole === 'buyer') {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;