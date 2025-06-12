import React from "react";
import { LogIn, X, Shield } from "lucide-react";
import { Button } from "../ContactUis/Uis";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50"></div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-16 right-16 w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-8 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-12 w-1 h-1 bg-purple-500 rounded-full animate-bounce"></div>
        </div>

        <div className="relative p-8 text-center">
          {/* Login Icon */}
          <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <LogIn className="w-10 h-10 text-white" />
          </div>

          {/* Logo */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Emmover.
            </h1>
          </div>

          {/* Login Message */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Login Required
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Please log in to your account to continue.
            <br />
            It's quick and secure!
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              size="lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Login to Continue
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <Shield className="w-3 h-3 mr-1" />
              Your information is secure and protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
