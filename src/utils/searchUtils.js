// utils/searchUtils.js
import { debounce } from "./cookieManager";

/**
 * Process search results from API response for display
 * @param {Array} apiResults - Raw results from API
 * @returns {Array} - Processed results for UI
 */
export const processSearchResults = (apiResults) => {
  if (!apiResults || !Array.isArray(apiResults)) {
    return [];
  }

  return apiResults.map((item) => ({
    id: item._id,
    listingId: item._id,
    name: item.title,
    category: item.category?.main || "Unknown",
    brand: item.brand || "Unknown Brand",
    price: parseFloat(item.variations?.[0]?.price || item.price || 0),
    originalPrice: parseFloat(
      item.variations?.[0]?.originalPrice || item.originalPrice || 0
    ),
    rating: item.averageRating || 0,
    image: item.images?.[0]?.url || item.variations?.[0]?.images?.[0]?.url,
    inStock:
      item.status === "active" &&
      (item.variations?.[0]?.quantity > 0 ||
        item.quantity > 0 ||
        item.status !== "outOfStock"),
    status: item.status,
    description: item.description,
    tags: item.productTags || [],
    hasVariations: item.hasVariations || false,
    variations: item.variations || [],
    // Keep original item for detailed access
    _original: item,
  }));
};

/**
 * Create search parameters for API call
 * @param {string} query - Search query
 * @param {Object} filters - Additional filters
 * @returns {Object} - API search parameters
 */
export const createSearchParams = (query = "", filters = {}) => {
  return {
    title: query,
    brandName: filters.brandName || "",
    categoryMain: filters.category || "",
    PriceRange: filters.priceRange || "",
    CustomerRating: filters.rating || 0,
    color: filters.color || "",
  };
};

/**
 * Create debounced search function
 * @param {Function} searchFunction - Function to execute search
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Function} - Debounced search function
 */
export const createDebouncedSearch = (searchFunction, delay = 300) => {
  return debounce(async (query, ...args) => {
    if (query && query.length >= 2) {
      try {
        await searchFunction(query, ...args);
      } catch (error) {
        console.error("Debounced search error:", error);
      }
    }
  }, delay);
};

/**
 * Format price for display
 * @param {number} price - Price value
 * @param {string} currency - Currency symbol
 * @returns {string} - Formatted price
 */
export const formatPrice = (price, currency = "$") => {
  if (!price || isNaN(price)) return `${currency}0.00`;
  return `${currency}${parseFloat(price).toFixed(2)}`;
};

/**
 * Check if product has discount
 * @param {number} price - Current price
 * @param {number} originalPrice - Original price
 * @returns {boolean} - True if has discount
 */
export const hasDiscount = (price, originalPrice) => {
  return originalPrice && originalPrice > price;
};

/**
 * Calculate discount percentage
 * @param {number} price - Current price
 * @param {number} originalPrice - Original price
 * @returns {number} - Discount percentage
 */
export const calculateDiscountPercentage = (price, originalPrice) => {
  if (!hasDiscount(price, originalPrice)) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

/**
 * Validate search query
 * @param {string} query - Search query
 * @returns {Object} - Validation result
 */
export const validateSearchQuery = (query) => {
  const validation = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  if (!query || typeof query !== "string") {
    validation.isValid = false;
    validation.errors.push("Search query is required");
    return validation;
  }

  const trimmedQuery = query.trim();

  if (trimmedQuery.length === 0) {
    validation.isValid = false;
    validation.errors.push("Search query cannot be empty");
  } else if (trimmedQuery.length < 2) {
    validation.isValid = false;
    validation.errors.push("Search query must be at least 2 characters");
  } else if (trimmedQuery.length > 100) {
    validation.warnings.push(
      "Search query is very long and may not return expected results"
    );
  }

  // Check for special characters that might cause issues
  const hasSpecialChars = /[<>{}[\]\\/]/.test(trimmedQuery);
  if (hasSpecialChars) {
    validation.warnings.push(
      "Search query contains special characters that may affect results"
    );
  }

  return validation;
};

/**
 * Generate search suggestions based on query
 * @param {string} query - Current search query
 * @param {Array} recentSearches - Recent search history
 * @param {Array} popularSearches - Popular search terms
 * @returns {Array} - Search suggestions
 */
export const generateSearchSuggestions = (
  query = "",
  recentSearches = [],
  popularSearches = []
) => {
  const suggestions = [];
  const lowerQuery = query.toLowerCase();

  // Add matching recent searches
  const matchingRecent = recentSearches
    .filter((term) => term.toLowerCase().includes(lowerQuery))
    .slice(0, 3);

  suggestions.push(
    ...matchingRecent.map((term) => ({
      type: "recent",
      text: term,
      icon: "clock",
    }))
  );

  // Add matching popular searches
  const matchingPopular = popularSearches
    .filter(
      (term) =>
        term.toLowerCase().includes(lowerQuery) &&
        !matchingRecent.includes(term)
    )
    .slice(0, 3);

  suggestions.push(
    ...matchingPopular.map((term) => ({
      type: "popular",
      text: term,
      icon: "trending",
    }))
  );

  return suggestions.slice(0, 6); // Limit to 6 suggestions
};

/**
 * Extract keywords from search query for highlighting
 * @param {string} query - Search query
 * @returns {Array} - Array of keywords
 */
export const extractKeywords = (query) => {
  if (!query || typeof query !== "string") return [];

  return query
    .trim()
    .split(/\s+/)
    .filter((word) => word.length >= 2)
    .map((word) => word.toLowerCase());
};

/**
 * Highlight search terms in text
 * @param {string} text - Text to highlight
 * @param {string} query - Search query
 * @returns {string} - Text with highlighted terms
 */
export const highlightSearchTerms = (text, query) => {
  if (!text || !query) return text;

  const keywords = extractKeywords(query);
  let highlightedText = text;

  keywords.forEach((keyword) => {
    const regex = new RegExp(`(${keyword})`, "gi");
    highlightedText = highlightedText.replace(regex, "<mark>$1</mark>");
  });

  return highlightedText;
};

export default {
  processSearchResults,
  createSearchParams,
  createDebouncedSearch,
  formatPrice,
  hasDiscount,
  calculateDiscountPercentage,
  validateSearchQuery,
  generateSearchSuggestions,
  extractKeywords,
  highlightSearchTerms,
};
