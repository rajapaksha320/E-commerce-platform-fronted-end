import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import sellerReducer from "./slices/sellerListingSlice";
import userReducer from "./slices/userSlice";
import { setupInterceptors } from "../services/axiosInstance";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    seller: sellerReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "auth/setTokens",
          "seller/uploadImage",
          "seller/uploadMultipleImages",
          // User-related actions 
          "user/addToCart/fulfilled",
          "user/updateCartItem/fulfilled",
          "user/updateWishlist/fulfilled",
          "user/placeOrder/fulfilled",
        ],
        ignoredPaths: [
          "seller.ui.pendingImageUploads",
          // User-related paths
          "user.cartItems",
          "user.wishlist",
          "user.orders",
        ],
      },
    }),
});

// Setup axios interceptors with store
setupInterceptors(store);

export default store;
