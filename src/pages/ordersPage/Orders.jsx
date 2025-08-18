/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  Download,
  Eye,
  RotateCcw,
  ArrowLeft,
  MapPin,
  Calendar,
  CreditCard,
  Star,
  MessageCircle,
  MoreHorizontal,
  RefreshCw,
  AlertCircle,
  Loader2,
  ShoppingBag,
  CheckSquare,
} from "lucide-react";
import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";
import Pagination from "../../components/ui/ContactUis/Pagination";
import OrderDetailsModal from "./OrderDetailsModal";
import ProductReviewModal from "./ProductReviewModal";
import { useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { useSelector } from "react-redux";
import {
  selectUser,
  selectIsAuthenticated,
} from "../../store/slices/authSlice";

const Orders = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectUser);

  // Redux user hook
  const {
    // Orders state
    orders,
    ordersLoading,
    ordersError,
    ordersPagination,

    // Actions
    fetchBuyerOrders,
    submitReview,
    clearErrors,

    // Helper functions
    getOrdersByStatus,
    getPendingReviewOrders,
    ordersSummary,
  } = useUser();

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Review modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewOrder, setReviewOrder] = useState(null);

  const itemsPerPage = 10;

  // Get user ID
  const userId = currentUser?._id || currentUser?.userId;
  const buyerId = userId;

  // Fetch orders on component mount
  useEffect(() => {
    if (isAuthenticated && buyerId) {
      console.log("Fetching orders for buyerId:", buyerId);
      fetchBuyerOrders(buyerId, currentPage, itemsPerPage);
    }
  }, [isAuthenticated, buyerId, currentPage, fetchBuyerOrders]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  // Debug: Log orders data
  useEffect(() => {
    console.log("Orders data:", orders);
    console.log("Orders loading:", ordersLoading);
    console.log("Orders error:", ordersError);
  }, [orders, ordersLoading, ordersError]);

  // Updated status options to match backend enum
  const statusOptions = [
    { value: "all", label: "All Orders" },
    {
      value: "pending",
      label: "Pending",
    },
    {
      value: "confirmed",
      label: "Confirmed",
    },
    {
      value: "shipped",
      label: "Shipped",
    },
    {
      value: "delivered",
      label: "Delivered",
    },
    {
      value: "cancelled",
      label: "Cancelled",
    },
  ];

  // Filter orders based on status and search
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === "all" || order.orderStatus === selectedStatus;

    const orderNumber = order.orderNumber || `#ORD-${order._id.slice(-6)}`;
    const matchesSearch =
      !searchQuery ||
      orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.listings &&
        order.listings.some((listing) =>
          listing.title?.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    return matchesStatus && matchesSearch;
  });

  // Pagination calculations
  const totalPages =
    ordersPagination?.totalPages ||
    Math.ceil(filteredOrders.length / itemsPerPage);
  const totalItems = ordersPagination?.totalItems || filteredOrders.length;

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (buyerId) {
      fetchBuyerOrders(buyerId, page, itemsPerPage);
    }
  };

  // Reset pagination when filters change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredOrders.length, currentPage, totalPages]);

  // Updated status badge function
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset to first page on filter
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleReorder = (order) => {
    console.log("Reordering:", order);
    navigate("/shopping-cart");
  };

  // Review handling functions
  const handleReviewProduct = (order, product) => {
    setReviewOrder(order);
    setSelectedProduct(product);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedProduct(null);
    setReviewOrder(null);
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      const payload = {
        buyerId: buyerId,
        shopId: reviewOrder.storeIds[0], // Assuming first store
        listingId: selectedProduct._id,
        orderId: reviewOrder._id,
        review: reviewData.reviewText,
        shoppingExperience: reviewData.shoppingExperience,
        customerService: reviewData.customerService,
        productQuality: reviewData.productQuality,
        deliverySpeed: reviewData.deliverySpeed,
      };

      await submitReview(payload).unwrap();

      // Refresh orders to update review status
      if (buyerId) {
        fetchBuyerOrders(buyerId, currentPage, itemsPerPage);
      }

      handleCloseReviewModal();
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get product image from listing
  const getProductImage = (listing) => {
    console.log("Getting image for listing:", listing);

    // Handle if listing has images array directly
    if (listing?.images?.length) {
      const primaryImage = listing.images.find((img) => img.isPrimary);
      return primaryImage?.url || listing.images[0]?.url || "/placehold.png";
    }

    // Handle if listing has variations with images
    if (listing?.variations?.length) {
      const defaultVariation =
        listing.variations.find((v) => v.isDefault) || listing.variations[0];
      if (defaultVariation?.images?.length) {
        return defaultVariation.images[0]?.url || "/placehold.png";
      }
    }

    return "/placehold.png";
  };

  // Get product price from listing
  const getProductPrice = (listing) => {
    console.log("Getting price for listing:", listing);

    if (!listing?.variations?.length) return 0;
    const defaultVariation =
      listing.variations.find((v) => v.isDefault) || listing.variations[0];
    return parseFloat(defaultVariation?.price || 0);
  };

  // Format shipping address to handle string response from API
  const formatShippingAddress = (shippingAddress) => {
    if (!shippingAddress) return "No shipping address";

    // If shippingAddress is a string (as from your API), return it directly
    if (typeof shippingAddress === "string") {
      return shippingAddress;
    }

    // Handle if shippingAddress is an object (legacy support)
    if (typeof shippingAddress === "object") {
      const addr = shippingAddress;
      return `${addr.streetAddress || ""}, ${addr.city || ""}, ${
        addr.state || ""
      } ${addr.zipCode || ""}`.replace(/^,\s*|,\s*$/g, ""); // Clean up leading/trailing commas
    }

    return "Shipping address provided";
  };

  // Transform order data for display
  const getOrderDisplayData = (order) => {
    console.log("Processing order for display:", order);

    return {
      id: order._id,
      orderNumber: order.orderNumber || `#ORD-${order._id.slice(-6)}`,
      date: order.createdAt || order.orderDate,
      status: order.orderStatus,
      total: order.totalAmount || 0,
      items: order.listings || order.listingIds || [], // Use listings if available, fallback to listingIds
      stores: order.stores || [],
      shippingAddress: formatShippingAddress(order.shippingAddress), 
      trackingNumber: order.trackingNumber || null,
      estimatedDelivery: order.estimatedDelivery,
      actualDelivery: order.actualDelivery,
      cancelReason: order.cancelReason,
      isReviewed: order.isReviewed,
    };
  };

  // Get store name for an order
  const getStoreName = (order) => {
    if (order.stores && order.stores.length > 0) {
      return order.stores[0].basicInformation?.storeName || "Unknown Store";
    }
    return "Unknown Store";
  };

  // Loading state
  if (ordersLoading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (ordersError && !ordersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <Card className="text-center p-8 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Orders
          </h3>
          <p className="text-gray-600 mb-4">{ordersError}</p>
          <Button
            onClick={() =>
              buyerId && fetchBuyerOrders(buyerId, currentPage, itemsPerPage)
            }
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <Card className="text-center p-8 max-w-md mx-auto">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Please Log In
          </h3>
          <p className="text-gray-600 mb-4">
            You need to be logged in to view your orders.
          </p>
          <Button onClick={() => navigate("/")}>Go to Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigate(-1)}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2" />
                  My Orders
                  {ordersLoading && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600 ml-2" />
                  )}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <Button
                key={status.value}
                variant={
                  selectedStatus === status.value ? "primary" : "outline"
                }
                size="sm"
                onClick={() => handleStatusFilter(status.value)}
                className="flex items-center space-x-2"
              >
                <span>{status.label}</span>
                <Badge
                  variant={
                    selectedStatus === status.value ? "secondary" : "default"
                  }
                  size="sm"
                  className="ml-1"
                >
                  {status.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order number or product name..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                No orders found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedStatus !== "all"
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "You haven't placed any orders yet. Start shopping to see your orders here!"}
              </p>
              <Button
                onClick={() => navigate("/shop-collections")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Start Shopping
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const orderData = getOrderDisplayData(order);

              return (
                <Card
                  key={orderData.id}
                  className="p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="space-y-4">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {orderData.orderNumber}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(orderData.date)}
                            </span>
                            <span className="flex items-center">
                              <CreditCard className="h-4 w-4 mr-1" />
                              <span className="mr-1">LKR</span>
                              {orderData.total.toFixed(2)}
                            </span>
                            <span className="flex items-center">
                              <ShoppingBag className="h-4 w-4 mr-1" />
                              {getStoreName(order)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(orderData.status)}
                        <Button variant="ghost" size="sm" className="p-2">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      {orderData.items.map((item, index) => (
                        <div
                          key={item._id || index}
                          className="flex space-x-4 p-3 bg-gray-50 rounded-lg"
                        >
                          <img
                            src={getProductImage(item)}
                            alt={item.title || "Product"}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = "/placehold.png";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {item.title || "Unknown Product"}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {item.brand || item.brandName || "Unknown Brand"}
                            </p>
                            <div className="flex items-center mt-1 space-x-4">
                              <span className="text-sm text-gray-600">
                                Qty: 1
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                <span className="mr-1">LKR</span>
                                {getProductPrice(item).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Individual Product Review Button */}
                          {orderData.status === "delivered" &&
                            !orderData.isReviewed && (
                              <div className="flex items-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleReviewProduct(order, item)
                                  }
                                  className="flex items-center text-yellow-600 hover:text-yellow-700 border-yellow-300 hover:border-yellow-400 hover:bg-yellow-50"
                                >
                                  <Star className="h-3 w-3 mr-1" />
                                  Review
                                </Button>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>

                    {/* Shipping Info - Now properly displays string addresses */}
                    {orderData.shippingAddress &&
                      orderData.shippingAddress !== "No shipping address" && (
                        <div className="flex items-start space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                          <MapPin className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                          <div className="flex-1">
                            <span className="font-medium text-blue-900">
                              Shipping to:
                            </span>
                            <p className="mt-1 text-gray-700">
                              {orderData.shippingAddress}
                            </p>
                          </div>
                        </div>
                      )}

                    {/* Cancelled Info */}
                    {orderData.status === "cancelled" &&
                      orderData.cancelReason && (
                        <div className="bg-red-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2 text-sm text-red-800">
                            <AlertCircle className="h-4 w-4" />
                            <span>
                              <span className="font-medium">Cancelled:</span>{" "}
                              {orderData.cancelReason}
                            </span>
                          </div>
                        </div>
                      )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                        className="flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>

                      {orderData.status === "delivered" && (
                        <>
                      
                          {/* Show review status */}
                          {orderData.isReviewed ? (
                            <Badge
                              variant="success"
                              className="flex items-center px-3 py-1"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Reviewed
                            </Badge>
                          ) : (
                            <Badge
                              variant="warning"
                              className="flex items-center px-3 py-1"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Pending Review
                            </Badge>
                          )}
                        </>
                      )}

                      {orderData.status === "cancelled" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReorder(order)}
                          className="flex items-center"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Order Again
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
      />

      {/* Product Review Modal */}
      <ProductReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        product={selectedProduct}
        order={reviewOrder}
        onSubmitReview={handleSubmitReview}
      />
    </div>
  );
};

export default Orders;
