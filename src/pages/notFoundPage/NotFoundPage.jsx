import React from "react";
import {
  Home,
  Search,
  ShoppingBag,
  ArrowRight,
  Package,
  Compass,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import { Button, Card } from "../../components/ui";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const quickLinks = [
    {
      icon: Home,
      title: "Go Home",
      description: "Return to our homepage",
      action: () => navigate("/"),
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      icon: Search,
      title: "Search Products",
      description: "Find what you're looking for",
      action: () => navigate("/search"),
      gradient: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      icon: ShoppingBag,
      title: "Shop Collections",
      description: "Browse our latest products",
      action: () => navigate("/shop-collections"),
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      icon: Compass,
      title: "Browse Categories",
      description: "Explore product categories",
      action: () => navigate("/category-collections"),
      gradient: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
    },
  ];

  const helpfulTips = [
    {
      icon: Package,
      title: "Check Your Orders",
      description: "View your recent purchases and order history",
    },
    {
      icon: HelpCircle,
      title: "Need Help?",
      description: "Contact our 24/7 customer support team",
    },
  ];

  const handleGoBack = () => {
    window.history.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden min-h-screen flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(59_130_246)_1px,transparent_0)] opacity-[0.03] bg-[length:48px_48px]"></div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-green-200 to-blue-200 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          {/* 404 Animation */}
          <div className="mb-8">
            <div className="inline-block">
              <h1 className="text-9xl lg:text-[12rem] font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent opacity-80 select-none">
                404
              </h1>
            </div>
          </div>

          {/* Main Message */}
          <div className="mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Oops! Page Not Found
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The page you're looking for seems to have wandered off. Don't worry though, 
              there are plenty of amazing products waiting for you to discover!
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="xl"
              className="group shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate("/")}
            >
              <Home className="mr-3 h-5 w-5" />
              Go Home
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-300"
              onClick={handleGoBack}
            >
              <ArrowRight className="mr-3 h-5 w-5 rotate-180" />
              Go Back
            </Button>
            <Button
              variant="ghost"
              size="xl"
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              onClick={handleRefresh}
            >
              <RefreshCw className="mr-3 h-5 w-5" />
              Refresh Page
            </Button>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Where would you like to go?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Card
                  key={link.title}
                  className="group hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl border-0 cursor-pointer"
                  onClick={link.action}
                >
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${link.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      <IconComponent className={`h-8 w-8 ${link.textColor}`} />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {link.title}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {link.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
            Or search for what you need
          </h3>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <input
                type="text"
                placeholder="Search for products, categories, or brands..."
                className="w-full pl-14 pr-32 py-5 text-lg border-0 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-gray-400"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/search?q=${e.target.value}`);
                  }
                }}
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <Button
                size="lg"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-2xl h-12 px-6 shadow-md hover:shadow-lg transition-all duration-200"
                onClick={() => {
                  const searchInput = document.querySelector('input[type="text"]');
                  if (searchInput.value) {
                    navigate(`/search?q=${searchInput.value}`);
                  }
                }}
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Helpful Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {helpfulTips.map((tip) => {
            const IconComponent = tip.icon;
            return (
              <Card
                key={tip.title}
                className="group hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl border-0"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {tip.title}
                    </h4>
                    <p className="text-gray-600">
                      {tip.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer Message */}
        <div className="text-center mt-16">
          <p className="text-gray-500">
            Still can't find what you're looking for? 
            <button 
              className="text-blue-600 hover:text-blue-700 font-medium ml-1 underline underline-offset-2"
              onClick={() => navigate("/contact")}
            >
              Contact our support team
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;

