import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import sellerReducer from "./slices/sellerListingSlice";
import sellerOrderReducer from "./slices/sellerOrderSlice"; // Add this import
import userReducer from "./slices/userSlice";
import { setupInterceptors } from "../services/axiosInstance";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    seller: sellerReducer,
    sellerOrder: sellerOrderReducer, // Add this line
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "auth/setTokens",
          "seller/uploadImage",
          "seller/uploadMultipleImages",
          // Seller order actions
          "sellerOrder/fetchSellerOrders",
          "sellerOrder/updateOrderStatus",
          "sellerOrder/bulkUpdateOrderStatus",
          "sellerOrder/fetchOrdersByStatus",
          "sellerOrder/searchOrders",
          // User-related actions
          "user/addToCart/fulfilled",
          "user/updateCartItem/fulfilled",
          "user/updateWishlist/fulfilled",
          "user/placeOrder/fulfilled",
        ],
        ignoredPaths: [
          "seller.ui.pendingImageUploads",
          // Seller order paths
          "sellerOrder.orders",
          "sellerOrder.ui",
          "sellerOrder.cache",
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
