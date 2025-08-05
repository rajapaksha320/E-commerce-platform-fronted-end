// components/auth/RegisterForm.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Mail, Lock, User } from "lucide-react";
import Card from "../ui/AuthUis/Card";
import { Button } from "../ui/AuthUis/Button";
import { Input } from "../ui/AuthUis/Input";
import {
  signupUser,
  clearError,
  clearSuccess,
  selectLoading,
  selectError,
  selectSuccess,
  selectMessage,
} from "../../store/slices/authSlice";

const RegisterForm = ({ switchView, onClose }) => {
  const dispatch = useDispatch();
  
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const message = useSelector(selectMessage);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Memoize goToLogin to prevent dependency issues
  const goToLogin = useCallback(() => {
    console.log("🎯 goToLogin called - navigating to login form");
    setRegistrationSuccess(false);
    setCountdown(0);
    dispatch(clearSuccess());
    dispatch(clearError());
    switchView("login");
  }, [dispatch, switchView]);

  // FIXED: Better success detection with multiple possible success indicators
  useEffect(() => {
    console.log("Registration state changed:", { success, message, error });
    
    // More flexible success detection
    if (success && !error) {
      const successMessages = [
        "User created successfully",
        "Registration successful", 
        "Account created successfully",
        "user created successfully", // lowercase variation
        "registration successful" // lowercase variation
      ];
      
      const isRegistrationSuccess = 
        !message || // If no specific message but success is true
        successMessages.some(msg => 
          message?.toLowerCase().includes(msg.toLowerCase())
        ) ||
        message?.toLowerCase().includes("created") ||
        message?.toLowerCase().includes("success");
      
      if (isRegistrationSuccess) {
        console.log("✅ Registration SUCCESS detected! Message:", message);
        setRegistrationSuccess(true);
        setCountdown(3);
        // DON'T clear success immediately - let the countdown handle it
      }
    }
  }, [success, message, error]);

  // FIXED: Auto-redirect countdown with proper dependency array
  useEffect(() => {
    let timer;
    if (registrationSuccess && countdown > 0) {
      console.log(`⏰ Registration redirect countdown: ${countdown} seconds remaining`);
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (registrationSuccess && countdown === 0) {
      console.log("🚀 Auto-redirecting to login after registration");
      goToLogin();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [registrationSuccess, countdown, goToLogin]);

  // Clear Redux state on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    
    // Clear Redux error when user types
    if (error) {
      dispatch(clearError());
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password =
        "Password must include uppercase, lowercase, numbers and special characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      try {
        console.log("🔄 Submitting registration for:", formData.email);
        const result = await dispatch(signupUser(formData)).unwrap();
        console.log("✅ Registration API response:", result);
        
        // ADDITIONAL: If the API doesn't set success state properly, 
        // we can manually trigger success here
        if (result && !error) {
          console.log("🔧 Manually triggering registration success");
          setRegistrationSuccess(true);
          setCountdown(3);
        }
      } catch (err) {
        console.error("❌ Registration failed:", err);
      }
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const { password } = formData;
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

    return { strength, ...strengthMap[strength] };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <Card className="border border-blue-200/20">
      {!registrationSuccess ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                Create an account
              </h2>
              <p className="text-gray-600">
                Fill in your details to get started
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Display Redux error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}


          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                type="text"
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                error={errors.firstName}
                icon={<User className="w-5 h-5" />}
              />

              <Input
                type="text"
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                error={errors.lastName}
                icon={<User className="w-5 h-5" />}
              />
            </div>

            <Input
              type="email"
              label="Email address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              error={errors.email}
              required
              icon={<Mail className="w-5 h-5" />}
            />

            <div className="mb-4">
              <Input
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                error={errors.password}
                required
                icon={<Lock className="w-5 h-5" />}
              />

              {formData.password && (
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
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.confirmPassword}
              required
              icon={<Lock className="w-5 h-5" />}
            />

            <div className="mb-6">
              <label className="flex items-start relative">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 mt-0.5 border rounded flex items-center justify-center flex-shrink-0 ${
                    formData.agreeTerms
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {formData.agreeTerms && (
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="ml-7 mt-1 text-sm text-red-600">
                  {errors.agreeTerms}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mb-6"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>

            <p className="text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchView("login")}
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Sign in
              </button>
            </p>
          </form>
        </>
      ) : (
        <div className="text-center py-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Registration Successful! 🎉
          </h2>
          <p className="text-gray-600 mb-4">
            Welcome aboard! Your account has been created successfully.
          </p>
          <p className="text-gray-600 mb-6">
            We've sent a verification email to{" "}
            <span className="font-medium">{formData.email}</span>.
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
                console.log("⏸️ Stay on registration success page");
                setRegistrationSuccess(false);
                setCountdown(0);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Stay here
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default RegisterForm;