// services/sellerService.js
import axiosInstance from './axiosInstance';

const sellerService = {
  // Listing Management APIs

  /**
   * Create a new listing
   * @param {Object} listingData - The listing data
   */
  createListing: async (listingData) => {
    return await axiosInstance.post('/api/v1/listing/create', listingData);
  },

  /**
   * Update an existing listing
   * @param {string} listingId - The listing ID (_id)
   * @param {Object} updateData - The data to update
   */
  updateListing: async (listingId, updateData) => {
    // Using the correct endpoint as per your API documentation
    return await axiosInstance.post(`/api/v1/store/update-store-profile/${listingId}`, updateData);
  },


  /**
   * Get all listings with pagination
   * @param {number} page - Page number
   * @param {number} pageSize - Items per page
   */
  getAllListings: async (page = 1, pageSize = 10) => {
    return await axiosInstance.get('/api/v1/listing/all', {
      params: { page, pageSize }
    });
  },

  /**
   * Get a single listing by ID
   * @param {string} listingId - The listing ID (_id)
   */
  getListingById: async (listingId) => {
    return await axiosInstance.get(`/api/v1/listing/one-listing/${listingId}`);
  },

  /**
   * Get listings filtered by status
   * @param {string} status - Status filter (active, inactive, draft, outOfStock, sold)
   * @param {number} page - Page number
   * @param {number} pageSize - Items per page
   */
  getListingsByStatus: async (status, page = 1, pageSize = 10) => {
    return await axiosInstance.get('/api/v1/listing/listing-using-status', {
      params: { status, page, pageSize }
    });
  },

  /**
   * Delete a listing
   * @param {string} listingId - The listing ID (_id)
   */
  deleteListing: async (listingId) => {
    return await axiosInstance.get(`/api/v1/listing/listing-delete/${listingId}`);
  },

  /**
   * Filter listings with multiple criteria
   * @param {Object} filters - Filter object
   * @param {string} filters.category - Category filter
   * @param {string} filters.priceRange - Price range (e.g., "20-30")
   * @param {string} filters.search - Search term
   * @param {number} filters.page - Page number
   * @param {number} filters.pageSize - Items per page
   */
  filterListings: async (filters) => {
    const params = {};

    if (filters.category) params.category = filters.category;
    if (filters.priceRange) params.priceRange = filters.priceRange;
    if (filters.search) params.search = filters.search;
    params.page = filters.page || 1;
    params.pageSize = filters.pageSize || 10;

    return await axiosInstance.get('/api/v1/listing/listing-filter', { params });
  },

  // Store/Shop Management APIs

  /**
   * Create a store profile
   * @param {Object} storeData - Store profile data
   */
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

  /**
   * Update store profile
   * @param {string} storeId - Store ID (_id)
   * @param {Object} updateData - Data to update
   */
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

  /**
   * Get store profiles for the seller
   */
  getStoreProfiles: async () => {
    const payload = { role: 'seller' };
    return await axiosInstance.post('/api/v1/auth/seller-store-profile-info', payload);
  },

  // Image Upload API

  /**
   * Upload an image
   * @param {File} imageFile - The image file to upload
   */
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

  /**
   * Upload multiple images
   * @param {File[]} imageFiles - Array of image files
   */
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

  /**
   * Get listing statistics for dashboard
   */
  getListingStatistics: async () => {
    try {
      // Fetch all statuses in parallel
      const [active, inactive, draft, outOfStock, sold] = await Promise.all([
        axiosInstance.get('/api/v1/listing/listing-using-status', {
          params: { status: 'active', page: 1, pageSize: 1 }
        }),
        axiosInstance.get('/api/v1/listing/listing-using-status', {
          params: { status: 'inactive', page: 1, pageSize: 1 }
        }),
        axiosInstance.get('/api/v1/listing/listing-using-status', {
          params: { status: 'draft', page: 1, pageSize: 1 }
        }),
        axiosInstance.get('/api/v1/listing/listing-using-status', {
          params: { status: 'outOfStock', page: 1, pageSize: 1 }
        }),
        axiosInstance.get('/api/v1/listing/listing-using-status', {
          params: { status: 'sold', page: 1, pageSize: 1 }
        }),
      ]);

      return {
        data: {
          active: active.data.pagination.total,
          inactive: inactive.data.pagination.total,
          draft: draft.data.pagination.total,
          outOfStock: outOfStock.data.pagination.total,
          sold: sold.data.pagination.total,
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

  /**
   * Search listings by keyword
   * @param {string} searchTerm - Search keyword
   * @param {number} page - Page number
   * @param {number} pageSize - Items per page
   */
  searchListings: async (searchTerm, page = 1, pageSize = 10) => {
    return await axiosInstance.get('/api/v1/listing/listing-filter', {
      params: {
        search: searchTerm,
        page,
        pageSize,
      }
    });
  },

  /**
   * Advanced search with multiple filters
   * @param {Object} searchParams - Advanced search parameters
   */
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

  /**
   * Validate listing data before submission
   * @param {Object} listingData - Listing data to validate
   */
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

  /**
   * Format listing data for API submission
   * @param {Object} rawData - Raw listing data from form
   */
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

  /**
   * Format store data for API submission
   * @param {Object} rawData - Raw store data from form
   */
  formatStoreData: (rawData) => {
    if (rawData.updateData) {
      // Format for update
      return rawData;
    }

    // Format for create
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
};

export default sellerService;