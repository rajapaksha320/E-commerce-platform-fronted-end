/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  MoreHorizontal,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Heart,
  Share2,
  BarChart3,
  PlusCircle,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  Settings,
} from "lucide-react";

// Import debounce utility
import { debounce } from "../../../../utils/debounce";

// Import Redux hooks
import {
  useListings,
  useListingDetails,
  usePagination,
  useSearch,
  useSelectedListings,
} from "../../../../hooks/useSellerData";

// Import UI components
import {
  Button,
  IconButton,
  Select,
  Checkbox,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Modal,
  ModalContent,
  ModalFooter,
  Avatar,
  FormField,
  Textarea,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Alert,
  SearchInput,
  LoadingSpinner,
} from "../../../ui/sellerUis/Uis";

import ListingDetails from "./ListingDetails";

const ListingManagement = ({ activeSection = "all-listings", backendStatus = null }) => {
  const navigate = useNavigate();
  
  // Redux hooks
  const {
    listings,
    statusCounts,
    statistics,
    isLoading,
    error,
    success,
    message,
    createNewListing,
    updateExistingListing,
    deleteExistingListing,
    fetchByStatus,
    applyFilters,
    resetFilters,
    bulkUpdate,
    bulkDelete,
    refreshListings,
    clearMessages,
  } = useListings();

  const {
    goToPage,
    changePageSize,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
    page,
    pageSize,
    total,
    totalPages,
  } = usePagination();

  const {
    selectedIds,
    selectedCount,
    selectListing,
    deselectListing,
    toggleListing,
    selectAll,
    clearSelection,
    performBulkUpdate,
    performBulkDelete,
  } = useSelectedListings();

  // Local state
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [bulkAction, setBulkAction] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPriceRange, setFilterPriceRange] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);
  const [showListingDetails, setShowListingDetails] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Categories for filtering - matching the backend
  const categories = [
    { value: "electronics", label: "Electronics" },
    { value: "fashion", label: "Fashion" },
    { value: "home", label: "Home & Garden" },
    { value: "sports", label: "Sports & Outdoors" },
    { value: "automotive", label: "Automotive" },
  ];

  const priceRanges = [
    { value: "0-100", label: "$0 - $100" },
    { value: "100-500", label: "$100 - $500" },
    { value: "500-1000", label: "$500 - $1,000" },
    { value: "1000-5000", label: "$1,000+" },
  ];

  // Debounced filter function using the utility
  const debouncedApplyFilters = useCallback(
    debounce(async (filterParams) => {
      try {
        setIsSearching(true);
        console.log('Applying filters:', filterParams);
        await applyFilters(filterParams);
      } catch (error) {
        console.error("Error applying filters:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [applyFilters]
  );

  // Load listings based on active section and backend status
  useEffect(() => {
    const loadListings = async () => {
      try {
        console.log('Loading listings for section:', activeSection, 'Backend status:', backendStatus);
        
        if (backendStatus) {
          // Use status-specific fetch for specific statuses
          await fetchByStatus(backendStatus);
        } else {
          // For "all-listings", fetch all listings
          await refreshListings();
        }
      } catch (error) {
        console.error("Error loading listings:", error);
      }
    };

    loadListings();
  }, [activeSection, backendStatus]);

  // Handle search with debouncing
  useEffect(() => {
    const buildFilterParams = () => {
      const params = {};
      
      // Add search if present
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      
      // Add category filter
      if (filterCategory) {
        params.category = filterCategory;
      }
      
      // Add price range filter
      if (filterPriceRange) {
        params.priceRange = filterPriceRange;
      }
      
      // Add status filter
      if (filterStatus) {
        params.status = filterStatus;
      } else if (backendStatus) {
        // Use section status if no explicit filter
        params.status = backendStatus;
      }
      
      // Add pagination
      params.page = 1;
      params.pageSize = 10;
      
      return params;
    };

    // Only apply filters if there are actual filter parameters
    const filterParams = buildFilterParams();
    const hasFilters = Object.keys(filterParams).some(key => 
      key !== 'page' && key !== 'pageSize' && filterParams[key]
    );

    if (hasFilters) {
      console.log('Triggering search/filter with params:', filterParams);
      debouncedApplyFilters(filterParams);
    } else if (!searchQuery && !filterCategory && !filterPriceRange && !filterStatus) {
      // If no filters, reload based on section
      if (backendStatus) {
        fetchByStatus(backendStatus);
      } else {
        refreshListings();
      }
    }
  }, [searchQuery, filterCategory, filterPriceRange, filterStatus, backendStatus, debouncedApplyFilters, fetchByStatus, refreshListings]);

  // Clear messages when component unmounts or success/error changes
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, clearMessages]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterType, value) => {
    console.log(`Filter change: ${filterType} = ${value}`);
    
    if (filterType === 'category') {
      setFilterCategory(value);
    } else if (filterType === 'priceRange') {
      setFilterPriceRange(value);
    } else if (filterType === 'status') {
      setFilterStatus(value);
    }
  }, []);

  // Handle search change
  const handleSearchChange = useCallback((value) => {
    console.log('Search change:', value);
    setSearchQuery(value);
  }, []);

  // Handle reset filters
  const handleResetFilters = useCallback(async () => {
    try {
      console.log('Resetting filters');
      setSearchQuery("");
      setFilterCategory("");
      setFilterPriceRange("");
      setFilterStatus("");
      
      await resetFilters();
      
      // Reload based on section after resetting filters
      if (backendStatus) {
        await fetchByStatus(backendStatus);
      } else {
        await refreshListings();
      }
    } catch (error) {
      console.error("Error resetting filters:", error);
    }
  }, [resetFilters, backendStatus, fetchByStatus, refreshListings]);

  // Get section configuration
  const getSectionConfig = () => {
    const configs = {
      "all-listings": {
        title: "All Listings",
        description: "Complete overview of all your product listings",
        showColumns: [
          "listing",
          "category",
          "price",
          "quantity",
          "sold",
          "status",
          "performance",
          "actions",
        ],
      },
      "active-listings": {
        title: "Active Listings",
        description: "Currently live and selling products",
        showColumns: [
          "listing",
          "price",
          "quantity",
          "sold",
          "performance",
          "actions",
        ],
      },
      "inactive-listings": {
        title: "Inactive Listings",
        description: "Paused or temporarily disabled listings",
        showColumns: [
          "listing",
          "category",
          "price",
          "quantity",
          "lastModified",
          "actions",
        ],
      },
      "out-of-stock": {
        title: "Out of Stock",
        description: "Products that need restocking",
        showColumns: [
          "listing",
          "category",
          "price",
          "sold",
          "lastModified",
          "actions",
        ],
      },
      "draft-listings": {
        title: "Draft Listings",
        description: "Unpublished listings being prepared",
        showColumns: [
          "listing",
          "category",
          "price",
          "quantity",
          "lastModified",
          "actions",
        ],
      },
      "sold-listings": {
        title: "Sold Items",
        description: "Products with sales history",
        showColumns: [
          "listing",
          "category",
          "price",
          "sold",
          "revenue",
          "performance",
          "actions",
        ],
      },
    };

    return configs[activeSection] || configs["all-listings"];
  };

  const config = getSectionConfig();

  // Helper functions
  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "inactive":
        return <Pause className="h-4 w-4" />;
      case "outOfStock":
        return <AlertTriangle className="h-4 w-4" />;
      case "draft":
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "warning";
      case "outOfStock":
        return "danger";
      case "draft":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "outOfStock":
        return "Out of Stock";
      case "draft":
        return "Draft";
      case "sold":
        return "Sold";
      default:
        return status || "Unknown";
    }
  };

  // Action handlers
  const handleCreateListing = () => {
    navigate("/create-listing");
  };

  const handleViewListing = (listing) => {
    setSelectedListing(listing);
    setShowListingDetails(true);
  };

  const handleEditListing = (listing) => {
    navigate("/create-listing", {
      state: {
        product: listing,
        isEditing: true,
      },
    });
  };

  const handleDuplicateListing = (listing) => {
    navigate("/create-listing", {
      state: {
        product: listing,
        isDuplicating: true,
      },
    });
  };

  const handleDeleteListing = (listing) => {
    setListingToDelete(listing);
    setShowDeleteModal(true);
  };

  const confirmDeletion = async () => {
    if (listingToDelete) {
      try {
        await deleteExistingListing(listingToDelete._id || listingToDelete.id);
        setShowDeleteModal(false);
        setListingToDelete(null);
        clearSelection();
      } catch (error) {
        console.error("Error deleting listing:", error);
      }
    }
  };

  const handleStatusChange = async (listing, newStatus) => {
    try {
      await updateExistingListing(listing._id || listing.id, { status: newStatus });
    } catch (error) {
      console.error("Error updating listing status:", error);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedCount === 0) return;

    try {
      await performBulkUpdate({ status: bulkAction });
      setShowBulkActionModal(false);
      setBulkAction("");
      clearSelection();
    } catch (error) {
      console.error("Error performing bulk action:", error);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = () => {
    if (selectedCount === listings.length && listings.length > 0) {
      clearSelection();
    } else {
      selectAll(listings.map((listing) => listing._id || listing.id));
    }
  };

  const handleRefresh = async () => {
    try {
      if (backendStatus) {
        await fetchByStatus(backendStatus);
      } else {
        await refreshListings();
      }
    } catch (error) {
      console.error("Error refreshing listings:", error);
    }
  };

  const handleListingUpdate = async (updatedListing, action) => {
    if (action === "delete") {
      await deleteExistingListing(selectedListing._id || selectedListing.id);
    } else if (updatedListing) {
      await updateExistingListing(selectedListing._id || selectedListing.id, updatedListing);
    }
    setShowListingDetails(false);
    setSelectedListing(null);
  };

  // Calculate performance metrics
  const getPerformanceMetrics = (listing) => {
    const views = listing.views || 0;
    const sold = listing.sold || 0;
    const favorites = listing.favorites || 0;
    
    const conversionRate = views > 0 ? (sold / views) * 100 : 0;
    const price = listing.variations?.length > 0 
      ? listing.variations.find(v => v.isDefault)?.price || listing.variations[0]?.price || listing.price
      : listing.price;
    const revenue = sold * (parseFloat(price) || 0);

    return {
      conversionRate: conversionRate.toFixed(1),
      revenue,
      favoriteRate: views > 0 ? (favorites / views) * 100 : 0,
    };
  };

  // Extract price from listing (handle variations)
  const getListingPrice = (listing) => {
    if (listing.variations?.length > 0) {
      const defaultVariation = listing.variations.find(v => v.isDefault) || listing.variations[0];
      return {
        price: defaultVariation.price,
        originalPrice: defaultVariation.originalPrice,
      };
    }
    return {
      price: listing.price,
      originalPrice: listing.originalPrice,
    };
  };

  // Extract quantity from listing (handle variations)
  const getListingQuantity = (listing) => {
    if (listing.variations?.length > 0) {
      return listing.variations.reduce((total, variation) => {
        return total + (parseInt(variation.quantity) || 0);
      }, 0);
    }
    return parseInt(listing.quantity) || 0;
  };

  // Extract main image from listing - FIXED to prioritize main product images
  const getListingImage = (listing) => {
    let imageUrl = null;
    
    // First try to get image from main product images
    if (listing.images?.length > 0) {
      const image = listing.images[0];
      imageUrl = typeof image === 'string' ? image : image?.url;
    }
    
    // Only fallback to variation images if no main images exist
    if (!imageUrl && listing.variations?.length > 0) {
      const defaultVariation = listing.variations.find(v => v.isDefault) || listing.variations[0];
      if (defaultVariation.images?.length > 0) {
        const image = defaultVariation.images[0];
        imageUrl = typeof image === 'string' ? image : image?.url;
      }
    }
    
    return imageUrl || "/placehold.png";
  };

  // Sort listings
  const sortedListings = React.useMemo(() => {
    if (!listings.length) return [];
    
    return [...listings].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle special cases
      if (sortField === "price") {
        const aPricing = getListingPrice(a);
        const bPricing = getListingPrice(b);
        aValue = parseFloat(aPricing.price) || 0;
        bValue = parseFloat(bPricing.price) || 0;
      }
      
      if (sortField === "quantity") {
        aValue = getListingQuantity(a);
        bValue = getListingQuantity(b);
      }
      
      if (sortField === "createdAt" || sortField === "updatedAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [listings, sortField, sortDirection]);

  const hasActiveFilters = searchQuery || filterCategory || filterPriceRange || filterStatus;
  const currentIsLoading = isLoading || isSearching;

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {(success || error) && (
        <Alert
          variant={success ? "success" : "danger"}
          title={success ? "Success" : "Error"}
          onClose={clearMessages}
          className="z-10 relative"
        >
          {message || error}
        </Alert>
      )}

      {/* Header with Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-3">
                <Package className="h-6 w-6 text-blue-600" />
                {config.title}
                {backendStatus && (
                  <Badge variant="secondary" size="sm">
                    Status: {getStatusLabel(backendStatus)}
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">{config.description}</p>
            </div>

            <div className="flex items-center gap-3">
              {currentIsLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <LoadingSpinner size="sm" />
                  <span>Loading...</span>
                </div>
              )}
              <Button
                variant="primary"
                icon={<PlusCircle />}
                onClick={handleCreateListing}
                disabled={currentIsLoading}
              >
                Add Listing
              </Button>
              <Button 
                variant="secondary" 
                icon={<RefreshCw />}
                onClick={handleRefresh}
                disabled={currentIsLoading}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-4 mt-4">
            {/* Active Filters Indicator */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="h-4 w-4" />
                <span>Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="text-xs">
                    Search: "{searchQuery}"
                  </Badge>
                )}
                {filterStatus && (
                  <Badge variant="secondary" className="text-xs">
                    Status: {getStatusLabel(filterStatus)}
                  </Badge>
                )}
                {filterCategory && (
                  <Badge variant="secondary" className="text-xs">
                    Category: {categories.find(c => c.value === filterCategory)?.label}
                  </Badge>
                )}
                {filterPriceRange && (
                  <Badge variant="secondary" className="text-xs">
                    Price: {priceRanges.find(r => r.value === filterPriceRange)?.label}
                  </Badge>
                )}
              </div>
            )}
            
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <SearchInput
                  placeholder="Search listings by title, SKU, or tags..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  disabled={currentIsLoading}
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <LoadingSpinner size="sm" />
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {/* Only show status filter for all-listings */}
                {activeSection === "all-listings" && (
                  <Select
                    value={filterStatus}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    disabled={currentIsLoading}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                    <option value="outOfStock">Out of Stock</option>
                    <option value="sold">Sold</option>
                  </Select>
                )}

                <Select
                  value={filterCategory}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  disabled={currentIsLoading}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </Select>

                <Select
                  value={filterPriceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  disabled={currentIsLoading}
                >
                  <option value="">All Prices</option>
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </Select>

                <Button
                  variant="secondary"
                  icon={<RefreshCw />}
                  onClick={handleResetFilters}
                  disabled={currentIsLoading || !hasActiveFilters}
                  title="Reset all filters and search"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Listings Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">
                {total || listings.length}{" "}
                {(total || listings.length) === 1 ? "Listing" : "Listings"}
              </h3>
              {selectedCount > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {selectedCount} selected
                  </span>
                  <Button
                    size="sm"
                    onClick={() => setShowBulkActionModal(true)}
                  >
                    Bulk Actions
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <IconButton 
                  variant="ghost" 
                  size="sm"
                  onClick={previousPage}
                  disabled={!hasPreviousPage || currentIsLoading}
                >
                  ←
                </IconButton>
                <IconButton 
                  variant="ghost" 
                  size="sm"
                  onClick={nextPage}
                  disabled={!hasNextPage || currentIsLoading}
                >
                  →
                </IconButton>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 relative">
          {currentIsLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="flex items-center gap-3 text-gray-600">
                <LoadingSpinner size="md" />
                <span className="text-sm font-medium">Loading listings...</span>
              </div>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      selectedCount === listings.length &&
                      listings.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </TableHead>

                {config.showColumns.includes("listing") && (
                  <TableHead
                    sortable
                    onSort={() => handleSort("title")}
                    sortDirection={sortField === "title" ? sortDirection : null}
                  >
                    Listing
                  </TableHead>
                )}

                {config.showColumns.includes("category") && (
                  <TableHead
                    sortable
                    onSort={() => handleSort("category")}
                    sortDirection={
                      sortField === "category" ? sortDirection : null
                    }
                  >
                    Category
                  </TableHead>
                )}

                {config.showColumns.includes("price") && (
                  <TableHead
                    sortable
                    onSort={() => handleSort("price")}
                    sortDirection={sortField === "price" ? sortDirection : null}
                  >
                    Price
                  </TableHead>
                )}

                {config.showColumns.includes("quantity") && (
                  <TableHead
                    sortable
                    onSort={() => handleSort("quantity")}
                    sortDirection={
                      sortField === "quantity" ? sortDirection : null
                    }
                  >
                    Stock
                  </TableHead>
                )}

                {config.showColumns.includes("sold") && (
                  <TableHead
                    sortable
                    onSort={() => handleSort("sold")}
                    sortDirection={sortField === "sold" ? sortDirection : null}
                  >
                    Sold
                  </TableHead>
                )}

                {config.showColumns.includes("status") && (
                  <TableHead
                    sortable
                    onSort={() => handleSort("status")}
                    sortDirection={
                      sortField === "status" ? sortDirection : null
                    }
                  >
                    Status
                  </TableHead>
                )}

                {config.showColumns.includes("performance") && (
                  <TableHead>Performance</TableHead>
                )}

                {config.showColumns.includes("revenue") && (
                  <TableHead sortable onSort={() => handleSort("revenue")}>
                    Revenue
                  </TableHead>
                )}

                {config.showColumns.includes("lastModified") && (
                  <TableHead
                    sortable
                    onSort={() => handleSort("updatedAt")}
                    sortDirection={
                      sortField === "updatedAt" ? sortDirection : null
                    }
                  >
                    Last Modified
                  </TableHead>
                )}

                {config.showColumns.includes("actions") && (
                  <TableHead>Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedListings.map((listing) => {
                const metrics = getPerformanceMetrics(listing);
                const listingId = listing._id || listing.id;
                const pricing = getListingPrice(listing);
                const quantity = getListingQuantity(listing);
                const imageUrl = getListingImage(listing);

                return (
                  <TableRow key={listingId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(listingId)}
                        onChange={() => toggleListing(listingId)}
                      />
                    </TableCell>

                    {config.showColumns.includes("listing") && (
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={imageUrl}
                            alt={listing.title}
                            className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                            onError={(e) => {
                              e.target.src = "/placehold.png";
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 truncate">
                              {listing.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              SKU: {listing.sku || listing.id}
                            </div>
                            {listing.hasVariations && (
                              <div className="text-xs text-blue-600">
                                {listing.variations?.length || 0} variations
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    )}

                    {config.showColumns.includes("category") && (
                      <TableCell>
                        <div className="text-sm text-gray-900">
                          {listing.category?.main || listing.category}
                        </div>
                        <div className="text-xs text-gray-500">
                          {listing.category?.sub || listing.subcategory}
                        </div>
                      </TableCell>
                    )}

                    {config.showColumns.includes("price") && (
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900">
                          ${parseFloat(pricing.price || 0).toLocaleString()}
                        </div>
                        {pricing.originalPrice && pricing.originalPrice > pricing.price && (
                          <div className="text-xs text-gray-500 line-through">
                            ${parseFloat(pricing.originalPrice).toLocaleString()}
                          </div>
                        )}
                      </TableCell>
                    )}

                    {config.showColumns.includes("quantity") && (
                      <TableCell>
                        <div
                          className={`text-sm font-medium ${
                            quantity === 0
                              ? "text-red-600"
                              : quantity < 5
                              ? "text-orange-600"
                              : "text-gray-900"
                          }`}
                        >
                          {quantity}
                        </div>
                        {quantity < 5 && quantity > 0 && (
                          <div className="text-xs text-orange-500">
                            Low stock
                          </div>
                        )}
                      </TableCell>
                    )}

                    {config.showColumns.includes("sold") && (
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900">
                          {listing.sold || 0}
                        </div>
                      </TableCell>
                    )}

                    {config.showColumns.includes("status") && (
                      <TableCell>
                        <Badge
                          variant={getStatusVariant(listing.status)}
                          icon={getStatusIcon(listing.status)}
                        >
                          {getStatusLabel(listing.status)}
                        </Badge>
                      </TableCell>
                    )}

                    {config.showColumns.includes("performance") && (
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Eye className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {listing.views || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Heart className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {listing.favorites || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {metrics.conversionRate}%
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    )}

                    {config.showColumns.includes("revenue") && (
                      <TableCell>
                        <div className="text-sm font-medium text-green-600">
                          ${metrics.revenue.toLocaleString()}
                        </div>
                      </TableCell>
                    )}

                    {config.showColumns.includes("lastModified") && (
                      <TableCell>
                        <div className="text-sm text-gray-900">
                          {new Date(listing.updatedAt || listing.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                    )}

                    {config.showColumns.includes("actions") && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <IconButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewListing(listing)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </IconButton>

                          <IconButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditListing(listing)}
                            title="Edit Listing"
                          >
                            <Edit className="h-4 w-4" />
                          </IconButton>

                          <IconButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicateListing(listing)}
                            title="Duplicate Listing"
                          >
                            <Copy className="h-4 w-4" />
                          </IconButton>

                          {listing.status === "active" ? (
                            <IconButton
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(listing, "inactive")
                              }
                              title="Pause Listing"
                              className="text-orange-600 hover:text-orange-900"
                            >
                              <Pause className="h-4 w-4" />
                            </IconButton>
                          ) : (
                            <IconButton
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(listing, "active")
                              }
                              title="Activate Listing"
                              className="text-green-600 hover:text-green-900"
                            >
                              <Play className="h-4 w-4" />
                            </IconButton>
                          )}

                          <IconButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteListing(listing)}
                            title="Delete Listing"
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Empty State */}
          {!currentIsLoading && sortedListings.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No listings found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {hasActiveFilters
                  ? "Try adjusting your filters or search terms."
                  : `No ${config.title.toLowerCase()} available.`}
              </p>
              {!hasActiveFilters && (
                <Button
                  variant="primary"
                  icon={<PlusCircle />}
                  className="mt-4"
                  onClick={handleCreateListing}
                >
                  Create Your First Listing
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Listing"
        size="md"
      >
        <ModalContent className="space-y-4">
          <Alert variant="danger" title={`Delete "${listingToDelete?.title}"`}>
            This action cannot be undone. The listing will be permanently
            removed.
          </Alert>

          {listingToDelete && (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={getListingImage(listingToDelete)}
                    alt={listingToDelete.title}
                    className="h-16 w-16 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src = "/placehold.png";
                    }}
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {listingToDelete.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      SKU: {listingToDelete.sku || listingToDelete.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {listingToDelete.sold || 0} sold • ${getListingPrice(listingToDelete).price || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </ModalContent>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDeletion} 
            icon={<Trash2 />}
            disabled={currentIsLoading}
          >
            {currentIsLoading ? "Deleting..." : "Delete Listing"}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Bulk Action Modal */}
      <Modal
        isOpen={showBulkActionModal}
        onClose={() => setShowBulkActionModal(false)}
        title="Bulk Actions"
        size="md"
      >
        <ModalContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Apply action to {selectedCount} selected listings
            </p>

            <FormField label="Action" required>
              <Select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                placeholder="Select an action..."
              >
                <option value="active">Activate Listings</option>
                <option value="inactive">Pause Listings</option>
                <option value="draft">Move to Draft</option>
              </Select>
            </FormField>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => setShowBulkActionModal(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleBulkAction}
            disabled={!bulkAction || currentIsLoading}
          >
            {currentIsLoading ? "Applying..." : "Apply Action"}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Listing Details Modal */}
      {showListingDetails && selectedListing && (
        <ListingDetails
          listing={selectedListing}
          onClose={() => {
            setShowListingDetails(false);
            setSelectedListing(null);
          }}
          onListingUpdate={handleListingUpdate}
        />
      )}
    </div>
  );
};

export default ListingManagement;