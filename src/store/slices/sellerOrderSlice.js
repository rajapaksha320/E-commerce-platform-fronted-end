// store/slices/sellerOrderSlice.js
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import sellerOrderService from "../../services/sellerOrderService";

// Order status constants
const ORDER_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

// Normalized state structure for performance
const initialState = {
  // Orders state
  orders: {
    byId: {},
    allIds: [],
    pagination: {
      totalOrders: 0,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
    },
    filters: {
      status: null,
      dateRange: null,
      amountRange: null,
      search: null,
    },
    statusCounts: {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    },
  },

  // UI state
  ui: {
    ordersLoading: false,
    orderDetailsLoading: false,
    updateOrderLoading: false,
    bulkUpdateLoading: false,
    error: null,
    success: false,
    message: "",
    selectedOrderId: null,
    isEmpty: false,
  },

  // Cache management
  cache: {
    ordersLastFetch: null,
    ttl: 5 * 60 * 1000, // 5 minutes
  },
};

// Helper function to normalize orders
const normalizeOrders = (orders) => {
  const byId = {};
  const allIds = [];

  orders.forEach((order) => {
    byId[order._id] = order;
    allIds.push(order._id);
  });

  return { byId, allIds };
};

// Async Thunks

// Fetch all orders for seller
export const fetchSellerOrders = createAsyncThunk(
  "sellerOrder/fetchSellerOrders",
  async (
    { sellerId, page = 1, pageSize = 10, useCache = true } = {},
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState();
      const { cache } = state.sellerOrder;

      // Cache check
      if (useCache && cache.ordersLastFetch) {
        const timeSinceLastFetch = Date.now() - cache.ordersLastFetch;
        if (timeSinceLastFetch < cache.ttl) {
          return { cached: true };
        }
      }

      const response = await sellerOrderService.getSellerOrders(
        sellerId,
        page,
        pageSize
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// Fetch orders by status
export const fetchOrdersByStatus = createAsyncThunk(
  "sellerOrder/fetchOrdersByStatus",
  async ({ status, page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await sellerOrderService.getOrdersByStatus(
        status,
        page,
        pageSize
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders by status"
      );
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  "sellerOrder/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await sellerOrderService.updateOrderStatus(
        orderId,
        status
      );
      return { ...response.data, orderId, newStatus: status };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  }
);

// Search orders
export const searchOrders = createAsyncThunk(
  "sellerOrder/searchOrders",
  async (
    { searchTerm, sellerId, additionalFilters = {} },
    { rejectWithValue }
  ) => {
    try {
      const filters = {
        search: searchTerm,
        ...additionalFilters,
        page: 1,
        pageSize: 10,
      };

      const response = await sellerOrderService.searchOrders(
        searchTerm,
        sellerId,
        filters.page,
        filters.pageSize
      );
      return { ...response.data, filters };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search orders"
      );
    }
  }
);

// Bulk update order statuses
export const bulkUpdateOrderStatus = createAsyncThunk(
  "sellerOrder/bulkUpdateOrderStatus",
  async ({ orderIds, status }, { rejectWithValue }) => {
    try {
      const responses = await sellerOrderService.bulkUpdateOrderStatus(
        orderIds,
        status
      );
      return responses;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to bulk update orders"
      );
    }
  }
);

// Get order statistics
export const fetchOrderStatistics = createAsyncThunk(
  "sellerOrder/fetchOrderStatistics",
  async (sellerId, { rejectWithValue }) => {
    try {
      const response = await sellerOrderService.getOrderStatistics(sellerId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order statistics"
      );
    }
  }
);

// Seller Order Slice
const sellerOrderSlice = createSlice({
  name: "sellerOrder",
  initialState,
  reducers: {
    // UI Actions
    clearError: (state) => {
      state.ui.error = null;
    },
    clearSuccess: (state) => {
      state.ui.success = false;
      state.ui.message = "";
    },
    clearMessages: (state) => {
      state.ui.error = null;
      state.ui.success = false;
      state.ui.message = "";
    },
    setSelectedOrder: (state, action) => {
      state.ui.selectedOrderId = action.payload;
    },
    setFilters: (state, action) => {
      state.orders.filters = {
        ...state.orders.filters,
        ...action.payload,
      };
    },
    clearFilters: (state) => {
      state.orders.filters = {
        status: null,
        dateRange: null,
        amountRange: null,
        search: null,
      };
    },

    // Optimistic Updates
    optimisticUpdateOrder: (state, action) => {
      const { orderId, updates } = action.payload;
      if (state.orders.byId[orderId]) {
        state.orders.byId[orderId] = {
          ...state.orders.byId[orderId],
          ...updates,
        };
      }
    },

    // Cache Management
    invalidateCache: (state) => {
      state.cache.ordersLastFetch = null;
    },

    // Pagination
    setPagination: (state, action) => {
      state.orders.pagination = {
        ...state.orders.pagination,
        ...action.payload,
      };
    },
  },

  extraReducers: (builder) => {
    // Fetch Seller Orders
    builder
      .addCase(fetchSellerOrders.pending, (state) => {
        state.ui.ordersLoading = true;
        state.ui.error = null;
        state.ui.isEmpty = false;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.ui.ordersLoading = false;

        if (!action.payload.cached) {
          if (action.payload.isEmpty) {
            // Handle empty results case
            state.orders.byId = {};
            state.orders.allIds = [];
            state.orders.pagination = action.payload.pagination || {
              totalOrders: 0,
              currentPage: 1,
              pageSize: 10,
              totalPages: 0,
            };
            state.ui.isEmpty = true;
            state.ui.message = action.payload.message || "No orders found";
          } else {
            // Handle normal results
            const normalized = normalizeOrders(action.payload.orders || []);
            state.orders.byId = normalized.byId;
            state.orders.allIds = normalized.allIds;
            state.orders.pagination = action.payload.pagination;
            state.cache.ordersLastFetch = Date.now();
            state.ui.isEmpty = false;

            // Calculate status counts
            const statusCounts = {
              pending: 0,
              confirmed: 0,
              shipped: 0,
              delivered: 0,
              cancelled: 0,
            };
            (action.payload.orders || []).forEach((order) => {
              if (
                order.orderStatus &&
                statusCounts[order.orderStatus] !== undefined
              ) {
                statusCounts[order.orderStatus]++;
              }
            });
            state.orders.statusCounts = statusCounts;
          }
        }
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.ui.ordersLoading = false;
        state.ui.error = action.payload;
        state.ui.isEmpty = false;
      });

    // Fetch Orders By Status
    builder
      .addCase(fetchOrdersByStatus.pending, (state) => {
        state.ui.ordersLoading = true;
        state.ui.error = null;
        state.ui.success = false;
        state.ui.isEmpty = false;
      })
      .addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
        state.ui.ordersLoading = false;

        // Always clear existing data when fetching by status
        state.orders.byId = {};
        state.orders.allIds = [];

        if (action.payload.isEmpty) {
          // Handle empty results
          state.ui.isEmpty = true;
          state.ui.message =
            action.payload.message || "No orders found for this status";
          state.ui.error = null;
          state.orders.pagination = action.payload.pagination || {
            totalOrders: 0,
            currentPage: 1,
            pageSize: 10,
            totalPages: 0,
          };
        } else {
          // Handle normal results
          const normalized = normalizeOrders(action.payload.orders || []);
          state.orders.byId = normalized.byId;
          state.orders.allIds = normalized.allIds;
          state.orders.pagination = action.payload.pagination;
          state.ui.isEmpty = false;
          state.ui.message = "";
        }
      })
      .addCase(fetchOrdersByStatus.rejected, (state, action) => {
        state.ui.ordersLoading = false;
        state.ui.error = action.payload;
        state.ui.isEmpty = false;

        // Clear orders on error to show empty state
        state.orders.byId = {};
        state.orders.allIds = [];
        state.orders.pagination = {
          totalOrders: 0,
          currentPage: 1,
          pageSize: 10,
          totalPages: 0,
        };
      });

    // Update Order Status
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.ui.updateOrderLoading = true;
        state.ui.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.ui.updateOrderLoading = false;
        state.ui.success = true;
        state.ui.message =
          action.payload.message || "Order status updated successfully";

        const { orderId, newStatus } = action.payload;
        const order = action.payload.order;

        if (order && order._id) {
          const oldStatus = state.orders.byId[orderId]?.orderStatus;
          state.orders.byId[orderId] = order;

          // Update status counts
          if (oldStatus !== newStatus) {
            if (
              oldStatus &&
              state.orders.statusCounts[oldStatus] !== undefined
            ) {
              state.orders.statusCounts[oldStatus] -= 1;
            }
            if (
              newStatus &&
              state.orders.statusCounts[newStatus] !== undefined
            ) {
              state.orders.statusCounts[newStatus] += 1;
            }
          }
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.ui.updateOrderLoading = false;
        state.ui.error = action.payload;
      });

    // Search Orders
    builder
      .addCase(searchOrders.pending, (state) => {
        state.ui.ordersLoading = true;
        state.ui.error = null;
        state.ui.success = false;
        state.ui.isEmpty = false;
      })
      .addCase(searchOrders.fulfilled, (state, action) => {
        state.ui.ordersLoading = false;

        // Always clear existing data when searching
        state.orders.byId = {};
        state.orders.allIds = [];

        if (action.payload.isEmpty) {
          state.ui.isEmpty = true;
          state.ui.message =
            action.payload.message || "No orders found for your search";
          state.ui.error = null;
          state.orders.pagination = action.payload.pagination || {
            totalOrders: 0,
            currentPage: 1,
            pageSize: 10,
            totalPages: 0,
          };
        } else {
          // Handle normal results
          const normalized = normalizeOrders(action.payload.orders || []);
          state.orders.byId = normalized.byId;
          state.orders.allIds = normalized.allIds;
          state.orders.pagination = action.payload.pagination;
          state.ui.isEmpty = false;
          state.ui.message = "";
        }

        // Store the search filters
        state.orders.filters = {
          ...state.orders.filters,
          search: action.meta.arg.searchTerm,
        };
      })
      .addCase(searchOrders.rejected, (state, action) => {
        state.ui.ordersLoading = false;
        state.ui.error = action.payload;
        state.ui.isEmpty = false;

        // Clear orders on error to show empty state
        state.orders.byId = {};
        state.orders.allIds = [];
        state.orders.pagination = {
          totalOrders: 0,
          currentPage: 1,
          pageSize: 10,
          totalPages: 0,
        };
      });

    // Bulk Update Order Status
    builder
      .addCase(bulkUpdateOrderStatus.pending, (state) => {
        state.ui.bulkUpdateLoading = true;
        state.ui.error = null;
      })
      .addCase(bulkUpdateOrderStatus.fulfilled, (state, action) => {
        state.ui.bulkUpdateLoading = false;
        state.ui.success = true;
        state.ui.message = "Orders updated successfully";

        action.payload.forEach((response) => {
          const order = response.order;
          if (order && order._id) {
            state.orders.byId[order._id] = order;
          }
        });
      })
      .addCase(bulkUpdateOrderStatus.rejected, (state, action) => {
        state.ui.bulkUpdateLoading = false;
        state.ui.error = action.payload;
      });

    // Fetch Order Statistics
    builder
      .addCase(fetchOrderStatistics.pending, (state) => {
        state.ui.ordersLoading = true;
        state.ui.error = null;
      })
      .addCase(fetchOrderStatistics.fulfilled, (state, action) => {
        state.ui.ordersLoading = false;
        state.orders.statusCounts = action.payload;
      })
      .addCase(fetchOrderStatistics.rejected, (state, action) => {
        state.ui.ordersLoading = false;
        state.ui.error = action.payload;
      });
  },
});

