import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Heart, Eye, Package, Loader } from "lucide-react";
import { Button, Badge, ContactCard as Card } from "../../ui/ContactUis/Uis";
import useUser from "../../../hooks/useUser";
import { useSelector } from "react-redux";
import { selectUser as selectAuthUser } from "../../../store/slices/authSlice";

const ProductGrid = ({
  products,
  viewMode = "grid",
  isLoading = false,
  error = null,
  className = "",
  showActions = true,
}) => {
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);

  // Redux hooks
  const {
    addItemToCart,
    cartLoading,
    quickToggleWishlist,
    isItemInProductWishlist,
    isItemInCart,
  } = useUser();

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();

    if (!authUser) {
      navigate("/login");
      return;
    }

    try {
      await addItemToCart(authUser._id, product._id, 1);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleToggleFavorite = async (e, product) => {
    e.stopPropagation();

    if (!authUser) {
      navigate("/login");
      return;
    }

    try {
      await quickToggleWishlist(authUser._id, product._id, "product");
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const handleQuickView = (e, product) => {
    e.stopPropagation();
    navigate(`/product/${product._id}`);
  };

  const getBadgeVariant = (badge) => {
    const variants = {
      "Best Seller": "success",
      "New Arrival": "primary",
      Popular: "warning",
      Premium: "purple",
      Sale: "danger",
      Featured: "info",
      Hot: "danger",
      Trending: "warning",
    };
    return variants[badge] || "default";
  };

  const getProductBadge = (product) => {
    const variation = product.variations?.[0];
    if (variation?.originalPrice && variation?.price) {
      const original = parseFloat(variation.originalPrice);
      const current = parseFloat(variation.price);
      if (original > current) {
        return "Sale";
      }
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (new Date(product.createdAt) > thirtyDaysAgo) {
      return "New Arrival";
    }

    return null;
  };

  const getProductDiscount = (product) => {
    const variation = product.variations?.[0];
    if (variation?.originalPrice && variation?.price) {
      const original = parseFloat(variation.originalPrice);
      const current = parseFloat(variation.price);
      if (original > current) {
        return Math.round(((original - current) / original) * 100);
      }
    }
    return 0;
  };

  const isProductInStock = (product) => {
    const variation = product.variations?.[0];
    return (
      product.status === "active" && parseInt(variation?.quantity || 0) > 0
    );
  };

  const getStockCount = (product) => {
    const variation = product.variations?.[0];
    return parseInt(variation?.quantity || 0);
  };

  const renderProductCard = (product) => {
    const variation = product.variations?.[0];
    const price = parseFloat(variation?.price || 0);
    const originalPrice = parseFloat(variation?.originalPrice || 0);
    const badge = getProductBadge(product);
    const discount = getProductDiscount(product);
    const inStock = isProductInStock(product);
    const stockCount = getStockCount(product);
    const rating = parseFloat(product.averageRating || 0);
    const isFavorite = authUser ? isItemInProductWishlist(product._id) : false;
    const inCart = authUser ? isItemInCart(product._id) : false;

    // Get product images
    const productImage =
      variation?.images?.[0]?.url ||
      product.images?.[0]?.url ||
      "/placeholder-product.jpg";

    // Get product colors
    const colors = variation?.color || [];
    const sizes = variation?.sizes || [];

    return (
      <Card
        key={product._id}
        className={`group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full ${
          viewMode === "list" ? "flex flex-col md:flex-row" : "flex flex-col"
        }`}
        padding={false}
        onClick={() => handleProductClick(product)}
      >
        {/* Product Image */}
        <div
          className={`relative overflow-hidden ${
            viewMode === "list" ? "md:w-64 flex-shrink-0 h-64" : "h-64"
          }`}
        >
          <img
            src={productImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "/placeholder-product.jpg";
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {badge && (
              <Badge variant={getBadgeVariant(badge)} size="sm">
                {badge}
              </Badge>
            )}
            {!inStock && (
              <Badge variant="danger" size="sm">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 right-3">
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{discount}%
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {showActions && (
            <div className="absolute top-3 right-12 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => handleToggleFavorite(e, product)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors touch-manipulation ${
                  isFavorite
                    ? "bg-red-500 text-white"
                    : "bg-white/90 text-gray-600 hover:text-red-500"
                }`}
                title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                />
              </button>
              <button
                onClick={(e) => handleQuickView(e, product)}
                className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 transition-colors touch-manipulation"
                title="Quick view"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Quick Features */}
          <div className="absolute bottom-3 left-3 flex gap-1">
            {product.shippingClass?.shippingClass === "free" && (
              <Badge variant="success" size="sm">
                Free Ship
              </Badge>
            )}
            {stockCount > 0 && stockCount <= 5 && (
              <Badge variant="warning" size="sm">
                Low Stock
              </Badge>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
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

          {/* Product Description (List view only) */}
          {viewMode === "list" && product.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {rating > 0 ? rating.toFixed(1) : "No rating"}
            </span>
          </div>

          {/* Product Variants */}
          <div className="mb-3">
            {/* Colors */}
            {colors.length > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <span className="text-xs text-gray-500">Colors:</span>
                {colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                {colors.length > 4 && (
                  <span className="text-xs text-gray-500">
                    +{colors.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">Sizes:</span>
                <div className="flex gap-1">
                  {sizes.slice(0, 3).map((size, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 px-1.5 py-0.5 rounded"
                    >
                      {size.toUpperCase()}
                    </span>
                  ))}
                  {sizes.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{sizes.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Spacer to push price and button to bottom */}
          <div className="flex-1"></div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
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
              <Badge variant="success" size="sm">
                Save LKR {(originalPrice - price).toFixed(2)}
              </Badge>
            )}
          </div>

          {/* Stock Status */}
          {stockCount > 0 && stockCount <= 5 && (
            <div className="mb-4">
              <p className="text-orange-600 text-sm">
                Only {stockCount} left in stock!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {showActions && (
            <div
              className={`${viewMode === "list" ? "flex gap-3" : "space-y-2"}`}
            >
              <Button
                variant="primary"
                size="md"
                className={viewMode === "list" ? "flex-1" : "w-full"}
                disabled={!inStock || cartLoading}
                onClick={(e) => handleAddToCart(e, product)}
              >
                {cartLoading ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ShoppingCart className="h-4 w-4 mr-2" />
                )}
                {inCart
                  ? "Added to Cart"
                  : inStock
                  ? "Add to Cart"
                  : "Out of Stock"}
              </Button>

              {viewMode === "list" && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={(e) => handleQuickView(e, product)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Quick View
                </Button>
              )}
            </div>
          )}

          {/* Additional Info (List view only) */}
          {viewMode === "list" && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {product.category?.main && (
                  <span>Category: {product.category.main}</span>
                )}
                {variation?.sku && <span>SKU: {variation.sku}</span>}
                <span>Status: {inStock ? "In Stock" : "Out of Stock"}</span>
              </div>

              {/* Product Tags */}
              {product.productTags && product.productTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {product.productTags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                  {product.productTags.length > 3 && (
                    <Badge variant="secondary" size="sm">
                      +{product.productTags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <Loader className="h-8 w-8 animate-spin text-blue-600 mr-3" />
        <span className="text-gray-600">Loading products...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Package className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Error Loading Products
        </h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // No products
  if (!products || products.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No Products Found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        }`}
      >
        {products.map(renderProductCard)}
      </div>
    </div>
  );
};

export default ProductGrid;
