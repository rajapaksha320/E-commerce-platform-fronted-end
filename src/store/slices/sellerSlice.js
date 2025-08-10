// store/slices/sellerSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import sellerService from '../../services/sellerService';

// Normalized state structure for performance
const initialState = {
  // Listings state
  listings: {
    byId: {},
    allIds: [],
    pagination: {
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    },
    filters: {
      category: null,
      priceRange: null,
      status: null,
      search: null,
    },
    statusCounts: {
      active: 0,
      inactive: 0,
      draft: 0,
      outOfStock: 0,
      sold: 0,
    },
  },
  
  // Store/Shop state
  stores: {
    byId: {},
    allIds: [],
    currentStoreId: null,
  },
  
  // UI state
  ui: {
    listingsLoading: false,
    listingDetailsLoading: false,
    createListingLoading: false,
    updateListingLoading: false,
    deleteListingLoading: false,
    storeLoading: false,
    imageUploadLoading: false,
    error: null,
    success: false,
    message: '',
    selectedListingId: null,
    pendingImageUploads: [],
  },
  
  // Cache management
  cache: {
    listingsLastFetch: null,
    storesLastFetch: null,
    ttl: 5 * 60 * 1000, // 5 minutes
  },
};

// Helper function to normalize listings
const normalizeListings = (listings) => {
  const byId = {};
  const allIds = [];
  
  listings.forEach(listing => {
    byId[listing._id] = listing;
    allIds.push(listing._id);
  });
  
  return { byId, allIds };
};

// Helper function to normalize stores
const normalizeStores = (stores) => {
  const byId = {};
  const allIds = [];
  
  stores.forEach(store => {
    byId[store._id] = store;
    allIds.push(store._id);
  });
  
  return { byId, allIds };
};

// Async Thunks

// Listing Operations
export const createListing = createAsyncThunk(
  'seller/createListing',
  async (listingData, { rejectWithValue }) => {
    try {
      const response = await sellerService.createListing(listingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create listing'
      );
    }
  }
);

export const updateListing = createAsyncThunk(
  'seller/updateListing',
  async ({ listingId, updateData }, { rejectWithValue }) => {
    try {
      const response = await sellerService.updateListing(listingId, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update listing'
      );
    }
  }
);

export const fetchAllListings = createAsyncThunk(
  'seller/fetchAllListings',
  async ({ page = 1, pageSize = 10, useCache = true } = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { cache } = state.seller;
      
      // Cache check
      if (useCache && cache.listingsLastFetch) {
        const timeSinceLastFetch = Date.now() - cache.listingsLastFetch;
        if (timeSinceLastFetch < cache.ttl) {
          return { cached: true };
        }
      }
      
      const response = await sellerService.getAllListings(page, pageSize);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch listings'
      );
    }
  }
);

export const fetchListingById = createAsyncThunk(
  'seller/fetchListingById',
  async (listingId, { rejectWithValue }) => {
    try {
      const response = await sellerService.getListingById(listingId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch listing details'
      );
    }
  }
);

export const fetchListingsByStatus = createAsyncThunk(
  'seller/fetchListingsByStatus',
  async ({ status, page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await sellerService.getListingsByStatus(status, page, pageSize);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch listings by status'
      );
    }
  }
);

export const deleteListing = createAsyncThunk(
  'seller/deleteListing',
  async (listingId, { rejectWithValue }) => {
    try {
      const response = await sellerService.deleteListing(listingId);
      return { ...response.data, listingId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete listing'
      );
    }
  }
);

export const filterListings = createAsyncThunk(
  'seller/filterListings',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await sellerService.filterListings(filters);
      return { ...response.data, filters };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to filter listings'
      );
    }
  }
);

// Bulk operations
export const bulkUpdateListings = createAsyncThunk(
  'seller/bulkUpdateListings',
  async ({ listingIds, updateData }, { rejectWithValue }) => {
    try {
      const promises = listingIds.map(id => 
        sellerService.updateListing(id, updateData)
      );
      const responses = await Promise.all(promises);
      return responses.map(r => r.data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to bulk update listings'
      );
    }
  }
);

export const bulkDeleteListings = createAsyncThunk(
  'seller/bulkDeleteListings',
  async (listingIds, { rejectWithValue }) => {
    try {
      const promises = listingIds.map(id => sellerService.deleteListing(id));
      await Promise.all(promises);
      return listingIds;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to bulk delete listings'
      );
    }
  }
);

