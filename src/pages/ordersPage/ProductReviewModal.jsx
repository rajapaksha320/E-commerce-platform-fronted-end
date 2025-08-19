import React, { useState, useEffect } from "react";
import {
  X,
  Star,
  Package,
  Truck,
  MessageCircle,
  User,
  Calendar,
  Award,
  Send,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button, Badge } from "../../components/ui/ContactUis/Uis";

const ProductReviewModal = ({
  isOpen,
  onClose,
  product,
  order,
  onSubmitReview,
}) => {
  const [ratings, setRatings] = useState({
    shoppingExperience: 0,
    customerService: 0,
    productQuality: 0,
    deliverySpeed: 0,
  });

  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [hoveredRating, setHoveredRating] = useState({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setRatings({
        shoppingExperience: 0,
        customerService: 0,
        productQuality: 0,
        deliverySpeed: 0,
      });
      setReviewText("");
      setErrors({});
      setIsSubmitting(false);
      setHoveredRating({});
    }
  }, [isOpen]);

  if (!isOpen || !product || !order) return null;

  // Get product details
  const getProductImage = () => {
    if (!product?.images?.length) return "/placehold.png";
    const primaryImage = product.images.find((img) => img.isPrimary);
    return primaryImage?.url || product.images[0]?.url || "/placehold.png";
  };

  const getProductPrice = () => {
    if (!product?.variations?.length) return 0;
    const defaultVariation =
      product.variations.find((v) => v.isDefault) || product.variations[0];
    const price = defaultVariation?.price;
    return typeof price === "number" ? price : parseFloat(price) || 0;
  };

  // Rating categories with icons and descriptions
  const ratingCategories = [
    {
      key: "productQuality",
      label: "Product Quality",
      icon: Package,
      description: "How satisfied are you with the product quality?",
      color: "text-blue-600",
    },
    {
      key: "deliverySpeed",
      label: "Delivery Speed",
      icon: Truck,
      description: "How fast was the delivery?",
      color: "text-green-600",
    },
    {
      key: "shoppingExperience",
      label: "Shopping Experience",
      icon: Award,
      description: "How was your overall shopping experience?",
      color: "text-purple-600",
    },
    {
      key: "customerService",
      label: "Customer Service",
      icon: MessageCircle,
      description: "How helpful was the customer service?",
      color: "text-orange-600",
    },
  ];

  // Handle star rating click
  const handleRatingClick = (category, rating) => {
    setRatings((prev) => ({
      ...prev,
      [category]: rating,
    }));

    // Clear error for this category if it was previously invalid
    if (errors[category]) {
      setErrors((prev) => ({
        ...prev,
        [category]: null,
      }));
    }
  };

  // Handle star hover
  const handleRatingHover = (category, rating) => {
    setHoveredRating((prev) => ({
      ...prev,
      [category]: rating,
    }));
  };

  // Handle star hover leave
  const handleRatingLeave = (category) => {
    setHoveredRating((prev) => ({
      ...prev,
      [category]: null,
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Check if all ratings are provided
    Object.keys(ratings).forEach((category) => {
      if (ratings[category] === 0) {
        newErrors[category] = "Please provide a rating";
      }
    });

    // Check if review text is provided
    if (!reviewText.trim()) {
      newErrors.reviewText = "Please write a review";
    } else if (reviewText.trim().length < 10) {
      newErrors.reviewText = "Review must be at least 10 characters";
    } else if (reviewText.trim().length > 1000) {
      newErrors.reviewText = "Review must be less than 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        ...ratings,
        reviewText: reviewText.trim(),
      };

      console.log("Submitting review data:", reviewData);
      console.log("Product:", product);
      console.log("Order:", order);

      // Call the parent's submit handler
      if (onSubmitReview) {
        await onSubmitReview(reviewData);
      } else {
        throw new Error("No submit review handler provided");
      }

      // Success - modal will be closed by parent component
    } catch (error) {
      console.error("Failed to submit review:", error);
      setErrors({
        submit: error.message || "Failed to submit review. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render star rating component
  const renderStarRating = (category, currentRating) => {
    const hovered = hoveredRating[category];
    const activeRating = hovered || currentRating;

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-colors duration-150"
            onClick={() => handleRatingClick(category, star)}
            onMouseEnter={() => handleRatingHover(category, star)}
            onMouseLeave={() => handleRatingLeave(category)}
            disabled={isSubmitting}
          >
            <Star
              className={`h-6 w-6 transition-colors duration-150 ${
                star <= activeRating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300 hover:text-yellow-200"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {activeRating > 0 ? `${activeRating}/5` : "Rate this"}
        </span>
      </div>
    );
  };

  // Get rating description
  const getRatingDescription = (rating) => {
    if (rating === 0) return "";
    const descriptions = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    };
    return descriptions[rating];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Write a Review
              </h2>
              <p className="text-sm text-gray-600">
                Share your experience with this product
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-gray-200"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Product Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Product Details
              </h3>
              <div className="flex space-x-4">
                <img
                  src={getProductImage()}
                  alt={product.title || "Product"}
                  className="w-20 h-20 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = "/placehold.png";
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {product.title || "Unknown Product"}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.brandName || product.brand || "Unknown Brand"}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">
                      Price:{" "}
                      <span className="font-medium">
                        LKR {getProductPrice().toFixed(2)}
                      </span>
                    </span>
                    <span className="text-gray-600">
                      Order:{" "}
                      <span className="font-medium">
                        {order.orderNumber || `#${order._id.slice(-6)}`}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Ordered on {formatDate(order.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Categories */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Rate Your Experience
                </h3>
                <div className="space-y-4">
                  {ratingCategories.map((category) => {
                    const Icon = category.icon;
                    const rating = ratings[category.key];
                    const hovered = hoveredRating[category.key];
                    const activeRating = hovered || rating;

                    return (
                      <div
                        key={category.key}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`p-2 rounded-lg bg-gray-50 ${category.color}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900">
                                {category.label}
                              </h4>
                              {activeRating > 0 && (
                                <span className="text-sm font-medium text-yellow-600">
                                  {getRatingDescription(activeRating)}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              {category.description}
                            </p>
                            {renderStarRating(category.key, rating)}
                            {errors[category.key] && (
                              <p className="text-red-600 text-sm mt-1 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {errors[category.key]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Write Your Review
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <textarea
                    value={reviewText}
                    onChange={(e) => {
                      setReviewText(e.target.value);
                      if (errors.reviewText) {
                        setErrors((prev) => ({ ...prev, reviewText: null }));
                      }
                    }}
                    placeholder="Share your experience with this product. What did you like or dislike? Would you recommend it to others?"
                    rows={5}
                    className={`w-full resize-none border-0 focus:ring-0 focus:outline-none placeholder-gray-400 ${
                      errors.reviewText ? "text-red-600" : "text-gray-900"
                    }`}
                    maxLength={1000}
                    disabled={isSubmitting}
                  />
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{reviewText.length}/1000 characters</span>
                      {reviewText.length >= 10 && (
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Minimum reached
                        </span>
                      )}
                    </div>
                  </div>
                  {errors.reviewText && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.reviewText}
                    </p>
                  )}
                </div>
              </div>

              {/* Form Errors */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center text-red-800">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">{errors.submit}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewModal;
