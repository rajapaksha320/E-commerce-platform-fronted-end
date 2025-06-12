/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Filter,
  ChevronDown,
  User,
  ShoppingBag,
  Headphones,
  Package,
  Award,
  Calendar,
} from "lucide-react";
import { Button, Badge, ContactCard as Card } from "../../ui/ContactUis/Uis";
import Pagination from "../../ui/ContactUis/Pagination";

const ReviewsSection = ({ shopId, className = "" }) => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  // Mock data - in real app, this would come from props or API
  const shopRatings = {
    overall: 4.6,
    totalReviews: 1247,
    categories: [
      {
        id: "shopping",
        name: "Shopping Experience",
        icon: ShoppingBag,
        rating: 4.7,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      {
        id: "customer_service",
        name: "Customer Service",
        icon: Headphones,
        rating: 4.5,
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
      {
        id: "product_quality",
        name: "Product Quality",
        icon: Package,
        rating: 4.8,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
      },
      {
        id: "delivery",
        name: "Delivery Speed",
        icon: Award,
        rating: 4.4,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
      },
    ],
    distribution: [
      { stars: 5, count: 672, percentage: 54 },
      { stars: 4, count: 374, percentage: 30 },
      { stars: 3, count: 125, percentage: 10 },
      { stars: 2, count: 50, percentage: 4 },
      { stars: 1, count: 26, percentage: 2 },
    ],
  };

  // Extended mock reviews data for pagination demonstration
  const allReviews = [
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b332c133?w=40&h=40&fit=crop&crop=face",
        verified: true,
      },
      rating: 5,
      date: "2024-01-15",
      purchase: "Wireless Bluetooth Headphones",
      review:
        "Excellent product quality and fast shipping! The headphones arrived well-packaged and work perfectly. Customer service was very responsive when I had questions about the warranty.",
      helpful: 23,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
      ],
      categories: {
        shopping: 5,
        customer_service: 5,
        product_quality: 5,
        delivery: 4,
      },
    },
    {
      id: 2,
      user: {
        name: "Mike Chen",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        verified: true,
      },
      rating: 4,
      date: "2024-01-12",
      purchase: "Smart Fitness Watch",
      review:
        "Good product overall, but delivery took longer than expected. The watch itself is great quality and exactly as described. Would definitely shop here again.",
      helpful: 15,
      categories: {
        shopping: 4,
        customer_service: 4,
        product_quality: 5,
        delivery: 3,
      },
    },
    {
      id: 3,
      user: {
        name: "Emily Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        verified: false,
      },
      rating: 5,
      date: "2024-01-10",
      purchase: "Premium Coffee Maker",
      review:
        "Amazing shopping experience! The coffee maker is exactly what I was looking for. Great communication from the seller and super fast shipping. Highly recommended!",
      helpful: 31,
      categories: {
        shopping: 5,
        customer_service: 5,
        product_quality: 5,
        delivery: 5,
      },
    },
    {
      id: 4,
      user: {
        name: "David Kim",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        verified: true,
      },
      rating: 5,
      date: "2024-01-08",
      purchase: "Gaming Mechanical Keyboard",
      review:
        "Outstanding keyboard! The build quality is exceptional and the RGB lighting is beautiful. Fast shipping and excellent packaging. This shop has become my go-to for tech products.",
      helpful: 28,
      categories: {
        shopping: 5,
        customer_service: 5,
        product_quality: 5,
        delivery: 5,
      },
    },
    {
      id: 5,
      user: {
        name: "Lisa Thompson",
        avatar:
          "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=40&h=40&fit=crop&crop=face",
        verified: true,
      },
      rating: 4,
      date: "2024-01-05",
      purchase: "Portable Bluetooth Speaker",
      review:
        "Great sound quality for the price! The bass is impressive and it's very portable. Only complaint is that the battery life could be a bit longer, but overall very satisfied with my purchase.",
      helpful: 19,
      images: [
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop",
      ],
      categories: {
        shopping: 4,
        customer_service: 4,
        product_quality: 4,
        delivery: 4,
      },
    },
    {
      id: 6,
      user: {
        name: "Robert Wilson",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
        verified: false,
      },
      rating: 3,
      date: "2024-01-03",
      purchase: "Wireless Charging Pad",
      review:
        "The product works as expected but shipping was slower than advertised. Customer service was helpful when I inquired about the delay. The charging pad itself is decent quality.",
      helpful: 8,
      categories: {
        shopping: 3,
        customer_service: 4,
        product_quality: 4,
        delivery: 2,
      },
    },
    {
      id: 7,
      user: {
        name: "Jennifer Lee",
        avatar:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face",
        verified: true,
      },
      rating: 5,
      date: "2024-01-01",
      purchase: "Smart Home Camera",
      review:
        "Incredible product! The video quality is crystal clear and the setup was straightforward. The mobile app works flawlessly. Excellent customer support and lightning-fast delivery.",
      helpful: 35,
      images: [
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=100&h=100&fit=crop",
      ],
      categories: {
        shopping: 5,
        customer_service: 5,
        product_quality: 5,
        delivery: 5,
      },
    },
    {
      id: 8,
      user: {
        name: "Alex Parker",
        avatar:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&crop=face",
        verified: true,
      },
      rating: 4,
      date: "2023-12-28",
      purchase: "USB-C Fast Charger",
      review:
        "Fast charging works great and the cable quality is good. Delivery was prompt and packaging was secure. Would recommend this shop to others looking for reliable tech accessories.",
      helpful: 12,
      categories: {
        shopping: 4,
        customer_service: 4,
        product_quality: 4,
        delivery: 5,
      },
    },
    {
      id: 9,
      user: {
        name: "Maria Garcia",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face",
        verified: false,
      },
      rating: 5,
      date: "2023-12-25",
      purchase: "Ergonomic Wireless Mouse",
      review:
        "Perfect for long work sessions! The ergonomic design really helps reduce hand strain. The wireless connection is stable and responsive. Great value for money and excellent service.",
      helpful: 22,
      categories: {
        shopping: 5,
        customer_service: 4,
        product_quality: 5,
        delivery: 4,
      },
    },
    {
      id: 10,
      user: {
        name: "John Davis",
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face",
        verified: true,
      },
      rating: 4,
      date: "2023-12-22",
      purchase: "Portable SSD Drive",
      review:
        "Great storage solution! Fast transfer speeds and compact design. The only minor issue was that the included cable was shorter than expected. Overall very satisfied with the purchase.",
      helpful: 16,
      categories: {
        shopping: 4,
        customer_service: 4,
        product_quality: 5,
        delivery: 4,
      },
    },
    {
      id: 11,
      user: {
        name: "Amanda Brown",
        avatar:
          "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=40&h=40&fit=crop&crop=face",
        verified: true,
      },
      rating: 2,
      date: "2023-12-20",
      purchase: "Smartphone Stand",
      review:
        "The stand is functional but feels a bit flimsy. It does the job but I expected better build quality for the price. Customer service was responsive when I raised concerns.",
      helpful: 5,
      categories: {
        shopping: 3,
        customer_service: 4,
        product_quality: 2,
        delivery: 3,
      },
    },
    {
      id: 12,
      user: {
        name: "Chris Martinez",
        avatar:
          "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face",
        verified: true,
      },
      rating: 5,
      date: "2023-12-18",
      purchase: "Bluetooth Tracking Device",
      review:
        "Works perfectly! Easy to set up and the tracking accuracy is excellent. The battery life is impressive and the app is user-friendly. Fast delivery and great customer service.",
      helpful: 29,
      categories: {
        shopping: 5,
        customer_service: 5,
        product_quality: 5,
        delivery: 5,
      },
    },
  ];

  const filterOptions = [
    { id: "all", name: "All Reviews", count: shopRatings.totalReviews },
    { id: "5", name: "5 Stars", count: shopRatings.distribution[0].count },
    { id: "4", name: "4 Stars", count: shopRatings.distribution[1].count },
    { id: "3", name: "3 Stars", count: shopRatings.distribution[2].count },
    { id: "2", name: "2 Stars", count: shopRatings.distribution[3].count },
    { id: "1", name: "1 Star", count: shopRatings.distribution[4].count },
    { id: "verified", name: "Verified Purchases", count: 892 },
    { id: "with_images", name: "With Images", count: 156 },
  ];

  const sortOptions = [
    { id: "newest", name: "Newest First" },
    { id: "oldest", name: "Oldest First" },
    { id: "highest", name: "Highest Rating" },
    { id: "lowest", name: "Lowest Rating" },
    { id: "helpful", name: "Most Helpful" },
  ];

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = [...allReviews];

    // Apply filters
    if (selectedFilter !== "all") {
      if (selectedFilter === "verified") {
        filtered = filtered.filter((review) => review.user.verified);
      } else if (selectedFilter === "with_images") {
        filtered = filtered.filter(
          (review) => review.images && review.images.length > 0
        );
      } else {
        // Filter by rating
        const rating = parseInt(selectedFilter);
        filtered = filtered.filter((review) => review.rating === rating);
      }
    }

    // Apply sorting
    switch (sortBy) {
      case "oldest":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "highest":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case "helpful":
        filtered.sort((a, b) => b.helpful - a.helpful);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
    }

    return filtered;
  }, [selectedFilter, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredAndSortedReviews.length / reviewsPerPage
  );
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = filteredAndSortedReviews.slice(
    startIndex,
    startIndex + reviewsPerPage
  );

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, sortBy]);

  // Handle page navigation with smooth scroll
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to reviews section smoothly
    const reviewsSection = document.querySelector(".reviews-list-section");
    if (reviewsSection) {
      reviewsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const renderStars = (rating, size = "sm") => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    };

    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${sizeClasses[size]} ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Rating Summary */}
      <Card shadow="lg" className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Overall Rating */}
          <div className="text-center">
            <div className="mb-4">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {shopRatings.overall}
              </div>
              <div className="flex items-center justify-center mb-2">
                {renderStars(shopRatings.overall, "lg")}
              </div>
              <p className="text-gray-600">
                Based on {shopRatings.totalReviews.toLocaleString()} reviews
              </p>
            </div>
          </div>

          {/* Right Side - Rating Distribution */}
          <div className="space-y-2">
            {shopRatings.distribution.map((item) => (
              <div key={item.stars} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 w-8">
                  {item.stars}★
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Category Ratings */}
      <Card shadow="lg" className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Rating Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {shopRatings.categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div key={category.id} className="text-center">
                <div
                  className={`p-3 rounded-full ${category.bgColor} w-fit mx-auto mb-2`}
                >
                  <IconComponent className={`h-6 w-6 ${category.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {category.rating}
                </div>
                <div className="flex items-center justify-center mb-1">
                  {renderStars(category.rating)}
                </div>
                <p className="text-sm text-gray-600">{category.name}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Filters and Sort */}
      <Card shadow="lg" className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filter Reviews</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </Button>

            {selectedFilter !== "all" && (
              <Badge variant="primary" size="sm">
                {filterOptions.find((f) => f.id === selectedFilter)?.name}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-
              {Math.min(
                startIndex + reviewsPerPage,
                filteredAndSortedReviews.length
              )}{" "}
              of {filteredAndSortedReviews.length} reviews
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedFilter === filter.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.name} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Reviews List */}
      <div className="reviews-list-section space-y-4">
        {currentReviews.length > 0 ? (
          <>
            {currentReviews.map((review) => (
              <Card key={review.id} shadow="lg" className="p-6">
                <div className="flex items-start space-x-4">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={review.user.avatar}
                      alt={review.user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    {/* User Info and Rating */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <div className="flex items-center space-x-2 mb-2 md:mb-0">
                        <h4 className="font-semibold text-gray-900">
                          {review.user.name}
                        </h4>
                        {review.user.verified && (
                          <Badge variant="success" size="sm">
                            <User className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>

                    {/* Purchase Info */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(review.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4" />
                        <span>Purchased: {review.purchase}</span>
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {review.review}
                    </p>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex space-x-2 mb-4">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review image ${index + 1}`}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
                          />
                        ))}
                      </div>
                    )}

                    {/* Category Ratings */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      {Object.entries(review.categories).map(
                        ([key, rating]) => {
                          const category = shopRatings.categories.find(
                            (c) => c.id === key
                          );
                          if (!category) return null;

                          return (
                            <div key={key} className="text-center">
                              <div className="text-sm font-medium text-gray-700 mb-1">
                                {category.name.split(" ")[0]}
                              </div>
                              <div className="flex items-center justify-center">
                                {renderStars(rating, "sm")}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>

                    {/* Review Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors">
                          <ThumbsUp className="h-4 w-4" />
                          <span className="text-sm">
                            Helpful ({review.helpful})
                          </span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors">
                          <ThumbsDown className="h-4 w-4" />
                          <span className="text-sm">Not Helpful</span>
                        </button>
                      </div>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center pt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={reviewsPerPage}
                  totalItems={filteredAndSortedReviews.length}
                />
              </div>
            )}
          </>
        ) : (
          <Card className="text-center p-12" shadow="lg">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Reviews Found
            </h3>
            <p className="text-gray-500 mb-6">
              No reviews match your current filter criteria.
            </p>
            <Button onClick={() => setSelectedFilter("all")} variant="outline">
              Show All Reviews
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
