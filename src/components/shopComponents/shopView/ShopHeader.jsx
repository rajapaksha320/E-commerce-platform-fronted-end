/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  Verified,
  Users,
  Package,
  Heart,
  Share2,
  MessageCircle,
  ShoppingBag,
  Calendar,
  Building,
} from "lucide-react";
import { Button, Badge, ContactCard as Card } from "../../ui/ContactUis/Uis";
import useUser from "../../../hooks/useUser";
import { useSelector } from "react-redux";
import { selectUser as selectAuthUser } from "../../../store/slices/authSlice";

const ShopHeader = ({
  shop,
  className = "",
  onWishlistUpdate,
  realStats = {
    reviewCount: 0,
    productCount: 0,
    averageRating: 0,
    totalSales: 0,
  },
}) => {
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);

  // Redux hooks for wishlist management
  const {
    quickToggleWishlist,
    isItemInShopWishlist,
    fetchWishlist,
  } = useUser();

  if (!shop) return null;

  // Check if shop is in wishlist
  const isInWishlist = authUser ? isItemInShopWishlist(shop._id) : false;

  const handleWishlistToggle = async () => {
    if (!authUser?._id) {
      navigate("/login");
      return;
    }

    try {
      // Store the current state before toggle
      const wasInWishlist = isInWishlist;

      await quickToggleWishlist(authUser._id, shop._id, "shop");

      // Refresh wishlist to ensure state is updated immediately
      await fetchWishlist(authUser._id);

      // Call the callback to show toast notification in parent component
      if (onWishlistUpdate) {
        const shopName = shop.basicInformation?.storeName || "Shop";
        if (wasInWishlist) {
          onWishlistUpdate(`"${shopName}" removed from wishlist`, "success");
        } else {
          onWishlistUpdate(`"${shopName}" added to wishlist!`, "success", {
            text: "View Wishlist",
            action: () => navigate("/wishlist"),
          });
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      if (onWishlistUpdate) {
        onWishlistUpdate(
          "Failed to update wishlist. Please try again.",
          "error"
        );
      }
    }
  };

  const renderRatingStars = (rating) => {
    const numRating = parseFloat(rating || 0);
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(numRating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  // Format business hours
  const formatBusinessHours = (hours) => {
    if (!hours) return "Contact for hours";
    return hours;
  };

  // Get shop status badge
  const getStatusBadge = () => {
    if (shop.status === "active") {
      return { variant: "success", text: "Active" };
    } else {
      return { variant: "danger", text: "Inactive" };
    }
  };

  const statusBadge = getStatusBadge();

  const displayRating = realStats.averageRating || 0;
  const displayReviewCount = realStats.reviewCount || 0;
  const displayProductCount = realStats.productCount || 0;
  const displaySalesCount = realStats.totalSales || shop.totalSales || 0;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}
    >
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-600 to-purple-600">
        {shop.shopMedia?.bannerImage ? (
          <>
            <img
              src={shop.shopMedia.bannerImage}
              alt={`${shop.basicInformation?.storeName} cover`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/placehold.png";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <Building className="h-16 w-16 mx-auto mb-4 opacity-70" />
              <h2 className="text-2xl font-bold opacity-90">
                {shop.basicInformation?.storeName || "Shop"}
              </h2>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleWishlistToggle}
            className={`bg-white/90 backdrop-blur-sm border-white/20 transition-all duration-200 hover:!bg-white hover:!border-red-300 ${
              isInWishlist
                ? "text-red-600 border-red-200 bg-red-50/90 hover:!text-red-500"
                : "text-gray-600 hover:!text-red-500"
            }`}
          >
            <Heart
              className={`h-4 w-4 mr-1 transition-all duration-200 ${
                isInWishlist ? "fill-current scale-110" : ""
              }`}
            />
            <span className="font-medium">
              {isInWishlist ? "Saved" : "Save"}
            </span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-white/20 text-gray-600 hover:bg-white hover:border-gray-300 transition-all duration-200 group"
          >
            <Share2 className="h-4 w-4 group-hover:text-blue-500 transition-colors duration-200" />
          </Button>
        </div>
      </div>

      {/* Shop Info */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
          {/* Shop Logo */}
          <div className="flex-shrink-0 -mt-12 md:-mt-16 mb-4 md:mb-0">
            <div className="relative">
              {shop.shopMedia?.storeLogo ? (
                <img
                  src={shop.shopMedia.storeLogo}
                  alt={shop.basicInformation?.storeName}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  onError={(e) => {
                    e.target.src = "/placehold.png";
                  }}
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl md:text-2xl">
                    {shop.basicInformation?.storeName
                      ?.charAt(0)
                      ?.toUpperCase() || "S"}
                  </span>
                </div>
              )}
              {shop.status === "active" && (
                <div className="absolute -bottom-1 -right-1 bg-green-600 rounded-full p-1.5">
                  <Verified className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Shop Details */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {shop.basicInformation?.storeName || "Unnamed Shop"}
                  </h1>
                  <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                    <Badge variant={statusBadge.variant} size="sm">
                      <Verified className="h-3 w-3 mr-1" />
                      {statusBadge.text}
                    </Badge>
                  </div>
                </div>

                {shop.basicInformation?.storeTagLine && (
                  <p className="text-gray-600 text-lg mb-4">
                    {shop.basicInformation.storeTagLine}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {renderRatingStars(displayRating)}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {displayRating.toFixed(1)}
                    </span>
                    <span className="text-gray-600">
                      ({displayReviewCount}{" "}
                      {displayReviewCount === 1 ? "review" : "reviews"})
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-gray-600">
                    <Package className="h-4 w-4" />
                    <span className="text-sm">
                      {displayProductCount}{" "}
                      {displayProductCount === 1 ? "product" : "products"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-gray-600">
                    <ShoppingBag className="h-4 w-4" />
                    <span className="text-sm">
                      {displaySalesCount}{" "}
                      {displaySalesCount === 1 ? "sale" : "sales"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      Since {new Date(shop.createdAt).getFullYear()}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  {shop.contactDetails?.storeLocation && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span>{shop.contactDetails.storeLocation}</span>
                    </div>
                  )}
                  {shop.contactDetails?.storeBusinessHours && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>
                        {formatBusinessHours(
                          shop.contactDetails.storeBusinessHours
                        )}
                      </span>
                    </div>
                  )}
                  {shop.contactDetails?.storeContactNumber && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span>{shop.contactDetails.storeContactNumber}</span>
                    </div>
                  )}
                  {shop.contactDetails?.storeEmail && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {shop.contactDetails.storeEmail}
                      </span>
                    </div>
                  )}
                  {shop.contactDetails?.storeWebsite && (
                    <div className="flex items-center space-x-2 md:col-span-2">
                      <Globe className="h-4 w-4 flex-shrink-0" />
                      <a
                        href={
                          shop.contactDetails.storeWebsite.startsWith("http")
                            ? shop.contactDetails.storeWebsite
                            : `https://${shop.contactDetails.storeWebsite}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        {shop.contactDetails.storeWebsite}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Description */}
        {shop.basicInformation?.storeDescription && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              About This Shop
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {shop.basicInformation.storeDescription}
            </p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Shop Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Package className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-blue-600">
                {displayProductCount}
              </div>
              <div className="text-sm text-blue-700">Total Products</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg text-center">
              <ShoppingBag className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-green-600">
                {displaySalesCount}
              </div>
              <div className="text-sm text-green-700">Total Sales</div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-yellow-600">
                {displayRating.toFixed(1)}
              </div>
              <div className="text-sm text-yellow-700">Shop Rating</div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <MessageCircle className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-purple-600">
                {displayReviewCount}
              </div>
              <div className="text-sm text-purple-700">Total Reviews</div>
            </div>
          </div>
        </div>

        {/* Shop Status and Store ID */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Store ID: {shop.storeId}</span>
              <span>•</span>
              <span>
                Last updated: {new Date(shop.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  shop.status === "active" ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm text-gray-600 capitalize">
                {shop.status || "unknown"} Status
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
