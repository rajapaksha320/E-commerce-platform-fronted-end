// components/auth/LoginForm.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X, Mail, Lock } from "lucide-react";
import Card from "../ui/AuthUis/Card";
import { Button } from "../ui/AuthUis/Button";
import { Input } from "../ui/AuthUis/Input";
import { 
  loginUser, 
  clearError, 
  clearSuccess,
  selectLoading,
  selectError,
  selectUserRole,
  selectIsAuthenticated 
} from "../../store/slices/authSlice";

const LoginForm = ({ switchView, onClose, onLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const userRole = useSelector(selectUserRole);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [validationErrors, setValidationErrors] = useState({});

  // Handle successful login navigation
  useEffect(() => {
    if (isAuthenticated && userRole) {
      // Close modal
      onClose();
      
      // Navigate based on user role
      if (userRole === 'seller') {
        navigate('/seller-dashboard');
      } else if (userRole === 'buyer') {
        // Buyer stays on current page or goes to homepage
        navigate('/');
      }
      
      // Call onLogin callback if provided
      if (onLogin) {
        onLogin(formData.email);
      }
    }
  }, [isAuthenticated, userRole, navigate, onClose, onLogin, formData.email]);

  // Clear errors when component unmounts
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

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
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

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    if (validate()) {
      console.log('Validation passed, dispatching login action');
      try {
        await dispatch(loginUser({
          email: formData.email,
          password: formData.password,
        })).unwrap();
        console.log('Login action completed successfully');
      } catch (err) {
        // Error is handled by Redux state
        console.error('Login failed:', err);
      }
    } else {
      console.log('Validation failed');
    }
  };

  return (
    <Card className="border border-blue-200/20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
            Welcome back
          </h2>
          <p className="text-gray-600">Please enter your details to continue</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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
        <Input
          type="email"
          label="Email address"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@example.com"
          error={validationErrors.email}
          required
          icon={<Mail className="w-5 h-5" />}
        />

        <Input
          type="password"
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={validationErrors.password}
          required
          icon={<Lock className="w-5 h-5" />}
        />

        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 border rounded flex items-center justify-center ${
                formData.rememberMe
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500"
                  : "bg-white border-gray-300"
              }`}
            >
              {formData.rememberMe && (
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
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>

          <button
            type="button"
            onClick={() => switchView("reset-password")}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full mb-4"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => switchView("register")}
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Sign up
        </button>
      </p>
    </Card>
  );
};

export default LoginForm;