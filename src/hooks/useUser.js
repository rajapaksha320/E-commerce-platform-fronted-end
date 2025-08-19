/* eslint-disable no-unused-vars */
import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  // Actions import
  getAllStores,
  filterStoresByCategory,
  getShopListings,
  getListingById,
  getShopDetailsById,
  addToCart,
  getCartItems,
  updateCartItem,
  deleteCartItem,
  getWishlist,
  updateWishlist,
  deleteWishlistItem,
  placeOrder,
  confirmOrder, 
  getBuyerOrders,
  addReview,
  getShopReviews,
  getBuyerAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  updateUserProfile,
  deleteUserAccount,
  getUserProfile,
  searchProducts,
  searchStoreProducts,
  clearError,
  clearSuccess,
  clearStores,
  clearCart,
  clearWishlist,
  clearOrders,
  clearAddresses,
  clearUserProfile,
  clearSearchResults,
  clearStoreSearchResults,
  clearListingDetail,
  clearShopDetail,

  // Selectors
  selectStores,
  selectFilteredStores,
  selectStoreListings,
  selectStoresPagination,
  selectStoresLoading,
  selectStoresError,
  selectCurrentListing,
  selectListingDetailLoading,
  selectListingDetailError,
  selectCurrentShopDetails,
  selectShopDetailLoading,
  selectShopDetailError,
  selectCartItems,
  selectCartPagination,
  selectCartLoading,
  selectCartError,
  selectCartItemCount,
  selectCartTotal,
  selectWishlist,
  selectProductWishlist,
  selectShopWishlist,
  selectWishlistLoading,
  selectWishlistError,
  selectOrders,
  selectOrdersPagination,
  selectOrdersLoading,
  selectOrdersError,
  selectShopReviews,
  selectReviewsPagination,
  selectReviewsLoading,
  selectReviewsError,
  selectAddresses,
  selectDefaultAddress,
  selectAddressesLoading,
  selectAddressesError,
  selectUserProfile,
  selectProfileLoading,
  selectProfileError,
  selectSearchResults,
  selectSearchPagination,
  selectSearchLoading,
  selectSearchError,
  selectLastSearchParams,
  selectStoreSearchResults,
  selectStoreSearchPagination,
  selectStoreSearchLoading,
  selectStoreSearchError,
  selectLastStoreSearchParams,
  selectUserLoading,
  selectUserError,
  selectUserSuccess,
  selectUserMessage,
  selectCartStores,
  selectCartSellers,
  selectCartMetadata,
  selectCartForCheckout,
  selectOrderDataFromCart,
} from "../store/slices/userSlice";

