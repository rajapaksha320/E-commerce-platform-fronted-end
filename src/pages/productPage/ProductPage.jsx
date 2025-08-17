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
  AlertCircle,
  Loader,
  Building,
} from "lucide-react";

import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";
import Pagination from "../../components/ui/ContactUis/Pagination";
import useUser from "../../hooks/useUser";
import { useSelector } from "react-redux";
import { selectUser as selectAuthUser } from "../../store/slices/authSlice";

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);

  // Redux hooks
  const {
    currentListing,
    listingDetailLoading,
    listingDetailError,
    fetchListingById,
    resetListingDetail,
    addItemToCart,
    cartLoading,
    isItemInCart,
    isItemInProductWishlist,
    quickToggleWishlist,
    getCurrentListingData,
    getListingVariations,
    getDefaultVariation,
    getListingImages,
    getPrimaryImage,
    listingDetailSummary,
    fetchWishlist,
    wishlist,
    wishlistLoading,
    // Add shop-related functions
    fetchShopDetailsById,
    currentShopDetails,
    shopDetailLoading,
    fetchStoresByCategory,
  } = useUser();

  // Component state
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [reviewsPage, setReviewsPage] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImageZoom, setSelectedImageZoom] = useState(false);
  const [wishlistOperationLoading, setWishlistOperationLoading] =
    useState(false);

  // State to store shop information
  const [shopInfo, setShopInfo] = useState(null);
  const [shopLoading, setShopLoading] = useState(false);

  // Derived data
  const listingData = getCurrentListingData();
  const product = listingData?.listing;
  const seller = listingData?.seller;
  const variations = getListingVariations();
  const defaultVariation = getDefaultVariation();
  const productImages = getListingImages();
  const primaryImage = getPrimaryImage();

  // Get current variation data
  const currentVariation = selectedVariation || defaultVariation;
  const currentImages =
    currentVariation?.images?.length > 0
      ? currentVariation.images
      : productImages;

  // Check if product has variations
  const hasVariations = product?.hasVariations;

  // Function to fetch shop information by seller ID
  const fetchShopBySellerId = async (sellerId) => {
    if (!sellerId) return;

    setShopLoading(true);
    try {
      // Try to get shop information using category filter API
      // Since we don't know the category, we'll try a common one first
      // This is a workaround - ideally the listing API should return shop ID
      const response = await fetchStoresByCategory(
        product?.category?.main || "fashion",
        1,
        50
      ).unwrap();

      if (response?.data && Array.isArray(response.data)) {
        // Find the shop that matches the seller ID
        const matchingShopData = response.data.find(
          (storeData) => storeData.shop?.sellerId === sellerId
        );

        if (matchingShopData?.shop) {
          setShopInfo(matchingShopData.shop);
        }
      }
    } catch (error) {
      console.error("Error fetching shop information:", error);
      // Fallback: set seller info as shop info for navigation
      if (seller) {
        setShopInfo({
          _id: seller._id, // This will be seller ID as fallback
          sellerId: seller._id,
          basicInformation: {
            storeName:
              seller.businessInfo?.businessName || `${seller.firstName}'s Shop`,
            storeDescription: "Professional seller",
          },
          contactDetails: seller.contactInfo || {},
          isActive: seller.isActive,
        });
      }
    } finally {
      setShopLoading(false);
    }
  };

  // Fetch product data and wishlist
  useEffect(() => {
    if (productId) {
      fetchListingById(productId);
    }

    // Fetch user's wishlist if authenticated
    if (authUser) {
      fetchWishlist(authUser._id);
    }

    return () => {
      resetListingDetail();
    };
  }, [
    productId,
    authUser,
    fetchListingById,
    fetchWishlist,
    resetListingDetail,
  ]);

  // Fetch shop information when seller data is available
  useEffect(() => {
    if (seller?._id && product?.category?.main) {
      fetchShopBySellerId(seller._id);
    }
  }, [seller?._id, product?.category?.main]);

  // Update wishlist status when wishlist data or product data changes
  useEffect(() => {
    if (authUser && productId && wishlist) {
      const isInWishlist = isItemInProductWishlist(productId);
      setIsWishlisted(isInWishlist);
    }
  }, [authUser, productId, wishlist, isItemInProductWishlist]);

  // Set initial variation when data loads
  useEffect(() => {
    if (variations.length > 0 && !selectedVariation) {
      setSelectedVariation(defaultVariation);
    }
  }, [variations, defaultVariation, selectedVariation]);

  // Loading state
  if (listingDetailLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (listingDetailError || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {listingDetailError ||
              "The product you're looking for doesn't exist."}
          </p>
          <Button onClick={() => navigate(-1)} variant="primary">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Calculate pricing
  const getCurrentPrice = () => {
    if (!currentVariation) return 0;
    return parseFloat(currentVariation.price || 0);
  };

  const getOriginalPrice = () => {
    if (!currentVariation) return 0;
    return parseFloat(currentVariation.originalPrice || 0);
  };

  const getDiscount = () => {
    const current = getCurrentPrice();
    const original = getOriginalPrice();
    if (original > current) {
      return Math.round(((original - current) / original) * 100);
    }
    return 0;
  };

  const getStockQuantity = () => {
    return parseInt(currentVariation?.quantity || 0);
  };

  // Get unique colors and sizes from variations
  const getUniqueColors = () => {
    if (!hasVariations) return [];
    const colors = [];
    variations.forEach((variation) => {
      if (variation.color && Array.isArray(variation.color)) {
        variation.color.forEach((color) => {
          if (!colors.find((c) => c.hex === color)) {
            colors.push({ id: color, name: color, hex: color });
          }
        });
      }
    });
    return colors;
  };

  const getUniqueSizes = () => {
    if (!hasVariations) return [];
    const sizes = [];
    variations.forEach((variation) => {
      if (variation.sizes && Array.isArray(variation.sizes)) {
        variation.sizes.forEach((size) => {
          if (!sizes.find((s) => s.id === size)) {
            sizes.push({ id: size, name: size, available: true });
          }
        });
      }
    });
    return sizes;
  };

  const availableColors = getUniqueColors();
  const availableSizes = getUniqueSizes();
  const selectedColor = currentVariation?.color?.[0] || "";
  const selectedSize = currentVariation?.sizes?.[0] || "";

  // Handle variation selection
  const handleVariationChange = (type, value) => {
    if (!hasVariations) return;

    // Find variation that matches the selected attributes
    const newVariation = variations.find((variation) => {
      if (type === "color") {
        return variation.color?.includes(value);
      } else if (type === "size") {
        return variation.sizes?.includes(value);
      }
      return false;
    });

    if (newVariation) {
      setSelectedVariation(newVariation);
      setSelectedImage(0); // Reset to first image of new variation
    }
  };

  const tabs = [
    { id: "description", name: "Description", count: null },
    { id: "specifications", name: "Specifications", count: null },
    { id: "reviews", name: "Reviews", count: 0 },
    { id: "shipping", name: "Shipping & Returns", count: null },
  ];

  const handleQuantityChange = (action) => {
    const maxQuantity = Math.min(getStockQuantity(), 10);
    if (action === "increase") {
      setQuantity((prev) => Math.min(prev + 1, maxQuantity));
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleAddToCart = async () => {
    if (!authUser) {
      navigate("/login");
      return;
    }

    if (!currentVariation) return;

    try {
      await addItemToCart(authUser._id, product._id, quantity);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleBuyNow = () => {
    if (!authUser) {
      navigate("/login");
      return;
    }
    // Add to cart first, then navigate to checkout
    handleAddToCart();
    navigate("/checkout");
  };

  const handleWishlistToggle = async () => {
    if (!authUser) {
      navigate("/login");
      return;
    }

    if (wishlistOperationLoading) return; // Prevent double-clicking

    setWishlistOperationLoading(true);

    try {
      await quickToggleWishlist(authUser._id, product._id, "product");
      // The state will be updated automatically by the useEffect that watches wishlist changes
      // But we can also update it immediately for better UX
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      // Revert the state if there was an error
      setIsWishlisted(isWishlisted);
    } finally {
      setWishlistOperationLoading(false);
    }
  };

  // Updated shop navigation handler
  const handleVisitShop = () => {
    if (shopInfo?._id) {
      // Use the correct shop ID
      navigate(`/shop/${shopInfo._id}`);
    } else if (seller?._id) {
      // Fallback to seller ID if shop info is not available
      console.warn("Shop ID not available, using seller ID as fallback");
      navigate(`/shop/${seller._id}`);
    } else {
      console.error("Neither shop ID nor seller ID available");
    }
  };

  const renderStars = (rating, size = "sm") => {
    const numRating = parseFloat(rating || 0);
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} ${
          i < Math.floor(numRating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const isInStock = getStockQuantity() > 0 && product.status === "active";

  // Get shop display information
  const getShopDisplayInfo = () => {
    if (shopInfo) {
      return {
        name:
          shopInfo.basicInformation?.storeName ||
          `${seller?.firstName || "Unknown"}'s Shop`,
        isActive: shopInfo.status === "active" || shopInfo.isActive,
        location:
          shopInfo.contactDetails?.storeLocation ||
          seller?.contactInfo?.city ||
          "Unknown location",
        businessType: seller?.businessInfo?.businessType || "Professional",
        id: shopInfo._id,
      };
    } else if (seller) {
      return {
        name:
          seller.businessInfo?.businessName ||
          `${seller.firstName || "Unknown"}'s Shop`,
        isActive: seller.isActive,
        location: seller.contactInfo?.city || "Unknown location",
        businessType: seller.businessInfo?.businessType || "Professional",
        id: seller._id, // Fallback to seller ID
      };
    }
    return {
      name: "Shop",
      isActive: false,
      location: "Unknown location",
      businessType: "Professional",
      id: null,
    };
  };

  const shopDisplayInfo = getShopDisplayInfo();

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
                {product.category?.main || "Products"}
              </span>
              <span className="mx-2">/</span>
              <span className="hover:text-blue-600 cursor-pointer">
                {product.category?.sub || "Items"}
              </span>
              <span className="mx-2">/</span>
              <span className="text-gray-900 truncate max-w-xs">
                {product.title}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleWishlistToggle}
                disabled={wishlistOperationLoading}
                className={`touch-manipulation ${
                  isWishlisted ? "text-red-600" : "text-gray-600"
                }`}
              >
                {wishlistOperationLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Heart
                    className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
                  />
                )}
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
              {currentImages && currentImages.length > 0 ? (
                <img
                  src={currentImages[selectedImage]?.url || primaryImage?.url}
                  alt={currentImages[selectedImage]?.alt || product.title}
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setSelectedImageZoom(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              )}

              {/* Image Navigation */}
              {currentImages && currentImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === 0 ? currentImages.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all touch-manipulation"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === currentImages.length - 1 ? 0 : prev + 1
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
            {currentImages && currentImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {currentImages.map((image, index) => (
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
                      src={image.url}
                      alt={image.alt || `${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                  {product.brand || shopDisplayInfo.name}
                </span>
                {seller?.businessInfo && (
                  <Badge variant="success" size="sm">
                    Verified Seller
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {product.title}
              </h1>
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center space-x-1">
                  {renderStars(product.averageRating)}
                  <span className="text-sm font-medium text-gray-900 ml-1">
                    {product.averageRating || 0}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  SKU: {currentVariation?.sku || product.id}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  ${getCurrentPrice().toFixed(2)}
                </span>
                {getOriginalPrice() > getCurrentPrice() && (
                  <span className="text-xl text-gray-500 line-through">
                    ${getOriginalPrice().toFixed(2)}
                  </span>
                )}
                {getDiscount() > 0 && (
                  <Badge variant="danger" size="sm">
                    -{getDiscount()}% OFF
                  </Badge>
                )}
              </div>
              {getDiscount() > 0 && (
                <p className="text-sm text-green-600 font-medium">
                  You save $
                  {(getOriginalPrice() - getCurrentPrice()).toFixed(2)}
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {isInStock ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">
                    In Stock ({getStockQuantity()} available)
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Variations - Colors */}
            {hasVariations && availableColors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Color: {selectedColor}
                </h3>
                <div className="flex space-x-3">
                  {availableColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => handleVariationChange("color", color.id)}
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
                              color.hex === "#FFFFFF" || color.hex === "#ffffff"
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

            {/* Variations - Sizes */}
            {hasVariations && availableSizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Size: {selectedSize}
                </h3>
                <div className="flex space-x-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => handleVariationChange("size", size.id)}
                      className={`px-4 py-2 text-sm border rounded-lg transition-all touch-manipulation ${
                        selectedSize === size.id
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size.name}
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
                    className="p-2 hover:bg-gray-100 transition-colors touch-manipulation disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="p-2 hover:bg-gray-100 transition-colors touch-manipulation disabled:opacity-50"
                    disabled={quantity >= Math.min(getStockQuantity(), 10)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  (Max {Math.min(getStockQuantity(), 10)} per order)
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
                  disabled={!isInStock || cartLoading}
                >
                  {cartLoading ? (
                    <Loader className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <ShoppingCart className="h-5 w-5 mr-2" />
                  )}
                  {isItemInCart(product._id) ? "Added to Cart" : "Add to Cart"}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  variant="outline"
                  className="flex-1 py-3 text-lg font-semibold border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white touch-manipulation"
                  size="lg"
                  disabled={!isInStock}
                >
                  Buy It Now
                </Button>
              </div>

              {/* Visit Shop Button */}
              <Button
                onClick={handleVisitShop}
                variant="outline"
                className="w-full py-3 text-lg font-semibold border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-gray-500 touch-manipulation"
                size="lg"
                disabled={shopLoading}
              >
                {shopLoading ? (
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Building className="h-5 w-5 mr-2" />
                )}
                Visit {shopDisplayInfo.name}
              </Button>
            </div>

            {/* Key Features */}
            {product.productTags && product.productTags.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Product Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.productTags.slice(0, 6).map((tag, index) => (
                    <Badge key={index} variant="secondary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Shipping Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <Truck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Free Shipping
                  </p>
                  <p className="text-xs text-green-600">
                    {product.shippingClass?.returnPolicy || "Standard delivery"}
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
                    {product.shippingClass?.returnPolicy || "30"} days
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
                    {product.shippingClass?.warranty || "Manufacturer warranty"}
                  </p>
                </div>
              </div>
            </div>

            {/* Shop Information Card */}
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {shopDisplayInfo.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Trusted Seller • {shopDisplayInfo.location}
                      {shopDisplayInfo.isActive && (
                        <span className="ml-2 inline-flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          Online
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {shopDisplayInfo.businessType} Business
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleVisitShop}
                  variant="primary"
                  size="sm"
                  className="flex items-center space-x-2"
                  disabled={shopLoading}
                >
                  {shopLoading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Building className="h-4 w-4" />
                  )}
                  <span>Visit Shop</span>
                </Button>
              </div>

              {/* Additional shop info */}
              <div className="mt-3 pt-3 border-t border-blue-200 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{shopDisplayInfo.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Professional Seller</span>
                </div>
              </div>

             
            </Card>
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
                  {tab.count !== null && (
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
                      ?.split("\n\n")
                      .map((paragraph, index) => (
                        <p key={index} className="mb-4">
                          {paragraph}
                        </p>
                      )) || <p>No description available.</p>}
                  </div>
                </div>

                {/* Product Specifications from current variation */}
                {currentVariation && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Product Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Weight</span>
                        <span className="text-sm font-medium text-gray-900">
                          {currentVariation.weight || product.weight || "N/A"}
                        </span>
                      </div>
                      {currentVariation.dimensions && (
                        <>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">
                              Length
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {currentVariation.dimensions.length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Width</span>
                            <span className="text-sm font-medium text-gray-900">
                              {currentVariation.dimensions.width}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">
                              Height
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {currentVariation.dimensions.height}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-blue-600" />
                    Product Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentVariation &&
                      Object.entries({
                        SKU: currentVariation.sku,
                        Weight: currentVariation.weight || product.weight,
                        Colors: currentVariation.color?.join(", "),
                        Sizes: currentVariation.sizes?.join(", "),
                        Price: `$${currentVariation.price}`,
                        "Original Price": currentVariation.originalPrice
                          ? `$${currentVariation.originalPrice}`
                          : "N/A",
                        Stock: currentVariation.quantity,
                      })
                        .filter(([key, value]) => value)
                        .map(([key, value]) => (
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
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-gray-600">
                    Be the first to review this product.
                  </p>
                </div>
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
                          Shipping Class
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {product.shippingClass?.shippingClass || "Standard"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">
                          Shipping Weight
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {product.shippingClass?.shippingWeight || "N/A"}
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
                          Return Policy
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {product.shippingClass?.returnPolicy || "30"} days
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Warranty</span>
                        <span className="text-sm font-medium text-gray-900">
                          {product.shippingClass?.warranty ||
                            "Manufacturer warranty"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductPage;
