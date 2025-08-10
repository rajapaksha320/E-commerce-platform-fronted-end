/* eslint-disable no-unused-vars */
// hooks/useSellerData.js
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  // Actions
  createListing,
  updateListing,
  fetchAllListings,
  fetchListingById,
  fetchListingsByStatus,
  deleteListing,
  filterListings,
  bulkUpdateListings,
  bulkDeleteListings,
  createStoreProfile,
  updateStoreProfile,
  fetchStoreProfiles,
  uploadImage,
  uploadMultipleImages,
  clearError,
  clearSuccess,
  setSelectedListing,
  setFilters,
  clearFilters,
  setCurrentStore,
  optimisticUpdateListing,
  invalidateCache,
  setPagination,
  
  // Selectors
  selectAllListings,
  selectListingById,
  selectListingsByStatus,
  selectActiveListings,
  selectListingsPagination,
  selectListingsFilters,
  selectStatusCounts,
  selectAllStores,
  selectCurrentStore,
  selectStoreById,
  selectHasStore,
  selectUIState,
  selectIsLoading,
  selectError,
  selectSuccess,
  selectMessage,
  selectPendingImageUploads,
  selectListingsStatistics,
} from '../store/slices/sellerSlice';

/**
 * Main hook for seller data management
 */
export const useSellerData = () => {
  const dispatch = useDispatch();
  const seller = useSelector(state => state.seller);
  
  return {
    // State
    listings: seller.listings,
    stores: seller.stores,
    ui: seller.ui,
    cache: seller.cache,
    
    // Actions
    dispatch,
  };
};

/**
 * Hook for listings management
 */
export const useListings = () => {
  const dispatch = useDispatch();
  const listings = useSelector(selectAllListings);
  const pagination = useSelector(selectListingsPagination);
  const filters = useSelector(selectListingsFilters);
  const statusCounts = useSelector(selectStatusCounts);
  const statistics = useSelector(selectListingsStatistics);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const message = useSelector(selectMessage);
  
  // Fetch listings on mount
  useEffect(() => {
    dispatch(fetchAllListings());
  }, [dispatch]);
  
  // Actions
  const createNewListing = useCallback((listingData) => {
    return dispatch(createListing(listingData));
  }, [dispatch]);
  
  const updateExistingListing = useCallback((listingId, updateData) => {
    return dispatch(updateListing({ listingId, updateData }));
  }, [dispatch]);
  
  const deleteExistingListing = useCallback((listingId) => {
    return dispatch(deleteListing(listingId));
  }, [dispatch]);
  
  const fetchListings = useCallback((page = 1, pageSize = 10, useCache = true) => {
    return dispatch(fetchAllListings({ page, pageSize, useCache }));
  }, [dispatch]);
  
  const fetchByStatus = useCallback((status, page = 1, pageSize = 10) => {
    return dispatch(fetchListingsByStatus({ status, page, pageSize }));
  }, [dispatch]);
  
  const applyFilters = useCallback((filterOptions) => {
    dispatch(setFilters(filterOptions));
    return dispatch(filterListings(filterOptions));
  }, [dispatch]);
  
  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
    return dispatch(fetchAllListings());
  }, [dispatch]);
  
  const bulkUpdate = useCallback((listingIds, updateData) => {
    return dispatch(bulkUpdateListings({ listingIds, updateData }));
  }, [dispatch]);
  
  const bulkDelete = useCallback((listingIds) => {
    return dispatch(bulkDeleteListings(listingIds));
  }, [dispatch]);
  
  const refreshListings = useCallback(() => {
    dispatch(invalidateCache('listings'));
    return dispatch(fetchAllListings({ useCache: false }));
  }, [dispatch]);
  
  const clearMessages = useCallback(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch]);
  
  return {
    // Data
    listings,
    pagination,
    filters,
    statusCounts,
    statistics,
    
    // Loading states
    isLoading,
    error,
    success,
    message,
    
    // Actions
    createNewListing,
    updateExistingListing,
    deleteExistingListing,
    fetchListings,
    fetchByStatus,
    applyFilters,
    resetFilters,
    bulkUpdate,
    bulkDelete,
    refreshListings,
    clearMessages,
  };
};

/**
 * Hook for single listing details
 */
export const useListingDetails = (listingId) => {
  const dispatch = useDispatch();
  const listing = useSelector(state => selectListingById(listingId)(state));
  const isLoading = useSelector(state => state.seller.ui.listingDetailsLoading);
  const error = useSelector(selectError);
  
  useEffect(() => {
    if (listingId && !listing) {
      dispatch(fetchListingById(listingId));
    }
  }, [dispatch, listingId, listing]);
  
  const refreshListing = useCallback(() => {
    if (listingId) {
      return dispatch(fetchListingById(listingId));
    }
  }, [dispatch, listingId]);
  
  const updateListing = useCallback((updateData) => {
    if (listingId) {
      return dispatch(updateListing({ listingId, updateData }));
    }
  }, [dispatch, listingId]);
  
  const performOptimisticUpdate = useCallback((updates) => {
    if (listingId) {
      dispatch(optimisticUpdateListing({ listingId, updates }));
    }
  }, [dispatch, listingId]);
  
  return {
    listing,
    isLoading,
    error,
    refreshListing,
    updateListing,
    performOptimisticUpdate,
  };
};

