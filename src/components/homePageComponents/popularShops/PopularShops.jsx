import React from "react";
import {
  Star,
  Users,
  ShoppingBag,
  ArrowRight,
  Crown,
  Verified,
  TrendingUp,
} from "lucide-react";
import { Card, Button, Badge } from "../../ui";

const PopularShops = () => {
  const popularShops = [
    {
      id: 1,
      name: "ElectroMax",
      category: "Electronics",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop",
      logo: "https://images.unsplash.com/photo-1611077518981-8f02a0c20acc?w=80&h=80&fit=crop",
      rating: 4.9,
      reviews: 12500,
      followers: 45000,
      products: 1250,
      description:
        "Your ultimate destination for cutting-edge electronics and smart home solutions.",
      badge: "Premium Partner",
      isVerified: true,
      monthlyVisitors: "150K+",
      specialOffer: "Free shipping on orders over $50",
    },
    {
      id: 2,
      name: "StyleVault",
      category: "Fashion",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop",
      logo: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=80&h=80&fit=crop",
      rating: 4.8,
      reviews: 8900,
      followers: 32000,
      products: 890,
      description:
        "Trendsetting fashion pieces that define your unique style and personality.",
      badge: "Top Rated",
      isVerified: true,
      monthlyVisitors: "120K+",
      specialOffer: "30% off new collections",
    },
    {
      id: 3,
      name: "HomeHaven",
      category: "Home & Decor",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=200&fit=crop",
      logo: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=80&h=80&fit=crop",
      rating: 4.7,
      reviews: 5600,
      followers: 28000,
      products: 650,
      description:
        "Transform your living space with our curated collection of home essentials.",
      badge: "Rising Star",
      isVerified: true,
      monthlyVisitors: "95K+",
      specialOffer: "Buy 2 Get 1 Free on decor items",
    },
    {
      id: 4,
      name: "GourmetWorld",
      category: "Food & Beverage",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop",
      logo: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=80&h=80&fit=crop",
      rating: 4.9,
      reviews: 7800,
      followers: 22000,
      products: 340,
      description:
        "Discover exotic flavors and premium ingredients from around the globe.",
      badge: "Gourmet Choice",
      isVerified: true,
      monthlyVisitors: "80K+",
      specialOffer: "Free tastings with every order",
    },
    {
      id: 5,
      name: "FitnessPro",
      category: "Sports & Fitness",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop",
      logo: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=80&h=80&fit=crop",
      rating: 4.8,
      reviews: 9200,
      followers: 38000,
      products: 780,
      description:
        "Professional-grade fitness equipment and gear for your wellness journey.",
      badge: "Fitness Expert",
      isVerified: true,
      monthlyVisitors: "110K+",
      specialOffer: "20% off fitness bundles",
    },
    {
      id: 6,
      name: "BookNook",
      category: "Books & Media",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop",
      logo: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=80&h=80&fit=crop",
      rating: 4.6,
      reviews: 4300,
      followers: 15000,
      products: 2100,
      description:
        "A literary paradise with rare finds and bestsellers for every reader.",
      badge: "Literary Choice",
      isVerified: true,
      monthlyVisitors: "65K+",
      specialOffer: "Buy 3 books, get 1 free",
    },
  ];

  const getBadgeVariant = (badge) => {
    const variants = {
      "Premium Partner": "primary",
      "Top Rated": "success",
      "Rising Star": "warning",
      "Gourmet Choice": "info",
      "Fitness Expert": "danger",
      "Literary Choice": "purple",
    };
    return variants[badge] || "default";
  };

  return (
    <section className="py-16 bg-white">
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
            Explore our most loved shops, trusted by thousands of customers for
            their quality products and exceptional service.
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
            <p className="text-gray-600">Verified Shops</p>
          </Card>

          <Card className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-xl mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">2M+</h3>
            <p className="text-gray-600">Happy Customers</p>
          </Card>

          <Card className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-xl mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">4.8/5</h3>
            <p className="text-gray-600">Average Rating</p>
          </Card>
        </div>

        {/* Popular Shops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {popularShops.map((shop) => (
            <Card
              key={shop.id}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300"
              padding={false}
            >
              {/* Shop Cover Image */}
              <div className="relative h-32 overflow-hidden">
                <img
                  src={shop.image}
                  alt={shop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <Badge variant={getBadgeVariant(shop.badge)}>
                    {shop.badge}
                  </Badge>
                </div>

                {/* Verified Badge */}
                {shop.isVerified && (
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center bg-white/90 rounded-full px-2 py-1">
                      <Verified className="h-3 w-3 text-blue-600 mr-1" />
                      <span className="text-xs font-medium text-gray-900">
                        Verified
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Shop Info */}
              <div className="p-6">
                {/* Logo and Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative -mt-8">
                    <img
                      src={shop.logo}
                      alt={`${shop.name} logo`}
                      className="w-16 h-16 rounded-xl border-4 border-white shadow-lg object-cover"
                    />
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {shop.name}
                    </h3>
                    <p className="text-sm text-gray-500">{shop.category}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {shop.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-900">
                        {shop.rating}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {shop.reviews.toLocaleString()} reviews
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 mb-1">
                      {shop.products}
                    </div>
                    <p className="text-xs text-gray-500">Products</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex justify-between text-xs text-gray-500 mb-4">
                  <span>{shop.followers.toLocaleString()} followers</span>
                  <span>{shop.monthlyVisitors} monthly visitors</span>
                </div>

                {/* Special Offer */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-blue-800">
                    🎁 {shop.specialOffer}
                  </p>
                </div>

                {/* Action Button */}
                <Button className="w-full group-hover:bg-blue-700 transition-colors">
                  Visit Shop
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button size="lg" variant="outline">
            View All Popular Shops
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularShops;
