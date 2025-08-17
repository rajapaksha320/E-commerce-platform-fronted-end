import React, { useState } from "react";
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
  CheckSquare,
} from "lucide-react";
import { Button, Badge } from "../../components/ui/ContactUis/Uis";
import ProductReviewModal from "./ProductReviewModal";

const OrderDetailsModal = ({
  isOpen,
  onClose,
  order,
  onSubmitReview,
  fetchOrders,
}) => {
  // Review modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  if (!isOpen || !order) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "warning", icon: Clock, label: "Pending" },
      confirmed: { variant: "success", icon: CheckSquare, label: "Confirmed" },
      shipped: { variant: "primary", icon: Truck, label: "Shipped" },
      delivered: { variant: "success", icon: CheckCircle, label: "Delivered" },
      cancelled: { variant: "danger", icon: XCircle, label: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.pending;
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

  // Get product details
  const getProductImage = (item) => {
    if (!item?.images?.length) return "/placehold.png";
    const primaryImage = item.images.find((img) => img.isPrimary);
    return primaryImage?.url || item.images[0]?.url || "/placehold.png";
  };

  const getProductPrice = (item) => {
    if (!item?.variations?.length) return 0;
    const defaultVariation =
      item.variations.find((v) => v.isDefault) || item.variations[0];
    return defaultVariation?.price || 0;
  };

  const calculateTotal = () => {
    const subtotal =
      order.listingIds?.reduce((sum, item) => sum + getProductPrice(item), 0) ||
      order.totalAmount ||
      0;

    const shipping = 9.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const { subtotal, shipping, tax, total } = calculateTotal();

  const handleCopyOrderNumber = () => {
    const orderNumber = order.orderNumber || `#ORD-${order._id.slice(-6)}`;
    navigator.clipboard.writeText(orderNumber);
  };

  // Review handling functions
  const handleReviewProduct = (product) => {
    setSelectedProduct(product);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmitProductReview = async (reviewData) => {
    try {
      if (onSubmitReview) {
        await onSubmitReview(reviewData);
      }

      // Refresh orders if callback provided
      if (fetchOrders) {
        fetchOrders();
      }

      handleCloseReviewModal();
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  // Format shipping address
  const formatShippingAddress = () => {
    if (!order.shippingAddress) return "No shipping address";
    const addr = order.shippingAddress;
    return `${addr.streetAddress}, ${addr.city}, ${addr.state} ${addr.zipCode}`;
  };

  const orderNumber = order.orderNumber || `#ORD-${order._id.slice(-6)}`;

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
                          {orderNumber}
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
                        {formatDate(order.createdAt || order.orderDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status:</span>
                      {getStatusBadge(order.orderStatus)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="text-lg font-bold text-gray-900">
                        <span className="mr-1">LKR</span>
                        {(order.totalAmount || total).toFixed(2)}
                      </span>
                    </div>
                    {/* Review Status */}
                    {order.orderStatus === "delivered" && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Review Status:</span>
                        {order.isReviewed ? (
                          <Badge
                            variant="success"
                            className="flex items-center"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Reviewed
                          </Badge>
                        ) : (
                          <Badge
                            variant="warning"
                            className="flex items-center"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            Pending Review
                          </Badge>
                        )}
                      </div>
                    )}
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
                          {formatShippingAddress()}
                        </p>
                      </div>
                    </div>
                    {order.trackingNumber && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Tracking Number:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-gray-900 text-sm">
                            {order.trackingNumber}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                order.trackingNumber
                              )
                            }
                            className="p-1"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                    {order.estimatedDelivery && (
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
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items ({order.listingIds?.length || 0})
              </h3>
              <div className="space-y-4">
                {(order.listingIds || []).map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <img
                      src={getProductImage(item)}
                      alt={item.title || "Product"}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "/placehold.png";
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {item.title || "Unknown Product"}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.brandName || "Unknown Brand"}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            Quantity: 1
                          </span>
                          <span className="text-sm text-gray-600">
                            Unit Price: <span className="mr-1">LKR</span>
                            {getProductPrice(item).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-semibold text-gray-900">
                            <span className="mr-1">LKR</span>
                            {getProductPrice(item).toFixed(2)}
                          </span>

                          {/* Individual Product Review Button */}
                          {order.orderStatus === "delivered" &&
                            !order.isReviewed && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReviewProduct(item)}
                                className="flex items-center text-yellow-600 hover:text-yellow-700 border-yellow-300 hover:border-yellow-400 hover:bg-yellow-50"
                              >
                                <Star className="h-3 w-3 mr-1" />
                                Review
                              </Button>
                            )}
                        </div>
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
                    {(order.totalAmount || total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Specific Information */}
            {order.orderStatus === "cancelled" && order.cancelReason && (
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

            {order.orderStatus === "delivered" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    Order Delivered Successfully
                  </span>
                </div>
                <p className="text-green-700 mt-2">
                  Your order was delivered on{" "}
                  {formatDate(
                    order.actualDelivery ||
                      order.estimatedDelivery ||
                      order.createdAt
                  )}
                </p>
                {!order.isReviewed && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-yellow-800">
                      <Star className="h-4 w-4" />
                      <span className="font-medium">Review Reminder</span>
                    </div>
                    <p className="text-yellow-700 text-sm mt-1">
                      Don't forget to review this order and help other
                      customers!
                    </p>
                  </div>
                )}
              </div>
            )}

            {order.orderStatus === "confirmed" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-blue-800">
                  <CheckSquare className="h-5 w-5" />
                  <span className="font-medium">Order Confirmed</span>
                </div>
                <p className="text-blue-700 mt-2">
                  Your order has been confirmed and is being prepared for
                  shipping.
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex flex-wrap gap-3 justify-end">
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
              {order.orderStatus === "delivered" && (
                <Button variant="outline" className="flex items-center">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reorder
                </Button>
              )}
              {order.trackingNumber && order.orderStatus !== "delivered" && (
                <Button variant="primary" className="flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  Track Package
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Review Modal */}
      <ProductReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        product={selectedProduct}
        order={order}
        onSubmitReview={handleSubmitProductReview}
      />
    </div>
  );
};

export default OrderDetailsModal;
