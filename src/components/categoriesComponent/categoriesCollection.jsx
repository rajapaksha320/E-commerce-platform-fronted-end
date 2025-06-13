import React, { useState, useMemo, useEffect } from "react";
import {
  Grid,
  List,
  Heart,
  Eye,
  TrendingUp,
  ArrowRight,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, Badge, ContactCard as Card } from "../ui/ContactUis/Uis";
import { Input, Select, SearchInput } from "../ui/InputUis/Uis";
import Pagination from "../ui/ContactUis/Pagination";

const CategoriesCollection = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showAllTypes, setShowAllTypes] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [likedCategories, setLikedCategories] = useState(new Set());
  const navigate = useNavigate();

  const itemsPerPage = 6;
  const maxVisibleTypes = 6;

  const categoryTypes = [
    { id: "all", name: "All Types", count: 24 },
    { id: "trending", name: "Trending", count: 8 },
    { id: "popular", name: "Most Popular", count: 6 },
    { id: "new", name: "New Arrivals", count: 5 },
    { id: "featured", name: "Featured", count: 4 },
    { id: "seasonal", name: "Seasonal", count: 3 },
    { id: "premium", name: "Premium", count: 2 },
  ];

  const categories = [
    {
      id: 1,
      name: "Electronics & Technology",
      slug: "electronics",
      type: "trending",
      image:
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop",
      description:
        "Latest gadgets, smartphones, laptops, and cutting-edge technology products.",
      products: 1245,
      shops: 89,
      rating: 4.8,
      growth: "+15%",
      badge: "Hot",
      discount: "Up to 40% off",
    },
    {
      id: 2,
      name: "Fashion & Apparel",
      slug: "fashion",
      type: "popular",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
      description:
        "Trendy clothing, accessories, shoes, and fashion items for all styles.",
      products: 2156,
      shops: 156,
      rating: 4.9,
      growth: "+22%",
      badge: "Trending",
      discount: "25% off new arrivals",
    },
    {
      id: 3,
      name: "Home & Garden",
      slug: "home",
      type: "featured",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description:
        "Furniture, decor, gardening supplies, and everything for your home.",
      products: 892,
      shops: 67,
      rating: 4.7,
      growth: "+8%",
      badge: "Featured",
      discount: "Free shipping",
    },
    {
      id: 4,
      name: "Health & Beauty",
      slug: "beauty",
      type: "trending",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
      description:
        "Skincare, makeup, wellness products, and health supplements.",
      products: 756,
      shops: 94,
      rating: 4.6,
      growth: "+18%",
      badge: "Popular",
      discount: "Buy 2 Get 1 Free",
    },
    {
      id: 5,
      name: "Sports & Fitness",
      slug: "sports",
      type: "popular",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      description: "Athletic equipment, workout gear, and sports accessories.",
      products: 634,
      shops: 45,
      rating: 4.8,
      growth: "+12%",
      badge: "Athletic",
      discount: "20% off sports gear",
    },
    {
      id: 6,
      name: "Food & Beverages",
      slug: "food",
      type: "new",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      description:
        "Gourmet foods, organic products, beverages, and culinary delights.",
      products: 445,
      shops: 78,
      rating: 4.5,
      growth: "+25%",
      badge: "Organic",
      discount: "15% off first order",
    },
    {
      id: 7,
      name: "Books & Media",
      slug: "books",
      type: "featured",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      description: "Books, audiobooks, movies, music, and educational content.",
      products: 567,
      shops: 34,
      rating: 4.7,
      growth: "+6%",
      badge: "Educational",
      discount: "30% off bestsellers",
    },
    {
      id: 8,
      name: "Automotive",
      slug: "automotive",
      type: "premium",
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop",
      description:
        "Car parts, accessories, tools, and automotive maintenance products.",
      products: 389,
      shops: 28,
      rating: 4.6,
      growth: "+9%",
      badge: "Professional",
      discount: "10% off parts",
    },
    {
      id: 9,
      name: "Toys & Games",
      slug: "toys",
      type: "seasonal",
      image:
        "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop",
      description:
        "Educational toys, board games, video games, and entertainment.",
      products: 723,
      shops: 52,
      rating: 4.8,
      growth: "+30%",
      badge: "Family",
      discount: "Buy 3 Get 1 Free",
    },
  ];

  // Filter categories based on search term and type
  const filteredCategories = useMemo(() => {
    let filtered = categories;

    // Filter by type first
    if (selectedType !== "all") {
      filtered = filtered.filter((category) => category.type === selectedType);
    }

    // Then filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          category.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [searchTerm, selectedType]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  // Reset to first page when search or type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType]);

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
    // Navigate to product collection with category filter
    navigate(`/product-collections?category=${category.slug}`);
  };

  const handleQuickView = (category, e) => {
    e.stopPropagation();
    console.log("Quick view category:", category.id);
  };

  const handleCategoryClick = (category) => {
    // Navigate to product collection with category filter
    navigate(`/product-collections?category=${category.slug}`);
  };

  const typeOptions = categoryTypes.map((type) => ({
    value: type.id,
    label: `${type.name} (${type.count})`,
  }));

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

        {/* Category Type Filter */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Category Types
          </h3>

          {/* Mobile Dropdown */}
          <div className="block md:hidden mb-4">
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              options={typeOptions}
              placeholder="Select category type"
              size="md"
            />
          </div>

          {/* Desktop Type Buttons */}
          <div className="hidden md:block">
            <div className="flex flex-wrap gap-3 mb-4">
              {categoryTypes
                .slice(0, showAllTypes ? categoryTypes.length : maxVisibleTypes)
                .map((type) => (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type.id)}
                    className="flex items-center gap-2 touch-manipulation"
                  >
                    <span>{type.name}</span>
                    <Badge variant="default" size="sm">
                      {type.count}
                    </Badge>
                  </Button>
                ))}
            </div>

            {/* Show More/Less Button */}
            {categoryTypes.length > maxVisibleTypes && (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllTypes(!showAllTypes)}
                  className="flex items-center gap-2 touch-manipulation"
                >
                  {showAllTypes ? (
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
                        Show More Types (
                        {categoryTypes.length - maxVisibleTypes} more)
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
            {selectedType !== "all" && (
              <span className="ml-2 text-blue-600 font-medium">
                in{" "}
                {categoryTypes.find((type) => type.id === selectedType)?.name}
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
        {filteredCategories.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Package className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No categories found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm && selectedType !== "all"
                ? `No categories found for "${searchTerm}" in ${
                    categoryTypes.find((type) => type.id === selectedType)?.name
                  }`
                : searchTerm
                ? `No categories found for "${searchTerm}"`
                : selectedType !== "all"
                ? `No categories found in ${
                    categoryTypes.find((type) => type.id === selectedType)?.name
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
              {selectedType !== "all" && (
                <Button
                  variant="outline"
                  onClick={() => setSelectedType("all")}
                  className="touch-manipulation"
                >
                  View All Types
                </Button>
              )}
              {(searchTerm || selectedType !== "all") && (
                <Button
                  variant="primary"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedType("all");
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
        {filteredCategories.length > 0 && (
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
                      <svg
                        className="h-4 w-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
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
        {filteredCategories.length > 0 && totalPages > 1 && (
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
