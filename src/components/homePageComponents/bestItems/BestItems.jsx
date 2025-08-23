import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Star,
  ShoppingCart,
  Heart,
  Eye,
  TrendingUp,
  Award,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Card, Button, Badge } from "../../ui";
import { useNavigate } from "react-router-dom";
import useUser from "../../../hooks/useUser";
import { selectUser as selectAuthUser } from "../../../store/slices/authSlice";
import ToastNotification, { useToast } from "../../ui/ToastNotification";

const BestItems = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);

  // Toast notification hook
  const { toastRef, showToast } = useToast();

  // Redux state and actions from useUser hook
  const {
    stores,
    storesLoading,
    storesError,
    searchResults,
    searchLoading,
    searchError,
    fetchAllStores,
    searchAllProducts,
    addItemToCart,
    quickToggleWishlist,
    removeFromWishlist,
    isItemInProductWishlist,
    isItemInCart,
    fetchCartItems,
    fetchWishlist,
  } = useUser();

  // Component state
  const [addingToCart, setAddingToCart] = useState(new Set());
  const [products, setProducts] = useState({
    trending: [],
    bestseller: [],
  });
  const [storeCategories, setStoreCategories] = useState({
    trending: [],
    bestselling: [],
  });

  // Fetch stores data first
  useEffect(() => {
    fetchAllStores(1, 50); 
  }, [fetchAllStores]);

  // Fetch products data
  useEffect(() => {
    searchAllProducts(
      {
        categoryMain: "",
        PriceRange: "",
        CustomerRating: 0,
        color: "",
        brandName: "",
        title: "",
      },
      1,
      60 
    );
  }, [searchAllProducts]);

  // Categorize stores into trending vs bestselling
  useEffect(() => {
    if (stores && stores.length > 0) {
      const activeStores = stores.filter(
        (storeData) =>
          storeData.store?.status === "active" && !storeData.store?.isDiactivate
      );

      console.log(`Processing ${activeStores.length} active stores`);

      // TRENDING STORES 
      const trendingStores = [...activeStores]
        .map((storeData) => {
          const store = storeData.store;
          const seller = storeData.seller;

          const createdDate = new Date(store.createdAt);
          const daysSinceCreated = Math.floor(
            (new Date() - createdDate) / (1000 * 60 * 60 * 24)
          );

          let trendingScore = 0;

          // 1. STORE NEWNESS (Newer = More Trendy)
          if (daysSinceCreated <= 30) trendingScore += 100;
          else if (daysSinceCreated <= 90) trendingScore += 70; 
          else if (daysSinceCreated <= 180) trendingScore += 40;

          // 2. GROWING POTENTIAL 
          const rating = parseFloat(store.rating || 0);
          const totalSales = parseInt(store.totalSales || 0);
          const totalProducts = parseInt(store.totalProducts || 0);

          // New stores with good ratings are trending
          if (daysSinceCreated <= 90 && rating >= 3.5) trendingScore += 60;
          else if (rating >= 4.0) trendingScore += 40;
          else if (rating >= 3.0) trendingScore += 20;

          // 3. PRODUCT VARIETY 
          if (totalProducts >= 20) trendingScore += 30;
          else if (totalProducts >= 10) trendingScore += 20;
          else if (totalProducts >= 5) trendingScore += 10;

          // 4. MODERATE SALES
          if (totalSales > 0 && totalSales <= 50) trendingScore += 40;
          else if (totalSales > 50 && totalSales <= 100) trendingScore += 25;
          else if (totalSales > 100) trendingScore += 10; // High sales go to bestsellers

          // 5. BUSINESS TYPE BONUS 
          const businessType =
            seller?.businessInfo?.businessType?.toLowerCase();
          if (businessType === "retail" || businessType === "individual") {
            trendingScore += 15;
          }

          console.log(
            `Trending Store - ${store.basicInformation?.storeName}: Score ${trendingScore} (Days: ${daysSinceCreated}, Sales: ${totalSales}, Rating: ${rating})`
          );

          return { ...storeData, trendingScore, daysSinceCreated };
        })
        .sort((a, b) => b.trendingScore - a.trendingScore)
        .slice(0, 8); 
      // BESTSELLING STORES - Adapted for low/no sales scenario
      const bestsellingStores = [...activeStores]
        .map((storeData) => {
          const store = storeData.store;
          const seller = storeData.seller;

          const createdDate = new Date(store.createdAt);
          const daysSinceCreated = Math.floor(
            (new Date() - createdDate) / (1000 * 60 * 60 * 24)
          );

          let bestSellerScore = 0;

          // 1. ESTABLISHMENT FACTOR 
          if (daysSinceCreated >= 90) bestSellerScore += 50;
          else if (daysSinceCreated >= 30) bestSellerScore += 35; 
          else if (daysSinceCreated >= 14) bestSellerScore += 25; 
          else if (daysSinceCreated >= 7) bestSellerScore += 15; 

          // 2. SALES PERFORMANCE 
          const totalSales = parseInt(store.totalSales || 0);
          if (totalSales >= 50) bestSellerScore += 100; 
          else if (totalSales >= 20) bestSellerScore += 80;
          else if (totalSales >= 10) bestSellerScore += 60;
          else if (totalSales >= 5) bestSellerScore += 40;
          else if (totalSales >= 1) bestSellerScore += 25; 
          else bestSellerScore += 5;

          // 3. RATING QUALITY
          const rating = parseFloat(store.rating || 0);
          if (rating >= 4.5) bestSellerScore += 70;
          else if (rating >= 4.0) bestSellerScore += 55;
          else if (rating >= 3.5) bestSellerScore += 40;
          else if (rating >= 3.0) bestSellerScore += 25;
          else if (rating >= 2.0) bestSellerScore += 10;
          else bestSellerScore += 5; 

          // 4. PRODUCT READINESS 
          const totalProducts = parseInt(store.totalProducts || 0);
          if (totalProducts >= 20) bestSellerScore += 30;
          else if (totalProducts >= 10) bestSellerScore += 25;
          else if (totalProducts >= 5) bestSellerScore += 20;
          else if (totalProducts >= 1) bestSellerScore += 15;
          else bestSellerScore += 5;

          // 5. STORE COMPLETENESS
          const businessType =
            seller?.businessInfo?.businessType?.toLowerCase();
          const hasBusinessName = seller?.businessInfo?.businessName;
          const hasWebsite = seller?.businessInfo?.website;
          const hasCompleteContact =
            store.contactDetails?.storeEmail &&
            store.contactDetails?.storeContactNumber;

          if (businessType && businessType !== "individual")
            bestSellerScore += 10;
          if (hasBusinessName) bestSellerScore += 10;
          if (hasWebsite) bestSellerScore += 5;
          if (hasCompleteContact) bestSellerScore += 10;

          // 6. STORE BRANDING 
          if (store.shopMedia?.storeLogo) bestSellerScore += 10;
          if (store.shopMedia?.bannerImage) bestSellerScore += 5;
          if (store.basicInformation?.storeDescription) bestSellerScore += 5;

          console.log(
            `Bestselling Store - ${store.basicInformation?.storeName}: Score ${bestSellerScore} (Days: ${daysSinceCreated}, Sales: ${totalSales}, Rating: ${rating})`
          );

          return { ...storeData, bestSellerScore, daysSinceCreated };
        })
        .sort((a, b) => b.bestSellerScore - a.bestSellerScore)
        .slice(0, 8); 

      setStoreCategories({
        trending: trendingStores,
        bestselling: bestsellingStores,
      });

      console.log(
        "Top Trending Stores:",
        trendingStores.slice(0, 4).map((s) => ({
          name: s.store.basicInformation?.storeName,
          score: s.trendingScore,
          days: s.daysSinceCreated,
          sales: s.store.totalSales,
          rating: s.store.rating,
        }))
      );

      console.log(
        "Top Bestselling Stores:",
        bestsellingStores.slice(0, 4).map((s) => ({
          name: s.store.basicInformation?.storeName,
          score: s.bestSellerScore,
          days: s.daysSinceCreated,
          sales: s.store.totalSales,
          rating: s.store.rating,
        }))
      );
    }
  }, [stores]);

  // Process products based on store categories
  useEffect(() => {
    if (
      searchResults &&
      searchResults.length > 0 &&
      storeCategories.trending.length > 0
    ) {
      const activeProducts = searchResults.filter(
        (product) =>
          product.status === "active" && product.variations?.length > 0
      );

      // Get seller IDs for each category
      const trendingSellerIds = new Set(
        storeCategories.trending.map((storeData) => storeData.store.sellerId)
      );
      const bestsellingSellerIds = new Set(
        storeCategories.bestselling.map((storeData) => storeData.store.sellerId)
      );

      // TRENDING PRODUCTS - From trending stores + product-specific factors
      const trendingProducts = activeProducts
        .filter((product) => {
          // Prefer products from trending stores
          const isFromTrendingStore = trendingSellerIds.has(product.sellerId);
          const isFromBestsellingStore = bestsellingSellerIds.has(
            product.sellerId
          );

          // Include products from trending stores OR new products from any store
          const productAge = Math.floor(
            (new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24)
          );
          return (
            isFromTrendingStore || (productAge <= 60 && !isFromBestsellingStore)
          );
        })
        .map((product) => {
          const variation =
            product.variations.find((v) => v.isDefault) ||
            product.variations[0];
          const rating = parseFloat(product.averageRating || 0);
          const price = parseFloat(variation?.price || 0);
          const daysSinceCreated = Math.floor(
            (new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24)
          );
          const discount = getDiscountPercentage(variation);

          let trendingScore = 0;

          // Bonus for being from trending store
          if (trendingSellerIds.has(product.sellerId)) {
            trendingScore += 50;
          }

          // Product recency
          if (daysSinceCreated <= 14) trendingScore += 60;
          else if (daysSinceCreated <= 30) trendingScore += 40;
          else if (daysSinceCreated <= 60) trendingScore += 20;

          // Discount appeal
          if (discount >= 20) trendingScore += 40;
          else if (discount >= 10) trendingScore += 25;

          // Rating (but not as important as for bestsellers)
          trendingScore += rating * 8;

          // Price point
          if (price >= 100) trendingScore += 15;

          return { ...product, trendingScore };
        })
        .sort((a, b) => b.trendingScore - a.trendingScore)
        .slice(0, 6);

      // BESTSELLING PRODUCTS - More inclusive filtering for low-sales environment
      const bestsellingProducts = activeProducts
        .filter((product) => {
          // More inclusive criteria for bestselling products
          const isFromBestsellingStore = bestsellingSellerIds.has(
            product.sellerId
          );
          const isFromTrendingStore = trendingSellerIds.has(product.sellerId);

          const productAge = Math.floor(
            (new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24)
          );
          const rating = parseFloat(product.averageRating || 0);

          // Include products from bestselling stores
          if (isFromBestsellingStore) return true;

          // Include well-established products with good ratings (not from trending stores)
          if (productAge >= 14 && rating >= 3.5 && !isFromTrendingStore)
            return true;

          // Include any product with excellent rating (regardless of age)
          if (rating >= 4.5) return true;

          // Include older products with any rating (established products)
          if (productAge >= 60 && rating >= 0) return true;

          // Fallback: if very few products match above, include some random products
          return false;
        })
        .map((product) => {
          const variation =
            product.variations.find((v) => v.isDefault) ||
            product.variations[0];
          const rating = parseFloat(product.averageRating || 0);
          const daysSinceCreated = Math.floor(
            (new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24)
          );
          const discount = getDiscountPercentage(variation);

          let bestSellerScore = 0;

          // Major bonus for being from a top-rated bestselling store
          if (bestsellingSellerIds.has(product.sellerId)) {
            const storeData = storeCategories.bestselling.find(
              (s) => s.store.sellerId === product.sellerId
            );
            const storeScore = storeData?.bestSellerScore || 0;
            bestSellerScore += Math.min(60, storeScore * 0.3); // Scale store score
          }

          // Product establishment (more flexible)
          if (daysSinceCreated >= 60) bestSellerScore += 40;
          else if (daysSinceCreated >= 30) bestSellerScore += 30;
          else if (daysSinceCreated >= 14) bestSellerScore += 20;
          else if (daysSinceCreated >= 7) bestSellerScore += 10;
          else bestSellerScore += 5; // Even new products get baseline

          // Rating excellence (most important, more generous)
          if (rating >= 4.8) bestSellerScore += 100;
          else if (rating >= 4.5) bestSellerScore += 80;
          else if (rating >= 4.0) bestSellerScore += 60;
          else if (rating >= 3.5) bestSellerScore += 40;
          else if (rating >= 3.0) bestSellerScore += 25;
          else if (rating >= 2.0) bestSellerScore += 15;
          else bestSellerScore += 10; // Baseline for unrated

          // Has any rating (indicates engagement)
          if (rating > 0) bestSellerScore += 25;

          // Price stability (reasonable pricing)
          const price = parseFloat(variation?.price || 0);
          if (discount <= 5) bestSellerScore += 25; // Stable pricing
          else if (discount <= 15) bestSellerScore += 15; // Moderate discount
          else if (discount <= 30) bestSellerScore += 5; // Still acceptable

          // Price point attractiveness
          if (price >= 25 && price <= 500) bestSellerScore += 20; // Sweet spot
          else if (price >= 10 && price < 25)
            bestSellerScore += 15; // Affordable
          else if (price > 500) bestSellerScore += 10; // Premium (lower volume)

          // Stock availability
          const stock = parseInt(variation?.quantity || 0);
          if (stock >= 10) bestSellerScore += 15; // Good availability
          else if (stock >= 5) bestSellerScore += 10; // Adequate
          else if (stock >= 1) bestSellerScore += 5; // At least available

          // Brand recognition
          if (product.brand && product.brand.length > 0) {
            bestSellerScore += 10;
          }

          return { ...product, bestSellerScore };
        })
        .sort((a, b) => b.bestSellerScore - a.bestSellerScore);

      // Ensure we have at least some bestselling products
      let finalBestsellingProducts = bestsellingProducts.slice(0, 6);

      // Fallback: if still no products, take any products not in trending
      if (finalBestsellingProducts.length === 0) {
        console.log("No bestselling products found, using fallback");
        const trendingProductIds = new Set(trendingProducts.map((p) => p._id));
        finalBestsellingProducts = activeProducts
          .filter((product) => !trendingProductIds.has(product._id))
          .sort((a, b) => {
            // Sort by rating first, then by age
            const ratingA = parseFloat(a.averageRating || 0);
            const ratingB = parseFloat(b.averageRating || 0);
            if (ratingB !== ratingA) return ratingB - ratingA;

            const ageA = Math.floor(
              (new Date() - new Date(a.createdAt)) / (1000 * 60 * 60 * 24)
            );
            const ageB = Math.floor(
              (new Date() - new Date(b.createdAt)) / (1000 * 60 * 60 * 24)
            );
            return ageB - ageA; // Older products first
          })
          .slice(0, 6);
      }

      setProducts({
        trending: trendingProducts.slice(0, 4),
        bestseller: finalBestsellingProducts.slice(0, 4),
      });

      console.log(
        "Final Trending Products:",
        trendingProducts.slice(0, 4).map((p) => ({
          title: p.title,
          score: p.trendingScore,
          sellerId: p.sellerId,
          rating: p.averageRating,
        }))
      );

      console.log(
        "Final Bestselling Products:",
        finalBestsellingProducts.slice(0, 4).map((p) => ({
          title: p.title,
          score: p.bestSellerScore || "fallback",
          sellerId: p.sellerId,
          rating: p.averageRating,
        }))
      );
    }
  }, [searchResults, storeCategories]);

  // Helper function to calculate discount percentage
  const getDiscountPercentage = (variation) => {
    if (!variation?.originalPrice || !variation?.price) return 0;

    const original = parseFloat(variation.originalPrice);
    const current = parseFloat(variation.price);

    if (original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  const tabs = [
    { id: "trending", name: "Trending", icon: TrendingUp },
    { id: "bestseller", name: "Best Sellers", icon: Award },
  ];

  const handleShowAllProducts = () => {
    navigate("/product-collections");
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();

    if (!authUser) {
      showToast.error("Please log in to add products to your cart!");
      return;
    }

    if (isItemInCart(product._id)) {
      showToast.success("Item is already in your cart", {
        text: "View Cart",
        action: () => navigate("/shopping-cart"),
      });
      return;
    }

    setAddingToCart((prev) => new Set(prev).add(product._id));

    try {
      await addItemToCart(authUser._id, product._id, 1);
      await fetchCartItems(authUser._id, 1, 100);

      const productName = product.title || product.name || "Product";
      showToast.success(`"${productName}" added to cart successfully!`, {
        text: "View Cart",
        action: () => navigate("/shopping-cart"),
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast.error("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
    }
  };

  const handleToggleFavorite = async (e, product) => {
    e.stopPropagation();

    if (!authUser) {
      showToast.error("Please log in to add products to your wishlist!");
      return;
    }

    try {
      const productName = product.title || product.name || "Product";
      const productId = product._id;
      const wasInWishlist = isItemInProductWishlist(productId);

      if (wasInWishlist) {
        await removeFromWishlist(authUser._id, productId);
        showToast.success(`"${productName}" removed from wishlist`);
      } else {
        await quickToggleWishlist(authUser._id, productId, "product");
        showToast.success(`"${productName}" added to wishlist!`, {
          text: "View Wishlist",
          action: () => navigate("/wishlist"),
        });
      }

      await fetchWishlist(authUser._id);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      showToast.error("Failed to update wishlist. Please try again.");
    }
  };

  const getCartButtonContent = (product) => {
    const productId = product._id;
    const isLoadingThisItem = addingToCart.has(productId);
    const inCart = authUser ? isItemInCart(productId) : false;
    const isOutOfStock =
      product.status !== "active" ||
      parseInt(product.variations?.[0]?.quantity || 0) <= 0;

    if (isLoadingThisItem) {
      return {
        text: "Adding...",
        icon: <Loader2 className="h-4 w-4 mr-2 animate-spin" />,
        disabled: true,
        variant: "primary",
      };
    }

    if (inCart) {
      return {
        text: "Added to Cart",
        icon: <CheckCircle className="h-4 w-4 mr-2" />,
        disabled: false,
        variant: "success",
        onClick: () => navigate("/shopping-cart"),
      };
    }

    if (isOutOfStock) {
      return {
        text: "Out of Stock",
        icon: <ShoppingCart className="h-4 w-4 mr-2" />,
        disabled: true,
        variant: "outline",
      };
    }

    return {
      text: "Add to Cart",
      icon: <ShoppingCart className="h-4 w-4 mr-2" />,
      disabled: false,
      variant: "primary",
    };
  };

  const getBadgeVariant = (badge) => {
    const variants = {
      Hot: "danger",
      New: "success",
      Popular: "primary",
      Trending: "warning",
      Sale: "danger",
      "Best Seller": "success",
      "New Arrival": "primary",
      Established: "secondary",
      "Top Store": "primary",
    };
    return variants[badge] || "default";
  };

  const getProductBadge = (product) => {
    const variation = product.variations?.[0];
    const daysSinceCreated = Math.floor(
      (new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24)
    );
    const discount = getDiscountPercentage(variation);
    const rating = parseFloat(product.averageRating || 0);

    // Check if from special store category
    const isFromTrendingStore = storeCategories.trending.some(
      (storeData) => storeData.store.sellerId === product.sellerId
    );
    const isFromBestsellingStore = storeCategories.bestselling.some(
      (storeData) => storeData.store.sellerId === product.sellerId
    );

    // Priority order for badges
    if (discount >= 20) return "Sale";
    if (isFromTrendingStore && activeTab === "trending") return "Trending";
    if (isFromBestsellingStore && activeTab === "bestseller")
      return "Top Store";
    if (daysSinceCreated <= 7) return "New Arrival";
    if (rating >= 4.8) return activeTab === "trending" ? "Hot" : "Best Seller";
    if (rating >= 4.5) return "Popular";

    return null;
  };

  const currentProducts = products[activeTab] || [];
  const isLoading = storesLoading || searchLoading;
  const hasError = storesError || searchError;

  return (
    <section className="py-16 bg-gray-50">
      <ToastNotification ref={toastRef} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Best Items Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover trending products from up-and-coming stores and proven
            bestsellers from established merchants.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-2xl p-2 shadow-sm border border-gray-200">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
            <span className="text-gray-600">Loading best items...</span>
          </div>
        ) : hasError ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">
              Error loading products: {storesError || searchError}
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {currentProducts.map((product) => {
              const variation =
                product.variations?.find((v) => v.isDefault) ||
                product.variations?.[0];
              const price = parseFloat(variation?.price || 0);
              const originalPrice = parseFloat(variation?.originalPrice || 0);
              const badge = getProductBadge(product);
              const discount = getDiscountPercentage(variation);
              const rating = parseFloat(product.averageRating || 0);
              const isFavorite = authUser
                ? isItemInProductWishlist(product._id)
                : false;
              const cartButton = getCartButtonContent(product);

              return (
                <Card
                  key={product._id}
                  className="group overflow-hidden relative cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white"
                  padding={false}
                  onClick={() => handleProductClick(product)}
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={
                        variation?.images?.[0]?.url ||
                        product.images?.find((img) => img.isPrimary)?.url ||
                        product.images?.[0]?.url ||
                        "/placehold.png"
                      }
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/placehold.png";
                      }}
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 z-10">
                      {badge && (
                        <Badge
                          variant={getBadgeVariant(badge)}
                          className="shadow-md"
                        >
                          {badge}
                        </Badge>
                      )}
                    </div>

                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                          -{discount}%
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div
                      className={`absolute top-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 ${
                        discount > 0 ? "right-16" : "right-3"
                      }`}
                    >
                      <button
                        onClick={(e) => handleToggleFavorite(e, product)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 touch-manipulation shadow-lg backdrop-blur-sm ${
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product);
                        }}
                        className="w-9 h-9 bg-white/95 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 hover:bg-white hover:scale-105 transition-all duration-200 touch-manipulation shadow-lg backdrop-blur-sm"
                        title="Quick view"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Quick Features */}
                    <div className="absolute bottom-3 left-3 flex gap-1 z-10">
                      {product.shippingClass?.shippingClass === "free" && (
                        <Badge
                          variant="success"
                          size="sm"
                          className="shadow-md"
                        >
                          Free Ship
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Brand */}
                    {product.brand && (
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                        {product.brand}
                      </p>
                    )}

                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">
                        {rating > 0 ? rating.toFixed(1) : "No rating"}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            LKR {price.toFixed(2)}
                          </span>
                          {originalPrice > price && (
                            <span className="text-sm text-gray-500 line-through">
                              LKR {originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {discount > 0 && (
                          <Badge
                            variant="success"
                            size="sm"
                            className="mt-1 w-fit"
                          >
                            Save LKR {(originalPrice - price).toFixed(2)}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      variant={cartButton.variant}
                      size="sm"
                      className={`w-full touch-manipulation ${
                        cartButton.variant === "success"
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : ""
                      }`}
                      disabled={cartButton.disabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (cartButton.onClick) {
                          cartButton.onClick();
                        } else if (!cartButton.disabled) {
                          handleAddToCart(e, product);
                        }
                      }}
                    >
                      {cartButton.icon}
                      {cartButton.text}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              No products available in this category
            </p>
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Button size="lg" variant="outline" onClick={handleShowAllProducts}>
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BestItems;
