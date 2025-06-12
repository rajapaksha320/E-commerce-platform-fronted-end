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
    shipping: true,
    availability: true,
    brand: false,
    color: false,
    size: false,
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
    } else if (filterType === "freeShipping" || filterType === "inStock") {
      newFilters[filterType] = checked;
    } else {
      // For multi-select filters like categories, brands, colors, sizes
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
    { id: "electronics", name: "Electronics", count: 156 },
    { id: "clothing", name: "Clothing", count: 324 },
    { id: "accessories", name: "Accessories", count: 89 },
    { id: "home", name: "Home & Garden", count: 67 },
    { id: "sports", name: "Sports & Outdoors", count: 234 },
    { id: "books", name: "Books", count: 45 },
    { id: "toys", name: "Toys & Games", count: 78 },
  ];

  const brands = [
    { id: "apple", name: "Apple", count: 45 },
    { id: "samsung", name: "Samsung", count: 38 },
    { id: "nike", name: "Nike", count: 67 },
    { id: "adidas", name: "Adidas", count: 54 },
    { id: "sony", name: "Sony", count: 29 },
    { id: "lg", name: "LG", count: 23 },
  ];

  const colors = [
    { id: "black", name: "Black", hex: "#000000", count: 89 },
    { id: "white", name: "White", hex: "#FFFFFF", count: 76 },
    { id: "blue", name: "Blue", hex: "#3B82F6", count: 65 },
    { id: "red", name: "Red", hex: "#EF4444", count: 54 },
    { id: "green", name: "Green", hex: "#10B981", count: 43 },
    { id: "yellow", name: "Yellow", hex: "#F59E0B", count: 32 },
    { id: "purple", name: "Purple", hex: "#8B5CF6", count: 28 },
    { id: "gray", name: "Gray", hex: "#6B7280", count: 67 },
  ];

  const sizes = [
    { id: "xs", name: "XS", count: 23 },
    { id: "s", name: "S", count: 45 },
    { id: "m", name: "M", count: 67 },
    { id: "l", name: "L", count: 56 },
    { id: "xl", name: "XL", count: 34 },
    { id: "xxl", name: "XXL", count: 28 },
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

      {/* Categories */}
      <FilterSection title="Categories" icon={Tag} sectionKey="categories">
        <div className="space-y-2">
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
              { label: "Under $25", min: 0, max: 25 },
              { label: "$25 to $50", min: 25, max: 50 },
              { label: "$50 to $100", min: 50, max: 100 },
              { label: "$100 to $200", min: 100, max: 200 },
              { label: "Over $200", min: 200, max: null },
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
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brands" icon={Package} sectionKey="brand">
        <div className="space-y-2">
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
    </div>
  );
};

export default FilterSidebar;
