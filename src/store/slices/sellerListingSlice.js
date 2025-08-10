// store/slices/sellerListingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sellerListingService from '../../services/sellerListingService';

// Safe localStorage utility functions (reusing pattern from authSlice)
const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }
};

// Initial state
const initialState = {
  // Listings data
  listings: [],
  currentListing: null,
  sellerInfo: null,
  
  // Pagination
  pagination: {
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  },
  
  // Filters for listings
  filters: {
    status: '',
    category: '',
    priceRange: '',
    searchQuery: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  
  // Status counts for sidebar
  statusCounts: {
    all: 0,
    active: 0,
    inactive: 0,
    draft: 0,
    outOfStock: 0,
    sold: 0,
  },
  
  // Loading states
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  imageUploadLoading: false,
  
  // Response states
  error: null,
  success: false,
  message: '',
  
  // Image upload
  uploadedImageUrl: null,
  uploadedImages: [],
  
  // Draft listing (for create/edit form)
  draftListing: storage.get('draftListing', null),
};

// Async thunks

// Create listing
export const createSellerListing = createAsyncThunk(
  'sellerListing/create',
  async (listingData, { rejectWithValue }) => {
    try {
      const response = await sellerListingService.createListing(listingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create listing'
      );
    }
  }
);

// Get all seller listings with pagination
export const getSellerListings = createAsyncThunk(
  'sellerListing/getAll',
  async ({ page = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await sellerListingService.getAllListings(page, pageSize);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch listings'
      );
    }
  }
);

// Get listing by ID
export const getSellerListingById = createAsyncThunk(
  'sellerListing/getById',
  async (listingId, { rejectWithValue }) => {
    try {
      const response = await sellerListingService.getListingById(listingId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch listing details'
      );
    }
  }
);

// Get listings by status
export const getSellerListingsByStatus = createAsyncThunk(
  'sellerListing/getByStatus',
  async ({ status, page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await sellerListingService.getListingsByStatus(
        status,
        page,
        pageSize
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch listings by status'
      );
    }
  }
);

// Filter listings
export const filterSellerListings = createAsyncThunk(
  'sellerListing/filter',
  async (filterParams, { rejectWithValue }) => {
    try {
      const response = await sellerListingService.filterListings(filterParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to filter listings'
      );
    }
  }
);

// Delete listing
export const deleteSellerListing = createAsyncThunk(
  'sellerListing/delete',
  async (listingId, { rejectWithValue }) => {
    try {
      const response = await sellerListingService.deleteListing(listingId);
      return { ...response.data, listingId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete listing'
      );
    }
  }
);

// Update listing
export const updateSellerListing = createAsyncThunk(
  'sellerListing/update',
  async ({ listingId, updateData }, { rejectWithValue }) => {
    try {
      const response = await sellerListingService.updateListing(listingId, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update listing'
      );
    }
  }
);

// Upload image
export const uploadSellerImage = createAsyncThunk(
  'sellerListing/uploadImage',
  async (imageFile, { rejectWithValue }) => {
    try {
      const response = await sellerListingService.uploadImage(imageFile);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to upload image'
      );
    }
  }
);

