/* eslint-disable no-unused-vars */
// services/sellerOrderService.js
import axiosInstance from "./axiosInstance";

const sellerOrderService = {
  // Get all orders for a seller with pagination
  getSellerOrders: async (sellerId, page = 1, pageSize = 10) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/order/seller-orders/${sellerId}`,
        {
          params: { page, size: pageSize },
        }
      );

      // Check if the response indicates no orders found
      if (
        response.data.message === "No orders found" ||
        response.data.orders?.length === 0
      ) {
        return {
          data: {
            orders: [],
            pagination: {
              totalOrders: 0,
              currentPage: page,
              pageSize: pageSize,
              totalPages: 0,
            },
            message: response.data.message || "No orders found",
            isEmpty: true,
          },
        };
      }

      return response;
    } catch (error) {
      // If it's a 404 or empty result, normalize the response
      if (
        error.response?.status === 404 ||
        error.response?.data?.message?.includes("No orders found")
      ) {
        return {
          data: {
            orders: [],
            pagination: {
              totalOrders: 0,
              currentPage: page,
              pageSize: pageSize,
              totalPages: 0,
            },
            message: error.response?.data?.message || "No orders found",
            isEmpty: true,
          },
        };
      }
      throw error;
    }
  },

  // Get orders filtered by status with pagination
  getOrdersByStatus: async (status, page = 1, pageSize = 10) => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/order/filter-order-status",
        {
          params: { status, page, size: pageSize },
        }
      );

      // Check if the response indicates no orders found
      if (
        response.data.message === "No orders found with the specified status" ||
        response.data.orders?.length === 0
      ) {
        return {
          data: {
            orders: [],
            pagination: {
              totalOrders: 0,
              currentPage: page,
              pageSize: pageSize,
              totalPages: 0,
            },
            message: response.data.message || "No orders found",
            isEmpty: true,
          },
        };
      }

      return response;
    } catch (error) {
      // If it's a 404 or empty result, normalize the response
      if (
        error.response?.status === 404 ||
        error.response?.data?.message?.includes("No orders found")
      ) {
        return {
          data: {
            orders: [],
            pagination: {
              totalOrders: 0,
              currentPage: page,
              pageSize: pageSize,
              totalPages: 0,
            },
            message: error.response?.data?.message || "No orders found",
            isEmpty: true,
          },
        };
      }
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    return await axiosInstance.put(
      `/api/v1/order/update-order-status/${orderId}`,
      {},
      { params: { status } }
    );
  },

  // Get order statistics for dashboard
  getOrderStatistics: async (sellerId) => {
    try {
      const [pending, shipped, delivered, cancelled, confirmed] =
        await Promise.all([
          axiosInstance.get("/api/v1/order/filter-order-status", {
            params: { status: "pending", page: 1, size: 1 },
          }),
          axiosInstance.get("/api/v1/order/filter-order-status", {
            params: { status: "shipped", page: 1, size: 1 },
          }),
          axiosInstance.get("/api/v1/order/filter-order-status", {
            params: { status: "delivered", page: 1, size: 1 },
          }),
          axiosInstance.get("/api/v1/order/filter-order-status", {
            params: { status: "cancelled", page: 1, size: 1 },
          }),
          axiosInstance.get("/api/v1/order/filter-order-status", {
            params: { status: "confirmed", page: 1, size: 1 },
          }),
          axiosInstance.get("/api/v1/order/filter-order-status", {
            params: { status: "confirmed", page: 1, size: 1 },
          }),
        ]);

      return {
        data: {
          pending: pending.data.pagination?.totalOrders || 0,
          shipped: shipped.data.pagination?.totalOrders || 0,
          delivered: delivered.data.pagination?.totalOrders || 0,
          cancelled: cancelled.data.pagination?.totalOrders || 0,
          
          confirmed:
            (confirmed.data.pagination?.totalOrders || 0)
        },
      };
    } catch (error) {
      console.error("Error fetching order statistics:", error);
      return {
        data: {
          pending: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
          confirmed: 0,
        },
      };
    }
  },

  // Search orders by customer name, order ID, or product name
  searchOrders: async (searchTerm, sellerId, page = 1, pageSize = 10) => {

    const response = await axiosInstance.get(
      `/api/v1/order/seller-orders/${sellerId}`,
      {
        params: { page: 1, size: 1000 }, 
      }
    );

    if (response.data.orders) {
      const filteredOrders = response.data.orders.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.shippingAddress
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.listings?.some(
            (listing) =>
              listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              listing.brand.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );

      // Manual pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

      return {
        data: {
          orders: paginatedOrders,
          pagination: {
            totalOrders: filteredOrders.length,
            currentPage: page,
            pageSize: pageSize,
            totalPages: Math.ceil(filteredOrders.length / pageSize),
          },
          isEmpty: filteredOrders.length === 0,
        },
      };
    }

    return {
      data: {
        orders: [],
        pagination: {
          totalOrders: 0,
          currentPage: page,
          pageSize: pageSize,
          totalPages: 0,
        },
        isEmpty: true,
      },
    };
  },

  // Bulk update order statuses
  bulkUpdateOrderStatus: async (orderIds, status) => {
    const promises = orderIds.map((orderId) =>
      axiosInstance.put(`/api/v1/order/update-order-status/${orderId}`, null, {
        params: { status },
      })
    );
    const responses = await Promise.all(promises);
    return responses.map((r) => r.data);
  },

  // Utility Functions

  // Format order data for display
  formatOrderData: (order) => {
    return {
      ...order,
      formattedDate: new Date(order.createdAt).toLocaleDateString(),
      formattedAmount: `LKR ${order.totalAmount.toFixed(2)}`,
      customerName: order.shippingAddress.split(",")[0] || "Unknown Customer",
      itemCount: order.listings?.length || 0,
      statusBadge: order.orderStatus,
      rating: order.orderRating || null,
      hasRating: order.orderRating && order.orderRating > 0,
    };
  },

  // Search orders by order number (frontend search)
  searchOrdersByNumber: (orders, orderNumber) => {
    if (!orderNumber.trim()) return orders;

    return orders.filter(
      (order) =>
        order._id.toLowerCase().includes(orderNumber.toLowerCase()) ||
        order.id?.toLowerCase().includes(orderNumber.toLowerCase())
    );
  },

  // Calculate order metrics
  calculateOrderMetrics: (orders) => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const averageOrderValue =
      orders.length > 0 ? totalRevenue / orders.length : 0;

    const statusBreakdown = orders.reduce((acc, order) => {
      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
      return acc;
    }, {});

    const recentOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return orderDate >= thirtyDaysAgo;
    }).length;

    return {
      totalOrders: orders.length,
      totalRevenue,
      averageOrderValue,
      statusBreakdown,
      recentOrders,
    };
  },

  // Validate order status transitions 
  isValidStatusTransition: (currentStatus, newStatus) => {
    const validTransitions = {
      // Correct seller workflow
      pending: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
      confirmed: [],
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  },

  // Get next possible statuses for an order 
  getNextPossibleStatuses: (currentStatus) => {
    const statusFlow = {
      // Correct seller workflow
      pending: [
        { value: "shipped", label: "Mark as Shipped", color: "blue" },
        { value: "cancelled", label: "Cancel Order", color: "red" },
      ],
      shipped: [
        { value: "delivered", label: "Mark as Delivered", color: "green" },
      ],
      delivered: [],
      cancelled: [],
      confirmed: [], 
    };

    return statusFlow[currentStatus] || [];
  },

  // Order filtering utilities
  filterOrdersByDateRange: (orders, startDate, endDate) => {
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });
  },

  filterOrdersByAmountRange: (orders, minAmount, maxAmount) => {
    return orders.filter(
      (order) =>
        order.totalAmount >= minAmount && order.totalAmount <= maxAmount
    );
  },

  // Status mapping utilities
  mapStatusToDisplayName: (status) => {
    const statusMap = {
      pending: "Pending Payment",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      // Legacy support
      confirmed: "Awaiting Shipment",
    };
    return statusMap[status] || status;
  },

  mapStatusToColor: (status) => {
    const colorMap = {
      pending: "yellow",
      shipped: "blue",
      delivered: "green",
      cancelled: "red",
      confirmed: "orange",
    };
    return colorMap[status] || "gray";
  },

  // Get seller workflow status priorities for sorting
  getStatusPriority: (status) => {
    const priorities = {
      pending: 1, 
      shipped: 2,
      delivered: 3, 
      cancelled: 4, 
      confirmed: 1.5, 
    };
    return priorities[status] || 999;
  },

  // Helper to check if order needs seller attention
  orderNeedsAttention: (order) => {
    const urgentStatuses = ["pending"]; 
    return urgentStatuses.includes(order.orderStatus);
  },

  // Helper to get available actions for seller
  getAvailableSellerActions: (orderStatus) => {
    const actions = {
      pending: [
        {
          action: "ship",
          label: "Mark as Shipped",
          icon: "truck",
          color: "blue",
        },
        { action: "cancel", label: "Cancel Order", icon: "ban", color: "red" },
      ],
      shipped: [
        {
          action: "deliver",
          label: "Mark as Delivered",
          icon: "check",
          color: "green",
        },
      ],
      delivered: [],
      cancelled: [],
      confirmed: [],
    };

    return actions[orderStatus] || [];
  },
};

export default sellerOrderService;