// Store/Shop Operations
export const createStoreProfile = createAsyncThunk(
  'seller/createStoreProfile',
  async (storeData, { rejectWithValue }) => {
    try {
      const response = await sellerService.createStoreProfile(storeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create store profile'
      );
    }
  }
);

export const updateStoreProfile = createAsyncThunk(
  'seller/updateStoreProfile',
  async ({ storeId, updateData }, { rejectWithValue }) => {
    try {
      const response = await sellerService.updateStoreProfile(storeId, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update store profile'
      );
    }
  }
);

export const fetchStoreProfiles = createAsyncThunk(
  'seller/fetchStoreProfiles',
  async ({ useCache = true } = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { cache } = state.seller;
      
      // Cache check
      if (useCache && cache.storesLastFetch) {
        const timeSinceLastFetch = Date.now() - cache.storesLastFetch;
        if (timeSinceLastFetch < cache.ttl) {
          return { cached: true };
        }
      }
      
      const response = await sellerService.getStoreProfiles();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch store profiles'
      );
    }
  }
);

// Image Operations
export const uploadImage = createAsyncThunk(
  'seller/uploadImage',
  async (imageFile, { rejectWithValue }) => {
    try {
      const response = await sellerService.uploadImage(imageFile);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to upload image'
      );
    }
  }
);

export const uploadMultipleImages = createAsyncThunk(
  'seller/uploadMultipleImages',
  async (imageFiles, { dispatch }) => {
    const uploadPromises = imageFiles.map(file => 
      dispatch(uploadImage(file))
    );
    const results = await Promise.all(uploadPromises);
    return results.map(r => r.payload);
  }
);

