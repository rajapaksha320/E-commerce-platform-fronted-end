import React, { useState } from "react";
import {
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Zap,
  TrendingUp,
  Award,
} from "lucide-react";
import { Card, Button, Badge } from "../../ui";

const BestItems = () => {
  const [activeTab, setActiveTab] = useState("trending");

  const tabs = [
    { id: "trending", name: "Trending", icon: TrendingUp },
    { id: "bestseller", name: "Best Sellers", icon: Award },
    { id: "flash", name: "Flash Deals", icon: Zap },
  ];

  const products = {
    trending: [
      {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        shop: "TechHub Electronics",
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
        price: 79.99,
        originalPrice: 129.99,
        rating: 4.8,
        reviews: 2340,
        badge: "Hot",
        discount: 38,
        isLiked: false,
      },
      {
        id: 2,
        name: "Smart Fitness Watch",
        shop: "SportZone Pro",
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
        price: 199.99,
        originalPrice: 299.99,
        rating: 4.7,
        reviews: 1890,
        badge: "New",
        discount: 33,
        isLiked: true,
      },
      {
        id: 3,
        name: "Premium Coffee Maker",
        shop: "Home Comfort Store",
        image:
          "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop",
        price: 149.99,
        originalPrice: 219.99,
        rating: 4.9,
        reviews: 567,
        badge: "Popular",
        discount: 32,
        isLiked: false,
      },
      {
        id: 4,
        name: "Designer Backpack",
        shop: "Fashion Forward",
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
        price: 89.99,
        originalPrice: 139.99,
        rating: 4.6,
        reviews: 890,
        badge: "Trending",
        discount: 36,
        isLiked: false,
      },
    ],
    bestseller: [
      {
        id: 5,
        name: "Professional Camera Lens",
        shop: "Photo Pro Studio",
        image:
          "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop",
        price: 449.99,
        originalPrice: 599.99,
        rating: 4.9,
        reviews: 1234,
        badge: "#1 Seller",
        discount: 25,
        isLiked: true,
      },
      {
        id: 6,
        name: "Gaming Mechanical Keyboard",
        shop: "GameZone Central",
        image:
          "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop",
        price: 129.99,
        originalPrice: 179.99,
        rating: 4.8,
        reviews: 2156,
        badge: "Bestseller",
        discount: 28,
        isLiked: false,
      },
    ],
    flash: [
      {
        id: 7,
        name: "Portable Bluetooth Speaker",
        shop: "Audio Excellence",
        image:
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
        price: 59.99,
        originalPrice: 119.99,
        rating: 4.7,
        reviews: 845,
        badge: "50% OFF",
        discount: 50,
        isLiked: false,
        timeLeft: "2h 30m",
      },
      {
        id: 8,
        name: "Wireless Charging Pad",
        shop: "TechHub Electronics",
        image:
          "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop",
        price: 24.99,
        originalPrice: 49.99,
        rating: 4.5,
        reviews: 567,
        badge: "Flash Deal",
        discount: 50,
        isLiked: true,
        timeLeft: "1h 45m",
      },
    ],
  };

  const getBadgeVariant = (badge) => {
    const variants = {
      Hot: "danger",
      New: "success",
      Popular: "primary",
      Trending: "warning",
      "#1 Seller": "success",
      Bestseller: "primary",
      "50% OFF": "danger",
      "Flash Deal": "warning",
    };
    return variants[badge] || "default";
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Best Items Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our handpicked selection of trending products, bestsellers,
            and exclusive flash deals.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products[activeTab].map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden relative"
              padding={false}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden h-64">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3">
                  <Badge variant={getBadgeVariant(product.badge)}>
                    {product.badge}
                  </Badge>
                </div>

                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute top-3 right-3">
                    <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{product.discount}%
                    </div>
                  </div>
                )}

                {/* Flash Deal Timer */}
                {product.timeLeft && (
                  <div className="absolute bottom-3 left-3 bg-black/80 text-white text-xs px-2 py-1 rounded-lg">
                    ⏰ {product.timeLeft}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      product.isLiked
                        ? "bg-red-500 text-white"
                        : "bg-white/90 text-gray-600 hover:text-red-500"
                    }`}
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">{product.shop}</p>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-bold text-gray-900">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button size="lg" variant="outline">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BestItems;
