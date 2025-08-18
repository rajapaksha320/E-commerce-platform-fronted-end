/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect, useCallback } from "react";
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
  Loader,
  AlertCircle,
} from "lucide-react";
import { Button, Badge, ContactCard as Card } from "../../ui/ContactUis/Uis";
import Pagination from "../../ui/ContactUis/Pagination";
import useUser from "../../../hooks/useUser";

const ReviewsSection = ({ shopId, className = "" }) => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  // Redux hooks
  const {
    shopReviews,
    reviewsLoading,
    reviewsError,
    reviewsPagination,
    fetchShopReviews,
  } = useUser();

  useEffect(() => {
    if (shopId) {
      fetchShopReviews(shopId, currentPage, reviewsPerPage);
    }
  }, [shopId, currentPage, reviewsPerPage, fetchShopReviews]);

  const getAverageRating = useCallback((review) => {
    const ratings = [
      review.shoppingExperience,
      review.customerService,
      review.productQuality,
      review.deliverySpeed,
    ].filter((rating) => rating > 0);

    if (ratings.length === 0) return 0;
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  }, []);

  const reviewCounts = useMemo(() => {
    if (!shopReviews || !Array.isArray(shopReviews)) {
      return { total: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    }

    const counts = { total: shopReviews.length, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    shopReviews.forEach((review) => {

      const ratings = [
        review.shoppingExperience,
        review.customerService,
        review.productQuality,
        review.deliverySpeed,
      ].filter((rating) => rating > 0);

      if (ratings.length > 0) {
        const avgRating =
          ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
        const roundedRating = Math.round(avgRating);

        if (roundedRating >= 1 && roundedRating <= 5) {
          counts[roundedRating]++;
        }
      }
    });

    return counts;
  }, [shopReviews]);

  const shopRatings = useMemo(() => {
    const totalReviews = reviewCounts.total;

    const categoryTotals = {
      shoppingExperience: { sum: 0, count: 0 },
      customerService: { sum: 0, count: 0 },
      productQuality: { sum: 0, count: 0 },
      deliverySpeed: { sum: 0, count: 0 },
    };

    let totalRatingSum = 0;
    let totalRatingCount = 0;

    if (shopReviews && Array.isArray(shopReviews)) {
      shopReviews.forEach((review) => {
        // Calculate category totals
        if (review.shoppingExperience > 0) {
          categoryTotals.shoppingExperience.sum += review.shoppingExperience;
          categoryTotals.shoppingExperience.count++;
        }
        if (review.customerService > 0) {
          categoryTotals.customerService.sum += review.customerService;
          categoryTotals.customerService.count++;
        }
        if (review.productQuality > 0) {
          categoryTotals.productQuality.sum += review.productQuality;
          categoryTotals.productQuality.count++;
        }
        if (review.deliverySpeed > 0) {
          categoryTotals.deliverySpeed.sum += review.deliverySpeed;
          categoryTotals.deliverySpeed.count++;
        }

        // Calculate overall average
        const ratings = [
          review.shoppingExperience,
          review.customerService,
          review.productQuality,
          review.deliverySpeed,
        ].filter((rating) => rating > 0);

        if (ratings.length > 0) {
          const avgRating =
            ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
          totalRatingSum += avgRating;
          totalRatingCount++;
        }
      });
    }

    const overallRating =
      totalRatingCount > 0 ? totalRatingSum / totalRatingCount : 0;

    // Calculate category averages from actual data
    const shoppingAvg =
      categoryTotals.shoppingExperience.count > 0
        ? categoryTotals.shoppingExperience.sum /
          categoryTotals.shoppingExperience.count
        : 0;
    const serviceAvg =
      categoryTotals.customerService.count > 0
        ? categoryTotals.customerService.sum /
          categoryTotals.customerService.count
        : 0;
    const qualityAvg =
      categoryTotals.productQuality.count > 0
        ? categoryTotals.productQuality.sum /
          categoryTotals.productQuality.count
        : 0;
    const deliveryAvg =
      categoryTotals.deliverySpeed.count > 0
        ? categoryTotals.deliverySpeed.sum / categoryTotals.deliverySpeed.count
        : 0;

    return {
      overall: parseFloat(overallRating.toFixed(1)),
      totalReviews: totalReviews,
      categories: [
        {
          id: "shopping",
          name: "Shopping Experience",
          icon: ShoppingBag,
          rating: parseFloat(shoppingAvg.toFixed(1)),
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          id: "customer_service",
          name: "Customer Service",
          icon: Headphones,
          rating: parseFloat(serviceAvg.toFixed(1)),
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          id: "product_quality",
          name: "Product Quality",
          icon: Package,
          rating: parseFloat(qualityAvg.toFixed(1)),
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
        {
          id: "delivery",
          name: "Delivery Speed",
          icon: Award,
          rating: parseFloat(deliveryAvg.toFixed(1)),
          color: "text-orange-600",
          bgColor: "bg-orange-100",
        },
      ],
      distribution: [
        {
          stars: 5,
          count: reviewCounts[5],
          percentage:
            totalReviews > 0
              ? Math.round((reviewCounts[5] / totalReviews) * 100)
              : 0,
        },
        {
          stars: 4,
          count: reviewCounts[4],
          percentage:
            totalReviews > 0
              ? Math.round((reviewCounts[4] / totalReviews) * 100)
              : 0,
        },
        {
          stars: 3,
          count: reviewCounts[3],
          percentage:
            totalReviews > 0
              ? Math.round((reviewCounts[3] / totalReviews) * 100)
              : 0,
        },
        {
          stars: 2,
          count: reviewCounts[2],
          percentage:
            totalReviews > 0
              ? Math.round((reviewCounts[2] / totalReviews) * 100)
              : 0,
        },
        {
          stars: 1,
          count: reviewCounts[1],
          percentage:
            totalReviews > 0
              ? Math.round((reviewCounts[1] / totalReviews) * 100)
              : 0,
        },
      ],
    };
  }, [reviewCounts, shopReviews]);

  const filterOptions = useMemo(
    () => [
      { id: "all", name: "All Reviews", count: reviewCounts.total },
      { id: "5", name: "5 Stars", count: reviewCounts[5] },
      { id: "4", name: "4 Stars", count: reviewCounts[4] },
      { id: "3", name: "3 Stars", count: reviewCounts[3] },
      { id: "2", name: "2 Stars", count: reviewCounts[2] },
      { id: "1", name: "1 Star", count: reviewCounts[1] },
    ],
    [reviewCounts]
  );

  const sortOptions = [
    { id: "newest", name: "Newest First" },
    { id: "oldest", name: "Oldest First" },
    { id: "highest", name: "Highest Rating" },
    { id: "lowest", name: "Lowest Rating" },
    { id: "helpful", name: "Most Helpful" },
  ];

  // Filter and sort reviews 
  const filteredAndSortedReviews = useMemo(() => {
    if (!shopReviews) return [];

    let filtered = [...shopReviews];

    // Apply filters
    if (selectedFilter !== "all") {
      if (selectedFilter === "verified") {
        // Filter verified purchases if we have this data
        filtered = filtered.filter((review) => true);
      } else if (selectedFilter === "with_images") {
        // Filter reviews with images if we have this data
        filtered = filtered.filter((review) => false); 
      } else {
        // Filter by rating
        const rating = parseInt(selectedFilter);
        filtered = filtered.filter((review) => {
          const avgRating = getAverageRating(review);
          return Math.round(avgRating) === rating;
        });
      }
    }

    // Apply sorting
    switch (sortBy) {
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "highest":
        filtered.sort((a, b) => {
          const avgA = getAverageRating(a);
          const avgB = getAverageRating(b);
          return avgB - avgA;
        });
        break;
      case "lowest":
        filtered.sort((a, b) => {
          const avgA = getAverageRating(a);
          const avgB = getAverageRating(b);
          return avgA - avgB;
        });
        break;
      case "helpful":
        
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filtered;
  }, [shopReviews, selectedFilter, sortBy, getAverageRating]);

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
  useEffect(() => {
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

    const numRating = parseFloat(rating || 0);

    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${sizeClasses[size]} ${
          i < Math.floor(numRating)
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

  const getUserInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    console.log("ReviewsSection Debug:", {
      shopReviews: shopReviews?.length || 0,
      reviewCounts: reviewCounts,
      filterOptions: filterOptions,
      shopRatings: shopRatings,
      categoryBreakdown: shopRatings.categories.map((cat) => ({
        name: cat.name,
        rating: cat.rating,
        source: "calculated from backend data",
      })),
    });
  }, [shopReviews, reviewCounts, filterOptions, shopRatings]);

  // Loading state
  if (reviewsLoading && !shopReviews) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <Loader className="h-8 w-8 animate-spin text-blue-600 mr-3" />
        <span className="text-gray-600">Loading reviews...</span>
      </div>
    );
  }

  // Error state
  if (reviewsError) {
    return (
      <div className={`${className}`}>
        <Card className="text-center p-8" shadow="lg">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Error Loading Reviews
          </h3>
          <p className="text-gray-500 mb-4">{reviewsError}</p>
          <Button
            onClick={() =>
              fetchShopReviews(shopId, currentPage, reviewsPerPage)
            }
            variant="outline"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

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
                Based on {shopRatings.totalReviews} reviews
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
            {currentReviews.map((review) => {
              const averageRating = getAverageRating(review);

              return (
                <Card key={review._id} shadow="lg" className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {getUserInitials(
                          review.buyerId?.firstName && review.buyerId?.lastName
                            ? `${review.buyerId.firstName} ${review.buyerId.lastName}`
                            : "Anonymous User"
                        )}
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="flex-1">
                      {/* User Info and Rating */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                        <div className="flex items-center space-x-2 mb-2 md:mb-0">
                          <h4 className="font-semibold text-gray-900">
                            {review.buyerId?.firstName &&
                            review.buyerId?.lastName
                              ? `${review.buyerId.firstName} ${review.buyerId.lastName}`
                              : "Anonymous User"}
                          </h4>
                          <Badge variant="success" size="sm">
                            <User className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {renderStars(averageRating)}
                          </div>
                          <span className="text-sm text-gray-600">
                            {averageRating.toFixed(1)}/5
                          </span>
                        </div>
                      </div>

                      {/* Purchase Info */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(review.createdAt)}</span>
                        </div>
                        {review.listingId && (
                          <div className="flex items-center space-x-1">
                            <Package className="h-4 w-4" />
                            <span>Product Review</span>
                          </div>
                        )}
                      </div>

                      {/* Review Text */}
                      {review.review && (
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {review.review}
                        </p>
                      )}

                      {/* Category Ratings */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                        {[
                          {
                            key: "shoppingExperience",
                            label: "Shopping",
                            rating: review.shoppingExperience,
                          },
                          {
                            key: "customerService",
                            label: "Service",
                            rating: review.customerService,
                          },
                          {
                            key: "productQuality",
                            label: "Quality",
                            rating: review.productQuality,
                          },
                          {
                            key: "deliverySpeed",
                            label: "Delivery",
                            rating: review.deliverySpeed,
                          },
                        ].map(
                          ({ key, label, rating }) =>
                            rating > 0 && (
                              <div key={key} className="text-center">
                                <div className="text-sm font-medium text-gray-700 mb-1">
                                  {label}
                                </div>
                                <div className="flex items-center justify-center">
                                  {renderStars(rating, "sm")}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {rating}/5
                                </div>
                              </div>
                            )
                        )}
                      </div>

                      
                    </div>
                  </div>
                </Card>
              );
            })}

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
              {selectedFilter !== "all" ? "No Reviews Found" : "No Reviews Yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {selectedFilter !== "all"
                ? "No reviews match your current filter criteria."
                : "This shop hasn't received any reviews yet. Be the first to review!"}
            </p>
            {selectedFilter !== "all" && (
              <Button
                onClick={() => setSelectedFilter("all")}
                variant="outline"
              >
                Show All Reviews
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