/**
 * Hook for store/shop management
 */
export const useStore = () => {
  const dispatch = useDispatch();
  const stores = useSelector(selectAllStores);
  const currentStore = useSelector(selectCurrentStore);
  const hasStore = useSelector(selectHasStore);
  const isLoading = useSelector(state => state.seller.ui.storeLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const message = useSelector(selectMessage);
  
  // Fetch stores on mount
  useEffect(() => {
    dispatch(fetchStoreProfiles());
  }, [dispatch]);
  
  const createStore = useCallback((storeData) => {
    return dispatch(createStoreProfile(storeData));
  }, [dispatch]);
  
  const updateStore = useCallback((storeId, updateData) => {
    return dispatch(updateStoreProfile({ storeId, updateData }));
  }, [dispatch]);
  
  const updateCurrentStore = useCallback((updateData) => {
    if (currentStore?._id) {
      return dispatch(updateStoreProfile({ 
        storeId: currentStore._id, 
        updateData 
      }));
    }
  }, [dispatch, currentStore]);
  
  const selectStore = useCallback((storeId) => {
    dispatch(setCurrentStore(storeId));
  }, [dispatch]);
  
  const refreshStores = useCallback(() => {
    dispatch(invalidateCache('stores'));
    return dispatch(fetchStoreProfiles({ useCache: false }));
  }, [dispatch]);
  
  const clearMessages = useCallback(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch]);
  
  return {
    // Data
    stores,
    currentStore,
    hasStore,
    
    // Loading states
    isLoading,
    error,
    success,
    message,
    
    // Actions
    createStore,
    updateStore,
    updateCurrentStore,
    selectStore,
    refreshStores,
    clearMessages,
  };
};

/**
 * Hook for image upload management
 */
export const useImageUpload = () => {
  const dispatch = useDispatch();
  const isUploading = useSelector(state => state.seller.ui.imageUploadLoading);
  const pendingUploads = useSelector(selectPendingImageUploads);
  const error = useSelector(selectError);
  
  const uploadSingleImage = useCallback(async (file) => {
    const result = await dispatch(uploadImage(file));
    if (uploadImage.fulfilled.match(result)) {
      return result.payload.url;
    }
    throw new Error(result.payload || 'Upload failed');
  }, [dispatch]);
  
  const uploadImages = useCallback(async (files) => {
    const result = await dispatch(uploadMultipleImages(files));
    if (uploadMultipleImages.fulfilled.match(result)) {
      return result.payload.filter(p => p?.url).map(p => p.url);
    }
    throw new Error('Upload failed');
  }, [dispatch]);
  
  const clearPendingUploads = useCallback(() => {
    // You might want to add an action for this in the slice
    // For now, this is a placeholder
    console.log('Clearing pending uploads');
  }, []);
  
  return {
    isUploading,
    pendingUploads,
    error,
    uploadSingleImage,
    uploadImages,
    clearPendingUploads,
  };
};

/**
 * Hook for dashboard statistics
 */
export const useDashboardStats = () => {
  const dispatch = useDispatch();
  const statistics = useSelector(selectListingsStatistics);
  const statusCounts = useSelector(selectStatusCounts);
  const currentStore = useSelector(selectCurrentStore);
  const listings = useSelector(selectAllListings);
  
  // Calculate additional metrics
  const metrics = useMemo(() => {
    const activeListings = listings.filter(l => l.status === 'active');
    const totalInventoryValue = listings.reduce((sum, listing) => {
      const value = listing.variations?.reduce((vSum, variation) => {
        const price = parseFloat(variation.price || 0);
        const quantity = parseInt(variation.quantity || 0);
        return vSum + (price * quantity);
      }, 0) || 0;
      return sum + value;
    }, 0);
    
    const lowStockItems = listings.filter(listing => {
      return listing.variations?.some(v => {
        const quantity = parseInt(v.quantity || 0);
        return quantity > 0 && quantity < 10;
      });
    });
    
    const bestSellers = [...listings]
      .filter(l => l.status === 'active')
      .sort((a, b) => {
        const aViews = a.views || 0;
        const bViews = b.views || 0;
        return bViews - aViews;
      })
      .slice(0, 5);
    
    return {
      totalInventoryValue,
      lowStockCount: lowStockItems.length,
      activeListingsCount: activeListings.length,
      bestSellers,
      conversionRate: currentStore?.conversionRate || 0,
      totalRevenue: currentStore?.totalSales || 0,
    };
  }, [listings, currentStore]);
  
  const refreshStats = useCallback(() => {
    dispatch(fetchAllListings({ useCache: false }));
    dispatch(fetchStoreProfiles({ useCache: false }));
  }, [dispatch]);
  
  return {
    statistics,
    statusCounts,
    metrics,
    currentStore,
    refreshStats,
  };
};

/**
 * Hook for filtered listings (by status)
 */
