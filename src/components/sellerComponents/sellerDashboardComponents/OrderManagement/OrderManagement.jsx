import React, { useState, useMemo } from "react";
import {
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  User,
  RefreshCw,
  XCircle,
  Copy,
  Ban,
} from "lucide-react";

// Import UI components
import {
  Button,
  IconButton,
  Select,
  Checkbox,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Modal,
  ModalContent,
  ModalFooter,
  Avatar,
  FormField,
  Textarea,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Alert,
} from "../../../ui/sellerUis/Uis";

import OrderDetails from "./OrderDetails";

const OrderManagement = ({ activeSection = "all-orders" }) => {
  const [sortField, setSortField] = useState("orderDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelNotes, setCancelNotes] = useState("");
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orders, setOrders] = useState([]);

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Complete orders dataset
  const allOrdersData = [
    {
      id: "ORD-001234",
      orderDate: "2024-06-15",
      buyer: {
        name: "John Smith",
        username: "johnsmith_99",
        email: "john.smith@email.com",
        phone: "+1 (555) 123-4567",
      },
      items: [
        {
          name: "iPhone 15 Pro Max 256GB",
          sku: "IPH15PM-256",
          quantity: 1,
          price: 1199.0,
          image:
            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop",
        },
      ],
      total: 1199.0,
      status: "shipped",
      paymentStatus: "paid",
      paymentMethod: "PayPal",
      shippingMethod: "Express Shipping",
      trackingNumber: "TRK123456789",
      estimatedDelivery: "2024-06-17",
      shippingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "US",
      },
    },
    {
      id: "ORD-001235",
      orderDate: "2024-06-14",
      buyer: {
        name: "Sarah Johnson",
        username: "sarah_j2024",
        email: "sarah.johnson@email.com",
        phone: "+1 (555) 234-5678",
      },
      items: [
        {
          name: "MacBook Air M3 13-inch",
          sku: "MBA-M3-13",
          quantity: 1,
          price: 1299.0,
          image:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop",
        },
        {
          name: "Magic Mouse",
          sku: "MM-WHT",
          quantity: 1,
          price: 79.0,
          image:
            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop",
        },
      ],
      total: 1378.0,
      status: "awaiting-shipment",
      paymentStatus: "paid",
      paymentMethod: "Credit Card",
      shippingMethod: "Standard Shipping",
      trackingNumber: null,
      estimatedDelivery: "2024-06-20",
      shippingAddress: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zip: "90210",
        country: "US",
      },
    },
    {
      id: "ORD-001236",
      orderDate: "2024-06-13",
      buyer: {
        name: "Mike Wilson",
        username: "mikew_tech",
        email: "mike.wilson@email.com",
        phone: "+1 (555) 345-6789",
      },
      items: [
        {
          name: "Samsung Galaxy S24 Ultra",
          sku: "SGS24U-512",
          quantity: 1,
          price: 1199.99,
          image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop",
        },
      ],
      total: 1199.99,
      status: "awaiting-payment",
      paymentStatus: "pending",
      paymentMethod: "Bank Transfer",
      shippingMethod: "Standard Shipping",
      trackingNumber: null,
      estimatedDelivery: null,
      shippingAddress: {
        street: "789 Pine St",
        city: "Chicago",
        state: "IL",
        zip: "60601",
        country: "US",
      },
    },
    {
      id: "ORD-001240",
      orderDate: "2024-06-12",
      buyer: {
        name: "Tom Davis",
        username: "tom_davis92",
        email: "tom.davis@email.com",
        phone: "+1 (555) 456-7890",
      },
      items: [
        {
          name: 'iPad Pro 12.9" M4',
          sku: "IPADPM4-512",
          quantity: 1,
          price: 1299.0,
          image:
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&h=100&fit=crop",
        },
      ],
      total: 1299.0,
      status: "awaiting-shipment",
      paymentStatus: "paid",
      paymentMethod: "PayPal",
      shippingMethod: "Express Shipping",
      trackingNumber: null,
      estimatedDelivery: "2024-06-16",
      shippingAddress: {
        street: "321 Elm St",
        city: "Miami",
        state: "FL",
        zip: "33101",
        country: "US",
      },
    },
    {
      id: "ORD-001241",
      orderDate: "2024-06-10",
      buyer: {
        name: "Emily Davis",
        username: "emily_davis91",
        email: "emily.davis@email.com",
        phone: "+1 (555) 456-7890",
      },
      items: [
        {
          name: 'iPad Pro 12.9" M4',
          sku: "IPADPM4-512",
          quantity: 1,
          price: 1299.0,
          image:
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&h=100&fit=crop",
        },
      ],
      total: 1299.0,
      status: "delivered",
      paymentStatus: "paid",
      paymentMethod: "PayPal",
      shippingMethod: "Express Shipping",
      trackingNumber: "TRK987654321",
      estimatedDelivery: "2024-06-12",
      deliveredDate: "2024-06-12",
      shippingAddress: {
        street: "321 Elm St",
        city: "Miami",
        state: "FL",
        zip: "33101",
        country: "US",
      },
    },
    {
      id: "ORD-001242",
      orderDate: "2024-06-09",
      buyer: {
        name: "David Brown",
        username: "david_brown88",
        email: "david.brown@email.com",
        phone: "+1 (555) 567-8901",
      },
      items: [
        {
          name: "AirPods Pro 2nd Gen",
          sku: "APP2-USB-C",
          quantity: 2,
          price: 249.0,
          image:
            "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop",
        },
      ],
      total: 498.0,
      status: "cancelled",
      paymentStatus: "refunded",
      paymentMethod: "Credit Card",
      shippingMethod: "Standard Shipping",
      trackingNumber: null,
      cancelledDate: "2024-06-10",
      cancelReason: "Customer Request",
      shippingAddress: {
        street: "654 Maple Ave",
        city: "Seattle",
        state: "WA",
        zip: "98101",
        country: "US",
      },
    },
  ];

  // Initialize orders state
  React.useEffect(() => {
    setOrders(allOrdersData);
  }, []);

  // Cancel order reasons
  const cancelReasons = [
    { value: "out-of-stock", label: "Out of Stock" },
    { value: "pricing-error", label: "Pricing Error" },
    { value: "customer-request", label: "Customer Request" },
    { value: "payment-issue", label: "Payment Issue" },
    { value: "shipping-issue", label: "Shipping Issue" },
    { value: "duplicate-order", label: "Duplicate Order" },
    { value: "other", label: "Other" },
  ];

  // Handle cancel order
  const handleCancelOrder = (order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
    setCancelReason("");
    setCancelNotes("");
  };

  // Handle delete order
  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  // Confirm cancellation
  const confirmCancellation = () => {
    if (!cancelReason) {
      alert("Please select a cancellation reason");
      return;
    }

    // Update the order status in the orders array
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderToCancel.id
          ? {
              ...order,
              status: "cancelled",
              cancelReason: cancelReasons.find((r) => r.value === cancelReason)
                ?.label,
              cancelNotes: cancelNotes,
              cancelledDate: new Date().toISOString().split("T")[0],
            }
          : order
      )
    );

    setShowCancelModal(false);
    setShowSuccessModal(true);
    setOrderToCancel(null);
    setCancelReason("");
    setCancelNotes("");
  };

  // Confirm deletion
  const confirmDeletion = () => {
    // Remove the order from the orders array
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== orderToDelete.id)
    );

    setShowDeleteModal(false);
    setShowDeleteSuccessModal(true);
    setOrderToDelete(null);
  };

  // Handle view order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  // Filter orders based on active section
  const filteredOrders = useMemo(() => {
    switch (activeSection) {
      case "all-orders":
        return orders;
      case "awaiting-payment":
        return orders.filter((order) => order.status === "awaiting-payment");
      case "awaiting-shipment":
        return orders.filter((order) => order.status === "awaiting-shipment");
      case "paid-shipped":
        return orders.filter(
          (order) => order.status === "shipped" || order.status === "delivered"
        );
      case "cancellations":
        return orders.filter((order) => order.status === "cancelled");
      case "returns":
        return orders.filter((order) => order.status === "returned");
      case "disputes":
        return orders.filter((order) => order.status === "dispute");
      default:
        return orders;
    }
  }, [activeSection, orders]);

  // Get section configuration
  const getSectionConfig = () => {
    const configs = {
      "all-orders": {
        title: "All Orders",
        description: "Complete overview of all your orders",
        showColumns: [
          "order",
          "buyer",
          "items",
          "total",
          "status",
          "date",
          "actions",
        ],
      },
      "awaiting-payment": {
        title: "Awaiting Payment",
        description: "Orders waiting for payment confirmation",
        showColumns: [
          "order",
          "buyer",
          "items",
          "total",
          "paymentMethod",
          "date",
          "actions",
        ],
      },
      "awaiting-shipment": {
        title: "Awaiting Shipment",
        description: "Paid orders ready to ship",
        showColumns: [
          "order",
          "buyer",
          "items",
          "total",
          "shippingMethod",
          "date",
          "actions",
        ],
      },
      "paid-shipped": {
        title: "Paid and Shipped",
        description: "Orders that have been paid and shipped",
        showColumns: [
          "order",
          "buyer",
          "items",
          "total",
          "tracking",
          "status",
          "date",
          "actions",
        ],
      },
      cancellations: {
        title: "Cancellations",
        description: "Cancelled orders and refunds",
        showColumns: [
          "order",
          "buyer",
          "items",
          "total",
          "cancelReason",
          "date",
          "actions",
        ],
      },
      returns: {
        title: "Returns",
        description: "Returned items and return requests",
        showColumns: [
          "order",
          "buyer",
          "items",
          "total",
          "returnReason",
          "date",
          "actions",
        ],
      },
    };

    return configs[activeSection] || configs["all-orders"];
  };

  const config = getSectionConfig();

  // Helper functions
  const getStatusIcon = (status) => {
    switch (status) {
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "awaiting-shipment":
        return <Package className="h-4 w-4" />;
      case "awaiting-payment":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "returned":
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === filteredOrders.length
        ? []
        : filteredOrders.map((order) => order.id)
    );
  };

  // Cancel Order Modal Component
  const CancelOrderModal = () => (
    <Modal
      isOpen={showCancelModal}
      onClose={() => setShowCancelModal(false)}
      title="Cancel Order"
      size="md"
    >
      <ModalContent className="space-y-4">
        <Alert variant="warning" title={`Cancel Order ${orderToCancel?.id}`}>
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
        <Button variant="danger" onClick={confirmCancellation} icon={<Ban />}>
          Cancel Order
        </Button>
      </ModalFooter>
    </Modal>
  );

  // Delete Order Modal Component
  const DeleteOrderModal = () => (
    <Modal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      title="Delete Order"
      size="md"
    >
      <ModalContent className="space-y-4">
        <Alert
          variant="danger"
          title={`Permanently Delete Order ${orderToDelete?.id}`}
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
                {orderToDelete?.buyer.name}
              </p>
              <p>
                <span className="font-medium">Total:</span> $
                {orderToDelete?.total.toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {orderToDelete?.orderDate}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span className="capitalize">
                  {orderToDelete?.status.replace("-", " ")}
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
        <Button variant="danger" onClick={confirmDeletion} icon={<Trash2 />}>
          Delete Order
        </Button>
      </ModalFooter>
    </Modal>
  );

  // Success Modals
  const SuccessModal = () => (
    <Modal
      isOpen={showSuccessModal}
      onClose={() => setShowSuccessModal(false)}
      title=""
      size="sm"
    >
      <ModalContent className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Order Cancelled Successfully
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Order {orderToCancel?.id} has been cancelled and the customer has been
          notified.
        </p>
        <Button onClick={() => setShowSuccessModal(false)} className="w-full">
          Continue
        </Button>
      </ModalContent>
    </Modal>
  );

  const DeleteSuccessModal = () => (
    <Modal
      isOpen={showDeleteSuccessModal}
      onClose={() => setShowDeleteSuccessModal(false)}
      title=""
      size="sm"
    >
      <ModalContent className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Order Deleted Successfully
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Order {orderToDelete?.id} has been permanently deleted from the
          system.
        </p>
        <Button
          onClick={() => setShowDeleteSuccessModal(false)}
          className="w-full"
        >
          Continue
        </Button>
      </ModalContent>
    </Modal>
  );

  return (
    <div className="space-y-6">
      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{config.title}</CardTitle>
            {selectedOrders.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {selectedOrders.length} selected
                </span>
                <Button size="sm">Bulk Actions</Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      selectedOrders.length === filteredOrders.length &&
                      filteredOrders.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </TableHead>

                {config.showColumns.includes("order") && (
                  <TableHead
                    sortable
                    onSort={() => handleSort("id")}
                    sortDirection={sortField === "id" ? sortDirection : null}
                  >
                    Order ID
                  </TableHead>
                )}

                {config.showColumns.includes("buyer") && (
                  <TableHead
                    sortable
                    onSort={() => handleSort("buyer")}
                    sortDirection={sortField === "buyer" ? sortDirection : null}
                  >
                    Buyer
                  </TableHead>
                )}

                {config.showColumns.includes("items") && (
                  <TableHead>Items</TableHead>
                )}

                {config.showColumns.includes("total") && (
                  <TableHead
                    sortable
                    onSort={() => handleSort("total")}
                    sortDirection={sortField === "total" ? sortDirection : null}
                  >
                    Total
                  </TableHead>
                )}

                {config.showColumns.includes("status") && (
                  <TableHead
                    sortable
                    onSort={() => handleSort("status")}
                    sortDirection={
                      sortField === "status" ? sortDirection : null
                    }
                  >
                    Status
                  </TableHead>
                )}

                {config.showColumns.includes("paymentMethod") && (
                  <TableHead>Payment Method</TableHead>
                )}

                {config.showColumns.includes("shippingMethod") && (
                  <TableHead>Shipping</TableHead>
                )}

                {config.showColumns.includes("tracking") && (
                  <TableHead>Tracking</TableHead>
                )}

                {config.showColumns.includes("cancelReason") && (
                  <TableHead>Cancel Reason</TableHead>
                )}

                {config.showColumns.includes("date") && (
                  <TableHead
                    sortable
                    onSort={() => handleSort("orderDate")}
                    sortDirection={
                      sortField === "orderDate" ? sortDirection : null
                    }
                  >
                    Date
                  </TableHead>
                )}

                {config.showColumns.includes("actions") && (
                  <TableHead>Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                    />
                  </TableCell>

                  {config.showColumns.includes("order") && (
                    <TableCell>
                      <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                        {order.id}
                      </div>
                    </TableCell>
                  )}

                  {config.showColumns.includes("buyer") && (
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar
                          size="sm"
                          fallback={order.buyer.name.charAt(0)}
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {order.buyer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.buyer.username}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  )}

                  {config.showColumns.includes("items") && (
                    <TableCell>
                      <div className="max-w-xs">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 mb-1"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-8 w-8 rounded object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {item.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                Qty: {item.quantity} × ${item.price}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  )}

                  {config.showColumns.includes("total") && (
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900">
                        ${order.total.toLocaleString()}
                      </div>
                    </TableCell>
                  )}

                  {config.showColumns.includes("status") && (
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(order.status)}
                        icon={getStatusIcon(order.status)}
                      >
                        {order.status
                          .replace("-", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    </TableCell>
                  )}

                  {config.showColumns.includes("paymentMethod") && (
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {order.paymentMethod}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.paymentStatus}
                      </div>
                    </TableCell>
                  )}

                  {config.showColumns.includes("shippingMethod") && (
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {order.shippingMethod}
                      </div>
                      {order.estimatedDelivery && (
                        <div className="text-xs text-gray-500">
                          Est: {order.estimatedDelivery}
                        </div>
                      )}
                    </TableCell>
                  )}

                  {config.showColumns.includes("tracking") && (
                    <TableCell>
                      {order.trackingNumber ? (
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-mono text-blue-600">
                            {order.trackingNumber}
                          </span>
                          <IconButton size="sm">
                            <Copy className="h-3 w-3" />
                          </IconButton>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          No tracking
                        </span>
                      )}
                    </TableCell>
                  )}

                  {config.showColumns.includes("cancelReason") && (
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {order.cancelReason || "N/A"}
                      </div>
                      {order.cancelledDate && (
                        <div className="text-xs text-gray-500">
                          Cancelled: {order.cancelledDate}
                        </div>
                      )}
                    </TableCell>
                  )}

                  {config.showColumns.includes("date") && (
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {order.orderDate}
                      </div>
                    </TableCell>
                  )}

                  {config.showColumns.includes("actions") && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                          title="View Order Details"
                        >
                          <Eye className="h-4 w-4" />
                        </IconButton>

                        {/* Show cancel button only for awaiting-shipment orders */}
                        {order.status === "awaiting-shipment" && (
                          <IconButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelOrder(order)}
                            title="Cancel Order"
                            className="text-red-600 hover:text-red-900 hover:bg-red-50"
                          >
                            <Ban className="h-4 w-4" />
                          </IconButton>
                        )}

                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteOrder(order)}
                          title="Delete Order"
                          className="text-red-600 hover:text-red-900 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No orders found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                No orders match your current filters for{" "}
                {config.title.toLowerCase()}.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CancelOrderModal />
      <DeleteOrderModal />
      <SuccessModal />
      <DeleteSuccessModal />
      {showOrderDetails && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setShowOrderDetails(false)}
        />
      )}
    </div>
  );
};

export default OrderManagement;
