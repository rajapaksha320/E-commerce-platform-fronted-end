/* eslint-disable no-unused-vars */
// hooks/useSellerOrderData.js
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  // Actions import
  fetchSellerOrders,
  fetchOrdersByStatus,
  updateOrderStatus,
  searchOrders,
  bulkUpdateOrderStatus,
  fetchOrderStatistics,
  clearError,
  clearSuccess,
  clearMessages,
  setSelectedOrder,
  setFilters,
  clearFilters,
  optimisticUpdateOrder,
  invalidateCache,
  setPagination,

  // Selectors
  selectAllOrders,
  selectOrderById,
  selectOrdersByStatus,
  selectPendingOrders,
  selectConfirmedOrders,
  selectShippedOrders,
  selectDeliveredOrders,
  selectCancelledOrders,
  selectOrdersPagination,
  selectOrdersFilters,
  selectOrderStatusCounts,
  selectOrderUIState,
  selectIsOrdersLoading,
  selectIsUpdateOrderLoading,
  selectIsBulkUpdateLoading,
  selectOrderError,
  selectOrderSuccess,
  selectOrderMessage,
  selectIsOrdersEmpty,
  selectSelectedOrderId,
  selectOrdersStatistics,
  selectRecentOrders,
  selectHighValueOrders,
  selectOrdersNeedingAttention,
} from "../store/slices/sellerOrderSlice";

import sellerOrderService from "../services/sellerOrderService";
import { selectUser } from "../store/slices/authSlice";

/**
 * Main hook for seller order data management
 */
export const useSellerOrderData = () => {
  const dispatch = useDispatch();
  const sellerOrder = useSelector((state) => state.sellerOrder);

  return {
    // State
    orders: sellerOrder.orders,
    ui: sellerOrder.ui,
    cache: sellerOrder.cache,

    // Actions
    dispatch,
  };
};

/**
 * Hook for orders management
 */
export const useOrders = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const orders = useSelector(selectAllOrders);
  const pagination = useSelector(selectOrdersPagination);
  const filters = useSelector(selectOrdersFilters);
  const statusCounts = useSelector(selectOrderStatusCounts);
  const statistics = useSelector(selectOrdersStatistics);
  const isLoading = useSelector(selectIsOrdersLoading);
  const error = useSelector(selectOrderError);
  const success = useSelector(selectOrderSuccess);
  const message = useSelector(selectOrderMessage);
  const isEmpty = useSelector(selectIsOrdersEmpty);

  // Get seller ID from user data
  const sellerId = user?._id;

  // Fetch orders on mount
  useEffect(() => {
    if (sellerId) {
      dispatch(fetchSellerOrders({ sellerId }));
    }
  }, [dispatch, sellerId]);

  // Actions
  const fetchOrders = useCallback(
    (page = 1, pageSize = 10, useCache = true) => {
      if (sellerId) {
        return dispatch(
          fetchSellerOrders({ sellerId, page, pageSize, useCache })
        );
      }
    },
    [dispatch, sellerId]
  );

  const fetchByStatus = useCallback(
    (status, page = 1, pageSize = 10) => {
      return dispatch(fetchOrdersByStatus({ status, page, pageSize }));
    },
    [dispatch]
  );

  const updateStatus = useCallback(
    (orderId, status) => {
      return dispatch(updateOrderStatus({ orderId, status }));
    },
    [dispatch]
  );

  const searchOrdersAction = useCallback(
    (searchTerm, additionalFilters = {}) => {
      if (sellerId) {
        const searchFilters = {
          ...additionalFilters,
          search: searchTerm,
          page: 1,
          pageSize: 10,
        };

        dispatch(setFilters(searchFilters));
        return dispatch(
          searchOrders({
            searchTerm,
            sellerId,
            additionalFilters: searchFilters,
          })
        );
      }
    },
    [dispatch, sellerId]
  );

  const applyFilters = useCallback(
    (filterOptions) => {
      dispatch(setFilters(filterOptions));

      if (filterOptions.status) {
        return dispatch(
          fetchOrdersByStatus({
            status: filterOptions.status,
            page: 1,
            pageSize: filterOptions.pageSize || 10,
          })
        );
      } else if (filterOptions.search) {
        return searchOrdersAction(filterOptions.search, filterOptions);
      } else if (sellerId) {
        return dispatch(
          fetchSellerOrders({
            sellerId,
            page: 1,
            pageSize: filterOptions.pageSize || 10,
            useCache: false,
          })
        );
      }
    },
    [dispatch, searchOrdersAction, sellerId]
  );

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
    return fetchOrders();
  }, [dispatch, fetchOrders]);

  const bulkUpdate = useCallback(
    (orderIds, status) => {
      return dispatch(bulkUpdateOrderStatus({ orderIds, status }));
    },
    [dispatch]
  );

  const refreshOrders = useCallback(() => {
    dispatch(invalidateCache());
    return fetchOrders(1, 10, false);
  }, [dispatch, fetchOrders]);

  const clearMessages = useCallback(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch]);

  const getOrderStatistics = useCallback(() => {
    if (sellerId) {
      return dispatch(fetchOrderStatistics(sellerId));
    }
  }, [dispatch, sellerId]);

  return {
    // Data
    orders,
    pagination,
    filters,
    statusCounts,
    statistics,
    isEmpty,

    // Loading states
    isLoading,
    error,
    success,
    message,

    // Actions
    fetchOrders,
    fetchByStatus,
    updateStatus,
    searchOrders: searchOrdersAction,
    applyFilters,
    resetFilters,
    bulkUpdate,
    refreshOrders,
    clearMessages,
    getOrderStatistics,
  };
};

