import React, { useState } from "react";
import { X, Mail, Key } from "lucide-react";
import Card from "../ui/AuthUis/Card";
import { Button } from "../ui/AuthUis/Button";
import { Input } from "../ui/AuthUis/Input";

const ResetPasswordForm = ({ switchView, onClose }) => {
  const [requestData, setRequestData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setRequestData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateRequest = () => {
    const newErrors = {};

    if (!requestData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(requestData.email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();

    if (validateRequest()) {
      setIsLoading(true);

      // Simulate sending reset email
      setTimeout(() => {
        setIsLoading(false);
        setRequestSent(true);
      }, 1500);
    }
  };

  const goToOTPVerification = () => {
    switchView("otp-verification");
  };

  const handleRequestAnother = () => {
    setRequestData({ email: "" });
    setRequestSent(false);
  };

  return (
    <Card className="border border-blue-200/20">
      <div className="flex justify-between items-center">
        <div className="text-center mb-6 flex-grow">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <Key className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
            Forgot Password?
          </h2>
          <p className="text-gray-600">
            Enter your email and we'll send you a verification code
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 h-8"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {!requestSent ? (
        <>
          <form onSubmit={handleRequestSubmit}>
            <Input
              type="email"
              label="Email address"
              name="email"
              value={requestData.email}
              onChange={handleRequestChange}
              placeholder="name@example.com"
              error={errors.email}
              required
              icon={<Mail className="w-5 h-5" />}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full mb-6"
              isLoading={isLoading}
            >
              Send Verification Code
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => switchView("login")}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← Back to Login
            </button>
          </div>
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
            Check Your Email
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification code to{" "}
            <span className="font-medium">{requestData.email}</span>
          </p>
          <p className="text-gray-600 text-sm mb-6">
            The code will expire in 10 minutes. If you don't see the email,
            check your spam folder.
          </p>
          <div className="flex flex-col space-y-4">
            <Button variant="outline" size="md" onClick={handleRequestAnother}>
              Request Another Code
            </Button>
            <Button size="md" onClick={goToOTPVerification}>
              Enter Verification Code
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ResetPasswordForm;
