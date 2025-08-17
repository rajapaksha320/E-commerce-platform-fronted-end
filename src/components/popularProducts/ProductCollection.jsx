/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from "react";
import {
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Store,
  Grid,
  List,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Package,
  Loader2,
  AlertCircle,
  CheckCircle,
  Bell,
  Truck,
  Shield,
  Tag,
  MapPin,
} from "lucide-react";

import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";
import Pagination from "../../components/ui/ContactUis/Pagination";
import useUser from "../../hooks/useUser";
import { selectUser as selectAuthUser } from "../../store/slices/authSlice";
import ToastNotification, {
  useToast,
} from "../../components/ui/ToastNotification";

const ProductCollection = () => {
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);
  const [searchParams, setSearchParams] = useSearchParams();

  // Toast notification hook
  const { toastRef, showToast } = useToast();

  // Redux state and actions from useUser hook with fallbacks
  const userHook = useUser();
  const {
    searchResults,
    searchPagination,
    searchLoading,
    searchError,
    searchAllProducts,
    fetchStoresByCategory,
    addItemToCart,
    cartItems,
    fetchCartItems,
    isItemInCart,
    clearErrors,
    // Wishlist functions
    wishlist,
    wishlistLoading,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isItemInProductWishlist,
  } = userHook;

  // Safely get clearSearchResults with fallback
  const clearSearchResults =
    userHook.clearSearchResults ||
    (() => {
      console.warn("clearSearchResults function not available");
    });

  // UI States
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Cart operation states
  const [addingToCart, setAddingToCart] = useState(new Set());
  const [addingToWishlist, setAddingToWishlist] = useState(new Set());

  // Category data states
  const [categoryData, setCategoryData] = useState(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const itemsPerPage = 12;

  // Hardcoded category definitions for display
  const categoryDefinitions = {
    electronics: "Electronics & Technology",
    fashion: "Fashion & Apparel",
    home: "Home & Garden",
    beauty: "Health & Beauty",
    sports: "Sports & Fitness",
    food: "Food & Beverages",
    books: "Books & Media",
    automotive: "Automotive",
    toys: "Toys & Games",
    jewelry: "Jewelry & Accessories",
  };

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-2000", label: "LKR 0 - LKR 2,000" },
    { value: "2000-5000", label: "LKR 2,000 - LKR 5,000" },
    { value: "5000-10000", label: "LKR 5,000 - LKR 10,000" },
    { value: "10000-10000000", label: "LKR 10,000+" },
  ];

  const ratingFilters = [
    { id: "all", name: "All Ratings" },
    { id: "4.5", name: "4.5+ Stars" },
    { id: "4", name: "4+ Stars" },
    { id: "3.5", name: "3.5+ Stars" },
    { id: "3", name: "3+ Stars" },
  ];

  const sortOptions = [
    { id: "featured", name: "Featured" },
    { id: "price-low", name: "Price: Low to High" },
    { id: "price-high", name: "Price: High to Low" },
    { id: "rating", name: "Highest Rated" },
    { id: "newest", name: "Newest First" },
    { id: "popular", name: "Most Popular" },
  ];

  // Fetch category data to build category filter
  const fetchCategoryData = async () => {
    setIsLoadingCategories(true);
    try {
      const result = await fetchStoresByCategory("fashion", 1, 1).unwrap();
      const responseData = result?.data?.[0];

      if (responseData?.categoryCounts) {
        setCategoryData({
          categoryCounts: responseData.categoryCounts,
        });
      } else {
        setCategoryData({ categoryCounts: {} });
      }
    } catch (error) {
      console.error("Failed to fetch category data:", error);
      setCategoryData({ categoryCounts: {} });
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Build categories from backend data
  const categories = useMemo(() => {
    if (!categoryData?.categoryCounts) {
      return [{ id: "all", name: "All Categories", count: 0 }];
    }

    const counts = categoryData.categoryCounts;
    const totalCount = Object.values(counts).reduce(
      (sum, count) => sum + count,
      0
    );

    const categoryList = [
      { id: "all", name: "All Categories", count: totalCount },
    ];

    // Add categories that exist in both API data and our definitions
    Object.entries(counts).forEach(([categoryKey, count]) => {
      if (categoryDefinitions[categoryKey] && count > 0) {
        categoryList.push({
          id: categoryKey,
          name: categoryDefinitions[categoryKey],
          count: count,
        });
      }
    });

    return categoryList.sort((a, b) => {
      if (a.id === "all") return -1;
      if (b.id === "all") return 1;
      return b.count - a.count;
    });
  }, [categoryData]);

  // Read URL parameters on component mount and when location changes
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    const priceParam = searchParams.get("price");
    const ratingParam = searchParams.get("rating");
    const sortParam = searchParams.get("sort");
    const pageParam = searchParams.get("page");

    // Set category if valid category is passed
    if (categoryParam && categoryDefinitions[categoryParam]) {
      setSelectedCategory(categoryParam);
    }

    // Set search term if passed
    if (searchParam) {
      setSearchTerm(searchParam);
    }

    // Set price range if valid
    if (priceParam && priceRanges.find((range) => range.value === priceParam)) {
      setSelectedPriceRange(priceParam);
    }

    // Set rating if valid
    if (
      ratingParam &&
      ratingFilters.find((rating) => rating.id === ratingParam)
    ) {
      setSelectedRating(ratingParam);
    }

    // Set sort option if valid
    if (sortParam && sortOptions.find((option) => option.id === sortParam)) {
      setSortBy(sortParam);
    }

    // Set page if valid
    if (pageParam && !isNaN(parseInt(pageParam))) {
      setCurrentPage(parseInt(pageParam));
    }
  }, [searchParams]);

  // Fetch initial data
  useEffect(() => {
    fetchCategoryData();
    if (authUser?._id) {
      fetchCartItems(authUser._id, 1, 100); // Fetch cart items for checking
      fetchWishlist(authUser._id); // Fetch wishlist data
    }
  }, [authUser, fetchCartItems, fetchWishlist]);

  // Perform search when filters change
  useEffect(() => {
    const performSearch = () => {
      const searchFilters = {
        categoryMain: selectedCategory !== "all" ? selectedCategory : "",
        PriceRange: selectedPriceRange !== "all" ? selectedPriceRange : "",
        CustomerRating: selectedRating !== "all" ? parseInt(selectedRating) : 0,
        color: "", // Can be added later
        brandName: "", // Can be added later
      };

      searchAllProducts(searchFilters, currentPage, itemsPerPage);
    };

    performSearch();
  }, [
    selectedCategory,
    selectedPriceRange,
    selectedRating,
    currentPage,
    searchAllProducts,
  ]);

  // Clear search results on unmount
  useEffect(() => {
    return () => {
      if (clearSearchResults) {
        clearSearchResults();
      }
      clearErrors();
    };
  }, [clearSearchResults, clearErrors]);

  // Update URL when filters change
  const updateURLParams = (updates) => {
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "" && value !== 1) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    setSearchParams(newSearchParams, { replace: true });
  };

  // Filter handlers
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    updateURLParams({ category, page: 1 });
  };

  const handleSearchChange = (search) => {
    setSearchTerm(search);
    updateURLParams({ search });
  };

  const handlePriceRangeChange = (priceRange) => {
    setSelectedPriceRange(priceRange);
    setCurrentPage(1);
    updateURLParams({ price: priceRange, page: 1 });
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    setCurrentPage(1);
    updateURLParams({ rating, page: 1 });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
    updateURLParams({ sort, page: 1 });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateURLParams({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Product actions
  const toggleWishlist = async (product, e) => {
    e.stopPropagation();

    if (!authUser?._id) {
      navigate("/login");
      return;
    }

    const productId = product._id;
    const isInWishlist = isItemInProductWishlist(productId);

    // Set loading state
    setAddingToWishlist((prev) => new Set(prev).add(productId));

    try {
      if (isInWishlist) {
        // Remove from wishlist
        await removeFromWishlist(authUser._id, productId);

        const productName =
          product.title || product.name || product.productName || "Item";
        showToast.success(`"${productName}" removed from wishlist`);
      } else {
        // Add to wishlist
        await addToWishlist([productId], []);

        const productName =
          product.title || product.name || product.productName || "Item";
        showToast.success(`"${productName}" added to wishlist!`, {
          text: "View Wishlist",
          action: () => navigate("/wishlist"),
        });
      }

      // Refresh wishlist to update status
      await fetchWishlist(authUser._id);
    } catch (error) {
      console.error("Failed to update wishlist:", error);
      const action = isInWishlist ? "remove from" : "add to";
      showToast.error(`Failed to ${action} wishlist. Please try again.`, {
        text: "Retry",
        action: () => toggleWishlist(product, e),
      });
    } finally {
      // Remove loading state
      setAddingToWishlist((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Check if product is in cart
  const isProductInCart = (productId) => {
    return isItemInCart(productId);
  };

  // Check if product is in wishlist
  const isProductInWishlist = (productId) => {
    return isItemInProductWishlist(productId);
  };

  // Get wishlist button content
  const getWishlistButtonContent = (product) => {
    const productId = product._id;
    const isLoading = addingToWishlist.has(productId);
    const inWishlist = isProductInWishlist(productId);

    if (isLoading) {
      return {
        className: "bg-gray-500 text-white scale-110",
        icon: <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />,
      };
    }

    if (inWishlist) {
      return {
        className: "bg-red-500 text-white scale-110",
        icon: <Heart className="h-3 w-3 sm:h-4 sm:w-4" />,
      };
    }

    return {
      className: "bg-white/90 text-gray-600 hover:text-red-500 hover:bg-white",
      icon: <Heart className="h-3 w-3 sm:h-4 sm:w-4" />,
    };
  };

  // Handle add to cart - similar to wishlist page
  const handleAddToCart = async (product, e) => {
    e.stopPropagation();

    if (!authUser?._id) {
      navigate("/login");
      return;
    }

    // Check if already in cart
    if (isProductInCart(product._id)) {
      showToast.cart("Item is already in your cart", {
        text: "View Cart",
        action: () => navigate("/shopping-cart"),
      });
      return;
    }

    // Set loading state
    setAddingToCart((prev) => new Set(prev).add(product._id));

    try {
      await addItemToCart(authUser._id, product._id, 1).unwrap();

      // Refresh cart items to update status
      await fetchCartItems(authUser._id, 1, 100);

      // Get product name with fallbacks
      const productName =
        product.title || product.name || product.productName || "Item";

      showToast.success(`"${productName}" added to cart successfully!`, {
        text: "View Cart",
        action: () => navigate("/shopping-cart"),
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      showToast.error("Failed to add to cart. Please try again.", {
        text: "Retry",
        action: () => handleAddToCart(product, e),
      });
    } finally {
      // Remove loading state
      setAddingToCart((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
    }
  };

  const handleBuyNow = (product, e) => {
    e.stopPropagation();
    navigate(`/checkout?product=${product._id}&quantity=1`);
  };

  const handleVisitShop = (product, e) => {
    e.stopPropagation();
    navigate(`/shop/${product.sellerDetails || product.sellerId}`);
  };

  const handleQuickView = (product, e) => {
    e.stopPropagation();
    navigate(`/product/${product._id}`);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`);
  };

  // Reset all filters function
  const resetAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedPriceRange("all");
    setSelectedRating("all");
    setSortBy("featured");
    setCurrentPage(1);

    // Clear URL parameters
    setSearchParams({}, { replace: true });
  };

  // Get badge variant for product status
  const getBadgeVariant = (status) => {
    const variants = {
      active: "success",
      inactive: "secondary",
      outOfStock: "danger",
      new: "success",
      hot: "danger",
      popular: "primary",
      trending: "warning",
    };
    return variants[status] || "default";
  };

  // Render stars for rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 sm:h-4 sm:w-4 ${
          i < Math.floor(rating || 0)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  // Get cart button content
  const getCartButtonContent = (product) => {
    const productId = product._id;
    const isLoading = addingToCart.has(productId);
    const inCart = isProductInCart(productId);
    const isOutOfStock = product.status === "outOfStock";

    if (isLoading) {
      return {
        text: "Adding...",
        icon: <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />,
        disabled: true,
        variant: "primary",
      };
    }

    if (inCart) {
      return {
        text: "In Cart",
        icon: <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />,
        disabled: false,
        variant: "success",
      };
    }

    if (isOutOfStock) {
      return {
        text: "Notify",
        icon: <Bell className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />,
        disabled: true,
        variant: "outline",
      };
    }

    return {
      text: "Add",
      icon: <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />,
      disabled: false,
      variant: "outline",
    };
  };

  // Get product price
  const getProductPrice = (product) => {
    const variation = product.variations?.[0];
    return {
      price: variation?.price || 0,
      originalPrice: variation?.originalPrice || null,
    };
  };

  // Get product image
  const getProductImage = (product) => {
    if (product.images?.[0]?.url) {
      return product.images[0].url;
    }
    if (product.variations?.[0]?.images?.[0]?.url) {
      return product.variations[0].images[0].url;
    }
    return "/placehold.png";
  };

  // Loading state
  if (searchLoading && (!searchResults || searchResults.length === 0)) {
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Loading Products
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Please wait while we fetch the latest products...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50 min-h-screen">
      {/* Toast Notification Component */}
      <ToastNotification ref={toastRef} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Product Collection
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Discover our complete collection of premium products from trusted
            sellers worldwide.
          </p>
          {searchLoading && (
            <div className="mt-3 sm:mt-4 flex items-center justify-center text-xs sm:text-sm text-blue-600">
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-2" />
              Updating product results...
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm touch-manipulation"
              />
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
          {/* Filter Toggle for Mobile */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Filters & Sorting
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 touch-manipulation text-xs"
            >
              <Filter className="h-3 w-3" />
              <span className="hidden xs:inline">Filters</span>
              {showFilters ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          </div>

          {/* Filters */}
          <div
            className={`${showFilters ? "block" : "hidden"} md:block space-y-4`}
          >
            {/* Categories */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {categories.slice(0, 8).map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "primary" : "outline"
                    }
                    size="sm"
                    onClick={() => handleCategoryChange(category.id)}
                    className="flex items-center gap-1 sm:gap-2 touch-manipulation text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                    disabled={isLoadingCategories}
                  >
                    <span className="truncate max-w-20 sm:max-w-none">
                      {category.name}
                    </span>
                    <Badge variant="default" size="sm" className="text-xs">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            {/* Secondary Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => handlePriceRangeChange(e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none touch-manipulation"
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <select
                  value={selectedRating}
                  onChange={(e) => handleRatingChange(e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none touch-manipulation"
                >
                  {ratingFilters.map((rating) => (
                    <option key={rating.id} value={rating.id}>
                      {rating.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none touch-manipulation"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Results Info and View Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
          {/* Results Info */}
          <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
            {searchPagination ? (
              <>
                Showing {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(
                  currentPage * itemsPerPage,
                  searchPagination.totalItems
                )}{" "}
                of {searchPagination.totalItems} products
              </>
            ) : (
              `Showing ${searchResults?.length || 0} products`
            )}
            {selectedCategory !== "all" && (
              <span className="ml-1 sm:ml-2 text-blue-600 font-medium block sm:inline">
                in {categories.find((cat) => cat.id === selectedCategory)?.name}
              </span>
            )}
            {searchTerm && (
              <span className="ml-1 sm:ml-2 text-blue-600 font-medium block sm:inline">
                for "{searchTerm}"
              </span>
            )}
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-3 sm:gap-4 order-1 sm:order-2">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
                View:
              </span>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 sm:p-2 transition-colors touch-manipulation ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 sm:p-2 transition-colors touch-manipulation ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <List className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {searchError && (
          <Card className="text-center py-8 sm:py-12">
            <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              Failed to load products
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              {searchError}
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </Card>
        )}

        {/* No Results Message */}
        {!searchLoading &&
          !searchError &&
          (!searchResults || searchResults.length === 0) && (
            <Card className="text-center py-8 sm:py-12">
              <div className="text-gray-400 mb-4">
                <Package className="h-12 w-12 sm:h-16 sm:w-16 mx-auto" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                No products found
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4 px-4">
                Try adjusting your search or filter criteria
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {searchTerm && (
                  <Button
                    variant="outline"
                    onClick={() => handleSearchChange("")}
                    className="touch-manipulation"
                  >
                    Clear Search
                  </Button>
                )}
                <Button
                  variant="primary"
                  onClick={resetAllFilters}
                  className="touch-manipulation"
                >
                  Reset All Filters
                </Button>
              </div>
            </Card>
          )}

        {/* Products Grid */}
        {!searchLoading &&
          !searchError &&
          searchResults &&
          searchResults.length > 0 && (
            <div
              className={`grid gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12 ${
                viewMode === "grid"
                  ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-1"
              }`}
            >
              {searchResults.map((product) => {
                const cartButton = getCartButtonContent(product);
                const wishlistButton = getWishlistButtonContent(product);
                const { price, originalPrice } = getProductPrice(product);
                const productImage = getProductImage(product);
                const discount =
                  originalPrice && originalPrice > price
                    ? Math.round(
                        ((originalPrice - price) / originalPrice) * 100
                      )
                    : null;

                return (
                  <Card
                    key={product._id}
                    className={`group overflow-hidden hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 cursor-pointer bg-white border border-gray-100 hover:border-blue-200 ${
                      viewMode === "list"
                        ? "flex flex-col lg:flex-row h-auto lg:h-56"
                        : "flex flex-col h-full"
                    }`}
                    padding={false}
                    onClick={() => handleProductClick(product)}
                  >
                    {/* Product Image Container */}
                    <div
                      className={`relative overflow-hidden bg-gray-50 ${
                        viewMode === "list"
                          ? "h-48 sm:h-56 lg:h-56 lg:w-56 lg:flex-shrink-0"
                          : "h-40 sm:h-48 lg:h-56"
                      }`}
                    >
                      <img
                        src={productImage}
                        alt={product.title || product.name || "Product"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "/placehold.png";
                        }}
                      />

                      {/* Overlay gradient for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Top Badges */}
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1">
                        {product.status === "active" ? (
                          <Badge
                            variant="success"
                            size="sm"
                            className="text-xs font-medium"
                          >
                            Available
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            size="sm"
                            className="text-xs"
                          >
                            {product.status}
                          </Badge>
                        )}
                        {product.brand && (
                          <Badge
                            variant="info"
                            size="sm"
                            className="text-xs font-medium"
                          >
                            {product.brand}
                          </Badge>
                        )}
                      </div>

                      {/* Discount Badge */}
                      {discount && (
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            -{discount}%
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <button
                          onClick={(e) => toggleWishlist(product, e)}
                          disabled={addingToWishlist.has(product._id)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm touch-manipulation shadow-lg disabled:opacity-70 ${wishlistButton.className}`}
                          aria-label={
                            isProductInWishlist(product._id)
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                        >
                          {wishlistButton.icon}
                        </button>
                        <button
                          onClick={(e) => handleQuickView(product, e)}
                          className="w-7 h-7 sm:w-8 sm:h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 hover:bg-white transition-all duration-200 touch-manipulation shadow-lg"
                          aria-label="Quick view"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>

                      {/* Features Badges */}
                      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 flex gap-1 flex-wrap max-w-20 sm:max-w-24">
                        {product.shippingClass?.shippingClass ===
                          "standard" && (
                          <Badge
                            variant="success"
                            size="sm"
                            className="text-xs"
                          >
                            <Truck className="h-2 w-2 mr-1" />
                            <span className="hidden sm:inline">Free</span>
                          </Badge>
                        )}
                        {product.shippingClass?.warranty && (
                          <Badge variant="info" size="sm" className="text-xs">
                            <Shield className="h-2 w-2" />
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-3 sm:p-4 flex-1 flex flex-col">
                      {/* Shop Name & Location */}
                      <div className="mb-2 flex items-center justify-between">
                        <span
                          className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer font-medium truncate"
                          onClick={(e) => handleVisitShop(product, e)}
                        >
                          {product.sellerDetails?.firstName || "Shop"}
                        </span>
                        {viewMode === "list" && (
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Location</span>
                          </div>
                        )}
                      </div>

                      {/* Product Title */}
                      <div
                        className={`mb-2 sm:mb-3 ${
                          viewMode === "grid" ? "h-8 sm:h-10" : "h-auto"
                        } flex items-start`}
                      >
                        <h3
                          className={`font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight ${
                            viewMode === "grid"
                              ? "line-clamp-2 text-xs sm:text-sm"
                              : "text-sm sm:text-base"
                          }`}
                        >
                          {product.title ||
                            product.name ||
                            product.productName ||
                            "Product"}
                        </h3>
                      </div>

                      {/* Rating & Reviews */}
                      <div className="mb-2 sm:mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <div className="flex items-center">
                            {renderStars(product.averageRating)}
                          </div>
                          <span className="text-xs text-gray-600 ml-1">
                            {product.averageRating || 0}
                          </span>
                        </div>
                        {viewMode === "list" && (
                          <span className="text-xs text-gray-500">
                            ({product.reviews || 0} reviews)
                          </span>
                        )}
                      </div>

                      {/* Price Section */}
                      <div className="mb-3 sm:mb-4">
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                          <span className="text-sm sm:text-lg font-bold text-gray-900">
                            LKR {price}
                          </span>
                          {originalPrice && originalPrice > price && (
                            <span className="text-xs sm:text-sm text-gray-500 line-through">
                              LKR {originalPrice}
                            </span>
                          )}
                        </div>
                        {originalPrice && originalPrice > price && (
                          <div className="mt-1">
                            <Badge
                              variant="success"
                              size="sm"
                              className="text-xs"
                            >
                              <Tag className="h-2 w-2 mr-1" />
                              Save LKR {(originalPrice - price).toFixed(2)}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* List View Extra Info */}
                      {viewMode === "list" && (
                        <div className="mb-3 text-xs text-gray-600 hidden lg:block">
                          <p className="line-clamp-2">
                            {product.description ||
                              "High quality product with excellent features and reliable performance."}
                          </p>
                        </div>
                      )}

                      {/* Spacer to push buttons to bottom */}
                      <div className="flex-grow"></div>

                      {/* Action Buttons */}
                      <div className="space-y-1.5 sm:space-y-2 mt-auto">
                        {/* Main Buy Now Button */}
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full py-2 sm:py-3 font-semibold touch-manipulation text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                          disabled={product.status !== "active"}
                          onClick={(e) => handleBuyNow(product, e)}
                        >
                          {product.status === "active"
                            ? "Buy Now"
                            : "Unavailable"}
                        </Button>

                        {/* Secondary Buttons */}
                        <div className="flex gap-1.5 sm:gap-2">
                          <Button
                            variant={cartButton.variant}
                            size="sm"
                            className={`flex-1 touch-manipulation text-xs sm:text-sm py-1.5 sm:py-2 transition-all duration-200 ${
                              cartButton.variant === "success"
                                ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
                                : cartButton.variant === "primary"
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                            }`}
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={cartButton.disabled}
                          >
                            {cartButton.icon}
                            <span className="hidden sm:inline">
                              {cartButton.text}
                            </span>
                            <span className="sm:hidden">
                              {cartButton.text === "Adding..."
                                ? "..."
                                : cartButton.text.slice(0, 3)}
                            </span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 touch-manipulation text-xs sm:text-sm py-1.5 sm:py-2 transition-all duration-200"
                            onClick={(e) => handleVisitShop(product, e)}
                          >
                            <Store className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden sm:inline">Shop</span>
                            <span className="sm:hidden">Visit</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

        {/* Pagination */}
        {!searchLoading &&
          searchPagination &&
          searchPagination.totalPages > 1 && (
            <div className="mt-8 sm:mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={searchPagination.totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={searchPagination.totalItems}
              />
            </div>
          )}
      </div>
    </section>
  );
};

export default ProductCollection;
