import React from "react";
import { Star, ShoppingCart, Heart, Eye, Package } from "lucide-react";
import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../ui/ContactUis/Uis";

const ProductGrid = ({
  products,
  viewMode = "grid",
  onProductClick,
  onAddToCart,
  onToggleFavorite,
  onQuickView,
  className = "",
}) => {
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

  const renderProductCard = (product) => (
    <Card
      key={product.id}
      className={`group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${
        viewMode === "list" ? "flex flex-col md:flex-row" : ""
      }`}
      padding={false}
      onClick={() => onProductClick?.(product)}
    >
      {/* Product Image */}
      <div
        className={`relative overflow-hidden ${
          viewMode === "list" ? "md:w-64 flex-shrink-0" : "h-64"
        }`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.badge && (
            <Badge variant={getBadgeVariant(product.badge)} size="sm">
              {product.badge}
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="danger" size="sm">
              Out of Stock
            </Badge>
          )}
          {product.isNew && (
            <Badge variant="primary" size="sm">
              New
            </Badge>
          )}
        </div>

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 right-3">
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discount}%
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-12 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(product);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              product.isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-600 hover:text-red-500"
            }`}
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView?.(product);
            }}
            className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Features */}
        <div className="absolute bottom-3 left-3 flex gap-1">
          {product.freeShipping && (
            <Badge variant="success" size="sm">
              Free Ship
            </Badge>
          )}
          {product.fastDelivery && (
            <Badge variant="warning" size="sm">
              Fast
            </Badge>
          )}
          {product.trending && (
            <Badge variant="danger" size="sm">
              🔥 Trending
            </Badge>
          )}
        </div>

        {/* Limited Time Offer */}
        {product.timeLeft && (
          <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-lg">
            ⏰ {product.timeLeft}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
            {product.brand}
          </p>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
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
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviews || 0})
          </span>
        </div>

        {/* Product Variants */}
        <div className="mb-3">
          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xs text-gray-500">Colors:</span>
              {product.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{
                    backgroundColor:
                      color === "black"
                        ? "#000000"
                        : color === "white"
                        ? "#FFFFFF"
                        : color === "blue"
                        ? "#3B82F6"
                        : color === "red"
                        ? "#EF4444"
                        : color === "green"
                        ? "#10B981"
                        : color === "yellow"
                        ? "#F59E0B"
                        : color === "purple"
                        ? "#8B5CF6"
                        : color === "gray"
                        ? "#6B7280"
                        : "#9CA3AF",
                  }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-500">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Sizes:</span>
              <div className="flex gap-1">
                {product.sizes.slice(0, 3).map((size, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 px-1.5 py-0.5 rounded"
                  >
                    {size.toUpperCase()}
                  </span>
                ))}
                {product.sizes.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{product.sizes.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          {product.discount && (
            <Badge variant="success" size="sm">
              Save $
              {(
                (product.originalPrice || product.price) - product.price
              ).toFixed(2)}
            </Badge>
          )}
        </div>

        {/* Stock Status */}
        {product.stock && (
          <div className="mb-4">
            {product.stock <= 5 && product.stock > 0 && (
              <p className="text-orange-600 text-sm">
                Only {product.stock} left in stock!
              </p>
            )}
            {product.stock === 0 && (
              <p className="text-red-600 text-sm">Out of stock</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className={`${viewMode === "list" ? "flex gap-3" : "space-y-2"}`}>
          <Button
            variant="primary"
            size="md"
            className={viewMode === "list" ? "flex-1" : "w-full"}
            disabled={!product.inStock}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>

          {viewMode === "list" && (
            <Button
              variant="outline"
              size="md"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView?.(product);
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Quick View
            </Button>
          )}
        </div>

        {/* Additional Info (List view only) */}
        {viewMode === "list" && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {product.category && <span>Category: {product.category}</span>}
              {product.sku && <span>SKU: {product.sku}</span>}
              {product.availability && (
                <span>Availability: {product.availability}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );

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