// Seller Slice
const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    // UI Actions
    clearError: (state) => {
      state.ui.error = null;
    },
    clearSuccess: (state) => {
      state.ui.success = false;
      state.ui.message = '';
    },
    setSelectedListing: (state, action) => {
      state.ui.selectedListingId = action.payload;
    },
    setFilters: (state, action) => {
      state.listings.filters = {
        ...state.listings.filters,
        ...action.payload,
      };
    },
    clearFilters: (state) => {
      state.listings.filters = {
        category: null,
        priceRange: null,
        status: null,
        search: null,
      };
    },
    setCurrentStore: (state, action) => {
      state.stores.currentStoreId = action.payload;
    },
    
    // Optimistic Updates
    optimisticUpdateListing: (state, action) => {
      const { listingId, updates } = action.payload;
      if (state.listings.byId[listingId]) {
        state.listings.byId[listingId] = {
          ...state.listings.byId[listingId],
          ...updates,
        };
      }
    },
    
    // Cache Management
    invalidateCache: (state, action) => {
      const cacheType = action.payload;
      if (cacheType === 'listings') {
        state.cache.listingsLastFetch = null;
      } else if (cacheType === 'stores') {
        state.cache.storesLastFetch = null;
      } else {
        state.cache.listingsLastFetch = null;
        state.cache.storesLastFetch = null;
      }
    },
    
    // Pagination
    setPagination: (state, action) => {
      state.listings.pagination = {
        ...state.listings.pagination,
        ...action.payload,
      };
    },
  },
  
  extraReducers: (builder) => {
    // Create Listing
    builder
      .addCase(createListing.pending, (state) => {
        state.ui.createListingLoading = true;
        state.ui.error = null;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.ui.createListingLoading = false;
        state.ui.success = true;
        state.ui.message = action.payload.message;
        
        const listing = action.payload.listing;
        state.listings.byId[listing._id] = listing;
        state.listings.allIds.unshift(listing._id);
        state.listings.pagination.total += 1;
        
        // Update status count
        if (listing.status && state.listings.statusCounts[listing.status] !== undefined) {
          state.listings.statusCounts[listing.status] += 1;
        }
      })
      .addCase(createListing.rejected, (state, action) => {
        state.ui.createListingLoading = false;
        state.ui.error = action.payload;
      });
    
    // Update Listing
    builder
      .addCase(updateListing.pending, (state) => {
        state.ui.updateListingLoading = true;
        state.ui.error = null;
      })
      .addCase(updateListing.fulfilled, (state, action) => {
        state.ui.updateListingLoading = false;
        state.ui.success = true;
        state.ui.message = action.payload.message || 'Listing updated successfully';
        
        const listing = action.payload.listing || action.payload;
        if (listing && listing._id) {
          const oldStatus = state.listings.byId[listing._id]?.status;
          state.listings.byId[listing._id] = listing;
          
          // Update status counts
          if (oldStatus !== listing.status) {
            if (oldStatus && state.listings.statusCounts[oldStatus] !== undefined) {
              state.listings.statusCounts[oldStatus] -= 1;
            }
            if (listing.status && state.listings.statusCounts[listing.status] !== undefined) {
              state.listings.statusCounts[listing.status] += 1;
            }
          }
        }
      })
      .addCase(updateListing.rejected, (state, action) => {
        state.ui.updateListingLoading = false;
        state.ui.error = action.payload;
      });
    
    // Fetch All Listings
    builder
      .addCase(fetchAllListings.pending, (state) => {
        state.ui.listingsLoading = true;
        state.ui.error = null;
      })
      .addCase(fetchAllListings.fulfilled, (state, action) => {
        state.ui.listingsLoading = false;
        
        if (!action.payload.cached) {
          const normalized = normalizeListings(action.payload.listings);
          state.listings.byId = normalized.byId;
          state.listings.allIds = normalized.allIds;
          state.listings.pagination = action.payload.pagination;
          state.cache.listingsLastFetch = Date.now();
          
          // Calculate status counts
          const statusCounts = { active: 0, inactive: 0, draft: 0, outOfStock: 0, sold: 0 };
          action.payload.listings.forEach(listing => {
            if (listing.status && statusCounts[listing.status] !== undefined) {
              statusCounts[listing.status]++;
            }
          });
          state.listings.statusCounts = statusCounts;
        }
      })
      .addCase(fetchAllListings.rejected, (state, action) => {
        state.ui.listingsLoading = false;
        state.ui.error = action.payload;
      });
    
    // Fetch Listing By ID
    builder
      .addCase(fetchListingById.pending, (state) => {
        state.ui.listingDetailsLoading = true;
        state.ui.error = null;
      })
      .addCase(fetchListingById.fulfilled, (state, action) => {
        state.ui.listingDetailsLoading = false;
        const listing = action.payload.listing;
        state.listings.byId[listing._id] = listing;
        if (!state.listings.allIds.includes(listing._id)) {
          state.listings.allIds.push(listing._id);
        }
      })
      .addCase(fetchListingById.rejected, (state, action) => {
        state.ui.listingDetailsLoading = false;
        state.ui.error = action.payload;
      });
    
    // Fetch Listings By Status
    builder
      .addCase(fetchListingsByStatus.pending, (state) => {
        state.ui.listingsLoading = true;
        state.ui.error = null;
      })
      .addCase(fetchListingsByStatus.fulfilled, (state, action) => {
        state.ui.listingsLoading = false;
        const normalized = normalizeListings(action.payload.listings);
        
        // Merge with existing data
        Object.keys(normalized.byId).forEach(id => {
          state.listings.byId[id] = normalized.byId[id];
        });
        
        // Update pagination
        state.listings.pagination = action.payload.pagination;
        state.listings.filters.status = action.meta.arg.status;
      })
      .addCase(fetchListingsByStatus.rejected, (state, action) => {
        state.ui.listingsLoading = false;
        state.ui.error = action.payload;
      });
    
    // Delete Listing
    builder
      .addCase(deleteListing.pending, (state) => {
        state.ui.deleteListingLoading = true;
        state.ui.error = null;
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.ui.deleteListingLoading = false;
        state.ui.success = true;
        state.ui.message = action.payload.message;
        
        const listingId = action.payload.listingId;
        const deletedListing = state.listings.byId[listingId];
        
        // Update status count
        if (deletedListing?.status && state.listings.statusCounts[deletedListing.status] !== undefined) {
          state.listings.statusCounts[deletedListing.status] -= 1;
        }
        
        delete state.listings.byId[listingId];
        state.listings.allIds = state.listings.allIds.filter(id => id !== listingId);
        state.listings.pagination.total -= 1;
      })
      .addCase(deleteListing.rejected, (state, action) => {
        state.ui.deleteListingLoading = false;
        state.ui.error = action.payload;
      });
    
    // Filter Listings
    builder
      .addCase(filterListings.pending, (state) => {
        state.ui.listingsLoading = true;
        state.ui.error = null;
      })
      .addCase(filterListings.fulfilled, (state, action) => {
        state.ui.listingsLoading = false;
        const normalized = normalizeListings(action.payload.listings);
        state.listings.byId = normalized.byId;
        state.listings.allIds = normalized.allIds;
        state.listings.pagination = action.payload.pagination;
        state.listings.filters = action.payload.filters;
      })
      .addCase(filterListings.rejected, (state, action) => {
        state.ui.listingsLoading = false;
        state.ui.error = action.payload;
      });
    
    // Bulk Update Listings
    builder
      .addCase(bulkUpdateListings.pending, (state) => {
        state.ui.updateListingLoading = true;
        state.ui.error = null;
      })
      .addCase(bulkUpdateListings.fulfilled, (state, action) => {
        state.ui.updateListingLoading = false;
        state.ui.success = true;
        state.ui.message = 'Listings updated successfully';
        
        action.payload.forEach(response => {
          const listing = response.listing || response;
          if (listing && listing._id) {
            state.listings.byId[listing._id] = listing;
          }
        });
      })
      .addCase(bulkUpdateListings.rejected, (state, action) => {
        state.ui.updateListingLoading = false;
        state.ui.error = action.payload;
      });
    
    // Bulk Delete Listings
    builder
      .addCase(bulkDeleteListings.pending, (state) => {
        state.ui.deleteListingLoading = true;
        state.ui.error = null;
      })
      .addCase(bulkDeleteListings.fulfilled, (state, action) => {
        state.ui.deleteListingLoading = false;
        state.ui.success = true;
        state.ui.message = 'Listings deleted successfully';
        
        action.payload.forEach(listingId => {
          const deletedListing = state.listings.byId[listingId];
          if (deletedListing?.status && state.listings.statusCounts[deletedListing.status] !== undefined) {
            state.listings.statusCounts[deletedListing.status] -= 1;
          }
          delete state.listings.byId[listingId];
        });
        
        state.listings.allIds = state.listings.allIds.filter(
          id => !action.payload.includes(id)
        );
        state.listings.pagination.total -= action.payload.length;
      })
      .addCase(bulkDeleteListings.rejected, (state, action) => {
        state.ui.deleteListingLoading = false;
        state.ui.error = action.payload;
      });
    
    // Create Store Profile
    builder
      .addCase(createStoreProfile.pending, (state) => {
        state.ui.storeLoading = true;
        state.ui.error = null;
      })
      .addCase(createStoreProfile.fulfilled, (state, action) => {
        state.ui.storeLoading = false;
        state.ui.success = true;
        state.ui.message = action.payload.message;
        
        const store = action.payload.data;
        state.stores.byId[store._id] = store;
        state.stores.allIds.push(store._id);
        state.stores.currentStoreId = store._id;
      })
      .addCase(createStoreProfile.rejected, (state, action) => {
        state.ui.storeLoading = false;
        state.ui.error = action.payload;
      });
    
    // Update Store Profile
    builder
      .addCase(updateStoreProfile.pending, (state) => {
        state.ui.storeLoading = true;
        state.ui.error = null;
      })
      .addCase(updateStoreProfile.fulfilled, (state, action) => {
        state.ui.storeLoading = false;
        state.ui.success = true;
        state.ui.message = action.payload.message || 'Store updated successfully';
        
        const store = action.payload.data || action.payload;
        if (store && store._id) {
          state.stores.byId[store._id] = store;
        }
      })
      .addCase(updateStoreProfile.rejected, (state, action) => {
        state.ui.storeLoading = false;
        state.ui.error = action.payload;
      });
    
    // Fetch Store Profiles
    builder
      .addCase(fetchStoreProfiles.pending, (state) => {
        state.ui.storeLoading = true;
        state.ui.error = null;
      })
      .addCase(fetchStoreProfiles.fulfilled, (state, action) => {
        state.ui.storeLoading = false;
        
        if (!action.payload.cached) {
          const stores = action.payload.data || [];
          const normalized = normalizeStores(stores);
          state.stores.byId = normalized.byId;
          state.stores.allIds = normalized.allIds;
          
          // Set current store if only one exists
          if (stores.length === 1) {
            state.stores.currentStoreId = stores[0]._id;
          }
          
          state.cache.storesLastFetch = Date.now();
        }
      })
      .addCase(fetchStoreProfiles.rejected, (state, action) => {
        state.ui.storeLoading = false;
        state.ui.error = action.payload;
      });
    
    // Upload Image
    builder
      .addCase(uploadImage.pending, (state) => {
        state.ui.imageUploadLoading = true;
        state.ui.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.ui.imageUploadLoading = false;
        state.ui.pendingImageUploads.push(action.payload.url);
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.ui.imageUploadLoading = false;
        state.ui.error = action.payload;
      });
    
    // Upload Multiple Images
    builder
      .addCase(uploadMultipleImages.pending, (state) => {
        state.ui.imageUploadLoading = true;
      })
      .addCase(uploadMultipleImages.fulfilled, (state, action) => {
        state.ui.imageUploadLoading = false;
        const urls = action.payload.filter(p => p?.url).map(p => p.url);
        state.ui.pendingImageUploads.push(...urls);
      })
      .addCase(uploadMultipleImages.rejected, (state) => {
        state.ui.imageUploadLoading = false;
      });
  },
});

