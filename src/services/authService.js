// services/authService.js
import axiosInstance from './axiosInstance';
import { getCookie } from '../utils/cookieManager';

const authService = {
  // User signup
  signup: async (userData) => {
    const payload = {
      tenantId: userData.tenantId || generateTenantId(),
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      agreeTerms: userData.agreeTerms,
      emailVerified: false,
    };
    
    return await axiosInstance.post('/api/v1/auth/signup', payload);
  },

  // Seller registration
  sellerRegistration: async (sellerData) => {
    const payload = {
      firstName: sellerData.firstName,
      lastName: sellerData.lastName,
      email: sellerData.email,
      password: sellerData.password,
      confirmPassword: sellerData.confirmPassword,
      userRole: 'seller',
      businessInfo: {
        website: sellerData.website || '',
        taxIdOrEIN: sellerData.taxId,
        businessType: sellerData.businessType,
        businessName: sellerData.businessName,
      },
      contactInfo: {
        streetAddress: sellerData.street,
        city: sellerData.city,
        state: sellerData.state,
        zipCode: sellerData.zipCode,
        country: sellerData.countryCode,
        phoneNumber: sellerData.phoneCountry && sellerData.phone 
          ? `${getDialCode(sellerData.phoneCountry)}-${sellerData.phone}` 
          : sellerData.phone,
      },
    };
    
    return await axiosInstance.post('/api/v1/auth/seller-registration', payload);
  },

  // Login
  login: async (credentials) => {
    const payload = {
      email: credentials.email,
      password: credentials.password,
    };
    
    console.log('Login attempt with payload:', payload);
    console.log('Making API call to:', '/api/v1/auth/login');
    
    try {
      const response = await axiosInstance.post('/api/v1/auth/login', payload);
      console.log('Login response:', response);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    const payload = { email };
    return await axiosInstance.post('/api/v1/auth/forgot-password', payload);
  },

  // Verify OTP
  verifyOTP: async ({ email, otp }) => {
    const payload = { email, otp };
    return await axiosInstance.post('/api/v1/auth/verify-otp', payload);
  },

  // Reset password
  resetPassword: async ({ email, newPassword, confirmPassword }) => {
    const payload = {
      email,
      newPassword,
      confirmPassword,
    };
    
    return await axiosInstance.post('/api/v1/auth/reset-password', payload);
  },

  // Refresh token
  refreshToken: async () => {
    const refreshToken = getCookie('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const payload = { refreshToken };
    return await axiosInstance.post('/api/v1/auth/refresh-token', payload);
  },
};

// Helper function to generate tenant id
function generateTenantId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let tenantId = '';
  for (let i = 0; i < 11; i++) {
    tenantId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return tenantId;
}

// Helper function to get dial code from country code
function getDialCode(countryCode) {
  const dialCodes = {
    US: '+1',
    GB: '+44',
    CA: '+1',
    AU: '+61',
    IN: '+91',
  };
  return dialCodes[countryCode] || '+1';
}

export default authService;