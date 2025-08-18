/* eslint-disable no-unused-vars */
import React, { useState } from "react";
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
} from "lucide-react";
import { Button, Badge } from "../../ui/ContactUis/Uis";

const FilterSidebar = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className = "",
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
    brand: false,
    color: false,
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
    } else if (filterType === "categories" || filterType === "brands") {
      // For single-select filters (radio buttons) like categories and brands
      newFilters[filterType] = checked ? value : null;
    } else {
      // For multi-select filters like colors
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

  // Categories mapping for the API
  const categories = [
    { id: "electronics", name: "Electronics"},
    { id: "fashion", name: "Fashion" },
    { id: "home", name: "Home & Garden"},
    { id: "sports", name: "Sports & Outdoors" },
    { id: "books", name: "Books"},
    { id: "toys", name: "Toys & Games" },
    { id: "beauty", name: "Beauty & Personal Care" },
    { id: "automotive", name: "Automotive" },
  ];

  // Common brands that might be in the system
  const brands = [
    { id: "Apple", name: "Apple"},
    { id: "Samsung", name: "Samsung"},
    { id: "Nike", name: "Nike"},
    { id: "Adidas", name: "Adidas"},
    { id: "Sony", name: "Sony"},
    { id: "LG", name: "LG" },
    { id: "HP", name: "HP" },
    { id: "Dell", name: "Dell" },
  ];

  // Color options
  const colors = [
    { id: "black", name: "Black", hex: "#000000", count: 89 },
    { id: "white", name: "White", hex: "#FFFFFF", count: 76 },
    { id: "blue", name: "Blue", hex: "#3B82F6", count: 65 },
    { id: "red", name: "Red", hex: "#EF4444", count: 54 },
    { id: "green", name: "Green", hex: "#10B981", count: 43 },
    { id: "yellow", name: "Yellow", hex: "#F59E0B", count: 32 },
    { id: "purple", name: "Purple", hex: "#8B5CF6", count: 28 },
    { id: "gray", name: "Gray", hex: "#6B7280", count: 67 },
    { id: "pink", name: "Pink", hex: "#EC4899", count: 25 },
    { id: "orange", name: "Orange", hex: "#F97316", count: 20 },
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
    } else if (filter && typeof filter === "object" && filter !== null) {
      return count + (filter.min || filter.max ? 1 : 0);
    } else if (filter && typeof filter !== "object") {
      return count + 1;
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

      {/* Categories */}
      <FilterSection title="Categories" icon={Tag} sectionKey="categories">
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-md p-1 -m-1 transition-colors"
            >
              <input
                type="radio"
                name="categories"
                checked={filters.categories === category.id}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateFilter("categories", category.id, true);
                  }
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
              { label: "Under LKR 1,000", min: 0, max: 1000 },
              { label: "LKR 1,000 - LKR 5,000", min: 1000, max: 5000 },
              { label: "LKR 5,000 - LKR 20,000", min: 5000, max: 20000 },
              { label: "LKR 20,000 - LKR 50,000", min: 20000, max: 50000 },
              { label: "Over LKR 50,000", min: 50000, max: null },
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
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <label
              key={brand.id}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-md p-1 -m-1 transition-colors"
            >
              <input
                type="radio"
                name="brands"
                checked={filters.brands === brand.id}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateFilter("brands", brand.id, true);
                  }
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
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 mb-1 ${
                  filters.colors?.includes(color.id)
                    ? "border-blue-600 scale-110 shadow-md"
                    : "border-gray-300 group-hover:border-gray-400"
                } ${color.hex === "#FFFFFF" ? "border-gray-400" : ""}`}
                style={{ backgroundColor: color.hex }}
              >
                {filters.colors?.includes(color.id) && (
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        color.hex === "#FFFFFF" || color.hex === "#F59E0B"
                          ? "bg-gray-600"
                          : "bg-white"
                      }`}
                    />
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-600 text-center leading-tight">
                {color.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterSidebar;
