/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Eye,
  ArrowLeft,
  Grid,
  List,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  MapPin,
  Shield,
  Truck,
  RotateCcw,
  Search,
} from "lucide-react";

import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../ui/ContactUis/Uis";
import Pagination from "../../ui/ContactUis/Pagination";

const ShopProducts = () => {
  const navigate = useNavigate();
  const { shopId } = useParams();

  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("best_match");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Mock shop data
  const shopData = {
    id: shopId || "1",
    name: "TechHub Electronics",
    tagline: "Your Premier Destination for Latest Technology",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop",
    rating: 4.8,
    reviews: 1250,
    totalProducts: 156,
    location: "New York, NY",
    verified: true,
    badge: "Premium Seller",
    contact: {
      phone: "+1 (555) 123-4567",
      email: "support@techhub.com",
    },
    policies: [
      { icon: Truck, title: "Free Shipping", desc: "Orders over $50" },
      { icon: RotateCcw, title: "30-Day Returns", desc: "Easy returns" },
      { icon: Shield, title: "1-Year Warranty", desc: "On all products" },
    ],
  };

  // Mock products data
  const allProducts = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones Pro Max",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      price: 179.99,
      originalPrice: 249.99,
      rating: 4.8,
      reviews: 2340,
      badge: "Best Seller",
      discount: 28,
      isLiked: false,
      inStock: true,
      dateAdded: "2024-01-15",
    },
    {
      id: 2,
      name: "Smart Fitness Watch Series 5",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      price: 299.99,
      originalPrice: 399.99,
      rating: 4.7,
      reviews: 1890,
      badge: "New Arrival",
      discount: 25,
      isLiked: true,
      inStock: true,
      dateAdded: "2024-01-20",
    },
    {
      id: 3,
      name: "Premium Coffee Maker Deluxe",
      image:
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop",
      price: 149.99,
      originalPrice: 219.99,
      rating: 4.9,
      reviews: 567,
      badge: "Popular",
      discount: 32,
      isLiked: false,
      inStock: true,
      dateAdded: "2024-01-10",
    },
    {
      id: 4,
      name: "Designer Backpack Professional",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
      price: 89.99,
      originalPrice: 139.99,
      rating: 4.6,
      reviews: 890,
      badge: "Trending",
      discount: 36,
      isLiked: false,
      inStock: true,
      dateAdded: "2024-01-18",
    },
    {
      id: 5,
      name: "Professional Camera Lens 85mm",
      image:
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop",
      price: 449.99,
      originalPrice: 599.99,
      rating: 4.9,
      reviews: 1234,
      badge: "Premium",
      discount: 25,
      isLiked: true,
      inStock: true,
      dateAdded: "2024-01-05",
    },
    {
      id: 6,
      name: "Gaming Mechanical Keyboard RGB",
      image:
        "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop",
      price: 129.99,
      originalPrice: 179.99,
      rating: 4.8,
      reviews: 2156,
      badge: "Hot Deal",
      discount: 28,
      isLiked: false,
      inStock: true,
      dateAdded: "2024-01-12",
    },
    {
      id: 7,
      name: "Portable Bluetooth Speaker Pro",
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
      price: 89.99,
      originalPrice: 149.99,
      rating: 4.7,
      reviews: 845,
      badge: "Sale",
      discount: 40,
      isLiked: false,
      inStock: true,
      dateAdded: "2024-01-08",
    },
    {
      id: 8,
      name: "Wireless Charging Pad Fast Charge",
      image:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop",
      price: 49.99,
      originalPrice: 79.99,
      rating: 4.5,
      reviews: 567,
      badge: "Featured",
      discount: 38,
      isLiked: true,
      inStock: false,
      dateAdded: "2024-01-14",
    },
    {
      id: 9,
      name: "Smart Home Security Camera 4K",
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop",
      price: 199.99,
      originalPrice: 299.99,
      rating: 4.6,
      reviews: 723,
      badge: "New",
      discount: 33,
      isLiked: false,
      inStock: true,
      dateAdded: "2024-01-22",
    },
    {
      id: 10,
      name: "USB-C Fast Charging Cable 6ft",
      image:
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
      price: 24.99,
      originalPrice: 39.99,
      rating: 4.4,
      reviews: 1567,
      badge: "Essential",
      discount: 38,
      isLiked: false,
      inStock: true,
      dateAdded: "2024-01-11",
    },
    {
      id: 11,
      name: "Ergonomic Wireless Mouse",
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
      price: 59.99,
      originalPrice: 89.99,
      rating: 4.3,
      reviews: 892,
      badge: "Comfort",
      discount: 33,
      isLiked: true,
      inStock: true,
      dateAdded: "2024-01-16",
    },
    {
      id: 12,
      name: "Portable SSD External Drive 1TB",
      image:
        "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&h=300&fit=crop",
      price: 199.99,
      originalPrice: 279.99,
      rating: 4.8,
      reviews: 1123,
      badge: "Storage",
      discount: 29,
      isLiked: false,
      inStock: true,
      dateAdded: "2024-01-07",
    },
  ];

  const sortOptions = [
    { value: "best_match", label: "Best Match", icon: Target },
    { value: "newest", label: "Newest First", icon: Clock },
    { value: "price_low", label: "Price: Low to High", icon: DollarSign },
    { value: "price_high", label: "Price: High to Low", icon: DollarSign },
    { value: "most_orders", label: "Most Orders", icon: TrendingUp },
    { value: "highest_rated", label: "Highest Rated", icon: Star },
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    switch (sortBy) {
      case "newest":
        filtered = [...filtered].sort(
          (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
        );
        break;
      case "price_low":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "most_orders":
        filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);
        break;
      case "highest_rated":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  // Handle page navigation with smooth scroll
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to products section smoothly
    window.scrollTo({
      top: document.querySelector(".products-section")?.offsetTop - 100 || 0,
      behavior: "smooth",
    });
  };

  const getBadgeVariant = (badge) => {
    const variants = {
      "Best Seller": "success",
      "New Arrival": "primary",
      Popular: "warning",
      Trending: "info",
      Premium: "purple",
      "Hot Deal": "danger",
      Sale: "danger",
      Featured: "primary",
      New: "success",
      Essential: "warning",
      Comfort: "info",
      Storage: "purple",
    };
    return variants[badge] || "default";
  };

  const handleBack = () => {
    navigate(-1);
  };

  const renderProductCard = (product) => (
    <Card
      key={product.id}
      className={`group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full ${
        viewMode === "list" ? "flex flex-col sm:flex-row" : "flex flex-col"
      }`}
      padding={false}
    >
      {/* Product Image */}
      <div
        className={`relative overflow-hidden flex-shrink-0 ${
          viewMode === "list" ? "h-48 sm:h-64 sm:w-64" : "h-64"
        }`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "/placehold.png";
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3">
          <Badge variant={getBadgeVariant(product.badge)} size="sm">
            {product.badge}
          </Badge>
        </div>

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 right-3">
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discount}%
            </div>
          </div>
        )}

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="danger">Out of Stock</Badge>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-12 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              product.isLiked
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

      {/* Product Info - Consistent height structure */}
      <div className="p-4 flex flex-col flex-1">
        {/* Product Name - Fixed height container */}
        <div className="h-12 mb-3 flex items-start">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
            {product.name}
          </h3>
        </div>

        {/* Rating - Fixed height */}
        <div className="flex items-center gap-1 mb-3 h-5">
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

        {/* Spacer to push price and button to bottom */}
        <div className="flex-1"></div>

        {/* Price - Fixed position from bottom */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xl font-bold text-gray-900">
              LKR {product.price}
            </span>
            <br />
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ">
                LKR {product.originalPrice}
              </span>
            )}
          </div>
          {product.discount && (
            <Badge variant="success" size="sm">
              Save <span className="m-1">LKR</span>{" "}
              {(product.originalPrice - product.price).toFixed(2)}
            </Badge>
          )}
        </div>

        {/* Add to Cart Button - Always at bottom */}
        <Button
          className="w-full mt-auto"
          disabled={!product.inStock}
          variant={product.inStock ? "primary" : "outline"}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Shop Header */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="text-white border-white/20 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shops
            </Button>
          </div>

          {/* Shop Info */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={shopData.logo}
              alt={shopData.name}
              className="w-20 h-20 rounded-2xl border-4 border-white/20"
              onError={(e) => {
                e.target.src = "/placehold.png";
              }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  {shopData.name}
                </h1>
                {shopData.verified && (
                  <Badge variant="success" icon={<Shield size={12} />}>
                    Verified
                  </Badge>
                )}
                <Badge variant="purple">{shopData.badge}</Badge>
              </div>
              <p className="text-purple-200 text-lg mb-4">{shopData.tagline}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{shopData.rating} Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{shopData.reviews} Reviews</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{shopData.totalProducts} Products</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{shopData.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Policies */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          {shopData.policies.map((policy, index) => (
            <Card
              key={index}
              className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300"
              shadow="lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <policy.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {policy.title}
                  </h4>
                  <p className="text-sm text-gray-600">{policy.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Search and Controls */}
        <Card shadow="xl" className="mb-8">
          <div className="p-6 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products in this shop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Sort Dropdown */}
                <div className="flex-1 sm:flex-initial sm:min-w-[200px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
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

              {/* Results Count */}
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, filteredProducts.length)}{" "}
                of {filteredProducts.length} products
              </div>
            </div>
          </div>
        </Card>

        {/* Products Grid */}
        <div className="products-section">
          {currentProducts.length > 0 ? (
            <>
              <div
                className={`grid gap-6 mb-8 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {currentProducts.map(renderProductCard)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredProducts.length}
                  className="mt-8"
                />
              )}
            </>
          ) : (
            <Card className="text-center p-12" shadow="xl">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search query to find what you're looking for.
              </p>
              <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopProducts;
