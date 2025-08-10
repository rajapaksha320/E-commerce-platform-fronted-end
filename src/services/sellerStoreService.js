// services/sellerStoreService.js
import axiosInstance from './axiosInstance';

const sellerStoreService = {
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

  // Get store profile info
  getStoreProfileInfo: async (role = 'seller') => {
    return await axiosInstance.post('/api/v1/auth/seller-store-profile-info', {
      role,
    });
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
        // These fields should not be editable by the seller
        // totalSales: updateData.totalSales,
        // totalProducts: updateData.totalProducts,
        // status: updateData.status,
        // rating: updateData.rating,
      },
    };

    // Remove undefined or null fields
    Object.keys(payload.updateData).forEach((key) => {
      if (!payload.updateData[key] || Object.keys(payload.updateData[key]).length === 0) {
        delete payload.updateData[key];
      }
    });

    return await axiosInstance.post(`/api/v1/store/update-store-profile/${storeId}`, payload);
  },

  // Upload store image (logo or banner)
  uploadStoreImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    return await axiosInstance.post('/api/v1/store/store-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get store statistics (if you have this endpoint)
  getStoreStats: async (storeId) => {
    return await axiosInstance.get(`/api/v1/store/stats/${storeId}`);
  },

  // Delete store (if needed)
  deleteStore: async (storeId) => {
    return await axiosInstance.delete(`/api/v1/store/delete/${storeId}`);
  },

  // Suspend/Activate store (if needed)
  updateStoreStatus: async (storeId, status) => {
    return await axiosInstance.patch(`/api/v1/store/status/${storeId}`, {
      status,
    });
  },

  // Get store reviews (if you have this endpoint)
  getStoreReviews: async (storeId, page = 1, pageSize = 10) => {
    return await axiosInstance.get(`/api/v1/store/reviews/${storeId}`, {
      params: {
        page,
        pageSize,
      },
    });
  },

  // Get store orders (if you have this endpoint)
  getStoreOrders: async (storeId, filters = {}) => {
    return await axiosInstance.get(`/api/v1/store/orders/${storeId}`, {
      params: filters,
    });
  },

  // Get store analytics (if you have this endpoint)
  getStoreAnalytics: async (storeId, dateRange = '30days') => {
    return await axiosInstance.get(`/api/v1/store/analytics/${storeId}`, {
      params: {
        dateRange,
      },
    });
  },

  // Verify store (if you have this endpoint)
  requestStoreVerification: async (storeId, verificationData) => {
    return await axiosInstance.post(`/api/v1/store/verify/${storeId}`, verificationData);
  },
};

export default sellerStoreService;