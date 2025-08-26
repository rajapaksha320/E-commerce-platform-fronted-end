import {
  Truck,
  Zap,
  Clock,
  Calendar,
  Package,
  Star,
  Shield,
} from "lucide-react";
import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";

const ShippingOptions = ({ selectedShipping, onShippingChange }) => {
  const shippingOptions = [
    {
      id: "standard",
      name: "Standard Delivery",

      price: 0,
      originalPrice: 9.99,
      estimatedDays: "5-7 business days",
      icon: Truck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      features: [
        "Free on orders $75+",
        "Tracking included",
        "Signature not required",
      ],
      popular: false,
    },
    {
      id: "express",
      name: "Express Delivery",
      description: "Faster delivery for urgent orders",
      price: 3500,
      originalPrice: null,
      estimatedDays: "2-3 business days",
      icon: Zap,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      features: [
        "Expedited processing",
        "Priority handling",
        "Tracking included",
      ],
      popular: true,
    },
    {
      id: "overnight",
      name: "Overnight Delivery",
      description: "Next business day delivery",
      price: 6500,
      originalPrice: null,
      estimatedDays: "1 business day",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      features: [
        "Next day delivery",
        "Signature required",
        "Priority processing",
      ],
      popular: false,
    },
  ];

  const handleShippingSelect = (optionId) => {
    onShippingChange(optionId);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Package className="h-5 w-5 text-blue-600 mr-2" />
          Delivery Options
        </h2>
        <div className="text-sm text-gray-600">
          <div className="flex items-center">
            <Shield className="h-4 w-4 text-green-600 mr-1" />
            <span>Secure delivery</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {shippingOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedShipping === option.id;

          return (
            <div
              key={option.id}
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? `${option.borderColor} ${option.bgColor} shadow-sm`
                  : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm"
              }`}
              onClick={() => handleShippingSelect(option.id)}
            >
              {/* Popular Badge */}
              {option.popular && (
                <div className="absolute -top-2 left-4">
                  <Badge
                    variant="warning"
                    size="sm"
                    className="flex items-center"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="flex items-start space-x-4">
                {/* Radio Button */}
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                      isSelected
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>

                {/* Icon */}
                <div
                  className={`flex-shrink-0 p-2 rounded-lg ${
                    isSelected ? option.bgColor : "bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isSelected ? option.color : "text-gray-600"
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">
                        {option.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {option.description}
                      </p>

                      {/* Estimated Delivery */}
                      {/* <div className="flex items-center mt-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-gray-600">
                          Estimated delivery:{" "}
                          <span className="font-medium">
                            {option.estimatedDays}
                          </span>
                        </span>
                      </div> */}

                      {/* Features */}
                      {/* <div className="mt-3">
                        <ul className="space-y-1">
                          {option.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center text-sm text-gray-600"
                            >
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 flex-shrink-0"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div> */}
                    </div>

                    {/* Price */}
                    <div className="text-right ml-4">
                      <div className="flex items-center space-x-2">
                        {option.price === 0 ? (
                          <div>
                            <span className="text-lg font-bold text-green-600">
                              Free
                            </span>
                            {option.originalPrice && (
                              <div className="text-sm text-gray-500 line-through">
                                LKR {option.originalPrice}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            LKR {option.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info for Selected Option */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {/* <div className="flex items-center text-gray-600">
                      <Truck className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Tracking number provided</span>
                    </div> */}
                    <div className="flex items-center text-gray-600">
                      <Shield className="h-4 w-4 mr-2 text-green-600" />
                      <span>Package protection included</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Shipping Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Truck className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-blue-900 mb-1">
              Delivery Information
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Orders placed before 2 PM EST, if choose the same day delivery</li>
              <li>• Delivery estimates exclude weekends and holidays</li>
              <li>• Signature may be required for high-value items</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Delivery Address Preview */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span>Items will be delivered to your selected address</span>
        </div>
      </div>
    </Card>
  );
};

export default ShippingOptions;
