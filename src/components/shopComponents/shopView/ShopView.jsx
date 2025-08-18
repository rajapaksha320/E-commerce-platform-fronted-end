/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  MessageSquare,
  Grid,
  List,
  SlidersHorizontal,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  ArrowLeft,
  Search,
  ChevronDown,
  Filter,
  X,
  Menu,
  Loader,
  Loader2,
  AlertCircle,
  Building,
  CheckCircle,
} from "lucide-react";

import { Button, Badge, ContactCard as Card } from "../../ui/ContactUis/Uis";
import Tabs from "../../ui/shopUis/Tabs";
import FilterSidebar from "./FilterSidebar";
import ShopHeader from "./ShopHeader";
import ReviewsSection from "./ReviewsSection";
import Pagination from "../../ui/ContactUis/Pagination";
import ToastNotification, { useToast } from "../../ui/ToastNotification";
import useUser from "../../../hooks/useUser";
import { useSelector } from "react-redux";
import { selectUser as selectAuthUser } from "../../../store/slices/authSlice";

const ShopView = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);

  // Toast notification hook
  const { toastRef, showToast } = useToast();

  // Redux hooks
  const {
    currentShopDetails,
    shopDetailLoading,
    shopDetailError,
    storeListings,
    storesLoading,
    storesError,
    storeSearchResults,
    storeSearchLoading,
    storeSearchError,
    lastStoreSearchParams,
    shopReviews,
    reviewsLoading,
    reviewsError,
    storesPagination,
    fetchWishlist,
    storeSearchPagination,
    fetchShopDetailsById,
    fetchShopListings,
    searchProductsInStore,
    resetShopDetail,
    addItemToCart,
    quickToggleWishlist,
    isItemInProductWishlist,
    isItemInShopWishlist,
    isItemInCart,
    fetchShopReviews,
    removeFromWishlist,
    fetchCartItems,
  } = useUser();

  // Component state
  const [activeTab, setActiveTab] = useState("home");
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("best_match");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [addingToCart, setAddingToCart] = useState(new Set());

  const [filters, setFilters] = useState({
    categoryMain: "",
    PriceRange: "",
    CustomerRating: 0,
    color: "",
    brandName: "",
  });

  // Get seller ID from shop details for listings
  const sellerId = currentShopDetails?.sellerId;

  const realShopStats = useMemo(() => {
    // Calculate review count and average rating from shopReviews
    const reviewCount = shopReviews?.length || 0;

    let averageRating = 0;
    if (shopReviews && shopReviews.length > 0) {
      let totalRatingSum = 0;
      let totalRatingCount = 0;

      shopReviews.forEach((review) => {
        const ratings = [
          review.shoppingExperience,
          review.customerService,
          review.productQuality,
          review.deliverySpeed,
        ].filter((rating) => rating > 0);

        if (ratings.length > 0) {
          const avgRating =
            ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
          totalRatingSum += avgRating;
          totalRatingCount++;
        }
      });

      averageRating =
        totalRatingCount > 0 ? totalRatingSum / totalRatingCount : 0;
    }

    // Calculate product count from storeListings
    const productCount = storesPagination?.total || storeListings?.length || 0;

    // Get sales count from shop data
    const totalSales = currentShopDetails?.totalSales || 0;

    return {
      reviewCount,
      averageRating,
      productCount,
      totalSales,
    };
  }, [shopReviews, storeListings, storesPagination, currentShopDetails]);

  // Determine which products to show and pagination info
  const { currentProducts, pagination, isSearchMode } = useMemo(() => {
    const hasActiveFilters =
      searchQuery ||
      filters.categoryMain ||
      filters.PriceRange ||
      filters.CustomerRating ||
      filters.color ||
      filters.brandName;

    if (hasActiveFilters) {
      return {
        currentProducts: storeSearchResults || [],
        pagination: storeSearchPagination,
        isSearchMode: true,
      };
    } else {
      return {
        currentProducts: storeListings || [],
        pagination: storesPagination,
        isSearchMode: false,
      };
    }
  }, [
    storeSearchResults,
    storeListings,
    storeSearchPagination,
    storesPagination,
    searchQuery,
    filters,
  ]);

  const isLoading = useMemo(() => {
    if (isSearchMode) {
      return storeSearchLoading;
    }
    return storesLoading;
  }, [storeSearchLoading, storesLoading, isSearchMode]);

  const error = useMemo(() => {
    if (isSearchMode) {
      return storeSearchError;
    }
    return storesError;
  }, [storeSearchError, storesError, isSearchMode]);

  // Fetch shop data
  useEffect(() => {
    if (shopId) {
      fetchShopDetailsById(shopId);
    }

    return () => {
      resetShopDetail();
    };
  }, [shopId, fetchShopDetailsById, resetShopDetail]);

  // This ensures we have data for accurate stats calculation on initial load
  useEffect(() => {
    if (sellerId) {
      fetchShopListings(sellerId, 1, itemsPerPage);
    }
  }, [sellerId, fetchShopListings, itemsPerPage]);

  // Fetch additional pages only when on products tab and navigating pages
  useEffect(() => {
    if (sellerId && activeTab === "products" && currentPage > 1) {
      fetchShopListings(sellerId, currentPage, itemsPerPage);
    }
  }, [sellerId, activeTab, currentPage, fetchShopListings, itemsPerPage]);

  useEffect(() => {
    if (shopId) {
      // Fetch all reviews to get accurate count and rating
      fetchShopReviews(shopId, 1, 100);
    }
  }, [shopId, fetchShopReviews]);

  // Handle search and filters
  useEffect(() => {
    if (
      sellerId &&
      (searchQuery ||
        filters.categoryMain ||
        filters.PriceRange ||
        filters.CustomerRating ||
        filters.color ||
        filters.brandName)
    ) {
      const searchParams = {
        categoryMain: filters.categoryMain,
        PriceRange: filters.PriceRange,
        CustomerRating: filters.CustomerRating,
        color: filters.color,
        brandName: filters.brandName,
        title: searchQuery, 
      };

      searchProductsInStore(sellerId, searchParams, currentPage, itemsPerPage);
    }
  }, [
    sellerId,
    searchQuery,
    filters,
    currentPage,
    itemsPerPage,
    searchProductsInStore,
  ]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, sortBy]);

  // Define tabs with proper counts from backend
  const tabs = [
    { id: "home", name: "Shop Home", icon: Home },
    {
      id: "products",
      name: "Products",
      icon: Package,
    },
    {
      id: "feedback",
      name: "Reviews",
      icon: MessageSquare,
    },
  ];

  const sortOptions = [
    { id: "best_match", name: "Best Match" },
    { id: "newest", name: "Newest First" },
    { id: "price_low", name: "Price: Low to High" },
    { id: "price_high", name: "Price: High to Low" },
    { id: "rating", name: "Highest Rated" },
    { id: "reviews", name: "Most Reviews" },
    { id: "discount", name: "Highest Discount" },
  ];

  const handleFiltersChange = (newFilters) => {
    // Convert UI filters to API format
    const apiFilters = {
      categoryMain: newFilters.categories || "",
      PriceRange:
        newFilters.priceRange?.min && newFilters.priceRange?.max
          ? `${newFilters.priceRange.min}-${newFilters.priceRange.max}`
          : "",
      CustomerRating: newFilters.rating || 0,
      color: newFilters.colors?.[0] || "",
      brandName: newFilters.brands || "",
    };

    setFilters(apiFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      categoryMain: "",
      PriceRange: "",
      CustomerRating: 0,
      color: "",
      brandName: "",
    });
    setSearchQuery("");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = async (product) => {
    if (!authUser) {
      navigate("/login");
      return;
    }

    // Check if already in cart
    if (isItemInCart(product._id)) {
      showToast.success("Item is already in your cart", {
        text: "View Cart",
        action: () => navigate("/shopping-cart"),
      });
      return;
    }

    // Set loading state for this specific product
    setAddingToCart((prev) => new Set(prev).add(product._id));

    try {
      await addItemToCart(authUser._id, product._id, 1);

      // Refresh cart items to update status
      await fetchCartItems(authUser._id, 1, 100);

      const productName = product.title || product.name || "Product";
      showToast.success(`"${productName}" added to cart successfully!`, {
        text: "View Cart",
        action: () => navigate("/shopping-cart"),
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast.error("Failed to add to cart. Please try again.");
    } finally {
      // Remove loading state for this specific product
      setAddingToCart((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
    }
  };

  const handleToggleFavorite = async (product) => {
    if (!authUser) {
      navigate("/login");
      return;
    }

    try {
      const productName = product.title || product.name || "Product";
      const productId = product._id;
      const wasInWishlist = isItemInProductWishlist(productId);

      if (wasInWishlist) {
        await removeFromWishlist(authUser._id, productId);
        showToast.success(`"${productName}" removed from wishlist`);
      } else {
        await quickToggleWishlist(authUser._id, productId, "product");
        showToast.success(`"${productName}" added to wishlist!`, {
          text: "View Wishlist",
          action: () => navigate("/wishlist"),
        });
      }

      await fetchWishlist(authUser._id);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      showToast.error("Failed to update wishlist. Please try again.");
    }
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`);
  };

  const getActualProductCount = () => {
    // Use pagination total if available
    if (storesPagination?.total) {
      return storesPagination.total;
    }

    // Use current listings length as fallback
    if (storeListings?.length) {
      return storeListings.length;
    }

    // Use shop's totalProducts as last resort
    return currentShopDetails?.totalProducts || 0;
  };

  const getBadgeVariant = (badge) => {
    const variants = {
      "Best Seller": "success",
      "New Arrival": "primary",
      Popular: "warning",
      Premium: "purple",
      Sale: "danger",
      Featured: "info",
    };
    return variants[badge] || "default";
  };

  const getProductBadge = (product) => {
    if (
      product.variations?.[0]?.originalPrice > product.variations?.[0]?.price
    ) {
      return "Sale";
    }
    if (
      new Date(product.createdAt) >
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ) {
      return "New Arrival";
    }
    return null;
  };

  const getProductDiscount = (product) => {
    const variation = product.variations?.[0];
    if (variation?.originalPrice && variation?.price) {
      const original = parseFloat(variation.originalPrice);
      const current = parseFloat(variation.price);
      if (original > current) {
        return Math.round(((original - current) / original) * 100);
      }
    }
    return 0;
  };

  const getCartButtonContent = (product) => {
    const productId = product._id;
    const isLoadingThisItem = addingToCart.has(productId);
    const inCart = isItemInCart(productId);
    const isOutOfStock =
      product.status !== "active" ||
      parseInt(product.variations?.[0]?.quantity || 0) <= 0;

    if (isLoadingThisItem) {
      return {
        text: "Adding...",
        icon: <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />,
        disabled: true,
        variant: "primary",
      };
    }

    if (inCart) {
      return {
        text: "Added to Cart",
        icon: <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />,
        disabled: false,
        variant: "success",
      };
    }

    if (isOutOfStock) {
      return {
        text: "Out of Stock",
        icon: <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />,
        disabled: true,
        variant: "outline",
      };
    }

    return {
      text: "Add to Cart",
      icon: <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />,
      disabled: false,
      variant: "primary",
    };
  };

  const renderProductCard = (product) => {
    const variation = product.variations?.[0];
    const price = parseFloat(variation?.price || 0);
    const originalPrice = parseFloat(variation?.originalPrice || 0);
    const badge = getProductBadge(product);
    const discount = getProductDiscount(product);
    const isInStock =
      product.status === "active" && parseInt(variation?.quantity || 0) > 0;
    const rating = parseFloat(product.averageRating || 0);
    const isFavorite = authUser ? isItemInProductWishlist(product._id) : false;

    const cartButton = getCartButtonContent(product);

    return (
      <Card
        key={product._id}
        className={`group overflow-hidden hover:shadow-lg transition-all duration-300 h-full cursor-pointer ${
          viewMode === "list" ? "flex flex-col sm:flex-row" : "flex flex-col"
        }`}
        padding={false}
        onClick={() => handleProductClick(product)}
      >
        {/* Product Image */}
        <div
          className={`relative overflow-hidden flex-shrink-0 ${
            viewMode === "list"
              ? "h-48 sm:h-64 sm:w-64"
              : "h-48 sm:h-56 md:h-64"
          }`}
        >
          <img
            src={
              variation?.images?.[0]?.url ||
              product.images?.[0]?.url ||
              "/placeholder-product.jpg"
            }
            alt={variation?.images?.[0]?.alt || product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {badge && (
              <Badge variant={getBadgeVariant(badge)} size="sm">
                {badge}
              </Badge>
            )}
            {!isInStock && (
              <Badge variant="danger" size="sm">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2 right-2">
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{discount}%
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-10 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite(product);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors touch-manipulation ${
                isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-white/90 text-gray-600 hover:text-red-500"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle quick view
              }}
              className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 transition-colors touch-manipulation"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Features */}
          <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
            {product.shippingClass?.shippingClass === "free" && (
              <Badge variant="success" size="sm">
                Free Ship
              </Badge>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
              {product.brand}
            </p>
          )}

          {/* Title */}
          <div className="mb-2 h-10 sm:h-12 flex items-start">
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight text-sm sm:text-base">
              {product.title}
            </h3>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2 sm:mb-3 h-4 sm:h-5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
              {rating > 0 ? rating.toFixed(1) : "No rating"}
            </span>
          </div>

          {/* Colors */}
          <div className="mb-2 sm:mb-3 h-5 sm:h-6">
            {variation?.color && variation.color.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">Colors:</span>
                {variation.color.slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
                {variation.color.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{variation.color.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Price */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-base sm:text-lg font-bold text-gray-900">
                  LKR {price.toFixed(2)}
                </span>
                {originalPrice > price && (
                  <span className="text-xs sm:text-sm text-gray-500 line-through">
                    LKR {originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            {discount > 0 && (
              <Badge variant="success" size="sm">
                Save LKR {(originalPrice - price).toFixed(2)}
              </Badge>
            )}
          </div>

          <Button
            variant={cartButton.variant}
            size="sm"
            className={`w-full mt-auto touch-manipulation text-xs sm:text-sm py-2 sm:py-2.5 ${
              cartButton.variant === "success"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : ""
            }`}
            disabled={cartButton.disabled}
            onClick={(e) => {
              e.stopPropagation();
              if (!cartButton.disabled && cartButton.variant !== "success") {
                handleAddToCart(product);
              } else if (cartButton.variant === "success") {
                navigate("/shopping-cart");
              }
            }}
          >
            {cartButton.icon}
            {cartButton.text}
          </Button>
        </div>
      </Card>
    );
  };

  // Loading state
  if (shopDetailLoading && !currentShopDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading shop details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (shopDetailError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 touch-manipulation"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </div>
        </div>

        {/* Error Content */}
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="text-center max-w-md mx-auto">
            {/* Animated Error Icon */}
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                <Package className="h-12 w-12 text-red-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Shop Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              We couldn't find the shop you're looking for.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              The shop may have been removed, or the link might be incorrect.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/shops")}
                variant="primary"
                size="lg"
                className="w-full"
              >
                <Package className="h-5 w-5 mr-2" />
                Browse All Shops
              </Button>

              <Button
                onClick={() => navigate("/")}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <Home className="h-5 w-5 mr-2" />
                Go to Homepage
              </Button>

              <Button
                onClick={() => navigate(-1)}
                variant="ghost"
                size="lg"
                className="w-full"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Help Section */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Need Help?
              </h3>
              <p className="text-xs text-blue-700">
                If you believe this is an error, please contact our support
                team.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No shop data
  if (!currentShopDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 touch-manipulation"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </div>
        </div>

        {/* No Data Content */}
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="text-center max-w-md mx-auto">
            {/* Empty State Icon */}
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-8">
              <Package className="h-12 w-12 text-gray-400" />
            </div>

            {/* Empty State Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Shop Unavailable
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              This shop is currently not available or doesn't exist.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/shops")}
                variant="primary"
                size="lg"
                className="w-full"
              >
                <Package className="h-5 w-5 mr-2" />
                Explore Other Shops
              </Button>

              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification Component */}
      <ToastNotification ref={toastRef} />

      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 touch-manipulation"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Shops</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <ShopHeader
          shop={currentShopDetails}
          className="mb-6 sm:mb-8"
          realStats={realShopStats}
          onWishlistUpdate={(message, type, action) => {
            if (type === "success") {
              showToast.success(message, action);
            } else if (type === "error") {
              showToast.error(message, action);
            }
          }}
        />

        {/* Tabs */}
        <div className="mb-6 sm:mb-8">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="underline"
            className="overflow-x-auto"
          />
        </div>

        {/* Tab Content */}
        {activeTab === "home" && (
          <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <Card className="text-center p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
                  {realShopStats.productCount}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Products</div>
              </Card>
              <Card className="text-center p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">
                  {realShopStats.averageRating.toFixed(1)}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Rating</div>
              </Card>
              <Card className="text-center p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">
                  {realShopStats.reviewCount}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Reviews</div>
              </Card>
              <Card className="text-center p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">
                  {realShopStats.totalSales}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Sales</div>
              </Card>
            </div>

            {/* Featured Products */}
            {storeListings && storeListings.length > 0 && (
              <Card className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  Featured Products
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {storeListings.slice(0, 3).map(renderProductCard)}
                </div>
                <div className="mt-6 text-center">
                  <Button
                    onClick={() => setActiveTab("products")}
                    variant="outline"
                  >
                    View All Products
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === "products" && (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                filters={{
                  categories: filters.categoryMain || null,
                  priceRange: filters.PriceRange
                    ? {
                        min: parseInt(filters.PriceRange.split("-")[0]),
                        max: parseInt(filters.PriceRange.split("-")[1]),
                      }
                    : {},
                  rating: filters.CustomerRating,
                  brands: filters.brandName || null,
                  colors: filters.color ? [filters.color] : [],
                }}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Search and Controls */}
              <Card className="p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="space-y-3 sm:space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {/* Mobile Filter Toggle */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMobileFilters(!showMobileFilters)}
                      className="lg:hidden flex items-center justify-center touch-manipulation"
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                      {(filters.categoryMain ||
                        filters.PriceRange ||
                        filters.CustomerRating ||
                        filters.color ||
                        filters.brandName) && (
                        <Badge variant="primary" size="sm" className="ml-2">
                          Active
                        </Badge>
                      )}
                    </Button>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
                      {/* Sort */}
                      <div className="flex-1 sm:flex-initial">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
                        >
                          {sortOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* View Mode */}
                      <div className="flex border border-gray-300 rounded-lg overflow-hidden w-fit">
                        <button
                          type="button"
                          onClick={() => setViewMode("grid")}
                          className={`p-2 transition-colors touch-manipulation ${
                            viewMode === "grid"
                              ? "bg-blue-600 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <Grid className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode("list")}
                          className={`p-2 transition-colors touch-manipulation ${
                            viewMode === "list"
                              ? "bg-blue-600 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <List className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Results Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      {pagination ? (
                        <>
                          Showing {(currentPage - 1) * itemsPerPage + 1}-
                          {Math.min(
                            currentPage * itemsPerPage,
                            pagination.total || pagination.totalItems || 0
                          )}{" "}
                          of {pagination.total || pagination.totalItems || 0}{" "}
                          products
                        </>
                      ) : (
                        `Showing ${currentProducts.length} products`
                      )}
                    </div>

                    {/* Active Filters Indicator */}
                    <div className="flex items-center gap-2">
                      {(filters.categoryMain ||
                        filters.PriceRange ||
                        filters.CustomerRating ||
                        filters.color ||
                        filters.brandName ||
                        searchQuery) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearFilters}
                          className="text-gray-600 touch-manipulation"
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden sm:inline">Clear All</span>
                          <span className="sm:hidden">Clear</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Mobile Filters */}
              {showMobileFilters && (
                <div className="lg:hidden mb-4 sm:mb-6">
                  <FilterSidebar
                    filters={{
                      categories: filters.categoryMain || null,
                      priceRange: filters.PriceRange
                        ? {
                            min: parseInt(filters.PriceRange.split("-")[0]),
                            max: parseInt(filters.PriceRange.split("-")[1]),
                          }
                        : {},
                      rating: filters.CustomerRating,
                      brands: filters.brandName || null,
                      colors: filters.color ? [filters.color] : [],
                    }}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              )}

              {/* Products Grid */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                  <span className="text-gray-600">Loading products...</span>
                </div>
              ) : error ? (
                <Card className="text-center p-8 sm:p-12">
                  <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                    Error Loading Products
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-4">
                    {error}
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="touch-manipulation"
                  >
                    Try Again
                  </Button>
                </Card>
              ) : currentProducts.length > 0 ? (
                <>
                  <div
                    className={`grid gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 ${
                      viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {currentProducts.map(renderProductCard)}
                  </div>

                  {/* Pagination - Only show if we have backend pagination data */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-center">
                      <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                        itemsPerPage={itemsPerPage}
                        totalItems={pagination.totalItems}
                      />
                    </div>
                  )}
                </>
              ) : (
                <Card className="text-center p-8 sm:p-12">
                  <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-4">
                    This shop doesn't have any products yet or they don't match
                    your search criteria.
                  </p>
                  <Button
                    onClick={handleClearFilters}
                    className="touch-manipulation"
                  >
                    Clear Filters
                  </Button>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === "feedback" && <ReviewsSection shopId={shopId} />}
      </div>
    </div>
  );
};

export default ShopView;
