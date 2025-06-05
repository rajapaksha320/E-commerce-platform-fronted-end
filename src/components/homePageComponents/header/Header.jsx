import React from "react";
import {
  ArrowRight,
  Search,
  ShoppingBag,
  Star,
  Users,
  Shield,
  Truck,
  Heart,
  Gift,
} from "lucide-react";
import { Button, Card, Badge } from "../../ui";

const Header = () => {
  const stats = [
    {
      icon: ShoppingBag,
      label: "Active Products",
      value: "50K+",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Users,
      label: "Happy Customers",
      value: "2M+",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Star,
      label: "Customer Rating",
      value: "4.9/5",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Gift,
      label: "Daily Deals",
      value: "100+",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Shopping",
      description:
        "Bank-level security with buyer protection and secure payment processing for peace of mind.",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Free shipping on orders over $50 with express delivery options available nationwide.",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: Heart,
      title: "Customer First",
      description:
        "24/7 customer support with hassle-free returns and satisfaction guarantee.",
      gradient: "from-pink-500 to-rose-600",
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden min-h-screen flex items-center">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(59_130_246)_1px,transparent_0)] opacity-[0.03] bg-[length:48px_48px]"></div>

      {/* Improved Floating Elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-green-200 to-blue-200 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Content - Enhanced */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Enhanced Badge */}
            <div className="mb-8">
              <Badge
                variant="primary"
                size="lg"
                className="bg-blue-100 text-blue-800 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300"
                icon={<Gift className="w-4 h-4" />}
              >
                🎉 New products added daily - Free shipping available!
              </Badge>
            </div>

            {/* Enhanced Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Discover Amazing
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                Products & Deals
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
              Shop from thousands of verified sellers and discover unique
              products at unbeatable prices. Join millions of satisfied
              customers who trust us for their shopping needs.
            </p>

            {/* Enhanced Search Bar */}
            <div className="relative max-w-2xl mb-12 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <input
                  type="text"
                  placeholder="What are you looking for today?"
                  className="w-full pl-14 pr-32 py-5 text-lg border-0 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-gray-400"
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <Button
                  size="lg"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-2xl h-12 px-6 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mb-16">
              <Button
                size="xl"
                className="group shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <ShoppingBag className="mr-3 h-5 w-5" />
                Start Shopping
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Browse Categories
              </Button>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <div key={stat.label} className="text-center group">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${stat.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                    >
                      <IconComponent className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Content - Enhanced Feature Cards */}
          <div className="lg:col-span-5">
            <div className="space-y-6">
              {/* Individual Feature Cards */}
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className={`group hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl border-0 ${
                      index === 1 ? "lg:ml-8" : index === 2 ? "lg:ml-4" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-5">
                      <div
                        className={`flex-shrink-0 w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}

              {/* Enhanced Quality Guarantee Card */}
              <Card className="text-center group hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 border-0">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Quality Guaranteed
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  All products are quality-checked and all sellers are verified.
                  Shop with confidence knowing you're getting the best.
                </p>
                <div className="mt-6">
                  <Button
                    variant="ghost"
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
