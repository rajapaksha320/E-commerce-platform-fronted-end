// services/sellerService.js
import axiosInstance from './axiosInstance';

const sellerService = {
  
  // Create a new listing
  createListing: async (listingData) => {
    return await axiosInstance.post('/api/v1/listing/create', listingData);
  },

  // Update an existing listing
  updateListing: async (listingId, updateData) => {
    return await axiosInstance.post(`/api/v1/listing/update/${listingId}`, updateData);
  },

  // Get all listings with pagination and filtering
  getAllListings: async (page = 1, pageSize = 10) => {
    try {
      const response = await axiosInstance.get('/api/v1/listing/all', {
        params: { page, pageSize }
      });

      // Check if the response indicates no listings found
      if (response.data.message === "No listings found with the specified filters" || 
          response.data.message === "No listings found") {
        return {
          data: {
            listings: [],
            pagination: {
              total: 0,
              page: page,
              pageSize: pageSize,
              totalPages: 0
            },
            message: response.data.message,
            isEmpty: true
          }
        };
      }

      return response;
    } catch (error) {
      // If it's a 404 or empty result, normalize the response
      if (error.response?.status === 404 || 
          error.response?.data?.message?.includes("No listings found")) {
        return {
          data: {
            listings: [],
            pagination: {
              total: 0,
              page: page,
              pageSize: pageSize,
              totalPages: 0
            },
            message: error.response?.data?.message || "No listings found",
            isEmpty: true
          }
        };
      }
      throw error;
    }
  },

  // Get a single listing by ID
  getListingById: async (listingId) => {
    return await axiosInstance.get(`/api/v1/listing/one-listing/${listingId}`);
  },

// Get listings by status with pagination
  getListingsByStatus: async (status, page = 1, pageSize = 10) => {
    try {
      const response = await axiosInstance.get('/api/v1/listing/listing-filter', {
        params: { status, page, pageSize }
      });

      // Check if the response indicates no listings found
      if (response.data.message === "No listings found with the specified filters") {
        return {
          data: {
            listings: [],
            pagination: {
              total: 0,
              page: page,
              pageSize: pageSize,
              totalPages: 0
            },
            message: response.data.message,
            isEmpty: true
          }
        };
      }

      return response;
    } catch (error) {
      // If it's a 404 or empty result, normalize the response
      if (error.response?.status === 404 || 
          error.response?.data?.message?.includes("No listings found")) {
        return {
          data: {
            listings: [],
            pagination: {
              total: 0,
              page: page,
              pageSize: pageSize,
              totalPages: 0
            },
            message: error.response?.data?.message || "No listings found",
            isEmpty: true
          }
        };
      }
      throw error;
    }
  },

  // Delete a listing by ID
  deleteListing: async (listingId) => {
    return await axiosInstance.get(`/api/v1/listing/listing-delete/${listingId}`);
  },

  // Filter listings with various criteria
  filterListings: async (filters) => {
    try {
      const params = {};

      if (filters.category) params.category = filters.category;
      if (filters.priceRange) params.priceRange = filters.priceRange;
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
      if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
      params.page = filters.page || 1;
      params.pageSize = filters.pageSize || 10;

      const response = await axiosInstance.get('/api/v1/listing/listing-filter', { params });

      // Check if the response indicates no listings found
      if (response.data.message === "No listings found with the specified filters") {
        return {
          data: {
            listings: [],
            pagination: {
              total: 0,
              page: params.page,
              pageSize: params.pageSize,
              totalPages: 0
            },
            message: response.data.message,
            isEmpty: true
          }
        };
      }

      return response;
    } catch (error) {
      // If it's a 404 or empty result, normalize the response
      if (error.response?.status === 404 || 
          error.response?.data?.message?.includes("No listings found")) {
        return {
          data: {
            listings: [],
            pagination: {
              total: 0,
              page: filters.page || 1,
              pageSize: filters.pageSize || 10,
              totalPages: 0
            },
            message: error.response?.data?.message || "No listings found",
            isEmpty: true
          }
        };
      }
      throw error;
    }
  },

  // Store/Shop Management APIs

  // Create store profile
  createStoreProfile: async (storeData) => {
    const payload = {
      storeName: storeData.storeName,
      storeTagLine: storeData.storeTagLine,
      storeDescription: storeData.storeDescription,
      storeLocation: storeData.storeLocation,
      storeContactNumber: storeData.storeContactNumber,
      storeEmail: storeData.storeEmail,
      storeWebsite: storeData.storeWebsite,
      storeBusinessHours: storeData.storeBusinessHours,
      storeLogo: storeData.storeLogo,
      bannerImage: storeData.bannerImage,
      status: storeData.status || 'active',
    };

    return await axiosInstance.post('/api/v1/store/create-store-profile', payload);
  },

  // Update store profile
  updateStoreProfile: async (storeId, updateData) => {
    const payload = {
      updateData: {
        basicInformation: updateData.basicInformation || {
          storeName: updateData.storeName,
          storeTagLine: updateData.storeTagLine,
          storeDescription: updateData.storeDescription,
        },
        contactDetails: updateData.contactDetails || {
          storeLocation: updateData.storeLocation,
          storeContactNumber: updateData.storeContactNumber,
          storeEmail: updateData.storeEmail,
          storeWebsite: updateData.storeWebsite,
          storeBusinessHours: updateData.storeBusinessHours,
        },
        shopMedia: updateData.shopMedia || {
          storeLogo: updateData.storeLogo,
          bannerImage: updateData.bannerImage,
        },
        status: updateData.status,
      }
    };

    // Remove undefined fields
    Object.keys(payload.updateData).forEach(key => {
      if (payload.updateData[key] === undefined) {
        delete payload.updateData[key];
      }
    });

    return await axiosInstance.post(`/api/v1/store/update-store-profile/${storeId}`, payload);
  },

  // Get store profile information
  getStoreProfiles: async () => {
    const payload = { role: 'seller' };
    return await axiosInstance.post('/api/v1/auth/seller-store-profile-info', payload);
  },

  // Image Upload API

  // Upload a single image
  uploadImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    return await axiosInstance.post('/api/v1/store/store-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Batch Operations

  // Upload multiple images
  uploadMultipleImages: async (imageFiles) => {
    const uploadPromises = imageFiles.map(file => {
      const formData = new FormData();
      formData.append('image', file);

      return axiosInstance.post('/api/v1/store/store-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    });

    const results = await Promise.allSettled(uploadPromises);

    return results.map((result, index) => ({
      status: result.status,
      data: result.status === 'fulfilled' ? result.value.data : null,
      error: result.status === 'rejected' ? result.reason : null,
      file: imageFiles[index].name,
    }));
  },


  // Get listing statistics for dashboard
  getListingStatistics: async () => {
    try {
      const [active, inactive, draft, outOfStock, sold] = await Promise.all([
        axiosInstance.get('/api/v1/listing/listing-filter', {
          params: { status: 'active', page: 1, pageSize: 1 }
        }),
        axiosInstance.get('/api/v1/listing/listing-filter', {
          params: { status: 'inactive', page: 1, pageSize: 1 }
        }),
        axiosInstance.get('/api/v1/listing/listing-filter', {
          params: { status: 'draft', page: 1, pageSize: 1 }
        }),
        axiosInstance.get('/api/v1/listing/listing-filter', {
          params: { status: 'outOfStock', page: 1, pageSize: 1 }
        }),
        axiosInstance.get('/api/v1/listing/listing-filter', {
          params: { status: 'sold', page: 1, pageSize: 1 }
        }),
      ]);

      return {
        data: {
          active: active.data.pagination?.total || 0,
          inactive: inactive.data.pagination?.total || 0,
          draft: draft.data.pagination?.total || 0,
          outOfStock: outOfStock.data.pagination?.total || 0,
          sold: sold.data.pagination?.total || 0,
        }
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return {
        data: {
          active: 0,
          inactive: 0,
          draft: 0,
          outOfStock: 0,
          sold: 0,
        }
      };
    }
  },

  // Search Operations


  // Search listings by keyword using the filter API
  searchListings: async (searchTerm, page = 1, pageSize = 10) => {
    return await axiosInstance.get('/api/v1/listing/listing-filter', {
      params: {
        search: searchTerm,
        page,
        pageSize,
      }
    });
  },

  // Advanced search with multiple filters
  advancedSearchListings: async (searchParams) => {
    const {
      keyword,
      category,
      subCategory,
      minPrice,
      maxPrice,
      brand,
      status,
      tags,
      sortBy,
      sortOrder,
      page = 1,
      pageSize = 10,
    } = searchParams;

    const params = {
      page,
      pageSize,
    };

    if (keyword) params.search = keyword;
    if (category) params.category = category;
    if (subCategory) params.subCategory = subCategory;
    if (minPrice !== undefined && maxPrice !== undefined) {
      params.priceRange = `${minPrice}-${maxPrice}`;
    }
    if (brand) params.brand = brand;
    if (status) params.status = status;
    if (tags && tags.length > 0) params.tags = tags.join(',');
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;

    return await axiosInstance.get('/api/v1/listing/listing-filter', { params });
  },

  // Utility Functions

  // Validate listing data before submission
  validateListingData: (listingData) => {
    const errors = {};

    // Required fields validation
    if (!listingData.title) errors.title = 'Title is required';
    if (!listingData.category?.main) errors.category = 'Category is required';
    if (!listingData.description) errors.description = 'Description is required';

    // Variations validation
    if (listingData.hasVariations && (!listingData.variations || listingData.variations.length === 0)) {
      errors.variations = 'At least one variation is required';
    }

    if (listingData.variations) {
      listingData.variations.forEach((variation, index) => {
        if (!variation.price || variation.price <= 0) {
          errors[`variation_${index}_price`] = 'Valid price is required';
        }
        if (!variation.quantity || variation.quantity < 0) {
          errors[`variation_${index}_quantity`] = 'Valid quantity is required';
        }
        if (!variation.sku) {
          errors[`variation_${index}_sku`] = 'SKU is required';
        }
      });
    }

    // Images validation
    if (!listingData.images || listingData.images.length === 0) {
      errors.images = 'At least one image is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // Format listing data for API submission
  formatListingData: (rawData) => {
    return {
      id: rawData.sku || Date.now().toString(),
      title: rawData.title,
      brand: rawData.brand,
      category: {
        main: rawData.mainCategory,
        sub: rawData.subCategory,
      },
      description: rawData.description,
      weight: rawData.weight?.toString(),
      dimensions: {
        length: rawData.length?.toString(),
        width: rawData.width?.toString(),
        height: rawData.height?.toString(),
      },
      images: rawData.images || [],
      productTags: rawData.tags || [],
      hasVariations: rawData.hasVariations || false,
      variations: rawData.variations || [],
      shippingClass: {
        id: rawData.shippingId || `ship_${Date.now()}`,
        shippingWeight: rawData.shippingWeight?.toString(),
        shippingClass: rawData.shippingClass || 'standard',
        returnPolicy: rawData.returnPolicy?.toString(),
        warranty: rawData.warranty,
      },
      status: rawData.status || 'inactive',
      createdAt: rawData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  // Format store data for API submission
  formatStoreData: (rawData) => {
    if (rawData.updateData) {
      return rawData;
    }

    return {
      storeName: rawData.storeName,
      storeTagLine: rawData.storeTagLine,
      storeDescription: rawData.storeDescription,
      storeLocation: rawData.storeLocation,
      storeContactNumber: parseInt(rawData.storeContactNumber) || 0,
      storeEmail: rawData.storeEmail,
      storeWebsite: rawData.storeWebsite,
      storeBusinessHours: rawData.storeBusinessHours,
      storeLogo: rawData.storeLogo,
      bannerImage: rawData.bannerImage,
      status: rawData.status || 'active',
    };
  },

  // Status mapping utilities
  /**
   * Map frontend status to backend status
   * @param {string} frontendStatus - Frontend status
   * @returns {string} - Backend status
   */
  mapFrontendToBackendStatus: (frontendStatus) => {
    const statusMap = {
      'active': 'active',
      'paused': 'inactive',
      'inactive': 'inactive',
      'draft': 'draft',
      'out-of-stock': 'outOfStock',
      'outOfStock': 'outOfStock',
      'sold': 'sold'
    };
    return statusMap[frontendStatus] || frontendStatus;
  },

  /**
   * Map backend status to frontend status
   * @param {string} backendStatus - Backend status
   * @returns {string} - Frontend status
   */
  mapBackendToFrontendStatus: (backendStatus) => {
    const statusMap = {
      'active': 'active',
      'inactive': 'inactive',
      'draft': 'draft',
      'outOfStock': 'out-of-stock',
      'sold': 'sold'
    };
    return statusMap[backendStatus] || backendStatus;
  },
};

export default sellerService;