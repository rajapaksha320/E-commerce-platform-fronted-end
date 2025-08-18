/* eslint-disable no-unused-vars */
import React, { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Heart,
  Star,
  ShoppingCart,
  Share2,
  X,
  Package,
  Store,
  ArrowRight,
  Filter,
  Grid3X3,
  List,
  MapPin,
  Users,
  BadgeCheck,
  Trash2,
  ShoppingBag,
  Eye,
  Menu,
  ChevronDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Bell,
} from "lucide-react";

import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";
import useUser from "../../hooks/useUser";
import { selectUser as selectAuthUser } from "../../store/slices/authSlice";
import Pagination from "../../components/ui/Pagination";
import ToastNotification, {
  useToast,
} from "../../components/ui/ToastNotification";

const WishList = () => {
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);

  // Toast notification hook
  const { toastRef, showToast } = useToast();

  // User hook for wishlist management
  const {
    wishlist,
    wishlistLoading,
    wishlistError,
    fetchWishlist,
    removeFromWishlist,
    addItemToCart,
    cartItems,
    fetchCartItems,
    isItemInCart,
    clearErrors,
  } = useUser();

  // UI States
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  // Cart operation states
  const [addingToCart, setAddingToCart] = useState(new Set());

  // Pagination states
  const [productsPage, setProductsPage] = useState(1);
  const [shopsPage, setShopsPage] = useState(1);
  const productsPerPage = 8;
  const shopsPerPage = 6;

  // Fetch wishlist and cart on component mount
  useEffect(() => {
    if (authUser?._id) {
      fetchWishlist(authUser._id);
      fetchCartItems(authUser._id, 1, 100); // Fetch all cart items for checking
    }
  }, [authUser, fetchWishlist, fetchCartItems]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  // Extract data from wishlist
  const productWishlists = wishlist?.productWishlists || [];
  const shopWishlists = wishlist?.shopWishlists || [];

  // Flatten wishlist items and enhance with extracted data
  const products = productWishlists.flatMap((list) =>
    (list.items || []).map((product) => {
      // Extract product name from image alt text or use category
      const extractProductName = () => {
        if (product.images && product.images.length > 0) {
          const primaryImage =
            product.images.find((img) => img.isPrimary) || product.images[0];
          if (primaryImage && primaryImage.alt) {
            // Extract product name from alt text (remove "- Main Product Image" etc.)
            const cleanName = primaryImage.alt
              .replace(
                /\s*-\s*(Main Product Image|Product Image|Image|Back View Detail|Front View|Detail).*$/i,
                ""
              )
              .replace(/\s*Collection.*$/i, "")
              .trim();
            if (cleanName) return cleanName;
          }
        }

        // Fallback to category information
        if (product.category) {
          const categoryName = product.category.sub || product.category.main;
          return categoryName ? `${categoryName} Item` : "Product";
        }

        return "Product";
      };

      // Extract brand from product name or use category
      const extractBrand = () => {
        if (product.images && product.images.length > 0) {
          const primaryImage =
            product.images.find((img) => img.isPrimary) || product.images[0];
          if (primaryImage && primaryImage.alt) {
            const alt = primaryImage.alt;
            // Try to extract brand from alt text
            if (alt.toLowerCase().includes("premium")) return "Premium";
            if (alt.toLowerCase().includes("cotton")) return "Cotton";
          }
        }

        // Use category main as brand fallback
        if (product.category && product.category.main) {
          const categoryMain = product.category.main;
          return categoryMain.charAt(0).toUpperCase() + categoryMain.slice(1);
        }

        return "Generic";
      };

      // Generate a price based on category (for display purposes)
      const generatePrice = () => {
        if (!product.category) return "99";

        const categoryPrices = {
          fashion: ["2500", "3500", "4500", "5500"],
          electronics: ["15000", "25000", "35000", "45000"],
          home: ["5000", "8000", "12000", "18000"],
          jewelry: ["8000", "15000", "25000", "40000"],
        };

        const prices = categoryPrices[product.category.main] || [
          "1500",
          "2500",
          "3500",
          "4500",
        ];
        // Use product ID to consistently select the same price
        const index = parseInt(product._id.slice(-1), 16) % prices.length;
        return prices[index];
      };

      // Generate rating based on product ID (for consistency)
      const generateRating = () => {
        const lastChar = product._id.slice(-1);
        const num = parseInt(lastChar, 16) || 0;
        return (num % 5) + 1; // Rating between 1-5
      };

      return {
        ...product,
        // Enhanced extracted data
        title: extractProductName(),
        brand: extractBrand(),
        name: extractProductName(),
        productName: extractProductName(),
        brandName: extractBrand(),

        // Generated data for display (since API doesn't provide actual values)
        variations: [
          {
            price: generatePrice(),
            originalPrice: (parseInt(generatePrice()) + 500).toString(),
            quantity: product.status === "outOfStock" ? 0 : 10,
          },
        ],
        averageRating: generateRating(),
        totalReviews: (parseInt(product._id.slice(-2), 16) % 50) + 5,

        // Clean up status
        status: product.status || "active",
      };
    })
  );

  const shops = shopWishlists.flatMap((list) => list.items || []);

  // Get unique categories
  const categories = [
    "all",
    ...new Set([...products.map((p) => p.category?.main || "Uncategorized")]),
  ];

  // Filter items based on selected category
  const getFilteredItems = () => {
    let filteredProducts = products;
    let filteredShops = shops;

    if (selectedCategory !== "all") {
      filteredProducts = products.filter(
        (p) => p.category?.main === selectedCategory
      );
      filteredShops = shops.filter(
        (s) => s.categories?.includes(selectedCategory) || false
      );
    }

    return { products: filteredProducts, shops: filteredShops };
  };

  const { products: filteredProducts, shops: filteredShops } =
    getFilteredItems();

  // Define tabs
  const tabs = [
    {
      id: "all",
      name: "All",
      fullName: "All Items",
      count: filteredProducts.length + filteredShops.length,
    },
    {
      id: "products",
      name: "Products",
      fullName: "Products",
      count: filteredProducts.length,
    },
    {
      id: "shops",
      name: "Shops",
      fullName: "Shops",
      count: filteredShops.length,
    },
  ];

  // Pagination calculations
  const totalProductPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );
  const totalShopPages = Math.ceil(filteredShops.length / shopsPerPage);

  // Get paginated data
  const getPaginatedProducts = () => {
    const startIndex = (productsPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  };

  const getPaginatedShops = () => {
    const startIndex = (shopsPage - 1) * shopsPerPage;
    return filteredShops.slice(startIndex, startIndex + shopsPerPage);
  };

  const getItemsToShow = () => {
    const paginatedProducts = getPaginatedProducts();
    const paginatedShops = getPaginatedShops();

    switch (activeTab) {
      case "products":
        return { products: paginatedProducts, shops: [] };
      case "shops":
        return { products: [], shops: paginatedShops };
      default:
        return { products: paginatedProducts, shops: paginatedShops };
    }
  };

  const { products: displayProducts, shops: displayShops } = getItemsToShow();
  const isEmpty = displayProducts.length === 0 && displayShops.length === 0;

  // Reset pagination when filters change
  useEffect(() => {
    setProductsPage(1);
    setShopsPage(1);
  }, [selectedCategory, activeTab]);

  // Handle remove from wishlist
  const handleRemoveFromWishlist = async (type, itemId) => {
    if (!authUser?._id) return;

    try {
      await removeFromWishlist(authUser._id, itemId);
      showToast.success("Item removed from wishlist");
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      showToast.error("Failed to remove from wishlist. Please try again.");
    }
  };

  // Check if product is in cart
  const isProductInCart = (productId) => {
    return isItemInCart(productId);
  };

  // Handle add to cart
  const handleAddToCart = async (product) => {
    if (!authUser?._id) {
      navigate("/login");
      return;
    }

    // Check if already in cart
    if (isProductInCart(product._id)) {
      showToast.cart("Item is already in your cart", {
        text: "View Cart",
        action: () => navigate("/shopping-cart"),
      });
      return;
    }

    // Set loading state
    setAddingToCart((prev) => new Set(prev).add(product._id));

    try {
      await addItemToCart(authUser._id, product._id, 1).unwrap();

      // Refresh cart items to update status
      await fetchCartItems(authUser._id, 1, 100);

      showToast.success(`"${product.title}" added to cart successfully!`, {
        text: "View Cart",
        action: () => navigate("/shopping-cart"),
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      showToast.error("Failed to add to cart. Please try again.", {
        text: "Retry",
        action: () => handleAddToCart(product),
      });
    } finally {
      // Remove loading state
      setAddingToCart((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleViewShop = (shopId) => {
    navigate(`/shop/${shopId}`);
  };

  const handleShare = async (type, item) => {
    const baseUrl = window.location.origin;
    const url =
      type === "shop"
        ? `${baseUrl}/shop/${item._id}`
        : `${baseUrl}/product/${item._id}`;

    const title =
      type === "shop"
        ? `Check out ${
            item.basicInformation?.storeName || item.name || "this shop"
          }`
        : `Check out ${item.title}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          url: url,
        });
        showToast.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(url);
        showToast.success("Link copied to clipboard!");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        prompt("Copy this link to share:", url);
        showToast.info("Link ready to copy!");
      }
    }
  };

  const getBadgeVariant = (status) => {
    const variants = {
      active: "success",
      inactive: "secondary",
      outOfStock: "danger",
    };
    return variants[status] || "default";
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 sm:h-4 sm:w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  // Get cart button content
  const getCartButtonContent = (product) => {
    const productId = product._id;
    const isLoading = addingToCart.has(productId);
    const inCart = isProductInCart(productId);
    const isOutOfStock = product.status === "outOfStock";

    if (isLoading) {
      return {
        text: "Adding...",
        icon: <Loader2 className="h-3 w-3 mr-1 animate-spin" />,
        disabled: true,
        variant: "primary",
      };
    }

    if (inCart) {
      return {
        text: "In Cart",
       
        disabled: false,
        variant: "success",
      };
    }

    if (isOutOfStock) {
      return {
        text: "Notify",
        icon: <Bell className="h-3 w-3 mr-1" />,
        disabled: true,
        variant: "outline",
      };
    }

    return {
      text: "Add",
      icon: <ShoppingCart className="h-3 w-3 mr-1" />,
      disabled: false,
      variant: "primary",
    };
  };

  // Loading state
  if (wishlistLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (wishlistError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load wishlist
          </h3>
          <p className="text-gray-600 mb-4">{wishlistError}</p>
          <Button onClick={() => fetchWishlist(authUser._id)}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification Component */}
      <ToastNotification ref={toastRef} />

      {/* Share Success Message */}
      {shareMessage && (
        <div className="fixed top-4 right-4 z-40 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
          {shareMessage}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          {/* Main Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-red-500 mr-2 sm:mr-3 fill-current" />
                My Wishlist
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                <span className="block sm:inline">
                  {filteredProducts.length + filteredShops.length} items saved
                </span>
                {selectedCategory !== "all" && (
                  <span className="block sm:inline sm:ml-2 text-blue-600">
                    • Filtered by {selectedCategory}
                  </span>
                )}
              </p>
            </div>

            {/* View Mode Toggle - Desktop */}
            <div className="hidden lg:flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 sm:mt-6 border-b border-gray-200">
            <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span className="hidden sm:inline">{tab.fullName}</span>
                  <span className="sm:hidden">{tab.name}</span>
                  <span className="ml-1 sm:ml-2 bg-gray-100 text-gray-600 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Filters and Controls */}
          <div className="mt-3 sm:mt-4">
            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between lg:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Mobile View Mode Toggle */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 lg:hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  <Grid3X3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Filter Content */}
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } lg:block mt-3 lg:mt-0`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-600 hidden lg:block" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full sm:w-auto text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        {isEmpty ? (
          /* Empty State */
          <Card className="text-center py-8 sm:py-12">
            <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 mb-6 px-4">
              Start adding products and shops you love to see them here
            </p>
            <Button
              onClick={() => navigate("/")}
              className="inline-flex items-center"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Card>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Saved Shops */}
            {displayShops.length > 0 && (
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <Store className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                  Saved Shops ({displayShops.length})
                </h2>

                <div
                  className={`grid gap-3 sm:gap-4 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {displayShops.map((shop) => (
                    <Card
                      key={shop._id}
                      className="group hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative">
                        <img
                          src={
                            shop.shopMedia?.storeLogo ||
                            shop.shopMedia?.bannerImage ||
                            "/placehold.png"
                          }
                          alt={shop.basicInformation?.storeName || "Shop"}
                          className="w-full h-36 sm:h-48 object-cover rounded-lg mb-3 sm:mb-4"
                          onError={(e) => {
                            e.target.src = "/placehold.png";
                          }}
                        />
                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                          <Badge
                            variant={getBadgeVariant(shop.status)}
                            size="sm"
                          >
                            {shop.status || "Active"}
                          </Badge>
                        </div>
                        <button
                          onClick={() =>
                            handleRemoveFromWishlist("shops", shop._id)
                          }
                          className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-all group-hover:scale-110"
                        >
                          <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 hover:text-red-600" />
                        </button>
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                              {shop.basicInformation?.storeName || "Shop Name"}
                            </h3>
                            <BadgeCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                            {shop.basicInformation?.storeDescription ||
                              "Shop description"}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            {renderStars(shop.rating || 0)}
                            <span className="font-medium">
                              {shop.rating || 0}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600">
                          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span>
                            {shop.contactDetails?.storeLocation || "Location"}
                          </span>
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <Button
                            onClick={() => handleViewShop(shop._id)}
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs sm:text-sm"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden sm:inline">Visit Shop</span>
                            <span className="sm:hidden">Visit</span>
                          </Button>
                          <Button
                            onClick={() => handleShare("shop", shop)}
                            size="sm"
                            className="p-2"
                            title="Share shop"
                          >
                            <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Shops Pagination */}
                {filteredShops.length > shopsPerPage && (
                  <div className="mt-4 sm:mt-6">
                    <Pagination
                      currentPage={shopsPage}
                      totalPages={totalShopPages}
                      onPageChange={setShopsPage}
                      itemsPerPage={shopsPerPage}
                      totalItems={filteredShops.length}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Saved Products */}
            {displayProducts.length > 0 && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
                    Saved Products ({filteredProducts.length})
                  </h2>
                  {filteredProducts.length > productsPerPage && (
                    <p className="text-xs sm:text-sm text-gray-600">
                      Showing {(productsPage - 1) * productsPerPage + 1}-
                      {Math.min(
                        productsPage * productsPerPage,
                        filteredProducts.length
                      )}{" "}
                      of {filteredProducts.length}
                    </p>
                  )}
                </div>

                <div
                  className={`grid gap-3 sm:gap-4 ${
                    viewMode === "grid"
                      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-1"
                  }`}
                >
                  {displayProducts.map((product) => {
                    const cartButton = getCartButtonContent(product);

                    return (
                      <Card
                        key={product._id}
                        className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${
                          viewMode === "list"
                            ? "lg:flex lg:items-start lg:space-x-4"
                            : "h-full flex flex-col"
                        }`}
                      >
                        <div
                          className={`relative ${
                            viewMode === "list"
                              ? "lg:w-48 lg:flex-shrink-0"
                              : "w-full"
                          }`}
                        >
                          <img
                            src={
                              product.images?.find((img) => img.isPrimary)
                                ?.url ||
                              product.images?.[0]?.url ||
                              "/placehold.png"
                            }
                            alt={product.title}
                            className={`w-full object-cover rounded-lg ${
                              viewMode === "list"
                                ? "lg:h-32 lg:w-32 aspect-square"
                                : "aspect-square h-40 sm:h-48"
                            }`}
                            onError={(e) => {
                              e.target.src = "/placehold.png";
                            }}
                          />
                          <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2">
                            <Badge
                              variant={getBadgeVariant(product.status)}
                              size="sm"
                              className="text-xs"
                            >
                              {product.status === "inactive"
                                ? "Unavailable"
                                : product.status === "outOfStock"
                                ? "Out of Stock"
                                : "Available"}
                            </Badge>
                          </div>
                          <button
                            onClick={() =>
                              handleRemoveFromWishlist("products", product._id)
                            }
                            className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 p-1 sm:p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm transition-all group-hover:scale-110"
                          >
                            <X className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 hover:text-red-600" />
                          </button>
                          {product.status === "outOfStock" && (
                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                              <span className="text-white font-medium text-xs bg-red-600 px-2 py-1 rounded-full">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>

                        <div
                          className={`${
                            viewMode === "list" ? "lg:flex-1" : "flex-1"
                          } flex flex-col justify-between p-3 space-y-2`}
                        >
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-blue-600 font-medium mb-1">
                                {product.brand}
                              </p>
                              <h3 className="font-medium text-gray-900 text-xs sm:text-sm line-clamp-2 leading-tight">
                                {product.title}
                              </h3>
                            </div>

                            <div className="flex items-center space-x-1">
                              {renderStars(product.averageRating)}
                              <span className="text-xs text-gray-600">
                                ({product.averageRating})
                              </span>
                            </div>

                            <div className="flex items-baseline space-x-1 sm:space-x-2">
                              <span className="font-bold text-gray-900 text-sm sm:text-base">
                                LKR {product.variations?.[0]?.price}
                              </span>
                              {product.variations?.[0]?.originalPrice &&
                                product.variations[0].originalPrice !==
                                  product.variations[0].price && (
                                  <span className="text-xs sm:text-sm text-gray-500 line-through">
                                    LKR {product.variations[0].originalPrice}
                                  </span>
                                )}
                            </div>
                          </div>

                          <div className="flex space-x-1.5 sm:space-x-2 pt-2 mt-auto">
                            <Button
                              onClick={() => handleViewProduct(product._id)}
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs py-1.5"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              onClick={() => handleAddToCart(product)}
                              size="sm"
                              variant={cartButton.variant}
                              className={`flex-1 text-xs py-1.5 ${
                                cartButton.variant === "success"
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : ""
                              }`}
                              disabled={cartButton.disabled}
                            >
                              {cartButton.icon}
                              {cartButton.text}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {/* Products Pagination */}
                {filteredProducts.length > productsPerPage && (
                  <div className="mt-4 sm:mt-6">
                    <Pagination
                      currentPage={productsPage}
                      totalPages={totalProductPages}
                      onPageChange={setProductsPage}
                      itemsPerPage={productsPerPage}
                      totalItems={filteredProducts.length}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;
