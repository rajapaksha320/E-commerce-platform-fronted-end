// services/sellerListingService.js
import axiosInstance from './axiosInstance';

const sellerListingService = {
  // Create listing
  createListing: async (listingData) => {
    return await axiosInstance.post('/api/v1/listing/create', listingData);
  },

  // Get all listings with pagination
  getAllListings: async (page = 1, pageSize = 10) => {
    return await axiosInstance.get('/api/v1/listing/all', {
      params: {
        page,
        pageSize,
      },
    });
  },

  // Get listing by ID
  getListingById: async (listingId) => {
    return await axiosInstance.get(`/api/v1/listing/one-listing/${listingId}`);
  },

  // Get listings by status
  getListingsByStatus: async (status, page = 1, pageSize = 10) => {
    return await axiosInstance.get('/api/v1/listing/listing-using-status', {
      params: {
        status,
        page,
        pageSize,
      },
    });
  },

  // Filter listings
  filterListings: async (filterParams) => {
    const { category, priceRange, page = 1, pageSize = 10, ...otherParams } = filterParams;
    
    const params = {
      page,
      pageSize,
    };

    // Add category if provided
    if (category) {
      params.category = category;
    }

    // Add price range if provided
    if (priceRange) {
      params.priceRange = priceRange;
    }

    // Add any other filter parameters
    Object.keys(otherParams).forEach((key) => {
      if (otherParams[key]) {
        params[key] = otherParams[key];
      }
    });

    return await axiosInstance.get('/api/v1/listing/listing-filter', { params });
  },

  // Delete listing
  deleteListing: async (listingId) => {
    return await axiosInstance.get(`/api/v1/listing/listing-delete/${listingId}`);
  },

  // Update listing (you'll need to add this endpoint to your backend)
  updateListing: async (listingId, updateData) => {
    return await axiosInstance.put(`/api/v1/listing/update/${listingId}`, updateData);
  },

  // Upload image for listing
  uploadImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    return await axiosInstance.post('/api/v1/store/store-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Bulk operations (you might need to add these endpoints to your backend)
  bulkUpdateStatus: async (listingIds, status) => {
    return await axiosInstance.post('/api/v1/listing/bulk-update-status', {
      listingIds,
      status,
    });
  },

  bulkDelete: async (listingIds) => {
    return await axiosInstance.post('/api/v1/listing/bulk-delete', {
      listingIds,
    });
  },

  // Get listing statistics (you might need to add this endpoint to your backend)
  getListingStats: async (listingId) => {
    return await axiosInstance.get(`/api/v1/listing/stats/${listingId}`);
  },

  // Duplicate listing (you might need to add this endpoint to your backend)
  duplicateListing: async (listingId) => {
    return await axiosInstance.post(`/api/v1/listing/duplicate/${listingId}`);
  },

  // Export listings (you might need to add this endpoint to your backend)
  exportListings: async (format = 'csv', filters = {}) => {
    return await axiosInstance.post('/api/v1/listing/export', {
      format,
      filters,
    });
  },
};

export default sellerListingService;