// Seller listing slice
const sellerListingSlice = createSlice({
  name: 'sellerListing',
  initialState,
  reducers: {
    // Clear messages
    clearSellerListingError: (state) => {
      state.error = null;
    },
    clearSellerListingSuccess: (state) => {
      state.success = false;
      state.message = '';
    },
    
    // Set filters
    setSellerListingFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    
    // Clear filters
    clearSellerListingFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    // Set pagination
    setSellerListingPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
    
    // Save draft listing
    saveDraftListing: (state, action) => {
      state.draftListing = action.payload;
      storage.set('draftListing', action.payload);
    },
    
    // Clear draft listing
    clearDraftListing: (state) => {
      state.draftListing = null;
      storage.remove('draftListing');
    },
    
    // Add uploaded image
    addUploadedImage: (state, action) => {
      state.uploadedImages.push(action.payload);
    },
    
    // Remove uploaded image
    removeUploadedImage: (state, action) => {
      state.uploadedImages = state.uploadedImages.filter(
        (img) => img.id !== action.payload
      );
    },
    
    // Clear uploaded images
    clearUploadedImages: (state) => {
      state.uploadedImages = [];
      state.uploadedImageUrl = null;
    },
    
    // Update listing status locally
    updateListingStatus: (state, action) => {
      const { listingId, status } = action.payload;
      const listing = state.listings.find((l) => l._id === listingId);
      if (listing) {
        listing.status = status;
      }
      if (state.currentListing && state.currentListing._id === listingId) {
        state.currentListing.status = status;
      }
    },
    
    // Reset state
    resetSellerListingState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    // Create listing
    builder
      .addCase(createSellerListing.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createSellerListing.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        state.message = action.payload.message || 'Listing created successfully';
        state.listings.unshift(action.payload.listing);
        state.statusCounts.all += 1;
        state.statusCounts[action.payload.listing.status] += 1;
        // Clear draft on successful creation
        state.draftListing = null;
        storage.remove('draftListing');
      })
      .addCase(createSellerListing.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      });

    // Get all listings
    builder
      .addCase(getSellerListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSellerListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload.listings;
        state.pagination = action.payload.pagination;
        
        // Update status counts
        const counts = { all: 0, active: 0, inactive: 0, draft: 0, outOfStock: 0, sold: 0 };
        action.payload.listings.forEach((listing) => {
          counts.all += 1;
          if (listing.status === 'active') counts.active += 1;
          else if (listing.status === 'inactive') counts.inactive += 1;
          else if (listing.status === 'draft') counts.draft += 1;
          else if (listing.status === 'outOfStock') counts.outOfStock += 1;
          if (listing.sold > 0) counts.sold += 1;
        });
        state.statusCounts = counts;
      })
      .addCase(getSellerListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get listing by ID
    builder
      .addCase(getSellerListingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSellerListingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentListing = action.payload.listing;
        state.sellerInfo = action.payload.sellerInfo;
      })
      .addCase(getSellerListingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get listings by status
    builder
      .addCase(getSellerListingsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSellerListingsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload.listings;
        state.pagination = action.payload.pagination;
      })
      .addCase(getSellerListingsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Filter listings
    builder
      .addCase(filterSellerListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterSellerListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload.listings;
        state.pagination = action.payload.pagination;
      })
      .addCase(filterSellerListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete listing
    builder
      .addCase(deleteSellerListing.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteSellerListing.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.success = true;
        state.message = action.payload.message || 'Listing deleted successfully';
        state.listings = state.listings.filter(
          (listing) => listing._id !== action.payload.listingId
        );
        state.statusCounts.all -= 1;
        if (state.currentListing && state.currentListing._id === action.payload.listingId) {
          state.statusCounts[state.currentListing.status] -= 1;
          state.currentListing = null;
        }
      })
      .addCase(deleteSellerListing.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });

    // Update listing
    builder
      .addCase(updateSellerListing.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateSellerListing.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;
        state.message = action.payload.message || 'Listing updated successfully';
        
        const index = state.listings.findIndex(
          (listing) => listing._id === action.payload.listing._id
        );
        if (index !== -1) {
          state.listings[index] = action.payload.listing;
        }
        
        if (state.currentListing && state.currentListing._id === action.payload.listing._id) {
          state.currentListing = action.payload.listing;
        }
      })
      .addCase(updateSellerListing.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });

    // Upload image
    builder
      .addCase(uploadSellerImage.pending, (state) => {
        state.imageUploadLoading = true;
        state.error = null;
      })
      .addCase(uploadSellerImage.fulfilled, (state, action) => {
        state.imageUploadLoading = false;
        state.uploadedImageUrl = action.payload.url;
        state.uploadedImages.push({
          id: Date.now().toString(),
          url: action.payload.url,
          uploadedAt: new Date().toISOString(),
        });
        state.message = action.payload.message || 'Image uploaded successfully';
      })
      .addCase(uploadSellerImage.rejected, (state, action) => {
        state.imageUploadLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearSellerListingError,
  clearSellerListingSuccess,
  setSellerListingFilters,
  clearSellerListingFilters,
  setSellerListingPagination,
  saveDraftListing,
  clearDraftListing,
  addUploadedImage,
  removeUploadedImage,
  clearUploadedImages,
  updateListingStatus,
  resetSellerListingState,
} = sellerListingSlice.actions;

// Selectors
export const selectSellerListings = (state) => state.sellerListing.listings;
export const selectCurrentListing = (state) => state.sellerListing.currentListing;
export const selectSellerInfo = (state) => state.sellerListing.sellerInfo;
export const selectListingPagination = (state) => state.sellerListing.pagination;
export const selectListingFilters = (state) => state.sellerListing.filters;
export const selectListingStatusCounts = (state) => state.sellerListing.statusCounts;
export const selectListingLoading = (state) => state.sellerListing.loading;
export const selectListingCreateLoading = (state) => state.sellerListing.createLoading;
export const selectListingUpdateLoading = (state) => state.sellerListing.updateLoading;
export const selectListingDeleteLoading = (state) => state.sellerListing.deleteLoading;
export const selectListingError = (state) => state.sellerListing.error;
export const selectListingSuccess = (state) => state.sellerListing.success;
export const selectListingMessage = (state) => state.sellerListing.message;
export const selectUploadedImages = (state) => state.sellerListing.uploadedImages;
export const selectDraftListing = (state) => state.sellerListing.draftListing;
export const selectImageUploadLoading = (state) => state.sellerListing.imageUploadLoading;

// Computed selectors
export const selectActiveListings = (state) => 
  state.sellerListing.listings.filter(listing => listing.status === 'active');

export const selectInactiveListings = (state) => 
  state.sellerListing.listings.filter(listing => listing.status === 'inactive');

export const selectDraftListings = (state) => 
  state.sellerListing.listings.filter(listing => listing.status === 'draft');

export const selectOutOfStockListings = (state) => 
  state.sellerListing.listings.filter(listing => listing.status === 'outOfStock');

export default sellerListingSlice.reducer;