const useUser = () => {
  const dispatch = useDispatch();

  // STORE STATE
  const stores = useSelector(selectStores);
  const filteredStores = useSelector(selectFilteredStores);
  const storeListings = useSelector(selectStoreListings);
  const storesPagination = useSelector(selectStoresPagination);
  const storesLoading = useSelector(selectStoresLoading);
  const storesError = useSelector(selectStoresError);

  // LISTING DETAIL STATE
  const currentListing = useSelector(selectCurrentListing);
  const listingDetailLoading = useSelector(selectListingDetailLoading);
  const listingDetailError = useSelector(selectListingDetailError);

  // SHOP DETAIL STATE
  const currentShopDetails = useSelector(selectCurrentShopDetails);
  const shopDetailLoading = useSelector(selectShopDetailLoading);
  const shopDetailError = useSelector(selectShopDetailError);

  // CART STATE
  const cartItems = useSelector(selectCartItems);
  const cartPagination = useSelector(selectCartPagination);
  const cartLoading = useSelector(selectCartLoading);
  const cartError = useSelector(selectCartError);
  const cartItemCount = useSelector(selectCartItemCount);
  const cartTotal = useSelector(selectCartTotal);

  // cart data
  const cartStores = useSelector(selectCartStores);
  const cartSellers = useSelector(selectCartSellers);
  const cartMetadata = useSelector(selectCartMetadata);
  const cartForCheckout = useSelector(selectCartForCheckout);

  // WISHLIST STATE
  const wishlist = useSelector(selectWishlist);
  const productWishlist = useSelector(selectProductWishlist);
  const shopWishlist = useSelector(selectShopWishlist);
  const wishlistLoading = useSelector(selectWishlistLoading);
  const wishlistError = useSelector(selectWishlistError);

  // ORDERS STATE
  const orders = useSelector(selectOrders);
  const ordersPagination = useSelector(selectOrdersPagination);
  const ordersLoading = useSelector(selectOrdersLoading);
  const ordersError = useSelector(selectOrdersError);

  // REVIEWS STATE
  const shopReviews = useSelector(selectShopReviews);
  const reviewsPagination = useSelector(selectReviewsPagination);
  const reviewsLoading = useSelector(selectReviewsLoading);
  const reviewsError = useSelector(selectReviewsError);

  // ADDRESS STATE
  const addresses = useSelector(selectAddresses);
  const defaultAddress = useSelector(selectDefaultAddress);
  const addressesLoading = useSelector(selectAddressesLoading);
  const addressesError = useSelector(selectAddressesError);

  // PROFILE STATE
  const userProfile = useSelector(selectUserProfile);
  const profileLoading = useSelector(selectProfileLoading);
  const profileError = useSelector(selectProfileError);

  // SEARCH STATE
  const searchResults = useSelector(selectSearchResults);
  const searchPagination = useSelector(selectSearchPagination);
  const searchLoading = useSelector(selectSearchLoading);
  const searchError = useSelector(selectSearchError);
  const lastSearchParams = useSelector(selectLastSearchParams);

  // STORE SEARCH STATE
  const storeSearchResults = useSelector(selectStoreSearchResults);
  const storeSearchPagination = useSelector(selectStoreSearchPagination);
  const storeSearchLoading = useSelector(selectStoreSearchLoading);
  const storeSearchError = useSelector(selectStoreSearchError);
  const lastStoreSearchParams = useSelector(selectLastStoreSearchParams);

  // GENERAL STATE
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const success = useSelector(selectUserSuccess);
  const message = useSelector(selectUserMessage);

  // STORE ACTIONS
  const fetchAllStores = useCallback(
    (page = 1, pageSize = 10) => {
      return dispatch(getAllStores({ page, pageSize }));
    },
    [dispatch]
  );

  const fetchStoresByCategory = useCallback(
    (categoryMain, page = 1, pageSize = 10) => {
      return dispatch(filterStoresByCategory({ categoryMain, page, pageSize }));
    },
    [dispatch]
  );

  const fetchShopListings = useCallback(
    (sellerId, page = 1, pageSize = 10) => {
      return dispatch(getShopListings({ sellerId, page, pageSize }));
    },
    [dispatch]
  );

  // LISTING DETAIL ACTIONS
  const fetchListingById = useCallback(
    (listingId) => {
      return dispatch(getListingById(listingId));
    },
    [dispatch]
  );

  // SHOP DETAIL ACTIONS
  const fetchShopDetailsById = useCallback(
    (shopId) => {
      return dispatch(getShopDetailsById(shopId));
    },
    [dispatch]
  );

  // CART ACTIONS
  const addItemToCart = useCallback(
    (buyerId, listingId, quantity = 1) => {
      return dispatch(addToCart({ buyerId, listingId, quantity }));
    },
    [dispatch]
  );

  const fetchCartItems = useCallback(
    (buyerId, page = 1, size = 10) => {
      return dispatch(getCartItems({ buyerId, page, size }));
    },
    [dispatch]
  );

  const updateCartItemQuantity = useCallback(
    (cartItemId, quantity) => {
      return dispatch(updateCartItem({ cartItemId, quantity }));
    },
    [dispatch]
  );

  const removeCartItem = useCallback(
    (cartItemId) => {
      return dispatch(deleteCartItem(cartItemId));
    },
    [dispatch]
  );

  // Bulk remove cart items
  const bulkRemoveCartItems = useCallback(
    async (cartItemIds) => {
      try {
        const promises = cartItemIds.map((id) => dispatch(deleteCartItem(id)));
        const results = await Promise.all(promises);
        return results;
      } catch (error) {
        console.error("Error in bulk remove cart items:", error);
        throw error;
      }
    },
    [dispatch]
  );

  // Clear entire cart
  const clearUserCart = useCallback(() => {
    return dispatch(clearCart());
  }, [dispatch]);

  // WISHLIST ACTIONS
  const fetchWishlist = useCallback(
    (userId) => {
      return dispatch(getWishlist(userId));
    },
    [dispatch]
  );

  const addToWishlist = useCallback(
    (productWishlist = [], shopWishlist = []) => {
      return dispatch(updateWishlist({ productWishlist, shopWishlist }));
    },
    [dispatch]
  );

  const removeFromWishlist = useCallback(
    (userId, itemId) => {
      return dispatch(deleteWishlistItem({ userId, itemId }));
    },
    [dispatch]
  );

  // ORDER ACTIONS
  const createOrder = useCallback(
    (orderData) => {
      return dispatch(placeOrder(orderData));
    },
    [dispatch]
  );

  // Confirm order action
  const handleConfirmOrder = useCallback(
    (orderId, buyerId) => {
      return dispatch(confirmOrder({ orderId, buyerId }));
    },
    [dispatch]
  );

  const fetchBuyerOrders = useCallback(
    (buyerId, page = 1, size = 10) => {
      return dispatch(getBuyerOrders({ buyerId, page, size }));
    },
    [dispatch]
  );

  const submitReview = useCallback(
    (reviewData) => {
      return dispatch(addReview(reviewData));
    },
    [dispatch]
  );

  const fetchShopReviews = useCallback(
    (shopId, page = 1, size = 10) => {
      return dispatch(getShopReviews({ shopId, page, size }));
    },
    [dispatch]
  );

  // ADDRESS ACTIONS
  const fetchAddresses = useCallback(
    (buyerId) => {
      return dispatch(getBuyerAddresses(buyerId));
    },
    [dispatch]
  );

  const addAddress = useCallback(
    (addressData) => {
      return dispatch(createAddress(addressData));
    },
    [dispatch]
  );

  const editAddress = useCallback(
    (addressId, addressData) => {
      return dispatch(updateAddress({ addressId, addressData }));
    },
    [dispatch]
  );

  const removeAddress = useCallback(
    (addressId) => {
      return dispatch(deleteAddress(addressId));
    },
    [dispatch]
  );

  // PROFILE ACTIONS
  const updateProfile = useCallback(
    (profileData) => {
      return dispatch(updateUserProfile(profileData));
    },
    [dispatch]
  );

  const deleteAccount = useCallback(
    (userId) => {
      return dispatch(deleteUserAccount(userId));
    },
    [dispatch]
  );

  const fetchUserProfile = useCallback(
    (userId) => {
      return dispatch(getUserProfile(userId));
    },
    [dispatch]
  );

  // SEARCH ACTIONS
  const searchAllProducts = useCallback(
    (searchParams, page = 1, pageSize = 10) => {
      return dispatch(searchProducts({ searchParams, page, pageSize }));
    },
    [dispatch]
  );

  const searchProductsInStore = useCallback(
    (sellerId, searchParams, page = 1, pageSize = 10) => {
      return dispatch(
        searchStoreProducts({ sellerId, searchParams, page, pageSize })
      );
    },
    [dispatch]
  );

  // UTILITY ACTIONS
  const clearErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearSuccessState = useCallback(() => {
    dispatch(clearSuccess());
  }, [dispatch]);

  const resetStores = useCallback(() => {
    dispatch(clearStores());
  }, [dispatch]);

  const resetCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const resetWishlist = useCallback(() => {
    dispatch(clearWishlist());
  }, [dispatch]);

  const resetOrders = useCallback(() => {
    dispatch(clearOrders());
  }, [dispatch]);

  const resetAddresses = useCallback(() => {
    dispatch(clearAddresses());
  }, [dispatch]);

  const resetUserProfile = useCallback(() => {
    dispatch(clearUserProfile());
  }, [dispatch]);

  const resetSearchResults = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  const resetStoreSearchResults = useCallback(() => {
    dispatch(clearStoreSearchResults());
  }, [dispatch]);

  const resetListingDetail = useCallback(() => {
    dispatch(clearListingDetail());
  }, [dispatch]);

  const resetShopDetail = useCallback(() => {
    dispatch(clearShopDetail());
  }, [dispatch]);

  // HELPER FUNCTIONS
  const isItemInCart = useCallback(
    (listingId) => {
      return cartItems.some((item) => item.listingId === listingId);
    },
    [cartItems]
  );

  const isItemInProductWishlist = useCallback(
    (listingId) => {
      return productWishlist.some((list) =>
        list.items.some((item) => item._id === listingId)
      );
    },
    [productWishlist]
  );

  const isItemInShopWishlist = useCallback(
    (shopId) => {
      return shopWishlist.some((list) =>
        list.items.some((item) => item._id === shopId)
      );
    },
    [shopWishlist]
  );

  const getCartItemByListing = useCallback(
    (listingId) => {
      return cartItems.find((item) => item.listingId === listingId);
    },
    [cartItems]
  );

  // Enhanced cart helper functions
  const getCartItemDetails = useCallback(
    (cartItemId) => {
      const item = cartItems.find((item) => item._id === cartItemId);
      if (!item) return null;

      return {
        id: item._id,
        listingId: item.listingId,
        name: item.productName || item.listing?.title,
        brand: item.productBrand || item.listing?.brand,
        image: item.productImage,
        price: item.price,
        originalPrice: item.originalPrice,
        quantity: item.quantity,
        inStock: item.inStock,
        availableStock: item.availableStock,
        storeId: item.storeId,
        sellerId: item.sellerId,
        storeName: item.storeName,
        category: item.listing?.category,
        hasVariations: item.listing?.hasVariations,
        variations: item.listing?.variations || [],
        store: item.store,
        listing: item.listing,
      };
    },
    [cartItems]
  );

  // Get order data for selected items
  const getOrderDataForItems = useCallback(
    (selectedItemIds = []) => {
      const cartItemsState = cartItems;

      // Filter by selected items if provided, otherwise use all
      const itemsToProcess =
        selectedItemIds.length > 0
          ? cartItemsState.filter((item) => selectedItemIds.includes(item._id))
          : cartItemsState;

      const listingIds = itemsToProcess
        .map((item) => item.listingId)
        .filter(Boolean);
      const storeIds = [
        ...new Set(itemsToProcess.map((item) => item.storeId).filter(Boolean)),
      ];
      const sellerIds = [
        ...new Set(itemsToProcess.map((item) => item.sellerId).filter(Boolean)),
      ];

      return {
        listingIds,
        storeIds,
        sellerIds,
        totalAmount: itemsToProcess.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        itemCount: itemsToProcess.reduce((sum, item) => sum + item.quantity, 0),
        items: itemsToProcess,
      };
    },
    [cartItems]
  );

  // Get checkout items with full data
  const getCheckoutItems = useCallback(
    (selectedItemIds = []) => {
      if (selectedItemIds.length === 0) {
        return cartForCheckout;
      }

      return cartForCheckout.filter((item) =>
        selectedItemIds.includes(item._id)
      );
    },
    [cartForCheckout]
  );

  // Validate cart items for checkout
  const validateCartForCheckout = useCallback(
    (selectedItemIds = []) => {
      const itemsToCheck =
        selectedItemIds.length > 0
          ? cartItems.filter((item) => selectedItemIds.includes(item._id))
          : cartItems;

      const validation = {
        isValid: true,
        errors: [],
        warnings: [],
        outOfStockItems: [],
        unavailableItems: [],
        summary: {
          totalItems: itemsToCheck.length,
          totalValue: 0,
          storeCount: 0,
          sellerCount: 0,
        },
      };

      if (itemsToCheck.length === 0) {
        validation.isValid = false;
        validation.errors.push("No items selected for checkout");
        return validation;
      }

      // Check each item
      itemsToCheck.forEach((item) => {
        // Check stock
        if (!item.inStock || item.availableStock === 0) {
          validation.outOfStockItems.push(item._id);
          validation.errors.push(`${item.productName} is out of stock`);
        }

        // Check if item is still active
        if (item.productStatus !== "active") {
          validation.unavailableItems.push(item._id);
          validation.errors.push(`${item.productName} is no longer available`);
        }

        // Check quantity vs available stock
        if (item.quantity > item.availableStock) {
          validation.warnings.push(
            `Only ${item.availableStock} units available for ${item.productName} (requested: ${item.quantity})`
          );
        }

        validation.summary.totalValue += item.price * item.quantity;
      });

      // Set summary data
      validation.summary.storeCount = new Set(
        itemsToCheck.map((item) => item.storeId).filter(Boolean)
      ).size;
      validation.summary.sellerCount = new Set(
        itemsToCheck.map((item) => item.sellerId).filter(Boolean)
      ).size;

      // Mark as invalid if there are errors
      if (validation.errors.length > 0) {
        validation.isValid = false;
      }

      return validation;
    },
    [cartItems]
  );

  // Helper to prepare order payload
  const prepareOrderPayload = useCallback(
    (
      selectedItemIds,
      shippingAddress,
      shippingOption = "standard",
      authUser
    ) => {
      const orderData = getOrderDataForItems(selectedItemIds);

      if (!orderData.listingIds.length) {
        throw new Error("No items selected for order");
      }

      if (!shippingAddress) {
        throw new Error("Shipping address is required");
      }

      // Validate the cart items
      const validation = validateCartForCheckout(selectedItemIds);
      if (!validation.isValid) {
        throw new Error(
          `Order validation failed: ${validation.errors.join(", ")}`
        );
      }

      return {
        buyerId: authUser?._id,
        listingIds: orderData.listingIds,
        storeIds: orderData.storeIds,
        sellerIds: orderData.sellerIds,
        shippingAddress: shippingAddress,
        shippingOption: shippingOption,
        totalAmount: orderData.totalAmount,
        // Add metadata for reference
        _metadata: {
          itemCount: orderData.itemCount,
          storeCount: orderData.storeIds.length,
          sellerCount: orderData.sellerIds.length,
          validation: validation,
        },
      };
    },
    [getOrderDataForItems, validateCartForCheckout]
  );

  const getAddressByType = useCallback(
    (addressType) => {
      return addresses.filter((addr) => addr.addressType === addressType);
    },
    [addresses]
  );

  const getPendingReviewOrders = useCallback(() => {
    return orders.filter((order) => order.isReviewed === false);
  }, [orders]);

  const getOrdersByStatus = useCallback(
    (status) => {
      return orders.filter((order) => order.orderStatus === status);
    },
    [orders]
  );

  // Helper functions for order confirmation and review logic
  const getDeliveredUnconfirmedOrders = useCallback(() => {
    return orders.filter(
      (order) => order.orderStatus === "delivered" && !order.isConfirmed
    );
  }, [orders]);

  const getConfirmedUnreviewedOrders = useCallback(() => {
    return orders.filter(
      (order) =>
        (order.orderStatus === "confirmed" || order.isConfirmed) &&
        !order.isReviewed
    );
  }, [orders]);

  const canConfirmOrder = useCallback((order) => {
    return order.orderStatus === "delivered" && !order.isConfirmed;
  }, []);

  const canReviewOrder = useCallback((order) => {
    return (
      (order.orderStatus === "confirmed" || order.isConfirmed) &&
      !order.isReviewed
    );
  }, []);

  // LISTING DETAIL HELPERS
  const getCurrentListingData = useCallback(() => {
    if (!currentListing) return null;
    return {
      listing: currentListing.listing,
      seller: currentListing.sellerInfo?.[0] || null,
    };
  }, [currentListing]);

  const getListingVariations = useCallback(() => {
    if (!currentListing?.listing?.variations) return [];
    return currentListing.listing.variations;
  }, [currentListing]);

  const getDefaultVariation = useCallback(() => {
    const variations = getListingVariations();
    return variations.find((v) => v.isDefault) || variations[0] || null;
  }, [getListingVariations]);

  const getListingImages = useCallback(() => {
    if (!currentListing?.listing?.images) return [];
    return currentListing.listing.images;
  }, [currentListing]);

  const getPrimaryImage = useCallback(() => {
    const images = getListingImages();
    return images.find((img) => img.isPrimary) || images[0] || null;
  }, [getListingImages]);

  // SHOP DETAIL HELPERS
  const getShopContactInfo = useCallback(() => {
    if (!currentShopDetails?.contactDetails) return null;
    return currentShopDetails.contactDetails;
  }, [currentShopDetails]);

  const getShopBasicInfo = useCallback(() => {
    if (!currentShopDetails?.basicInformation) return null;
    return currentShopDetails.basicInformation;
  }, [currentShopDetails]);

  const getShopMedia = useCallback(() => {
    if (!currentShopDetails?.shopMedia)
      return { storeLogo: null, bannerImage: null };
    return currentShopDetails.shopMedia;
  }, [currentShopDetails]);

  // SEARCH HELPER FUNCTIONS
  const performSearch = useCallback(
    (filters = {}, page = 1, pageSize = 10) => {
      const searchParams = {
        categoryMain: filters.category || "",
        PriceRange: filters.priceRange || "",
        CustomerRating: filters.rating || 0,
        color: filters.color || "",
        brandName: filters.brand || "",
      };

      return searchAllProducts(searchParams, page, pageSize);
    },
    [searchAllProducts]
  );

  const performStoreSearch = useCallback(
    (sellerId, filters = {}, page = 1, pageSize = 10) => {
      const searchParams = {
        categoryMain: filters.category || "",
        PriceRange: filters.priceRange || "",
        CustomerRating: filters.rating || 0,
        color: filters.color || "",
        brandName: filters.brand || "",
      };

      return searchProductsInStore(sellerId, searchParams, page, pageSize);
    },
    [searchProductsInStore]
  );

  const getSearchFilters = useCallback(() => {
    if (!lastSearchParams) return null;

    return {
      category: lastSearchParams.categoryMain,
      priceRange: lastSearchParams.PriceRange,
      rating: lastSearchParams.CustomerRating,
      color: lastSearchParams.color,
      brand: lastSearchParams.brandName,
    };
  }, [lastSearchParams]);

  const getStoreSearchFilters = useCallback(() => {
    if (!lastStoreSearchParams) return null;

    return {
      sellerId: lastStoreSearchParams.sellerId,
      category: lastStoreSearchParams.searchParams.categoryMain,
      priceRange: lastStoreSearchParams.searchParams.PriceRange,
      rating: lastStoreSearchParams.searchParams.CustomerRating,
      color: lastStoreSearchParams.searchParams.color,
      brand: lastStoreSearchParams.searchParams.brandName,
    };
  }, [lastStoreSearchParams]);

  // BULK OPERATIONS
  const bulkAddToCart = useCallback(
    async (buyerId, items) => {
      const promises = items.map((item) =>
        dispatch(
          addToCart({
            buyerId,
            listingId: item.listingId,
            quantity: item.quantity || 1,
          })
        )
      );
      return Promise.all(promises);
    },
    [dispatch]
  );

  const bulkRemoveFromCart = useCallback(
    async (cartItemIds) => {
      const promises = cartItemIds.map((id) => dispatch(deleteCartItem(id)));
      return Promise.all(promises);
    },
    [dispatch]
  );

  const bulkAddToWishlist = useCallback(
    (productIds = [], shopIds = []) => {
      return dispatch(
        updateWishlist({
          productWishlist: productIds,
          shopWishlist: shopIds,
        })
      );
    },
    [dispatch]
  );

  // QUICK ACTIONS - FIXED VERSION
  const quickAddToCart = useCallback(
    (buyerId, listingId) => {
      return addItemToCart(buyerId, listingId, 1);
    },
    [addItemToCart]
  );

  // quickToggleWishlist
  const quickToggleWishlist = useCallback(
    (userId, itemId, itemType = "product") => {
      if (itemType === "product") {
        const isInWishlist = isItemInProductWishlist(itemId);
        if (isInWishlist) {
          return removeFromWishlist(userId, itemId);
        } else {
          const existingProductIds = productWishlist.reduce((ids, list) => {
            return [...ids, ...list.items.map((item) => item._id)];
          }, []);

          // Only add if not already in the list
          if (!existingProductIds.includes(itemId)) {
            const updatedProductIds = [...existingProductIds, itemId];

            // Get existing shop IDs to maintain them
            const existingShopIds = shopWishlist.reduce((ids, list) => {
              return [...ids, ...list.items.map((item) => item._id)];
            }, []);

            return addToWishlist(updatedProductIds, existingShopIds);
          }
        }
      } else {
        const isInWishlist = isItemInShopWishlist(itemId);
        if (isInWishlist) {
          return removeFromWishlist(userId, itemId);
        } else {
          const existingShopIds = shopWishlist.reduce((ids, list) => {
            return [...ids, ...list.items.map((item) => item._id)];
          }, []);

          // Only add if not already in the list
          if (!existingShopIds.includes(itemId)) {
            const updatedShopIds = [...existingShopIds, itemId];

            // Get existing product IDs to maintain them
            const existingProductIds = productWishlist.reduce((ids, list) => {
              return [...ids, ...list.items.map((item) => item._id)];
            }, []);

            return addToWishlist(existingProductIds, updatedShopIds);
          }
        }
      }
    },
    [
      isItemInProductWishlist,
      isItemInShopWishlist,
      addToWishlist,
      removeFromWishlist,
      productWishlist,
      shopWishlist,
    ]
  );

  const quickReorder = useCallback(
    (order) => {
      const orderData = {
        buyerId: order.buyerId,
        listingIds: order.listingIds,
        storeIds: order.storeIds,
        sellerIds: order.sellerIds,
        shippingAddress: order.shippingAddress,
        shippingOption: order.shippingOption,
        totalAmount: order.totalAmount,
      };
      return createOrder(orderData);
    },
    [createOrder]
  );

  // COMPUTED VALUES
  const cartSummary = {
    itemCount: cartItemCount,
    total: cartTotal,
    isEmpty: cartItemCount === 0,
  };

  const enhancedCartSummary = {
    ...cartSummary,
    metadata: cartMetadata,
    stores: cartStores,
    sellers: cartSellers,
    isEmpty: cartItems.length === 0,
    hasOutOfStock: cartItems.some((item) => !item.inStock),
    hasLowStock: cartItems.some(
      (item) => item.availableStock > 0 && item.availableStock < 5
    ),
  };

  const wishlistSummary = {
    productCount: productWishlist.reduce(
      (total, list) => total + list.items.length,
      0
    ),
    shopCount: shopWishlist.reduce(
      (total, list) => total + list.items.length,
      0
    ),
    isEmpty: productWishlist.length === 0 && shopWishlist.length === 0,
  };

  // UPDATED: Enhanced orders summary with new statuses
  const ordersSummary = {
    total: orders.length,
    pending: getOrdersByStatus("pending").length,
    confirmed: getOrdersByStatus("confirmed").length,
    shipped: getOrdersByStatus("shipped").length,
    delivered: getOrdersByStatus("delivered").length,
    cancelled: getOrdersByStatus("cancelled").length,
    pendingReviews: getPendingReviewOrders().length,
    deliveredUnconfirmed: getDeliveredUnconfirmedOrders().length,
    confirmedUnreviewed: getConfirmedUnreviewedOrders().length,
  };

  const addressesSummary = {
    total: addresses.length,
    hasDefault: !!defaultAddress,
    maxReached: addresses.length >= 5,
  };

  const searchSummary = {
    hasResults: searchResults.length > 0,
    totalResults: searchPagination?.totalItems || 0,
    currentPage: searchPagination?.currentPage || 1,
    totalPages: searchPagination?.totalPages || 0,
    isLoading: searchLoading,
    hasError: !!searchError,
  };

  const storeSearchSummary = {
    hasResults: storeSearchResults.length > 0,
    totalResults: storeSearchPagination?.totalItems || 0,
    currentPage: storeSearchPagination?.currentPage || 1,
    totalPages: storeSearchPagination?.totalPages || 0,
    isLoading: storeSearchLoading,
    hasError: !!storeSearchError,
  };

  const listingDetailSummary = {
    hasListing: !!currentListing,
    isLoading: listingDetailLoading,
    hasError: !!listingDetailError,
    hasSeller: !!(currentListing?.sellerInfo?.length > 0),
    hasVariations: !!currentListing?.listing?.hasVariations,
    variationCount: currentListing?.listing?.variations?.length || 0,
    imageCount: currentListing?.listing?.images?.length || 0,
  };

  const shopDetailSummary = {
    hasShop: !!currentShopDetails,
    isLoading: shopDetailLoading,
    hasError: !!shopDetailError,
    isActive: currentShopDetails?.status === "active",
    hasLogo: !!currentShopDetails?.shopMedia?.storeLogo,
    hasBanner: !!currentShopDetails?.shopMedia?.bannerImage,
    rating: currentShopDetails?.rating || 0,
    totalProducts: currentShopDetails?.totalProducts || 0,
    totalSales: currentShopDetails?.totalSales || 0,
  };

  return {
    // STATE
    stores,
    filteredStores,
    storeListings,
    storesPagination,
    storesLoading,
    storesError,
    currentListing,
    listingDetailLoading,
    listingDetailError,
    currentShopDetails,
    shopDetailLoading,
    shopDetailError,
    cartItems,
    cartPagination,
    cartLoading,
    cartError,
    cartItemCount,
    cartTotal,
    wishlist,
    productWishlist,
    shopWishlist,
    wishlistLoading,
    wishlistError,
    orders,
    ordersPagination,
    ordersLoading,
    ordersError,
    shopReviews,
    reviewsPagination,
    reviewsLoading,
    reviewsError,
    addresses,
    defaultAddress,
    addressesLoading,
    addressesError,
    userProfile,
    profileLoading,
    profileError,
    searchResults,
    searchPagination,
    searchLoading,
    searchError,
    lastSearchParams,
    storeSearchResults,
    storeSearchPagination,
    storeSearchLoading,
    storeSearchError,
    lastStoreSearchParams,
    loading,
    error,
    success,
    message,
    cartStores,
    cartSellers,
    cartMetadata,
    cartForCheckout,

    // ACTIONS
    fetchAllStores,
    fetchStoresByCategory,
    fetchShopListings,
    fetchListingById,
    fetchShopDetailsById,
    addItemToCart,
    fetchCartItems,
    updateCartItemQuantity,
    removeCartItem,
    bulkRemoveCartItems,
    clearUserCart,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    createOrder,
    handleConfirmOrder,
    fetchBuyerOrders,
    submitReview,
    fetchShopReviews,
    fetchAddresses,
    addAddress,
    editAddress,
    removeAddress,
    updateProfile,
    deleteAccount,
    fetchUserProfile,
    searchAllProducts,
    searchProductsInStore,
    clearErrors,
    clearSuccessState,
    resetStores,
    resetCart,
    resetWishlist,
    resetOrders,
    resetAddresses,
    resetUserProfile,
    resetSearchResults,
    resetStoreSearchResults,
    resetListingDetail,
    resetShopDetail,

    // HELPERS
    isItemInCart,
    isItemInProductWishlist,
    isItemInShopWishlist,
    getCartItemByListing,
    getAddressByType,
    getPendingReviewOrders,
    getOrdersByStatus,
    getDeliveredUnconfirmedOrders,
    getConfirmedUnreviewedOrders,
    canConfirmOrder,
    canReviewOrder,
    getCurrentListingData,
    getListingVariations,
    getDefaultVariation,
    getListingImages,
    getPrimaryImage,
    getShopContactInfo,
    getShopBasicInfo,
    getShopMedia,
    getCartItemDetails,
    getOrderDataForItems,
    getCheckoutItems,
    validateCartForCheckout,
    prepareOrderPayload,

    // SUMMARIES
    cartSummary: enhancedCartSummary,
    wishlistSummary,
    ordersSummary,
    addressesSummary,
    searchSummary,
    storeSearchSummary,
    listingDetailSummary,
    shopDetailSummary,

    // BULK OPERATIONS
    bulkAddToCart,
    bulkRemoveFromCart,
    bulkAddToWishlist,

    // QUICK ACTIONS
    quickAddToCart,
    quickToggleWishlist,
    quickReorder,

    // SEARCH HELPERS
    performSearch,
    performStoreSearch,
    getSearchFilters,
    getStoreSearchFilters,
  };
};

export default useUser;
