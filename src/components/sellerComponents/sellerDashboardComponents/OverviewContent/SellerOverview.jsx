/* eslint-disable no-unused-vars */
// components/seller/SellerOverview.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Package,
  ShoppingCart,
  MessageSquare,
  PlusCircle,
  DollarSign,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  FileCheck,
  Settings,
} from "lucide-react";

// Import hooks from your Redux setup
import { useDashboardStats } from "../../../../hooks/useSellerListingData";
import { useOrderDashboardStats } from "../../../../hooks/useSellerOrderData";
import { useStore } from "../../../../hooks/useSellerListingData";

// Import UI components
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../ui/sellerUis/Uis";

const SellerOverview = ({ onNavigate }) => {
  const navigate = useNavigate();

  // Redux hooks for data
  const {
    statistics: listingStats,
    statusCounts: listingStatusCounts,
    metrics: listingMetrics,
    refreshStats: refreshListingStats,
  } = useDashboardStats();

  const {
    statistics: orderStats,
    statusCounts: orderStatusCounts,
    recentOrders,
    highValueOrders,
    ordersNeedingAttention,
    metrics: orderMetrics,
    refreshStats: refreshOrderStats,
  } = useOrderDashboardStats();

  const {
    stores,
    currentStore,
    hasStore,
    isLoading: storeLoading,
    error: storeError,
  } = useStore();

  // Local state for loading and refresh
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh all data on component mount
  useEffect(() => {
    const refreshAllData = async () => {
      setIsRefreshing(true);
      try {
        await Promise.all([refreshListingStats(), refreshOrderStats()]);
      } catch (error) {
        console.error("Error refreshing dashboard data:", error);
      } finally {
        setIsRefreshing(false);
      }
    };

    refreshAllData();
  }, [refreshListingStats, refreshOrderStats]);

  // Calculate derived metrics - FIXED: Only pending orders await shipment
  const awaitingShipmentCount = orderStatusCounts?.pending || 0;
  const confirmedOrdersCount = orderStatusCounts?.confirmed || 0;
  const shippedOrdersCount = orderStatusCounts?.shipped || 0;
  const deliveredOrdersCount = orderStatusCounts?.delivered || 0;
  const cancelledOrdersCount = orderStatusCounts?.cancelled || 0;

  const totalSales = orderMetrics?.monthRevenue || 0;
  const totalListings = listingStats?.totalListings || 0;
  const activeListings = listingStatusCounts?.active || 0;
  const outOfStockItems = listingStatusCounts?.outOfStock || 0;

  // FIXED: Filter to only show pending orders (awaiting shipment) in Tasks
  const pendingOrdersForTasks =
    recentOrders?.filter((order) => order.orderStatus === "pending") || [];

  // Debug: Log the order status counts to see what we're getting
  useEffect(() => {
    console.log("Order Status Counts:", orderStatusCounts);
    console.log("Order Stats:", orderStats);
    console.log("Order Metrics:", orderMetrics);
  }, [orderStatusCounts, orderStats, orderMetrics]);

  // Format currency
  const formatCurrency = (amount) => {
    return `LKR ${(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Get seller level based on performance
  const getSellerLevel = () => {
    const completedOrders = deliveredOrdersCount;
    const cancelledOrders = cancelledOrdersCount;

    const totalOrders = completedOrders + cancelledOrders;

    if (totalOrders === 0)
      return { level: "New Seller", color: "text-gray-600" };

    const successRate = (completedOrders / totalOrders) * 100;

    if (successRate >= 95)
      return { level: "Premium", color: "text-purple-600" };
    if (successRate >= 85)
      return { level: "Above Standard", color: "text-green-600" };
    if (successRate >= 70) return { level: "Standard", color: "text-blue-600" };
    return { level: "Below Standard", color: "text-orange-600" };
  };

  const sellerLevel = getSellerLevel();

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refreshListingStats(), refreshOrderStats()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (storeLoading && !stores?.length) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            {currentStore?.storeName
              ? `Welcome back to ${currentStore.storeName}`
              : "Welcome to your seller dashboard"}
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="secondary"
          size="sm"
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <ArrowRight className="h-4 w-4 mr-2" />
          )}
          Refresh Data
        </Button>
      </div>

      {/* 7-Card Metrics Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {/* Awaiting Shipment - Only pending orders */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="text-center">
              <div className="relative mb-1">
                <Package className="h-5 w-5 text-orange-600 mx-auto" />
                {awaitingShipmentCount > 0 && (
                  <Badge
                    variant="danger"
                    size="xs"
                    className="absolute -top-1 -right-1"
                  >
                    {awaitingShipmentCount}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-orange-600 mb-1">Awaiting delivery</p>
              <p className="text-lg font-bold text-orange-900">
                {awaitingShipmentCount}
              </p>
              <p className="text-xs text-orange-500">
                {awaitingShipmentCount > 0
                  ? "Action required"
                  : "All caught up"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sales (31 days) */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="text-center">
              <DollarSign className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-green-600 mb-1">Sales (31 days)</p>
              <p className="text-lg font-bold text-green-900">
                {formatCurrency(totalSales)}
              </p>
              <p className="text-xs text-green-500">
                {deliveredOrdersCount} orders completed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Seller Level */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="text-center">
              <TrendingUp className="h-5 w-5 text-purple-600 mx-auto mb-1" />
              <p className="text-xs text-purple-600 mb-1">Seller level</p>
              <p className={`text-sm font-semibold ${sellerLevel.color}`}>
                {sellerLevel.level}
              </p>
              <p className="text-xs text-purple-500">Based on performance</p>
            </div>
          </CardContent>
        </Card>

        {/* Total Listings */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="text-center">
              <Package className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-blue-600 mb-1">Total Listings</p>
              <p className="text-lg font-bold text-blue-900">{totalListings}</p>
            </div>
          </CardContent>
        </Card>

        {/* Active Listings */}
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="text-center">
              <CheckCircle className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-xs text-emerald-600 mb-1">Active Listings</p>
              <p className="text-lg font-bold text-emerald-900">
                {activeListings}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Out of Stock */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="text-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mx-auto mb-1" />
              <p className="text-xs text-red-600 mb-1">Out of Stock</p>
              <p className="text-lg font-bold text-red-900">
                {outOfStockItems}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Store Value */}
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="text-center">
              <DollarSign className="h-5 w-5 text-indigo-600 mx-auto mb-1" />
              <p className="text-xs text-indigo-600 mb-1">Store Value</p>
              <p className="text-sm font-bold text-indigo-900">
                {formatCurrency(listingMetrics?.totalInventoryValue || 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FIXED: Tasks - Only show pending orders that need shipment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Tasks
              <Badge variant="secondary" size="sm">
                {pendingOrdersForTasks.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingOrdersForTasks.length > 0 ? (
              <div className="space-y-3">
                {pendingOrdersForTasks.slice(0, 3).map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Order #{order._id.slice(-8)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatCurrency(order.totalAmount)} • Awaiting delivery
                      </p>
                    </div>
                   
                  </div>
                ))}
                {pendingOrdersForTasks.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{pendingOrdersForTasks.length - 3} more orders need
                    shipment
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-2" />
                <p className="text-gray-600">No tasks pending.</p>
                <p className="text-sm text-green-600">All caught up!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sales Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sales</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate && onNavigate("orders")}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600">Sales Trend</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(orderMetrics?.monthRevenue || 0)}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Today</span>
                <span className="font-medium">
                  {formatCurrency(orderMetrics?.todayRevenue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last 7 days</span>
                <span className="font-medium">
                  {formatCurrency(orderMetrics?.weekRevenue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last 31 days</span>
                <span className="font-medium">
                  {formatCurrency(orderMetrics?.monthRevenue || 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Overview - Shows all 5 status types */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Orders</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate && onNavigate("orders")}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Confirmed Orders */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Confirmed</span>
                </div>
                <Badge variant="primary">{confirmedOrdersCount}</Badge>
              </div>

              {/* Awaiting Shipment (Pending) */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-600">
                    Awaiting Delivery
                  </span>
                </div>
                <Badge
                  variant={awaitingShipmentCount > 0 ? "warning" : "secondary"}
                >
                  {awaitingShipmentCount}
                </Badge>
              </div>

              {/* Shipped */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Start Delivering</span>
                </div>
                <Badge variant="secondary">{shippedOrdersCount}</Badge>
              </div>

              {/* Delivered */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Delivered</span>
                </div>
                <Badge variant="success">{deliveredOrdersCount}</Badge>
              </div>

              {/* Cancelled */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-600">Cancelled</span>
                </div>
                <Badge variant="danger">{cancelledOrdersCount}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders?.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.slice(0, 5).map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Order #{order._id.slice(-8)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatCurrency(order.totalAmount)} •{" "}
                        {order.orderStatus}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <Badge
                        size="xs"
                        variant={
                          order.orderStatus === "delivered"
                            ? "success"
                            : order.orderStatus === "shipped"
                            ? "primary"
                            : order.orderStatus === "pending"
                            ? "warning"
                            : order.orderStatus === "confirmed"
                            ? "primary"
                            : "secondary"
                        }
                      >
                        {order.orderStatus}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600">No recent orders</p>
                <p className="text-sm text-gray-500">
                  Your orders will appear here
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-2 p-4 h-auto"
                onClick={() => navigate("/create-listing")}
              >
                <PlusCircle className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium">Create Listing</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-2 p-4 h-auto"
                onClick={() => onNavigate && onNavigate("listings")}
              >
                <Package className="h-6 w-6 text-purple-600" />
                <span className="text-sm font-medium">Manage Inventory</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-2 p-4 h-auto"
                onClick={() => onNavigate && onNavigate("orders")}
              >
                <ShoppingCart className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium">View Orders</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-2 p-4 h-auto"
                onClick={() => onNavigate && onNavigate("store")}
              >
                <Settings className="h-6 w-6 text-orange-600" />
                <span className="text-sm font-medium">Store Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Store Status Warning */}
      {!hasStore && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Complete your store setup
                </p>
                <p className="text-xs text-yellow-700">
                  Set up your store profile to start selling and accept orders.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => onNavigate && onNavigate("store")}
                className="ml-auto"
              >
                Setup Store
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SellerOverview;
