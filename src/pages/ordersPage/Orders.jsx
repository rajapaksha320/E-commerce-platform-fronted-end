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
} from "lucide-react";
import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";
import Pagination from "../../components/ui/ContactUis/Pagination";
import OrderDetailsModal from "./OrderDetailsModal";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 5;

  // Mock orders data
  const [orders] = useState([
    {
      id: "ORD-001",
      orderNumber: "#ORD-2024-001",
      date: "2024-01-15",
      status: "delivered",
      total: 359.98,
      items: [
        {
          id: 1,
          name: "Wireless Bluetooth Headphones Pro Max",
          brand: "TechAudio",
          price: 179.99,
          quantity: 2,
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        },
      ],
      shippingAddress: "123 Main St, New York, NY 10001",
      trackingNumber: "TRK123456789",
      estimatedDelivery: "2024-01-18",
      actualDelivery: "2024-01-17",
    },
    {
      id: "ORD-002",
      orderNumber: "#ORD-2024-002",
      date: "2024-01-20",
      status: "shipped",
      total: 299.99,
      items: [
        {
          id: 2,
          name: "Premium Leather Handbag",
          brand: "LuxeFashion",
          price: 299.99,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
        },
      ],
      shippingAddress: "456 Oak Ave, Brooklyn, NY 11201",
      trackingNumber: "TRK987654321",
      estimatedDelivery: "2024-01-25",
    },
    {
      id: "ORD-003",
      orderNumber: "#ORD-2024-003",
      date: "2024-01-22",
      status: "processing",
      total: 199.99,
      items: [
        {
          id: 3,
          name: "Smart Fitness Watch",
          brand: "FitTech",
          price: 199.99,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
        },
      ],
      shippingAddress: "789 Pine St, Queens, NY 11375",
      estimatedDelivery: "2024-01-28",
    },
    {
      id: "ORD-004",
      orderNumber: "#ORD-2024-004",
      date: "2024-01-10",
      status: "cancelled",
      total: 149.99,
      items: [
        {
          id: 4,
          name: "Gaming Mechanical Keyboard",
          brand: "GamePro",
          price: 149.99,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
        },
      ],
      shippingAddress: "321 Elm St, Manhattan, NY 10003",
      cancelReason: "Customer request",
    },
    {
      id: "ORD-005",
      orderNumber: "#ORD-2024-005",
      date: "2024-01-25",
      status: "delivered",
      total: 74.97,
      items: [
        {
          id: 5,
          name: "Organic Coffee Beans",
          brand: "BrewMaster",
          price: 24.99,
          quantity: 3,
          image:
            "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
        },
      ],
      shippingAddress: "654 Maple Dr, Staten Island, NY 10301",
      trackingNumber: "TRK456789123",
      estimatedDelivery: "2024-01-28",
      actualDelivery: "2024-01-27",
    },
    {
      id: "ORD-006",
      orderNumber: "#ORD-2024-006",
      date: "2024-01-28",
      status: "shipped",
      total: 899.99,
      items: [
        {
          id: 6,
          name: "Professional Camera",
          brand: "PhotoPro",
          price: 899.99,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop",
        },
      ],
      shippingAddress: "987 Cedar Ln, Bronx, NY 10461",
      trackingNumber: "TRK789123456",
      estimatedDelivery: "2024-02-02",
    },
  ]);

  const statusOptions = [
    { value: "all", label: "All Orders", count: orders.length },
    {
      value: "processing",
      label: "Processing",
      count: orders.filter((o) => o.status === "processing").length,
    },
    {
      value: "shipped",
      label: "Shipped",
      count: orders.filter((o) => o.status === "shipped").length,
    },
    {
      value: "delivered",
      label: "Delivered",
      count: orders.filter((o) => o.status === "delivered").length,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      count: orders.filter((o) => o.status === "cancelled").length,
    },
  ];

  // Filter orders based on status and search
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    const matchesSearch =
      !searchQuery ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesStatus && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset pagination when filters change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredOrders.length, currentPage, totalPages]);

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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset to first page on filter
  };

  const handleTrackOrder = (order) => {
    // Navigate to order tracking page with tracking number in URL
    if (order.trackingNumber) {
      navigate(
        `/track-parcel?number=${encodeURIComponent(order.trackingNumber)}`
      );
    } else {
      navigate("/track-parcel");
    }
  };

  const handleViewOrder = (order) => {
    // Open modal with order details
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleReorder = (order) => {
    // Add items to cart and navigate to cart
    console.log("Reordering:", order);
    navigate("/shopping-cart");
  };

  const handleReturnOrder = (order) => {
    // Navigate to return page
    navigate(`/returns/${order.id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  {filteredOrders.length}{" "}
                  {filteredOrders.length === 1 ? "order" : "orders"} found
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLoading(true)}
                className="hidden sm:flex"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
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
            <Button
              variant="outline"
              size="md"
              className="flex items-center space-x-2 sm:w-auto"
            >
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </div>

        {/* Orders List */}
        {paginatedOrders.length === 0 ? (
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
                onClick={() => navigate("/shop-collection")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Start Shopping
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {paginatedOrders.map((order) => (
              <Card
                key={order.id}
                className="p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="space-y-4">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.orderNumber}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(order.date)}
                          </span>
                          <span className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-1" />$
                            {order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(order.status)}
                      <Button variant="ghost" size="sm" className="p-2">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex space-x-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-600">{item.brand}</p>
                          <div className="flex items-center mt-1 space-x-4">
                            <span className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Info */}
                  {order.shippingAddress && (
                    <div className="flex items-start space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <MapPin className="h-4 w-4 mt-0.5 text-blue-600" />
                      <div>
                        <span className="font-medium text-blue-900">
                          Shipping to:
                        </span>
                        <p>{order.shippingAddress}</p>
                      </div>
                    </div>
                  )}

                  {/* Tracking Info */}
                  {order.trackingNumber && (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm">
                        <Truck className="h-4 w-4 text-green-600" />
                        <span className="text-green-800">
                          <span className="font-medium">Tracking:</span>{" "}
                          {order.trackingNumber}
                        </span>
                      </div>
                      {order.estimatedDelivery && (
                        <span className="text-sm text-green-700">
                          Est. delivery: {formatDate(order.estimatedDelivery)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Delivered Info */}
                  {order.status === "delivered" && order.actualDelivery && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span>
                          <span className="font-medium">Delivered on:</span>{" "}
                          {formatDate(order.actualDelivery)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Cancelled Info */}
                  {order.status === "cancelled" && order.cancelReason && (
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm text-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <span>
                          <span className="font-medium">Cancelled:</span>{" "}
                          {order.cancelReason}
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

                    {order.trackingNumber && order.status !== "delivered" && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleTrackOrder(order)}
                        className="flex items-center"
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Track Order
                      </Button>
                    )}

                    {order.status === "delivered" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReorder(order)}
                          className="flex items-center"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reorder
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReturnOrder(order)}
                          className="flex items-center"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Return
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </>
                    )}

                    {order.status === "cancelled" && (
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

                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center text-gray-600 hover:text-gray-700"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Support
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredOrders.length}
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
    </div>
  );
};

export default Orders;
