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

  // Update select all state when cart items change
  useEffect(() => {
    if (cartItems.length > 0) {
      const allSelected = cartItems.every((item) =>
        selectedItems.has(item._id)
      );
      setSelectAll(allSelected);
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

  // Handle select all toggle
  const handleSelectAll = (isSelected) => {
    setSelectAll(isSelected);
    if (isSelected) {
      setSelectedItems(new Set(cartItems.map((item) => item._id)));
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

    // Get selected cart items with full data
    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.has(item._id)
    );

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
      if (listingId) {
        await addToWishlist([listingId], []);
        await removeItem(item._id);
        showToast.success("Item saved to wishlist");
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
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

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

  // ✅ ENHANCED: Calculate totals for selected items only
  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.has(item._id)
  );

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

  // Loading state
  if (cartLoading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (cartError && !cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <Card className="text-center p-8 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Cart
          </h3>
          <p className="text-gray-600 mb-4">{cartError}</p>
          <Button
            onClick={() =>
              buyerId && fetchCartItems(buyerId, currentPage, itemsPerPage)
            }
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <Card className="text-center p-8 max-w-md mx-auto">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Please Log In
          </h3>
          <p className="text-gray-600 mb-4">
            You need to be logged in to view your cart.
          </p>
          <Button onClick={() => navigate("/")}>Go to Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <ToastNotification ref={toastRef} />

      {/* Mobile-First Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => window.history.back()}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="min-w-0 z-10">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center truncate">
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">Shopping Cart</span>
                  <span className="sm:hidden">Cart</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                  {selectedItems.size > 0 && (
                    <span className="text-blue-600">
                      {" "}
                      • {selectedItems.size} selected
                    </span>
                  )}
                  {/* ✅ NEW: Enhanced cart metadata display */}
                  {cartMetadata && (
                    <span className="text-gray-500">
                      {" "}
                      • {cartMetadata.uniqueStores}{" "}
                      {cartMetadata.uniqueStores === 1 ? "store" : "stores"}
                    </span>
                  )}
                </p>
              </div>
            </div>
            {/* Mobile Cart Total - Selected Items */}
            <div className="sm:hidden">
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  LKR {total.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedItems.size > 0 ? "Selected" : "Total"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <Card className="text-center py-12 sm:py-16">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 flex items-center justify-center">
                <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Looks like you haven't added any items to your cart yet. Start
                exploring our amazing products!
              </p>
              <Button
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => navigate("/")}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Start Shopping
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items - Mobile First */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Header with Select All */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Cart Items
                    {cartLoading && (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600 ml-2 inline" />
                    )}
                  </h2>

                  {/* Select All Checkbox */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSelectAll(!selectAll)}
                      className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      disabled={cartLoading}
                    >
                      {selectAll ? (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                      <span className="hidden sm:inline">Select All</span>
                      <span className="sm:hidden">All</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant="primary" size="sm">
                    {cartItems.length} items
                  </Badge>
                  {selectedItems.size > 0 && (
                    <Badge variant="success" size="sm">
                      {selectedItems.size} selected
                    </Badge>
                  )}
                  {/* ✅ NEW: Enhanced badges */}
                  {cartMetadata && cartMetadata.uniqueStores > 1 && (
                    <Badge variant="secondary" size="sm">
                      {cartMetadata.uniqueStores} stores
                    </Badge>
                  )}
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4 sm:space-y-6">
                {cartItems.map((cartItem) => {
                  const item = getItemDetails(cartItem);
                  const isSelected = selectedItems.has(item.id);

                  return (
                    <Card
                      key={item.id}
                      className={`p-4 sm:p-6 hover:shadow-md transition-all duration-200 ${
                        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                      } ${!item.inStock ? "opacity-75 bg-gray-50" : ""}`}
                    >
                      <div className="space-y-4">
                        {/* Mobile Layout */}
                        <div className="sm:hidden">
                          <div className="flex space-x-4">
                            {/* Selection Checkbox */}
                            <div className="flex-shrink-0 pt-1">
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
                                  <Square className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                            </div>

                            {/* Image */}
                            <div className="flex-shrink-0 relative">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.src = "/placehold.png";
                                }}
                              />
                              {item.badge && (
                                <div className="absolute -top-1 -right-1">
                                  <Badge
                                    variant={getBadgeVariant(item.badge)}
                                    size="sm"
                                  >
                                    {item.badge}
                                  </Badge>
                                </div>
                              )}
                              {!item.inStock && (
                                <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                                  <span className="text-white text-xs font-medium bg-red-600 px-2 py-1 rounded">
                                    Out of Stock
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-blue-600 font-medium mb-1">
                                {item.brand}
                              </p>
                              <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">
                                {item.name}
                              </h3>

                              {/* ✅ NEW: Store information */}
                              {item.storeName && (
                                <p className="text-xs text-gray-500 mb-1">
                                  Store: {item.storeName}
                                </p>
                              )}

                              {/* Rating */}
                              <div className="flex items-center space-x-1 mb-2">
                                {renderStars(item.rating)}
                                <span className="text-xs text-gray-500 ml-1">
                                  {item.rating} (
                                  {item.totalReviews.toLocaleString()})
                                </span>
                              </div>

                              {/* Price */}
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-bold text-gray-900">
                                  LKR {item.price.toFixed(2)}
                                </span>
                                {item.originalPrice > item.price && (
                                  <span className="text-sm text-gray-500 line-through">
                                    LKR {item.originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>

                              {/* Stock info */}
                              {item.inStock && item.availableStock < 5 && (
                                <p className="text-xs text-orange-600 mb-2">
                                  Only {item.availableStock} left in stock
                                </p>
                              )}

                              {item.shippingFree && (
                                <div className="flex items-center text-green-600 text-xs mb-2">
                                  <Truck className="h-3 w-3 mr-1" />
                                  <span className="font-medium">
                                    Free Shipping
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                              <p className="font-bold text-gray-900">
                                LKR {(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {/* Mobile Actions */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            {/* Quantity */}
                            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
                              <Button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                variant="ghost"
                                size="sm"
                                className="p-1 h-8 w-8"
                                disabled={!item.inStock || cartLoading}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-semibold text-sm">
                                {item.quantity}
                              </span>
                              <Button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                variant="ghost"
                                size="sm"
                                className="p-1 h-8 w-8"
                                disabled={
                                  !item.inStock ||
                                  cartLoading ||
                                  item.quantity >= item.availableStock
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center space-x-2">
                              <Button
                                onClick={() => saveForLater(cartItem)}
                                variant="outline"
                                size="sm"
                                className="text-xs px-3"
                                disabled={wishlistLoading}
                              >
                                <Heart className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                              <Button
                                onClick={() => removeItem(item.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                                disabled={cartLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden sm:block">
                          <div className="flex space-x-6">
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
                                  <Square className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                            </div>

                            {/* Image */}
                            <div className="flex-shrink-0 relative">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-24 h-24 lg:w-28 lg:h-28 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.src = "/placehold.png";
                                }}
                              />
                              {item.badge && (
                                <div className="absolute -top-2 -left-2">
                                  <Badge
                                    variant={getBadgeVariant(item.badge)}
                                    size="sm"
                                  >
                                    {item.badge}
                                  </Badge>
                                </div>
                              )}
                              {!item.inStock && (
                                <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                                  <span className="text-white font-semibold text-sm bg-red-600 px-3 py-1 rounded-full">
                                    Out of Stock
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              <div className="mb-3">
                                <p className="text-sm text-blue-600 font-semibold mb-1">
                                  {item.brand}
                                </p>
                                <h3 className="font-semibold text-gray-900 text-base lg:text-lg mb-2">
                                  {item.name}
                                </h3>
                                {/* ✅ NEW: Store information */}
                                {item.storeName && (
                                  <p className="text-sm text-gray-500 mb-2">
                                    Store: {item.storeName}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center space-x-1 mb-3">
                                {renderStars(item.rating)}
                                <span className="text-sm text-gray-600 ml-2">
                                  {item.rating} (
                                  {item.totalReviews.toLocaleString()})
                                </span>
                              </div>

                              <div className="flex items-center space-x-3 mb-4">
                                <span className="font-bold text-gray-900 text-xl">
                                  LKR {item.price.toFixed(2)}
                                </span>
                                {item.originalPrice > item.price && (
                                  <span className="text-base text-gray-500 line-through">
                                    LKR {item.originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>

                              {/* Stock info */}
                              {item.inStock && item.availableStock < 5 && (
                                <p className="text-sm text-orange-600 mb-3">
                                  Only {item.availableStock} left in stock
                                </p>
                              )}

                              {item.shippingFree && (
                                <div className="flex items-center text-green-600 text-sm mb-4">
                                  <Truck className="h-4 w-4 mr-2" />
                                  <span className="font-medium">
                                    Free Shipping
                                  </span>
                                </div>
                              )}

                              {/* Desktop Actions */}
                              <div className="flex items-center space-x-4">
                                {/* Quantity Controls */}
                                <div className="flex items-center space-x-3 bg-white rounded-xl border border-gray-200 p-1">
                                  <Button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                    variant="ghost"
                                    size="sm"
                                    className="p-2"
                                    disabled={!item.inStock || cartLoading}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="w-10 text-center font-semibold text-lg">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                    variant="ghost"
                                    size="sm"
                                    className="p-2"
                                    disabled={
                                      !item.inStock ||
                                      cartLoading ||
                                      item.quantity >= item.availableStock
                                    }
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>

                                {/* Available Stock Display */}
                                {item.inStock && (
                                  <span className="text-sm text-gray-500">
                                    / {item.availableStock} available
                                  </span>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-2">
                                  <Button
                                    onClick={() => saveForLater(cartItem)}
                                    variant="outline"
                                    size="sm"
                                    className="text-sm"
                                    disabled={wishlistLoading}
                                  >
                                    <Heart className="h-4 w-4 mr-2" />
                                    Save
                                  </Button>
                                  <Button
                                    onClick={() => removeItem(item.id)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                                    disabled={cartLoading}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                              <p className="font-bold text-xl text-gray-900">
                                LKR {(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Cart Pagination */}
              {totalPages > 1 && (
                <div className="mt-6">
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

            {/* Order Summary - Selected Items Only */}
            <div className="lg:col-span-1 order-first lg:order-last">
              <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">
                {/* ✅ UPDATED: Mobile Checkout Button */}
                <div className="sm:hidden">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleNavigateCheckout}
                    disabled={selectedItems.size === 0 || cartLoading}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    {selectedItems.size === 0
                      ? "Select Items to Checkout"
                      : `Checkout (${selectedItems.size}) - LKR ${total.toFixed(
                          2
                        )}`}
                  </Button>
                </div>

                {/* Order Summary */}
                <Card>
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    Order Summary
                    {selectedItems.size > 0 && (
                      <Badge variant="primary" size="sm" className="ml-2">
                        {selectedItems.size} selected
                      </Badge>
                    )}
                  </h3>

                  {selectedItems.size === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm mb-2">
                        Select items to see order summary
                      </p>
                      <Button
                        onClick={() => handleSelectAll(true)}
                        variant="outline"
                        size="sm"
                      >
                        Select All Items
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Subtotal ({selectedItemCount} items)
                        </span>
                        <span className="font-semibold">
                          LKR {subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span
                          className={
                            finalShipping === 0
                              ? "text-green-600 font-semibold"
                              : "font-semibold"
                          }
                        >
                          {finalShipping === 0
                            ? "Free"
                            : `LKR ${finalShipping.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-semibold">
                          LKR {tax.toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-base font-bold">
                          <span>Total</span>
                          <span className="text-blue-600">
                            LKR {total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* ✅ NEW: Enhanced summary with store info */}
                      {selectedCartItems.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                            <div>
                              <span>Stores: </span>
                              <span className="font-medium">
                                {
                                  new Set(
                                    selectedCartItems
                                      .map(
                                        (item) => getItemDetails(item).storeId
                                      )
                                      .filter(Boolean)
                                  ).size
                                }
                              </span>
                            </div>
                            <div>
                              <span>Sellers: </span>
                              <span className="font-medium">
                                {
                                  new Set(
                                    selectedCartItems
                                      .map(
                                        (item) => getItemDetails(item).sellerId
                                      )
                                      .filter(Boolean)
                                  ).size
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ✅ UPDATED: Desktop Checkout */}
                  <div className="mt-6 space-y-4 hidden sm:block">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleNavigateCheckout}
                      disabled={selectedItems.size === 0 || cartLoading}
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      {selectedItems.size === 0
                        ? "Select Items to Checkout"
                        : `Checkout (${selectedItems.size} items)`}
                    </Button>

                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                      <div className="flex items-center justify-center space-x-2 bg-gray-50 rounded-lg p-3">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Secure</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 bg-gray-50 rounded-lg p-3">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Free Returns</span>
                      </div>
                    </div>
                  </div>

                  {/* Free Shipping Progress - Selected Items */}
                  {selectedItems.size > 0 && !freeShipping && subtotal < 75 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center text-blue-700 text-sm mb-2">
                        <Truck className="h-4 w-4 mr-2" />
                        <span className="font-medium">
                          Add LKR {(75 - subtotal).toFixed(2)} more for free
                          shipping!
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((subtotal / 75) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Trust Badges - Mobile */}
                <div className="sm:hidden grid grid-cols-3 gap-2 text-xs">
                  <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg border border-gray-200">
                    <Shield className="h-5 w-5 text-green-600 mb-1" />
                    <span className="font-medium text-gray-700">Secure</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg border border-gray-200">
                    <Truck className="h-5 w-5 text-blue-600 mb-1" />
                    <span className="font-medium text-gray-700">
                      Free Returns
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg border border-gray-200">
                    <Clock className="h-5 w-5 text-purple-600 mb-1" />
                    <span className="font-medium text-gray-700">Fast Ship</span>
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
