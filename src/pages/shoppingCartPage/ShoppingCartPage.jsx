/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Heart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  Truck,
  Shield,
  CreditCard,
  X,
  Star,
  Clock,
  Loader2,
  AlertCircle,
  Check,
  CheckSquare,
  Square,
  MapPin,
  Package,
} from "lucide-react";

import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";
import Pagination from "../../components/ui/ContactUis/Pagination";
import ToastNotification, {
  useToast,
} from "../../components/ui/ToastNotification";
import { useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { useSelector } from "react-redux";
import {
  selectUser,
  selectIsAuthenticated,
} from "../../store/slices/authSlice";

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectUser);
  const { toastRef, showToast } = useToast();

  // Redux user hook
  const {
    // Cart state
    cartItems,
    cartLoading,
    cartError,
    cartPagination,
    cartItemCount,
    cartTotal,

    // ✅ NEW: Enhanced cart data
    cartMetadata,
    cartStores,
    cartSellers,

    // Wishlist state
    productWishlist,
    wishlistLoading,

    // Actions
    fetchCartItems,
    updateCartItemQuantity,
    removeCartItem,
    addToWishlist,
    clearErrors,
    quickToggleWishlist,
    fetchWishlist,

    // ✅ NEW: Enhanced helper functions
    getCartItemDetails,
    validateCartForCheckout,

    // Helper functions
    isItemInCart,
    getCartItemByListing,
    cartSummary,
  } = useUser();

  // Local state for pagination and selection
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const itemsPerPage = 10;

  // Get user ID
  const userId = currentUser?._id || currentUser?.userId;
  const buyerId = userId;

  // Fetch cart items on component mount
  useEffect(() => {
    if (isAuthenticated && buyerId) {
      fetchCartItems(buyerId, currentPage, itemsPerPage);
    }
  }, [isAuthenticated, buyerId, currentPage, fetchCartItems]);

  // ✅ ENHANCED: Get item details with enhanced cart data
  const getItemDetails = (cartItem) => {
    // Use enhanced cart data if available
    if (cartItem.productName && cartItem.price !== undefined) {
      return {
        id: cartItem._id,
        name: cartItem.productName,
        brand: cartItem.productBrand,
        price: cartItem.price,
        originalPrice: cartItem.originalPrice,
        quantity: cartItem.quantity,
        image: cartItem.productImage,
        inStock: cartItem.inStock,
        availableStock: cartItem.availableStock,
        rating: cartItem.listing?.averageRating || 4.0,
        totalReviews: cartItem.listing?.totalReviews || 0,
        badge: cartItem.productTags?.[0] || null,
        shippingFree:
          cartItem.listing?.shippingClass?.shippingClass === "standard",
        listingId: cartItem.listingId,
        storeId: cartItem.storeId,
        sellerId: cartItem.sellerId,
        storeName: cartItem.storeName,
        category: cartItem.category,
      };
    }

    // Fallback to original logic for backward compatibility
    const listing = cartItem.listing;
    const defaultVariation =
      listing?.variations?.find((v) => v.isDefault) || listing?.variations?.[0];

    return {
      id: cartItem._id,
      name: listing?.title || listing?.name || "Unknown Product",
      brand: listing?.brandName || listing?.brand || "Unknown Brand",
      price: parseFloat(defaultVariation?.price || 0),
      originalPrice: parseFloat(
        defaultVariation?.originalPrice || defaultVariation?.price || 0
      ),
      quantity: cartItem.quantity || 1,
      image:
        listing?.images?.find((img) => img.isPrimary)?.url ||
        listing?.images?.[0]?.url ||
        "/placehold.png",
      inStock: listing?.status === "active" && defaultVariation?.quantity > 0,
      availableStock: parseInt(defaultVariation?.quantity || 0),
      rating: listing?.averageRating || 4.0,
      totalReviews: listing?.totalReviews || 0,
      badge: listing?.badge || null,
      shippingFree:
        listing?.freeShipping || defaultVariation?.freeShipping || false,
      listingId: listing?._id,
      storeId: cartItem.store?._id,
      sellerId: cartItem.store?.sellerId,
      storeName: cartItem.store?.basicInformation?.storeName,
    };
  };

  // ✅ FIXED: Get in-stock items and out-of-stock counts
  const cartItemsWithDetails = cartItems.map((item) => ({
    ...item,
    details: getItemDetails(item),
  }));

  const inStockItems = cartItemsWithDetails.filter(
    (item) => item.details.inStock
  );
  const outOfStockItems = cartItemsWithDetails.filter(
    (item) => !item.details.inStock
  );
  const inStockItemIds = inStockItems.map((item) => item._id);

  // ✅ FIXED: Update select all state when cart items change - only consider in-stock items
  useEffect(() => {
    if (inStockItems.length > 0) {
      const allInStockSelected = inStockItems.every((item) =>
        selectedItems.has(item._id)
      );
      setSelectAll(allInStockSelected);
    } else {
      setSelectAll(false);
      setSelectedItems(new Set());
    }
  }, [cartItems, selectedItems]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  // Handle individual item selection
  const handleItemSelect = (itemId, isSelected) => {
    const newSelected = new Set(selectedItems);
    if (isSelected) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  // ✅ FIXED: Handle select all toggle - only select in-stock items
  const handleSelectAll = (isSelected) => {
    setSelectAll(isSelected);
    if (isSelected) {
      // Only select in-stock items
      setSelectedItems(new Set(inStockItemIds));
    } else {
      setSelectedItems(new Set());
    }
  };

  // ✅ ENHANCED: Handle navigation to checkout with selected items
  const handleNavigateCheckout = () => {
    if (selectedItems.size === 0) {
      showToast.error("Please select at least one item to checkout");
      return;
    }

    // Get selected cart items with full data - filter out any out-of-stock items
    const selectedCartItems = cartItems.filter((item) => {
      const details = getItemDetails(item);
      return selectedItems.has(item._id) && details.inStock;
    });

    if (selectedCartItems.length === 0) {
      showToast.error("No available items selected for checkout");
      return;
    }

    // ✅ ENHANCED: Validate selected items before checkout
    try {
      const validation = validateCartForCheckout(Array.from(selectedItems));
      if (!validation.isValid) {
        showToast.error(
          `Cannot proceed to checkout: ${validation.errors.join(", ")}`
        );
        return;
      }

      if (validation.warnings.length > 0) {
        // Show warnings but allow checkout
        validation.warnings.forEach((warning) => {
          showToast.warning(warning);
        });
      }
    } catch (error) {
      console.error("Validation error:", error);
      showToast.error("Error validating cart items");
      return;
    }

    console.log(
      "Navigating to checkout with selected items:",
      selectedCartItems
    );
    console.log("Selected metadata:", {
      itemCount: selectedCartItems.length,
      totalValue: selectedCartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      storeCount: new Set(
        selectedCartItems.map((item) => item.storeId).filter(Boolean)
      ).size,
      sellerCount: new Set(
        selectedCartItems.map((item) => item.sellerId).filter(Boolean)
      ).size,
    });

    // ✅ FIX: Navigate to checkout with selected items in state
    navigate("/checkout", {
      state: {
        selectedItems: selectedCartItems,
        fromCart: true,
        selectedItemIds: Array.from(selectedItems), // Also pass the IDs for reference
      },
    });
  };

  // ✅ ENHANCED: Update item quantity with enhanced data
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeItem(cartItemId);
      return;
    }

    try {
      // Get item details for validation
      const itemDetails = getCartItemDetails(cartItemId);
      if (itemDetails && newQuantity > itemDetails.availableStock) {
        showToast.warning(
          `Only ${itemDetails.availableStock} units available for ${itemDetails.name}`
        );
        return;
      }

      await updateCartItemQuantity(cartItemId, newQuantity);
      // Refresh cart items
      if (buyerId) {
        fetchCartItems(buyerId, currentPage, itemsPerPage);
      }
      showToast.success("Quantity updated");
    } catch (error) {
      console.error("Failed to update quantity:", error);
      showToast.error("Failed to update quantity");
    }
  };

  // Remove item from cart with pagination fix
  const removeItem = async (cartItemId) => {
    try {
      await removeCartItem(cartItemId);

      // Remove from selected items if it was selected
      const newSelected = new Set(selectedItems);
      newSelected.delete(cartItemId);
      setSelectedItems(newSelected);

      // ✅ FIX: Check if this was the last item on current page
      if (cartItems.length === 1 && currentPage > 1) {
        // Go to previous page
        const newPage = currentPage - 1;
        setCurrentPage(newPage);
        if (buyerId) {
          fetchCartItems(buyerId, newPage, itemsPerPage);
        }
      } else {
        // Refresh current page
        if (buyerId) {
          fetchCartItems(buyerId, currentPage, itemsPerPage);
        }
      }

      showToast.success("Item removed from cart");
    } catch (error) {
      console.error("Failed to remove item:", error);
      showToast.error("Failed to remove item");
    }
  };

  // Save item for later (add to wishlist)
  const saveForLater = async (item) => {
    try {
      const listingId = item.listing?._id || item.listingId;
      const productName = item.productName || item.listing?.title || "Product";

      if (listingId) {
        // Use quickToggleWishlist to properly maintain existing wishlist items
        await quickToggleWishlist(userId, listingId, "product");
        await removeItem(item._id);

        // Refresh wishlist to update the state
        await fetchWishlist(userId);

        showToast.success(`"${productName}" saved to wishlist!`, {
          text: "View Wishlist",
          action: () => navigate("/wishlist"),
        });
      }
    } catch (error) {
      console.error("Failed to save for later:", error);
      showToast.error("Failed to save for later");
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (buyerId) {
      fetchCartItems(buyerId, page, itemsPerPage);
    }
    // Clear selections when changing pages
    setSelectedItems(new Set());
    setSelectAll(false);
  };

  // Get badge variant
  const getBadgeVariant = (badge) => {
    const variants = {
      "Best Seller": "success",
      New: "primary",
      Popular: "warning",
      Organic: "success",
      Gaming: "primary",
      "Eco-Friendly": "success",
    };
    return variants[badge] || "default";
  };

  // Render stars for rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  // ✅ ENHANCED: Calculate totals for selected items only - only in-stock items
  const selectedCartItems = cartItems.filter((item) => {
    const details = getItemDetails(item);
    return selectedItems.has(item._id) && details.inStock;
  });

  const subtotal = selectedCartItems.reduce((sum, item) => {
    const details = getItemDetails(item);
    return sum + details.price * details.quantity;
  }, 0);

  const shipping = selectedCartItems.some((item) => {
    const details = getItemDetails(item);
    return !details.shippingFree;
  })
    ? 9.99
    : 0;

  const freeShipping = shipping === 0;
  const finalShipping = freeShipping ? 0 : shipping;
  const tax = subtotal * 0.08;
  const total = subtotal + finalShipping + tax;
  const selectedItemCount = selectedCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Get pagination info
  const totalPages = cartPagination?.totalPages || 1;
  const totalItems = cartPagination?.totalItems || cartItems.length;

  // ✅ FIXED: Check if all items are out of stock
  const allItemsOutOfStock = cartItems.length > 0 && inStockItems.length === 0;

  // Loading state
  if (cartLoading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (cartError && !cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Cart
          </h3>
          <p className="text-gray-600 mb-6">{cartError}</p>
          <Button
            onClick={() =>
              buyerId && fetchCartItems(buyerId, currentPage, itemsPerPage)
            }
            className="w-full"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md mx-auto">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Please Sign In
          </h3>
          <p className="text-gray-600 mb-6">
            You need to be signed in to view your shopping cart.
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastNotification ref={toastRef} />

      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm p-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.history.back()}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <ShoppingCart className="h-6 w-6 text-blue-600 mr-3" />
                  Shopping Cart
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                  {/* ✅ ENHANCED: Show stock status in header */}
                  {outOfStockItems.length > 0 && (
                    <span className="text-red-600">
                      {" "}
                      • {outOfStockItems.length} out of stock
                    </span>
                  )}
                  {selectedItems.size > 0 && (
                    <span className="text-blue-600 font-medium">
                      {" "}
                      • {selectedItems.size} selected
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Mobile Total Display */}
            <div className="md:hidden">
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  LKR {total.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedItems.size > 0
                    ? `${selectedItems.size} selected`
                    : "Total"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Start shopping to add items to your cart
              </p>
              <Button
                size="lg"
                className="px-8 py-3"
                onClick={() => navigate("/")}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Continue Shopping
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              {/* ✅ ENHANCED: Cart Controls with better messaging */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleSelectAll(!selectAll)}
                      className="flex items-center space-x-3 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                      disabled={cartLoading || allItemsOutOfStock}
                    >
                      {selectAll ? (
                        <CheckSquare className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                      <span className="font-medium">
                        {allItemsOutOfStock
                          ? "No items available"
                          : "Select All Available"}
                      </span>
                    </button>

                    {/* ✅ NEW: Show available items info */}
                    {inStockItems.length > 0 &&
                      inStockItems.length < cartItems.length && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          {inStockItems.length} available
                        </span>
                      )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      {cartItems.length} items
                    </span>
                    {selectedItems.size > 0 && (
                      <Badge variant="primary" className="text-xs">
                        {selectedItems.size} selected
                      </Badge>
                    )}
                  </div>
                </div>

                {/* ✅ NEW: All items out of stock warning */}
                {allItemsOutOfStock && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center text-red-700">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">
                        All items in your cart are currently out of stock
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {cartItems.map((cartItem) => {
                  const item = getItemDetails(cartItem);
                  const isSelected = selectedItems.has(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-lg shadow-sm border transition-all duration-200 ${
                        isSelected
                          ? "ring-2 ring-blue-500 border-blue-200"
                          : "border-gray-200"
                      } ${!item.inStock ? "opacity-75" : ""}`}
                    >
                      <div className="p-6">
                        <div className="flex space-x-4">
                          {/* Selection Checkbox */}
                          <div className="flex-shrink-0 pt-2">
                            <button
                              onClick={() =>
                                handleItemSelect(item.id, !isSelected)
                              }
                              className="p-1"
                              disabled={cartLoading || !item.inStock}
                            >
                              {isSelected ? (
                                <CheckSquare className="h-5 w-5 text-blue-600" />
                              ) : (
                                <Square
                                  className={`h-5 w-5 ${
                                    item.inStock
                                      ? "text-gray-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              )}
                            </button>
                          </div>

                          {/* Product Image */}
                          <div className="flex-shrink-0 relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-24 h-24 lg:w-32 lg:h-32 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.target.src = "/placehold.png";
                              }}
                            />
                            {item.badge && (
                              <div className="absolute -top-2 -left-2">
                                <Badge
                                  variant={getBadgeVariant(item.badge)}
                                  size="sm"
                                  className="text-xs"
                                >
                                  {item.badge}
                                </Badge>
                              </div>
                            )}
                            {!item.inStock && (
                              <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                                <span className="text-white font-medium text-sm bg-red-600 px-3 py-1 rounded-full">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-blue-600 mb-1">
                                  {item.brand}
                                </p>
                                <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                                  {item.name}
                                </h3>

                                {/* Store Information */}
                                {item.storeName && (
                                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    Sold by {item.storeName}
                                  </p>
                                )}

                                {/* Rating */}
                                <div className="flex items-center space-x-2 mb-3">
                                  <div className="flex items-center">
                                    {renderStars(item.rating)}
                                  </div>
                                  <span className="text-sm text-gray-600">
                                    {item.rating} (
                                    {item.totalReviews.toLocaleString()})
                                  </span>
                                </div>

                                {/* Stock Information */}
                                {item.inStock && item.availableStock < 10 && (
                                  <p className="text-sm text-orange-600 mb-2 flex items-center">
                                    <Package className="h-4 w-4 mr-1" />
                                    Only {item.availableStock} left in stock
                                  </p>
                                )}

                                {/* Shipping */}
                                {item.shippingFree && item.inStock && (
                                  <div className="flex items-center text-green-600 text-sm mb-3">
                                    <Truck className="h-4 w-4 mr-2" />
                                    <span className="font-medium">
                                      FREE Shipping
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Price and Actions */}
                              <div className="text-right">
                                <div className="mb-4">
                                  <span
                                    className={`text-2xl font-bold ${
                                      item.inStock
                                        ? "text-gray-900"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    LKR {item.price.toFixed(2)}
                                  </span>
                                  {item.originalPrice > item.price && (
                                    <p className="text-lg text-gray-500 line-through">
                                      LKR {item.originalPrice.toFixed(2)}
                                    </p>
                                  )}
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center justify-end space-x-3 mb-4">
                                  <div className="flex items-center border border-gray-300 rounded-md">
                                    <Button
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          item.quantity - 1
                                        )
                                      }
                                      variant="ghost"
                                      size="sm"
                                      className="p-2 hover:bg-gray-50"
                                      disabled={!item.inStock || cartLoading}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-12 text-center font-semibold text-lg py-2">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          item.quantity + 1
                                        )
                                      }
                                      variant="ghost"
                                      size="sm"
                                      className="p-2 hover:bg-gray-50"
                                      disabled={
                                        !item.inStock ||
                                        cartLoading ||
                                        item.quantity >= item.availableStock
                                      }
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Item Total */}
                                <p
                                  className={`text-lg font-bold mb-4 ${
                                    item.inStock
                                      ? "text-blue-600"
                                      : "text-gray-500"
                                  }`}
                                >
                                  Total: LKR{" "}
                                  {(item.price * item.quantity).toFixed(2)}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    onClick={() => saveForLater(cartItem)}
                                    variant="outline"
                                    size="sm"
                                    className="text-sm"
                                    disabled={wishlistLoading}
                                  >
                                    <Heart className="h-4 w-4 mr-1" />
                                    Save
                                  </Button>
                                  <Button
                                    onClick={() => removeItem(item.id)}
                                    variant="outline"
                                    size="sm"
                                    className="!text-red-600 hover:!text-white  hover:bg-red-500 hover:border-red-500 border-red-500"
                                    disabled={cartLoading}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 bg-white rounded-lg shadow-sm p-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                  />
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">
                      Order Summary
                    </h3>
                    {selectedItems.size > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedItems.size} item
                        {selectedItems.size !== 1 ? "s" : ""} selected
                      </p>
                    )}
                  </div>

                  <div className="p-6">
                    {/* ✅ ENHANCED: Handle different states */}
                    {allItemsOutOfStock ? (
                      <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <p className="text-red-600 mb-4 font-medium">
                          All items are out of stock
                        </p>
                        <p className="text-gray-500 text-sm mb-4">
                          Remove items or wait for them to be restocked
                        </p>
                        <Button
                          onClick={() => navigate("/")}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          Continue Shopping
                        </Button>
                      </div>
                    ) : selectedItems.size === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">
                          Select items to see order summary
                        </p>
                        <Button
                          onClick={() => handleSelectAll(true)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                          disabled={inStockItems.length === 0}
                        >
                          Select All Available Items
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Price Breakdown */}
                        <div className="space-y-3">
                          <div className="flex justify-between text-base">
                            <span className="text-gray-600">
                              Subtotal ({selectedItemCount} items)
                            </span>
                            <span className="font-semibold">
                              LKR {subtotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-base">
                            <span className="text-gray-600">Shipping</span>
                            <span
                              className={
                                finalShipping === 0
                                  ? "text-green-600 font-semibold"
                                  : "font-semibold"
                              }
                            >
                              {finalShipping === 0
                                ? "FREE"
                                : `LKR ${finalShipping.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="flex justify-between text-base">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-semibold">
                              LKR {tax.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between text-xl font-bold">
                            <span>Total</span>
                            <span className="text-blue-600">
                              LKR {total.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Checkout Button */}
                        <Button
                          className="w-full py-3 text-lg font-semibold cursor-pointer"
                          size="lg"
                          onClick={handleNavigateCheckout}
                          disabled={
                            selectedItems.size === 0 ||
                            cartLoading ||
                            allItemsOutOfStock
                          }
                        >
                          <CreditCard className="h-5 w-5 mr-2" />
                          Proceed to Checkout
                        </Button>

                        {/* Security Features */}
                        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mt-4">
                          <div className="flex items-center justify-center space-x-2 bg-gray-50 rounded-lg p-3">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span className="font-medium">Secure Checkout</span>
                          </div>
                          <div className="flex items-center justify-center space-x-2 bg-gray-50 rounded-lg p-3">
                            <Truck className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Free Returns</span>
                          </div>
                        </div>

                        {/* Free Shipping Progress */}
                        {!freeShipping && subtotal < 75 && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center text-blue-700 text-sm mb-2">
                              <Truck className="h-4 w-4 mr-2" />
                              <span className="font-medium">
                                Add LKR {(75 - subtotal).toFixed(2)} more for
                                FREE shipping!
                              </span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${Math.min(
                                    (subtotal / 75) * 100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartPage;
