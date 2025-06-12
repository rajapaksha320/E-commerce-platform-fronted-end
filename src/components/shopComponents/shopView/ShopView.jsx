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
} from "lucide-react";

import { Button, Badge, ContactCard as Card } from "../../ui/ContactUis/Uis";
import Tabs from "../../ui/shopUis/Tabs";
import FilterSidebar from "./FilterSidebar";
import ShopHeader from "./ShopHeader";
import ReviewsSection from "./ReviewsSection";
import Pagination from "../../ui/ContactUis/Pagination";

const ShopView = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("home");
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("best_match");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: null, max: null },
    rating: null,
    freeShipping: false,
    inStock: false,
    fastDelivery: false,
    brands: [],
    colors: [],
    sizes: [],
  });

  // Mock shop data - in real app, this would come from API
  const shopData = {
    id: shopId,
    name: "TechHub Electronics",
    tagline: "Your Premier Destination for Latest Technology",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
    rating: 4.8,
    reviews: 1250,
    followers: 15420,
    totalProducts: 1156,
    verified: true,
    badge: "Premium Seller",
    location: "New York, NY",
    businessHours: "9:00 AM - 9:00 PM EST",
    phone: "+1 (555) 123-4567",
    email: "support@techhub.com",
    website: "https://techhub.com",
    description:
      "TechHub Electronics has been serving customers with the latest technology products for over 10 years. We specialize in consumer electronics, smart home devices, and cutting-edge gadgets. Our commitment to quality and customer satisfaction has made us a trusted name in the industry.",
    policies: [
      {
        icon: Package,
        title: "Free Shipping",
        description: "Free shipping on orders over $50",
      },
      {
        icon: Heart,
        title: "30-Day Returns",
        description: "Easy returns within 30 days",
      },
      {
        icon: Star,
        title: "Warranty",
        description: "1-year warranty on all products",
      },
    ],
  };

  // Extended Mock products data with more products for pagination
  const allProducts = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones Pro",
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
      colors: ["black", "white", "blue"],
      sizes: [],
      badge: "Best Seller",
      discount: 28,
    },
    {
      id: 2,
      name: "Smart Fitness Watch Series 5",
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
      colors: ["black", "white", "red"],
      sizes: ["s", "m", "l"],
      badge: "New Arrival",
      discount: 25,
    },
    {
      id: 3,
      name: "Portable Bluetooth Speaker",
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
      colors: ["black", "blue", "red"],
      sizes: [],
      badge: "Popular",
      discount: 31,
    },
    {
      id: 4,
      name: "Gaming Mechanical Keyboard",
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
      colors: ["black", "white"],
      sizes: [],
      badge: "Premium",
      discount: 25,
    },
    {
      id: 5,
      name: "Wireless Charging Pad",
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
      colors: ["white", "black"],
      sizes: [],
      badge: "Sale",
      discount: 38,
    },
    {
      id: 6,
      name: "USB-C Hub Multi-Port Adapter",
      category: "electronics",
      brand: "samsung",
      image:
        "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=300&h=300&fit=crop",
      price: 79.99,
      originalPrice: 119.99,
      rating: 4.4,
      reviews: 167,
      inStock: true,
      freeShipping: true,
      fastDelivery: true,
      colors: ["gray", "black"],
      sizes: [],
      badge: "Featured",
      discount: 33,
    },
    // Additional products for pagination demo
    {
      id: 7,
      name: "4K Webcam with Auto Focus",
      category: "electronics",
      brand: "sony",
      image:
        "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300&h=300&fit=crop",
      price: 129.99,
      originalPrice: 179.99,
      rating: 4.6,
      reviews: 145,
      inStock: true,
      freeShipping: true,
      fastDelivery: true,
      colors: ["black"],
      sizes: [],
      badge: "New Arrival",
      discount: 28,
    },
    {
      id: 8,
      name: "Wireless Mouse Ergonomic",
      category: "electronics",
      brand: "lg",
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
      price: 39.99,
      originalPrice: 59.99,
      rating: 4.3,
      reviews: 89,
      inStock: true,
      freeShipping: false,
      fastDelivery: true,
      colors: ["black", "white", "gray"],
      sizes: [],
      badge: "Popular",
      discount: 33,
    },
    {
      id: 9,
      name: "Portable SSD 1TB",
      category: "electronics",
      brand: "samsung",
      image:
        "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&h=300&fit=crop",
      price: 199.99,
      originalPrice: 279.99,
      rating: 4.8,
      reviews: 312,
      inStock: true,
      freeShipping: true,
      fastDelivery: false,
      colors: ["black", "blue"],
      sizes: [],
      badge: "Best Seller",
      discount: 29,
    },
    {
      id: 10,
      name: "Smartphone Stand Adjustable",
      category: "electronics",
      brand: "apple",
      image:
        "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=300&h=300&fit=crop",
      price: 24.99,
      originalPrice: 39.99,
      rating: 4.2,
      reviews: 67,
      inStock: true,
      freeShipping: false,
      fastDelivery: true,
      colors: ["black", "white", "gray"],
      sizes: [],
      badge: "Featured",
      discount: 38,
    },
    {
      id: 11,
      name: "USB-C Fast Charger 65W",
      category: "electronics",
      brand: "apple",
      image:
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
      price: 59.99,
      originalPrice: 89.99,
      rating: 4.7,
      reviews: 198,
      inStock: true,
      freeShipping: true,
      fastDelivery: true,
      colors: ["white", "black"],
      sizes: [],
      badge: "Premium",
      discount: 33,
    },
    {
      id: 12,
      name: "Bluetooth Tracking Device",
      category: "electronics",
      brand: "sony",
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop",
      price: 29.99,
      originalPrice: 49.99,
      rating: 4.4,
      reviews: 123,
      inStock: true,
      freeShipping: false,
      fastDelivery: false,
      colors: ["black", "white"],
      sizes: [],
      badge: "Sale",
      discount: 40,
    },
    {
      id: 13,
      name: "Smart Doorbell Camera",
      category: "electronics",
      brand: "lg",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
      price: 159.99,
      originalPrice: 229.99,
      rating: 4.6,
      reviews: 256,
      inStock: true,
      freeShipping: true,
      fastDelivery: true,
      colors: ["black", "white"],
      sizes: [],
      badge: "New Arrival",
      discount: 30,
    },
    {
      id: 14,
      name: "Wireless Earbuds Pro Max",
      category: "electronics",
      brand: "apple",
      image:
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
      price: 249.99,
      originalPrice: 329.99,
      rating: 4.9,
      reviews: 445,
      inStock: true,
      freeShipping: true,
      fastDelivery: true,
      colors: ["black", "white", "blue"],
      sizes: [],
      badge: "Premium",
      discount: 24,
    },
    {
      id: 15,
      name: "Smart Home Hub",
      category: "electronics",
      brand: "samsung",
      image:
        "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=300&h=300&fit=crop",
      price: 99.99,
      originalPrice: 149.99,
      rating: 4.5,
      reviews: 178,
      inStock: false,
      freeShipping: true,
      fastDelivery: false,
      colors: ["white", "black"],
      sizes: [],
      badge: "Featured",
      discount: 33,
    },
  ];

  const tabs = [
    { id: "home", name: "Shop Home", icon: Home },
    {
      id: "products",
      name: "Products",
      icon: Package,
      count: shopData.totalProducts,
    },
    {
      id: "feedback",
      name: "Reviews",
      icon: MessageSquare,
      count: shopData.reviews,
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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    // Price range filter
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

    // Rating filter
    if (filters.rating) {
      filtered = filtered.filter((product) => product.rating >= filters.rating);
    }

    // Shipping and availability filters
    if (filters.freeShipping) {
      filtered = filtered.filter((product) => product.freeShipping);
    }
    if (filters.inStock) {
      filtered = filtered.filter((product) => product.inStock);
    }
    if (filters.fastDelivery) {
      filtered = filtered.filter((product) => product.fastDelivery);
    }

    // Brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter((product) =>
        filters.brands.includes(product.brand)
      );
    }

    // Color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter((product) =>
        product.colors.some((color) => filters.colors.includes(color))
      );
    }

    // Size filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((product) =>
        product.sizes.some((size) => filters.sizes.includes(size))
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

  // Reset page when filters change (without scrolling)
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, sortBy]);

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
      brands: [],
      colors: [],
      sizes: [],
    });
    setSearchQuery("");
  };

  // Handle manual page navigation with scrolling
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when user manually navigates pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle page navigation without scrolling (for programmatic changes)
  const handlePageChangeNoScroll = (page) => {
    setCurrentPage(page);
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

  const renderProductCard = (product) => (
    <Card
      key={product.id}
      className={`group overflow-hidden hover:shadow-lg transition-all duration-300 h-full ${
        viewMode === "list" ? "flex flex-col sm:flex-row" : "flex flex-col"
      }`}
      padding={false}
    >
      {/* Product Image */}
      <div
        className={`relative overflow-hidden flex-shrink-0 ${
          viewMode === "list" ? "h-48 sm:h-64 sm:w-64" : "h-48 sm:h-56 md:h-64"
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
          <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors touch-manipulation">
            <Heart className="h-4 w-4" />
          </button>
          <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 transition-colors touch-manipulation">
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

      {/* Product Info - Using flexbox for consistent alignment */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {/* Title - Fixed height container */}
        <div className="mb-2 h-10 sm:h-12 flex items-start">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight text-sm sm:text-base">
            {product.name}
          </h3>
        </div>

        {/* Rating - Fixed height */}
        <div className="flex items-center gap-1 mb-2 sm:mb-3 h-4 sm:h-5">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Colors - Fixed height container */}
        <div className="mb-2 sm:mb-3 h-5 sm:h-6">
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Colors:</span>
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300"
                  style={{
                    backgroundColor:
                      color === "black"
                        ? "#000000"
                        : color === "white"
                        ? "#FFFFFF"
                        : color === "blue"
                        ? "#3B82F6"
                        : color === "red"
                        ? "#EF4444"
                        : color === "gray"
                        ? "#6B7280"
                        : "#9CA3AF",
                  }}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Spacer to push price and button to bottom */}
        <div className="flex-1"></div>

        {/* Price - Fixed position from bottom */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">
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

        {/* Add to Cart Button - Always at bottom */}
        <Button
          variant="primary"
          size="sm"
          className="w-full mt-auto touch-manipulation text-xs sm:text-sm py-2 sm:py-2.5"
          disabled={!product.inStock}
        >
          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
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
        {/* Shop Header - Always visible */}
        <ShopHeader shop={shopData} className="mb-6 sm:mb-8" />

        {/* Tabs - Responsive */}
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
            {/* Shop Statistics - Responsive Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <Card className="text-center p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
                  {shopData.totalProducts}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Products</div>
              </Card>
              <Card className="text-center p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">
                  {shopData.rating}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Rating</div>
              </Card>
              <Card className="text-center p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">
                  {shopData.reviews}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Reviews</div>
              </Card>
              <Card className="text-center p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">
                  {shopData.followers.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Followers
                </div>
              </Card>
            </div>

            {/* Featured Products */}
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Featured Products
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {allProducts.slice(0, 3).map(renderProductCard)}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "products" && (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Filters Sidebar - Desktop (Always visible) */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                filters={filters}
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
                      {Object.values(filters).some((f) =>
                        Array.isArray(f)
                          ? f.length > 0
                          : typeof f === "boolean"
                          ? f
                          : typeof f === "object" && f !== null
                          ? f.min || f.max
                          : f
                      ) && (
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
                      Showing {startIndex + 1}-
                      {Math.min(
                        startIndex + itemsPerPage,
                        filteredProducts.length
                      )}{" "}
                      of {filteredProducts.length} products
                    </div>

                    {/* Active Filters Indicator */}
                    <div className="flex items-center gap-2">
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
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              )}

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
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

                  {/* Pagination using your component */}
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
                    Try adjusting your search or filters to find what you're
                    looking for.
                  </p>
                  <Button
                    onClick={handleClearFilters}
                    className="touch-manipulation"
                  >
                    Clear All Filters
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