// Actions
export const {
  clearError,
  clearSuccess,
  setSelectedListing,
  setFilters,
  clearFilters,
  setCurrentStore,
  optimisticUpdateListing,
  invalidateCache,
  setPagination,
} = sellerSlice.actions;

// Selectors
export const selectSellerState = (state) => state.seller;

// Memoized selectors for performance
export const selectAllListings = createSelector(
  [selectSellerState],
  (seller) => seller.listings.allIds.map(id => seller.listings.byId[id])
);

export const selectListingById = (listingId) => createSelector(
  [selectSellerState],
  (seller) => seller.listings.byId[listingId]
);

export const selectListingsByStatus = (status) => createSelector(
  [selectSellerState],
  (seller) => {
    return seller.listings.allIds
      .map(id => seller.listings.byId[id])
      .filter(listing => listing.status === status);
  }
);

export const selectActiveListings = createSelector(
  [selectSellerState],
  (seller) => {
    return seller.listings.allIds
      .map(id => seller.listings.byId[id])
      .filter(listing => listing.status === 'active');
  }
);

export const selectListingsPagination = (state) => state.seller.listings.pagination;
export const selectListingsFilters = (state) => state.seller.listings.filters;
export const selectStatusCounts = (state) => state.seller.listings.statusCounts;

