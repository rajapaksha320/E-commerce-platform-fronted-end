/* eslint-disable no-unused-vars */
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
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");

  // Mock promo codes for demo
  const validPromoCodes = {
    SAVE10: {
      discount: 10,
      type: "percentage",
      description: "10% off your order",
    },
    WELCOME: {
      discount: 5,
      type: "fixed",
      description: "$5 off your first order",
    },
    FREESHIP: { discount: 0, type: "shipping", description: "Free shipping" },
  };

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase();
    if (validPromoCodes[code]) {
      setAppliedPromo({ code, ...validPromoCodes[code] });
      setPromoError("");
    } else {
      setPromoError("Invalid promo code");
      setAppliedPromo(null);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
  };

  const calculatePromoDiscount = () => {
    if (!appliedPromo) return 0;

    switch (appliedPromo.type) {
      case "percentage":
        return subtotal * (appliedPromo.discount / 100);
      case "fixed":
        return Math.min(appliedPromo.discount, subtotal);
      case "shipping":
        return shipping;
      default:
        return 0;
    }
  };

  const promoDiscount = calculatePromoDiscount();
  const finalShipping = appliedPromo?.type === "shipping" ? 0 : shipping;
  const finalTotal = subtotal - promoDiscount + finalShipping + tax;
  const freeShippingThreshold = 75;
  const needsForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

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
            {cartItems.map((item) => (
              <div key={item.id} className="flex space-x-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-600">{item.brand}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">
                        ${(item.originalPrice * item.quantity).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Promo Code Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Tag className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Promo Code
            </span>
          </div>

          {appliedPromo ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">
                    {appliedPromo.code}
                  </span>
                </div>
                <Button
                  onClick={handleRemovePromo}
                  variant="ghost"
                  size="sm"
                  className="text-green-700 hover:text-green-800 text-xs p-1"
                >
                  Remove
                </Button>
              </div>
              <p className="text-xs text-green-700 mt-1">
                {appliedPromo.description}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value);
                    setPromoError("");
                  }}
                  placeholder="Enter promo code"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  onClick={handleApplyPromo}
                  variant="outline"
                  size="sm"
                  disabled={!promoCode.trim()}
                >
                  Apply
                </Button>
              </div>
              {promoError && (
                <div className="flex items-center text-red-600 text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {promoError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Order Totals */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal ({itemCount} items)</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          {appliedPromo && promoDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({appliedPromo.code})</span>
              <span className="font-medium">-${promoDiscount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center">
              Shipping
              <span className="ml-1 text-xs">
                ({getShippingName(selectedShipping)})
              </span>
            </span>
            <span
              className={`font-medium ${
                finalShipping === 0 ? "text-green-600" : "text-gray-900"
              }`}
            >
              {finalShipping === 0 ? "Free" : `$${finalShipping.toFixed(2)}`}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="text-blue-600">${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Free Shipping Progress */}
        {shipping > 0 &&
          needsForFreeShipping > 0 &&
          !appliedPromo?.type === "shipping" && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center text-blue-700 text-sm mb-2">
                <Truck className="h-4 w-4 mr-2" />
                <span className="font-medium">
                  Add ${needsForFreeShipping.toFixed(2)} more for free shipping!
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

      {/* Customer Reviews */}
      <Card className="hidden lg:block">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
          <Star className="h-4 w-4 text-yellow-500 mr-2" />
          Customer Reviews
        </h4>
        <div className="space-y-4">
          {[
            {
              name: "Sarah M.",
              rating: 5,
              review: "Fast shipping and excellent quality! Highly recommend.",
              date: "2 days ago",
            },
            {
              name: "Mike R.",
              rating: 5,
              review:
                "Great customer service and quick delivery. Will order again!",
              date: "1 week ago",
            },
          ].map((review, index) => (
            <div
              key={index}
              className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0"
            >
              <div className="flex items-center space-x-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < review.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-600 ml-2">
                  {review.name} • {review.date}
                </span>
              </div>
              <p className="text-xs text-gray-700">{review.review}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Gift Message */}
      <Card className="hidden lg:block">
        <div className="flex items-center mb-3">
          <Gift className="h-4 w-4 text-pink-600 mr-2" />
          <span className="text-sm font-medium text-gray-700">
            Add Gift Message
          </span>
        </div>
        <textarea
          placeholder="Write a personal message..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-2">
          Gift messages are included free of charge
        </p>
      </Card>
    </div>
  );
};

export default OrderSummary;