// Actions
export const {
  clearError,
  clearSuccess,
  clearMessages,
  setSelectedOrder,
  setFilters,
  clearFilters,
  optimisticUpdateOrder,
  invalidateCache,
  setPagination,
} = sellerOrderSlice.actions;

// Selectors
export const selectSellerOrderState = (state) => state.sellerOrder;

// Memoized selectors for performance
export const selectAllOrders = createSelector(
  [selectSellerOrderState],
  (sellerOrder) =>
    sellerOrder.orders.allIds.map((id) => sellerOrder.orders.byId[id])
);

export const selectOrderById = (orderId) =>
  createSelector(
    [selectSellerOrderState],
    (sellerOrder) => sellerOrder.orders.byId[orderId]
  );

export const selectOrdersByStatus = (status) =>
  createSelector([selectSellerOrderState], (sellerOrder) => {
    return sellerOrder.orders.allIds
      .map((id) => sellerOrder.orders.byId[id])
      .filter((order) => order.orderStatus === status);
  });

export const selectPendingOrders = createSelector(
  [selectSellerOrderState],
  (sellerOrder) => {
    return sellerOrder.orders.allIds
      .map((id) => sellerOrder.orders.byId[id])
      .filter((order) => order.orderStatus === ORDER_STATUSES.PENDING);
  }
);

