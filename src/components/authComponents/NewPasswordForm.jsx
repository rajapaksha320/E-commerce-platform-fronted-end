/* eslint-disable no-unused-vars */
// components/auth/NewPasswordForm.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X, Lock, CheckCircle } from "lucide-react";
import Card from "../ui/AuthUis/Card";
import { Button } from "../ui/AuthUis/Button";
import { Input } from "../ui/AuthUis/Input";
import {
  resetPassword,
  clearError,
  clearSuccess,
  selectLoading,
  selectError,
  selectSuccess,
  selectResetEmail,
  selectMessage,
} from "../../store/slices/authSlice";

const NewPasswordForm = ({ switchView, onClose, emailFromUrl, removeEmailFromUrl }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const resetEmail = useSelector(selectResetEmail);
  const message = useSelector(selectMessage);

  // Use email from URL parameter or fallback to Redux state
  const currentEmail = emailFromUrl || resetEmail;

  const [resetData, setResetData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [resetComplete, setResetComplete] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // FIXED: Memoize goToLogin to prevent dependency issues
  const goToLogin = useCallback(() => {
    console.log("🎯 goToLogin called - navigating to login form");
    
    // Clear local state first
    setResetComplete(false);
    setCountdown(0);
    
    // Clear Redux states
    dispatch(clearSuccess());
    dispatch(clearError());
    
    // Remove email from URL
    if (removeEmailFromUrl) {
      removeEmailFromUrl();
    }
    
    // Small delay to ensure state is cleared before navigation
    setTimeout(() => {
      console.log("🚀 Calling switchView('login')");
      switchView("login");
    }, 100);
  }, [dispatch, removeEmailFromUrl, switchView]);

  // Clear any previous success state when component mounts
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
    setResetComplete(false);
  }, [dispatch]);

  // Redirect to reset password if no email available
  useEffect(() => {
    if (!currentEmail) {
      console.warn("No email found for password reset, redirecting to reset password");
      switchView("reset-password");
    }
  }, [currentEmail, switchView]);

  // FIXED: Improved success detection with better logging
  useEffect(() => {
    console.log("Password reset state changed:", { success, error, message, resetComplete });
    
    // Only process if we haven't already detected success
    if (!resetComplete && success && !error) {
      console.log("🔍 Checking for password reset success...");
      
      // More comprehensive success detection
      const successIndicators = [
        "password reset successfully",
        "password changed successfully", 
        "password updated successfully",
        "new password set successfully",
        "password has been reset",
        "password has been changed",
        "password has been updated",
        "reset successful",
        "password reset complete"
      ];
      
      const isPasswordResetSuccess = 
        !message || // If no message but success is true
        successIndicators.some(indicator => 
          message.toLowerCase().includes(indicator.toLowerCase())
        ) ||
        (message.toLowerCase().includes("password") && message.toLowerCase().includes("success")) ||
        (message.toLowerCase().includes("reset") && message.toLowerCase().includes("success"));
      
      if (isPasswordResetSuccess) {
        console.log("✅ Password reset SUCCESS detected! Message:", message);
        setResetComplete(true);
        setCountdown(5);
      } else {
        console.log("🤔 Success detected but message doesn't match password reset patterns:", message);
        // Fallback: if success is true and no error, assume it worked
        console.log("🔧 Using fallback success detection");
        setResetComplete(true);
        setCountdown(5);
      }
    }
  }, [success, error, message, resetComplete]);

  // FIXED: Auto-redirect countdown with proper cleanup
  useEffect(() => {
    let timer;
    if (resetComplete && countdown > 0) {
      console.log(`⏰ Password reset redirect countdown: ${countdown} seconds remaining`);
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (resetComplete && countdown === 0) {
      console.log("🚀 Auto-redirecting to login after password reset");
      goToLogin();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resetComplete, countdown, goToLogin]);

  // Clear Redux state on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  const getPasswordStrength = () => {
    const { password } = resetData;
    if (!password) return { strength: 0, label: "", color: "bg-gray-200" };

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const strengthMap = {
      1: { label: "Weak", color: "bg-red-500" },
      2: { label: "Fair", color: "bg-orange-500" },
      3: { label: "Good", color: "bg-yellow-500" },
      4: { label: "Strong", color: "bg-green-500" },
      5: { label: "Very Strong", color: "bg-green-600" },
    };

    return {
      strength,
      ...strengthMap[strength],
    };
  };

  const passwordStrength = getPasswordStrength();

  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (error) {
      dispatch(clearError());
    }
  };

  const validateReset = () => {
    const newErrors = {};

    if (!resetData.password) {
      newErrors.password = "Password is required";
    } else if (resetData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(resetData.password)) {
      newErrors.password =
        "Password must include uppercase, lowercase and numbers";
    }

    if (!resetData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (resetData.confirmPassword !== resetData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (!currentEmail) {
      setErrors({ general: "Email not found. Please start the reset process again." });
      return;
    }

    if (validateReset()) {
      try {
        console.log("🔄 Submitting password reset for email:", currentEmail);
        const result = await dispatch(resetPassword({
          email: currentEmail,
          newPassword: resetData.password,
          confirmPassword: resetData.confirmPassword,
        })).unwrap();
        console.log("✅ Password reset API response:", result);
        
        // ADDITIONAL: Manual success detection as backup
        if (result && !error) {
          console.log("🔧 Manually triggering password reset success");
          setResetComplete(true);
          setCountdown(5);
        }
      } catch (err) {
        console.error('❌ Password reset failed:', err);
      }
    }
  };

  // Show error if no email is available
  if (!currentEmail) {
    return (
      <Card className="border border-blue-200/20">
        <div className="flex justify-between items-start">
          <div className="text-center mb-6 flex-grow">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-1">
              Email Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              No email address found for password reset. Please start the password reset process again.
            </p>
            <Button 
              size="lg" 
              className="w-full" 
              onClick={() => switchView("reset-password")}
            >
              Start Password Reset
            </Button>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border border-blue-200/20">
      <div className="flex justify-between items-start">
        {!resetComplete ? (
          <div className="text-center mb-6 flex-grow">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
              Set New Password
            </h2>
            <p className="text-gray-600">
              Create a strong password for <span className="font-medium">{currentEmail}</span>
            </p>
          </div>
        ) : (
          <div className="flex-grow"></div>
        )}
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>

      {!resetComplete ? (
        <>
          {/* Display Redux error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Display general errors */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}


          <form onSubmit={handleResetSubmit}>
            <div className="mb-4">
              <Input
                type="password"
                label="New Password"
                name="password"
                value={resetData.password}
                onChange={handleResetChange}
                placeholder="••••••••"
                error={errors.password}
                required
                icon={<Lock className="w-5 h-5" />}
              />

              {resetData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-gray-600">
                      Password strength:
                    </div>
                    <div className="text-xs font-medium">
                      {passwordStrength.label}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color}`}
                      style={{
                        width: `${(passwordStrength.strength / 5) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <Input
              type="password"
              label="Confirm New Password"
              name="confirmPassword"
              value={resetData.confirmPassword}
              onChange={handleResetChange}
              placeholder="••••••••"
              error={errors.confirmPassword}
              required
              icon={<CheckCircle className="w-5 h-5" />}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full mb-6"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => switchView("otp-verification", currentEmail)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                ← Back to Verification
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Password Reset Complete! 🎉
          </h2>
          <p className="text-gray-600 mb-4">
            Your password has been successfully reset for{" "}
            <span className="font-medium">{currentEmail}</span>.
          </p>
          <p className="text-gray-600 mb-6">
            You can now log in with your new password.
          </p>
          
          {/* Countdown and auto-redirect message */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-600">
              Redirecting to login page in{" "}
              <span className="font-bold text-blue-700">{countdown}</span> seconds...
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <Button 
              size="lg" 
              className="w-full" 
              onClick={() => {
                console.log("🔴 Manual 'Go to Login Now' button clicked");
                goToLogin();
              }}
            >
              Go to Login Now
            </Button>
            <button
              type="button"
              onClick={() => {
                console.log("⏸️ Stay on password reset success page");
                setResetComplete(false);
                setCountdown(0);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Stay on this page
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default NewPasswordForm;