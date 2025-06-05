import React, { useState } from "react";
import { X, Lock, CheckCircle } from "lucide-react";
import Card from "../ui/AuthUis/Card";
import { Button } from "../ui/AuthUis/Button";
import { Input } from "../ui/AuthUis/Input";

const NewPasswordForm = ({ switchView, onClose }) => {
  const [resetData, setResetData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

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

  // Handle reset form changes
  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate reset form
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

  // Handle reset form submission
  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (validateReset()) {
      setIsLoading(true);

      // Simulate password reset
      setTimeout(() => {
        setIsLoading(false);
        setResetComplete(true);
      }, 1500);
    }
  };

  // Go to login form
  const goToLogin = () => {
    switchView("login");
  };

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
              Create a strong password for your account
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
          >
            Reset Password
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => switchView("otp-verification")}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← Back to Verification
            </button>
          </div>
        </form>
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
            Password Reset Complete
          </h2>
          <p className="text-gray-600 mb-6">
            Your password has been successfully reset. You can now log in with
            your new password.
          </p>
          <Button size="lg" className="w-full" onClick={goToLogin}>
            Return to Login
          </Button>
        </div>
      )}
    </Card>
  );
};

export default NewPasswordForm;