export const selectConfirmedOrders = createSelector(
  [selectSellerOrderState],
  (sellerOrder) => {
    return sellerOrder.orders.allIds
      .map((id) => sellerOrder.orders.byId[id])
      .filter((order) => order.orderStatus === ORDER_STATUSES.CONFIRMED);
  }
);

export const selectShippedOrders = createSelector(
  [selectSellerOrderState],
  (sellerOrder) => {
    return sellerOrder.orders.allIds
      .map((id) => sellerOrder.orders.byId[id])
      .filter((order) => order.orderStatus === ORDER_STATUSES.SHIPPED);
  }
);

export const selectDeliveredOrders = createSelector(
  [selectSellerOrderState],
  (sellerOrder) => {
    return sellerOrder.orders.allIds
      .map((id) => sellerOrder.orders.byId[id])
      .filter((order) => order.orderStatus === ORDER_STATUSES.DELIVERED);
  }
);

export const selectCancelledOrders = createSelector(
  [selectSellerOrderState],
  (sellerOrder) => {
    return sellerOrder.orders.allIds
      .map((id) => sellerOrder.orders.byId[id])
      .filter((order) => order.orderStatus === ORDER_STATUSES.CANCELLED);
  }
);

export const selectOrdersPagination = (state) =>
  state.sellerOrder.orders.pagination;
