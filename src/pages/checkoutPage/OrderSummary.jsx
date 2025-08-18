import { useState } from "react";
import {
  Package,
  Truck,
  Shield,
  Clock,
  Star,
  ChevronDown,
  ChevronUp,
  Tag,
  CreditCard,
  Gift,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";

const OrderSummary = ({
  cartItems,
  subtotal,
  shipping,
  tax,
  total,
  selectedShipping = "standard",
}) => {
  const [showItems, setShowItems] = useState(true);

  const getShippingName = (type) => {
    switch (type) {
      case "standard":
        return "Standard Shipping";
      case "express":
        return "Express Shipping";
      case "overnight":
        return "Overnight Shipping";
      default:
        return "Standard Shipping";
    }
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingThreshold = 7500; // LKR 75 equivalent
  const needsForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="lg:sticky lg:top-24 space-y-4">
      {/* Order Summary Card */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Package className="h-5 w-5 text-blue-600 mr-2" />
            Order Summary
          </h3>
          <button
            onClick={() => setShowItems(!showItems)}
            className="lg:hidden flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            {showItems ? "Hide" : "Show"} items
            {showItems ? (
              <ChevronUp className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </button>
        </div>

        {/* Items List */}
        {showItems && (
          <div className="space-y-3 mb-6 border-b border-gray-200 pb-6">
            {cartItems.map((item) => {
              const itemPrice = parseFloat(
                item.listing?.variations?.[0]?.price || item.price || 0
              );
              const itemOriginalPrice = parseFloat(
                item.listing?.variations?.[0]?.originalPrice ||
                  item.originalPrice ||
                  0
              );

              return (
                <div key={item._id} className="flex space-x-3">
                  <div className="relative flex-shrink-0">
                    <img
                      src={
                        item.listing?.images?.[0]?.url ||
                        item.listing?.variations?.[0]?.images?.[0]?.url ||
                        item.image ||
                        "/placeholder-product.jpg"
                      }
                      alt={item.listing?.title || item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "/placeholder-product.jpg";
                      }}
                    />
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      {item.listing?.title || item.name}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {item.listing?.brand || item.brand || "Unknown Brand"}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-semibold text-gray-900">
                        LKR {(itemPrice * item.quantity).toFixed(2)}
                      </span>
                      {itemOriginalPrice && itemOriginalPrice > itemPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          LKR {(itemOriginalPrice * item.quantity).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Order Totals */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal ({itemCount} items)</span>
            <span className="font-medium">LKR {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center">
              Shipping
              <span className="ml-1 text-xs">
                ({getShippingName(selectedShipping)})
              </span>
            </span>
            <span
              className={`font-medium ${
                shipping === 0 ? "text-green-600" : "text-gray-900"
              }`}
            >
              {shipping === 0 ? "Free" : `LKR ${shipping.toFixed(2)}`}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Tax (8%)</span>
            <span className="font-medium">LKR {tax.toFixed(2)}</span>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="text-blue-600">LKR {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Free Shipping Progress */}
        {shipping > 0 && needsForFreeShipping > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center text-blue-700 text-sm mb-2">
              <Truck className="h-4 w-4 mr-2" />
              <span className="font-medium">
                Add LKR {needsForFreeShipping.toFixed(2)} more for free
                shipping!
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    (subtotal / freeShippingThreshold) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Security & Trust Badges */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-2 text-gray-600">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Truck className="h-4 w-4 text-blue-600" />
              <span>Free Returns</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-4 w-4 text-purple-600" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <CreditCard className="h-4 w-4 text-indigo-600" />
              <span>Safe Payment</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Delivery Estimate */}
      <Card>
        <h4 className="font-bold text-gray-900 mb-3 flex items-center">
          <Clock className="h-4 w-4 text-blue-600 mr-2" />
          Estimated Delivery
        </h4>
        <div className="space-y-2 text-sm">
          {selectedShipping === "standard" && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Standard Delivery</span>
              <span className="font-medium text-gray-900">
                5-7 business days
              </span>
            </div>
          )}
          {selectedShipping === "express" && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Express Delivery</span>
              <span className="font-medium text-gray-900">
                2-3 business days
              </span>
            </div>
          )}
          {selectedShipping === "overnight" && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Overnight Delivery</span>
              <span className="font-medium text-gray-900">1 business day</span>
            </div>
          )}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Orders placed before 2 PM EST ship the same day
            </p>
          </div>
        </div>
      </Card>

      {/* Payment Security */}
      <Card>
        <h4 className="font-bold text-gray-900 mb-3 flex items-center">
          <Shield className="h-4 w-4 text-green-600 mr-2" />
          Payment Security
        </h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            <span>SSL encryption protected</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            <span>PCI DSS compliant</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            <span>Money-back guarantee</span>
          </div>
        </div>
      </Card>

      {/* Order Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-green-700">{itemCount}</div>
          <div className="text-xs text-green-600">Total Items</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-blue-700">
            {shipping === 0 ? "Free" : "Paid"}
          </div>
          <div className="text-xs text-blue-600">Shipping</div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
