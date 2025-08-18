/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  X,
  Filter,
  Truck,
  Star,
  Package,
  Tag,
  Palette,
  DollarSign,
  MapPin,
  Shield,
  Clock,
} from "lucide-react";
import { Button, Badge } from "../../components/ui/ContactUis/Uis";

const SearchFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className = "",
  resultsCount = 0,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
    shipping: false,
    availability: false,
    brand: false,
    color: false,
    size: false,
    location: false,
    condition: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilter = (filterType, value, checked = null) => {
    const newFilters = { ...filters };

    if (filterType === "priceRange") {
      newFilters.priceRange = value;
    } else if (filterType === "rating") {
      newFilters.rating = value;
    } else if (
      filterType === "freeShipping" ||
      filterType === "inStock" ||
      filterType === "fastDelivery" ||
      filterType === "verified"
    ) {
      newFilters[filterType] = checked;
    } else if (filterType === "categories" || filterType === "brands") {
      // Single-select behavior for categories and brands
      if (checked) {
        newFilters[filterType] = [value];
      } else {
        newFilters[filterType] = [];
      }
    } else {
      // For multi-select filters (colors, sizes, locations, conditions)
      if (!newFilters[filterType]) {
        newFilters[filterType] = [];
      }

      if (checked) {
        newFilters[filterType] = [...newFilters[filterType], value];
      } else {
        newFilters[filterType] = newFilters[filterType].filter(
          (item) => item !== value
        );
      }
    }

    onFiltersChange(newFilters);
  };

  const categories = [
    { id: "electronics", name: "Electronics", count: 1456 },
    { id: "clothing", name: "Clothing & Fashion", count: 2324 },
    { id: "accessories", name: "Accessories", count: 889 },
    { id: "home", name: "Home & Garden", count: 1267 },
    { id: "sports", name: "Sports & Outdoors", count: 1034 },
    { id: "books", name: "Books & Media", count: 645 },
    { id: "toys", name: "Toys & Games", count: 578 },
    { id: "beauty", name: "Beauty & Health", count: 923 },
    { id: "automotive", name: "Automotive", count: 456 },
    { id: "jewelry", name: "Jewelry & Watches", count: 334 },
    { id: "fashion", name: "Fashion", count: 334 },
  ];


  const brands = [
    { id: "Apple", name: "Apple", count: 245 },
    { id: "Samsung", name: "Samsung", count: 198 },
    { id: "Nike", name: "Nike", count: 167 },
    { id: "Adidas", name: "Adidas", count: 154 },
    { id: "Sony", name: "Sony", count: 129 },
    { id: "LG", name: "LG", count: 123 },
    { id: "Microsoft", name: "Microsoft", count: 98 },
    { id: "Canon", name: "Canon", count: 87 },
    { id: "HP", name: "HP", count: 76 },
    { id: "Dell", name: "Dell", count: 65 },
  ];

  const colors = [
    { id: "#000000", name: "Black", hex: "#000000", count: 289 },
    { id: "#FFFFFF", name: "White", hex: "#FFFFFF", count: 276 },
    { id: "#3B82F6", name: "Blue", hex: "#3B82F6", count: 165 },
    { id: "#EF4444", name: "Red", hex: "#EF4444", count: 154 },
    { id: "#10B981", name: "Green", hex: "#10B981", count: 143 },
    { id: "#F59E0B", name: "Yellow", hex: "#F59E0B", count: 132 },
    { id: "#8B5CF6", name: "Purple", hex: "#8B5CF6", count: 128 },
    { id: "#6B7280", name: "Gray", hex: "#6B7280", count: 167 },
    { id: "#EC4899", name: "Pink", hex: "#EC4899", count: 89 },
    { id: "#F97316", name: "Orange", hex: "#F97316", count: 76 },
    { id: "#e2d7e2", name: "Light Pink", hex: "#e2d7e2", count: 45 }, 
    { id: "#306616", name: "Dark Green", hex: "#306616", count: 38 }, 
  ];

  const sizes = [
    { id: "xs", name: "XS", count: 123 },
    { id: "s", name: "S", count: 245 },
    { id: "m", name: "M", count: 367 },
    { id: "l", name: "L", count: 356 },
    { id: "xl", name: "XL", count: 234 },
    { id: "xxl", name: "XXL", count: 128 },
    { id: "xxxl", name: "XXXL", count: 67 },
  ];

  const locations = [
    { id: "us", name: "United States", count: 2456 },
    { id: "uk", name: "United Kingdom", count: 1234 },
    { id: "ca", name: "Canada", count: 987 },
    { id: "au", name: "Australia", count: 654 },
    { id: "de", name: "Germany", count: 543 },
    { id: "fr", name: "France", count: 432 },
  ];

  const conditions = [
    { id: "new", name: "New", count: 1876 },
    { id: "refurbished", name: "Refurbished", count: 234 },
    { id: "used", name: "Used - Like New", count: 456 },
    { id: "used-good", name: "Used - Good", count: 298 },
    { id: "used-fair", name: "Used - Fair", count: 123 },
  ];

  const FilterSection = ({
    title,
    icon: Icon,
    sectionKey,
    children,
    count,
  }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        type="button"
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full py-2 text-left hover:bg-gray-50 rounded-md px-2 -mx-2 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">{title}</span>
          {count && (
            <Badge variant="primary" size="sm">
              {count}
            </Badge>
          )}
        </div>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="mt-3 space-y-2">{children}</div>
      )}
    </div>
  );

  const activeFiltersCount = Object.values(filters).reduce((count, filter) => {
    if (Array.isArray(filter)) {
      return count + filter.length;
    } else if (typeof filter === "boolean" && filter) {
      return count + 1;
    } else if (filter && typeof filter === "object") {
      return count + (filter.min || filter.max ? 1 : 0);
    }
    return count;
  }, 0);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
    >
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="primary" size="sm">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-sm text-blue-800">
          <span className="font-semibold">{resultsCount.toLocaleString()}</span>{" "}
          products found
        </div>
      </div>

      {/* Categories */}
      <FilterSection title="Categories" icon={Tag} sectionKey="categories">
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-md p-1 -m-1 transition-colors"
            >
              <input
                type="radio"
                name="categories"
                checked={filters.categories?.includes(category.id) || false}
                onChange={(e) => {
                  updateFilter("categories", category.id, e.target.checked);
                }}
                className="border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 flex-1">
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" icon={DollarSign} sectionKey="price">
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange?.min || ""}
              onChange={(e) => {
                updateFilter("priceRange", {
                  ...filters.priceRange,
                  min: e.target.value ? parseInt(e.target.value) : null,
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange?.max || ""}
              onChange={(e) => {
                updateFilter("priceRange", {
                  ...filters.priceRange,
                  max: e.target.value ? parseInt(e.target.value) : null,
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            {[
              { label: "Under LKR 100", min: 0, max: 100 },
              { label: "LKR 100 to LKR 500", min: 100, max: 500 },
              { label: "LKR 500 to LKR 1000", min: 500, max: 1000 },
              { label: "LKR 1000 to LKR 5000", min: 1000, max: 5000 },
              { label: "Over LKR 5000", min: 5000, max: null },
            ].map((range, index) => (
              <label
                key={index}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-md p-1 -m-1 transition-colors"
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={
                    filters.priceRange?.min === range.min &&
                    filters.priceRange?.max === range.max
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateFilter("priceRange", {
                        min: range.min,
                        max: range.max,
                      });
                    }
                  }}
                  className="border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Customer Rating" icon={Star} sectionKey="rating">
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-md p-1 -m-1 transition-colors"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.rating === rating}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateFilter("rating", rating);
                  }
                }}
                className="border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-700 ml-1">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brands" icon={Package} sectionKey="brand">
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {brands.map((brand) => (
            <label
              key={brand.id}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-md p-1 -m-1 transition-colors"
            >
              <input
                type="radio"
                name="brands"
                checked={filters.brands?.includes(brand.id) || false}
                onChange={(e) => {
                  updateFilter("brands", brand.id, e.target.checked);
                }}
                className="border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 flex-1">{brand.name}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Colors */}
      <FilterSection title="Colors" icon={Palette} sectionKey="color">
        <div className="grid grid-cols-3 gap-3">
          {colors.map((color) => (
            <label
              key={color.id}
              className="flex flex-col items-center cursor-pointer group p-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.colors?.includes(color.id) || false}
                onChange={(e) => {
                  updateFilter("colors", color.id, e.target.checked);
                }}
                className="sr-only"
              />
              <div
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                  filters.colors?.includes(color.id)
                    ? "border-blue-600 scale-110"
                    : "border-gray-300 group-hover:border-gray-400"
                } ${color.hex === "#FFFFFF" ? "border-gray-400" : ""}`}
                style={{ backgroundColor: color.hex }}
              >
                {filters.colors?.includes(color.id) && (
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        color.hex === "#FFFFFF" ||
                        color.hex === "#F59E0B" ||
                        color.hex === "#e2d7e2"
                          ? "bg-gray-600"
                          : "bg-white"
                      }`}
                    />
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-600 mt-1 text-center leading-tight">
                {color.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

    </div>
  );
};

export default SearchFilters;
