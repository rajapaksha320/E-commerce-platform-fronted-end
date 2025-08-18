/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, ArrowRight, Star, Package, Loader2 } from "lucide-react";
import { Button, Badge } from "../../ui/ContactUis/Uis";
import {
  searchProducts,
  selectSearchResults,
  selectSearchLoading,
} from "../../../store/slices/userSlice";
// Import debounce utility
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const SearchDropdown = ({
  searchQuery,
  isOpen,
  onClose,
  onViewAll,
  onProductSelect,
  isMobile = false,
}) => {
  const dispatch = useDispatch();
  const searchResults = useSelector(selectSearchResults);
  const searchLoading = useSelector(selectSearchLoading);

  const [suggestions, setSuggestions] = useState([]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query && query.length >= 2) {
        try {
          const searchParams = {
            title: query,
            brandName: "",
            categoryMain: "",
            PriceRange: "",
            CustomerRating: 0,
            color: "",
          };

          const response = await dispatch(
            searchProducts({
              searchParams,
              page: 1,
              pageSize: 8,
            })
          ).unwrap();

          // Process results for suggestions
          if (response.data && response.data.length > 0) {
            const processedSuggestions = response.data
              .slice(0, 5)
              .map((item) => ({
                id: item._id,
                name: item.title,
                category: item.category?.main || "Unknown",
                brand: item.brand || "Unknown Brand",
                price: item.variations?.[0]?.price || item.price || 0,
                originalPrice:
                  item.variations?.[0]?.originalPrice ||
                  item.originalPrice ||
                  0,
                rating: item.averageRating || 0,
                image:
                  item.images?.[0]?.url ||
                  item.variations?.[0]?.images?.[0]?.url,
                inStock:
                  item.status === "active" &&
                  (item.variations?.[0]?.quantity > 0 || item.quantity > 0),
                listingId: item._id,
              }));
            setSuggestions(processedSuggestions);
          } else {
            setSuggestions([]);
          }
        } catch (error) {
          console.error("Search error:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    }, 300),
    [dispatch]
  );

  // Effect to trigger search when query changes
  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, debouncedSearch]);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    onProductSelect({
      id: suggestion.listingId,
      name: suggestion.name,
      ...suggestion,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className={`absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden ${
        isMobile ? "max-h-[70vh] min-h-[200px] z-[60]" : "max-h-96 z-50"
      }`}
    >
      {/* Loading State */}
      {searchLoading && (
        <div className={`text-center ${isMobile ? "p-8" : "p-6"}`}>
          <Loader2
            className={`animate-spin mx-auto mb-2 text-blue-600 ${
              isMobile ? "h-8 w-8" : "h-6 w-6"
            }`}
          />
          <p className={`text-gray-600 ${isMobile ? "text-base" : "text-sm"}`}>
            Searching products...
          </p>
        </div>
      )}

      {/* Search Results */}
      {searchQuery && suggestions.length > 0 && !searchLoading && (
        <div className="border-b border-gray-100">
          <div className={`${isMobile ? "p-3" : "p-4"}`}>
            <div
              className={`flex items-center justify-between ${
                isMobile ? "mb-2" : "mb-3"
              }`}
            >
              <h3
                className={`font-semibold text-gray-900 ${
                  isMobile ? "text-base" : "text-sm"
                }`}
              >
                Products
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewAll(searchQuery)}
                className={`text-blue-600 hover:text-blue-700 ${
                  isMobile ? "text-sm px-2 py-1" : ""
                }`}
              >
                View all results
                <ArrowRight
                  className={`ml-1 ${isMobile ? "h-3 w-3" : "h-4 w-4"}`}
                />
              </Button>
            </div>
            <div className={`${isMobile ? "space-y-3" : "space-y-2"}`}>
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`flex items-center space-x-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors active:bg-gray-100 ${
                    isMobile ? "p-3" : "p-2"
                  }`}
                >
                  {suggestion.image ? (
                    <img
                      src={suggestion.image}
                      alt={suggestion.name}
                      className={`rounded-lg object-cover ${
                        isMobile ? "w-12 h-12" : "w-10 h-10"
                      }`}
                    />
                  ) : (
                    <div
                      className={`rounded-lg bg-gray-200 flex items-center justify-center ${
                        isMobile ? "w-12 h-12" : "w-10 h-10"
                      }`}
                    >
                      <Package
                        className={`text-gray-400 ${
                          isMobile ? "h-6 w-6" : "h-5 w-5"
                        }`}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium text-gray-900 truncate ${
                        isMobile ? "text-base" : "text-sm"
                      }`}
                    >
                      {suggestion.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-gray-500 ${
                          isMobile ? "text-sm" : "text-xs"
                        }`}
                      >
                        {suggestion.brand}
                      </span>
                      {suggestion.rating > 0 && (
                        <div className="flex items-center">
                          <Star
                            className={`text-yellow-400 fill-current ${
                              isMobile ? "h-3 w-3" : "h-3 w-3"
                            }`}
                          />
                          <span
                            className={`text-gray-500 ml-1 ${
                              isMobile ? "text-sm" : "text-xs"
                            }`}
                          >
                            {suggestion.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex flex-col items-end">
                      <p
                        className={`font-semibold text-gray-900 ${
                          isMobile ? "text-base" : "text-sm"
                        }`}
                      >
                        ${parseFloat(suggestion.price).toFixed(2)}
                      </p>
                      {suggestion.originalPrice > suggestion.price && (
                        <p
                          className={`text-gray-500 line-through ${
                            isMobile ? "text-sm" : "text-xs"
                          }`}
                        >
                          ${parseFloat(suggestion.originalPrice).toFixed(2)}
                        </p>
                      )}
                    </div>
                    {!suggestion.inStock && (
                      <Badge variant="danger" size="sm" className="mt-1">
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
      {searchQuery && suggestions.length === 0 && !searchLoading && (
        <div
          className={`text-center border-b border-gray-100 ${
            isMobile ? "p-6" : "p-6"
          }`}
        >
          <Package
            className={`text-gray-400 mx-auto mb-2 ${
              isMobile ? "h-10 w-10" : "h-8 w-8"
            }`}
          />
          <p
            className={`text-gray-600 mb-2 ${
              isMobile ? "text-base" : "text-sm"
            }`}
          >
            No products found for "{searchQuery}"
          </p>
          <p
            className={`text-gray-500 mb-3 ${isMobile ? "text-sm" : "text-xs"}`}
          >
            Try searching with different keywords or brand names
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onViewAll(searchQuery)}
            className={`mt-2 ${isMobile ? "px-4 py-2 text-sm" : ""}`}
          >
            Search all categories
          </Button>
        </div>
      )}

      {/* Quick Search Tips */}
      {!searchQuery && (
        <div className={`bg-gray-50 ${isMobile ? "p-4" : "p-4"}`}>
          <h3
            className={`font-semibold text-gray-900 mb-2 ${
              isMobile ? "text-base" : "text-sm"
            }`}
          >
            Search Tips
          </h3>
          <div
            className={`text-gray-600 space-y-1 ${
              isMobile ? "text-sm" : "text-xs"
            }`}
          >
            <p>• Search by product name (e.g., "iPhone", "laptop")</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div
        className={`bg-gray-50 border-t border-gray-100 ${
          isMobile ? "p-4" : "p-4"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-gray-500 ${isMobile ? "text-sm" : "text-xs"}`}>
            Quick search
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onViewAll(searchQuery || "")}
            className={`flex items-center ${
              isMobile ? "px-3 py-2 text-sm" : ""
            }`}
          >
            <Search className={`mr-1 ${isMobile ? "h-4 w-4" : "h-3 w-3"}`} />
            Advanced Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchDropdown;
