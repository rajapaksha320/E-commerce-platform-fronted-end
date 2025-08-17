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
} from "lucide-react";

import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";
import Pagination from "../../components/ui/ContactUis/Pagination";

const ProductCollection = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [likedProducts, setLikedProducts] = useState(new Set());
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const itemsPerPage = 12;

  const categories = [
    { id: "all", name: "All Categories", count: 48 },
    { id: "electronics", name: "Electronics", count: 12 },
    { id: "fashion", name: "Fashion", count: 8 },
    { id: "home", name: "Home & Garden", count: 6 },
    { id: "beauty", name: "Beauty", count: 5 },
    { id: "sports", name: "Sports", count: 4 },
    { id: "books", name: "Books", count: 3 },
    { id: "automotive", name: "Automotive", count: 2 },
    { id: "toys", name: "Toys", count: 8 },
  ];

  const priceRanges = [
    { value: "0-2000", label: "LKR 0 - LKR 2000" },
    { value: "2000-5000", label: "LKR 2000 - LKR 5000" },
    { value: "5000-10000", label: "LKR 5000 - LKR 10,000" },
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

  const products = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones Pro Max",
      shop: "TechHub Electronics",
      shopId: 1,
      category: "electronics",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      price: 79.99,
      originalPrice: 129.99,
      rating: 4.8,
      reviews: 2340,
      badge: "Hot",
      discount: 38,
      isNew: false,
      featured: true,
      inStock: true,
      freeShipping: true,
      fastDelivery: true,
    },
    {
      id: 2,
      name: "Smart Fitness Watch Series 7",
      shop: "SportZone Pro",
      shopId: 2,
      category: "electronics",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      price: 199.99,
      originalPrice: 299.99,
      rating: 4.7,
      reviews: 1890,
      badge: "New",
      discount: 33,
      isNew: true,
      featured: true,
      inStock: true,
      freeShipping: true,
      fastDelivery: false,
    },
    {
      id: 3,
      name: "Premium Coffee Maker Deluxe",
      shop: "Home Comfort Store",
      shopId: 3,
      category: "home",
      image:
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop",
      price: 149.99,
      originalPrice: 219.99,
      rating: 4.9,
      reviews: 567,
      badge: "Popular",
      discount: 32,
      isNew: false,
      featured: false,
      inStock: true,
      freeShipping: false,
      fastDelivery: true,
    },
    {
      id: 4,
      name: "Designer Leather Backpack",
      shop: "Fashion Forward",
      shopId: 4,
      category: "fashion",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
      price: 89.99,
      originalPrice: 139.99,
      rating: 4.6,
      reviews: 890,
      badge: "Trending",
      discount: 36,
      isNew: false,
      featured: true,
      inStock: true,
      freeShipping: true,
      fastDelivery: true,
    },
    {
      id: 5,
      name: "Professional Camera Lens 85mm",
      shop: "Photo Pro Studio",
      shopId: 5,
      category: "electronics",
      image:
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop",
      price: 449.99,
      originalPrice: 599.99,
      rating: 4.9,
      reviews: 1234,
      badge: "#1 Seller",
      discount: 25,
      isNew: false,
      featured: true,
      inStock: true,
      freeShipping: true,
      fastDelivery: true,
    },
    {
      id: 6,
      name: "Gaming Mechanical Keyboard RGB",
      shop: "GameZone Central",
      shopId: 6,
      category: "electronics",
      image:
        "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop",
      price: 129.99,
      originalPrice: 179.99,
      rating: 4.8,
      reviews: 2156,
      badge: "Bestseller",
      discount: 28,
      isNew: false,
      featured: false,
      inStock: true,
      freeShipping: true,
      fastDelivery: false,
    },
    {
      id: 7,
      name: "Portable Bluetooth Speaker",
      shop: "Audio Excellence",
      shopId: 7,
      category: "electronics",
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
      price: 59.99,
      originalPrice: 119.99,
      rating: 4.7,
      reviews: 845,
      badge: "50% OFF",
      discount: 50,
      isNew: false,
      featured: false,
      inStock: true,
      freeShipping: false,
      fastDelivery: true,
    },
    {
      id: 8,
      name: "Wireless Charging Pad Fast",
      shop: "TechHub Electronics",
      shopId: 1,
      category: "electronics",
      image:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop",
      price: 24.99,
      originalPrice: 49.99,
      rating: 4.5,
      reviews: 567,
      badge: "Flash Deal",
      discount: 50,
      isNew: true,
      featured: false,
      inStock: false,
      freeShipping: true,
      fastDelivery: false,
    },
    {
      id: 9,
      name: "Organic Skincare Set Premium",
      shop: "Beauty Essentials",
      shopId: 8,
      category: "beauty",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop",
      price: 79.99,
      originalPrice: 120.99,
      rating: 4.6,
      reviews: 432,
      badge: "Organic",
      discount: 34,
      isNew: false,
      featured: true,
      inStock: true,
      freeShipping: true,
      fastDelivery: true,
    },
    {
      id: 10,
      name: "Running Shoes Athletic Pro",
      shop: "SportZone Pro",
      shopId: 2,
      category: "sports",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
      price: 119.99,
      originalPrice: 159.99,
      rating: 4.7,
      reviews: 1023,
      badge: "Athletic",
      discount: 25,
      isNew: false,
      featured: false,
      inStock: true,
      freeShipping: true,
      fastDelivery: false,
    },
    {
      id: 11,
      name: "Smart Home Security Camera",
      shop: "SecureHome Tech",
      shopId: 9,
      category: "electronics",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.5,
      reviews: 678,
      badge: "Smart",
      discount: 31,
      isNew: true,
      featured: false,
      inStock: true,
      freeShipping: false,
      fastDelivery: true,
    },
    {
      id: 12,
      name: "Vintage Style Denim Jacket",
      shop: "Fashion Forward",
      shopId: 4,
      category: "fashion",
      image:
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=300&h=300&fit=crop",
      price: 69.99,
      originalPrice: 99.99,
      rating: 4.4,
      reviews: 456,
      badge: "Vintage",
      discount: 30,
      isNew: false,
      featured: false,
      inStock: true,
      freeShipping: false,
      fastDelivery: false,
    },
    {
      id: 13,
      name: "Indoor Plant Collection Set",
      shop: "Green Garden Store",
      shopId: 10,
      category: "home",
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop",
      price: 49.99,
      originalPrice: 79.99,
      rating: 4.8,
      reviews: 234,
      badge: "Eco",
      discount: 38,
      isNew: false,
      featured: true,
      inStock: true,
      freeShipping: true,
      fastDelivery: false,
    },
    {
      id: 14,
      name: "Professional Hair Dryer",
      shop: "Beauty Essentials",
      shopId: 8,
      category: "beauty",
      image:
        "https://images.unsplash.com/photo-1522338140262-f46f5913618c?w=300&h=300&fit=crop",
      price: 159.99,
      originalPrice: 229.99,
      rating: 4.7,
      reviews: 789,
      badge: "Professional",
      discount: 30,
      isNew: false,
      featured: false,
      inStock: true,
      freeShipping: true,
      fastDelivery: true,
    },
    {
      id: 15,
      name: "Educational STEM Robotics Kit",
      shop: "Learning Hub",
      shopId: 11,
      category: "toys",
      image:
        "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=300&h=300&fit=crop",
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.9,
      reviews: 345,
      badge: "Educational",
      discount: 31,
      isNew: true,
      featured: true,
      inStock: true,
      freeShipping: false,
      fastDelivery: true,
    },
    {
      id: 16,
      name: "Car Phone Mount Magnetic",
      shop: "Auto Parts Pro",
      shopId: 12,
      category: "automotive",
      image:
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=300&h=300&fit=crop",
      price: 19.99,
      originalPrice: 34.99,
      rating: 4.3,
      reviews: 567,
      badge: "Magnetic",
      discount: 43,
      isNew: false,
      featured: false,
      inStock: true,
      freeShipping: false,
      fastDelivery: false,
    },
  ];

  // Read URL parameters on component mount and when location changes
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    const priceParam = searchParams.get("price");
    const ratingParam = searchParams.get("rating");
    const sortParam = searchParams.get("sort");

    // Set category if valid category is passed
    if (categoryParam && categories.find((cat) => cat.id === categoryParam)) {
      setSelectedCategory(categoryParam);
    }

    // Set search term if passed
    if (searchParam) {
      setSearchTerm(searchParam);
    }

    // Set price range if valid
    if (priceParam && priceRanges.find((range) => range.id === priceParam)) {
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
  }, [searchParams]);

  // Update URL when filters change (optional - for better UX)
  const updateURLParams = (updates) => {
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    setSearchParams(newSearchParams, { replace: true });
  };

  // Modified filter handlers to update URL
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    updateURLParams({ category });
  };

  const handleSearchChange = (search) => {
    setSearchTerm(search);
    updateURLParams({ search });
  };

  const handlePriceRangeChange = (priceRange) => {
    setSelectedPriceRange(priceRange);
    updateURLParams({ price: priceRange });
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    updateURLParams({ rating });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    updateURLParams({ sort });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.shop.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filter by price range
    if (selectedPriceRange !== "all") {
      const [min, max] = selectedPriceRange.split("-");
      if (max === "+") {
        filtered = filtered.filter((product) => product.price >= parseInt(min));
      } else {
        filtered = filtered.filter(
          (product) =>
            product.price >= parseInt(min) && product.price <= parseInt(max)
        );
      }
    }

    // Filter by rating
    if (selectedRating !== "all") {
      const minRating = parseFloat(selectedRating);
      filtered = filtered.filter((product) => product.rating >= minRating);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return b.isNew - a.isNew;
        case "popular":
          return b.reviews - a.reviews;
        case "featured":
        default:
          return b.featured - a.featured;
      }
    });

    return filtered;
  }, [
    searchTerm,
    selectedCategory,
    selectedPriceRange,
    selectedRating,
    sortBy,
  ]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedCategory,
    selectedPriceRange,
    selectedRating,
    sortBy,
  ]);

  const getBadgeVariant = (badge) => {
    const variants = {
      Hot: "danger",
      New: "success",
      Popular: "primary",
      Trending: "warning",
      "#1 Seller": "purple",
      Bestseller: "primary",
      "50% OFF": "danger",
      "Flash Deal": "warning",
      Organic: "success",
      Athletic: "info",
      Smart: "info",
      Vintage: "warning",
      Eco: "success",
      Professional: "default",
      Educational: "purple",
      Magnetic: "default",
    };
    return variants[badge] || "default";
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleLike = (productId, e) => {
    e.stopPropagation();
    setLikedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    console.log("Added to cart:", product.id);
  };

  const handleBuyNow = (product, e) => {
    e.stopPropagation();
    navigate(`/checkout?product=${product.id}&quantity=1`);
  };

  const handleVisitShop = (product, e) => {
    e.stopPropagation();
    navigate(`/shop/${product.shopId}`);
  };

  const handleQuickView = (product, e) => {
    e.stopPropagation();
    console.log("Quick view:", product.id);
  };

  // Reset all filters function
  const resetAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedPriceRange("all");
    setSelectedRating("all");
    setSortBy("featured");

    // Clear URL parameters
    setSearchParams({}, { replace: true });
  };

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Product Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our complete collection of premium products from trusted
            sellers worldwide.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm touch-manipulation"
              />
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <Card className="p-6 mb-8">
          {/* Filter Toggle for Mobile */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Filters & Sorting
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 touch-manipulation"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Filters */}
          <div
            className={`${showFilters ? "block" : "hidden"} md:block space-y-4`}
          >
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 6).map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "primary" : "outline"
                    }
                    size="sm"
                    onClick={() => handleCategoryChange(category.id)}
                    className="flex items-center gap-2 touch-manipulation"
                  >
                    <span>{category.name}</span>
                    <Badge variant="default" size="sm">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            {/* Secondary Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => handlePriceRangeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none touch-manipulation"
                >
                  {priceRanges.map((range) => (
                    <option key={range.id} value={range.id}>
                      {range.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <select
                  value={selectedRating}
                  onChange={(e) => handleRatingChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none touch-manipulation"
                >
                  {ratingFilters.map((rating) => (
                    <option key={rating.id} value={rating.id}>
                      {rating.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none touch-manipulation"
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
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
          {/* Results Info */}
          <div className="text-gray-600">
            Showing {startIndex + 1}-
            {Math.min(endIndex, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
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

        {/* No Results Message */}
        {filteredProducts.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Package className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-4">
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
        {filteredProducts.length > 0 && (
          <div
            className={`grid gap-4 sm:gap-6 lg:gap-8 mb-12 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {currentProducts.map((product) => (
              <Card
                key={product.id}
                className={`group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  viewMode === "list"
                    ? "flex flex-col md:flex-row"
                    : "flex flex-col"
                }`}
                padding={false}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Product Image */}
                <div
                  className={`relative overflow-hidden ${
                    viewMode === "list"
                      ? "md:w-80 flex-shrink-0 h-64 md:h-auto"
                      : "h-64 sm:h-72"
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <Badge variant={getBadgeVariant(product.badge)} size="sm">
                      {product.badge}
                    </Badge>
                    {!product.inStock && (
                      <Badge variant="danger" size="sm">
                        Out of Stock
                      </Badge>
                    )}
                  </div>

                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{product.discount}%
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => toggleLike(product.id, e)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors touch-manipulation ${
                        likedProducts.has(product.id)
                          ? "bg-red-500 text-white"
                          : "bg-white/90 text-gray-600 hover:text-red-500"
                      }`}
                      aria-label="Add to wishlist"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleQuickView(product, e)}
                      className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 transition-colors touch-manipulation"
                      aria-label="Quick view"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Quick Features */}
                  <div className="absolute bottom-3 left-3 flex gap-1 flex-wrap">
                    {product.freeShipping && (
                      <Badge variant="success" size="sm">
                        Free Ship
                      </Badge>
                    )}
                    {product.fastDelivery && (
                      <Badge variant="warning" size="sm">
                        Fast
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  {/* Shop Name */}
                  <div className="mb-2">
                    <span
                      className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/shop/${product.shopId}`);
                      }}
                    >
                      {product.shop}
                    </span>
                  </div>

                  {/* Product Title */}
                  <div className="mb-3 h-12 sm:h-14 flex items-start">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                      {product.name}
                    </h3>
                  </div>

                  {/* Rating */}
                  <div className="mb-3 h-5">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4 h-8">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        LKR {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          LKR {product.originalPrice}
                        </span>
                      )}
                      {product.discount && (
                        <Badge variant="success" size="sm">
                          Save LKR 
                          {(product.originalPrice - product.price).toFixed(2)}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Spacer to push buttons to bottom */}
                  <div className="flex-grow"></div>

                  {/* Action Buttons */}
                  <div className="space-y-2 mt-4">
                    {/* Main Buy Now Button */}
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full py-3 font-semibold touch-manipulation"
                      disabled={!product.inStock}
                      onClick={(e) => handleBuyNow(product, e)}
                    >
                      {product.inStock ? "Buy it Now" : "Out of Stock"}
                    </Button>

                    {/* Secondary Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 touch-manipulation"
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Cart
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 border border-blue-300 text-blue-700 hover:bg-blue-50 touch-manipulation"
                        onClick={(e) => handleVisitShop(product, e)}
                      >
                        <Store className="h-4 w-4 mr-1" />
                        Shop
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredProducts.length}
          />
        )}
      </div>
    </section>
  );
};

export default ProductCollection;
