// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import sellerReducer from './slices/sellerSlice';
import { setupInterceptors } from '../services/axiosInstance';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    seller: sellerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'auth/setTokens',
          'seller/uploadImage',
          'seller/uploadMultipleImages',
        ],
        ignoredPaths: [
          'seller.ui.pendingImageUploads',
        ],
      },
    }),
});

// Setup axios interceptors with store
setupInterceptors(store);


export default store;
