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
} from "lucide-react";

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
    { id: "all", name: "All Prices" },
    { id: "0-25", name: "$0 - $25" },
    { id: "25-50", name: "$25 - $50" },
    { id: "50-100", name: "$50 - $100" },
    { id: "100-200", name: "$100 - $200" },
    { id: "200+", name: "$200+" },
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
    },
    {
      id: 2,
      name: "Smart Fitness Watch Series 7",
      shop: "SportZone Pro",
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
    },
    {
      id: 3,
      name: "Premium Coffee Maker Deluxe",
      shop: "Home Comfort Store",
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
    },
    {
      id: 4,
      name: "Designer Leather Backpack",
      shop: "Fashion Forward",
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
    },
    {
      id: 5,
      name: "Professional Camera Lens 85mm",
      shop: "Photo Pro Studio",
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
    },
    {
      id: 6,
      name: "Gaming Mechanical Keyboard RGB",
      shop: "GameZone Central",
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
    },
    {
      id: 7,
      name: "Portable Bluetooth Speaker",
      shop: "Audio Excellence",
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
    },
    {
      id: 8,
      name: "Wireless Charging Pad Fast",
      shop: "TechHub Electronics",
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
    },
    {
      id: 9,
      name: "Organic Skincare Set Premium",
      shop: "Beauty Essentials",
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
    },
    {
      id: 10,
      name: "Running Shoes Athletic Pro",
      shop: "SportZone Pro",
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
    },
    {
      id: 11,
      name: "Smart Home Security Camera",
      shop: "SecureHome Tech",
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
    },
    {
      id: 12,
      name: "Vintage Style Denim Jacket",
      shop: "Fashion Forward",
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
    },
    {
      id: 13,
      name: "Indoor Plant Collection Set",
      shop: "Green Garden Store",
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
    },
    {
      id: 14,
      name: "Professional Hair Dryer",
      shop: "Beauty Essentials",
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
    },
    {
      id: 15,
      name: "Educational STEM Robotics Kit",
      shop: "Learning Hub",
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
    },
    {
      id: 16,
      name: "Car Phone Mount Magnetic",
      shop: "Auto Parts Pro",
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
    },
  ];

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
      Hot: "bg-red-100 text-red-800",
      New: "bg-green-100 text-green-800",
      Popular: "bg-blue-100 text-blue-800",
      Trending: "bg-yellow-100 text-yellow-800",
      "#1 Seller": "bg-purple-100 text-purple-800",
      Bestseller: "bg-blue-100 text-blue-800",
      "50% OFF": "bg-red-100 text-red-800",
      "Flash Deal": "bg-orange-100 text-orange-800",
      Organic: "bg-green-100 text-green-800",
      Athletic: "bg-indigo-100 text-indigo-800",
      Smart: "bg-cyan-100 text-cyan-800",
      Vintage: "bg-amber-100 text-amber-800",
      Eco: "bg-emerald-100 text-emerald-800",
      Professional: "bg-slate-100 text-slate-800",
      Educational: "bg-violet-100 text-violet-800",
      Magnetic: "bg-gray-100 text-gray-800",
    };
    return variants[badge] || "bg-gray-100 text-gray-800";
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const toggleLike = (productId) => {
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            {/* Filter Toggle for Mobile */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Filters & Sorting
              </h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Filters */}
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } md:block space-y-4`}
            >
              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        selectedCategory === category.id
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <span>{category.name}</span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
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
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
          </div>
        </div>

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
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 text-sm rounded-lg transition-colors"
                >
                  Clear Search
                </button>
              )}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedPriceRange("all");
                  setSelectedRating("all");
                  setSortBy("featured");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 && (
          <div
            className={`grid gap-6 mb-12 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-lg shadow-md border border-gray-200 group overflow-hidden hover:shadow-lg transition-all duration-300 ${
                  viewMode === "list" ? "flex flex-col md:flex-row" : ""
                }`}
              >
                {/* Product Image */}
                <div
                  className={`relative overflow-hidden ${
                    viewMode === "list" ? "md:w-80 flex-shrink-0" : "h-64"
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeVariant(
                        product.badge
                      )}`}
                    >
                      {product.badge}
                    </span>
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
                      onClick={() => toggleLike(product.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        likedProducts.has(product.id)
                          ? "bg-red-500 text-white"
                          : "bg-white/90 text-gray-600 hover:text-red-500"
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                    <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* Shop Name - Fixed Height */}
                  <div className="h-4 mb-2">
                    <p className="text-xs text-gray-500 truncate">
                      {product.shop}
                    </p>
                  </div>

                  {/* Product Title - Fixed Height */}
                  <div className="h-12 mb-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                      {product.name}
                    </h3>
                  </div>

                  {/* Rating - Fixed Height */}
                  <div className="h-5 mb-3">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                  </div>

                  {/* Price - Fixed Height */}
                  <div className="h-8 mb-4">
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Spacer to push buttons to bottom */}
                  <div className="flex-grow"></div>

                  {/* Action Buttons - Always at bottom */}
                  <div className="space-y-2 mt-auto">
                    {/* Main Buy Now Button */}
                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-[1.02]">
                      Buy it Now
                    </button>

                    {/* Secondary Buttons */}
                    <div className="flex gap-2">
                      <button className="flex-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add to Cart
                      </button>
                      <button className="flex-1 border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm">
                        <Store className="h-4 w-4 mr-1" />
                        Visit Shop
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>

              {/* Page Numbers */}
              <div className="hidden sm:flex items-center gap-1">
                {generatePageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === "..." ? (
                      <span className="px-3 py-2 text-gray-500">...</span>
                    ) : (
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm rounded-md transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCollection;
