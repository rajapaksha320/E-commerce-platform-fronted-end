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
  CopyField,
} from "../../../ui/sellerUis/Uis";

const OrderDetails = ({ order, onClose }) => {
  const [copiedFields, setCopiedFields] = useState({});

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

  if (!order) return null;

  return (
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
    </Modal>
  );
};

export default OrderDetails;
