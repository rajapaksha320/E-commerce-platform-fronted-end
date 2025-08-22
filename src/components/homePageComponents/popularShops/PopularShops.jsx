import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Star,
  Users,
  ShoppingBag,
  ArrowRight,
  Crown,
  Verified,
  TrendingUp,
  Heart,
  Loader2,
  MapPin,
  Phone,
  Globe,
} from "lucide-react";
import { Card, Button, Badge } from "../../ui";
import { useNavigate } from "react-router-dom";
import useUser from "../../../hooks/useUser";
import { selectUser as selectAuthUser } from "../../../store/slices/authSlice";
import ToastNotification, { useToast } from "../../ui/ToastNotification";

const PopularShops = () => {
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);

  // Toast notification hook
  const { toastRef, showToast } = useToast();

  // Redux state and actions from useUser hook
  const {
    stores,
    storesLoading,
    storesError,
    fetchAllStores,
    quickToggleWishlist,
    removeFromWishlist,
    isItemInShopWishlist,
    fetchWishlist,
  } = useUser();

  // Component state
  const [popularShops, setPopularShops] = useState([]);
  const [shopStats, setShopStats] = useState({
    totalStores: 0,
    totalCustomers: 0,
    averageRating: 0,
  });

  // Fetch stores data
  useEffect(() => {
    fetchAllStores(1, 20); 
  }, [fetchAllStores]);

  // Process and categorize stores
  useEffect(() => {
    if (stores && stores.length > 0) {
      const activeStores = stores.filter(
        (storeData) =>
          storeData.store?.status === "active" && !storeData.store?.isDiactivate
      );

      console.log(
        `Processing ${activeStores.length} active stores for PopularShops`
      );

      // Calculate shop stats
      const totalStores = activeStores.length;
      const totalSales = activeStores.reduce(
        (sum, storeData) => sum + parseInt(storeData.store?.totalSales || 0),
        0
      );
      const ratingsSum = activeStores.reduce(
        (sum, storeData) => sum + parseFloat(storeData.store?.rating || 0),
        0
      );
      const averageRating =
        totalStores > 0 ? (ratingsSum / totalStores).toFixed(1) : 0;

      setShopStats({
        totalStores: totalStores,
        totalCustomers: Math.max(totalSales * 15, 1000), 
        averageRating: averageRating,
      });

      // Score and rank stores for popularity
      const rankedStores = activeStores
        .map((storeData) => {
          const store = storeData.store;
          const seller = storeData.seller;

          const createdDate = new Date(store.createdAt);
          const daysSinceCreated = Math.floor(
            (new Date() - createdDate) / (1000 * 60 * 60 * 24)
          );

          let popularityScore = 0;

          // 1. RATING QUALITY (Most important for popularity)
          const rating = parseFloat(store.rating || 0);
          if (rating >= 4.5) popularityScore += 100;
          else if (rating >= 4.0) popularityScore += 80;
          else if (rating >= 3.5) popularityScore += 60;
          else if (rating >= 3.0) popularityScore += 40;
          else if (rating >= 2.0) popularityScore += 20;
          else popularityScore += 10;

          // 2. SALES PERFORMANCE
          const totalSales = parseInt(store.totalSales || 0);
          if (totalSales >= 100) popularityScore += 80;
          else if (totalSales >= 50) popularityScore += 60;
          else if (totalSales >= 20) popularityScore += 40;
          else if (totalSales >= 5) popularityScore += 25;
          else if (totalSales >= 1) popularityScore += 15;
          else popularityScore += 5;
          // 3. PRODUCT CATALOG SIZE
          const totalProducts = parseInt(store.totalProducts || 0);
          if (totalProducts >= 50) popularityScore += 50;
          else if (totalProducts >= 25) popularityScore += 40;
          else if (totalProducts >= 15) popularityScore += 30;
          else if (totalProducts >= 10) popularityScore += 20;
          else if (totalProducts >= 5) popularityScore += 15;
          else popularityScore += 5;

          // 4. STORE ESTABLISHMENT 
          if (daysSinceCreated >= 30 && daysSinceCreated <= 365)
            popularityScore += 30;
          else if (daysSinceCreated >= 14) popularityScore += 20;
          else if (daysSinceCreated >= 7) popularityScore += 15;
          else popularityScore += 10; 

          // 5. BUSINESS PROFESSIONALISM
          const businessType =
            seller?.businessInfo?.businessType?.toLowerCase();
          const hasBusinessName = seller?.businessInfo?.businessName;
          const hasWebsite = seller?.businessInfo?.website;
          const hasCompleteContact =
            store.contactDetails?.storeEmail &&
            store.contactDetails?.storeContactNumber;
          const hasMedia =
            store.shopMedia?.storeLogo || store.shopMedia?.bannerImage;

          if (businessType && businessType !== "individual")
            popularityScore += 15;
          if (hasBusinessName) popularityScore += 10;
          if (hasWebsite) popularityScore += 10;
          if (hasCompleteContact) popularityScore += 15;
          if (hasMedia) popularityScore += 10;
          if (store.basicInformation?.storeDescription) popularityScore += 5;

          return {
            ...storeData,
            popularityScore,
            daysSinceCreated,
          };
        })
        .sort((a, b) => b.popularityScore - a.popularityScore)
        .slice(0, 6); // Top 6 popular stores

      setPopularShops(rankedStores);

      console.log(
        "Top Popular Stores:",
        rankedStores.map((s) => ({
          name: s.store.basicInformation?.storeName,
          score: s.popularityScore,
          rating: s.store.rating,
          sales: s.store.totalSales,
          products: s.store.totalProducts,
        }))
      );
    }
  }, [stores]);

  const handleToggleFavorite = async (e, storeData) => {
    e.stopPropagation();

    if (!authUser) {
      navigate("/login");
      return;
    }

    try {
      const storeName = storeData.store.basicInformation?.storeName || "Store";
      const storeId = storeData.store._id;
      const wasInWishlist = isItemInShopWishlist(storeId);

      if (wasInWishlist) {
        await removeFromWishlist(authUser._id, storeId);
        showToast.success(`"${storeName}" removed from wishlist`);
      } else {
        await quickToggleWishlist(authUser._id, storeId, "shop");
        showToast.success(`"${storeName}" added to wishlist!`, {
          text: "View Wishlist",
          action: () => navigate("/wishlist"),
        });
      }

      await fetchWishlist(authUser._id);
    } catch (error) {
      console.error("Error toggling shop wishlist:", error);
      showToast.error("Failed to update wishlist. Please try again.");
    }
  };

  const handleVisitShop = (storeData) => {
    // Navigate to shop detail page or shop listings
    navigate(`/shop/${storeData.store._id}`);
  };

  const getBadgeVariant = (store, seller) => {
    const rating = parseFloat(store.rating || 0);
    const totalSales = parseInt(store.totalSales || 0);
    const totalProducts = parseInt(store.totalProducts || 0);
    const businessType = seller?.businessInfo?.businessType?.toLowerCase();

    if (rating >= 4.8 && totalSales >= 50) return "primary"; // Premium Partner
    if (rating >= 4.5) return "success"; // Top Rated
    if (totalProducts >= 30) return "info"; // Product Champion
    if (businessType && businessType !== "individual") return "warning"; // Business
    return "default"; // New Store
  };

  const getBadgeText = (store, seller) => {
    const rating = parseFloat(store.rating || 0);
    const totalSales = parseInt(store.totalSales || 0);
    const totalProducts = parseInt(store.totalProducts || 0);
    const businessType = seller?.businessInfo?.businessType?.toLowerCase();

    if (rating >= 4.8 && totalSales >= 50) return "Premium Partner";
    if (rating >= 4.5) return "Top Rated";
    if (totalProducts >= 30) return "Product Champion";
    if (businessType && businessType !== "individual") return "Business";
    return "New Store";
  };


  const getSpecialOffer = (store) => {
    const rating = parseFloat(store.rating || 0);
    const hasWebsite = store.contactDetails?.storeWebsite;

    const offers = [
      "Free shipping on orders over LKR 2000",
      "10% off for new customers",
      "Buy 2 Get 1 Free on selected items",
      "Free consultation available",
      "Same day delivery in Colombo",
      "Quality guarantee on all products",
    ];

    // Choose offer based on store characteristics
    if (hasWebsite) return "Visit our website for exclusive deals";
    if (rating >= 4.5) return "Satisfaction guaranteed or money back";

    // Random but consistent offer based on store ID
    const storeIdHash = store._id.slice(-1);
    const offerIndex = parseInt(storeIdHash, 16) % offers.length;
    return offers[offerIndex];
  };

  const getCategoryFromBusinessType = (seller) => {
    const businessType = seller?.businessInfo?.businessType?.toLowerCase();
    const businessName =
      seller?.businessInfo?.businessName?.toLowerCase() || "";

    if (businessName.includes("tech") || businessName.includes("electronic"))
      return "Electronics";
    if (businessName.includes("fashion") || businessName.includes("style"))
      return "Fashion";
    if (businessName.includes("food") || businessName.includes("restaurant"))
      return "Food & Beverage";
    if (businessName.includes("home") || businessName.includes("furniture"))
      return "Home & Decor";
    if (businessName.includes("book") || businessName.includes("media"))
      return "Books & Media";
    if (businessName.includes("fit") || businessName.includes("sport"))
      return "Sports & Fitness";

    // Default based on business type
    if (businessType === "retail") return "General Store";
    if (businessType === "llc" || businessType === "corporation")
      return "Business";
    return "General Store";
  };

  return (
    <section className="py-16 bg-white">
      <ToastNotification ref={toastRef} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl mb-6">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Popular Shops
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our most loved shops, trusted by customers for their quality
            products and exceptional service.
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {shopStats.totalStores}+
            </h3>
            <p className="text-gray-600">Active Shops</p>
          </Card>

          <Card className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-xl mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {shopStats.averageRating}/5
            </h3>
            <p className="text-gray-600">Average Rating</p>
          </Card>
        </div>

        {/* Loading/Error States */}
        {storesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
            <span className="text-gray-600">Loading popular shops...</span>
          </div>
        ) : storesError ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">
              Error loading shops: {storesError}
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : popularShops.length > 0 ? (
          /* Popular Shops Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {popularShops.map((storeData) => {
              const store = storeData.store;
              const seller = storeData.seller;
              const rating = parseFloat(store.rating || 0);
              const totalProducts = parseInt(store.totalProducts || 0);
              const totalSales = parseInt(store.totalSales || 0);
              const isFavorite = authUser
                ? isItemInShopWishlist(store._id)
                : false;

              return (
                <Card
                  key={store._id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                  padding={false}
                  onClick={() => handleVisitShop(storeData)}
                >
                  {/* Shop Cover Image */}
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={
                        store.shopMedia?.bannerImage ||
                        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop"
                      }
                      alt={store.basicInformation?.storeName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/placehold.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge variant={getBadgeVariant(store, seller)}>
                        {getBadgeText(store, seller)}
                      </Badge>
                    </div>

                    {/* Wishlist and Verified Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      {/* Verified Badge */}
                      <div className="flex items-center bg-white/90 rounded-full px-2 py-1">
                        <Verified className="h-3 w-3 text-blue-600 mr-1" />
                        <span className="text-xs font-medium text-gray-900">
                          Verified
                        </span>
                      </div>

                      {/* Wishlist Heart */}
                      <button
                        onClick={(e) => handleToggleFavorite(e, storeData)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 touch-manipulation shadow-lg backdrop-blur-sm ${
                          isFavorite
                            ? "bg-red-500 text-white scale-110"
                            : "bg-white/95 text-gray-600 hover:text-red-500 hover:bg-white hover:scale-105"
                        }`}
                        title={
                          isFavorite
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        <Heart
                          className={`h-4 w-4 transition-all duration-200 ${
                            isFavorite ? "fill-current scale-110" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Shop Info */}
                  <div className="p-6">
                    {/* Logo and Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative -mt-8">
                        <img
                          src={
                            store.shopMedia?.storeLogo ||
                            "https://images.unsplash.com/photo-1611077518981-8f02a0c20acc?w=80&h=80&fit=crop"
                          }
                          alt={`${store.basicInformation?.storeName} logo`}
                          className="w-16 h-16 rounded-xl border-4 border-white shadow-lg object-cover"
                          onError={(e) => {
                            e.target.src = "/placehold.png";
                          }}
                        />
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {store.basicInformation?.storeName || "Shop Name"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {getCategoryFromBusinessType(seller)}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {store.basicInformation?.storeDescription ||
                        "Quality products and excellent customer service."}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-semibold text-gray-900">
                            {rating > 0 ? rating.toFixed(1) : "New"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {totalSales > 0
                            ? `${totalSales} sales`
                            : "No sales yet"}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900 mb-1">
                          {totalProducts}
                        </div>
                        <p className="text-xs text-gray-500">Products</p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                      {store.contactDetails?.storeLocation && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">
                            {store.contactDetails.storeLocation}
                          </span>
                        </div>
                      )}
                      {store.contactDetails?.storeContactNumber && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>Contact</span>
                        </div>
                      )}
                      {store.contactDetails?.storeWebsite && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          <span>Website</span>
                        </div>
                      )}
                    </div>

                    {/* Special Offer */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-blue-800">
                        🎁 {getSpecialOffer(store)}
                      </p>
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full group-hover:bg-blue-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVisitShop(storeData);
                      }}
                    >
                      Visit Shop
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              No shops available at the moment
            </p>
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularShops;
