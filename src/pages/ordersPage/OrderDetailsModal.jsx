import React from "react";
import {
  X,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Phone,
  Mail,
  Copy,
  Download,
  Star,
  RotateCcw,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import { Button, Badge } from "../../components/ui/ContactUis/Uis";

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      processing: { variant: "warning", icon: Clock, label: "Processing" },
      shipped: { variant: "primary", icon: Truck, label: "Shipped" },
      delivered: { variant: "success", icon: CheckCircle, label: "Delivered" },
      cancelled: { variant: "danger", icon: XCircle, label: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.processing;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center">
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateTotal = () => {
    const subtotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = 9.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const { subtotal, shipping, tax, total } = calculateTotal();

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
  };

  // const handleCopyTrackingNumber = () => {
  //   if (order.trackingNumber) {
  //     navigator.clipboard.writeText(order.trackingNumber);
  //   }
  // };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
              <p className="text-sm text-gray-600">
                Complete information about your order
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-gray-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Order Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Order Number:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-gray-900">
                          {order.orderNumber}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyOrderNumber}
                          className="p-1"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="text-gray-900">
                        {formatDate(order.date)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status:</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="text-lg font-bold text-gray-900">
                        <span className="mr-1">LKR</span>
                        {order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Shipping Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-gray-900 font-medium">
                          Delivery Address
                        </p>
                        <p className="text-gray-600 text-sm">
                          {order.shippingAddress}
                        </p>
                      </div>
                    </div>
                    {/* {order.trackingNumber && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Tracking Number:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-gray-900 text-sm">
                            {order.trackingNumber}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyTrackingNumber}
                            className="p-1"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )} */}
                    {/* {order.estimatedDelivery && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          Estimated Delivery:
                        </span>
                        <span className="text-gray-900">
                          {formatDate(order.estimatedDelivery)}
                        </span>
                      </div>
                    )}
                    {order.actualDelivery && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Delivered On:</span>
                        <span className="text-green-600 font-medium">
                          {formatDate(order.actualDelivery)}
                        </span>
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items ({order.items.length})
              </h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </span>
                          <span className="text-sm text-gray-600">
                            Unit Price: <span className="mr-1">LKR</span>
                            {item.price.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">
                          <span className="mr-1">LKR</span>
                          {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total Breakdown */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">
                    <span className="mr-1">LKR</span>
                    {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-900">
                    <span className="mr-1">LKR</span>
                    {shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-900">
                    <span className="mr-1">LKR</span>
                    {tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-300">
                  <span className="text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    <span className="mr-1">LKR</span>
                    {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Specific Information */}
            {order.status === "cancelled" && order.cancelReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Order Cancelled</span>
                </div>
                <p className="text-red-700 mt-2">
                  Reason: {order.cancelReason}
                </p>
              </div>
            )}

            {order.status === "delivered" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    Order Delivered Successfully
                  </span>
                </div>
                <p className="text-green-700 mt-2">
                  Your order was delivered on{" "}
                  {formatDate(order.actualDelivery || order.estimatedDelivery)}
                </p>
              </div>
            )}

            {/* Customer Service */}
            {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">
                Need Help with Your Order?
              </h4>
              <div className="grid md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-center text-blue-700 border-blue-300 hover:bg-blue-100"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-center text-blue-700 border-blue-300 hover:bg-blue-100"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Us
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-center text-blue-700 border-blue-300 hover:bg-blue-100"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Live Chat
                </Button>
              </div>
            </div> */}
          </div>

          {/* Modal Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex flex-wrap gap-3 justify-end">
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
              {/* <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button> */}
              {order.status === "delivered" && (
                <>
                  {/* <Button variant="outline" className="flex items-center">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reorder
                  </Button> */}
                  <Button
                    variant="outline"
                    className="flex items-center text-yellow-600 hover:text-yellow-700 border-yellow-300 hover:border-yellow-400 hover:bg-yellow-50"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Leave Review
                  </Button>
                </>
              )}
              {/* {order.trackingNumber && order.status !== "delivered" && (
                <Button variant="primary" className="flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  Track Package
                </Button>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
