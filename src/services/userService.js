/* eslint-disable no-unused-vars */
import axiosInstance from "./axiosInstance";

const userService = {
  // STORE SERVICES

  // Get all stores
  getAllStores: async (page = 1, pageSize = 10) => {
    return await axiosInstance.get(
      `/api/v1/store/get-all-store?page=${page}&pageSize=${pageSize}`
    );
  },

  // Filter stores by category
  filterStoresByCategory: async (categoryMain, page = 1, pageSize = 10) => {
    return await axiosInstance.get(
      `/api/v1/store/filter-category?categoryMain=${categoryMain}&page=${page}&pageSize=${pageSize}`
    );
  },

  // Get shop listings by seller ID
  getShopListings: async (sellerId, page = 1, pageSize = 10) => {
    return await axiosInstance.get(
      `/api/v1/store/get-each-shop-listing?sellerId=${sellerId}&page=${page}&pageSize=${pageSize}`
    );
  },

  // Get shop details by ID
  getShopDetailsById: async (shopId) => {
    return await axiosInstance.get(`/api/v1/store/get-store-by-id/${shopId}`);
  },

  // LISTING SERVICES

  // Get listing by ID with seller info
  getListingById: async (listingId) => {
    return await axiosInstance.get(`/api/v1/listing/one-listing/${listingId}`);
  },

  // CART SERVICES

  // Add item to cart
  addToCart: async ({ buyerId, listingId, quantity }) => {
    const payload = {
      buyerId,
      listingId,
      quantity,
    };
    return await axiosInstance.post("/api/v1/cart/add/", payload);
  },

  // Get cart items for a buyer
  getCartItems: async (buyerId, page = 1, size = 10) => {
    return await axiosInstance.get(
      `/api/v1/cart/user/${buyerId}?page=${page}&size=${size}`
    );
  },

  // Update cart item quantity
  updateCartItem: async ({ cartItemId, quantity }) => {
    const payload = {
      cartItemId,
      quantity,
    };
    return await axiosInstance.post("/api/v1/cart/update", payload);
  },

  // Delete cart item
  deleteCartItem: async (cartItemId) => {
    return await axiosInstance.delete(`/api/v1/cart/delete-cart/${cartItemId}`);
  },

  // WISHLIST SERVICES

  // Get user wishlist
  getWishlist: async (userId) => {
    return await axiosInstance.get(
      `/api/v1/auth/get-user-watch-list/${userId}`
    );
  },

  // Update wishlist (add items)
  updateWishlist: async ({ productWishlist = [], shopWishlist = [] }) => {
    const payload = {
      productWishlist,
      shopWishlist,
    };
    return await axiosInstance.post("/api/v1/auth/update-watch-list", payload);
  },

  // Delete item from wishlist
  deleteWishlistItem: async (userId, itemId) => {
    return await axiosInstance.delete(
      `/api/v1/auth/delete-watchlist/${userId}/${itemId}`
    );
  },

  // ORDER SERVICES

  // Place an order
  placeOrder: async (orderData) => {
    const payload = {
      buyerId: orderData.buyerId,
      listingIds: orderData.listingIds,
      storeIds: orderData.storeIds,
      sellerIds: orderData.sellerIds,
      shippingAddress: orderData.shippingAddress,
      shippingOption: orderData.shippingOption,
      totalAmount: orderData.totalAmount,
    };
    return await axiosInstance.post("/api/v1/order/place-order", payload);
  },

  // Get buyer orders
  getBuyerOrders: async (buyerId, page = 1, size = 10) => {
    return await axiosInstance.get(
      `/api/v1/order/buyer-orders/${buyerId}?page=${page}&size=${size}`
    );
  },

  // Add review for order
  addReview: async (reviewData) => {
    const payload = {
      buyerId: reviewData.buyerId,
      shopId: reviewData.shopId,
      listingId: reviewData.listingId,
      orderId: reviewData.orderId,
      review: reviewData.review,
      shoppingExperience: reviewData.shoppingExperience,
      customerService: reviewData.customerService,
      productQuality: reviewData.productQuality,
      deliverySpeed: reviewData.deliverySpeed,
    };
    return await axiosInstance.post("/api/v1/order/review-ratings", payload);
  },

  // Get shop reviews
  getShopReviews: async (shopId, page = 1, size = 10) => {
    return await axiosInstance.get(
      `/api/v1/order/get-shop-reviews/${shopId}?page=${page}&size=${size}`
    );
  },

  // ADDRESS SERVICES

  // Get buyer addresses
  getBuyerAddresses: async (buyerId) => {
    return await axiosInstance.get(`/api/v1/order/buyer-address/${buyerId}`);
  },

  // Create new address
  createAddress: async (addressData) => {
    const payload = {
      buyerId: addressData.buyerId,
      addressType: addressData.addressType,
      firstName: addressData.firstName,
      lastName: addressData.lastName,
      streetAddress: addressData.streetAddress,
      apartment: addressData.apartment,
      city: addressData.city,
      state: addressData.state,
      zipCode: addressData.zipCode,
      phoneNumber: addressData.phoneNumber,
      isDefault: addressData.isDefault,
    };
    return await axiosInstance.post(
      "/api/v1/order/create-buyer-address",
      payload
    );
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    const payload = {
      addressType: addressData.addressType,
      firstName: addressData.firstName,
      lastName: addressData.lastName,
      streetAddress: addressData.streetAddress,
      apartment: addressData.apartment,
      city: addressData.city,
      state: addressData.state,
      zipCode: addressData.zipCode,
      phoneNumber: addressData.phoneNumber,
      isDefault: addressData.isDefault,
    };
    return await axiosInstance.put(
      `/api/v1/order/update-buyer-address/${addressId}`,
      payload
    );
  },

  // Delete address
  deleteAddress: async (addressId) => {
    return await axiosInstance.delete(
      `/api/v1/order/delete-buyer-address/${addressId}`
    );
  },

  // PROFILE SERVICES

  // Update user profile
  updateUserProfile: async (profileData) => {
    const payload = {
      userId: profileData.userId,
      firstName: profileData.firstName, // Added
      lastName: profileData.lastName, // Added
      phoneNumber: profileData.phoneNumber,
      dateOfBirth: profileData.dateOfBirth,
      gender: profileData.gender,
      bio: profileData.bio,
      isActive: profileData.isActive,
    };
    return await axiosInstance.post(
      "/api/v1/auth/update-buyer-profile",
      payload
    );
  },

  // Delete user account
  deleteUserAccount: async (userId) => {
    return await axiosInstance.delete(
      `/api/v1/auth/delete-buyer-profile/${userId}`
    );
  },

  // GET USER PROFILE SERVICE

  // Get user profile
  getUserProfile: async (userId) => {
    return await axiosInstance.get(`/api/v1/auth/get-buyer-profile/${userId}`);
  },

  // SEARCH & FILTER SERVICES

  // Main search/filter across all stores
  searchProducts: async (searchParams, page = 1, pageSize = 10) => {
    const payload = {
      categoryMain: searchParams.categoryMain,
      PriceRange: searchParams.PriceRange,
      CustomerRating: searchParams.CustomerRating,
      color: searchParams.color,
      brandName: searchParams.brandName,
      page,
      pageSize,
    };

    return await axiosInstance.post(
      `/api/v1/category/main-filter?&page=${page}&pageSize=${pageSize}`,
      payload
    );
  },

  // Search products in a specific store
  searchStoreProducts: async (
    sellerId,
    searchParams,
    page = 1,
    pageSize = 10
  ) => {
    const payload = {
      categoryMain: searchParams.categoryMain,
      PriceRange: searchParams.PriceRange,
      CustomerRating: searchParams.CustomerRating,
      color: searchParams.color,
      brandName: searchParams.brandName,
      page,
      pageSize,
    };

    return await axiosInstance.post(
      `/api/v1/category/main-filter?sellerId=${sellerId}&page=${page}&pageSize=${pageSize}`,
      payload
    );
  },

  // SEARCH AND FILTER HELPERS

  // Search stores by name or location
  searchStores: async (query, page = 1, pageSize = 10) => {
    return await axiosInstance.get(
      `/api/v1/store/search?q=${encodeURIComponent(
        query
      )}&page=${page}&pageSize=${pageSize}`
    );
  },

  // Get store by ID
  getStoreById: async (storeId) => {
    return await axiosInstance.get(`/api/v1/store/${storeId}`);
  },

  // ANALYTICS HELPERS (if needed)

  // Get popular stores
  getPopularStores: async (limit = 10) => {
    return await axiosInstance.get(`/api/v1/store/popular?limit=${limit}`);
  },

  // Get trending products
  getTrendingProducts: async (limit = 10) => {
    return await axiosInstance.get(`/api/v1/products/trending?limit=${limit}`);
  },

  // Get recommended products based on user activity
  getRecommendedProducts: async (userId, limit = 10) => {
    return await axiosInstance.get(
      `/api/v1/products/recommended/${userId}?limit=${limit}`
    );
  },

  // QUICK ACTIONS

  // Quick add to cart and wishlist
  quickAddToCart: async (buyerId, listingId, quantity = 1) => {
    return userService.addToCart({ buyerId, listingId, quantity });
  },

  // Quick add to wishlist
  quickAddToWishlist: async (productIds = [], shopIds = []) => {
    return userService.updateWishlist({
      productWishlist: productIds,
      shopWishlist: shopIds,
    });
  },

  // Get cart summary
  getCartSummary: async (buyerId) => {
    const response = await userService.getCartItems(buyerId, 1, 100); // Get all items
    const cartItems = response.data.cartData || [];

    const summary = {
      totalItems: cartItems.length,
      totalAmount: cartItems.reduce((total, item) => {
        const price = parseFloat(item.listing?.variations?.[0]?.price || 0);
        return total + price * item.quantity;
      }, 0),
      items: cartItems,
    };

    return { data: summary };
  },

  // Bulk cart operations
  clearCart: async (buyerId) => {
    const cartResponse = await userService.getCartItems(buyerId);
    const cartItems = cartResponse.data.cartData || [];

    const deletePromises = cartItems.map((item) =>
      userService.deleteCartItem(item._id)
    );

    return await Promise.all(deletePromises);
  },

  // Move item from cart to wishlist
  moveToWishlist: async (cartItemId, productId) => {
    // Delete from cart
    await userService.deleteCartItem(cartItemId);

    // Add to wishlist
    return await userService.updateWishlist({
      productWishlist: [productId],
      shopWishlist: [],
    });
  },

  // Check if item is in wishlist
  isInWishlist: async (userId, itemId, itemType = "product") => {
    try {
      const response = await userService.getWishlist(userId);
      const wishlist = response.data.wishlistDetails;

      if (itemType === "product") {
        return wishlist.productWishlists.some((list) =>
          list.items.some((item) => item._id === itemId)
        );
      } else {
        return wishlist.shopWishlists.some((list) =>
          list.items.some((item) => item._id === itemId)
        );
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
      return false;
    }
  },

  // Validate order before placement
  validateOrder: async (orderData) => {
    // Check if all items are still available
    const listingChecks = orderData.listingIds.map((listingId) =>
      userService.getListingById(listingId)
    );

    try {
      const listings = await Promise.all(listingChecks);
      const validation = {
        isValid: true,
        errors: [],
        unavailableItems: [],
      };

      listings.forEach((response, index) => {
        const listing = response.data.listing;
        if (listing.status !== "active") {
          validation.isValid = false;
          validation.unavailableItems.push(listing._id);
          validation.errors.push(
            `Item ${listing.title} is no longer available`
          );
        }
      });

      return { data: validation };
    } catch (error) {
      return {
        data: {
          isValid: false,
          errors: ["Unable to validate order items"],
          unavailableItems: [],
        },
      };
    }
  },
};

export default userService;