export const useListingsByStatus = (status) => {
  const dispatch = useDispatch();
  const listings = useSelector(state => selectListingsByStatus(status)(state));
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  
  useEffect(() => {
    if (status) {
      dispatch(fetchListingsByStatus({ status, page: 1, pageSize: 100 }));
    }
  }, [dispatch, status]);
  
  const refreshListings = useCallback(() => {
    if (status) {
      return dispatch(fetchListingsByStatus({ status, page: 1, pageSize: 100 }));
    }
  }, [dispatch, status]);
  
  return {
    listings,
    isLoading,
    error,
    refreshListings,
  };
};

/**
 * Hook for pagination control
 */
export const usePagination = () => {
  const dispatch = useDispatch();
  const pagination = useSelector(selectListingsPagination);
  const filters = useSelector(selectListingsFilters);
  
  const goToPage = useCallback((page) => {
    dispatch(setPagination({ page }));
    
    if (filters.status) {
      return dispatch(fetchListingsByStatus({ 
        status: filters.status, 
        page, 
        pageSize: pagination.pageSize 
      }));
    } else if (filters.category || filters.priceRange || filters.search) {
      return dispatch(filterListings({ ...filters, page, pageSize: pagination.pageSize }));
    } else {
      return dispatch(fetchAllListings({ page, pageSize: pagination.pageSize }));
    }
  }, [dispatch, filters, pagination.pageSize]);
  
  const changePageSize = useCallback((pageSize) => {
    dispatch(setPagination({ pageSize, page: 1 }));
    
    if (filters.status) {
      return dispatch(fetchListingsByStatus({ 
        status: filters.status, 
        page: 1, 
        pageSize 
      }));
    } else if (filters.category || filters.priceRange || filters.search) {
      return dispatch(filterListings({ ...filters, page: 1, pageSize }));
    } else {
      return dispatch(fetchAllListings({ page: 1, pageSize }));
    }
  }, [dispatch, filters]);
  
  const nextPage = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      goToPage(pagination.page + 1);
    }
  }, [pagination, goToPage]);
  
  const previousPage = useCallback(() => {
    if (pagination.page > 1) {
      goToPage(pagination.page - 1);
    }
  }, [pagination, goToPage]);
  
  return {
    ...pagination,
    goToPage,
    changePageSize,
    nextPage,
    previousPage,
    hasNextPage: pagination.page < pagination.totalPages,
    hasPreviousPage: pagination.page > 1,
  };
};

/**
 * Hook for search functionality
 */
export const useSearch = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectListingsFilters);
  const isLoading = useSelector(selectIsLoading);
  
  const searchListings = useCallback((searchTerm, additionalFilters = {}) => {
    const searchFilters = {
      ...additionalFilters,
      search: searchTerm,
      page: 1,
      pageSize: 10,
    };
    
    dispatch(setFilters(searchFilters));
    return dispatch(filterListings(searchFilters));
  }, [dispatch]);
  
  const advancedSearch = useCallback((searchParams) => {
    dispatch(setFilters(searchParams));
    return dispatch(filterListings(searchParams));
  }, [dispatch]);
  
  const clearSearch = useCallback(() => {
    dispatch(clearFilters());
    return dispatch(fetchAllListings());
  }, [dispatch]);
  
  return {
    currentSearch: filters.search,
    filters,
    isSearching: isLoading,
    searchListings,
    advancedSearch,
    clearSearch,
  };
};

/**
 * Hook for managing selected listings (for bulk operations)
 */
export const useSelectedListings = () => {
  const dispatch = useDispatch();
  const [selectedIds, setSelectedIds] = useState([]);
  
  const selectListing = useCallback((listingId) => {
    setSelectedIds(prev => [...prev, listingId]);
  }, []);
  
  const deselectListing = useCallback((listingId) => {
    setSelectedIds(prev => prev.filter(id => id !== listingId));
  }, []);
  
  const toggleListing = useCallback((listingId) => {
    setSelectedIds(prev => 
      prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  }, []);
  
  const selectAll = useCallback((listingIds) => {
    setSelectedIds(listingIds);
  }, []);
  
  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);
  
  const performBulkUpdate = useCallback((updateData) => {
    if (selectedIds.length > 0) {
      return dispatch(bulkUpdateListings({ listingIds: selectedIds, updateData }));
    }
  }, [dispatch, selectedIds]);
  
  const performBulkDelete = useCallback(() => {
    if (selectedIds.length > 0) {
      return dispatch(bulkDeleteListings(selectedIds)).then(() => {
        clearSelection();
      });
    }
  }, [dispatch, selectedIds, clearSelection]);
  
  return {
    selectedIds,
    selectedCount: selectedIds.length,
    selectListing,
    deselectListing,
    toggleListing,
    selectAll,
    clearSelection,
    performBulkUpdate,
    performBulkDelete,
  };
};

import { useState } from 'react';

export default {
  useSellerData,
  useListings,
  useListingDetails,
  useStore,
  useImageUpload,
  useDashboardStats,
  useListingsByStatus,
  usePagination,
  useSearch,
  useSelectedListings,
};