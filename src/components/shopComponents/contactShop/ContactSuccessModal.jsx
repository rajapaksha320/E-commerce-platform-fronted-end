import React from "react";
import {
  CheckCircle,
  X,
  Sparkles,
  MessageCircle,
  User,
  Clock,
  Shield,
} from "lucide-react";
import { Button } from "../../ui/ContactUis/Uis";

const ContactSuccessModal = ({ isOpen, onClose, contactData }) => {
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

        {/* Success Animation Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"></div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-16 right-16 w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-8 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-12 w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
        </div>

        <div className="relative p-8 text-center">
          {/* Success Icon with Animation */}
          <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          {/* Sparkles decoration */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>

          {/* Success Message */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            🎉 Message Sent Successfully!
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your message has been sent to the shop.
            <br />
            They'll get back to you within 24 hours.
          </p>

          {/* Contact Details Summary */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-2">
            <div className="flex items-center text-sm">
              <MessageCircle className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-gray-600 flex-1">
                Message ID: {contactData?.messageId || "MSG123456"}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <User className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-gray-600 flex-1">
                Sent to: {contactData?.shopName || "Shop Name"}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-gray-600 flex-1">
                Response time: Within 24 hours
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              View Messages
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Close
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <Shield className="w-3 h-3 mr-1" />
              You'll receive email notifications for replies
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSuccessModal;
