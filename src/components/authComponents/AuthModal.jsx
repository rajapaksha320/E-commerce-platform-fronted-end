/* eslint-disable no-unused-vars */
// components/auth/AuthModal.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ResetPasswordForm from "./ResetPasswordForm";
import OTPVerificationForm from "./OTPVerificationForm";
import NewPasswordForm from "./NewPasswordForm";
import { selectResetEmail, selectOtpVerified, selectIsAuthenticated, clearSuccess, clearError } from "../../store/slices/authSlice";

const AuthModal = ({ 
  isOpen, 
  onClose, 
  initialView = "login", 
  onLogin, 
  intendedDestination = null,
  onViewChange = null
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const resetEmail = useSelector(selectResetEmail);
  const otpVerified = useSelector(selectOtpVerified);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [currentView, setCurrentView] = useState(initialView);

  // Get email from URL parameters
  const getEmailFromUrl = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get('email') || '';
  };

  // Set email in URL parameters
  const setEmailInUrl = (email) => {
    const urlParams = new URLSearchParams(location.search);
    if (email) {
      urlParams.set('email', email);
    } else {
      urlParams.delete('email');
    }
    const newUrl = `${location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  // Remove email from URL parameters
  const removeEmailFromUrl = () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.delete('email');
    const newUrl = urlParams.toString() ? `${location.pathname}?${urlParams.toString()}` : location.pathname;
    window.history.replaceState({}, '', newUrl);
  };

  useEffect(() => {
    // Update current view when initialView prop changes
    setCurrentView(initialView);
  }, [initialView]);

  // Handle successful authentication
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      // Remove email from URL when successfully authenticated
      removeEmailFromUrl();
      
      // Close modal first
      onClose();
      
      // Call onLogin callback if provided
      if (onLogin) {
        onLogin();
      }
      
      // Navigate to intended destination after a brief delay
      setTimeout(() => {
        if (intendedDestination && intendedDestination !== '/') {
          navigate(intendedDestination);
        }
        // If no intended destination or it's home, stay where we are
        // The normal routing will handle it
      }, 100);
    }
  }, [isAuthenticated, isOpen, onClose, onLogin, intendedDestination, navigate]);

  // Automatically switch to OTP view if reset email is set
  useEffect(() => {
    if (resetEmail && currentView === "reset-password") {
      // This handles the case where the user successfully requested a password reset
      // The form component will handle the switch after showing success message
    }
  }, [resetEmail, currentView]);

  // Automatically switch to new password view if OTP is verified
  useEffect(() => {
    if (otpVerified && currentView === "otp-verification") {
      // This is handled within the OTPVerificationForm component
    }
  }, [otpVerified, currentView]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Close modal with escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        // Clean up URL when closing modal
        if (currentView !== "login") {
          removeEmailFromUrl();
        }
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, currentView]);

  // Enhanced switchView function that manages URL parameters
  const handleSwitchView = (newView, email = null) => {
    // Clear any lingering success/error states when switching views
    dispatch(clearSuccess());
    dispatch(clearError());
    
    // Manage URL parameters based on view
    if (newView === "login" || newView === "register") {
      // Remove email from URL when going back to login/register
      removeEmailFromUrl();
    } else if (email && (newView === "otp-verification" || newView === "new-password")) {
      // Set email in URL for password reset flow
      setEmailInUrl(email);
    } else if (newView === "reset-password") {
      // Keep existing email in URL if any
      const currentEmail = getEmailFromUrl();
      if (currentEmail) {
        setEmailInUrl(currentEmail);
      }
    }
    
    setCurrentView(newView);
    
    // Notify parent component of view change
    if (onViewChange) {
      onViewChange(newView);
    }
  };

  const renderView = () => {
    const emailFromUrl = getEmailFromUrl();
    
    switch (currentView) {
      case "login":
        return (
          <LoginForm
            switchView={handleSwitchView}
            onClose={onClose}
            onLogin={onLogin}
            intendedDestination={intendedDestination}
          />
        );
      case "register":
        return (
          <RegisterForm 
            switchView={handleSwitchView} 
            onClose={onClose}
            intendedDestination={intendedDestination}
          />
        );
      case "reset-password":
        return (
          <ResetPasswordForm 
            switchView={handleSwitchView} 
            onClose={onClose}
            initialEmail={emailFromUrl}
            setEmailInUrl={setEmailInUrl}
          />
        );
      case "otp-verification":
        return (
          <OTPVerificationForm 
            switchView={handleSwitchView} 
            onClose={onClose}
            emailFromUrl={emailFromUrl}
          />
        );
      case "new-password":
        return (
          <NewPasswordForm 
            switchView={handleSwitchView} 
            onClose={onClose}
            emailFromUrl={emailFromUrl}
            removeEmailFromUrl={removeEmailFromUrl}
          />
        );
      default:
        return (
          <LoginForm
            switchView={handleSwitchView}
            onClose={onClose}
            onLogin={onLogin}
            intendedDestination={intendedDestination}
          />
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white/30 backdrop-blur-md z-40"
            onClick={() => {
              // Clean up URL when closing modal
              if (currentView !== "login") {
                removeEmailFromUrl();
              }
              onClose();
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-md">{renderView()}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;