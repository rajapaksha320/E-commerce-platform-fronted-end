/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from "react";
import {
  Grid,
  List,
  Heart,
  Eye,
  TrendingUp,
  ArrowRight,
  Package,
  Store,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Badge, ContactCard as Card } from "../ui/ContactUis/Uis";
import { Input, Select, SearchInput } from "../ui/InputUis/Uis";
import Pagination from "../ui/ContactUis/Pagination";
import useUser from "../../hooks/useUser";

const CategoriesCollection = () => {
  const navigate = useNavigate();

  // Redux state and actions from useUser hook
  const {
    filteredStores,
    storesPagination,
    storesLoading,
    storesError,
    fetchStoresByCategory,
    clearErrors,
  } = useUser();

  // UI States
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [likedCategories, setLikedCategories] = useState(new Set());
  const [categoryData, setCategoryData] = useState(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const itemsPerPage = 6;
  const maxVisibleCategories = 8;

  // Hardcoded category definitions with descriptions and images
  const categoryDefinitions = {
    electronics: {
      name: "Electronics & Technology",
      description:
        "Latest gadgets, smartphones, laptops, and cutting-edge technology products.",
      image:
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop",
      badge: "Hot",
      discount: "Up to 40% off",
      growth: "+15%",
    },
    fashion: {
      name: "Fashion & Apparel",
      description:
        "Trendy clothing, accessories, shoes, and fashion items for all styles.",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
      badge: "Trending",
      discount: "25% off new arrivals",
      growth: "+22%",
    },
    home: {
      name: "Home & Garden",
      description:
        "Furniture, decor, gardening supplies, and everything for your home.",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      badge: "Featured",
      discount: "Free shipping",
      growth: "+8%",
    },
    beauty: {
      name: "Health & Beauty",
      description:
        "Skincare, makeup, wellness products, and health supplements.",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
      badge: "Popular",
      discount: "Buy 2 Get 1 Free",
      growth: "+18%",
    },
    sports: {
      name: "Sports & Fitness",
      description: "Athletic equipment, workout gear, and sports accessories.",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      badge: "Athletic",
      discount: "20% off sports gear",
      growth: "+12%",
    },
    food: {
      name: "Food & Beverages",
      description:
        "Gourmet foods, organic products, beverages, and culinary delights.",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      badge: "Organic",
      discount: "15% off first order",
      growth: "+25%",
    },
    books: {
      name: "Books & Media",
      description: "Books, audiobooks, movies, music, and educational content.",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      badge: "Educational",
      discount: "30% off bestsellers",
      growth: "+6%",
    },
    automotive: {
      name: "Automotive",
      description:
        "Car parts, accessories, tools, and automotive maintenance products.",
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop",
      badge: "Professional",
      discount: "10% off parts",
      growth: "+9%",
    },
    toys: {
      name: "Toys & Games",
      description:
        "Educational toys, board games, video games, and entertainment.",
      image:
        "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop",
      badge: "Family",
      discount: "Buy 3 Get 1 Free",
      growth: "+30%",
    },
    jewelry: {
      name: "Jewelry & Accessories",
      description: "Fine jewelry, watches, accessories, and precious stones.",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
      badge: "Luxury",
      discount: "Special offers",
      growth: "+10%",
    },
  };

  // Fetch category data from API to get real categoryCounts
  const fetchCategoryData = async () => {
    setIsLoadingCategories(true);
    try {
    
      const result = await fetchStoresByCategory("fashion", 1, 1).unwrap();

      console.log("Full API response:", result);

  
      const responseData = result?.data?.[0];

      if (responseData?.categoryCounts) {
        setCategoryData({
          categoryCounts: responseData.categoryCounts,
          totalProductsInCategory: responseData.totalProductsInCategory || 0,
        });
        console.log("Category counts from API:", responseData.categoryCounts);
        console.log(
          "Total products in category:",
          responseData.totalProductsInCategory
        );
      } else {
        console.warn(
          "No categoryCounts in API response, checking alternative paths"
        );
        console.log("Response data:", responseData);

        // If no categoryCounts in expected location, set empty data
        setCategoryData({
          categoryCounts: {},
          totalProductsInCategory: 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch category data:", error);
      console.error("Error details:", error.message);

      // On error, set empty data instead of hardcoded numbers
      setCategoryData({
        categoryCounts: {},
        totalProductsInCategory: 0,
      });
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Fetch category data on component mount
  useEffect(() => {
    fetchCategoryData();
  }, []);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  // Build category types from real API data only
  const categoryTypes = useMemo(() => {
    if (
      !categoryData?.categoryCounts ||
      Object.keys(categoryData.categoryCounts).length === 0
    ) {
      return [{ id: "all", name: "All Categories", count: 0 }];
    }

    const counts = categoryData.categoryCounts;
    const totalCount = Object.values(counts).reduce(
      (sum, count) => sum + count,
      0
    );

    const categories = [
      { id: "all", name: "All Categories", count: totalCount },
    ];

    // Add categories that exist in both API data and current definitions
    Object.entries(counts).forEach(([categoryKey, count]) => {
      if (categoryDefinitions[categoryKey] && count > 0) {
        categories.push({
          id: categoryKey,
          name: categoryDefinitions[categoryKey].name,
          count: count,
        });
      }
    });

    const sortedCategories = categories
      .slice(1)
      .sort((a, b) => b.count - a.count);
    return [categories[0], ...sortedCategories];
  }, [categoryData]);

  // Generate detailed category data for display using real backend data
  const generateCategoryDetails = useMemo(() => {
    if (
      !categoryData?.categoryCounts ||
      Object.keys(categoryData.categoryCounts).length === 0
    ) {
      return [];
    }

    const counts = categoryData.categoryCounts;

    return Object.entries(counts)
      .filter(
        ([categoryKey, count]) => categoryDefinitions[categoryKey] && count > 0
      )
      .map(([categoryKey, count], index) => {
        const definition = categoryDefinitions[categoryKey];

        return {
          id: index + 1,
          name: definition.name,
          slug: categoryKey,
          image: definition.image,
          description: definition.description,
          products: categoryData.totalProductsInCategory || 0, 
          shops: count, 
          rating: (4.2 + Math.random() * 0.8).toFixed(1), 
          growth: definition.growth, 
          badge: definition.badge, 
          discount: definition.discount,
        };
      })
      .sort((a, b) => b.shops - a.shops); 
  }, [categoryData]);

  // Filter categories based on search term and selected category
  const filteredCategories = useMemo(() => {
    let filtered = generateCategoryDetails;

    // Filter by selected category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (category) => category.slug === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [generateCategoryDetails, searchTerm, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  // Reset to first page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const getBadgeVariant = (badge) => {
    const variants = {
      Hot: "danger",
      Trending: "warning",
      Featured: "primary",
      Popular: "info",
      Athletic: "success",
      Organic: "success",
      Educational: "primary",
      Professional: "default",
      Family: "warning",
      Luxury: "default",
    };
    return variants[badge] || "default";
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleLike = (categoryId, e) => {
    e.stopPropagation();
    setLikedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleBrowseCategory = (category, e) => {
    e.stopPropagation();
    navigate(`/product-collections?category=${category.slug}`);
  };

  const handleQuickView = (category, e) => {
    e.stopPropagation();
    navigate(`/stores?category=${category.slug}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/product-collections?category=${category.slug}`);
  };

  const categoryOptions = categoryTypes.map((type) => ({
    value: type.id,
    label: `${type.name} (${type.count})`,
  }));

  const handleRetry = () => {
    clearErrors();
    fetchCategoryData();
  };

  // Loading state
  if (isLoadingCategories) {
    return (
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Loading Categories
            </h2>
            <p className="text-gray-600">
              Please wait while we fetch the latest category data...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (storesError && !categoryData) {
    return (
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center p-8 max-w-md mx-auto">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Failed to load categories
            </h3>
            <p className="text-gray-600 mb-4">{storesError}</p>
            <Button onClick={handleRetry} className="inline-flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Categories Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive collection of product categories
            featuring the best items and trusted sellers.
          </p>
          {categoryData &&
          Object.keys(categoryData.categoryCounts || {}).length > 0 ? (
            <div className="mt-4 text-sm text-blue-600">
              {Object.values(categoryData.categoryCounts).reduce(
                (sum, count) => sum + count,
                0
              )}{" "}
              total stores across all categories
            </div>
          ) : (
            <div className="mt-4 text-sm text-gray-500">
              Loading category data...
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <SearchInput
              placeholder="Search categories by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="lg"
            />
          </div>
        </div>

        {/* Category Filter */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Browse Categories
          </h3>

          {/* Mobile Dropdown */}
          <div className="block md:hidden mb-4">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={categoryOptions}
              placeholder="Select category"
              size="md"
            />
          </div>

          {/* Desktop Category Buttons */}
          <div className="hidden md:block">
            <div className="flex flex-wrap gap-3 mb-4">
              {categoryTypes
                .slice(
                  0,
                  showAllCategories
                    ? categoryTypes.length
                    : maxVisibleCategories
                )
                .map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "primary" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2 touch-manipulation"
                  >
                    <span>{category.name}</span>
                    <Badge variant="default" size="sm">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
            </div>

            {/* Show More/Less Button */}
            {categoryTypes.length > maxVisibleCategories && (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="flex items-center gap-2 touch-manipulation"
                >
                  {showAllCategories ? (
                    <>
                      <span>Show Less</span>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m4.5 15.75 7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>
                        Show More Categories (
                        {categoryTypes.length - maxVisibleCategories} more)
                      </span>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Controls and Results Info */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
          {/* Results Info */}
          <div className="text-gray-600">
            Showing {startIndex + 1}-
            {Math.min(endIndex, filteredCategories.length)} of{" "}
            {filteredCategories.length} categories
            {selectedCategory !== "all" && (
              <span className="ml-2 text-blue-600 font-medium">
                in{" "}
                {
                  categoryTypes.find((type) => type.id === selectedCategory)
                    ?.name
                }
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
                  className={`p-2 transition-colors touch-manipulation ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
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
        </div>

        {/* No Categories from Backend */}
        {!isLoadingCategories &&
          categoryData &&
          Object.keys(categoryData.categoryCounts || {}).length === 0 && (
            <Card className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Store className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No categories available
              </h3>
              <p className="text-gray-500 mb-4">
                There are currently no stores with categories in the system.
              </p>
              <Button
                onClick={handleRetry}
                className="inline-flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </Card>
          )}

        {/* No Results Message */}
        {!isLoadingCategories &&
          filteredCategories.length === 0 &&
          categoryData &&
          Object.keys(categoryData.categoryCounts || {}).length > 0 && (
            <Card className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Package className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No categories found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm && selectedCategory !== "all"
                  ? `No categories found for "${searchTerm}" in ${
                      categoryTypes.find((type) => type.id === selectedCategory)
                        ?.name
                    }`
                  : searchTerm
                  ? `No categories found for "${searchTerm}"`
                  : selectedCategory !== "all"
                  ? `No categories found in ${
                      categoryTypes.find((type) => type.id === selectedCategory)
                        ?.name
                    }`
                  : "No categories found"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {searchTerm && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                    className="touch-manipulation"
                  >
                    Clear Search
                  </Button>
                )}
                {selectedCategory !== "all" && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCategory("all")}
                    className="touch-manipulation"
                  >
                    View All Categories
                  </Button>
                )}
                {(searchTerm || selectedCategory !== "all") && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="touch-manipulation"
                  >
                    Reset All Filters
                  </Button>
                )}
              </div>
            </Card>
          )}

        {/* Categories Grid */}
        {!isLoadingCategories && filteredCategories.length > 0 && (
          <div
            className={`grid gap-6 mb-12 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {currentCategories.map((category) => (
              <Card
                key={category.id}
                className={`group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  viewMode === "list" ? "flex flex-col md:flex-row" : ""
                }`}
                padding={false}
                onClick={() => handleCategoryClick(category)}
              >
                {/* Category Image */}
                <div
                  className={`relative overflow-hidden ${
                    viewMode === "list"
                      ? "md:w-80 flex-shrink-0 h-64 md:h-auto"
                      : "h-48"
                  }`}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "/placehold.png";
                    }}
                  />

                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge variant={getBadgeVariant(category.badge)} size="sm">
                      {category.badge}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => toggleLike(category.id, e)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors touch-manipulation ${
                        likedCategories.has(category.id)
                          ? "bg-red-500 text-white"
                          : "bg-white/90 text-gray-600 hover:text-red-500"
                      }`}
                      aria-label="Add to favorites"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleQuickView(category, e)}
                      className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 transition-colors touch-manipulation"
                      aria-label="Quick view"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Discount Badge */}
                  {category.discount && (
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="success" size="sm">
                        {category.discount}
                      </Badge>
                    </div>
                  )}

                  {/* Growth Indicator */}
                  <div className="absolute bottom-4 right-4">
                    <div className="flex items-center gap-1 text-xs bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-green-600 font-medium">
                        {category.growth}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Category Info */}
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm">
                      <svg
                        className="h-4 w-4 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium">{category.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Package className="h-4 w-4 mr-2" />
                      <span className="font-medium">{category.products}</span>
                      <span className="ml-1">products</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Store className="h-4 w-4 mr-2" />
                      <span className="font-medium">{category.shops}</span>
                      <span className="ml-1">shops</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium">
                      Explore Category
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => handleBrowseCategory(category, e)}
                      className="flex items-center gap-2 touch-manipulation"
                    >
                      Browse
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoadingCategories &&
          filteredCategories.length > 0 &&
          totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={filteredCategories.length}
            />
          )}
      </div>
    </section>
  );
};

export default CategoriesCollection;
