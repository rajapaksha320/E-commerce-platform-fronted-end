// components/auth/OTPVerificationForm.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Shield } from "lucide-react";
import Card from "../ui/AuthUis/Card";
import { Button } from "../ui/AuthUis/Button";
import {
  verifyOTP,
  clearError,
  clearSuccess,
  selectLoading,
  selectError,
  selectResetEmail,
  selectOtpVerified,
  forgotPassword,
} from "../../store/slices/authSlice";

const OTPVerificationForm = ({ switchView, onClose, emailFromUrl }) => {
  const dispatch = useDispatch();
  
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const resetEmail = useSelector(selectResetEmail);
  const otpVerified = useSelector(selectOtpVerified);

  // Use email from URL parameter or fallback to Redux state
  const currentEmail = emailFromUrl || resetEmail;

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [localError, setLocalError] = useState("");

  // References for OTP inputs
  const inputRefs = Array(4)
    .fill(0)
    .map(() => React.createRef());

  // Handle OTP verification success
  useEffect(() => {
    if (otpVerified) {
      // Clear the success state before switching to prevent issues in NewPasswordForm
      dispatch(clearSuccess());
      // Pass email to new password form via URL parameter
      switchView("new-password", currentEmail);
    }
  }, [otpVerified, switchView, dispatch, currentEmail]);

  // Timer for OTP resend countdown
  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Clear any previous states when component mounts
  useEffect(() => {
    dispatch(clearError());
    setLocalError("");
  }, [dispatch]);

  // Redirect to reset password if no email available
  useEffect(() => {
    if (!currentEmail) {
      console.warn("No email found for OTP verification, redirecting to reset password");
      switchView("reset-password");
    }
  }, [currentEmail, switchView]);

  // Handle OTP input changes
  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear any previous errors
    if (localError) setLocalError("");
    if (error) dispatch(clearError());

    // Auto move to next input if current one is filled
    if (value !== "" && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  // Handle key press for backspace to move focus backwards
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs[index - 1].current.focus();
    }
  };

  // Handle OTP paste (e.g., from SMS)
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Check if pasted content contains only digits
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.split("").slice(0, 4);

    // Fill in as many inputs as we have digits
    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 4) newOtp[index] = digit;
    });

    setOtp(newOtp);

    // Focus the next empty input or the last one if all filled
    const nextEmptyIndex = newOtp.findIndex((val) => val === "");
    if (nextEmptyIndex === -1) {
      inputRefs[3].current.focus();
    } else {
      inputRefs[nextEmptyIndex].current.focus();
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (timeLeft > 0 || !currentEmail) return;

    setIsResending(true);
    
    // Call forgot password again with the same email
    try {
      await dispatch(forgotPassword(currentEmail)).unwrap();
      setTimeLeft(60);
      setOtp(["", "", "", ""]);
      inputRefs[0].current.focus();
    } catch (err) {
      console.error('Failed to resend OTP:', err);
    } finally {
      setIsResending(false);
    }
  };

  // Submit OTP for verification
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if OTP is complete
    if (otp.some((digit) => digit === "")) {
      setLocalError("Please enter all 4 digits");
      return;
    }

    if (!currentEmail) {
      setLocalError("Email not found. Please start the reset process again.");
      return;
    }

    const otpString = otp.join("");
    
    try {
      await dispatch(verifyOTP({ 
        email: currentEmail, 
        otp: otpString 
      })).unwrap();
    } catch (err) {
      // Error is handled by Redux state
      console.error('OTP verification failed:', err);
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
              No email address found for verification. Please start the password reset process again.
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
        <div className="text-center mb-6 flex-grow">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
            Verification Code
          </h2>
          <p className="text-gray-600">
            We've sent a 4-digit code to{" "}
            <span className="font-medium">{currentEmail}</span>
          </p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* OTP Input fields */}
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : null}
              className={`
                w-12 h-14 text-center text-xl font-bold rounded-lg border-2 
                focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                ${error || localError ? "border-red-500" : "border-gray-300"}
                bg-white/80 backdrop-blur-sm transition-all duration-300
              `}
            />
          ))}
        </div>

        {/* Error message */}
        {(error || localError) && (
          <div className="text-red-500 text-sm text-center mb-4">
            {error || localError}
          </div>
        )}

        {/* Verify button */}
        <Button
          type="submit"
          size="lg"
          className="w-full mb-6"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify & Continue"}
        </Button>

        {/* Resend option */}
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>

          {timeLeft > 0 ? (
            <p className="text-gray-500 text-sm">
              Resend in <span className="font-medium">{timeLeft}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending || !currentEmail}
              className={`
                text-blue-600 font-medium text-sm hover:text-blue-700
                ${isResending || !currentEmail ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {isResending ? "Sending..." : "Resend Code"}
            </button>
          )}
        </div>
      </form>

      <div className="text-center mt-6">
        <button
          onClick={() => switchView("reset-password")}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Reset Password
        </button>
      </div>
    </Card>
  );
};

export default OTPVerificationForm;