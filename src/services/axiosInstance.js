// services/axiosInstance.js
import axios from 'axios';
import { refreshAccessToken, logout } from '../store/slices/authSlice';
import { getCookie } from '../utils/cookieManager';
import baseURLConfig from '../config/baseURLConfig';




// Create axios instance
const axiosInstance = axios.create({
  baseURL: baseURLConfig,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Variable to store the store instance
let store;

// Function to set the store
export const setupInterceptors = (storeInstance) => {
  store = storeInstance;
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If the error is due to an expired token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getCookie('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Dispatch refresh token action
        await store.dispatch(refreshAccessToken()).unwrap();
        
        const newAccessToken = localStorage.getItem('accessToken');
        processQueue(null, newAccessToken);
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        
        // Redirect to login or show login modal
        window.location.href = '/';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;