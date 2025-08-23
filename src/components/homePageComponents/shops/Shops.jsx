/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from "react";
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
  Loader2,
  Building,
  BadgeCheck,
} from "lucide-react";

import { Card, Button, Badge } from "../../ui";
import useUser from "../../../hooks/useUser";
import { selectUser as selectAuthUser } from "../../../store/slices/authSlice";
import ToastNotification, { useToast } from "../../ui/ToastNotification";

const Shops = () => {
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);

  // Toast notification hook
  const { toastRef, showToast } = useToast();

  const {
    stores,
    filteredStores,
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [addingToWishlist, setAddingToWishlist] = useState(new Set());
  const [categoryData, setCategoryData] = useState(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const itemsPerPage = 6; 

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
      // Fetch fashion category to get categoryCounts 
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
          listings: item.listings || [],
          totalProductsInCategory: item.totalProductsInCategory || 0,
        };
      })
      .filter(Boolean)
      .slice(0, itemsPerPage); // Limit to 6 shops
  }, [currentShopsData, itemsPerPage]);

  // No client-side filtering needed - API handles it
  const filteredShops = actualStores;

  // Fetch initial category data and shops 
  useEffect(() => {
    console.log("Shops: Fetching initial data...");
    fetchCategoryData();
  }, []);

  // Fetch shops when category changes
  useEffect(() => {
    if (selectedCategory === "all") {
      console.log("Fetching all stores for Shops component");
      fetchAllStores(1, 12);
    } else {
      console.log(
        "Fetching category stores for Shops component:",
        selectedCategory
      );
      fetchStoresByCategory(selectedCategory, 1, 12);
    }
  }, [selectedCategory, fetchAllStores, fetchStoresByCategory]);

  // Fetch wishlist if user is logged in
  useEffect(() => {
    if (authUser?._id) {
      fetchWishlist(authUser._id);
    }
  }, [authUser, fetchWishlist]);

  // Debug logging 
  useEffect(() => {
    console.log("Shops Debug:", {
      categories: categories,
      selectedCategory: selectedCategory,
      currentShopsData: currentShopsData,
      actualStores: actualStores?.map((store) => ({
        name: store.basicInformation?.storeName || store.storeName,
        category: store.assignedCategory,
        id: store._id,
      })),
    });
  }, [categories, selectedCategory, currentShopsData, actualStores]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  const handleLoadMoreShops = () => {
    navigate("/shop-collections");
  };

  // Handle category selection 
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
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
      showToast.error("Please log in to add shops to your wishlist!");
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

  // Show loading state for initial load
  if (
    (storesLoading && (!actualStores || actualStores.length === 0)) ||
    isLoadingCategories
  ) {
    return (
      <section className="py-16 bg-white">
        <ToastNotification ref={toastRef} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-lg mx-auto mb-4 max-w-md"></div>
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-lg mx-auto mb-2 max-w-2xl"></div>
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-lg mx-auto max-w-xl"></div>

            {/* Loading Status */}
            <div className="mt-8 flex items-center justify-center">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div
                  className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-400 rounded-full animate-spin"
                  style={{
                    animationDirection: "reverse",
                    animationDuration: "1.5s",
                  }}
                ></div>
              </div>
              <div className="ml-4">
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  Loading Latest Shops
                </div>
                <div className="text-sm text-gray-600">
                  Discovering amazing shops for you...
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter Skeleton */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-lg"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="h-6 w-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded"></div>
              <div className="h-10 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-lg"></div>
            </div>
          </div>

          {/* Shop Cards Skeleton */}
          <div className="grid gap-6 mb-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image Skeleton */}
                <div className="relative h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite]">
                  <div className="absolute top-4 left-4 h-6 w-16 bg-white/80 rounded-full"></div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <div className="w-8 h-8 bg-white/80 rounded-full"></div>
                    <div className="w-8 h-8 bg-white/80 rounded-full"></div>
                  </div>
                </div>

                {/* Content Skeleton */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded mb-2 w-3/4"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-1/2"></div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded"></div>
                    </div>
                  </div>

                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded mb-2"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded mb-4 w-2/3"></div>

                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-3/4"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-1/2"></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded"></div>
                    <div className="h-8 w-24 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading Progress Dots */}
          <div className="flex justify-center items-center space-x-2">
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>

        {/* Custom Keyframes for Shimmer Effect */}
        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <ToastNotification ref={toastRef} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Shops
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse through our curated collection of verified shops offering
            quality products and exceptional service.
          </p>
          {storesLoading && (
            <div className="mt-4 flex items-center justify-center text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading latest shops...
            </div>
          )}
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {isLoadingCategories ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading categories...</span>
              </div>
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))
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

        {/* Shops Grid */}
        {filteredShops.length > 0 ? (
          <div
            className={`grid gap-6 mb-12 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {filteredShops.map((shop, shopIndex) => {
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
                      <span className="text-sm text-gray-500">
                        {shop.totalProductsInCategory || 0} products
                      </span>
                      <Button
                        size="sm"
                        className="cursor-pointer hover:!bg-blue-500"
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
        ) : !storesLoading && !isLoadingCategories ? (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              {/* Empty State Illustration */}
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mb-4 border-4 border-blue-100">
                  <div className="relative">
                    <Building className="h-16 w-16 text-blue-400" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-500 text-xs font-bold">?</span>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-4 left-1/2 transform -translate-x-8 w-3 h-3 bg-blue-200 rounded-full animate-pulse"></div>
                <div
                  className="absolute top-12 right-1/2 transform translate-x-12 w-2 h-2 bg-purple-200 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute bottom-8 left-1/2 transform -translate-x-12 w-4 h-4 bg-blue-100 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>

              {/* Main Message */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {selectedCategory === "all"
                  ? "No Shops Available"
                  : "No Shops in This Category"}
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {selectedCategory === "all"
                  ? "We're working hard to bring you amazing shops. Check back soon for new additions!"
                  : `We couldn't find any shops in "${
                      categories.find((cat) => cat.id === selectedCategory)
                        ?.name
                    }". Try exploring other categories or check back later.`}
              </p>

              {/* Action Buttons */}
              <div className="space-y-4">
                {selectedCategory !== "all" && (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => handleCategoryChange("all")}
                    className="w-full sm:w-auto mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Building className="w-5 h-5 mr-2" />
                    View All Shops
                  </Button>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="border-2 hover:shadow-md transition-all duration-200"
                  >
                    <Loader2 className="w-4 h-4 mr-2" />
                    Refresh Page
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleLoadMoreShops}
                    className="border-2 hover:shadow-md transition-all duration-200"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Browse All Collections
                  </Button>
                </div>
              </div>

              {/* Help Text */}
              <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-700 mb-2 font-medium">
                  💡 Pro Tip
                </p>
                <p className="text-sm text-blue-600">
                  New shops are added regularly. Follow us on social media to
                  stay updated on the latest additions!
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Load More Button */}
        {filteredShops.length > 0 && !isLoadingCategories && (
          <div className="text-center">
            <Button size="lg" variant="outline" onClick={handleLoadMoreShops}>
              Load More Shops
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Shops;
