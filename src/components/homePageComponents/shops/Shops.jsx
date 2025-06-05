import React, { useState } from "react";
import {
  Star,
  MapPin,
  Clock,
  Filter,
  Grid,
  List,
  ArrowRight,
  Heart,
  Eye,
} from "lucide-react";
import { Card, Button, Badge } from "../../ui";

const Shops = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Shops", count: 150 },
    { id: "electronics", name: "Electronics", count: 45 },
    { id: "fashion", name: "Fashion", count: 38 },
    { id: "home", name: "Home & Garden", count: 25 },
    { id: "food", name: "Food & Beverage", count: 22 },
    { id: "sports", name: "Sports", count: 20 },
  ];

  const shops = [
    {
      id: 1,
      name: "TechHub Electronics",
      category: "electronics",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 1250,
      location: "New York, NY",
      openTime: "9:00 AM - 9:00 PM",
      description:
        "Premium electronics and gadgets with latest technology innovations.",
      products: 156,
      badge: "Verified",
      discount: "Up to 30% off",
    },
    {
      id: 2,
      name: "Fashion Forward",
      category: "fashion",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 890,
      location: "Los Angeles, CA",
      openTime: "10:00 AM - 8:00 PM",
      description: "Trendy clothing and accessories for modern lifestyle.",
      products: 324,
      badge: "Premium",
      discount: "25% off new arrivals",
    },
    {
      id: 3,
      name: "Home Comfort Store",
      category: "home",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 567,
      location: "Chicago, IL",
      openTime: "8:00 AM - 10:00 PM",
      description: "Everything you need to make your house a beautiful home.",
      products: 89,
      badge: "Featured",
      discount: "Free shipping",
    },
    {
      id: 4,
      name: "Gourmet Delights",
      category: "food",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      rating: 4.6,
      reviews: 445,
      location: "San Francisco, CA",
      openTime: "7:00 AM - 11:00 PM",
      description: "Artisanal foods and beverages from around the world.",
      products: 67,
      badge: "Organic",
      discount: "Buy 2 Get 1 Free",
    },
    {
      id: 5,
      name: "SportZone Pro",
      category: "sports",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 733,
      location: "Miami, FL",
      openTime: "6:00 AM - 10:00 PM",
      description: "Professional sports equipment and fitness gear.",
      products: 234,
      badge: "Athletic",
      discount: "20% off sports gear",
    },
    {
      id: 6,
      name: "Urban Style Studio",
      category: "fashion",
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop",
      rating: 4.5,
      reviews: 312,
      location: "Austin, TX",
      openTime: "11:00 AM - 7:00 PM",
      description: "Contemporary fashion with urban street style influence.",
      products: 128,
      badge: "Trending",
      discount: "40% off clearance",
    },
  ];

  const filteredShops =
    selectedCategory === "all"
      ? shops
      : shops.filter((shop) => shop.category === selectedCategory);

  const getBadgeVariant = (badge) => {
    const variants = {
      Verified: "success",
      Premium: "primary",
      Featured: "warning",
      Organic: "success",
      Athletic: "info",
      Trending: "danger",
    };
    return variants[badge] || "default";
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Shops
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse through our curated collection of verified shops offering
            quality products and exceptional service.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Shops Grid */}
        <div
          className={`grid gap-6 mb-12 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {filteredShops.map((shop) => (
            <Card
              key={shop.id}
              className={`group overflow-hidden ${
                viewMode === "list" ? "flex flex-col md:flex-row" : ""
              }`}
              padding={false}
            >
              {/* Shop Image */}
              <div
                className={`relative overflow-hidden ${
                  viewMode === "list" ? "md:w-80 flex-shrink-0" : "h-48"
                }`}
              >
                <img
                  src={shop.image}
                  alt={shop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant={getBadgeVariant(shop.badge)}>
                    {shop.badge}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors">
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
                {shop.discount && (
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="danger">{shop.discount}</Badge>
                  </div>
                )}
              </div>

              {/* Shop Info */}
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {shop.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{shop.rating}</span>
                    <span className="text-gray-500">({shop.reviews})</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {shop.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {shop.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    {shop.openTime}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {shop.products} products
                  </span>
                  <Button size="sm">
                    Visit Shop
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center">
          <Button size="lg" variant="outline">
            Load More Shops
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Shops;
