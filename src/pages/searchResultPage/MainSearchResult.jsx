/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Search,
  Grid,
  List,
  SlidersHorizontal,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  ArrowLeft,
  ChevronDown,
  Filter,
  X,
  Menu,
  Package,
  Truck,
  MapPin,
  Loader,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";
import SearchFilters from "./SearchFilters";
import Pagination from "../../components/ui/ContactUis/Pagination";
import ToastNotification, {
  useToast,
} from "../../components/ui/ToastNotification";
import useUser from "../../hooks/useUser";
import { useSelector } from "react-redux";
import { selectUser as selectAuthUser } from "../../store/slices/authSlice";

const MainSearchResult = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);

  // Toast notification hook
  const { toastRef, showToast } = useToast();

  // Redux hooks
  const {
    searchResults,
    searchPagination,
    searchLoading,
    searchError,
    lastSearchParams,
    searchAllProducts,
    addItemToCart,
    quickToggleWishlist,
    isItemInProductWishlist,
    isItemInCart,
    fetchWishlist,
    fetchCartItems,
    removeFromWishlist,
    resetSearchResults,
  } = useUser();

  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState("best_match");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [addingToCart, setAddingToCart] = useState(new Set());

  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: null, max: null },
    rating: null,
    freeShipping: false,
    inStock: false,
    fastDelivery: false,
    verified: false,
    brands: [],
    colors: [],
    sizes: [],
    locations: [],
    conditions: [],
  });

  const sortOptions = [
    { id: "best_match", name: "Best Match" },
    { id: "newest", name: "Newest First" },
    { id: "price_low", name: "Price: Low to High" },
    { id: "price_high", name: "Price: High to Low" },
    { id: "rating", name: "Highest Rated" },
    { id: "reviews", name: "Most Reviews" },
    { id: "discount", name: "Highest Discount" },
    { id: "popular", name: "Most Popular" },
  ];

  useEffect(() => {
    const queryFromUrl = searchParams.get("q");
    if (queryFromUrl && queryFromUrl !== searchQuery) {
      setSearchQuery(queryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const searchApiParams = {
      categoryMain: filters.categories?.[0] || "",
      PriceRange:
        filters.priceRange?.min && filters.priceRange?.max
          ? `${filters.priceRange.min}-${filters.priceRange.max}`
          : "",
      CustomerRating: filters.rating || 0,
      color: filters.colors?.[0] || "",
      brandName: filters.brands?.[0] || "",
      title: searchQuery || "",
    };

    searchAllProducts(searchApiParams, currentPage, itemsPerPage);
  }, [searchQuery, filters, currentPage, itemsPerPage, searchAllProducts]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, sortBy]);

  // Update URL when search query changes
  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      priceRange: { min: null, max: null },
      rating: null,
      freeShipping: false,
      inStock: false,
      fastDelivery: false,
      verified: false,
      brands: [],
      colors: [],
      sizes: [],
      locations: [],
      conditions: [],
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

      const productName = product.title || "Product";
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
      const productName = product.title || "Product";
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

      // Refresh wishlist data
      await fetchWishlist(authUser._id);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      showToast.error("Failed to update wishlist. Please try again.");
    }
  };

  const getBadgeVariant = (badge) => {
    const variants = {
      "Best Seller": "success",
      "New Arrival": "primary",
      Popular: "warning",
      Premium: "purple",
      Sale: "danger",
      Featured: "info",
      Trending: "warning",
    };
    return variants[badge] || "default";
  };

  const getProductBadge = (product) => {
    const variation = product.variations?.[0];
    if (variation?.originalPrice > variation?.price) {
      return "Sale";
    }
    if (
      new Date(product.createdAt) >
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ) {
      return "New Arrival";
    }
    if (product.status === "active") {
      return "Featured";
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
        shortText: "Adding...",
        icon: (
          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
        ),
        disabled: true,
        variant: "primary",
      };
    }

    if (inCart) {
      return {
        text: "Added to Cart",
        shortText: "Added",
        icon: <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />,
        disabled: false,
        variant: "success",
      };
    }

    if (isOutOfStock) {
      return {
        text: "Out of Stock",
        shortText: "No Stock",
        icon: <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />,
        disabled: true,
        variant: "outline",
      };
    }

    return {
      text: "Add to Cart",
      shortText: "Cart",
      icon: <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />,
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
    const isFreeShipping = product.shippingClass?.shippingClass === "free";
    const isExpressShipping =
      product.shippingClass?.shippingClass === "express";

    const cartButton = getCartButtonContent(product);

    return (
      <Card
        key={product._id}
        className={`group overflow-hidden hover:shadow-lg transition-all duration-300 h-full cursor-pointer ${
          viewMode === "list" ? "flex flex-col md:flex-row" : "flex flex-col"
        }`}
        padding={false}
        onClick={() => navigate(`/product/${product._id}`)}
      >
        {/* Product Image */}
        <div
          className={`relative overflow-hidden flex-shrink-0 ${
            viewMode === "list"
              ? "h-48 md:h-64 md:w-64"
              : "h-56 sm:h-64 md:h-72"
          }`}
        >
          <img
            src={
              variation?.images?.[0]?.url ||
              product.images?.[0]?.url ||
              "/placeholder-product.jpg"
            }
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {/* {badge && (
              <Badge variant={getBadgeVariant(badge)} size="sm">
                {badge}
              </Badge>
            )} */}
            {!isInStock && (
              <Badge variant="danger" size="sm">
                Out of Stock
              </Badge>
            )}
            {product.status === "active" && (
              <Badge variant="success" size="sm">
                Available
              </Badge>
            )}
          </div>


          {/* Action Buttons */}
          <div className="absolute top-2 right-5 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors touch-manipulation ${
                isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-white/90 text-gray-600 hover:text-red-500"
              }`}
              aria-label="Add to wishlist"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite(product);
              }}
            >
              <Heart
                className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
              />
            </button>
            <button
              className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 transition-colors touch-manipulation"
              aria-label="Quick view"
              onClick={(e) => {
                e.stopPropagation();
                // Handle quick view - could open modal
              }}
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Features */}
          <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
            {isFreeShipping && (
              <Badge variant="success" size="sm">
                Free Ship
              </Badge>
            )}
            {isExpressShipping && (
              <Badge variant="warning" size="sm">
                Express
              </Badge>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
          {/* Brand */}
          {product.brand && (
            <div className="mb-2">
              <span className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                {product.brand}
              </span>
            </div>
          )}

          {/* Title */}
          <div className="mb-3 h-12 sm:h-14 flex items-start">
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight text-sm sm:text-base md:text-lg">
              {product.title}
            </h3>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3 sm:mb-4 h-5 sm:h-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm sm:text-base text-gray-600 whitespace-nowrap">
              {rating > 0 ? rating.toFixed(1) : "No rating"}
            </span>
          </div>

          {/* Features */}
          <div className="mb-3 sm:mb-4 h-6 sm:h-7 flex items-center gap-2">
            {isFreeShipping && (
              <div className="flex items-center text-sm text-green-600">
                <Truck className="h-4 w-4 mr-1" />
                Free Ship
              </div>
            )}
            {product.category?.main && (
              <div className="flex items-center text-sm text-gray-500">
                <Package className="h-4 w-4 mr-1" />
                {product.category.main}
              </div>
            )}
          </div>

          {/* Colors */}
          {variation?.color && variation.color.length > 0 && (
            <div className="mb-3 sm:mb-4 h-6 sm:h-7">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">Colors:</span>
                {variation.color.slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
                {variation.color.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{variation.color.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  LKR {price.toFixed(2)}
                </span>
                {originalPrice > price && (
                  <span className="text-sm sm:text-base text-gray-500 line-through">
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

          <div className="flex gap-2 sm:gap-3">
            <Button
              variant={cartButton.variant}
              size="sm"
              className={`flex-1 text-xs sm:text-sm py-3 sm:py-3.5 px-3 sm:px-4 touch-manipulation font-semibold ${
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
              <span className="hidden sm:inline">{cartButton.text}</span>
              <span className="sm:hidden">{cartButton.shortText}</span>
            </Button>

            {isInStock && cartButton.variant !== "success" && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs sm:text-sm py-3 sm:py-3.5 px-3 sm:px-4 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors touch-manipulation font-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/checkout?product=${product._id}&quantity=1`);
                }}
              >
                <span className="hidden sm:inline">Buy It Now</span>
                <span className="sm:hidden">Buy Now</span>
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  // Get current page products from Redux state
  const currentProducts = searchResults || [];
  const totalItems = searchPagination?.totalItems || 0;
  const totalPages = searchPagination?.totalPages || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification Component */}
      <ToastNotification ref={toastRef} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 touch-manipulation"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="text-center flex-1 mx-4">
              <div className="text-sm sm:text-lg font-semibold text-gray-900">
                {searchQuery ? "Search Results" : "All Products"}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                {totalItems.toLocaleString()} products found
                {searchQuery && ` for "${searchQuery}"`}
              </div>
            </div>
            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden xl:block w-80 2xl:w-96 flex-shrink-0">
            <SearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              resultsCount={totalItems}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Controls Header */}
            <Card className="p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="space-y-3 sm:space-y-4">
                {/* Main Controls Row */}
                <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 lg:items-center">
                  {/* Mobile Filter Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="xl:hidden flex items-center justify-center touch-manipulation"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {Object.values(filters).some((f) =>
                      Array.isArray(f)
                        ? f.length > 0
                        : typeof f === "boolean"
                        ? f
                        : f && typeof f === "object"
                        ? f.min || f.max
                        : f
                    ) && (
                      <Badge variant="primary" size="sm" className="ml-2">
                        Active
                      </Badge>
                    )}
                  </Button>

                  {/* Search Bar - In the middle */}
                  <div className="flex-1 max-w-2xl">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products, brands, categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm touch-manipulation"
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    </div>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden w-fit ml-auto lg:ml-0">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`p-2.5 transition-colors touch-manipulation ${
                        viewMode === "grid"
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      aria-label="Grid view"
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`p-2.5 transition-colors touch-manipulation ${
                        viewMode === "list"
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      aria-label="List view"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Results Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    {searchPagination ? (
                      <>
                        Showing {(currentPage - 1) * itemsPerPage + 1}-
                        {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                        {totalItems.toLocaleString()} products
                      </>
                    ) : (
                      `Showing ${currentProducts.length} products`
                    )}
                  </div>

                  {/* Clear Filters Button */}
                  {Object.entries(filters).some(([key, value]) => {
                    if (Array.isArray(value)) return value.length > 0;
                    if (typeof value === "boolean") return value;
                    if (typeof value === "object" && value !== null)
                      return value.min || value.max;
                    return value;
                  }) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearFilters}
                      className="text-gray-600 touch-manipulation"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Mobile Filters */}
            {showMobileFilters && (
              <div className="xl:hidden mb-4 sm:mb-6">
                <SearchFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                  resultsCount={totalItems}
                />
              </div>
            )}

            {/* Products Grid */}
            {searchLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                <span className="text-gray-600">Searching products...</span>
              </div>
            ) : searchError ? (
              <Card className="text-center p-8 sm:p-12">
                <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                  Error Loading Products
                </h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4">
                  {searchError}
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
                  className={`grid gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {currentProducts.map(renderProductCard)}
                </div>

                {/* Pagination */}
                {searchPagination && searchPagination.totalPages > 1 && (
                  <Pagination
                    currentPage={searchPagination.currentPage}
                    totalPages={searchPagination.totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={searchPagination.totalItems}
                    className="mt-6 sm:mt-8"
                  />
                )}
              </>
            ) : (
              <Card className="text-center p-8 sm:p-12">
                <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                  No Products Found
                </h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4">
                  {searchQuery
                    ? `No results found for "${searchQuery}". Try different keywords or adjust your filters.`
                    : Object.values(filters).some((f) =>
                        Array.isArray(f)
                          ? f.length > 0
                          : typeof f === "boolean"
                          ? f
                          : f && typeof f === "object"
                          ? f.min || f.max
                          : f
                      )
                    ? "No products match your current filters. Try adjusting your search criteria."
                    : "No products available at the moment."}
                </p>
                <div className="space-y-3">
                  {searchQuery && (
                    <Button
                      onClick={() => setSearchQuery("")}
                      variant="outline"
                      className="mr-2 touch-manipulation"
                    >
                      Clear Search
                    </Button>
                  )}
                  {Object.values(filters).some((f) =>
                    Array.isArray(f)
                      ? f.length > 0
                      : typeof f === "boolean"
                      ? f
                      : f && typeof f === "object"
                      ? f.min || f.max
                      : f
                  ) && (
                    <Button
                      onClick={handleClearFilters}
                      className="touch-manipulation"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSearchResult;
