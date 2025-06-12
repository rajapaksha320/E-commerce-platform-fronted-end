import React, { useState, useMemo, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Card, Button, Badge } from "../ui";

const ShopCollection = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const maxVisibleCategories = 6;

  const categories = [
    { id: "all", name: "All Shops", count: 150 },
    { id: "electronics", name: "Electronics", count: 45 },
    { id: "fashion", name: "Fashion", count: 38 },
    { id: "home", name: "Home & Garden", count: 25 },
    { id: "food", name: "Food & Beverage", count: 22 },
    { id: "sports", name: "Sports", count: 20 },
    { id: "beauty", name: "Beauty & Health", count: 18 },
    { id: "books", name: "Books & Media", count: 15 },
    { id: "automotive", name: "Automotive", count: 12 },
    { id: "jewelry", name: "Jewelry & Watches", count: 10 },
    { id: "toys", name: "Toys & Games", count: 8 },
    { id: "pets", name: "Pet Supplies", count: 6 },
  ];

  const shops = [
    {
      id: 1,
      name: "TechHub Electronics",
      category: "electronics",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 1250,
      location: "New York, NY",
      openTime: "9:00 AM - 9:00 PM",
      description:
        "Premium electronics and gadgets with latest technology innovations.",
      products: 156,
      badge: "Verified",
      discount: "Up to 30% off",
    },
    {
      id: 2,
      name: "Fashion Forward",
      category: "fashion",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 890,
      location: "Los Angeles, CA",
      openTime: "10:00 AM - 8:00 PM",
      description: "Trendy clothing and accessories for modern lifestyle.",
      products: 324,
      badge: "Premium",
      discount: "25% off new arrivals",
    },
    {
      id: 3,
      name: "Home Comfort Store",
      category: "home",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 567,
      location: "Chicago, IL",
      openTime: "8:00 AM - 10:00 PM",
      description: "Everything you need to make your house a beautiful home.",
      products: 89,
      badge: "Featured",
      discount: "Free shipping",
    },
    {
      id: 4,
      name: "Gourmet Delights",
      category: "food",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      rating: 4.6,
      reviews: 445,
      location: "San Francisco, CA",
      openTime: "7:00 AM - 11:00 PM",
      description: "Artisanal foods and beverages from around the world.",
      products: 67,
      badge: "Organic",
      discount: "Buy 2 Get 1 Free",
    },
    {
      id: 5,
      name: "SportZone Pro",
      category: "sports",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 733,
      location: "Miami, FL",
      openTime: "6:00 AM - 10:00 PM",
      description: "Professional sports equipment and fitness gear.",
      products: 234,
      badge: "Athletic",
      discount: "20% off sports gear",
    },
    {
      id: 6,
      name: "Urban Style Studio",
      category: "fashion",
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop",
      rating: 4.5,
      reviews: 312,
      location: "Austin, TX",
      openTime: "11:00 AM - 7:00 PM",
      description: "Contemporary fashion with urban street style influence.",
      products: 128,
      badge: "Trending",
      discount: "40% off clearance",
    },
    {
      id: 7,
      name: "Digital World",
      category: "electronics",
      image:
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 892,
      location: "Seattle, WA",
      openTime: "9:00 AM - 8:00 PM",
      description: "Cutting-edge technology and smart home solutions.",
      products: 278,
      badge: "Featured",
      discount: "15% off smart devices",
    },
    {
      id: 8,
      name: "Fitness Central",
      category: "sports",
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
      rating: 4.6,
      reviews: 654,
      location: "Denver, CO",
      openTime: "5:00 AM - 11:00 PM",
      description: "Complete fitness solutions for all your workout needs.",
      products: 189,
      badge: "Athletic",
      discount: "30% off equipment",
    },
    {
      id: 9,
      name: "Garden Paradise",
      category: "home",
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
      rating: 4.4,
      reviews: 387,
      location: "Portland, OR",
      openTime: "7:00 AM - 7:00 PM",
      description:
        "Beautiful plants and gardening supplies for your outdoor space.",
      products: 156,
      badge: "Organic",
      discount: "Buy 3 Get 1 Free",
    },
  ];

  // Filter shops based on search term and category
  const filteredShops = useMemo(() => {
    let filtered = shops;

    // Filter by category first
    if (selectedCategory !== "all") {
      filtered = filtered.filter((shop) => shop.category === selectedCategory);
    }

    // Then filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (shop) =>
          shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [searchTerm, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredShops.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentShops = filteredShops.slice(startIndex, endIndex);

  // Reset to first page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const getBadgeVariant = (badge) => {
    const variants = {
      Verified: "success",
      Premium: "primary",
      Featured: "warning",
      Organic: "success",
      Athletic: "info",
      Trending: "danger",
    };
    return variants[badge] || "default";
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

  // Handle navigation to shop view
  const handleVisitShop = (shopId) => {
    navigate(`/shop/${shopId}`);
  };

  // Handle shop card click (navigate to shop)
  const handleShopCardClick = (shopId) => {
    navigate(`/shop/${shopId}`);
  };

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
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
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search shops by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm"
              />
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
                .map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
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
            Showing {startIndex + 1}-{Math.min(endIndex, filteredShops.length)}{" "}
            of {filteredShops.length} shops
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
        {filteredShops.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No shops found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm && selectedCategory !== "all"
                ? `No shops found for "${searchTerm}" in ${
                    categories.find((cat) => cat.id === selectedCategory)?.name
                  }`
                : searchTerm
                ? `No shops found for "${searchTerm}"`
                : selectedCategory !== "all"
                ? `No shops found in ${
                    categories.find((cat) => cat.id === selectedCategory)?.name
                  }`
                : "No shops found"}
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
                  onClick={() => setSelectedCategory("all")}
                >
                  View All Categories
                </Button>
              )}
              {(searchTerm || selectedCategory !== "all") && (
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                >
                  Reset All Filters
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Shops Grid */}
        {filteredShops.length > 0 && (
          <div
            className={`grid gap-6 mb-12 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {currentShops.map((shop) => (
              <Card
                key={shop.id}
                className={`group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  viewMode === "list" ? "flex flex-col md:flex-row" : ""
                }`}
                padding={false}
                onClick={() => handleShopCardClick(shop.id)}
              >
                {/* Shop Image */}
                <div
                  className={`relative overflow-hidden ${
                    viewMode === "list" ? "md:w-80 flex-shrink-0" : "h-48"
                  }`}
                >
                  <img
                    src={shop.image}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant={getBadgeVariant(shop.badge)}>
                      {shop.badge}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle favorite logic here
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                    <button
                      className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVisitShop(shop.id);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                  {shop.discount && (
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="danger">{shop.discount}</Badge>
                    </div>
                  )}
                </div>

                {/* Shop Info */}
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {shop.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{shop.rating}</span>
                      <span className="text-gray-500">({shop.reviews})</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {shop.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {shop.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      {shop.openTime}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {shop.products} products
                    </span>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVisitShop(shop.id);
                      }}
                    >
                      Visit Shop
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredShops.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="hidden sm:flex items-center gap-1">
                {generatePageNumbers().map((page, index) => (
                  <Fragment key={index}>
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
                  </Fragment>
                ))}
              </div>

              {/* Next Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopCollection;
