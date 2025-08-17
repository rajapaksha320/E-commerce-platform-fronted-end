import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";

// Initial state
const initialState = {
  // Stores
  stores: [],
  storeListings: [],
  filteredStores: [],
  storesPagination: null,

  // Cart
  cartItems: [],
  cartPagination: null,

  // Wishlist
  wishlist: {
    productWishlists: [],
    shopWishlists: [],
  },

  // Orders
  orders: [],
  ordersPagination: null,

  // Addresses
  addresses: [],

  // Reviews
  shopReviews: [],
  reviewsPagination: null,

  // User Profile
  userProfile: null,

  // Search & Filter
  searchResults: [],
  storeSearchResults: [],
  searchPagination: null,
  storeSearchPagination: null,
  lastSearchParams: null,
  lastStoreSearchParams: null,

  // Loading states
  loading: false,
  storesLoading: false,
  cartLoading: false,
  wishlistLoading: false,
  ordersLoading: false,
  addressesLoading: false,
  reviewsLoading: false,
  profileLoading: false,
  searchLoading: false,
  storeSearchLoading: false,

  // Error states
  error: null,
  storesError: null,
  cartError: null,
  wishlistError: null,
  ordersError: null,
  addressesError: null,
  reviewsError: null,
  profileError: null,
  searchError: null,
  storeSearchError: null,

  // Success states
  success: false,
  message: "",
};

// STORE ASYNC THUNKS
export const getAllStores = createAsyncThunk(
  "user/getAllStores",
  async ({ page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await userService.getAllStores(page, pageSize);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stores"
      );
    }
  }
);

export const filterStoresByCategory = createAsyncThunk(
  "user/filterStoresByCategory",
  async ({ categoryMain, page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await userService.filterStoresByCategory(
        categoryMain,
        page,
        pageSize
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to filter stores"
      );
    }
  }
);

export const getShopListings = createAsyncThunk(
  "user/getShopListings",
  async ({ sellerId, page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await userService.getShopListings(
        sellerId,
        page,
        pageSize
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch shop listings"
      );
    }
  }
);

// CART ASYNC THUNKS
export const addToCart = createAsyncThunk(
  "user/addToCart",
  async ({ buyerId, listingId, quantity }, { rejectWithValue }) => {
    try {
      const response = await userService.addToCart({
        buyerId,
        listingId,
        quantity,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  }
);

export const getCartItems = createAsyncThunk(
  "user/getCartItems",
  async ({ buyerId, page = 1, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await userService.getCartItems(buyerId, page, size);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart items"
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "user/updateCartItem",
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await userService.updateCartItem({
        cartItemId,
        quantity,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update cart item"
      );
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "user/deleteCartItem",
  async (cartItemId, { rejectWithValue }) => {
    try {
      await userService.deleteCartItem(cartItemId);
      return { cartItemId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete cart item"
      );
    }
  }
);

// WISHLIST ASYNC THUNKS
export const getWishlist = createAsyncThunk(
  "user/getWishlist",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.getWishlist(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

export const updateWishlist = createAsyncThunk(
  "user/updateWishlist",
  async ({ productWishlist = [], shopWishlist = [] }, { rejectWithValue }) => {
    try {
      const response = await userService.updateWishlist({
        productWishlist,
        shopWishlist,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update wishlist"
      );
    }
  }
);

export const deleteWishlistItem = createAsyncThunk(
  "user/deleteWishlistItem",
  async ({ userId, itemId }, { rejectWithValue }) => {
    try {
      const response = await userService.deleteWishlistItem(userId, itemId);
      return { ...response.data, deletedItemId: itemId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete wishlist item"
      );
    }
  }
);

// ORDER ASYNC THUNKS
export const placeOrder = createAsyncThunk(
  "user/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await userService.placeOrder(orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to place order"
      );
    }
  }
);

export const getBuyerOrders = createAsyncThunk(
  "user/getBuyerOrders",
  async ({ buyerId, page = 1, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await userService.getBuyerOrders(buyerId, page, size);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

export const addReview = createAsyncThunk(
  "user/addReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await userService.addReview(reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add review"
      );
    }
  }
);

export const getShopReviews = createAsyncThunk(
  "user/getShopReviews",
  async ({ shopId, page = 1, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await userService.getShopReviews(shopId, page, size);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch shop reviews"
      );
    }
  }
);

// ADDRESS ASYNC THUNKS
export const getBuyerAddresses = createAsyncThunk(
  "user/getBuyerAddresses",
  async (buyerId, { rejectWithValue }) => {
    try {
      const response = await userService.getBuyerAddresses(buyerId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch addresses"
      );
    }
  }
);

export const createAddress = createAsyncThunk(
  "user/createAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await userService.createAddress(addressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create address"
      );
    }
  }
);

export const updateAddress = createAsyncThunk(
  "user/updateAddress",
  async ({ addressId, addressData }, { rejectWithValue }) => {
    try {
      const response = await userService.updateAddress(addressId, addressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update address"
      );
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "user/deleteAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      await userService.deleteAddress(addressId);
      return { addressId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete address"
      );
    }
  }
);

// PROFILE ASYNC THUNKS
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await userService.updateUserProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  "user/deleteUserAccount",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.deleteUserAccount(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete account"
      );
    }
  }
);

