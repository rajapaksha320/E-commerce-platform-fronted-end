import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Star,
  Upload,
  Camera,
  MessageSquare,
  Heart,
  ThumbsUp,
  Award,
  Gift,
  CheckCircle,
  ArrowLeft,
  Package,
  Truck,
  Headphones,
  Shield,
  User,
  Mail,
  Phone,
  Image,
  X,
  Plus,
  Info,
  Sparkles,
  Target,
  Users,
  Clock,
  Send,
  FileText,
  Zap,
  Globe,
  ArrowRight,
  Building,
  Store,
  ExternalLink,
} from "lucide-react";

import {
  Button,
  Badge,
  ContactCard as Card,
  Input,
  Textarea,
} from "../../components/ui/ContactUis/Uis";

// Success Modal Component
const SuccessModal = ({ isOpen, onClose, reviewData }) => {
  if (!isOpen) return null;

  const handleContinueShopping = () => {
    window.location.href = "/product-collections";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Animation Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"></div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-16 right-16 w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-8 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-12 w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
        </div>

        <div className="relative p-8 text-center">
          {/* Success Icon with Animation */}
          <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          {/* Sparkles decoration */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>

          {/* Success Message */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            🎉 Review Submitted!
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Thank you for sharing your experience with{" "}
            <span className="font-semibold text-blue-600">Emmover</span>!<br />
            Your review helps other customers make better decisions.
          </p>

          {/* Review Summary */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-2">
            <div className="flex items-center text-sm">
              <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0 fill-current" />
              <span className="text-gray-600 flex-1">
                {reviewData?.overallRating} out of 5 stars
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Gift className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" />
              <span className="text-gray-600 flex-1">
                10% discount code sent
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Award className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
              <span className="text-gray-600 flex-1">
                50 loyalty points earned
              </span>
            </div>
          </div>

          {/* Discount Code Display */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Your discount code:</p>
            <div className="text-xl font-bold text-purple-600 tracking-wider">
              REVIEW10
            </div>
            <p className="text-xs text-gray-500 mt-1">Valid for 30 days</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleContinueShopping}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              size="lg"
            >
              <Package className="w-5 h-5 mr-2" />
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Close
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <Shield className="w-3 h-3 mr-1" />
              Review will appear after verification (24-48 hours)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeaveReview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Form state
  const [reviewData, setReviewData] = useState({
    productRating: 0,
    serviceRating: 0,
    deliveryRating: 0,
    overallRating: 0,
    reviewText: "",
    wouldRecommend: null,
    reviewType: "product", // product, service, delivery, overall
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Sample product data (would come from URL params or API in real app)
  const productInfo = {
    id: searchParams.get("product") || "1",
    name: "Smart Home Security Camera",
    image: "📷",
    orderNumber: searchParams.get("order") || "EM202406120001",
    purchaseDate: "2024-06-01",
    price: "$129.99",
  };

  const reviewCategories = [
    {
      id: "product",
      title: "Product Quality",
      description: "Rate the product quality, features, and value",
      icon: Package,
      color: "blue",
      rating: reviewData.productRating,
      key: "productRating",
    },
    {
      id: "service",
      title: "Customer Service",
      description: "Rate our customer support experience",
      icon: Headphones,
      color: "purple",
      rating: reviewData.serviceRating,
      key: "serviceRating",
    },
    {
      id: "delivery",
      title: "Delivery Experience",
      description: "Rate shipping speed and packaging quality",
      icon: Truck,
      color: "green",
      rating: reviewData.deliveryRating,
      key: "deliveryRating",
    },
    {
      id: "overall",
      title: "Overall Experience",
      description: "Your overall satisfaction with Emmover",
      icon: Star,
      color: "yellow",
      rating: reviewData.overallRating,
      key: "overallRating",
    },
  ];

  const reviewIncentives = [
    {
      icon: Gift,
      title: "10% Off Next Order",
      description: "Get a discount coupon for your next purchase",
      color: "purple",
    },
    {
      icon: Award,
      title: "Loyalty Points",
      description: "Earn 50 points added to your account",
      color: "blue",
    },
    {
      icon: Users,
      title: "Help Others",
      description: "Your review helps other customers make informed decisions",
      color: "green",
    },
  ];

  const sampleReviews = [
    {
      author: "Sarah M.",
      rating: 5,
      text: "Amazing product quality and fast shipping! The customer service was also excellent.",
      date: "2 days ago",
      verified: true,
    },
    {
      author: "Mike R.",
      rating: 4,
      text: "Great value for money. Installation was easy and the app works perfectly.",
      date: "1 week ago",
      verified: true,
    },
    {
      author: "Lisa K.",
      rating: 5,
      text: "Exceeded my expectations! The night vision feature is incredible.",
      date: "2 weeks ago",
      verified: true,
    },
  ];

  const handleRatingChange = (category, rating) => {
    setReviewData((prev) => ({
      ...prev,
      [category]: rating,
    }));
  };

  const handleInputChange = (field, value) => {
    setReviewData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (uploadedImages.length + files.length <= 5) {
      const newImages = files.map((file, index) => ({
        id: Date.now() + index,
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      }));
      setUploadedImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (imageId) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleSubmitReview = async () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 2000);
  };

  const isFormValid = () => {
    return reviewData.overallRating > 0 && reviewData.reviewText.trim();
  };

  const StarRating = ({ rating, onRatingChange, size = 24 }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="focus:outline-none transition-colors duration-200"
          >
            <Star
              size={size}
              className={`${
                star <= rating
                  ? "text-yellow-500 fill-current"
                  : "text-gray-300 hover:text-yellow-400"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        reviewData={reviewData}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Button>

            <Badge variant="primary" icon={<Star size={16} />}>
              Review & Earn Rewards
            </Badge>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Badge
              variant="primary"
              size="lg"
              className="mb-6"
              icon={<MessageSquare size={16} />}
            >
              Leave a Review
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Share Your
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Experience
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Your feedback helps us improve and helps other customers make
              informed decisions. Plus, get rewarded for sharing your honest
              review!
            </p>

            {/* Incentives */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {reviewIncentives.map((incentive, index) => {
                const IncentiveIcon = incentive.icon;
                return (
                  <div key={index} className="text-center">
                    <div
                      className={`p-3 bg-${incentive.color}-100 rounded-full w-fit mx-auto mb-3`}
                    >
                      <IncentiveIcon
                        size={24}
                        className={`text-${incentive.color}-600`}
                      />
                    </div>
                    <h3 className="font-semibold text-white mb-1">
                      {incentive.title}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {incentive.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Review Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Information */}
            <Card shadow="xl" hover={false}>
              <Card.Header>
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Package className="mr-3 text-blue-500" size={24} />
                  Product Information
                </h3>
              </Card.Header>
              <Card.Body>
                <div className="flex items-center space-x-4">
                  <div className="text-4xl bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-lg">
                    {productInfo.image}
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {productInfo.name}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Order: #{productInfo.orderNumber}</p>
                      <p>
                        Purchased:{" "}
                        {new Date(
                          productInfo.purchaseDate
                        ).toLocaleDateString()}
                      </p>
                      <p>Price: {productInfo.price}</p>
                    </div>
                  </div>
                  <Badge variant="success" icon={<Shield size={14} />}>
                    Verified Purchase
                  </Badge>
                </div>
              </Card.Body>
            </Card>

            {/* Rating Categories */}
            <Card shadow="xl" hover={false}>
              <Card.Header>
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Star className="mr-3 text-yellow-500" size={24} />
                  Rate Your Experience
                </h3>
              </Card.Header>
              <Card.Body>
                <div className="grid md:grid-cols-2 gap-6">
                  {reviewCategories.map((category) => {
                    const CategoryIcon = category.icon;
                    return (
                      <div
                        key={category.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div
                            className={`p-2 bg-${category.color}-100 rounded-full`}
                          >
                            <CategoryIcon
                              size={20}
                              className={`text-${category.color}-600`}
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {category.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {category.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <StarRating
                            rating={category.rating}
                            onRatingChange={(rating) =>
                              handleRatingChange(category.key, rating)
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>

            {/* Written Review */}
            <Card shadow="xl" hover={false}>
              <Card.Header>
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <FileText className="mr-3 text-purple-500" size={24} />
                  Write Your Review
                </h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed Review *
                    </label>
                    <Textarea
                      placeholder="Share your detailed experience with this product and our service. What did you like? What could be improved?"
                      value={reviewData.reviewText}
                      onChange={(e) =>
                        handleInputChange("reviewText", e.target.value)
                      }
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Would you recommend this product?
                    </label>
                    <div className="flex space-x-4">
                      <Button
                        variant={
                          reviewData.wouldRecommend === true
                            ? "primary"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleInputChange("wouldRecommend", true)
                        }
                        className="flex items-center space-x-2"
                      >
                        <ThumbsUp size={16} />
                        <span>Yes, I recommend</span>
                      </Button>
                      <Button
                        variant={
                          reviewData.wouldRecommend === false
                            ? "danger"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleInputChange("wouldRecommend", false)
                        }
                        className="flex items-center space-x-2"
                      >
                        <X size={16} />
                        <span>No, I don't recommend</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Photo Upload */}
            <Card shadow="xl" hover={false}>
              <Card.Header>
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Camera className="mr-3 text-green-500" size={24} />
                  Add Photos (Optional)
                </h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Photos help other customers see the product in action.
                    Upload up to 5 images.
                  </p>

                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload
                        size={48}
                        className="text-gray-400 mx-auto mb-4"
                      />
                      <p className="text-gray-600 mb-2">
                        Click to upload photos
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG up to 10MB each
                      </p>
                    </label>
                  </div>

                  {/* Uploaded Images */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                      {uploadedImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.preview}
                            alt={image.name}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(image.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      {uploadedImages.length < 5 && (
                        <label
                          htmlFor="image-upload"
                          className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
                        >
                          <Plus size={24} className="text-gray-400" />
                        </label>
                      )}
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>

            {/* Submit Button */}
            <Card shadow="xl" hover={false}>
              <Card.Body>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Info size={16} className="text-blue-500" />
                    <span className="text-sm text-gray-600">
                      Reviews are verified and may take 24-48 hours to appear
                    </span>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmitReview}
                    disabled={!isFormValid() || isSubmitting}
                    className="flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Submit Review</span>
                      </>
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Review Guidelines */}
            <Card shadow="lg" hover={false}>
              <Card.Header>
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Info className="mr-2 text-blue-500" size={20} />
                  Review Guidelines
                </h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <CheckCircle
                      size={16}
                      className="text-green-500 mt-0.5 flex-shrink-0"
                    />
                    <span>Be honest and detailed in your review</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle
                      size={16}
                      className="text-green-500 mt-0.5 flex-shrink-0"
                    />
                    <span>Focus on product features and quality</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle
                      size={16}
                      className="text-green-500 mt-0.5 flex-shrink-0"
                    />
                    <span>Include how you use the product</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle
                      size={16}
                      className="text-green-500 mt-0.5 flex-shrink-0"
                    />
                    <span>Mention delivery and packaging experience</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <X
                      size={16}
                      className="text-red-500 mt-0.5 flex-shrink-0"
                    />
                    <span>Don't include personal information</span>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Recent Reviews */}
            <Card shadow="lg" hover={false}>
              <Card.Header>
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <MessageSquare className="mr-2 text-purple-500" size={20} />
                  Recent Reviews
                </h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  {sampleReviews.map((review, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {review.author}
                          </span>
                          {review.verified && (
                            <Badge variant="success" size="sm">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className="text-yellow-500 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {review.text}
                      </p>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Rewards Info */}
            <Card
              shadow="lg"
              hover={false}
              className="bg-gradient-to-br from-purple-50 to-blue-50"
            >
              <Card.Body>
                <div className="text-center">
                  <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                    <Gift size={24} className="text-purple-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    Review Rewards
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Get instant rewards for leaving honest reviews!
                  </p>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Discount Code:</span>
                      <Badge variant="purple" size="sm">
                        10% OFF
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Loyalty Points:</span>
                      <Badge variant="blue" size="sm">
                        50 Points
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveReview;