/**
 * Hook for single order details
 */
export const useOrderDetails = (orderId) => {
  const dispatch = useDispatch();
  const order = useSelector((state) => selectOrderById(orderId)(state));
  const isLoading = useSelector(selectIsUpdateOrderLoading);
  const error = useSelector(selectOrderError);

  const updateOrderStatusAction = useCallback(
    (status) => {
      if (orderId) {
        return dispatch(updateOrderStatus({ orderId, status }));
      }
    },
    [dispatch, orderId]
  );

  const performOptimisticUpdate = useCallback(
    (updates) => {
      if (orderId) {
        dispatch(optimisticUpdateOrder({ orderId, updates }));
      }
    },
    [dispatch, orderId]
  );

  const getNextPossibleStatuses = useCallback(() => {
    if (order?.orderStatus) {
      return sellerOrderService.getNextPossibleStatuses(order.orderStatus);
    }
    return [];
  }, [order?.orderStatus]);

  const canUpdateToStatus = useCallback(
    (newStatus) => {
      if (order?.orderStatus) {
        return sellerOrderService.isValidStatusTransition(
          order.orderStatus,
          newStatus
        );
      }
      return false;
    },
    [order?.orderStatus]
  );

  return {
    order,
    isLoading,
    error,
    updateOrderStatus: updateOrderStatusAction,
    performOptimisticUpdate,
    getNextPossibleStatuses,
    canUpdateToStatus,
  };
};

/**
 * Hook for dashboard statistics
 */
export const useOrderDashboardStats = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const statistics = useSelector(selectOrdersStatistics);
  const statusCounts = useSelector(selectOrderStatusCounts);
  const recentOrders = useSelector(selectRecentOrders);
  const highValueOrders = useSelector(selectHighValueOrders);
  const ordersNeedingAttention = useSelector(selectOrdersNeedingAttention);

  const sellerId = user?._id;

  // Calculate additional metrics
  const metrics = useMemo(() => {
    const todayRevenue = recentOrders
      .filter((order) => {
        const orderDate = new Date(order.createdAt);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString();
      })
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const weekRevenue = recentOrders
      .filter((order) => {
        const orderDate = new Date(order.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return orderDate >= weekAgo;
      })
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const monthRevenue = recentOrders
      .filter((order) => {
        const orderDate = new Date(order.createdAt);
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        return orderDate >= monthAgo;
      })
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      todayRevenue,
      weekRevenue,
      monthRevenue,
      ordersNeedingAttentionCount: ordersNeedingAttention.length,
      highValueOrdersCount: highValueOrders.length,
    };
  }, [recentOrders, ordersNeedingAttention, highValueOrders]);

  const refreshStats = useCallback(() => {
    if (sellerId) {
      dispatch(fetchSellerOrders({ sellerId, useCache: false }));
      dispatch(fetchOrderStatistics(sellerId));
    }
  }, [dispatch, sellerId]);

  return {
    statistics,
    statusCounts,
    recentOrders,
    highValueOrders,
    ordersNeedingAttention,
    metrics,
    refreshStats,
  };
};

