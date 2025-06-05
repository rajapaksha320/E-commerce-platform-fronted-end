import React, { useState, useEffect } from "react";
import { X, Shield } from "lucide-react";
import Card from "../ui/AuthUis/Card";
import { Button } from "../ui/AuthUis/Button";


const OTPVerificationForm = ({ switchView, onClose }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [email] = useState("user@example.com"); // Would come from previous step

  // References for OTP inputs
  const inputRefs = Array(6)
    .fill(0)
    .map(() => React.createRef());

  // Timer for OTP resend countdown
  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Handle OTP input changes
  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear any previous errors
    if (error) setError("");

    // Auto move to next input if current one is filled
    if (value !== "" && index < 5) {
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

    const digits = pastedData.split("").slice(0, 6);

    // Fill in as many inputs as we have digits
    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });

    setOtp(newOtp);

    // Focus the next empty input or the last one if all filled
    const nextEmptyIndex = newOtp.findIndex((val) => val === "");
    if (nextEmptyIndex === -1) {
      inputRefs[5].current.focus();
    } else {
      inputRefs[nextEmptyIndex].current.focus();
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (timeLeft > 0) return;

    setIsResending(true);

    // Simulate resending OTP
    setTimeout(() => {
      setTimeLeft(60);
      setIsResending(false);
      setError("");
      // Clear OTP fields
      setOtp(["", "", "", "", "", ""]);
      // Focus the first input
      inputRefs[0].current.focus();
    }, 1500);
  };

  // Submit OTP for verification
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if OTP is complete
    if (otp.some((digit) => digit === "")) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsVerifying(true);

    // Simulate OTP verification
    setTimeout(() => {
      setIsVerifying(false);
      // Navigate to new password page
      switchView("new-password");
    }, 1500);
  };

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
            We've sent a 6-digit code to{" "}
            <span className="font-medium">{email}</span>
          </p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* OTP Input fields */}
        <div className="flex justify-between gap-2 mb-6">
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
                ${error ? "border-red-500" : "border-gray-300"}
                bg-white/80 backdrop-blur-sm transition-all duration-300
              `}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}

        {/* Verify button */}
        <Button
          type="submit"
          size="lg"
          className="w-full mb-6"
          isLoading={isVerifying}
        >
          {isVerifying ? "Verifying..." : "Verify & Continue"}
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
              disabled={isResending}
              className={`
                text-blue-600 font-medium text-sm hover:text-blue-700
                ${isResending ? "opacity-50 cursor-not-allowed" : ""}
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
