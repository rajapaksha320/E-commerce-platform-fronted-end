import React, { useState, useEffect } from "react";
import {
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Zap,
  Clock,
  Gift,
  TrendingDown,
  Calendar,
  Package,
  ArrowRight,
  Timer,
  Percent,
  Tag,
  CloudLightning,
  Flame,
  Users,
  Award,
  Target,
} from "lucide-react";
import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";
import { useNavigate } from "react-router-dom";

const Deals = () => {
  const [activeTab, setActiveTab] = useState("flash");
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });

  const navigate = useNavigate();

  const handleMoreDeals = () => {
    navigate("/product-collections");
  };

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: "flash", name: "Flash Deals", icon: CloudLightning },
    { id: "daily", name: "Daily Deals", icon: Calendar },
    { id: "clearance", name: "Clearance", icon: TrendingDown },
    { id: "bundles", name: "Bundle Offers", icon: Package },
  ];

  const flashDeals = [
    {
      id: 1,
      name: "Premium Wireless Earbuds",
      shop: "AudioTech Pro",
      shopId: 1,
      image:
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
      price: 49.99,
      originalPrice: 129.99,
      rating: 4.8,
      reviews: 1247,
      discount: 62,
      timeLeft: "2h 15m",
      sold: 89,
      available: 120,
      badge: "Lightning Deal",
      inStock: true,
    },
    {
      id: 2,
      name: "Smart Home Security Camera",
      shop: "SecureHome Tech",
      shopId: 2,
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
      price: 79.99,
      originalPrice: 159.99,
      rating: 4.7,
      reviews: 892,
      discount: 50,
      timeLeft: "1h 45m",
      sold: 156,
      available: 200,
      badge: "50% OFF",
      inStock: true,
    },
    {
      id: 3,
      name: "Fitness Tracker Pro",
      shop: "HealthTech Solutions",
      shopId: 3,
      image:
        "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=300&fit=crop",
      price: 89.99,
      originalPrice: 199.99,
      rating: 4.9,
      reviews: 2156,
      discount: 55,
      timeLeft: "3h 20m",
      sold: 234,
      available: 300,
      badge: "Best Seller",
      inStock: true,
    },
    {
      id: 4,
      name: "Portable Power Bank 20000mAh",
      shop: "PowerUp Electronics",
      shopId: 4,
      image:
        "https://images.unsplash.com/photo-1609592806857-bc0fc4bffa94?w=300&h=300&fit=crop",
      price: 29.99,
      originalPrice: 69.99,
      rating: 4.6,
      reviews: 567,
      discount: 57,
      timeLeft: "4h 10m",
      sold: 67,
      available: 150,
      badge: "Hot Deal",
      inStock: true,
    },
  ];

  const dailyDeals = [
    {
      id: 5,
      name: "Bluetooth Gaming Headset",
      shop: "GameZone Pro",
      shopId: 5,
      image:
        "https://images.unsplash.com/photo-1599669454699-248893623440?w=300&h=300&fit=crop",
      price: 119.99,
      originalPrice: 199.99,
      rating: 4.8,
      reviews: 1834,
      discount: 40,
      badge: "Daily Special",
      inStock: true,
    },
    {
      id: 6,
      name: "Smart LED Strip Lights",
      shop: "HomeGlow Lighting",
      shopId: 6,
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop",
      price: 34.99,
      originalPrice: 79.99,
      rating: 4.7,
      reviews: 945,
      discount: 56,
      badge: "Today Only",
      inStock: true,
    },
  ];

  const clearanceDeals = [
    {
      id: 7,
      name: "Vintage Leather Backpack",
      shop: "Heritage Bags",
      shopId: 7,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
      price: 45.99,
      originalPrice: 139.99,
      rating: 4.5,
      reviews: 423,
      discount: 67,
      badge: "Final Sale",
      inStock: true,
    },
    {
      id: 8,
      name: "Ceramic Coffee Mug Set",
      shop: "Kitchen Essentials",
      shopId: 8,
      image:
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop",
      price: 19.99,
      originalPrice: 49.99,
      rating: 4.4,
      reviews: 289,
      discount: 60,
      badge: "Clearance",
      inStock: false,
    },
  ];

  const bundleDeals = [
    {
      id: 9,
      name: "Home Office Complete Bundle",
      shop: "OfficeMax Pro",
      shopId: 9,
      image:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop",
      price: 299.99,
      originalPrice: 499.99,
      rating: 4.9,
      reviews: 756,
      discount: 40,
      badge: "Bundle Deal",
      items: "Desk Lamp + Mouse Pad + Cable Organizer",
      inStock: true,
    },
    {
      id: 10,
      name: "Kitchen Starter Pack",
      shop: "CookWell Supplies",
      shopId: 10,
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
      price: 149.99,
      originalPrice: 279.99,
      rating: 4.7,
      reviews: 534,
      discount: 46,
      badge: "Save $130",
      items: "Knife Set + Cutting Board + Utensil Set",
      inStock: true,
    },
  ];

  const getCurrentDeals = () => {
    switch (activeTab) {
      case "flash":
        return flashDeals;
      case "daily":
        return dailyDeals;
      case "clearance":
        return clearanceDeals;
      case "bundles":
        return bundleDeals;
      default:
        return flashDeals;
    }
  };

  const getBadgeVariant = (badge) => {
    const variants = {
      "Lightning Deal": "danger",
      "50% OFF": "danger",
      "Best Seller": "success",
      "Hot Deal": "warning",
      "Daily Special": "primary",
      "Today Only": "info",
      "Final Sale": "purple",
      Clearance: "info",
      "Bundle Deal": "success",
      "Save $130": "success",
    };
    return variants[badge] || "default";
  };

  const handleAddToCart = (deal, e) => {
    e.stopPropagation();
    console.log("Added to cart:", deal.id);
  };

  const handleBuyNow = (deal, e) => {
    e.stopPropagation();
    navigate(`/checkout?product=${deal.id}&quantity=1`);
  };

  const handleWishlist = (deal, e) => {
    e.stopPropagation();
    console.log("Added to wishlist:", deal.id);
  };

  const handleQuickView = (deal, e) => {
    e.stopPropagation();
    console.log("Quick view:", deal.id);
  };

  const handleShopClick = (deal, e) => {
    e.stopPropagation();
    navigate(`/shop/${deal.shopId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Badge
              variant="danger"
              size="lg"
              className="mb-6 bg-white/20 text-white border-white/30"
            >
              🔥 Deals of the Day
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Unbeatable Deals
              <br />
              <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                Just for You!
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-4xl mx-auto leading-relaxed mb-8">
              Discover incredible savings with our flash deals, daily specials,
              and exclusive offers. Don't miss out - these deals won't last
              long!
            </p>

            {/* Countdown Timer */}
            <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-sm border-white/20">
              <div className="p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Timer size={24} className="text-yellow-300" />
                    <h3 className="text-lg font-bold text-white">
                      Flash Sale Ends In
                    </h3>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-yellow-300">
                        {timeLeft.hours.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs text-orange-200">Hours</div>
                    </div>
                    <div className="text-2xl text-white">:</div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-yellow-300">
                        {timeLeft.minutes.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs text-orange-200">Minutes</div>
                    </div>
                    <div className="text-2xl text-white">:</div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-yellow-300">
                        {timeLeft.seconds.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs text-orange-200">Seconds</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Deals Categories Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex flex-wrap justify-center gap-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 touch-manipulation ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
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
        </Card>
      </div>

      {/* Deals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getCurrentDeals().map((deal) => (
            <Card
              key={deal.id}
              className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/product/${deal.id}`)}
              padding={false}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "/placehold.png";
                  }}
                />

                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <Badge variant={getBadgeVariant(deal.badge)} size="sm">
                    {deal.badge}
                  </Badge>
                </div>

                {/* Stock Status */}
                {!deal.inStock && (
                  <div className="absolute top-3 left-3 mt-8">
                    <Badge variant="danger" size="sm">
                      Out of Stock
                    </Badge>
                  </div>
                )}

                {/* Discount Badge */}
                <div className="absolute top-3 right-3">
                  <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{deal.discount}%
                  </div>
                </div>

                {/* Flash Deal Timer */}
                {deal.timeLeft && (
                  <div className="absolute bottom-3 left-3 bg-black/80 text-white text-xs px-2 py-1 rounded-lg flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{deal.timeLeft}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-3 right-12 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleWishlist(deal, e)}
                    className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors touch-manipulation"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => handleQuickView(deal, e)}
                    className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 transition-colors touch-manipulation"
                    aria-label="Quick view"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                {/* Shop Name */}
                <p
                  className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer mb-1"
                  onClick={(e) => handleShopClick(deal, e)}
                >
                  {deal.shop}
                </p>

                {/* Product Title */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {deal.name}
                </h3>

                {/* Bundle Items */}
                {deal.items && (
                  <p className="text-xs text-gray-600 mb-2 italic">
                    Includes: {deal.items}
                  </p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(deal.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">
                    {deal.rating} ({deal.reviews})
                  </span>
                </div>

                {/* Progress Bar for Flash Deals */}
                {deal.sold && deal.available && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Sold: {deal.sold}</span>
                      <span>Available: {deal.available}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (deal.sold / (deal.sold + deal.available)) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-bold text-gray-900">
                      ${deal.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ${deal.originalPrice}
                    </span>
                  </div>
                  <Badge variant="success" size="sm">
                    Save ${(deal.originalPrice - deal.price).toFixed(2)}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {/* Main Action Button */}
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full touch-manipulation"
                    disabled={!deal.inStock}
                    onClick={(e) =>
                      deal.inStock ? handleBuyNow(deal, e) : e.stopPropagation()
                    }
                  >
                    {deal.inStock ? "Buy It Now" : "Out of Stock"}
                  </Button>

                  {/* Secondary Button */}
                  {deal.inStock && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full touch-manipulation"
                      onClick={(e) => handleAddToCart(deal, e)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="flex items-center space-x-2 mx-auto touch-manipulation"
            onClick={handleMoreDeals}
          >
            <span>Load More Deals</span>
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Deals;
