/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from "react";
import {
  Eye,
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
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Printer,
  Download,
  Star,
  ImageOff,
} from "lucide-react";

// Import Redux hooks
import {
  useOrders,
  useOrdersByStatus,
  useOrderPagination,
  useSelectedOrders,
} from "../../../../hooks/useSellerOrderData";

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
  SearchInput,
  LoadingSpinner,
} from "../../../ui/sellerUis/Uis";

import OrderDetails from "./OrderDetails";
import PrintOrderReport from "./PrintOrderReport";
import { OrderCancelConfirmationDialog } from "../../../ui/OrderConfirmationDialogs";

const OrderManagement = ({
  activeSection = "all-orders",
  orderStatus = null,
}) => {
  // Redux hooks
  const {
    orders,
    pagination,
    statusCounts,
    isLoading,
    error,
    success,
    message,
    isEmpty,
    updateStatus,
    fetchByStatus,
    refreshOrders,
    clearMessages,
  } = useOrders();

  const {
    goToPage,
    changePageSize,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
  } = useOrderPagination();

  const { selectedIds, selectedCount, toggleOrder, selectAll, clearSelection } =
    useSelectedOrders();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(orderStatus || "");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showPrintReport, setShowPrintReport] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelNotes, setCancelNotes] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Order statuses for filter dropdown - Updated to reflect new workflow
  const orderStatuses = [
    { value: "", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

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

  // Helper function to safely get listing data
  const getSafeListingData = (item) => {
    if (!item) {
      return {
        title: "Product Not Available",
        brand: "Unknown Brand",
        images: [],
        category: { main: "Unknown", sub: "Unknown" },
        id: "N/A",
        averageRating: 0,
        review: null,
      };
    }

    return {
      title: item.title || "Product Not Available",
      brand: item.brand || "Unknown Brand",
      images: item.images || [],
      category: item.category || { main: "Unknown", sub: "Unknown" },
      id: item.id || "N/A",
      averageRating: item.averageRating || 0,
      review: item.review || null,
    };
  };

  // Helper function to get safe image URL
  const getSafeImageUrl = (item) => {
    const safeItem = getSafeListingData(item);
    return safeItem.images?.[0]?.url || "/placehold.png";
  };

  // Load orders based on active section and status
  useEffect(() => {
    const loadOrders = async () => {
      try {
        if (orderStatus) {
          await fetchByStatus(orderStatus);
        } else {
          await refreshOrders();
        }
      } catch (error) {
        console.error("Error loading orders:", error);
      }
    };

    loadOrders();
  }, [activeSection, orderStatus, fetchByStatus, refreshOrders]);

  // Auto-dismiss success and error messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [success, error, clearMessages]);

  // Handle status filter change
  const handleStatusFilterChange = async (status) => {
    setStatusFilter(status);
    try {
      if (status) {
        await fetchByStatus(status);
      } else {
        await refreshOrders();
      }
    } catch (error) {
      console.error("Error filtering orders:", error);
    }
  };

  // Helper function to format order number like user page
  const getOrderDisplayNumber = (order) => {
    return order.orderNumber || `#ORD-${order._id.slice(-6)}`;
  };

  // Frontend search by formatted order number and order ID
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;

    const query = searchQuery.toLowerCase();
    return orders.filter((order) => {
      const formattedOrderId = getOrderDisplayNumber(order).toLowerCase();
      const orderId = order._id.toLowerCase();

      return (
        formattedOrderId.includes(query) ||
        orderId.includes(query) ||
        // Also search in listings with safe access
        order.listings?.some((listing) => {
          const safeItem = getSafeListingData(listing);
          return (
            safeItem.title.toLowerCase().includes(query) ||
            safeItem.brand.toLowerCase().includes(query)
          );
        })
      );
    });
  }, [orders, searchQuery]);

  // Get section configuration - Updated to reflect new workflow
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
          "rating",
          "date",
          "actions",
        ],
      },
      pending: {
        title: "Pending Orders",
        description: "Orders awaiting shipment",
        showColumns: ["order", "buyer", "items", "total", "date", "actions"],
      },
      shipped: {
        title: "Shipped Orders",
        description: "Orders that have been shipped",
        showColumns: [
          "order",
          "buyer",
          "items",
          "total",
          "tracking",
          "date",
          "actions",
        ],
      },
      delivered: {
        title: "Delivered Orders",
        description: "Successfully delivered orders",
        showColumns: [
          "order",
          "buyer",
          "items",
          "total",
          "rating",
          "date",
          "actions",
        ],
      },
      cancelled: {
        title: "Cancelled Orders",
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
      case "confirmed":
        return <Package className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
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
        return "Pending";
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

  // Action handlers
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleCancelOrder = (order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
    setCancelReason("");
    setCancelNotes("");
  };

  const confirmCancellation = async () => {
    if (!cancelReason) {
      alert("Please select a cancellation reason");
      return;
    }

    try {
      setIsUpdatingStatus(true);
      await updateStatus(orderToCancel._id, "cancelled");
      setShowCancelModal(false);
      setOrderToCancel(null);
      setCancelReason("");
      setCancelNotes("");
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleStatusChange = async (order, newStatus) => {
    try {
      setIsUpdatingStatus(true);
      await updateStatus(order._id, newStatus);
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedCount === filteredOrders.length && filteredOrders.length > 0) {
      clearSelection();
    } else {
      selectAll(filteredOrders.map((order) => order._id));
    }
  };

  const handlePrintReport = () => {
    setShowPrintReport(true);
  };

  const renderRatingStars = (rating) => {
    if (!rating)
      return <span className="text-gray-400 text-sm">No rating</span>;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Error Messages */}
      {error && !isEmpty && (
        <Alert
          variant="danger"
          title="Error"
          onClose={() => clearMessages()}
          className="z-10 relative"
        >
          {error}
        </Alert>
      )}

      {/* Success Messages */}
      {success && (
        <Alert
          variant="success"
          title="Success"
          onClose={() => clearMessages()}
          className="z-10 relative"
        >
          {message}
        </Alert>
      )}

      {/* Header with Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-3">
                <Package className="h-6 w-6 text-blue-600" />
                {config.title}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">{config.description}</p>
            </div>

            <div className="flex items-center gap-3">
              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <LoadingSpinner size="sm" />
                  <span>Loading...</span>
                </div>
              )}
              <Button
                variant="secondary"
                icon={<Printer />}
                onClick={handlePrintReport}
                disabled={isLoading || filteredOrders.length === 0}
              >
                Print Report
              </Button>
              <Button
                variant="secondary"
                icon={<RefreshCw />}
                onClick={refreshOrders}
                disabled={isLoading}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mt-4">
            <div className="flex-1">
              <SearchInput
                placeholder="Search by order number (#ORD-xxx), product name, or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading}
                icon={<Search className="h-4 w-4" />}
              />
            </div>

            <div className="flex gap-3">
              {/* Only show status filter for all-orders */}
              {activeSection === "all-orders" && (
                <Select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  disabled={isLoading}
                >
                  {orderStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Select>
              )}

              <Button
                variant="secondary"
                icon={<RefreshCw />}
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("");
                  refreshOrders();
                }}
                disabled={isLoading}
                title="Reset all filters"
              >
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">
                {filteredOrders.length}{" "}
                {filteredOrders.length === 1 ? "Order" : "Orders"}
              </h3>
              {selectedCount > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {selectedCount} selected
                  </span>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Rows per page:</span>
                <Select
                  value={pagination.pageSize}
                  onChange={(e) => changePageSize(parseInt(e.target.value))}
                  className="w-20"
                  disabled={isLoading}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </Select>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>
                  {(pagination.currentPage - 1) * pagination.pageSize + 1}-
                  {Math.min(
                    pagination.currentPage * pagination.pageSize,
                    pagination.totalOrders
                  )}{" "}
                  of {pagination.totalOrders}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <IconButton
                  variant="ghost"
                  size="sm"
                  onClick={previousPage}
                  disabled={!hasPreviousPage || isLoading}
                  title="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </IconButton>
                <IconButton
                  variant="ghost"
                  size="sm"
                  onClick={nextPage}
                  disabled={!hasNextPage || isLoading}
                  title="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </IconButton>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="flex items-center gap-3 text-gray-600">
                <LoadingSpinner size="md" />
                <span className="text-sm font-medium">Loading orders...</span>
              </div>
            </div>
          )}

          {/* Show table only if we have orders */}
          {!isLoading && filteredOrders.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox
                      checked={
                        selectedCount === filteredOrders.length &&
                        filteredOrders.length > 0
                      }
                      onChange={handleSelectAll}
                    />
                  </TableHead>

                  {config.showColumns.includes("order") && (
                    <TableHead>Order ID</TableHead>
                  )}

                  {config.showColumns.includes("buyer") && (
                    <TableHead>Customer</TableHead>
                  )}

                  {config.showColumns.includes("items") && (
                    <TableHead>Items</TableHead>
                  )}

                  {config.showColumns.includes("total") && (
                    <TableHead>Total</TableHead>
                  )}

                  {config.showColumns.includes("status") && (
                    <TableHead>Status</TableHead>
                  )}

                  {config.showColumns.includes("rating") && (
                    <TableHead>Rating</TableHead>
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
                    <TableHead>Date</TableHead>
                  )}

                  {config.showColumns.includes("actions") && (
                    <TableHead>Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(order._id)}
                        onChange={() => toggleOrder(order._id)}
                      />
                    </TableCell>

                    {config.showColumns.includes("order") && (
                      <TableCell>
                        <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer font-mono">
                          {getOrderDisplayNumber(order)}
                        </div>
                      </TableCell>
                    )}

                    {config.showColumns.includes("buyer") && (
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar
                            size="sm"
                            fallback={getCustomerName(order).charAt(0)}
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {getCustomerName(order)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.shippingOption || "Standard Delivery"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    )}

                    {config.showColumns.includes("items") && (
                      <TableCell>
                        <div className="max-w-xs">
                          {order.listings && order.listings.length > 0 ? (
                            order.listings.map((item, index) => {
                              const safeItem = getSafeListingData(item);
                              return (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 mb-1"
                                >
                                  <div className="relative h-8 w-8 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                                    {safeItem.images.length > 0 ? (
                                      <img
                                        src={getSafeImageUrl(item)}
                                        alt={safeItem.title}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                          e.target.style.display = "none";
                                          e.target.nextSibling.style.display =
                                            "flex";
                                        }}
                                      />
                                    ) : null}
                                    <div
                                      className="absolute inset-0 flex items-center justify-center bg-gray-100"
                                      style={{
                                        display:
                                          safeItem.images.length > 0
                                            ? "none"
                                            : "flex",
                                      }}
                                    >
                                      <ImageOff className="h-4 w-4 text-gray-400" />
                                    </div>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-sm font-medium text-gray-900 truncate">
                                      {safeItem.title}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Brand: {safeItem.brand}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Package className="h-4 w-4" />
                              <span>No items available</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    )}

                    {config.showColumns.includes("total") && (
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900">
                          LKR {order.totalAmount.toLocaleString()}
                        </div>
                      </TableCell>
                    )}

                    {config.showColumns.includes("status") && (
                      <TableCell>
                        <Badge
                          variant={getStatusVariant(order.orderStatus)}
                          icon={getStatusIcon(order.orderStatus)}
                        >
                          {getStatusLabel(order.orderStatus)}
                        </Badge>
                      </TableCell>
                    )}

                    {config.showColumns.includes("rating") && (
                      <TableCell>
                        {renderRatingStars(order.orderRating)}
                      </TableCell>
                    )}

                    {config.showColumns.includes("shippingMethod") && (
                      <TableCell>
                        <div className="text-sm text-gray-900">
                          {order.shippingOption || "Standard Delivery"}
                        </div>
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
                      </TableCell>
                    )}

                    {config.showColumns.includes("date") && (
                      <TableCell>
                        <div className="text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
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

                          {/* Updated Status-specific actions for new workflow */}
                          {order.orderStatus === "pending" && (
                            <>
                              <IconButton
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(order, "shipped")
                                }
                                title="Mark as Shipped"
                                className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                                disabled={isUpdatingStatus}
                              >
                                <Truck className="h-4 w-4" />
                              </IconButton>
                              <IconButton
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCancelOrder(order)}
                                title="Cancel Order"
                                className="text-red-600 hover:text-red-900 hover:bg-red-50"
                                disabled={isUpdatingStatus}
                              >
                                <Ban className="h-4 w-4" />
                              </IconButton>
                            </>
                          )}

                          {order.orderStatus === "shipped" && (
                            <IconButton
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(order, "delivered")
                              }
                              title="Mark as Delivered"
                              className="text-green-600 hover:text-green-900 hover:bg-green-50"
                              disabled={isUpdatingStatus}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </IconButton>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Empty State */}
          {!isLoading && filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {isEmpty && message ? message : "No orders found"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery
                  ? `No orders match your search for "${searchQuery}".`
                  : statusFilter
                  ? `No orders found with status "${getStatusLabel(
                      statusFilter
                    )}".`
                  : `No ${config.title.toLowerCase()} available.`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Cancel Confirmation Modal */}
      <OrderCancelConfirmationDialog
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmCancellation}
        order={orderToCancel}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        cancelNotes={cancelNotes}
        setCancelNotes={setCancelNotes}
        cancelReasons={cancelReasons}
        isLoading={isUpdatingStatus}
      />

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => {
            setShowOrderDetails(false);
            setSelectedOrder(null);
          }}
          onOrderUpdate={handleStatusChange}
        />
      )}

      {/* Print Report Modal */}
      {showPrintReport && (
        <PrintOrderReport
          orders={filteredOrders}
          config={config}
          onClose={() => setShowPrintReport(false)}
        />
      )}
    </div>
  );
};

export default OrderManagement;
