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
} from "lucide-react";
import { Button, Badge, ContactCard as Card } from "../../ui/ContactUis/Uis";

const ShopHeader = ({ shop, className = "" }) => {
  const navigate = useNavigate();

  if (!shop) return null;

  const handleViewAllProducts = () => {
    navigate(`/shop-products/${shop.id}`);
  };

  const handleContactShop = () => {
    navigate(`/contact-shop/${shop.id}`);
  };

  const renderRatingStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}
    >
      {/* Cover Image */}
      <div className="relative h-48 md:h-64">
        <img
          src={shop.coverImage}
          alt={`${shop.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white"
          >
            <Heart className="h-4 w-4 mr-1" />
            Follow
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Shop Info */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
          {/* Shop Logo */}
          <div className="flex-shrink-0 -mt-12 md:-mt-16 mb-4 md:mb-0">
            <div className="relative">
              <img
                src={shop.logo}
                alt={shop.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              {shop.verified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1.5">
                  <Verified className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Shop Details */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {shop.name}
                  </h1>
                  {shop.verified && (
                    <Badge variant="success" size="sm">
                      <Verified className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {shop.badge && (
                    <Badge variant="primary" size="sm">
                      {shop.badge}
                    </Badge>
                  )}
                </div>

                <p className="text-gray-600 text-lg mb-4">{shop.tagline}</p>

                {/* Rating and Stats */}
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {renderRatingStars(shop.rating)}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {shop.rating}
                    </span>
                    <span className="text-gray-600">
                      ({shop.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{shop.followers} followers</span>
                  </div>

                  <div className="flex items-center space-x-1 text-gray-600">
                    <Package className="h-4 w-4" />
                    <span className="text-sm">
                      {shop.totalProducts} products
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  {shop.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{shop.location}</span>
                    </div>
                  )}
                  {shop.businessHours && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{shop.businessHours}</span>
                    </div>
                  )}
                  {shop.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{shop.phone}</span>
                    </div>
                  )}
                  {shop.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{shop.email}</span>
                    </div>
                  )}
                  {shop.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <a
                        href={shop.website}
                        className="text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2 mt-4 md:mt-0 md:ml-4">
                <Button variant="primary" size="md" onClick={handleContactShop}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Shop
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleViewAllProducts}
                >
                  <Package className="h-4 w-4 mr-2" />
                  View All Products
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Description */}
        {shop.description && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              About This Shop
            </h3>
            <p className="text-gray-600 leading-relaxed">{shop.description}</p>
          </div>
        )}

        {/* Shop Policies */}
        {shop.policies && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Shop Policies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shop.policies.map((policy, index) => (
                <Card key={index} className="p-4 bg-gray-50 border-0">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <policy.icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        {policy.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {policy.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopHeader;