/**
 * Hook for filtered orders (by status)
 */
export const useOrdersByStatus = (status) => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => selectOrdersByStatus(status)(state));
  const isLoading = useSelector(selectIsOrdersLoading);
  const error = useSelector(selectOrderError);
  const isEmpty = useSelector(selectIsOrdersEmpty);

  useEffect(() => {
    if (status) {
      dispatch(fetchOrdersByStatus({ status, page: 1, pageSize: 100 }));
    }
  }, [dispatch, status]);

  const refreshOrders = useCallback(() => {
    if (status) {
      return dispatch(fetchOrdersByStatus({ status, page: 1, pageSize: 100 }));
    }
  }, [dispatch, status]);

  return {
    orders,
    isLoading,
    error,
    isEmpty,
    refreshOrders,
  };
};

/**
 * Hook for pagination control
 */
export const useOrderPagination = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const pagination = useSelector(selectOrdersPagination);
  const filters = useSelector(selectOrdersFilters);

  const sellerId = user?._id;

  const goToPage = useCallback(
    (page) => {
      dispatch(setPagination({ page }));

      if (filters.status) {
        return dispatch(
          fetchOrdersByStatus({
            status: filters.status,
            page,
            pageSize: pagination.pageSize,
          })
        );
      } else if (filters.search && sellerId) {
        return dispatch(
          searchOrders({
            searchTerm: filters.search,
            sellerId,
            additionalFilters: {
              ...filters,
              page,
              pageSize: pagination.pageSize,
            },
          })
        );
      } else if (sellerId) {
        return dispatch(
          fetchSellerOrders({ sellerId, page, pageSize: pagination.pageSize })
        );
      }
    },
    [dispatch, filters, pagination.pageSize, sellerId]
  );

  const changePageSize = useCallback(
    (pageSize) => {
      dispatch(setPagination({ pageSize, page: 1 }));

      if (filters.status) {
        return dispatch(
          fetchOrdersByStatus({
            status: filters.status,
            page: 1,
            pageSize,
          })
        );
      } else if (filters.search && sellerId) {
        return dispatch(
          searchOrders({
            searchTerm: filters.search,
            sellerId,
            additionalFilters: { ...filters, page: 1, pageSize },
          })
        );
      } else if (sellerId) {
        return dispatch(fetchSellerOrders({ sellerId, page: 1, pageSize }));
      }
    },
    [dispatch, filters, sellerId]
  );

  const nextPage = useCallback(() => {
    if (pagination.currentPage < pagination.totalPages) {
      goToPage(pagination.currentPage + 1);
    }
  }, [pagination, goToPage]);

  const previousPage = useCallback(() => {
    if (pagination.currentPage > 1) {
      goToPage(pagination.currentPage - 1);
    }
  }, [pagination, goToPage]);

  return {
    ...pagination,
    goToPage,
    changePageSize,
    nextPage,
    previousPage,
    hasNextPage: pagination.currentPage < pagination.totalPages,
    hasPreviousPage: pagination.currentPage > 1,
  };
};

/**
 * Hook for search functionality
 */
