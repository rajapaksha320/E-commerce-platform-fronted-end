import {
  X,
  CheckCircle,
  Sparkles,
  Package,
  FileText,
  Clock,
  Truck,
  ExternalLink,
  Shield,
  Calendar,
  CreditCard,
  MapPin,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, Badge } from "../../components/ui/ContactUis/Uis";

const SuccessModal = ({ isOpen, onClose, orderData, type = "order" }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleTrackNavigation = () => {
    // Navigate to track orders/returns
    onClose();
    navigate("/orders");
  };

  const handleContinueShopping = () => {
    onClose();
    navigate("/shop-collections");
  };

  const isReturnType = type === "return";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent bg-opacity-50 backdrop-blur-sm">
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
            {isReturnType
              ? "🎉 Return Request Submitted!"
              : "🎉 Order Placed Successfully!"}
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {isReturnType
              ? "Your return request has been successfully submitted. We'll process it within 1-2 business days."
              : "Thank you for your order! We'll send you a confirmation email with tracking details shortly."}
          </p>

          {/* Order/Return Details Summary */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-2">
            <div className="flex items-center text-sm">
              <Package className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-gray-600 flex-1">
                {isReturnType
                  ? `Return ID: ${orderData?.returnId || "RET-" + Date.now()}`
                  : `Order ID: ${orderData?.orderId || "ORD-" + Date.now()}`}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <FileText className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-gray-600 flex-1">
                {orderData?.itemCount || 1} item(s){" "}
                {isReturnType ? "selected" : "ordered"}
              </span>
            </div>
            {/* <div className="flex items-center text-sm">
              {isReturnType ? (
                <>
                  <Clock className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 flex-1">
                    Processing time: 1-2 business days
                  </span>
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 flex-1">
                    Estimated delivery:{" "}
                    {orderData?.estimatedDelivery || "3-5 business days"}
                  </span>
                </>
              )}
            </div> */}
            {!isReturnType && orderData?.total && (
              <div className="flex items-center text-sm">
                <CreditCard className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-600 flex-1">
                  Total: ${orderData.total.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Next Steps */}
          {!isReturnType && (
            <div className="bg-blue-50 rounded-2xl p-4 mb-6 text-left">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                What happens next?
              </h4>
              <div className="space-y-1 text-sm text-blue-800">
                
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                  <span>Processing within 24 hours</span>
                </div>
                
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleTrackNavigation}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              size="lg"
            >
              View Order
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>

            {!isReturnType && (
              <Button
                onClick={handleContinueShopping}
                variant="outline"
                className="w-full border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                Continue Shopping
              </Button>
            )}

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-gray-200 hover:text-gray-900 "
            >
              Close
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <Shield className="w-3 h-3 mr-1" />
              {isReturnType
                ? "You'll receive email updates about your return"
                : "You'll receive email updates about your order"}
            </p>
          </div>

          {/* Trust Elements */}
          {!isReturnType && (
            <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center">
                <Star className="w-3 h-3 text-yellow-500 mr-1" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center">
                <Shield className="w-3 h-3 text-green-500 mr-1" />
                <span>Secure Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
