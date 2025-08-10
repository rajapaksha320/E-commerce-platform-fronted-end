// store/slices/sellerStoreSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sellerStoreService from '../../services/sellerStoreService';

// Initial state
const initialState = {
  // Store profile data
  storeProfile: null,
  storeProfiles: [], // For multiple stores if needed
  
  // Store statistics
  storeStats: {
    totalSales: 0,
    totalProducts: 0,
    rating: 0,
    totalReviews: 0,
    totalOrders: 0,
    totalRevenue: 0,
  },
  
  // Loading states
  loading: false,
  createLoading: false,
  updateLoading: false,
  statsLoading: false,
  
  // Response states
  error: null,
  success: false,
  message: '',
  
  // Store status
  hasStore: false,
  storeStatus: 'inactive', // active, inactive, suspended
};

// Async thunks

// Create store profile
export const createSellerStore = createAsyncThunk(
  'sellerStore/create',
  async (storeData, { rejectWithValue }) => {
    try {
      const response = await sellerStoreService.createStoreProfile(storeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create store profile'
      );
    }
  }
);

// Get seller store profile info
export const getSellerStoreProfile = createAsyncThunk(
  'sellerStore/getProfile',
  async ({ role = 'seller' } = {}, { rejectWithValue }) => {
    try {
      const response = await sellerStoreService.getStoreProfileInfo(role);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch store profile'
      );
    }
  }
);

// Update store profile
export const updateSellerStore = createAsyncThunk(
  'sellerStore/update',
  async ({ storeId, updateData }, { rejectWithValue }) => {
    try {
      const response = await sellerStoreService.updateStoreProfile(storeId, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update store profile'
      );
    }
  }
);

// Get store statistics
export const getSellerStoreStats = createAsyncThunk(
  'sellerStore/getStats',
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await sellerStoreService.getStoreStats(storeId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch store statistics'
      );
    }
  }
);

// Upload store logo
export const uploadStoreLogo = createAsyncThunk(
  'sellerStore/uploadLogo',
  async (imageFile, { rejectWithValue }) => {
    try {
      const response = await sellerStoreService.uploadStoreImage(imageFile);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to upload store logo'
      );
    }
  }
);

// Upload store banner
export const uploadStoreBanner = createAsyncThunk(
  'sellerStore/uploadBanner',
  async (imageFile, { rejectWithValue }) => {
    try {
      const response = await sellerStoreService.uploadStoreImage(imageFile);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to upload store banner'
      );
    }
  }
);

