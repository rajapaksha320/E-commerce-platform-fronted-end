/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Search,
  TrendingUp,
  Clock,
  ArrowRight,
  Star,
  Package,
  Filter,
} from "lucide-react";
import { Button, Badge } from "../../ui/ContactUis/Uis";

const SearchDropdown = ({
  searchQuery,
  isOpen,
  onClose,
  onViewAll,
  onProductSelect,
}) => {
  const [recentSearches] = useState([
    "Wireless headphones",
    "Gaming laptop",
    "Smart watch",
    "Bluetooth speaker",
  ]);

  const [trendingSearches] = useState([
    "iPhone 15",
    "MacBook Pro",
    "AirPods Pro",
    "Samsung Galaxy",
    "PlayStation 5",
    "Nintendo Switch",
  ]);

  // Mock products for real-time search results
  const [searchResults, setSearchResults] = useState([]);

  const allProducts = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones Pro",
      category: "Electronics",
      brand: "Apple",
      price: 179.99,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      inStock: true,
    },
    {
      id: 2,
      name: "Smart Fitness Watch Series 5",
      category: "Electronics",
      brand: "Samsung",
      price: 299.99,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      inStock: true,
    },
    {
      id: 3,
      name: "Gaming Mechanical Keyboard",
      category: "Electronics",
      brand: "Logitech",
      price: 149.99,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop",
      inStock: true,
    },
    {
      id: 4,
      name: "Portable Bluetooth Speaker",
      category: "Electronics",
      brand: "Sony",
      price: 89.99,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
      inStock: false,
    },
    {
      id: 5,
      name: "USB-C Fast Charger 65W",
      category: "Electronics",
      brand: "Apple",
      price: 59.99,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
      inStock: true,
    },
  ];

  useEffect(() => {
    if (searchQuery && searchQuery.length > 0) {
      const filtered = allProducts
        .filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden">
      {/* Search Results */}
      {searchQuery && searchResults.length > 0 && (
        <div className="border-b border-gray-100">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Products</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewAll(searchQuery)}
                className="text-blue-600 hover:text-blue-700"
              >
                View all ({searchResults.length}+)
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-2">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onProductSelect(product)}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {product.brand}
                      </span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-500 ml-1">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ${product.price}
                    </p>
                    {!product.inStock && (
                      <Badge variant="danger" size="sm">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {searchQuery && searchResults.length === 0 && (
        <div className="p-6 text-center border-b border-gray-100">
          <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            No products found for "{searchQuery}"
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onViewAll(searchQuery)}
            className="mt-2"
          >
            Search all categories
          </Button>
        </div>
      )}

      {/* Trending Searches */}
      {!searchQuery && (
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-orange-500" />
            Trending
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {trendingSearches.map((term, index) => (
              <button
                key={index}
                onClick={() => onViewAll(term)}
                className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {!searchQuery && recentSearches.length > 0 && (
        <div className="p-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            Recent searches
          </h3>
          <div className="space-y-1">
            {recentSearches.map((term, index) => (
              <button
                key={index}
                onClick={() => onViewAll(term)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Quick search</span>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onViewAll(searchQuery || "")}
            className="flex items-center"
          >
            <Filter className="h-3 w-3 mr-1" />
            Advanced Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchDropdown;
