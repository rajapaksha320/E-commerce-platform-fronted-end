/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  MapPin,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  User,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Package,
  Zap,
  Award,
  Clock,
  CheckCircle,
  Camera,
  Play,
} from "lucide-react";

import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";
import Pagination from "../../components/ui/ContactUis/Pagination";

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [reviewsPage, setReviewsPage] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImageZoom, setSelectedImageZoom] = useState(false);

  // Mock product data - in real app, fetch based on productId
  const product = {
    id: productId,
    name: "Wireless Bluetooth Headphones Pro Max",
    brand: "TechAudio",
    price: 179.99,
    originalPrice: 249.99,
    discount: 28,
    rating: 4.8,
    totalReviews: 1247,
    inStock: true,
    stockCount: 47,
    sku: "TA-WBH-PM-001",
    category: "Electronics > Audio > Headphones",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop",
    ],
    colors: [
      { id: "black", name: "Midnight Black", hex: "#000000" },
      { id: "white", name: "Pearl White", hex: "#FFFFFF" },
      { id: "blue", name: "Ocean Blue", hex: "#1E40AF" },
      { id: "red", name: "Crimson Red", hex: "#DC2626" },
    ],
    sizes: [{ id: "onesize", name: "One Size", available: true }],
    description: `Experience premium audio quality with the Wireless Bluetooth Headphones Pro Max. Featuring advanced noise cancellation technology, premium comfort padding, and exceptional 30-hour battery life.

Built for audiophiles and professionals, these headphones deliver crystal-clear sound with deep bass and crisp highs. The ergonomic design ensures comfortable extended listening sessions.

Perfect for travel, work, gaming, and daily entertainment. Compatible with all Bluetooth devices and includes premium carrying case.`,

    features: [
      "Active Noise Cancellation",
      "30-Hour Battery Life",
      "Premium Comfort Padding",
      "Bluetooth 5.0 Technology",
      "Quick Charge - 5min = 3 hours",
      "Built-in Microphone",
      "Foldable Design",
      "Premium Carrying Case Included",
    ],

    specifications: {
      Audio: {
        "Driver Size": "40mm Dynamic",
        "Frequency Response": "20Hz - 20kHz",
        Impedance: "32 Ohms",
        Sensitivity: "105dB SPL",
        THD: "< 0.1%",
      },
      Connectivity: {
        "Bluetooth Version": "5.0",
        "Codecs Supported": "SBC, AAC, aptX",
        Range: "Up to 30 feet",
        "Multi-device": "Yes (2 devices)",
      },
      Battery: {
        Playtime: "30 hours (ANC Off)",
        "Playtime with ANC": "25 hours",
        "Charging Time": "2 hours",
        "Quick Charge": "5min = 3 hours",
        "Battery Type": "Lithium-ion",
      },
      Physical: {
        Weight: "250g",
        Dimensions: "190 x 160 x 80mm",
        Material: "Premium Plastic & Metal",
        Foldable: "Yes",
        "Color Options": "4 Available",
      },
    },

    shipping: {
      freeShipping: true,
      fastDelivery: true,
      estimatedDays: "2-3 business days",
      returns: "30-day free returns",
      warranty: "1-year manufacturer warranty",
    },

    seller: {
      name: "TechHub Electronics",
      rating: 4.9,
      totalSales: "50K+",
      responseTime: "< 2 hours",
      verified: true,
    },
  };

  // Mock reviews data
  const allReviews = Array.from({ length: 127 }, (_, i) => ({
    id: i + 1,
    user: {
      name: [
        "John Smith",
        "Sarah Johnson",
        "Mike Chen",
        "Emma Davis",
        "Alex Rodriguez",
      ][i % 5],
      avatar: null,
      verified: Math.random() > 0.3,
      location: ["New York", "California", "Texas", "Florida", "Illinois"][
        i % 5
      ],
    },
    rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars mostly
    title: [
      "Excellent sound quality!",
      "Great value for money",
      "Perfect for daily use",
      "Amazing noise cancellation",
      "Comfortable for long sessions",
      "Best headphones I've owned",
      "Worth every penny",
    ][i % 7],
    comment: [
      "These headphones exceeded my expectations. The sound quality is fantastic and the noise cancellation works perfectly. Highly recommended!",
      "Great build quality and comfortable to wear for hours. The battery life is impressive and charging is quick.",
      "Perfect for my daily commute. The noise cancellation blocks out all the train noise. Sound is crisp and clear.",
      "I've tried many headphones and these are by far the best. The bass is deep without being overwhelming.",
      "Excellent customer service and fast shipping. The headphones arrived well-packaged and work flawlessly.",
    ][i % 5],
    date: new Date(
      Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
    helpful: Math.floor(Math.random() * 50),
    verified: Math.random() > 0.2,
    images:
      Math.random() > 0.7
        ? [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
          ]
        : [],
  }));

  const reviewsPerPage = 10;
  const totalReviewPages = Math.ceil(allReviews.length / reviewsPerPage);
  const currentReviews = allReviews.slice(
    (reviewsPage - 1) * reviewsPerPage,
    reviewsPage * reviewsPerPage
  );

  // Related products
  const relatedProducts = [
    {
      id: 2,
      name: "Wireless Earbuds Pro",
      price: 129.99,
      originalPrice: 179.99,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
      badge: "Popular",
    },
    {
      id: 3,
      name: "Portable Speaker Max",
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
      badge: "Best Seller",
    },
    {
      id: 4,
      name: "USB-C Fast Charger",
      price: 29.99,
      originalPrice: 49.99,
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
      badge: "New",
    },
    {
      id: 5,
      name: "Premium Cable Kit",
      price: 19.99,
      originalPrice: 34.99,
      rating: 4.4,
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop",
      badge: "Sale",
    },
  ];

  useEffect(() => {
    setSelectedColor(product.colors[0]?.id || "");
    setSelectedSize(product.sizes[0]?.id || "");
  }, []);

  const tabs = [
    { id: "description", name: "Description", count: null },
    { id: "specifications", name: "Specifications", count: null },
    { id: "reviews", name: "Reviews", count: product.totalReviews },
    { id: "shipping", name: "Shipping & Returns", count: null },
  ];

  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity((prev) => Math.min(prev + 1, 10));
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", {
      productId,
      quantity,
      color: selectedColor,
      size: selectedSize,
    });
  };

  const handleBuyNow = () => {
    navigate(
      `/checkout?product=${productId}&quantity=${quantity}&color=${selectedColor}&size=${selectedSize}`
    );
  };

  const getBadgeVariant = (badge) => {
    const variants = {
      Popular: "warning",
      "Best Seller": "success",
      New: "primary",
      Sale: "danger",
    };
    return variants[badge] || "default";
  };

  const renderStars = (rating, size = "sm") => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb & Back */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
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

            <div className="text-sm text-gray-500 hidden md:block">
              <span className="hover:text-blue-600 cursor-pointer">Home</span>
              <span className="mx-2">/</span>
              <span className="hover:text-blue-600 cursor-pointer">
                Electronics
              </span>
              <span className="mx-2">/</span>
              <span className="hover:text-blue-600 cursor-pointer">
                Headphones
              </span>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{product.name}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`touch-manipulation ${
                  isWishlisted ? "text-red-600" : "text-gray-600"
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
                />
              </Button>
              <Button variant="ghost" size="sm" className="touch-manipulation">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-gray-200">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setSelectedImageZoom(true)}
              />

              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all touch-manipulation"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all touch-manipulation"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 bg-white/80 rounded-full p-2">
                <Camera className="h-4 w-4" />
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all touch-manipulation ${
                    selectedImage === index
                      ? "border-blue-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                  {product.brand}
                </span>
                <Badge variant="success" size="sm">
                  Verified Brand
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                  <span className="text-sm font-medium text-gray-900 ml-1">
                    {product.rating}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  ({product.totalReviews.toLocaleString()} reviews)
                </span>
                <span className="text-sm text-gray-600">
                  SKU: {product.sku}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.discount && (
                  <Badge variant="danger" size="sm">
                    -{product.discount}% OFF
                  </Badge>
                )}
              </div>
              {product.discount && (
                <p className="text-sm text-green-600 font-medium">
                  You save ${(product.originalPrice - product.price).toFixed(2)}
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-600 font-medium">
                In Stock ({product.stockCount} available)
              </span>
            </div>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Color:{" "}
                  {product.colors.find((c) => c.id === selectedColor)?.name}
                </h3>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`w-8 h-8 rounded-full border-2 transition-all touch-manipulation ${
                        selectedColor === color.id
                          ? "border-blue-600 scale-110"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor === color.id && (
                        <div className="w-full h-full rounded-full flex items-center justify-center">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              color.hex === "#FFFFFF"
                                ? "bg-gray-600"
                                : "bg-white"
                            }`}
                          />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Quantity
              </h3>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    className="p-2 hover:bg-gray-100 transition-colors touch-manipulation"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="p-2 hover:bg-gray-100 transition-colors touch-manipulation"
                    disabled={quantity >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  (Max 10 per order)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex space-x-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 text-lg font-semibold touch-manipulation"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  variant="outline"
                  className="flex-1 py-3 text-lg font-semibold border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white touch-manipulation"
                  size="lg"
                >
                  Buy It Now
                </Button>
              </div>
            </div>

            {/* Key Features */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.slice(0, 6).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Shipping Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <Truck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Free Shipping
                  </p>
                  <p className="text-xs text-green-600">
                    {product.shipping.estimatedDays}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <RotateCcw className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Easy Returns
                  </p>
                  <p className="text-xs text-blue-600">
                    {product.shipping.returns}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <Shield className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-800">
                    Warranty
                  </p>
                  <p className="text-xs text-purple-600">
                    {product.shipping.warranty}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="p-6 mb-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors touch-manipulation ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.name}
                  {tab.count && (
                    <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === "description" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Product Description
                  </h3>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    {product.description
                      .split("\n\n")
                      .map((paragraph, index) => (
                        <p key={index} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    What's in the Box
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "Wireless Headphones Pro Max",
                      "Premium Carrying Case",
                      "USB-C Charging Cable",
                      "Audio Cable (3.5mm)",
                      "Quick Start Guide",
                      "Warranty Card",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="space-y-6">
                {Object.entries(product.specifications).map(
                  ([category, specs]) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Zap className="h-5 w-5 mr-2 text-blue-600" />
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(specs).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between items-center py-2 border-b border-gray-100"
                          >
                            <span className="text-sm text-gray-600">{key}</span>
                            <span className="text-sm font-medium text-gray-900">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Reviews Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {product.rating}
                    </div>
                    <div className="flex justify-center items-center space-x-1 mb-2">
                      {renderStars(product.rating, "lg")}
                    </div>
                    <p className="text-sm text-gray-600">
                      Based on {product.totalReviews.toLocaleString()} reviews
                    </p>
                  </div>

                  <div className="col-span-2">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Rating Distribution
                    </h4>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const percentage = Math.floor(Math.random() * 40 + 10); // Mock percentages
                      return (
                        <div
                          key={star}
                          className="flex items-center space-x-3 mb-2"
                        >
                          <span className="text-sm text-gray-600 w-8">
                            {star} ★
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-10">
                            {percentage}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {currentReviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-200 pb-6"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {review.user.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h5 className="font-medium text-gray-900">
                              {review.user.name}
                            </h5>
                            {review.user.verified && (
                              <Badge variant="success" size="sm">
                                Verified Purchase
                              </Badge>
                            )}
                            <span className="text-sm text-gray-500">
                              • {review.user.location}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex items-center">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-500">
                              {review.date}
                            </span>
                          </div>

                          <h6 className="font-medium text-gray-900 mb-2">
                            {review.title}
                          </h6>
                          <p className="text-gray-700 text-sm mb-3">
                            {review.comment}
                          </p>

                          {review.images.length > 0 && (
                            <div className="flex space-x-2 mb-3">
                              {review.images.map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt="Review"
                                  className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                />
                              ))}
                            </div>
                          )}

                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 touch-manipulation">
                              <ThumbsUp className="h-4 w-4" />
                              <span>Helpful ({review.helpful})</span>
                            </button>
                            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 touch-manipulation">
                              <MessageSquare className="h-4 w-4" />
                              <span>Reply</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reviews Pagination */}
                <Pagination
                  currentPage={reviewsPage}
                  totalPages={totalReviewPages}
                  onPageChange={setReviewsPage}
                  itemsPerPage={reviewsPerPage}
                  totalItems={allReviews.length}
                />
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Truck className="h-5 w-5 mr-2 text-blue-600" />
                      Shipping Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">
                          Standard Delivery
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          FREE
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">
                          Estimated Delivery
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {product.shipping.estimatedDays}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">
                          Express Delivery
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          $9.99 (Next Day)
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">
                          International Shipping
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          Available
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <RotateCcw className="h-5 w-5 mr-2 text-green-600" />
                      Returns & Warranty
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">
                          Return Period
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          30 Days
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">
                          Return Shipping
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          FREE
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">
                          Manufacturer Warranty
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          1 Year
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">
                          Extended Warranty
                        </span>
                        <span className="text-sm font-medium text-blue-600 cursor-pointer">
                          Available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => navigate(`/product/${product.id}`)}
                padding={false}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant={getBadgeVariant(product.badge)} size="sm">
                      {product.badge}
                    </Badge>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-1 mb-2">
                    {renderStars(product.rating)}
                    <span className="text-xs text-gray-600 ml-1">
                      {product.rating}
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="font-bold text-gray-900 text-sm sm:text-base">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