// Seller store slice
const sellerStoreSlice = createSlice({
  name: 'sellerStore',
  initialState,
  reducers: {
    // Clear messages
    clearSellerStoreError: (state) => {
      state.error = null;
    },
    clearSellerStoreSuccess: (state) => {
      state.success = false;
      state.message = '';
    },
    
    // Update store data locally
    updateStoreDataLocally: (state, action) => {
      if (state.storeProfile) {
        state.storeProfile = {
          ...state.storeProfile,
          ...action.payload,
        };
      }
    },
    
    // Set store status
    setStoreStatus: (state, action) => {
      state.storeStatus = action.payload;
      if (state.storeProfile) {
        state.storeProfile.status = action.payload;
      }
    },
    
    // Reset store state
    resetSellerStoreState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    // Create store profile
    builder
      .addCase(createSellerStore.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createSellerStore.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        state.message = action.payload.message || 'Store created successfully';
        state.storeProfile = action.payload.data;
        state.hasStore = true;
        state.storeStatus = action.payload.data.status || 'active';
        
        // Update stats from response
        if (action.payload.data) {
          state.storeStats.totalSales = action.payload.data.totalSales || 0;
          state.storeStats.totalProducts = action.payload.data.totalProducts || 0;
          state.storeStats.rating = action.payload.data.rating || 0;
        }
      })
      .addCase(createSellerStore.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      });

    // Get store profile
    builder
      .addCase(getSellerStoreProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSellerStoreProfile.fulfilled, (state, action) => {
        state.loading = false;
        
        // Handle array response (multiple stores) or single store
        if (action.payload.data && Array.isArray(action.payload.data)) {
          state.storeProfiles = action.payload.data;
          // Set the first store as the main profile
          if (action.payload.data.length > 0) {
            state.storeProfile = action.payload.data[0];
            state.hasStore = true;
            state.storeStatus = action.payload.data[0].status || 'active';
            
            // Update stats
            const store = action.payload.data[0];
            state.storeStats = {
              totalSales: store.totalSales || 0,
              totalProducts: store.totalProducts || 0,
              rating: store.rating || 0,
              totalReviews: store.totalReviews || 0,
              totalOrders: store.totalOrders || 0,
              totalRevenue: store.totalRevenue || 0,
            };
          } else {
            state.hasStore = false;
          }
        } else if (action.payload.data) {
          // Single store object
          state.storeProfile = action.payload.data;
          state.hasStore = true;
          state.storeStatus = action.payload.data.status || 'active';
        } else {
          state.hasStore = false;
        }
      })
      .addCase(getSellerStoreProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.hasStore = false;
      });

    // Update store profile
    builder
      .addCase(updateSellerStore.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateSellerStore.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;
        state.message = action.payload.message || 'Store updated successfully';
        
        if (action.payload.data) {
          state.storeProfile = action.payload.data;
          
          // Update in profiles array if exists
          const index = state.storeProfiles.findIndex(
            (store) => store._id === action.payload.data._id
          );
          if (index !== -1) {
            state.storeProfiles[index] = action.payload.data;
          }
          
          // Update stats
          state.storeStats = {
            totalSales: action.payload.data.totalSales || state.storeStats.totalSales,
            totalProducts: action.payload.data.totalProducts || state.storeStats.totalProducts,
            rating: action.payload.data.rating || state.storeStats.rating,
            totalReviews: action.payload.data.totalReviews || state.storeStats.totalReviews,
            totalOrders: action.payload.data.totalOrders || state.storeStats.totalOrders,
            totalRevenue: action.payload.data.totalRevenue || state.storeStats.totalRevenue,
          };
        }
      })
      .addCase(updateSellerStore.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });

    // Get store statistics
    builder
      .addCase(getSellerStoreStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(getSellerStoreStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        if (action.payload.data) {
          state.storeStats = {
            ...state.storeStats,
            ...action.payload.data,
          };
        }
      })
      .addCase(getSellerStoreStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      });

    // Upload store logo
    builder
      .addCase(uploadStoreLogo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadStoreLogo.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Logo uploaded successfully';
        
        // Update store profile with new logo URL
        if (state.storeProfile && action.payload.url) {
          state.storeProfile.shopMedia = {
            ...state.storeProfile.shopMedia,
            storeLogo: action.payload.url,
          };
        }
      })
      .addCase(uploadStoreLogo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Upload store banner
    builder
      .addCase(uploadStoreBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadStoreBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Banner uploaded successfully';
        
        // Update store profile with new banner URL
        if (state.storeProfile && action.payload.url) {
          state.storeProfile.shopMedia = {
            ...state.storeProfile.shopMedia,
            bannerImage: action.payload.url,
          };
        }
      })
      .addCase(uploadStoreBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearSellerStoreError,
  clearSellerStoreSuccess,
  updateStoreDataLocally,
  setStoreStatus,
  resetSellerStoreState,
} = sellerStoreSlice.actions;

// Selectors
export const selectStoreProfile = (state) => state.sellerStore.storeProfile;
export const selectStoreProfiles = (state) => state.sellerStore.storeProfiles;
export const selectStoreStats = (state) => state.sellerStore.storeStats;
export const selectStoreLoading = (state) => state.sellerStore.loading;
export const selectStoreCreateLoading = (state) => state.sellerStore.createLoading;
export const selectStoreUpdateLoading = (state) => state.sellerStore.updateLoading;
export const selectStoreError = (state) => state.sellerStore.error;
export const selectStoreSuccess = (state) => state.sellerStore.success;
export const selectStoreMessage = (state) => state.sellerStore.message;
export const selectHasStore = (state) => state.sellerStore.hasStore;
export const selectStoreStatus = (state) => state.sellerStore.storeStatus;

// Computed selectors
export const selectStoreBasicInfo = (state) => 
  state.sellerStore.storeProfile?.basicInformation || null;

export const selectStoreContactInfo = (state) => 
  state.sellerStore.storeProfile?.contactDetails || null;

export const selectStoreMedia = (state) => 
  state.sellerStore.storeProfile?.shopMedia || null;

export const selectStoreName = (state) => 
  state.sellerStore.storeProfile?.basicInformation?.storeName || '';

export const selectStoreId = (state) => 
  state.sellerStore.storeProfile?._id || state.sellerStore.storeProfile?.storeId || null;

export const selectIsStoreActive = (state) => 
  state.sellerStore.storeProfile?.status === 'active';

export const selectStoreRating = (state) => ({
  rating: state.sellerStore.storeProfile?.rating || 0,
  totalReviews: state.sellerStore.storeStats?.totalReviews || 0,
});

export const selectStoreDashboardData = (state) => ({
  storeName: state.sellerStore.storeProfile?.basicInformation?.storeName || 'My Shop',
  storeId: state.sellerStore.storeProfile?._id || null,
  totalSales: state.sellerStore.storeStats.totalSales,
  totalProducts: state.sellerStore.storeStats.totalProducts,
  totalOrders: state.sellerStore.storeStats.totalOrders,
  totalRevenue: state.sellerStore.storeStats.totalRevenue,
  rating: state.sellerStore.storeStats.rating,
  status: state.sellerStore.storeStatus,
  hasStore: state.sellerStore.hasStore,
});

export default sellerStoreSlice.reducer;