export const useOrderSearch = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const filters = useSelector(selectOrdersFilters);
  const isLoading = useSelector(selectIsOrdersLoading);

  const sellerId = user?._id;

  const searchOrders = useCallback(
    (searchTerm, additionalFilters = {}) => {
      if (sellerId) {
        const searchFilters = {
          ...additionalFilters,
          search: searchTerm,
          page: 1,
          pageSize: 10,
        };

        dispatch(setFilters(searchFilters));
        return dispatch(
          searchOrders({
            searchTerm,
            sellerId,
            additionalFilters: searchFilters,
          })
        );
      }
    },
    [dispatch, sellerId]
  );

  const clearSearch = useCallback(() => {
    dispatch(clearFilters());
    if (sellerId) {
      return dispatch(fetchSellerOrders({ sellerId }));
    }
  }, [dispatch, sellerId]);

  return {
    currentSearch: filters.search,
    filters,
    isSearching: isLoading,
    searchOrders,
    clearSearch,
  };
};

/**
 * Hook for managing selected orders (for bulk operations)
 */
export const useSelectedOrders = () => {
  const dispatch = useDispatch();
  const [selectedIds, setSelectedIds] = useState([]);

  const selectOrder = useCallback((orderId) => {
    setSelectedIds((prev) => [...prev, orderId]);
  }, []);

  const deselectOrder = useCallback((orderId) => {
    setSelectedIds((prev) => prev.filter((id) => id !== orderId));
  }, []);

  const toggleOrder = useCallback((orderId) => {
    setSelectedIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  }, []);

  const selectAll = useCallback((orderIds) => {
    setSelectedIds(orderIds);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const performBulkUpdate = useCallback(
    (status) => {
      if (selectedIds.length > 0) {
        return dispatch(
          bulkUpdateOrderStatus({ orderIds: selectedIds, status })
        );
      }
    },
    [dispatch, selectedIds]
  );

  return {
    selectedIds,
    selectedCount: selectedIds.length,
    selectOrder,
    deselectOrder,
    toggleOrder,
    selectAll,
    clearSelection,
    performBulkUpdate,
  };
};

/**
 * Hook for order status management utilities
 */
export const useOrderStatusUtils = () => {
  const getStatusDisplayName = useCallback((status) => {
    return sellerOrderService.mapStatusToDisplayName(status);
  }, []);

  const getStatusColor = useCallback((status) => {
    return sellerOrderService.mapStatusToColor(status);
  }, []);

  const getNextPossibleStatuses = useCallback((currentStatus) => {
    return sellerOrderService.getNextPossibleStatuses(currentStatus);
  }, []);

  const isValidStatusTransition = useCallback((currentStatus, newStatus) => {
    return sellerOrderService.isValidStatusTransition(currentStatus, newStatus);
  }, []);

  const formatOrderData = useCallback((order) => {
    return sellerOrderService.formatOrderData(order);
  }, []);

  const calculateOrderMetrics = useCallback((orders) => {
    return sellerOrderService.calculateOrderMetrics(orders);
  }, []);

  return {
    getStatusDisplayName,
    getStatusColor,
    getNextPossibleStatuses,
    isValidStatusTransition,
    formatOrderData,
    calculateOrderMetrics,
  };
};

/**
 * Hook for specific order status groups
 */
export const useOrderStatusGroups = () => {
  const pendingOrders = useSelector(selectPendingOrders);
  const confirmedOrders = useSelector(selectConfirmedOrders);
  const shippedOrders = useSelector(selectShippedOrders);
  const deliveredOrders = useSelector(selectDeliveredOrders);
  const cancelledOrders = useSelector(selectCancelledOrders);

  return {
    pendingOrders,
    confirmedOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    awaitingPayment: pendingOrders,
    awaitingShipment: confirmedOrders,
    paidAndShipped: shippedOrders,
  };
};

export default {
  useSellerOrderData,
  useOrders,
  useOrderDetails,
  useOrderDashboardStats,
  useOrdersByStatus,
  useOrderPagination,
  useOrderSearch,
  useSelectedOrders,
  useOrderStatusUtils,
  useOrderStatusGroups,
};
