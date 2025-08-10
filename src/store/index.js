// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import sellerListingReducer from './slices/sellerListingSlice';
import sellerStoreReducer from './slices/sellerStoreSlice';
import { setupInterceptors } from '../services/axiosInstance';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sellerListing: sellerListingReducer,
    sellerStore: sellerStoreReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'auth/setTokens',
          'sellerListing/uploadImage/fulfilled',
          'sellerStore/uploadLogo/fulfilled',
          'sellerStore/uploadBanner/fulfilled',
        ],
      },
    }),
});

// Setup axios interceptors with store
setupInterceptors(store);

export default store;