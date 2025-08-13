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
    shipping: true,
    availability: true,
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
    } else {
      // For multi-select filters
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
  ];

  const brands = [
    { id: "apple", name: "Apple", count: 245 },
    { id: "samsung", name: "Samsung", count: 198 },
    { id: "nike", name: "Nike", count: 167 },
    { id: "adidas", name: "Adidas", count: 154 },
    { id: "sony", name: "Sony", count: 129 },
    { id: "lg", name: "LG", count: 123 },
    { id: "microsoft", name: "Microsoft", count: 98 },
    { id: "canon", name: "Canon", count: 87 },
    { id: "hp", name: "HP", count: 76 },
    { id: "dell", name: "Dell", count: 65 },
  ];

  const colors = [
    { id: "black", name: "Black", hex: "#000000", count: 289 },
    { id: "white", name: "White", hex: "#FFFFFF", count: 276 },
    { id: "blue", name: "Blue", hex: "#3B82F6", count: 165 },
    { id: "red", name: "Red", hex: "#EF4444", count: 154 },
    { id: "green", name: "Green", hex: "#10B981", count: 143 },
    { id: "yellow", name: "Yellow", hex: "#F59E0B", count: 132 },
    { id: "purple", name: "Purple", hex: "#8B5CF6", count: 128 },
    { id: "gray", name: "Gray", hex: "#6B7280", count: 167 },
    { id: "pink", name: "Pink", hex: "#EC4899", count: 89 },
    { id: "orange", name: "Orange", hex: "#F97316", count: 76 },
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
                type="checkbox"
                checked={filters.categories?.includes(category.id) || false}
                onChange={(e) => {
                  updateFilter("categories", category.id, e.target.checked);
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 flex-1">
                {category.name}
              </span>
              <span className="text-xs text-gray-500">({category.count})</span>
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
              { label: "Under LKR 1000", min: 0, max: 1000 },
              { label: "LKR 1000 to LKR 5000", min: 1000, max: 5000 },
              { label: "LKR 5000 to $10000", min: 5000, max: 100000 },
              { label: "Over LKR 10000", min: 10000, max: null },
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

      {/* Shipping & Availability */}
      <FilterSection
        title="Shipping & Availability"
        icon={Truck}
        sectionKey="shipping"
      >
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-md p-1 -m-1 transition-colors">
            <input
              type="checkbox"
              checked={filters.freeShipping || false}
              onChange={(e) => {
                updateFilter("freeShipping", null, e.target.checked);
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Free Shipping</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-md p-1 -m-1 transition-colors">
            <input
              type="checkbox"
              checked={filters.inStock || false}
              onChange={(e) => {
                updateFilter("inStock", null, e.target.checked);
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">In Stock</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-md p-1 -m-1 transition-colors">
            <input
              type="checkbox"
              checked={filters.fastDelivery || false}
              onChange={(e) => {
                updateFilter("fastDelivery", null, e.target.checked);
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Fast Delivery (1-2 days)
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-md p-1 -m-1 transition-colors">
            <input
              type="checkbox"
              checked={filters.verified || false}
              onChange={(e) => {
                updateFilter("verified", null, e.target.checked);
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Verified Sellers</span>
          </label>
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
                type="checkbox"
                checked={filters.brands?.includes(brand.id) || false}
                onChange={(e) => {
                  updateFilter("brands", brand.id, e.target.checked);
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 flex-1">{brand.name}</span>
              <span className="text-xs text-gray-500">({brand.count})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Colors */}
      <FilterSection title="Colors" icon={Palette} sectionKey="color">
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => (
            <label
              key={color.id}
              className="flex flex-col items-center cursor-pointer group p-1 rounded-md hover:bg-gray-50 transition-colors"
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
                        color.hex === "#FFFFFF" ? "bg-gray-600" : "bg-white"
                      }`}
                    />
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-600 mt-1">{color.name}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Sizes */}
      <FilterSection title="Sizes" icon={Package} sectionKey="size">
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <label key={size.id} className="cursor-pointer">
              <input
                type="checkbox"
                checked={filters.sizes?.includes(size.id) || false}
                onChange={(e) => {
                  updateFilter("sizes", size.id, e.target.checked);
                }}
                className="sr-only"
              />
              <div
                className={`border-2 rounded-md p-2 text-center text-sm font-medium transition-all duration-200 hover:bg-gray-50 ${
                  filters.sizes?.includes(size.id)
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-300 hover:border-gray-400 text-gray-700"
                }`}
              >
                {size.name}
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Location */}
      <FilterSection
        title="Seller Location"
        icon={MapPin}
        sectionKey="location"
      >
        <div className="space-y-2">
          {locations.map((location) => (
            <label
              key={location.id}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-md p-1 -m-1 transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.locations?.includes(location.id) || false}
                onChange={(e) => {
                  updateFilter("locations", location.id, e.target.checked);
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 flex-1">
                {location.name}
              </span>
              <span className="text-xs text-gray-500">({location.count})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Condition */}
      <FilterSection title="Condition" icon={Shield} sectionKey="condition">
        <div className="space-y-2">
          {conditions.map((condition) => (
            <label
              key={condition.id}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-md p-1 -m-1 transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.conditions?.includes(condition.id) || false}
                onChange={(e) => {
                  updateFilter("conditions", condition.id, e.target.checked);
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 flex-1">
                {condition.name}
              </span>
              <span className="text-xs text-gray-500">({condition.count})</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

export default SearchFilters;