export const selectOrdersFilters = (state) => state.sellerOrder.orders.filters;
export const selectOrderStatusCounts = (state) =>
  state.sellerOrder.orders.statusCounts;

export const selectOrderUIState = (state) => state.sellerOrder.ui;
export const selectIsOrdersLoading = (state) =>
  state.sellerOrder.ui.ordersLoading;
export const selectIsUpdateOrderLoading = (state) =>
  state.sellerOrder.ui.updateOrderLoading;
export const selectIsBulkUpdateLoading = (state) =>
  state.sellerOrder.ui.bulkUpdateLoading;
export const selectOrderError = (state) => state.sellerOrder.ui.error;
export const selectOrderSuccess = (state) => state.sellerOrder.ui.success;
export const selectOrderMessage = (state) => state.sellerOrder.ui.message;
export const selectIsOrdersEmpty = (state) => state.sellerOrder.ui.isEmpty;
export const selectSelectedOrderId = (state) =>
  state.sellerOrder.ui.selectedOrderId;

// Statistics selectors
export const selectOrdersStatistics = createSelector(
  [selectSellerOrderState],
  (sellerOrder) => {
    const orders = sellerOrder.orders.allIds.map(
      (id) => sellerOrder.orders.byId[id]
    );

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const recentOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return orderDate >= thirtyDaysAgo;
    }).length;

    const awaitingShipment = orders.filter(
      (o) => o.orderStatus === ORDER_STATUSES.CONFIRMED
    ).length;
    const awaitingPayment = orders.filter(
      (o) => o.orderStatus === ORDER_STATUSES.PENDING
    ).length;

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      recentOrders,
      awaitingShipment,
      awaitingPayment,
      statusCounts: sellerOrder.orders.statusCounts,
    };
  }
);

// Helper selectors for dashboard
export const selectRecentOrders = createSelector(
  [selectSellerOrderState],
  (sellerOrder) => {
    const orders = sellerOrder.orders.allIds.map(
      (id) => sellerOrder.orders.byId[id]
    );
    return orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5); // Get 5 most recent orders
  }
);

export const selectHighValueOrders = createSelector(
  [selectSellerOrderState],
  (sellerOrder) => {
    const orders = sellerOrder.orders.allIds.map(
      (id) => sellerOrder.orders.byId[id]
    );
    return orders
      .filter((order) => order.totalAmount > 100) // Orders above $100
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }
);

export const selectOrdersNeedingAttention = createSelector(
  [selectSellerOrderState],
  (sellerOrder) => {
    const orders = sellerOrder.orders.allIds.map(
      (id) => sellerOrder.orders.byId[id]
    );
    return orders.filter(
      (order) =>
        order.orderStatus === ORDER_STATUSES.PENDING ||
        order.orderStatus === ORDER_STATUSES.CONFIRMED
    );
  }
);

export default sellerOrderSlice.reducer;
