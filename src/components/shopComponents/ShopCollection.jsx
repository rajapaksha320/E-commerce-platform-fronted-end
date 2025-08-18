import React, { useState, useMemo, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Star,
  MapPin,
  Clock,
  Grid,
  List,
  ArrowRight,
  Heart,
  Eye,
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Package,
  Store,
  Building,
  Users,
  BadgeCheck,
} from "lucide-react";

import { Card, Button, Badge } from "../ui";
import useUser from "../../hooks/useUser";
import { selectUser as selectAuthUser } from "../../store/slices/authSlice";
import Pagination from "../ui/Pagination";
import ToastNotification, { useToast } from "../ui/ToastNotification";

const ShopCollection = () => {
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);

  // Toast notification hook
  const { toastRef, showToast } = useToast();

  // Redux state and actions from useUser hook
  const {
    stores,
    filteredStores,
    storesPagination,
    storesLoading,
    storesError,
    fetchAllStores,
    fetchStoresByCategory,
    quickToggleWishlist,
    removeFromWishlist,
    isItemInShopWishlist,
    fetchWishlist,
    clearErrors,
  } = useUser();

  // UI States
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [addingToWishlist, setAddingToWishlist] = useState(new Set());
  const [categoryData, setCategoryData] = useState(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const itemsPerPage = 6;
  const maxVisibleCategories = 6;

  // Category definitions for proper display names
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

  // Fetch category data from API
  const fetchCategoryData = async () => {
    setIsLoadingCategories(true);
    try {
      // Fetch fashion category to get categoryCounts (you can use any category)
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

  // Build categories from API data
  const categories = useMemo(() => {
    if (!categoryData?.categoryCounts) {
      return [{ id: "all", name: "All Shops", count: 0 }];
    }

    const counts = categoryData.categoryCounts;
    const totalCount = Object.values(counts).reduce(
      (sum, count) => sum + count,
      0
    );

    const categoryList = [{ id: "all", name: "All Shops", count: totalCount }];

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

  // Get the appropriate shops data based on current selection
  const currentShopsData = selectedCategory === "all" ? stores : filteredStores;

  // Extract actual store objects from API response
  const actualStores = useMemo(() => {
    if (!currentShopsData || currentShopsData.length === 0) return [];

    return currentShopsData
      .map((item) => {
        const store = item.shop || item.store || item;
        return {
          ...store,
          // Add category info if available from the listings
          listings: item.listings || [],
          totalProductsInCategory: item.totalProductsInCategory || 0,
        };
      })
      .filter(Boolean);
  }, [currentShopsData]);

  // Filter shops based on search term (category filtering is handled by API)
  const filteredShops = useMemo(() => {
    if (!actualStores || actualStores.length === 0) return [];

    // If no search term, return all shops
    if (!searchTerm) {
      return actualStores;
    }

    // Filter by search term
    const searchLower = searchTerm.toLowerCase();
    return actualStores.filter((store) => {
      const storeName =
        store.basicInformation?.storeName || store.storeName || "";
      const storeDescription =
        store.basicInformation?.storeDescription ||
        store.storeDescription ||
        "";
      const storeLocation =
        store.contactDetails?.storeLocation || store.storeLocation || "";
      const storeTagLine = store.basicInformation?.storeTagLine || "";

      return (
        storeName.toLowerCase().includes(searchLower) ||
        storeDescription.toLowerCase().includes(searchLower) ||
        storeLocation.toLowerCase().includes(searchLower) ||
        storeTagLine.toLowerCase().includes(searchLower)
      );
    });
  }, [actualStores, searchTerm]);

  // Reset to first page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Fetch initial category data and shops
  useEffect(() => {
    console.log("ShopCollection: Fetching initial data...");
    fetchCategoryData();
  }, []);

  // Fetch shops when category or page changes
  useEffect(() => {
    if (selectedCategory === "all") {
      console.log("Fetching all stores, page:", currentPage);
      fetchAllStores(currentPage, itemsPerPage);
    } else {
      console.log(
        "Fetching category stores:",
        selectedCategory,
        "page:",
        currentPage
      );
      fetchStoresByCategory(selectedCategory, currentPage, itemsPerPage);
    }
  }, [selectedCategory, currentPage, fetchAllStores, fetchStoresByCategory]);

  // Fetch wishlist if user is logged in
  useEffect(() => {
    if (authUser?._id) {
      fetchWishlist(authUser._id);
    }
  }, [authUser, fetchWishlist]);

  // Debug logging
  useEffect(() => {
    console.log("ShopCollection Debug:", {
      rawStores: stores,
      actualStores: actualStores?.map((store) => ({
        name: store.basicInformation?.storeName || store.storeName,
        category: store.assignedCategory,
        id: store._id,
      })),
      filteredShops: filteredShops?.map((store) => ({
        name: store.basicInformation?.storeName || store.storeName,
        category: store.assignedCategory,
        id: store._id,
      })),
      categories: categories,
      selectedCategory: selectedCategory,
      searchTerm: searchTerm,
    });
  }, [
    stores,
    actualStores,
    filteredShops,
    categories,
    selectedCategory,
    searchTerm,
  ]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  // Pagination logic for filtered shops (client-side search filtering)
  const totalPages = Math.ceil(filteredShops.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentShops = filteredShops.slice(startIndex, endIndex);

  // Use API pagination when no search term, client-side pagination when searching
  const shouldUseApiPagination = !searchTerm;
  const displayShops = shouldUseApiPagination ? actualStores : currentShops;

  // Fix pagination info mapping for API response structure
  const paginationInfo = useMemo(() => {
    if (shouldUseApiPagination && storesPagination) {
      return {
        totalItems: storesPagination.total || 0,
        currentPage: storesPagination.page || currentPage,
        totalPages: storesPagination.totalPages || 1,
        pageSize: storesPagination.pageSize || itemsPerPage,
      };
    } else {
      return {
        totalItems: filteredShops.length,
        currentPage: currentPage,
        totalPages: totalPages,
        pageSize: itemsPerPage,
      };
    }
  }, [
    shouldUseApiPagination,
    storesPagination,
    filteredShops.length,
    currentPage,
    totalPages,
    itemsPerPage,
  ]);

  const getBadgeVariant = (badge) => {
    const variants = {
      Verified: "success",
      Premium: "primary",
      Featured: "warning",
      Organic: "success",
      Athletic: "info",
      Trending: "danger",
      Active: "success",
      Inactive: "secondary",
    };
    return variants[badge] || "default";
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Handle navigation to shop view
  const handleVisitShop = (shopId) => {
    navigate(`/shop/${shopId}`);
  };

  // Handle shop card click (navigate to shop)
  const handleShopCardClick = (shopId) => {
    navigate(`/shop/${shopId}`);
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (shop, e) => {
    e.stopPropagation();

    if (!authUser?._id) {
      navigate("/login");
      return;
    }

    const shopId = shop._id;
    const isInWishlist = isItemInShopWishlist(shopId);

    setAddingToWishlist((prev) => new Set(prev).add(shopId));

    try {
      const shopName = shop.basicInformation?.storeName || "Shop";

      if (isInWishlist) {
        // Use direct removeFromWishlist for removal
        await removeFromWishlist(authUser._id, shopId);
        showToast.success(`"${shopName}" removed from wishlist`);
      } else {
        // Use quickToggleWishlist for adding
        await quickToggleWishlist(authUser._id, shopId, "shop");
        showToast.success(`"${shopName}" added to wishlist!`, {
          text: "View Wishlist",
          action: () => navigate("/wishlist"),
        });
      }

      // Always refresh wishlist data after operation
      await fetchWishlist(authUser._id);
    } catch (error) {
      console.error("Failed to update wishlist:", error);
      const action = isInWishlist ? "remove from" : "add to";
      showToast.error(`Failed to ${action} wishlist. Please try again.`);
    } finally {
      setAddingToWishlist((prev) => {
        const newSet = new Set(prev);
        newSet.delete(shopId);
        return newSet;
      });
    }
  };

  // Get wishlist button content
  const getWishlistButtonContent = (shop) => {
    const shopId = shop._id;
    const isLoading = addingToWishlist.has(shopId);
    const inWishlist = authUser ? isItemInShopWishlist(shopId) : false;

    if (isLoading) {
      return {
        className: "bg-gray-500 text-white scale-110",
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
      };
    }

    if (inWishlist) {
      return {
        className: "bg-red-500 text-white scale-110",
        icon: <Heart className="h-4 w-4 fill-current" />,
      };
    }

    return {
      className: "bg-white/90 text-gray-600 hover:text-red-500 hover:bg-white",
      icon: <Heart className="h-4 w-4" />,
    };
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={`star-${i}`}
        className={`h-4 w-4 ${
          i < Math.floor(rating || 0)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  // Loading state
  if (storesLoading && (!actualStores || actualStores.length === 0)) {
    return (
      <section className="py-16 bg-gray-50 min-h-screen">
        <ToastNotification ref={toastRef} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Loading Shops
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Please wait while we fetch the latest shops...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (storesError) {
    return (
      <section className="py-16 bg-gray-50 min-h-screen">
        <ToastNotification ref={toastRef} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-8 sm:py-12">
            <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              Failed to load shops
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              {storesError}
            </p>
            <Button onClick={() => fetchAllStores(1, 50)}>Try Again</Button>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <ToastNotification ref={toastRef} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Shop Collections
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our complete collection of verified shops offering quality
            products and exceptional service.
          </p>
          {storesLoading && (
            <div className="mt-4 flex items-center justify-center text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Updating shop results...
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search shops by name, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Shop Categories
            </h3>

            {/* Category Buttons */}
            <div className="flex flex-wrap gap-3 mb-4">
              {categories
                .slice(
                  0,
                  showAllCategories ? categories.length : maxVisibleCategories
                )
                .map((category, index) => (
                  <button
                    key={`category-${category.id}-${index}`}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white shadow-md transform scale-105"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-sm"
                    }`}
                  >
                    <span>{category.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        selectedCategory === category.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {category.count}
                    </span>
                  </button>
                ))}
            </div>

            {/* Show More/Less Button */}
            {categories.length > maxVisibleCategories && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  {showAllCategories ? (
                    <>
                      <span>Show Less</span>
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>
                        Show More Categories (
                        {categories.length - maxVisibleCategories} more)
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Controls and Results Info */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
          {/* Results Info */}
          <div className="text-gray-600">
            {paginationInfo && paginationInfo.totalItems > 0 ? (
              <>
                Showing{" "}
                {(() => {
                  const startIdx =
                    (paginationInfo.currentPage - 1) * paginationInfo.pageSize +
                    1;
                  const endIdx = Math.min(
                    paginationInfo.currentPage * paginationInfo.pageSize,
                    paginationInfo.totalItems
                  );
                  return `${startIdx}-${endIdx}`;
                })()}{" "}
                of {paginationInfo.totalItems} shops
              </>
            ) : (
              `Showing ${displayShops?.length || 0} shops`
            )}
            {selectedCategory !== "all" && (
              <span className="ml-2 text-blue-600 font-medium">
                in {categories.find((cat) => cat.id === selectedCategory)?.name}
              </span>
            )}
            {searchTerm && (
              <span className="ml-2 text-blue-600 font-medium">
                for "{searchTerm}"
              </span>
            )}
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${
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
        </div>

        {/* No Results Message */}
        {displayShops.length === 0 &&
          !storesLoading &&
          !isLoadingCategories && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Store className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No shops found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm && selectedCategory !== "all"
                  ? `No shops found for "${searchTerm}" in ${
                      categories.find((cat) => cat.id === selectedCategory)
                        ?.name
                    }`
                  : searchTerm
                  ? `No shops found for "${searchTerm}"`
                  : selectedCategory !== "all"
                  ? `No shops found in ${
                      categories.find((cat) => cat.id === selectedCategory)
                        ?.name
                    }`
                  : "No shops available at the moment"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {searchTerm && (
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    Clear Search
                  </Button>
                )}
                {selectedCategory !== "all" && (
                  <Button
                    variant="outline"
                    onClick={() => handleCategoryChange("all")}
                  >
                    View All Categories
                  </Button>
                )}
                {(searchTerm || selectedCategory !== "all") && (
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      handleCategoryChange("all");
                    }}
                  >
                    Reset All Filters
                  </Button>
                )}
              </div>
            </div>
          )}

        {/* Shops Grid */}
        {displayShops.length > 0 && (
          <div
            className={`grid gap-6 mb-12 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {displayShops.map((shop, shopIndex) => {
              const wishlistButton = getWishlistButtonContent(shop);

              return (
                <Card
                  key={`shop-${shop._id || shop.id || shopIndex}`}
                  className={`group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${
                    viewMode === "list" ? "flex flex-col md:flex-row" : ""
                  }`}
                  padding={false}
                  onClick={() => handleShopCardClick(shop._id)}
                >
                  {/* Shop Image */}
                  <div
                    className={`relative overflow-hidden ${
                      viewMode === "list"
                        ? "md:w-80 flex-shrink-0 h-48"
                        : "h-48"
                    }`}
                  >
                    {shop.shopMedia?.bannerImage ||
                    shop.shopMedia?.storeLogo ? (
                      <img
                        src={
                          shop.shopMedia?.bannerImage ||
                          shop.shopMedia?.storeLogo
                        }
                        alt={shop.basicInformation?.storeName || "Shop"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "/placehold.png";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Building className="h-12 w-12 mx-auto mb-2" />
                          <span className="text-lg font-semibold">
                            {shop.basicInformation?.storeName?.charAt(0) || "S"}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="absolute top-4 left-4">
                      <Badge variant={getBadgeVariant(shop.status)}>
                        {shop.status === "active" ? "Verified" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        className={`w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 ${wishlistButton.className}`}
                        onClick={(e) => handleWishlistToggle(shop, e)}
                        disabled={addingToWishlist.has(shop._id)}
                        title={
                          isItemInShopWishlist(shop._id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        {wishlistButton.icon}
                      </button>
                      <button
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVisitShop(shop._id);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Shop Info */}
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {shop.basicInformation?.storeName || "Unnamed Shop"}
                          </h3>
                          {shop.status === "active" && (
                            <BadgeCheck className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        {shop.basicInformation?.storeTagLine && (
                          <p className="text-sm text-gray-600 mb-2">
                            {shop.basicInformation.storeTagLine}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <div className="flex items-center">
                          {renderStars(shop.rating)}
                        </div>
                        <span className="font-medium">{shop.rating || 0}</span>
                        <span className="text-gray-500">(0)</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {shop.basicInformation?.storeDescription ||
                        "Quality products and exceptional service from a trusted seller."}
                    </p>

                    <div className="space-y-2 mb-4">
                      {shop.contactDetails?.storeLocation && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          {shop.contactDetails.storeLocation}
                        </div>
                      )}
                      {shop.contactDetails?.storeBusinessHours && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                          {shop.contactDetails.storeBusinessHours}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Package className="h-4 w-4" />
                          <span>{shop.totalProducts || 0} products</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{shop.totalSales || 0} sales</span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVisitShop(shop._id);
                        }}
                      >
                        Visit Shop
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {displayShops.length > 0 &&
          paginationInfo &&
          paginationInfo.totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={paginationInfo.currentPage}
                totalPages={paginationInfo.totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={paginationInfo.pageSize}
                totalItems={paginationInfo.totalItems}
              />
            </div>
          )}
      </div>
    </section>
  );
};

export default ShopCollection;
