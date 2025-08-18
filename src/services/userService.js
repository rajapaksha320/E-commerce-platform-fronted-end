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

  // ✅ ENHANCED: Get cart items - now returns enhanced data with store and listing info
  getCartItems: async (buyerId, page = 1, size = 10) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/cart/user/${buyerId}?page=${page}&size=${size}`
      );

      console.log("Cart API Response:", response.data);

      // The API now returns enhanced data with listing and store objects
      // No additional processing needed as the API provides complete data
      return response;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      throw error;
    }
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

  // ✅ NEW: Get detailed cart information for checkout with enhanced processing
  getCartForCheckout: async (buyerId) => {
    try {
      const response = await userService.getCartItems(buyerId, 1, 100);

      if (!response.data.cartData) {
        return { data: { items: [], summary: { total: 0, itemCount: 0 } } };
      }

      const items = response.data.cartData.map((item) => {
        const listing = item.listing;
        const store = item.store;
        const variation =
          listing?.variations?.find((v) => v.isDefault) ||
          listing?.variations?.[0];

        return {
          ...item,
          // ✅ Enhanced: Extract all required data from the API response

          // Normalize pricing from variations
          price: parseFloat(variation?.price || listing?.price || 0),
          originalPrice: parseFloat(
            variation?.originalPrice ||
              listing?.originalPrice ||
              variation?.price ||
              0
          ),

          // Extract store information
          storeId: store?._id || store?.storeId,
          sellerId: store?.sellerId || listing?.sellerDetails,
          storeName: store?.basicInformation?.storeName || "Unknown Store",
          storeLocation: store?.contactDetails?.storeLocation,
          storeRating: store?.rating || 0,

          // Extract listing information
          listingId: item.listingId || listing?._id,
          productName: listing?.title || listing?.name || "Unknown Product",
          productBrand: listing?.brand || listing?.brandName || "Unknown Brand",
          productImage:
            listing?.images?.find((img) => img.isPrimary)?.url ||
            listing?.images?.[0]?.url ||
            variation?.images?.[0]?.url,

          // Stock and availability
          inStock:
            listing?.status === "active" &&
            parseInt(variation?.quantity || 0) > 0,
          availableStock: parseInt(variation?.quantity || 0),
          productStatus: listing?.status || "unknown",

          // Product metadata
          category: listing?.category,
          productTags: listing?.productTags || [],
          hasVariations: listing?.hasVariations || false,

          // Shipping information
          shippingClass: listing?.shippingClass,
          freeShipping: listing?.shippingClass?.shippingClass === "standard",
          shippingWeight: parseFloat(
            listing?.shippingClass?.shippingWeight || 0
          ),

          // Reviews and ratings
          averageRating: listing?.averageRating || 0,
          totalReviews: listing?.totalReviews || 0,

          // Variation details
          selectedVariation: variation,
          allVariations: listing?.variations || [],

          // Keep original nested objects for detailed access
          listing: listing,
          store: store,
        };
      });

      const summary = {
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        uniqueStores: [
          ...new Set(items.map((item) => item.storeId).filter(Boolean)),
        ].length,
        uniqueSellers: [
          ...new Set(items.map((item) => item.sellerId).filter(Boolean)),
        ].length,
        inStockItems: items.filter((item) => item.inStock).length,
        outOfStockItems: items.filter((item) => !item.inStock).length,
        categories: [
          ...new Set(items.map((item) => item.category?.main).filter(Boolean)),
        ],
        averageRating:
          items.length > 0
            ? items.reduce((sum, item) => sum + item.averageRating, 0) /
              items.length
            : 0,
      };

      return {
        data: {
          items,
          summary,
          pagination: response.data.pagination || {
            totalItems: response.data.totalItems || items.length,
            totalPages: response.data.totalPages || 1,
            currentPage: response.data.currentPage || 1,
          },
        },
      };
    } catch (error) {
      console.error("Error getting cart for checkout:", error);
      throw error;
    }
  },

  // ✅ NEW: Bulk cart operations
  bulkDeleteCartItems: async (cartItemIds) => {
    try {
      const deletePromises = cartItemIds.map((id) =>
        userService.deleteCartItem(id)
      );
      const results = await Promise.all(deletePromises);
      return results;
    } catch (error) {
      console.error("Error in bulk delete cart items:", error);
      throw error;
    }
  },

  // ✅ NEW: Clear entire cart for a user
  clearUserCart: async (buyerId) => {
    try {
      const cartResponse = await userService.getCartItems(buyerId, 1, 100);
      const cartItems = cartResponse.data.cartData || [];

      if (cartItems.length === 0) {
        return { message: "Cart is already empty" };
      }

      const deletePromises = cartItems.map((item) =>
        userService.deleteCartItem(item._id)
      );

      await Promise.all(deletePromises);
      return {
        message: `Successfully removed ${cartItems.length} items from cart`,
      };
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
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

  // ✅ ENHANCED: Place an order with comprehensive validation and error handling
  placeOrder: async (orderData) => {
    // ✅ Enhanced validation
    const validation = userService.validateOrderData(orderData);
    if (!validation.isValid) {
      throw new Error(
        `Order validation failed: ${validation.errors.join(", ")}`
      );
    }

    const payload = {
      buyerId: orderData.buyerId,
      listingIds: orderData.listingIds.filter(Boolean), // Remove any null/undefined values
      storeIds: (orderData.storeIds || []).filter(Boolean),
      sellerIds: (orderData.sellerIds || []).filter(Boolean),
      shippingAddress: orderData.shippingAddress,
      shippingOption: orderData.shippingOption || "standard",
      totalAmount: parseFloat(orderData.totalAmount) || 0,
    };

    console.log("Enhanced order payload:", payload);
    console.log("Order metadata:", orderData._metadata || {});

    try {
      const response = await axiosInstance.post(
        "/api/v1/order/place-order",
        payload
      );
      console.log("Order placement successful:", response.data);
      return response;
    } catch (error) {
      console.error("Error placing order:", error);

      // Enhanced error handling
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || "Invalid order data");
      } else if (error.response?.status === 409) {
        throw new Error("Some items are no longer available");
      } else if (error.response?.status === 422) {
        throw new Error("Order validation failed on server");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Failed to place order. Please try again.");
      }
    }
  },

  // ✅ NEW: Validate order data before submission
  validateOrderData: (orderData) => {
    const validation = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    // Required field validation
    if (!orderData.buyerId) {
      validation.errors.push("Buyer ID is required");
    }

    if (!orderData.listingIds || orderData.listingIds.length === 0) {
      validation.errors.push("At least one listing ID is required");
    }

    if (!orderData.shippingAddress) {
      validation.errors.push("Shipping address is required");
    }

    if (!orderData.totalAmount || orderData.totalAmount <= 0) {
      validation.errors.push("Order total must be greater than 0");
    }

    // Optional field warnings
    if (!orderData.storeIds || orderData.storeIds.length === 0) {
      validation.warnings.push("Store information is missing");
    }

    if (!orderData.sellerIds || orderData.sellerIds.length === 0) {
      validation.warnings.push("Seller information is missing");
    }

    // Data consistency checks
    if (orderData.listingIds && orderData.storeIds) {
      if (orderData.storeIds.length === 0 && orderData.listingIds.length > 0) {
        validation.warnings.push("Listings provided but no store information");
      }
    }

    validation.isValid = validation.errors.length === 0;
    return validation;
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
      firstName: profileData.firstName,
      lastName: profileData.lastName,
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

  // Get user profile
  getUserProfile: async (userId) => {
    return await axiosInstance.get(`/api/v1/auth/get-buyer-profile/${userId}`);
  },

  // SEARCH & FILTER SERVICES

  // Main search/filter across all stores
  searchProducts: async (searchParams, page = 1, pageSize = 10) => {
    const payload = {
      categoryMain: searchParams.categoryMain || "",
      PriceRange: searchParams.PriceRange || "",
      CustomerRating: searchParams.CustomerRating || 0,
      color: searchParams.color || "",
      brandName: searchParams.brandName || "",
      title: searchParams.title || "",
      page,
      pageSize,
    };

    console.log("Search API payload:", payload);

    try {
      const response = await axiosInstance.post(
        `/api/v1/category/main-filter?&page=${page}&pageSize=${pageSize}`,
        payload
      );
      console.log("Search API response:", response.data);
      return response;
    } catch (error) {
      console.error("Search API error:", error);
      throw error;
    }
  },

  // Search products in a specific store
  searchStoreProducts: async (
    sellerId,
    searchParams,
    page = 1,
    pageSize = 10
  ) => {
    const payload = {
      categoryMain: searchParams.categoryMain || "",
      PriceRange: searchParams.PriceRange || "",
      CustomerRating: searchParams.CustomerRating || 0,
      color: searchParams.color || "",
      brandName: searchParams.brandName || "",
      title: searchParams.title || "",
      page,
      pageSize,
    };

    console.log("Store search API payload:", payload);

    try {
      const response = await axiosInstance.post(
        `/api/v1/category/main-filter?sellerId=${sellerId}&page=${page}&pageSize=${pageSize}`,
        payload
      );
      console.log("Store search API response:", response.data);
      return response;
    } catch (error) {
      console.error("Store search API error:", error);
      throw error;
    }
  },

  quickSearch: async (query, pageSize = 8) => {
    if (!query || query.length < 2) {
      return { data: { data: [] } };
    }

    try {
      const payload = {
        title: query,
        brandName: "",
        categoryMain: "",
        PriceRange: "",
        CustomerRating: 0,
        color: "",
        page: 1,
        pageSize,
      };

      console.log("Quick search payload:", payload);

      const response = await axiosInstance.post(
        `/api/v1/category/main-filter?&page=1&pageSize=${pageSize}`,
        payload
      );

      console.log("Quick search response:", response.data);
      return response;
    } catch (error) {
      console.error("Quick search error:", error);
      // Return empty results on error to prevent breaking the UI
      return { data: { data: [] } };
    }
  },

  // ✅ ENHANCED: Extract cart item metadata for orders with comprehensive data
  extractOrderMetadata: (cartItems) => {
    const listingIds = [];
    const storeIds = new Set();
    const sellerIds = new Set();
    const categories = new Set();
    const brands = new Set();

    let totalValue = 0;
    let totalItems = 0;

    cartItems.forEach((item) => {
      // Extract listing ID
      const listingId = item.listingId || item.listing?._id || item._id;
      if (listingId) {
        listingIds.push(listingId);
      }

      // Extract store ID from multiple possible locations
      const storeId =
        item.storeId ||
        item.store?._id ||
        item.store?.storeId ||
        item.listing?.storeId;
      if (storeId) {
        storeIds.add(storeId);
      }

      // Extract seller ID from multiple possible locations
      const sellerId =
        item.sellerId ||
        item.store?.sellerId ||
        item.listing?.sellerId ||
        item.listing?.sellerDetails ||
        item.listing?.seller?._id;
      if (sellerId) {
        sellerIds.add(sellerId);
      }

      // Extract additional metadata
      if (item.category?.main || item.listing?.category?.main) {
        categories.add(item.category?.main || item.listing?.category?.main);
      }

      if (item.productBrand || item.listing?.brand) {
        brands.add(item.productBrand || item.listing?.brand);
      }

      // Calculate totals
      const price =
        item.price ||
        parseFloat(
          item.listing?.variations?.find((v) => v.isDefault)?.price || 0
        );
      totalValue += price * item.quantity;
      totalItems += item.quantity;

      // Log for debugging
      console.log("Extracting metadata from item:", {
        itemId: item._id,
        listingId,
        storeId,
        sellerId,
        price,
        quantity: item.quantity,
        subtotal: price * item.quantity,
      });
    });

    const metadata = {
      listingIds,
      storeIds: Array.from(storeIds),
      sellerIds: Array.from(sellerIds),
      summary: {
        totalValue,
        totalItems,
        uniqueStores: storeIds.size,
        uniqueSellers: sellerIds.size,
        categories: Array.from(categories),
        brands: Array.from(brands),
      },
    };

    console.log("Extracted order metadata:", metadata);
    return metadata;
  },

  // ✅ NEW: Prepare order payload with validation
  prepareOrderPayload: async (
    cartItems,
    shippingAddress,
    shippingOption = "standard",
    authUser
  ) => {
    try {
      const metadata = userService.extractOrderMetadata(cartItems);

      const orderPayload = {
        buyerId: authUser._id,
        listingIds: metadata.listingIds,
        storeIds: metadata.storeIds,
        sellerIds: metadata.sellerIds,
        shippingAddress: shippingAddress,
        shippingOption: shippingOption,
        totalAmount: metadata.summary.totalValue,
        _metadata: metadata.summary,
      };

      // Validate the prepared payload
      const validation = userService.validateOrderData(orderPayload);
      if (!validation.isValid) {
        throw new Error(
          `Order preparation failed: ${validation.errors.join(", ")}`
        );
      }

      if (validation.warnings.length > 0) {
        console.warn("Order preparation warnings:", validation.warnings);
      }

      return orderPayload;
    } catch (error) {
      console.error("Error preparing order payload:", error);
      throw error;
    }
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

  // ANALYTICS HELPERS

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

  // ✅ ENHANCED: Get cart summary with comprehensive metadata
  getCartSummary: async (buyerId) => {
    try {
      const response = await userService.getCartForCheckout(buyerId);
      return response;
    } catch (error) {
      console.error("Error getting cart summary:", error);
      return {
        data: {
          items: [],
          summary: {
            total: 0,
            itemCount: 0,
            uniqueStores: 0,
            uniqueSellers: 0,
            inStockItems: 0,
            outOfStockItems: 0,
            categories: [],
            averageRating: 0,
          },
        },
      };
    }
  },

  // Move item from cart to wishlist
  moveToWishlist: async (cartItemId, productId) => {
    try {
      // Add to wishlist first
      await userService.updateWishlist({
        productWishlist: [productId],
        shopWishlist: [],
      });

      // Then delete from cart
      await userService.deleteCartItem(cartItemId);

      return { success: true, message: "Item moved to wishlist" };
    } catch (error) {
      console.error("Error moving item to wishlist:", error);
      throw error;
    }
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

  // ✅ ENHANCED: Validate order before placement with comprehensive checks
  validateOrder: async (orderData) => {
    try {
      // Basic validation
      const basicValidation = userService.validateOrderData(orderData);

      const validation = {
        ...basicValidation,
        unavailableItems: [],
        stockIssues: [],
      };

      // Advanced validation - check if all items are still available
      if (orderData.listingIds && orderData.listingIds.length > 0) {
        try {
          const listingChecks = orderData.listingIds.map((listingId) =>
            userService.getListingById(listingId)
          );

          const listings = await Promise.all(listingChecks);

          listings.forEach((response, index) => {
            const listing = response.data.listing;
            const listingId = orderData.listingIds[index];

            if (!listing || listing.status !== "active") {
              validation.isValid = false;
              validation.unavailableItems.push(listingId);
              validation.errors.push(
                `Item ${listing?.title || "Unknown"} is no longer available`
              );
            }

            // Check stock for default variation
            const defaultVariation =
              listing?.variations?.find((v) => v.isDefault) ||
              listing?.variations?.[0];
            if (
              defaultVariation &&
              parseInt(defaultVariation.quantity || 0) === 0
            ) {
              validation.stockIssues.push(listingId);
              validation.warnings.push(
                `Item ${listing?.title || "Unknown"} is out of stock`
              );
            }
          });
        } catch (error) {
          validation.warnings.push("Unable to verify all items availability");
          console.warn("Error validating listings:", error);
        }
      }

      return { data: validation };
    } catch (error) {
      console.error("Error validating order:", error);
      return {
        data: {
          isValid: false,
          errors: ["Unable to validate order. Please try again."],
          warnings: [],
          unavailableItems: [],
          stockIssues: [],
        },
      };
    }
  },

  // ✅ NEW: Get cart analytics
  getCartAnalytics: async (buyerId) => {
    try {
      const response = await userService.getCartForCheckout(buyerId);
      const { items, summary } = response.data;

      const analytics = {
        ...summary,
        itemsByCategory: {},
        itemsByStore: {},
        itemsBySeller: {},
        priceDistribution: {
          under10: 0,
          under50: 0,
          under100: 0,
          over100: 0,
        },
        stockStatus: {
          inStock: summary.inStockItems || 0,
          outOfStock: summary.outOfStockItems || 0,
          lowStock: 0, // items with stock < 5
        },
      };

      items.forEach((item) => {
        // Category analysis
        const category = item.category?.main || "Uncategorized";
        analytics.itemsByCategory[category] =
          (analytics.itemsByCategory[category] || 0) + 1;

        // Store analysis
        const storeName = item.storeName || "Unknown Store";
        analytics.itemsByStore[storeName] =
          (analytics.itemsByStore[storeName] || 0) + 1;

        // Seller analysis
        const sellerId = item.sellerId || "Unknown Seller";
        analytics.itemsBySeller[sellerId] =
          (analytics.itemsBySeller[sellerId] || 0) + 1;

        // Price distribution
        if (item.price < 10) analytics.priceDistribution.under10++;
        else if (item.price < 50) analytics.priceDistribution.under50++;
        else if (item.price < 100) analytics.priceDistribution.under100++;
        else analytics.priceDistribution.over100++;

        // Stock status
        if (item.inStock && item.availableStock < 5) {
          analytics.stockStatus.lowStock++;
        }
      });

      return { data: analytics };
    } catch (error) {
      console.error("Error getting cart analytics:", error);
      throw error;
    }
  },
};

export default userService;
