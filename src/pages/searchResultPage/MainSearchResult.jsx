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
} from "lucide-react";

import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";
import SearchFilters from "./SearchFilters";
import Pagination from "../../components/ui/ContactUis/Pagination";

const MainSearchResult = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState("best_match");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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

  // Extended mock products data
  const allProducts = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones Pro Max",
      category: "electronics",
      brand: "apple",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      price: 179.99,
      originalPrice: 249.99,
      rating: 4.8,
      reviews: 234,
      inStock: true,
      freeShipping: true,
      fastDelivery: true,
      verified: true,
      colors: ["black", "white", "blue"],
      sizes: [],
      locations: ["us"],
      conditions: ["new"],
      badge: "Best Seller",
      discount: 28,
      shop: "TechHub Electronics",
    },
    {
      id: 2,
      name: "Smart Fitness Watch Series 5 GPS",
      category: "electronics",
      brand: "samsung",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      price: 299.99,
      originalPrice: 399.99,
      rating: 4.7,
      reviews: 189,
      inStock: true,
      freeShipping: true,
      fastDelivery: false,
      verified: true,
      colors: ["black", "white", "red"],
      sizes: ["s", "m", "l"],
      locations: ["us", "ca"],
      conditions: ["new"],
      badge: "New Arrival",
      discount: 25,
      shop: "SportsTech Store",
    },
    {
      id: 3,
      name: "Portable Bluetooth Speaker Waterproof",
      category: "electronics",
      brand: "sony",
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.6,
      reviews: 156,
      inStock: true,
      freeShipping: false,
      fastDelivery: true,
      verified: false,
      colors: ["black", "blue", "red"],
      sizes: [],
      locations: ["uk"],
      conditions: ["new"],
      badge: "Popular",
      discount: 31,
      shop: "Audio World",
    },
    {
      id: 4,
      name: "Gaming Mechanical Keyboard RGB",
      category: "electronics",
      brand: "lg",
      image:
        "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop",
      price: 149.99,
      originalPrice: 199.99,
      rating: 4.9,
      reviews: 278,
      inStock: true,
      freeShipping: true,
      fastDelivery: true,
      verified: true,
      colors: ["black", "white"],
      sizes: [],
      locations: ["us"],
      conditions: ["new"],
      badge: "Premium",
      discount: 25,
      shop: "Gaming Central",
    },
    {
      id: 5,
      name: "Wireless Charging Pad 15W Fast",
      category: "electronics",
      brand: "apple",
      image:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop",
      price: 49.99,
      originalPrice: 79.99,
      rating: 4.5,
      reviews: 98,
      inStock: false,
      freeShipping: true,
      fastDelivery: false,
      verified: true,
      colors: ["white", "black"],
      sizes: [],
      locations: ["us"],
      conditions: ["new"],
      badge: "Sale",
      discount: 38,
      shop: "AccessoryHub",
    },
    {
      id: 6,
      name: "Professional Running Shoes",
      category: "clothing",
      brand: "nike",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
      price: 129.99,
      originalPrice: 179.99,
      rating: 4.7,
      reviews: 342,
      inStock: true,
      freeShipping: true,
      fastDelivery: true,
      verified: true,
      colors: ["black", "white", "red", "blue"],
      sizes: ["s", "m", "l", "xl"],
      locations: ["us", "uk"],
      conditions: ["new"],
      badge: "Best Seller",
      discount: 28,
      shop: "Sports Galaxy",
    },
    {
      id: 7,
      name: "Vintage Leather Backpack",
      category: "accessories",
      brand: "nike",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
      price: 89.99,
      originalPrice: 139.99,
      rating: 4.6,
      reviews: 167,
      inStock: true,
      freeShipping: false,
      fastDelivery: false,
      verified: false,
      colors: ["black", "brown", "gray"],
      sizes: [],
      locations: ["ca"],
      conditions: ["new"],
      badge: "Trending",
      discount: 36,
      shop: "Leather Craft Co",
    },
    {
      id: 8,
      name: "Smart Home Security Camera 4K",
      category: "electronics",
      brand: "sony",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
      price: 199.99,
      originalPrice: 279.99,
      rating: 4.8,
      reviews: 289,
      inStock: true,
      freeShipping: true,
      fastDelivery: true,
      verified: true,
      colors: ["white", "black"],
      sizes: [],
      locations: ["us", "uk", "au"],
      conditions: ["new"],
      badge: "Premium",
      discount: 29,
      shop: "SecureHome Tech",
    },
    // Additional products for pagination
    ...Array.from({ length: 40 }, (_, i) => ({
      id: 9 + i,
      name: `Product ${9 + i} - ${
        ["Wireless", "Smart", "Pro", "Max", "Ultra"][i % 5]
      } Edition`,
      category: ["electronics", "clothing", "accessories", "home"][i % 4],
      brand: ["apple", "samsung", "nike", "sony", "lg"][i % 5],
      image: `https://images.unsplash.com/photo-150574042${
        8 + (i % 10)
      }-b95a79798f07?w=300&h=300&fit=crop`,
      price: 29.99 + i * 10,
      originalPrice: 49.99 + i * 15,
      rating: 3.5 + Math.random() * 1.5,
      reviews: 50 + i * 5,
      inStock: i % 7 !== 0,
      freeShipping: i % 3 === 0,
      fastDelivery: i % 4 === 0,
      verified: i % 5 === 0,
      colors: [
        ["black", "white"],
        ["blue", "red"],
        ["green", "yellow"],
      ][i % 3],
      sizes: i % 2 === 0 ? ["s", "m", "l"] : [],
      locations: [["us"], ["uk", "ca"], ["au", "de"]][i % 3],
      conditions: ["new", "refurbished", "used"][i % 3]
        ? [["new", "refurbished", "used"][i % 3]]
        : ["new"],
      badge: ["Featured", "Sale", "Popular", "New"][i % 4],
      discount: 10 + (i % 30),
      shop: `Store ${i + 1}`,
    })),
  ];

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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.shop.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply all filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    if (filters.priceRange.min || filters.priceRange.max) {
      filtered = filtered.filter((product) => {
        const price = product.price;
        const minCheck =
          !filters.priceRange.min || price >= filters.priceRange.min;
        const maxCheck =
          !filters.priceRange.max || price <= filters.priceRange.max;
        return minCheck && maxCheck;
      });
    }

    if (filters.rating) {
      filtered = filtered.filter((product) => product.rating >= filters.rating);
    }

    if (filters.freeShipping) {
      filtered = filtered.filter((product) => product.freeShipping);
    }
    if (filters.inStock) {
      filtered = filtered.filter((product) => product.inStock);
    }
    if (filters.fastDelivery) {
      filtered = filtered.filter((product) => product.fastDelivery);
    }
    if (filters.verified) {
      filtered = filtered.filter((product) => product.verified);
    }

    if (filters.brands.length > 0) {
      filtered = filtered.filter((product) =>
        filters.brands.includes(product.brand)
      );
    }

    if (filters.colors.length > 0) {
      filtered = filtered.filter((product) =>
        product.colors.some((color) => filters.colors.includes(color))
      );
    }

    if (filters.sizes.length > 0) {
      filtered = filtered.filter((product) =>
        product.sizes.some((size) => filters.sizes.includes(size))
      );
    }

    if (filters.locations.length > 0) {
      filtered = filtered.filter((product) =>
        product.locations.some((location) =>
          filters.locations.includes(location)
        )
      );
    }

    if (filters.conditions.length > 0) {
      filtered = filtered.filter((product) =>
        product.conditions.some((condition) =>
          filters.conditions.includes(condition)
        )
      );
    }

    // Sort products
    switch (sortBy) {
      case "newest":
        filtered = [...filtered].sort((a, b) => b.id - a.id);
        break;
      case "price_low":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);
        break;
      case "discount":
        filtered = [...filtered].sort(
          (a, b) => (b.discount || 0) - (a.discount || 0)
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [allProducts, searchQuery, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const renderProductCard = (product) => (
    <Card
      key={product.id}
      className={`group overflow-hidden hover:shadow-lg transition-all duration-300 h-full cursor-pointer ${
        viewMode === "list" ? "flex flex-col md:flex-row" : "flex flex-col"
      }`}
      padding={false}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Product Image */}
      <div
        className={`relative overflow-hidden flex-shrink-0 ${
          viewMode === "list" ? "h-48 md:h-64 md:w-64" : "h-56 sm:h-64 md:h-72"
        }`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge variant={getBadgeVariant(product.badge)} size="sm">
            {product.badge}
          </Badge>
          {!product.inStock && (
            <Badge variant="danger" size="sm">
              Out of Stock
            </Badge>
          )}
          {product.verified && (
            <Badge variant="success" size="sm">
              Verified
            </Badge>
          )}
        </div>

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-2 right-2">
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discount}%
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-2 right-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors touch-manipulation"
            aria-label="Add to wishlist"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 transition-colors touch-manipulation"
            aria-label="Quick view"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Features */}
        <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
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
      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
        {/* Shop Name */}
        <div className="mb-2">
          <span
            className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              // Navigate to shop page logic here
              console.log("Navigate to shop:", product.shop);
            }}
          >
            {product.shop}
          </span>
        </div>

        {/* Title */}
        <div className="mb-3 h-12 sm:h-14 flex items-start">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight text-sm sm:text-base md:text-lg">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3 sm:mb-4 h-5 sm:h-6">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 sm:h-5 sm:w-5 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm sm:text-base text-gray-600 whitespace-nowrap">
            {product.rating.toFixed(1)} ({product.reviews})
          </span>
        </div>

        {/* Features */}
        <div className="mb-3 sm:mb-4 h-6 sm:h-7 flex items-center gap-2">
          {product.freeShipping && (
            <div className="flex items-center text-sm text-green-600">
              <Truck className="h-4 w-4 mr-1" />
              Free Ship
            </div>
          )}
          {product.locations.length > 0 && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              {product.locations[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm sm:text-base text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>
          {product.discount && (
            <Badge variant="success" size="sm">
              Save ${(product.originalPrice - product.price).toFixed(2)}
            </Badge>
          )}
        </div>

        {/* Add to Cart & Buy Now Buttons - Side by Side */}
        <div className="flex gap-2 sm:gap-3">
          <Button
            variant="primary"
            size="sm"
            className="flex-1 text-xs sm:text-sm py-3 sm:py-3.5 px-3 sm:px-4 touch-manipulation font-semibold"
            disabled={!product.inStock}
            onClick={(e) => {
              e.stopPropagation();
              // Add to cart logic here
              console.log("Added to cart:", product.id);
            }}
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {product.inStock ? (
              <>
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Cart</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Out of Stock</span>
                <span className="sm:hidden">No Stock</span>
              </>
            )}
          </Button>

          {product.inStock && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs sm:text-sm py-3 sm:py-3.5 px-3 sm:px-4 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors touch-manipulation font-semibold"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/checkout?product=${product.id}&quantity=1`);
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

  return (
    <div className="min-h-screen bg-gray-50">
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
                Search Results
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                {filteredProducts.length.toLocaleString()} products found
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
              resultsCount={filteredProducts.length}
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

                  {/* Sort Dropdown */}
                  <div className="flex-shrink-0">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full lg:w-auto border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[180px] touch-manipulation"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>

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
                    Showing {startIndex + 1}-
                    {Math.min(
                      startIndex + itemsPerPage,
                      filteredProducts.length
                    )}{" "}
                    of {filteredProducts.length.toLocaleString()} products
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
                  resultsCount={filteredProducts.length}
                />
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
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
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredProducts.length}
                  className="mt-6 sm:mt-8"
                />
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
                    : "Try adjusting your search or filters to find what you're looking for."}
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
                  <Button
                    onClick={handleClearFilters}
                    className="touch-manipulation"
                  >
                    Clear All Filters
                  </Button>
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