// GET USER PROFILE ASYNC THUNK
export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.getUserProfile(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user profile"
      );
    }
  }
);

// 🔍 SEARCH & FILTER ASYNC THUNKS
export const searchProducts = createAsyncThunk(
  "user/searchProducts",
  async ({ searchParams, page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await userService.searchProducts(
        searchParams,
        page,
        pageSize
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search products"
      );
    }
  }
);

export const searchStoreProducts = createAsyncThunk(
  "user/searchStoreProducts",
  async (
    { sellerId, searchParams, page = 1, pageSize = 10 },
    { rejectWithValue }
  ) => {
    try {
      const response = await userService.searchStoreProducts(
        sellerId,
        searchParams,
        page,
        pageSize
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search store products"
      );
    }
  }
);

// User slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.storesError = null;
      state.cartError = null;
      state.wishlistError = null;
      state.ordersError = null;
      state.addressesError = null;
      state.reviewsError = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = "";
    },
    clearStores: (state) => {
      state.stores = [];
      state.filteredStores = [];
      state.storeListings = [];
      state.storesPagination = null;
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.cartPagination = null;
    },
    clearWishlist: (state) => {
      state.wishlist = {
        productWishlists: [],
        shopWishlists: [],
      };
    },
    clearOrders: (state) => {
      state.orders = [];
      state.ordersPagination = null;
    },
    clearAddresses: (state) => {
      state.addresses = [];
    },
    clearUserProfile: (state) => {
      state.userProfile = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchPagination = null;
      state.lastSearchParams = null;
    },
    clearStoreSearchResults: (state) => {
      state.storeSearchResults = [];
      state.storeSearchPagination = null;
      state.lastStoreSearchParams = null;
    },
  },
  extraReducers: (builder) => {
    // STORES
    builder
      .addCase(getAllStores.pending, (state) => {
        state.storesLoading = true;
        state.storesError = null;
      })
      .addCase(getAllStores.fulfilled, (state, action) => {
        state.storesLoading = false;
        state.stores = action.payload.data;
        state.storesPagination = action.payload.pagination;
      })
      .addCase(getAllStores.rejected, (state, action) => {
        state.storesLoading = false;
        state.storesError = action.payload;
      });

    builder
      .addCase(filterStoresByCategory.pending, (state) => {
        state.storesLoading = true;
        state.storesError = null;
      })
      .addCase(filterStoresByCategory.fulfilled, (state, action) => {
        state.storesLoading = false;
        state.filteredStores = action.payload.data;
        state.storesPagination = action.payload.pagination;
      })
      .addCase(filterStoresByCategory.rejected, (state, action) => {
        state.storesLoading = false;
        state.storesError = action.payload;
      });

    builder
      .addCase(getShopListings.pending, (state) => {
        state.storesLoading = true;
        state.storesError = null;
      })
      .addCase(getShopListings.fulfilled, (state, action) => {
        state.storesLoading = false;
        state.storeListings = action.payload.data;
        state.storesPagination = action.payload.pagination;
      })
      .addCase(getShopListings.rejected, (state, action) => {
        state.storesLoading = false;
        state.storesError = action.payload;
      });

    // CART
    builder
      .addCase(addToCart.pending, (state) => {
        state.cartLoading = true;
        state.cartError = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartLoading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.cartLoading = false;
        state.cartError = action.payload;
      });

    builder
      .addCase(getCartItems.pending, (state) => {
        state.cartLoading = true;
        state.cartError = null;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.cartLoading = false;
        state.cartItems = action.payload.cartData;
        state.cartPagination = {
          totalItems: action.payload.totalItems,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.currentPage,
        };
      })
      .addCase(getCartItems.rejected, (state, action) => {
        state.cartLoading = false;
        state.cartError = action.payload;
      });

    builder
      .addCase(updateCartItem.pending, (state) => {
        state.cartLoading = true;
        state.cartError = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cartLoading = false;
        state.success = true;
        state.message = action.payload.message;
        // Update the specific shopping cart item
        const index = state.cartItems.findIndex(
          (item) => item._id === action.payload.cartItem._id
        );
        if (index !== -1) {
          state.cartItems[index] = action.payload.cartItem;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.cartLoading = false;
        state.cartError = action.payload;
      });

    builder
      .addCase(deleteCartItem.pending, (state) => {
        state.cartLoading = true;
        state.cartError = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cartLoading = false;
        state.success = true;
        state.message = "Cart item deleted successfully";
        // Remove the deleted item from cart
        state.cartItems = state.cartItems.filter(
          (item) => item._id !== action.payload.cartItemId
        );
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.cartLoading = false;
        state.cartError = action.payload;
      });

    // WISHLIST
    builder
      .addCase(getWishlist.pending, (state) => {
        state.wishlistLoading = true;
        state.wishlistError = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.wishlistLoading = false;
        state.wishlist = action.payload.wishlistDetails;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.wishlistLoading = false;
        state.wishlistError = action.payload;
      });

    builder
      .addCase(updateWishlist.pending, (state) => {
        state.wishlistLoading = true;
        state.wishlistError = null;
      })
      .addCase(updateWishlist.fulfilled, (state, action) => {
        state.wishlistLoading = false;
        state.success = true;
        state.message = action.payload.message;
        if (action.payload.data.productWishlists) {
          state.wishlist.productWishlists =
            action.payload.data.productWishlists;
        }
        if (action.payload.data.shopWishlists) {
          state.wishlist.shopWishlists = action.payload.data.shopWishlists;
        }
      })
      .addCase(updateWishlist.rejected, (state, action) => {
        state.wishlistLoading = false;
        state.wishlistError = action.payload;
      });

    builder
      .addCase(deleteWishlistItem.pending, (state) => {
        state.wishlistLoading = true;
        state.wishlistError = null;
      })
      .addCase(deleteWishlistItem.fulfilled, (state, action) => {
        state.wishlistLoading = false;
        state.success = true;
        state.message = action.payload.message;
        if (action.payload.wishlist) {
          state.wishlist = action.payload.wishlist;
        }
      })
      .addCase(deleteWishlistItem.rejected, (state, action) => {
        state.wishlistLoading = false;
        state.wishlistError = action.payload;
      });

    // 📦 ORDERS
    builder
      .addCase(placeOrder.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.success = true;
        state.message = action.payload.message;
        state.orders.unshift(action.payload.order);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload;
      });

    builder
      .addCase(getBuyerOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(getBuyerOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload.orders;
        state.ordersPagination = action.payload.pagination;
      })
      .addCase(getBuyerOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload;
      });

    builder
      .addCase(addReview.pending, (state) => {
        state.reviewsLoading = true;
        state.reviewsError = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.reviewsError = action.payload;
      });

    builder
      .addCase(getShopReviews.pending, (state) => {
        state.reviewsLoading = true;
        state.reviewsError = null;
      })
      .addCase(getShopReviews.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.shopReviews = action.payload.reviews;
        state.reviewsPagination = action.payload.pagination;
      })
      .addCase(getShopReviews.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.reviewsError = action.payload;
      });

    // 🏠 ADDRESSES
    builder
      .addCase(getBuyerAddresses.pending, (state) => {
        state.addressesLoading = true;
        state.addressesError = null;
      })
      .addCase(getBuyerAddresses.fulfilled, (state, action) => {
        state.addressesLoading = false;
        state.addresses = action.payload.data;
      })
      .addCase(getBuyerAddresses.rejected, (state, action) => {
        state.addressesLoading = false;
        state.addressesError = action.payload;
      });

    builder
      .addCase(createAddress.pending, (state) => {
        state.addressesLoading = true;
        state.addressesError = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.addressesLoading = false;
        state.success = true;
        state.message = action.payload.message;
        state.addresses.push(action.payload.data);
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.addressesLoading = false;
        state.addressesError = action.payload;
      });

    builder
      .addCase(updateAddress.pending, (state) => {
        state.addressesLoading = true;
        state.addressesError = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.addressesLoading = false;
        state.success = true;
        state.message = action.payload.message;
        // Update the specific address
        const index = state.addresses.findIndex(
          (addr) => addr._id === action.payload.data._id
        );
        if (index !== -1) {
          state.addresses[index] = action.payload.data;
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.addressesLoading = false;
        state.addressesError = action.payload;
      });

    builder
      .addCase(deleteAddress.pending, (state) => {
        state.addressesLoading = true;
        state.addressesError = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addressesLoading = false;
        state.success = true;
        state.message = "Address deleted successfully";
        // Remove the deleted address
        state.addresses = state.addresses.filter(
          (addr) => addr._id !== action.payload.addressId
        );
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.addressesLoading = false;
        state.addressesError = action.payload;
      });

    // 👤 PROFILE
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(deleteUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        // Clear all user data after account deletion
        Object.assign(state, initialState);
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 👤 USER PROFILE
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.userProfile = action.payload.data;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });

    // 🔍 SEARCH & FILTER
    builder
      .addCase(searchProducts.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.data;
        state.searchPagination = action.payload.pagination;
        // Store the search parameters for reference
        state.lastSearchParams = action.meta.arg.searchParams;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
      });

    builder
      .addCase(searchStoreProducts.pending, (state) => {
        state.storeSearchLoading = true;
        state.storeSearchError = null;
      })
      .addCase(searchStoreProducts.fulfilled, (state, action) => {
        state.storeSearchLoading = false;
        state.storeSearchResults = action.payload.data;
        state.storeSearchPagination = action.payload.pagination;
        // Store the search parameters for reference
        state.lastStoreSearchParams = {
          sellerId: action.meta.arg.sellerId,
          searchParams: action.meta.arg.searchParams,
        };
      })
      .addCase(searchStoreProducts.rejected, (state, action) => {
        state.storeSearchLoading = false;
        state.storeSearchError = action.payload;
      });
  },
});

