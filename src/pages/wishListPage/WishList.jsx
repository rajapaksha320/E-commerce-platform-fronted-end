import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Star,
  ShoppingCart,
  Share2,
  X,
  Package,
  Store,
  ArrowRight,
  Filter,
  Grid3X3,
  List,
  MapPin,
  Users,
  BadgeCheck,
  Trash2,
  ShoppingBag,
  Eye,
  Menu,
  ChevronDown,
} from "lucide-react";

import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";
import Pagination from "../../components/ui/ContactUis/Pagination";

const WishList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  // Pagination states
  const [productsPage, setProductsPage] = useState(1);
  const [shopsPage, setShopsPage] = useState(1);
  const productsPerPage = 8;
  const shopsPerPage = 6;

  // Mock wishlist data
  const [wishlistItems, setWishlistItems] = useState({
    products: [
      {
        id: 1,
        name: "Wireless Bluetooth Headphones Pro Max",
        brand: "TechAudio",
        price: 179.99,
        originalPrice: 249.99,
        discount: 28,
        rating: 4.8,
        totalReviews: 1247,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        inStock: true,
        category: "Electronics",
        dateAdded: "2024-01-15",
        badge: "Best Seller",
      },
      {
        id: 2,
        name: "Premium Leather Handbag",
        brand: "LuxeFashion",
        price: 299.99,
        originalPrice: 399.99,
        discount: 25,
        rating: 4.6,
        totalReviews: 823,
        image:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
        inStock: true,
        category: "Fashion",
        dateAdded: "2024-01-12",
        badge: "New",
      },
      {
        id: 3,
        name: "Smart Fitness Watch",
        brand: "FitTech",
        price: 199.99,
        originalPrice: 279.99,
        discount: 29,
        rating: 4.7,
        totalReviews: 956,
        image:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
        inStock: false,
        category: "Electronics",
        dateAdded: "2024-01-10",
        badge: "Popular",
      },
      {
        id: 4,
        name: "Organic Coffee Beans",
        brand: "BrewMaster",
        price: 24.99,
        originalPrice: 34.99,
        discount: 29,
        rating: 4.9,
        totalReviews: 445,
        image:
          "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
        inStock: true,
        category: "Food",
        dateAdded: "2024-01-08",
        badge: "Organic",
      },
      {
        id: 5,
        name: "Gaming Mechanical Keyboard",
        brand: "GamePro",
        price: 149.99,
        originalPrice: 199.99,
        discount: 25,
        rating: 4.5,
        totalReviews: 678,
        image:
          "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
        inStock: true,
        category: "Electronics",
        dateAdded: "2024-01-05",
        badge: "Gaming",
      },
      {
        id: 6,
        name: "Yoga Mat Premium",
        brand: "ZenFit",
        price: 59.99,
        originalPrice: 79.99,
        discount: 25,
        rating: 4.7,
        totalReviews: 334,
        image:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
        inStock: true,
        category: "Sports",
        dateAdded: "2024-01-03",
        badge: "Eco-Friendly",
      },
    ],
    shops: [
      {
        id: 1,
        name: "TechHub Electronics",
        description: "Premium electronics and gadgets for tech enthusiasts",
        rating: 4.9,
        totalReviews: 15420,
        totalProducts: 2847,
        followers: 45200,
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
        verified: true,
        location: "New York, NY",
        dateAdded: "2024-01-14",
        categories: ["Electronics", "Gadgets", "Accessories"],
        badge: "Verified",
      },
      {
        id: 2,
        name: "Fashion Forward",
        description: "Trendy fashion and lifestyle products for modern living",
        rating: 4.7,
        totalReviews: 8934,
        totalProducts: 1256,
        followers: 28700,
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
        verified: true,
        location: "Los Angeles, CA",
        dateAdded: "2024-01-11",
        categories: ["Fashion", "Lifestyle", "Accessories"],
        badge: "Top Rated",
      },
      {
        id: 3,
        name: "Organic Market",
        description: "Fresh organic produce and natural health products",
        rating: 4.8,
        totalReviews: 6721,
        totalProducts: 892,
        followers: 19300,
        image:
          "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
        verified: false,
        location: "Portland, OR",
        dateAdded: "2024-01-09",
        categories: ["Food", "Health", "Organic"],
        badge: "Eco-Friendly",
      },
    ],
  });

  const categories = [
    "all",
    ...new Set([
      ...wishlistItems.products.map((p) => p.category),
      ...wishlistItems.shops.flatMap((s) => s.categories),
    ]),
  ];

  const removeFromWishlist = (type, id) => {
    setWishlistItems((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item.id !== id),
    }));
  };

  const handleAddToCart = (product) => {
    console.log("Added to cart:", product);
    // Add your cart logic here
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleViewShop = (shopId) => {
    navigate(`/shop/${shopId}`);
  };

  const handleShare = async (type, item) => {
    const baseUrl = window.location.origin;
    const url =
      type === "shop"
        ? `${baseUrl}/shop/${item.id}`
        : `${baseUrl}/product/${item.id}`;

    const title =
      type === "shop"
        ? `Check out ${item.name} - ${item.description}`
        : `Check out ${item.name} by ${item.brand}`;

    const text =
      type === "shop"
        ? `${item.name} - ${item.description}. ${
            item.rating
          }⭐ (${item.totalReviews.toLocaleString()} reviews)`
        : `${item.name} by ${item.brand} - ${item.price}. ${
            item.rating
          }⭐ (${item.totalReviews.toLocaleString()} reviews)`;

    try {
      // Check if Web Share API is supported (mainly mobile browsers)
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
        setShareMessage("Shared successfully!");
      } else {
        // Fallback to clipboard API
        await navigator.clipboard.writeText(url);
        setShareMessage("Link copied to clipboard!");
      }
    } catch (error) {
      // If both fail, show the URL in an alert as last resort
      if (error.name !== "AbortError") {
        prompt("Copy this link to share:", url);
        setShareMessage("Link ready to copy!");
      }
    }

    // Clear message after 3 seconds
    setTimeout(() => setShareMessage(""), 3000);
  };

  const getBadgeVariant = (badge) => {
    const variants = {
      "Best Seller": "success",
      New: "primary",
      Popular: "warning",
      Organic: "success",
      Verified: "primary",
      "Top Rated": "warning",
      "Eco-Friendly": "success",
      Gaming: "primary",
    };
    return variants[badge] || "default";
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 sm:h-4 sm:w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const filteredItems = () => {
    let products = wishlistItems.products;
    let shops = wishlistItems.shops;

    if (selectedCategory !== "all") {
      products = products.filter((p) => p.category === selectedCategory);
      shops = shops.filter((s) => s.categories.includes(selectedCategory));
    }

    return { products, shops };
  };

  const { products: filteredProducts, shops: filteredShops } = filteredItems();

  // Define tabs after filtered items are calculated
  const tabs = [
    {
      id: "all",
      name: "All",
      fullName: "All Items",
      count: filteredProducts.length + filteredShops.length,
    },
    {
      id: "products",
      name: "Products",
      fullName: "Products",
      count: filteredProducts.length,
    },
    {
      id: "shops",
      name: "Shops",
      fullName: "Shops",
      count: filteredShops.length,
    },
  ];

  // Pagination calculations
  const totalProductPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );
  const totalShopPages = Math.ceil(filteredShops.length / shopsPerPage);

  // Get paginated data
  const getPaginatedProducts = () => {
    const startIndex = (productsPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  };

  const getPaginatedShops = () => {
    const startIndex = (shopsPage - 1) * shopsPerPage;
    return filteredShops.slice(startIndex, startIndex + shopsPerPage);
  };

  const getItemsToShow = () => {
    const paginatedProducts = getPaginatedProducts();
    const paginatedShops = getPaginatedShops();

    switch (activeTab) {
      case "products":
        return { products: paginatedProducts, shops: [] };
      case "shops":
        return { products: [], shops: paginatedShops };
      default:
        return { products: paginatedProducts, shops: paginatedShops };
    }
  };

  const { products: displayProducts, shops: displayShops } = getItemsToShow();
  const isEmpty = displayProducts.length === 0 && displayShops.length === 0;

  // Reset pagination when filters change
  useEffect(() => {
    setProductsPage(1);
    setShopsPage(1);
  }, [selectedCategory, activeTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Share Success Message */}
      {shareMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
          {shareMessage}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          {/* Main Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-red-500 mr-2 sm:mr-3 fill-current" />
                My Wishlist
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                <span className="block sm:inline">
                  {filteredProducts.length + filteredShops.length} items saved
                </span>
                {selectedCategory !== "all" && (
                  <span className="block sm:inline sm:ml-2 text-blue-600">
                    • Filtered by {selectedCategory}
                  </span>
                )}
              </p>
            </div>

            {/* View Mode Toggle - Desktop */}
            <div className="hidden lg:flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 sm:mt-6 border-b border-gray-200">
            <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span className="hidden sm:inline">{tab.fullName}</span>
                  <span className="sm:hidden">{tab.name}</span>
                  <span className="ml-1 sm:ml-2 bg-gray-100 text-gray-600 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Filters and Controls */}
          <div className="mt-3 sm:mt-4">
            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between lg:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Mobile View Mode Toggle */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 lg:hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  <Grid3X3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Filter Content */}
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } lg:block mt-3 lg:mt-0`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-600 hidden lg:block" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full sm:w-auto text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        {isEmpty ? (
          /* Empty State */
          <Card className="text-center py-8 sm:py-12">
            <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 mb-6 px-4">
              Start adding products and shops you love to see them here
            </p>
            <Button
              onClick={() => navigate("/")}
              className="inline-flex items-center"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Card>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Saved Shops */}
            {displayShops.length > 0 && (
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <Store className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                  Saved Shops ({displayShops.length})
                </h2>

                <div
                  className={`grid gap-3 sm:gap-4 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {displayShops.map((shop) => (
                    <Card
                      key={shop.id}
                      className="group hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative">
                        <img
                          src={shop.image}
                          alt={shop.name}
                          className="w-full h-36 sm:h-48 object-cover rounded-lg mb-3 sm:mb-4"
                        />
                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                          <Badge
                            variant={getBadgeVariant(shop.badge)}
                            size="sm"
                          >
                            {shop.badge}
                          </Badge>
                        </div>
                        <button
                          onClick={() => removeFromWishlist("shops", shop.id)}
                          className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-all group-hover:scale-110"
                        >
                          <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 hover:text-red-600" />
                        </button>
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                              {shop.name}
                            </h3>
                            {shop.verified && (
                              <BadgeCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                            {shop.description}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            {renderStars(shop.rating)}
                            <span className="font-medium">{shop.rating}</span>
                            <span className="hidden sm:inline">
                              ({shop.totalReviews.toLocaleString()})
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span>
                              {shop.totalProducts.toLocaleString()} products
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span>
                              {shop.followers.toLocaleString()} followers
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600">
                          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span>{shop.location}</span>
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <Button
                            onClick={() => handleViewShop(shop.id)}
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs sm:text-sm"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden sm:inline">Visit Shop</span>
                            <span className="sm:hidden">Visit</span>
                          </Button>
                          <Button
                            onClick={() => handleShare("shop", shop)}
                            size="sm"
                            className="p-2"
                            title="Share shop"
                          >
                            <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Shops Pagination */}
                {filteredShops.length > shopsPerPage && (
                  <div className="mt-4 sm:mt-6">
                    <Pagination
                      currentPage={shopsPage}
                      totalPages={totalShopPages}
                      onPageChange={setShopsPage}
                      itemsPerPage={shopsPerPage}
                      totalItems={filteredShops.length}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Saved Products */}
            {displayProducts.length > 0 && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
                    Saved Products ({filteredProducts.length})
                  </h2>
                  {filteredProducts.length > productsPerPage && (
                    <p className="text-xs sm:text-sm text-gray-600">
                      Showing {(productsPage - 1) * productsPerPage + 1}-
                      {Math.min(
                        productsPage * productsPerPage,
                        filteredProducts.length
                      )}{" "}
                      of {filteredProducts.length}
                    </p>
                  )}
                </div>

                <div
                  className={`grid gap-3 sm:gap-4 ${
                    viewMode === "grid"
                      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-1"
                  }`}
                >
                  {displayProducts.map((product) => (
                    <Card
                      key={product.id}
                      className={`group hover:shadow-lg transition-all duration-300 ${
                        viewMode === "list" ? "lg:flex lg:space-x-4" : ""
                      }`}
                    >
                      <div
                        className={`relative ${
                          viewMode === "list" ? "lg:w-48 lg:flex-shrink-0" : ""
                        }`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`w-full object-cover rounded-lg ${
                            viewMode === "list"
                              ? "aspect-square lg:h-32 lg:w-32"
                              : "aspect-square"
                          } mb-2 sm:mb-3`}
                        />
                        <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2">
                          <Badge
                            variant={getBadgeVariant(product.badge)}
                            size="sm"
                            className="text-xs"
                          >
                            {product.badge}
                          </Badge>
                        </div>
                        <button
                          onClick={() =>
                            removeFromWishlist("products", product.id)
                          }
                          className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 p-1 sm:p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm transition-all group-hover:scale-110"
                        >
                          <X className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 hover:text-red-600" />
                        </button>
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <span className="text-white font-medium text-xs bg-red-600 px-2 py-1 rounded-full">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      <div
                        className={`space-y-1.5 sm:space-y-2 ${
                          viewMode === "list" ? "lg:flex-1" : ""
                        }`}
                      >
                        <div>
                          <p className="text-xs text-blue-600 font-medium">
                            {product.brand}
                          </p>
                          <h3 className="font-medium text-gray-900 text-xs sm:text-sm line-clamp-2">
                            {product.name}
                          </h3>
                        </div>

                        <div className="flex items-center space-x-1">
                          {renderStars(product.rating)}
                          <span className="text-xs text-gray-600">
                            ({product.totalReviews.toLocaleString()})
                          </span>
                        </div>

                        <div className="flex items-baseline space-x-1 sm:space-x-2">
                          <span className="font-bold text-gray-900 text-sm sm:text-base">
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs sm:text-sm text-gray-500 line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                          {product.discount && (
                            <Badge
                              variant="danger"
                              size="sm"
                              className="text-xs"
                            >
                              -{product.discount}%
                            </Badge>
                          )}
                        </div>

                        <div className="flex space-x-1.5 sm:space-x-2 pt-1 sm:pt-2">
                          <Button
                            onClick={() => handleViewProduct(product.id)}
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs py-1.5"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">View</span>
                            <span className="sm:hidden">View</span>
                          </Button>
                          <Button
                            onClick={() => handleAddToCart(product)}
                            size="sm"
                            className="flex-1 text-xs py-1.5"
                            disabled={!product.inStock}
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">
                              {product.inStock ? "Add" : "Notify"}
                            </span>
                            <span className="sm:hidden">
                              {product.inStock ? "Add" : "Notify"}
                            </span>
                          </Button>
                          <Button
                            onClick={() => handleShare("product", product)}
                            size="sm"
                            variant="outline"
                            className="p-1.5"
                            title="Share product"
                          >
                            <Share2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Products Pagination */}
                {filteredProducts.length > productsPerPage && (
                  <div className="mt-4 sm:mt-6">
                    <Pagination
                      currentPage={productsPage}
                      totalPages={totalProductPages}
                      onPageChange={setProductsPage}
                      itemsPerPage={productsPerPage}
                      totalItems={filteredProducts.length}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;