export const selectAllStores = createSelector(
  [selectSellerState],
  (seller) => seller.stores.allIds.map(id => seller.stores.byId[id])
);

export const selectCurrentStore = createSelector(
  [selectSellerState],
  (seller) => {
    const currentId = seller.stores.currentStoreId;
    return currentId ? seller.stores.byId[currentId] : null;
  }
);

export const selectStoreById = (storeId) => createSelector(
  [selectSellerState],
  (seller) => seller.stores.byId[storeId]
);

export const selectHasStore = createSelector(
  [selectSellerState],
  (seller) => seller.stores.allIds.length > 0
);

export const selectUIState = (state) => state.seller.ui;
export const selectIsLoading = (state) => state.seller.ui.listingsLoading;
export const selectError = (state) => state.seller.ui.error;
export const selectSuccess = (state) => state.seller.ui.success;
export const selectMessage = (state) => state.seller.ui.message;
export const selectPendingImageUploads = (state) => state.seller.ui.pendingImageUploads;

// Statistics selectors
export const selectListingsStatistics = createSelector(
  [selectSellerState],
  (seller) => {
    const listings = seller.listings.allIds.map(id => seller.listings.byId[id]);
    
    const totalListings = listings.length;
    const totalValue = listings.reduce((sum, listing) => {
      const price = parseFloat(listing.variations?.[0]?.price || 0);
      const quantity = parseInt(listing.variations?.[0]?.quantity || 0);
      return sum + (price * quantity);
    }, 0);
    
    const averagePrice = listings.reduce((sum, listing) => {
      const price = parseFloat(listing.variations?.[0]?.price || 0);
      return sum + price;
    }, 0) / (totalListings || 1);
    
    const outOfStock = listings.filter(l => 
      l.status === 'outOfStock' || 
      l.variations?.some(v => parseInt(v.quantity) === 0)
    ).length;
    
    return {
      totalListings,
      totalValue,
      averagePrice,
      outOfStock,
      statusCounts: seller.listings.statusCounts,
    };
  }
);

export default sellerSlice.reducer;