export const {
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
} = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user;

// Store selectors
export const selectStores = (state) => state.user.stores;
export const selectFilteredStores = (state) => state.user.filteredStores;
export const selectStoreListings = (state) => state.user.storeListings;
export const selectStoresPagination = (state) => state.user.storesPagination;
export const selectStoresLoading = (state) => state.user.storesLoading;
export const selectStoresError = (state) => state.user.storesError;

// Cart selectors
export const selectCartItems = (state) => state.user.cartItems;
export const selectCartPagination = (state) => state.user.cartPagination;
export const selectCartLoading = (state) => state.user.cartLoading;
export const selectCartError = (state) => state.user.cartError;
export const selectCartItemCount = (state) => state.user.cartItems.length;
export const selectCartTotal = (state) => {
  return state.user.cartItems.reduce((total, item) => {
    const price = item.listing?.variations?.[0]?.price || 0;
    return total + parseFloat(price) * item.quantity;
  }, 0);
};

// Wishlist selectors
export const selectWishlist = (state) => state.user.wishlist;
export const selectProductWishlist = (state) =>
  state.user.wishlist.productWishlists;
export const selectShopWishlist = (state) => state.user.wishlist.shopWishlists;
export const selectWishlistLoading = (state) => state.user.wishlistLoading;
export const selectWishlistError = (state) => state.user.wishlistError;

