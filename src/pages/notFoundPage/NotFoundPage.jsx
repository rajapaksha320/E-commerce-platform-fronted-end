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

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-4 xl:py-8 2xl:py-10">
        <div className="text-center mb-8 lg:mb-4 xl:mb-8 2xl:mb-10">
          {/* 404 Animation - Much smaller on desktop */}
          <div className="mb-4 lg:mb-2 xl:mb-4 2xl:mb-5">
            <div className="inline-block">
              <h1 className="text-8xl lg:text-6xl xl:text-8xl 2xl:text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent opacity-80 select-none">
                404
              </h1>
            </div>
          </div>

          {/* Main Message - More compact */}
          <div className="mb-8 lg:mb-4 xl:mb-7 2xl:mb-8">
            <h2 className="text-3xl lg:text-xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-3 lg:mb-1 xl:mb-3 2xl:mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg lg:text-sm xl:text-lg 2xl:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The page you're looking for seems to have wandered off. Don't worry though, 
              there are plenty of amazing products waiting for you to discover!
            </p>
          </div>

          {/* Quick Action Buttons - Smaller on desktop */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-1.5 xl:gap-3 2xl:gap-4 justify-center mb-8 lg:mb-4 xl:mb-7 2xl:mb-8">
            <Button
              size="lg"
              className="group shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 lg:px-3 lg:py-1.5 lg:text-xs xl:px-5 xl:py-2.5 xl:text-base 2xl:px-6 2xl:py-3 2xl:text-base"
              onClick={() => navigate("/")}
            >
              <Home className="mr-2 h-4 w-4 lg:h-3 lg:w-3 xl:h-4 xl:w-4 2xl:h-5 2xl:w-5" />
              Go Home
              <ArrowRight className="ml-2 h-4 w-4 lg:h-3 lg:w-3 xl:h-4 xl:w-4 2xl:h-5 2xl:w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-300 lg:px-3 lg:py-1.5 lg:text-xs xl:px-5 xl:py-2.5 xl:text-base 2xl:px-6 2xl:py-3 2xl:text-base"
              onClick={handleGoBack}
            >
              <ArrowRight className="mr-2 h-4 w-4 lg:h-3 lg:w-3 xl:h-4 xl:w-4 2xl:h-5 2xl:w-5 rotate-180" />
              Go Back
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-50 lg:px-3 lg:py-1.5 lg:text-xs xl:px-5 xl:py-2.5 xl:text-base 2xl:px-6 2xl:py-3 2xl:text-base"
              onClick={handleRefresh}
            >
              <RefreshCw className="mr-2 h-4 w-4 lg:h-3 lg:w-3 xl:h-4 xl:w-4 2xl:h-5 2xl:w-5" />
              Refresh Page
            </Button>
          </div>
        </div>

        {/* Quick Links Grid - Much smaller on desktop */}
        <div className="mb-4 lg:mb-3 xl:mb-3 2xl:mb-12">
          <h3 className="text-xl lg:text-base xl:text-xl 2xl:text-2xl font-bold text-gray-900 text-center mb-4 lg:mb-2 xl:mb-4 2xl:mb-5">
            Where would you like to go?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-2 xl:gap-4 2xl:gap-6">
            {quickLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Card
                  key={link.title}
                  className="group hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl border-0 cursor-pointer p-4 lg:p-2 xl:p-4 2xl:p-5"
                  onClick={link.action}
                >
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 lg:w-6 lg:h-6 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 rounded-2xl lg:rounded xl:rounded-xl 2xl:rounded-2xl ${link.bgColor} mb-3 lg:mb-1 xl:mb-3 2xl:mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      <IconComponent className={`h-6 w-6 lg:h-3 lg:w-3 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6 ${link.textColor}`} />
                    </div>
                    <h4 className="text-base lg:text-xs xl:text-base 2xl:text-lg font-bold text-gray-900 mb-1 lg:mb-0.5 xl:mb-1 2xl:mb-2">
                      {link.title}
                    </h4>
                    <p className="text-gray-600 text-sm lg:text-xs xl:text-sm 2xl:text-sm">
                      {link.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center">
          <p className="text-gray-500 text-sm lg:text-xs xl:text-sm 2xl:text-base">
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