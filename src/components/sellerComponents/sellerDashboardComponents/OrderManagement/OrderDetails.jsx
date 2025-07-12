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
  Trash2,
  MessageCircle,
  Printer,
  Edit,
  Send,
  FileText,
  AlertTriangle,
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
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showMarkShippedModal, setShowMarkShippedModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Form states
  const [cancelReason, setCancelReason] = useState("");
  const [cancelNotes, setCancelNotes] = useState("");
  const [refundAmount, setRefundAmount] = useState(order?.total || 0);
  const [refundReason, setRefundReason] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingCarrier, setShippingCarrier] = useState("");
  const [customerMessage, setCustomerMessage] = useState("");

  const handleCopy = (fieldName) => {
    setCopiedFields((prev) => ({ ...prev, [fieldName]: true }));
    setTimeout(() => {
      setCopiedFields((prev) => ({ ...prev, [fieldName]: false }));
    }, 2000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "awaiting-shipment":
        return <Package className="h-5 w-5 text-orange-600" />;
      case "awaiting-payment":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "returned":
        return <RefreshCw className="h-5 w-5 text-purple-600" />;
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
      case "awaiting-shipment":
        return "orange";
      case "awaiting-payment":
        return "warning";
      case "cancelled":
        return "danger";
      case "returned":
        return "purple";
      default:
        return "default";
    }
  };

  // Cancel reasons
  const cancelReasons = [
    { value: "out-of-stock", label: "Out of Stock" },
    { value: "pricing-error", label: "Pricing Error" },
    { value: "customer-request", label: "Customer Request" },
    { value: "payment-issue", label: "Payment Issue" },
    { value: "shipping-issue", label: "Shipping Issue" },
    { value: "duplicate-order", label: "Duplicate Order" },
    { value: "other", label: "Other" },
  ];

  // Refund reasons
  const refundReasons = [
    { value: "defective-item", label: "Defective Item" },
    { value: "wrong-item", label: "Wrong Item Sent" },
    { value: "customer-request", label: "Customer Request" },
    { value: "not-as-described", label: "Not as Described" },
    { value: "damaged-shipping", label: "Damaged in Shipping" },
    { value: "other", label: "Other" },
  ];

  // Shipping carriers
  const shippingCarriers = [
    { value: "fedex", label: "FedEx" },
    { value: "ups", label: "UPS" },
    { value: "usps", label: "USPS" },
    { value: "dhl", label: "DHL" },
    { value: "other", label: "Other" },
  ];

  // Action handlers
  const handleCancelOrder = () => {
    if (!cancelReason) {
      alert("Please select a cancellation reason");
      return;
    }

    const updatedOrder = {
      ...order,
      status: "cancelled",
      cancelReason: cancelReasons.find((r) => r.value === cancelReason)?.label,
      cancelNotes: cancelNotes,
      cancelledDate: new Date().toISOString().split("T")[0],
    };

    onOrderUpdate?.(updatedOrder);
    setShowCancelModal(false);
    onClose();
  };

  const handleDeleteOrder = () => {
    onOrderUpdate?.(null, "delete");
    setShowDeleteModal(false);
    onClose();
  };

  const handleMarkAsShipped = () => {
    if (!trackingNumber || !shippingCarrier) {
      alert("Please provide tracking number and shipping carrier");
      return;
    }

    const updatedOrder = {
      ...order,
      status: "shipped",
      trackingNumber: trackingNumber,
      shippingCarrier: shippingCarriers.find((c) => c.value === shippingCarrier)
        ?.label,
      shippedDate: new Date().toISOString().split("T")[0],
    };

    onOrderUpdate?.(updatedOrder);
    setShowMarkShippedModal(false);
    onClose();
  };

  const handleMarkAsDelivered = () => {
    const updatedOrder = {
      ...order,
      status: "delivered",
      deliveredDate: new Date().toISOString().split("T")[0],
    };

    onOrderUpdate?.(updatedOrder);
    onClose();
  };

  const handleRefundOrder = () => {
    if (!refundReason) {
      alert("Please select a refund reason");
      return;
    }

    const updatedOrder = {
      ...order,
      status: "returned",
      refundAmount: refundAmount,
      refundReason: refundReasons.find((r) => r.value === refundReason)?.label,
      refundDate: new Date().toISOString().split("T")[0],
    };

    onOrderUpdate?.(updatedOrder);
    setShowRefundModal(false);
    onClose();
  };

  const handleContactCustomer = () => {
    // This would typically integrate with your messaging system
    console.log("Contacting customer:", customerMessage);
    setShowContactModal(false);
    setCustomerMessage("");
  };

  // Get available actions based on order status
  const getAvailableActions = () => {
    const actions = [];

    // Always available actions
    actions.push({
      key: "contact",
      label: "Contact Customer",
      icon: <MessageCircle />,
      variant: "secondary",
      onClick: () => setShowContactModal(true),
    });

    actions.push({
      key: "print",
      label: "Print Details",
      icon: <Printer />,
      variant: "secondary",
      onClick: () => window.print(),
    });

    // Status-specific actions
    switch (order?.status) {
      case "awaiting-payment":
        actions.push({
          key: "cancel",
          label: "Cancel Order",
          icon: <Ban />,
          variant: "danger",
          onClick: () => setShowCancelModal(true),
        });
        break;

      case "awaiting-shipment":
        actions.push({
          key: "ship",
          label: "Mark as Shipped",
          icon: <Truck />,
          variant: "primary",
          onClick: () => setShowMarkShippedModal(true),
        });
        actions.push({
          key: "cancel",
          label: "Cancel Order",
          icon: <Ban />,
          variant: "danger",
          onClick: () => setShowCancelModal(true),
        });
        break;

      case "shipped":
        actions.push({
          key: "delivered",
          label: "Mark as Delivered",
          icon: <CheckCircle />,
          variant: "success",
          onClick: handleMarkAsDelivered,
        });
        break;

      case "delivered":
        actions.push({
          key: "refund",
          label: "Process Refund",
          icon: <RefreshCw />,
          variant: "warning",
          onClick: () => setShowRefundModal(true),
        });
        break;
    }

    // Delete action (available for most statuses except active ones)
    if (!["shipped", "awaiting-shipment"].includes(order?.status)) {
      actions.push({
        key: "delete",
        label: "Delete Order",
        icon: <Trash2 />,
        variant: "danger",
        onClick: () => setShowDeleteModal(true),
      });
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
                {getStatusIcon(order.status)}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order {order.id}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Placed on {order.orderDate}
                  </p>
                </div>
              </div>
              <Badge
                variant={getStatusVariant(order.status)}
                size="lg"
                icon={getStatusIcon(order.status)}
              >
                {order.status
                  .replace("-", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
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
                    {order.orderDate}
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
                    ${order.total.toLocaleString()}
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
                      Payment
                    </span>
                  </div>
                  <p className="text-xl font-bold text-purple-900">
                    {order.paymentMethod}
                  </p>
                  <p className="text-sm text-purple-700 capitalize">
                    {order.paymentStatus}
                  </p>
                </CardContent>
              </Card>
            </div>

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
                  label="Full Name"
                  value={order.buyer.name}
                  icon={<User />}
                  onCopy={() => handleCopy("customerName")}
                  copied={copiedFields.customerName}
                />
                <CopyField
                  label="Username"
                  value={order.buyer.username}
                  icon={<User />}
                  onCopy={() => handleCopy("customerUsername")}
                  copied={copiedFields.customerUsername}
                />
                <CopyField
                  label="Email Address"
                  value={order.buyer.email}
                  icon={<Mail />}
                  onCopy={() => handleCopy("customerEmail")}
                  copied={copiedFields.customerEmail}
                />
                <CopyField
                  label="Phone Number"
                  value={order.buyer.phone}
                  icon={<Phone />}
                  onCopy={() => handleCopy("customerPhone")}
                  copied={copiedFields.customerPhone}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CopyField
                    label="Street Address"
                    value={order.shippingAddress.street}
                    icon={<MapPin />}
                    onCopy={() => handleCopy("street")}
                    copied={copiedFields.street}
                  />
                  <CopyField
                    label="City"
                    value={order.shippingAddress.city}
                    icon={<MapPin />}
                    onCopy={() => handleCopy("city")}
                    copied={copiedFields.city}
                  />
                  <CopyField
                    label="State"
                    value={order.shippingAddress.state}
                    icon={<MapPin />}
                    onCopy={() => handleCopy("state")}
                    copied={copiedFields.state}
                  />
                  <CopyField
                    label="ZIP Code"
                    value={order.shippingAddress.zip}
                    icon={<MapPin />}
                    onCopy={() => handleCopy("zip")}
                    copied={copiedFields.zip}
                  />
                  <CopyField
                    label="Full Address"
                    value={`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}`}
                    icon={<MapPin />}
                    onCopy={() => handleCopy("fullAddress")}
                    copied={copiedFields.fullAddress}
                  />
                  <CopyField
                    label="Shipping Method"
                    value={order.shippingMethod}
                    icon={<Truck />}
                    onCopy={() => handleCopy("shippingMethod")}
                    copied={copiedFields.shippingMethod}
                  />
                </div>

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
                  Order Items ({order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm text-gray-600 font-medium">
                          SKU:
                        </span>
                        <CopyField
                          label=""
                          value={item.sku}
                          onCopy={() => handleCopy(`sku-${index}`)}
                          copied={copiedFields[`sku-${index}`]}
                          className="bg-white"
                        />
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Quantity
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {item.quantity}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Unit Price
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            ${item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Item Total
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            ${(item.quantity * item.price).toLocaleString()}
                          </p>
                        </div>
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
                        ${order.total.toLocaleString()}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            {(order.cancelReason ||
              order.returnReason ||
              order.estimatedDelivery ||
              order.deliveredDate) && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {order.estimatedDelivery && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-6">
                        <p className="text-xs text-blue-600 uppercase tracking-wide font-semibold mb-2">
                          Estimated Delivery
                        </p>
                        <p className="text-lg font-bold text-blue-900">
                          {order.estimatedDelivery}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  {order.deliveredDate && (
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-6">
                        <p className="text-xs text-green-600 uppercase tracking-wide font-semibold mb-2">
                          Delivered Date
                        </p>
                        <p className="text-lg font-bold text-green-900">
                          {order.deliveredDate}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  {order.cancelReason && (
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
                  )}
                  {order.returnReason && (
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="p-6">
                        <p className="text-xs text-purple-600 uppercase tracking-wide font-semibold mb-2">
                          Return Reason
                        </p>
                        <p className="text-lg font-bold text-purple-900">
                          {order.returnReason}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </ModalContent>

        {/* Action Buttons Footer */}
        <ModalFooter className="bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap gap-3 justify-end">
            {availableActions.map((action) => (
              <Button
                key={action.key}
                variant={action.variant}
                icon={action.icon}
                onClick={action.onClick}
                size="sm"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </ModalFooter>
      </Modal>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Order"
        size="md"
      >
        <ModalContent className="space-y-4">
          <Alert variant="warning" title={`Cancel Order ${order.id}`}>
            This action cannot be undone. The customer will be notified of the
            cancellation.
          </Alert>

          <FormField label="Cancellation Reason" required>
            <Select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Select a reason..."
            >
              {cancelReasons.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Additional Notes (Optional)">
            <Textarea
              value={cancelNotes}
              onChange={(e) => setCancelNotes(e.target.value)}
              placeholder="Provide additional details about the cancellation..."
              rows={3}
              resize={false}
            />
          </FormField>
        </ModalContent>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Keep Order
          </Button>
          <Button variant="danger" onClick={handleCancelOrder} icon={<Ban />}>
            Cancel Order
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Order Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Order"
        size="md"
      >
        <ModalContent className="space-y-4">
          <Alert
            variant="danger"
            title={`Permanently Delete Order ${order.id}`}
          >
            This action cannot be undone. All order data will be permanently
            removed from the system.
          </Alert>

          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Order Details:
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Customer:</span>{" "}
                  {order.buyer.name}
                </p>
                <p>
                  <span className="font-medium">Total:</span> $
                  {order.total.toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Date:</span> {order.orderDate}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span className="capitalize">
                    {order.status.replace("-", " ")}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </ModalContent>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteOrder}
            icon={<Trash2 />}
          >
            Delete Order
          </Button>
        </ModalFooter>
      </Modal>

      {/* Mark as Shipped Modal */}
      <Modal
        isOpen={showMarkShippedModal}
        onClose={() => setShowMarkShippedModal(false)}
        title="Mark as Shipped"
        size="md"
      >
        <ModalContent className="space-y-4">
          <Alert variant="primary" title={`Ship Order ${order.id}`}>
            Please provide tracking information for the shipment.
          </Alert>

          <FormField label="Shipping Carrier" required>
            <Select
              value={shippingCarrier}
              onChange={(e) => setShippingCarrier(e.target.value)}
              placeholder="Select shipping carrier..."
            >
              {shippingCarriers.map((carrier) => (
                <option key={carrier.value} value={carrier.value}>
                  {carrier.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Tracking Number" required>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </FormField>
        </ModalContent>
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => setShowMarkShippedModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleMarkAsShipped}
            icon={<Truck />}
          >
            Mark as Shipped
          </Button>
        </ModalFooter>
      </Modal>

      {/* Refund Modal */}
      <Modal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        title="Process Refund"
        size="md"
      >
        <ModalContent className="space-y-4">
          <Alert variant="warning" title={`Refund Order ${order.id}`}>
            This will process a refund for the customer.
          </Alert>

          <FormField label="Refund Amount" required>
            <input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(parseFloat(e.target.value))}
              max={order.total}
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </FormField>

          <FormField label="Refund Reason" required>
            <Select
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Select a reason..."
            >
              {refundReasons.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </Select>
          </FormField>
        </ModalContent>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowRefundModal(false)}>
            Cancel
          </Button>
          <Button
            variant="warning"
            onClick={handleRefundOrder}
            icon={<RefreshCw />}
          >
            Process Refund
          </Button>
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
                {order.buyer.name}
              </span>
            </div>
            <p className="text-sm text-blue-700">{order.buyer.email}</p>
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