// Orders selectors
export const selectOrders = (state) => state.user.orders;
export const selectOrdersPagination = (state) => state.user.ordersPagination;
export const selectOrdersLoading = (state) => state.user.ordersLoading;
export const selectOrdersError = (state) => state.user.ordersError;

// Reviews selectors
export const selectShopReviews = (state) => state.user.shopReviews;
export const selectReviewsPagination = (state) => state.user.reviewsPagination;
export const selectReviewsLoading = (state) => state.user.reviewsLoading;
export const selectReviewsError = (state) => state.user.reviewsError;

// Address selectors
export const selectAddresses = (state) => state.user.addresses;
export const selectDefaultAddress = (state) =>
  state.user.addresses.find((addr) => addr.isDefault);
export const selectAddressesLoading = (state) => state.user.addressesLoading;
export const selectAddressesError = (state) => state.user.addressesError;

// Profile selectors
export const selectUserProfile = (state) => state.user.userProfile;
export const selectProfileLoading = (state) => state.user.profileLoading;
export const selectProfileError = (state) => state.user.profileError;

// Search selectors
export const selectSearchResults = (state) => state.user.searchResults;
export const selectSearchPagination = (state) => state.user.searchPagination;
export const selectSearchLoading = (state) => state.user.searchLoading;
export const selectSearchError = (state) => state.user.searchError;
export const selectLastSearchParams = (state) => state.user.lastSearchParams;

// Store search selectors
export const selectStoreSearchResults = (state) =>
  state.user.storeSearchResults;
export const selectStoreSearchPagination = (state) =>
  state.user.storeSearchPagination;
export const selectStoreSearchLoading = (state) =>
  state.user.storeSearchLoading;
export const selectStoreSearchError = (state) => state.user.storeSearchError;
export const selectLastStoreSearchParams = (state) =>
  state.user.lastStoreSearchParams;

// General selectors
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectUserSuccess = (state) => state.user.success;
export const selectUserMessage = (state) => state.user.message;

export default userSlice.reducer;
