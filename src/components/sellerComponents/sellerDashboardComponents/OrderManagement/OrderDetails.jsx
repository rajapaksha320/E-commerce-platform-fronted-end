import React, { useState } from "react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Package,
  Truck,
  CreditCard,
  DollarSign,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  Ban,
  MessageCircle,
  Printer,
  Edit,
  Send,
  FileText,
  AlertTriangle,
  Star,
} from "lucide-react";

// Import UI components
import {
  Button,
  IconButton,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Modal,
  ModalContent,
  ModalFooter,
  CopyField,
  Alert,
  FormField,
  Select,
  Textarea,
} from "../../../ui/sellerUis/Uis";

const OrderDetails = ({ order, onClose, onOrderUpdate }) => {
  const [copiedFields, setCopiedFields] = useState({});
  const [showContactModal, setShowContactModal] = useState(false);
  const [customerMessage, setCustomerMessage] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleCopy = (fieldName) => {
    setCopiedFields((prev) => ({ ...prev, [fieldName]: true }));
    setTimeout(() => {
      setCopiedFields((prev) => ({ ...prev, [fieldName]: false }));
    }, 2000);
  };

  // Helper function to format order number like user page
  const getOrderDisplayNumber = (order) => {
    return order.orderNumber || `#ORD-${order._id.slice(-6)}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "confirmed":
        return <Package className="h-5 w-5 text-orange-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      case "confirmed":
        return "orange";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending Payment";
      case "confirmed":
        return "Confirmed";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status || "Unknown";
    }
  };

  const getCustomerName = (order) => {
    if (!order.shippingAddress) return "Unknown Customer";
    return order.shippingAddress.split(",")[0] || "Unknown Customer";
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdatingStatus(true);
      await onOrderUpdate?.(order, newStatus);
      onClose();
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleContactCustomer = () => {
    // This would typically integrate with your messaging system
    console.log("Contacting customer:", customerMessage);
    setShowContactModal(false);
    setCustomerMessage("");
  };

  const renderRatingStars = (rating) => {
    if (!rating) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">No rating yet</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-gray-700">({rating}/5)</span>
      </div>
    );
  };

  // Get available actions based on order status - UPDATED WORKFLOW
  const getAvailableActions = () => {
    const actions = [];

    // Status-specific actions for seller workflow
    switch (order?.orderStatus) {
      case "pending":
        // Seller can mark as shipped and cancel only in pending state
        actions.push({
          key: "ship",
          label: "Mark as Shipped",
          icon: <Truck />,
          variant: "primary",
          onClick: () => handleStatusChange("shipped"),
          disabled: isUpdatingStatus,
        });
        actions.push({
          key: "cancel",
          label: "Cancel Order",
          icon: <Ban />,
          variant: "danger",
          onClick: () => {
            // You can integrate with cancel modal here if needed
            handleStatusChange("cancelled");
          },
          disabled: isUpdatingStatus,
        });
        break;

      case "shipped":
        // Seller can mark as delivered
        actions.push({
          key: "delivered",
          label: "Mark as Delivered",
          icon: <CheckCircle />,
          variant: "success",
          onClick: () => handleStatusChange("delivered"),
          disabled: isUpdatingStatus,
        });
        break;

      // No actions for confirmed, delivered or cancelled orders
      case "confirmed":
      case "delivered":
      case "cancelled":
        break;
    }

    return actions;
  };

  if (!order) return null;

  const availableActions = getAvailableActions();

  return (
    <>
      <Modal
        isOpen={true}
        onClose={onClose}
        size="2xl"
        title="Order Details"
        hideCloseButton={false}
      >
        <ModalContent className="p-0">
          {/* Header */}
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                {getStatusIcon(order.orderStatus)}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 font-mono">
                    {getOrderDisplayNumber(order)}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge
                variant={getStatusVariant(order.orderStatus)}
                size="lg"
                icon={getStatusIcon(order.orderStatus)}
              >
                {getStatusLabel(order.orderStatus)}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-blue-800">
                      Order Date
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-green-800">
                      Total Amount
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    LKR {order.totalAmount.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-purple-800">
                      Shipping
                    </span>
                  </div>
                  <p className="text-xl font-bold text-purple-900">
                    {order.shippingOption}
                  </p>
                  {order.isReviewed && (
                    <p className="text-sm text-purple-700 capitalize">
                      Reviewed
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Customer Rating */}
            {order.orderRating && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500 rounded-lg">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    Customer Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      {renderRatingStars(order.orderRating)}
                      <p className="text-sm text-gray-600 mt-2">
                        Customer feedback helps improve your service
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-yellow-500">
                        {order.orderRating}
                      </div>
                      <div className="text-sm text-gray-500">out of 5</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CopyField
                  label="Customer Name"
                  value={getCustomerName(order)}
                  icon={<User />}
                  onCopy={() => handleCopy("customerName")}
                  copied={copiedFields.customerName}
                />
                <CopyField
                  label="Shipping Option"
                  value={order.shippingOption}
                  icon={<Truck />}
                  onCopy={() => handleCopy("shippingOption")}
                  copied={copiedFields.shippingOption}
                />
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <CopyField
                  label="Full Shipping Address"
                  value={order.shippingAddress}
                  icon={<MapPin />}
                  onCopy={() => handleCopy("fullAddress")}
                  copied={copiedFields.fullAddress}
                />

                <CopyField
                  label="Shipping Method"
                  value={order.shippingOption}
                  icon={<Truck />}
                  onCopy={() => handleCopy("shippingMethod")}
                  copied={copiedFields.shippingMethod}
                />

                {order.trackingNumber && (
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <CopyField
                        label="Tracking Number"
                        value={order.trackingNumber}
                        icon={<Package />}
                        onCopy={() => handleCopy("trackingNumber")}
                        copied={copiedFields.trackingNumber}
                      />
                    </div>
                    <Button variant="primary" icon={<ExternalLink />} size="sm">
                      Track Package
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-orange-600 rounded-lg">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  Order Items ({order.listings?.length || 0}{" "}
                  {(order.listings?.length || 0) === 1 ? "item" : "items"})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {order.listings?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <img
                      src={item.images?.[0]?.url || "/placehold.png"}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                      onError={(e) => {
                        e.target.src = "/placehold.png";
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm text-gray-600 font-medium">
                          Brand:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {item.brand}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm text-gray-600 font-medium">
                          SKU:
                        </span>
                        <CopyField
                          label=""
                          value={item.id}
                          onCopy={() => handleCopy(`sku-${index}`)}
                          copied={copiedFields[`sku-${index}`]}
                          className="bg-white"
                        />
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Category
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {item.category?.main} / {item.category?.sub}
                          </p>
                        </div>
                        {item.averageRating > 0 && (
                          <div className="text-center">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                              Product Rating
                            </p>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-semibold text-gray-900">
                                {item.averageRating}
                              </span>
                            </div>
                          </div>
                        )}
                        {item.review && (
                          <div className="text-center">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                              Review
                            </p>
                            <p className="text-sm italic text-gray-700">
                              "{item.review}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Order Total */}
                <div className="pt-6 border-t-2 border-gray-200">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-6 flex justify-between items-center">
                      <span className="text-xl font-bold text-green-900">
                        Order Total:
                      </span>
                      <span className="text-3xl font-bold text-green-600">
                        LKR {order.totalAmount.toLocaleString()}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            {order.orderStatus === "cancelled" && order.cancelReason && (
              <Card>
                <CardHeader>
                  <CardTitle>Cancellation Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-6">
                      <p className="text-xs text-red-600 uppercase tracking-wide font-semibold mb-2">
                        Cancel Reason
                      </p>
                      <p className="text-lg font-bold text-red-900">
                        {order.cancelReason}
                      </p>
                      {order.cancelNotes && (
                        <p className="text-sm text-red-700 mt-2 italic">
                          "{order.cancelNotes}"
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            )}
          </div>
        </ModalContent>

        {/* Action Buttons Footer */}
        <ModalFooter className="bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap gap-3 justify-end">
            {isUpdatingStatus && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Updating status...</span>
              </div>
            )}
            {availableActions.map((action) => (
              <Button
                key={action.key}
                variant={action.variant}
                icon={action.icon}
                onClick={action.onClick}
                size="sm"
                disabled={action.disabled}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </ModalFooter>
      </Modal>

      {/* Contact Customer Modal */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Contact Customer"
        size="md"
      >
        <ModalContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <User className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">
                {getCustomerName(order)}
              </span>
            </div>
            <p className="text-sm text-blue-700 font-mono">
              Order: {getOrderDisplayNumber(order)}
            </p>
          </div>

          <FormField label="Message" required>
            <Textarea
              value={customerMessage}
              onChange={(e) => setCustomerMessage(e.target.value)}
              placeholder="Type your message to the customer..."
              rows={4}
              resize={false}
            />
          </FormField>
        </ModalContent>
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => setShowContactModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleContactCustomer}
            icon={<Send />}
          >
            Send Message
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default OrderDetails;
