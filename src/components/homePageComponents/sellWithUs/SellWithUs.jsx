import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui";
import { ArrowRight } from "lucide-react";

const SellWithUs = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-20 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-indigo-200/40 rounded-full blur-2xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <div className="text-3xl">🏪</div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            Start Selling with Emmover
          </h3>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of successful sellers and grow your business with our
            platform. Easy setup, powerful tools, and millions of customers
            waiting for your products.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button
              variant="primary"
              size="xl"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:text-white hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg"
              onClick={() => navigate("/seller-registration")}
            >
              📦 Become a Seller
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <button className="px-8 py-4 text-xl border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400 hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold rounded-lg inline-flex items-center justify-center">
              Learn More
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="text-4xl font-bold text-blue-600 mb-3">0%</div>
              <div className="text-gray-900 font-semibold text-lg mb-2">
                Setup Fee
              </div>
              <div className="text-gray-600">Start selling immediately</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="text-4xl font-bold text-indigo-600 mb-3">
                24/7
              </div>
              <div className="text-gray-900 font-semibold text-lg mb-2">
                Support
              </div>
              <div className="text-gray-600">Always here to help</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="text-4xl font-bold text-purple-600 mb-3">2M+</div>
              <div className="text-gray-900 font-semibold text-lg mb-2">
                Active Buyers
              </div>
              <div className="text-gray-600">Ready to buy your products</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellWithUs;
