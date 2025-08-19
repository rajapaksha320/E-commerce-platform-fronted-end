import React from "react";
import {
  Ban,
  AlertTriangle,
  Package,
  DollarSign,
  User,
  Calendar,
} from "lucide-react";
import ConfirmationDialog from "./ConfirmationDialog";
import {
  FormField,
  Select,
  Textarea,
  Card,
  CardContent,
} from "./sellerUis/Uis";

export const OrderCancelConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  order,
  cancelReason,
  setCancelReason,
  cancelNotes,
  setCancelNotes,
  cancelReasons,
  isLoading = false,
}) => {
  const getCustomerName = (order) => {
    if (!order?.shippingAddress) return "Unknown Customer";
    return order.shippingAddress.split(",")[0] || "Unknown Customer";
  };

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Cancel Order"
      type="danger"
      confirmText={
        <div className="flex items-center">
          <Ban className="h-4 w-4 mr-2" />
          Cancel Order
        </div>
      }
      cancelText="Keep Order"
      isLoading={isLoading}
      icon={{
        component: AlertTriangle,
        className: "h-6 w-6 text-red-600",
      }}
    >
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">
            <strong>Warning:</strong> This action cannot be undone. The customer
            will be notified of the cancellation.
          </p>
        </div>

        {order && (
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Order Details:
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Order ID:</span>
                    <span className="text-gray-700">{order._id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Customer:</span>
                    <span className="text-gray-700">
                      {getCustomerName(order)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Total:</span>
                    <span className="text-gray-700">
                      LKR {order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Date:</span>
                    <span className="text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {order.listings && order.listings.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="font-medium text-gray-900 text-sm">
                    Items:
                  </span>
                  <div className="mt-2 space-y-1">
                    {order.listings.map((item, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        • {item.title} - {item.brand}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
      </div>
    </ConfirmationDialog>
  );
};

export const OrderStatusChangeConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  order,
  newStatus,
  isLoading = false,
}) => {
  const getStatusDetails = (status) => {
    switch (status) {
      case "confirmed":
        return {
          title: "Confirm Order",
          message: "Mark this order as confirmed and ready for shipment?",
          icon: Package,
          color: "blue",
        };
      case "shipped":
        return {
          title: "Mark as Shipped",
          message: "Mark this order as shipped?",
          icon: Package,
          color: "blue",
        };
      case "delivered":
        return {
          title: "Mark as Delivered",
          message: "Mark this order as delivered to the customer?",
          icon: Package,
          color: "green",
        };
      default:
        return {
          title: "Update Order Status",
          message: "Update the order status?",
          icon: Package,
          color: "blue",
        };
    }
  };

  const statusDetails = getStatusDetails(newStatus);

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={statusDetails.title}
      type={statusDetails.color === "green" ? "success" : "info"}
      confirmText="Update Status"
      cancelText="Cancel"
      isLoading={isLoading}
      message={statusDetails.message}
    >
      {order && (
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="text-sm">
              <p className="font-medium text-gray-900">Order: {order._id}</p>
              <p className="text-gray-600">
                Total: LKR {order.totalAmount.toLocaleString()}
              </p>
              <p className="text-gray-600">
                Current Status: {order.orderStatus}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </ConfirmationDialog>
  );
};
