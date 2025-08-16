import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  // Actions
  getAllStores,
  filterStoresByCategory,
  getShopListings,
  addToCart,
  getCartItems,
  updateCartItem,
  deleteCartItem,
  getWishlist,
  updateWishlist,
  deleteWishlistItem,
  placeOrder,
  getBuyerOrders,
  addReview,
  getShopReviews,
  getBuyerAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  updateUserProfile,
  deleteUserAccount,
  clearError,
  clearSuccess,
  clearStores,
  clearCart,
  clearWishlist,
  clearOrders,
  clearAddresses,

  // Selectors
  selectStores,
  selectFilteredStores,
  selectStoreListings,
  selectStoresPagination,
  selectStoresLoading,
  selectStoresError,
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
  selectUserLoading,
  selectUserError,
  selectUserSuccess,
  selectUserMessage,
} from "../store/slices/userSlice";

const useUser = () => {
  const dispatch = useDispatch();

  // 🏪 STORE STATE
  const stores = useSelector(selectStores);
  const filteredStores = useSelector(selectFilteredStores);
  const storeListings = useSelector(selectStoreListings);
  const storesPagination = useSelector(selectStoresPagination);
  const storesLoading = useSelector(selectStoresLoading);
  const storesError = useSelector(selectStoresError);

  // 🛒 CART STATE
  const cartItems = useSelector(selectCartItems);
  const cartPagination = useSelector(selectCartPagination);
  const cartLoading = useSelector(selectCartLoading);
  const cartError = useSelector(selectCartError);
  const cartItemCount = useSelector(selectCartItemCount);
  const cartTotal = useSelector(selectCartTotal);

  // ❤️ WISHLIST STATE
  const wishlist = useSelector(selectWishlist);
  const productWishlist = useSelector(selectProductWishlist);
  const shopWishlist = useSelector(selectShopWishlist);
  const wishlistLoading = useSelector(selectWishlistLoading);
  const wishlistError = useSelector(selectWishlistError);

  // 📦 ORDERS STATE
  const orders = useSelector(selectOrders);
  const ordersPagination = useSelector(selectOrdersPagination);
  const ordersLoading = useSelector(selectOrdersLoading);
  const ordersError = useSelector(selectOrdersError);

  // ⭐ REVIEWS STATE
  const shopReviews = useSelector(selectShopReviews);
  const reviewsPagination = useSelector(selectReviewsPagination);
  const reviewsLoading = useSelector(selectReviewsLoading);
  const reviewsError = useSelector(selectReviewsError);

  // 🏠 ADDRESS STATE
  const addresses = useSelector(selectAddresses);
  const defaultAddress = useSelector(selectDefaultAddress);
  const addressesLoading = useSelector(selectAddressesLoading);
  const addressesError = useSelector(selectAddressesError);

  // 🔄 GENERAL STATE
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const success = useSelector(selectUserSuccess);
  const message = useSelector(selectUserMessage);

  // 🏪 STORE ACTIONS
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

  // 🛒 CART ACTIONS
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

  // ❤️ WISHLIST ACTIONS
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

  // 📦 ORDER ACTIONS
  const createOrder = useCallback(
    (orderData) => {
      return dispatch(placeOrder(orderData));
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

  // 🏠 ADDRESS ACTIONS
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

  // 👤 PROFILE ACTIONS
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

  // 🔄 UTILITY ACTIONS
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

  // 🔍 HELPER FUNCTIONS
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

  // 📊 COMPUTED VALUES
  const cartSummary = {
    itemCount: cartItemCount,
    total: cartTotal,
    isEmpty: cartItemCount === 0,
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

  const ordersSummary = {
    total: orders.length,
    pending: getOrdersByStatus("pending").length,
    completed: getOrdersByStatus("completed").length,
    cancelled: getOrdersByStatus("cancelled").length,
    pendingReviews: getPendingReviewOrders().length,
  };

  const addressesSummary = {
    total: addresses.length,
    hasDefault: !!defaultAddress,
    maxReached: addresses.length >= 5, // API limit
  };

  // 🚀 BULK OPERATIONS
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

  // 📱 QUICK ACTIONS
  const quickAddToCart = useCallback(
    (buyerId, listingId) => {
      return addItemToCart(buyerId, listingId, 1);
    },
    [addItemToCart]
  );

  const quickToggleWishlist = useCallback(
    (userId, itemId, itemType = "product") => {
      if (itemType === "product") {
        const isInWishlist = isItemInProductWishlist(itemId);
        if (isInWishlist) {
          return removeFromWishlist(userId, itemId);
        } else {
          return addToWishlist([itemId], []);
        }
      } else {
        const isInWishlist = isItemInShopWishlist(itemId);
        if (isInWishlist) {
          return removeFromWishlist(userId, itemId);
        } else {
          return addToWishlist([], [itemId]);
        }
      }
    },
    [
      isItemInProductWishlist,
      isItemInShopWishlist,
      addToWishlist,
      removeFromWishlist,
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

  return {
    // 📊 STATE
    stores,
    filteredStores,
    storeListings,
    storesPagination,
    storesLoading,
    storesError,
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
    loading,
    error,
    success,
    message,

    // 🎬 ACTIONS
    fetchAllStores,
    fetchStoresByCategory,
    fetchShopListings,
    addItemToCart,
    fetchCartItems,
    updateCartItemQuantity,
    removeCartItem,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    createOrder,
    fetchBuyerOrders,
    submitReview,
    fetchShopReviews,
    fetchAddresses,
    addAddress,
    editAddress,
    removeAddress,
    updateProfile,
    deleteAccount,
    clearErrors,
    clearSuccessState,
    resetStores,
    resetCart,
    resetWishlist,
    resetOrders,
    resetAddresses,

    // 🔍 HELPERS
    isItemInCart,
    isItemInProductWishlist,
    isItemInShopWishlist,
    getCartItemByListing,
    getAddressByType,
    getPendingReviewOrders,
    getOrdersByStatus,

    // 📊 SUMMARIES
    cartSummary,
    wishlistSummary,
    ordersSummary,
    addressesSummary,

    // 🚀 BULK OPERATIONS
    bulkAddToCart,
    bulkRemoveFromCart,
    bulkAddToWishlist,

    // 📱 QUICK ACTIONS
    quickAddToCart,
    quickToggleWishlist,
    quickReorder,
  };
};

export default useUser;
