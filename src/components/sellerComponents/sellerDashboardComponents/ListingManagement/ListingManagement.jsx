import React, { useState, useMemo } from "react";
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
} from "../../../ui/sellerUis/Uis";

const ListingManagement = ({ activeSection = "all-listings" }) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState("createdDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedListings, setSelectedListings] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [bulkAction, setBulkAction] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPriceRange, setFilterPriceRange] = useState("");
  const [listings, setListings] = useState([]);

  // Complete listings dataset
  const allListingsData = [
    {
      id: "1",
      title: "iPhone 15 Pro Max 256GB - Natural Titanium",
      description:
        "Brand new iPhone 15 Pro Max with 256GB storage in Natural Titanium color. Comes with original box and all accessories.",
      sku: "IPH15PM-256-NT",
      category: "Electronics",
      subcategory: "Smartphones",
      brand: "Apple",
      price: 1199.0,
      originalPrice: 1299.0,
      quantity: 25,
      sold: 15,
      status: "active",
      condition: "new",
      visibility: "public",
      createdDate: "2024-06-01",
      lastModified: "2024-06-15",
      views: 1250,
      favorites: 89,
      images: [
        {
          id: "1",
          url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
          name: "main.jpg",
        },
        {
          id: "2",
          url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop",
          name: "side.jpg",
        },
      ],
      colors: [
        { id: "1", name: "Natural Titanium", hex: "#C0C0C0" },
        { id: "2", name: "Blue Titanium", hex: "#1E40AF" },
        { id: "3", name: "White Titanium", hex: "#FFFFFF" },
        { id: "4", name: "Black Titanium", hex: "#000000" },
      ],
      sizes: ["256GB"],
      tags: ["iphone", "apple", "smartphone", "5g", "titanium"],
      features: ["5G Compatible", "48MP Camera", "Titanium Build", "USB-C"],
      rating: 4.8,
      reviews: 45,
      weight: "221",
      dimensions: { length: "6.3", width: "3.1", height: "0.3" },
      shippingWeight: "350",
      shippingClass: "express",
      returnPolicy: "30",
      warranty: "1 Year Apple Limited Warranty",
      metaTitle: "iPhone 15 Pro Max 256GB Natural Titanium - Best Price",
      metaDescription:
        "Get the latest iPhone 15 Pro Max with 256GB storage. Free shipping, authentic warranty.",
      shipping: {
        weight: 0.5,
        dimensions: "6.3 x 3.1 x 0.3 inches",
        freeShipping: true,
        expedited: true,
      },
      seo: {
        metaTitle: "iPhone 15 Pro Max 256GB Natural Titanium - Best Price",
        metaDescription:
          "Get the latest iPhone 15 Pro Max with 256GB storage. Free shipping, authentic warranty.",
        keywords: ["iphone 15 pro max", "256gb", "natural titanium"],
      },
    },
    {
      id: "2",
      title: "MacBook Air M3 13-inch - Midnight",
      description:
        "Latest MacBook Air with M3 chip, 13-inch Liquid Retina display, 8GB RAM, 256GB SSD in Midnight color.",
      sku: "MBA-M3-13-MD",
      category: "Electronics",
      subcategory: "Laptops",
      brand: "Apple",
      price: 1099.0,
      originalPrice: 1199.0,
      quantity: 12,
      sold: 8,
      status: "active",
      condition: "new",
      visibility: "public",
      createdDate: "2024-05-28",
      lastModified: "2024-06-14",
      views: 890,
      favorites: 67,
      images: [
        {
          id: "1",
          url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
          name: "macbook-main.jpg",
        },
      ],
      colors: [
        { id: "1", name: "Midnight", hex: "#191970" },
        { id: "2", name: "Starlight", hex: "#F5F5DC" },
        { id: "3", name: "Silver", hex: "#C0C0C0" },
        { id: "4", name: "Space Gray", hex: "#696969" },
      ],
      sizes: ["13-inch"],
      tags: ["macbook", "apple", "laptop", "m3", "ultrabook"],
      features: ["M3 Chip", "13-inch Display", "8GB RAM", "256GB SSD"],
      rating: 4.9,
      reviews: 32,
      weight: "1200",
      dimensions: { length: "11.97", width: "8.46", height: "0.44" },
      shippingWeight: "1350",
      shippingClass: "standard",
      returnPolicy: "30",
      warranty: "1 Year Apple Limited Warranty",
      metaTitle: "MacBook Air M3 13-inch Midnight - Latest Apple Laptop",
      metaDescription:
        "Latest MacBook Air with M3 chip and 13-inch display. Perfect for professionals and students.",
    },
    {
      id: "3",
      title: "Samsung Galaxy S24 Ultra 512GB - Titanium Black",
      description:
        "Samsung's flagship smartphone with S Pen, 200MP camera, and AI features. 512GB storage model.",
      sku: "SGS24U-512-TB",
      category: "Electronics",
      subcategory: "Smartphones",
      brand: "Samsung",
      price: 1299.99,
      originalPrice: 1399.99,
      quantity: 0,
      sold: 20,
      status: "out-of-stock",
      condition: "new",
      visibility: "public",
      createdDate: "2024-05-25",
      lastModified: "2024-06-12",
      views: 2100,
      favorites: 156,
      images: [
        {
          id: "1",
          url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
          name: "galaxy-main.jpg",
        },
      ],
      colors: [
        { id: "1", name: "Titanium Black", hex: "#2F2F2F" },
        { id: "2", name: "Titanium Gray", hex: "#808080" },
        { id: "3", name: "Titanium Violet", hex: "#8A2BE2" },
        { id: "4", name: "Titanium Yellow", hex: "#FFD700" },
      ],
      sizes: ["512GB"],
      tags: ["samsung", "galaxy", "s24", "ultra", "android", "s-pen"],
      features: ["S Pen", "200MP Camera", "AI Features", "512GB Storage"],
      rating: 4.7,
      reviews: 78,
      weight: "232",
      dimensions: { length: "6.4", width: "3.1", height: "0.34" },
      shippingWeight: "380",
      shippingClass: "express",
      returnPolicy: "30",
      warranty: "1 Year Samsung Warranty",
      metaTitle:
        "Samsung Galaxy S24 Ultra 512GB Titanium Black - Flagship Smartphone",
      metaDescription:
        "Samsung's most advanced smartphone with S Pen, 200MP camera, and AI features.",
    },
    {
      id: "4",
      title: 'iPad Pro 12.9" M4 WiFi 256GB - Space Black',
      description:
        "Most advanced iPad Pro with M4 chip, 12.9-inch Liquid Retina XDR display, perfect for professionals.",
      sku: "IPADPM4-256-SB",
      category: "Electronics",
      subcategory: "Tablets",
      brand: "Apple",
      price: 1099.0,
      originalPrice: 1199.0,
      quantity: 18,
      sold: 12,
      status: "active",
      condition: "new",
      visibility: "public",
      createdDate: "2024-05-20",
      lastModified: "2024-06-10",
      views: 1450,
      favorites: 98,
      images: [
        {
          id: "1",
          url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
          name: "ipad-main.jpg",
        },
      ],
      colors: [
        { id: "1", name: "Space Black", hex: "#2F2F2F" },
        { id: "2", name: "Silver", hex: "#C0C0C0" },
      ],
      sizes: ["12.9-inch"],
      tags: ["ipad", "pro", "m4", "tablet", "apple", "professional"],
      features: ["M4 Chip", "12.9-inch Display", "WiFi 6E", "256GB Storage"],
      rating: 4.8,
      reviews: 56,
      weight: "682",
      dimensions: { length: "11.04", width: "8.48", height: "0.25" },
      shippingWeight: "850",
      shippingClass: "standard",
      returnPolicy: "30",
      warranty: "1 Year Apple Limited Warranty",
      metaTitle: "iPad Pro 12.9 M4 WiFi 256GB Space Black - Pro Tablet",
      metaDescription:
        "Most advanced iPad Pro with M4 chip and 12.9-inch display. Perfect for creative professionals.",
    },
    {
      id: "5",
      title: "AirPods Pro 2nd Generation USB-C",
      description:
        "Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio with USB-C charging case.",
      sku: "APP2-USB-C",
      category: "Electronics",
      subcategory: "Audio",
      brand: "Apple",
      price: 199.0,
      originalPrice: 249.0,
      quantity: 45,
      sold: 89,
      status: "active",
      condition: "new",
      visibility: "public",
      createdDate: "2024-05-15",
      lastModified: "2024-06-08",
      views: 3200,
      favorites: 245,
      images: [
        {
          id: "1",
          url: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop",
          name: "airpods-main.jpg",
        },
      ],
      colors: [{ id: "1", name: "White", hex: "#FFFFFF" }],
      sizes: ["One Size"],
      tags: ["airpods", "pro", "noise cancellation", "wireless", "earbuds"],
      features: [
        "Active Noise Cancellation",
        "Spatial Audio",
        "USB-C",
        "MagSafe Compatible",
      ],
      rating: 4.9,
      reviews: 234,
      weight: "56",
      dimensions: { length: "3.9", width: "3.0", height: "1.7" },
      shippingWeight: "150",
      shippingClass: "standard",
      returnPolicy: "30",
      warranty: "1 Year Apple Limited Warranty",
      metaTitle: "AirPods Pro 2nd Generation USB-C - Premium Wireless Earbuds",
      metaDescription:
        "Premium wireless earbuds with Active Noise Cancellation and Spatial Audio. USB-C charging case.",
    },
    {
      id: "6",
      title: "Sony WH-1000XM5 Wireless Headphones",
      description:
        "Industry-leading noise canceling with Dual Noise Sensor technology. 30-hour battery life.",
      sku: "SONY-WH1000XM5",
      category: "Electronics",
      subcategory: "Audio",
      brand: "Sony",
      price: 329.0,
      originalPrice: 399.0,
      quantity: 8,
      sold: 25,
      status: "paused",
      condition: "new",
      visibility: "private",
      createdDate: "2024-05-10",
      lastModified: "2024-06-05",
      views: 780,
      favorites: 45,
      images: [
        {
          id: "1",
          url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
          name: "sony-headphones.jpg",
        },
      ],
      colors: [
        { id: "1", name: "Black", hex: "#000000" },
        { id: "2", name: "Silver", hex: "#C0C0C0" },
      ],
      sizes: ["One Size"],
      tags: ["sony", "headphones", "noise cancelling", "wireless", "premium"],
      features: [
        "30hr Battery",
        "Quick Charge",
        "Touch Controls",
        "AI Noise Cancelling",
      ],
      rating: 4.6,
      reviews: 89,
      weight: "250",
      dimensions: { length: "10.2", width: "8.7", height: "3.2" },
      shippingWeight: "450",
      shippingClass: "standard",
      returnPolicy: "30",
      warranty: "1 Year Sony Warranty",
      metaTitle: "Sony WH-1000XM5 Wireless Headphones - Premium Audio",
      metaDescription:
        "Industry-leading noise canceling headphones with 30-hour battery life and premium sound quality.",
    },
    {
      id: "7",
      title: "Nintendo Switch OLED Model - White",
      description:
        "Enhanced Nintendo Switch with vibrant 7-inch OLED screen, wide adjustable stand, and dock with wired LAN port.",
      sku: "NSW-OLED-WHT",
      category: "Gaming",
      subcategory: "Consoles",
      brand: "Nintendo",
      price: 299.0,
      originalPrice: 349.99,
      quantity: 0,
      sold: 45,
      status: "draft",
      condition: "new",
      visibility: "private",
      createdDate: "2024-05-05",
      lastModified: "2024-05-05",
      views: 0,
      favorites: 0,
      images: [
        {
          id: "1",
          url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
          name: "switch-oled.jpg",
        },
      ],
      colors: [
        { id: "1", name: "White", hex: "#FFFFFF" },
        { id: "2", name: "Neon Blue/Red", hex: "#FF0000" },
      ],
      sizes: ["Standard"],
      tags: ["nintendo", "switch", "oled", "gaming", "console", "portable"],
      features: [
        "7-inch OLED Screen",
        "Enhanced Audio",
        "Wide Stand",
        "64GB Storage",
      ],
      rating: 0,
      reviews: 0,
      weight: "420",
      dimensions: { length: "9.5", width: "4.0", height: "0.55" },
      shippingWeight: "650",
      shippingClass: "standard",
      returnPolicy: "30",
      warranty: "1 Year Nintendo Warranty",
      metaTitle: "Nintendo Switch OLED Model White - Enhanced Gaming Console",
      metaDescription:
        "Enhanced Nintendo Switch with vibrant OLED display and improved features for portable gaming.",
    },
  ];

  // Initialize listings state
  React.useEffect(() => {
    setListings(allListingsData);
  }, []);

  // Filter listings based on active section and search
  const filteredListings = useMemo(() => {
    let filtered = listings;

    // Filter by section
    switch (activeSection) {
      case "all-listings":
        break;
      case "active-listings":
        filtered = filtered.filter((listing) => listing.status === "active");
        break;
      case "inactive-listings":
        filtered = filtered.filter((listing) => listing.status === "paused");
        break;
      case "out-of-stock":
        filtered = filtered.filter(
          (listing) => listing.status === "out-of-stock"
        );
        break;
      case "draft-listings":
        filtered = filtered.filter((listing) => listing.status === "draft");
        break;
      case "sold-listings":
        filtered = filtered.filter((listing) => listing.sold > 0);
        break;
      default:
        break;
    }

    // Filter by search query
    if (searchQuery && typeof searchQuery === "string") {
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter(
        (listing) => listing.category === filterCategory
      );
    }

    // Filter by price range
    if (filterPriceRange) {
      const [min, max] = filterPriceRange.split("-").map(Number);
      filtered = filtered.filter(
        (listing) => listing.price >= min && listing.price <= max
      );
    }

    return filtered;
  }, [activeSection, listings, searchQuery, filterCategory, filterPriceRange]);

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
      case "paused":
        return <Pause className="h-4 w-4" />;
      case "out-of-stock":
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
      case "paused":
        return "warning";
      case "out-of-stock":
        return "danger";
      case "draft":
        return "default";
      default:
        return "default";
    }
  };

  // Action handlers with navigation
  const handleCreateListing = () => {
    navigate("/create-listing");
  };

  const handleViewListing = (listing) => {
    navigate(`/product/${listing.id}`);
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
    const duplicatedListing = {
      ...listing,
      id: undefined, // Will be generated as new
      title: `${listing.title} (Copy)`,
      sku: `${listing.sku}-COPY`,
      status: "draft",
      sold: 0,
      views: 0,
      reviews: 0,
      rating: 0,
      createdDate: undefined,
      lastModified: undefined,
    };

    navigate("/create-listing", {
      state: {
        product: duplicatedListing,
        isDuplicating: true,
      },
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectListing = (listingId) => {
    setSelectedListings((prev) =>
      prev.includes(listingId)
        ? prev.filter((id) => id !== listingId)
        : [...prev, listingId]
    );
  };

  const handleSelectAll = () => {
    setSelectedListings(
      selectedListings.length === filteredListings.length
        ? []
        : filteredListings.map((listing) => listing.id)
    );
  };

  const handleDeleteListing = (listing) => {
    setListingToDelete(listing);
    setShowDeleteModal(true);
  };

  const confirmDeletion = () => {
    setListings((prevListings) =>
      prevListings.filter((listing) => listing.id !== listingToDelete.id)
    );
    setShowDeleteModal(false);
    setListingToDelete(null);
  };

  const handleStatusChange = (listing, newStatus) => {
    setListings((prevListings) =>
      prevListings.map((l) =>
        l.id === listing.id ? { ...l, status: newStatus } : l
      )
    );
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedListings.length === 0) return;

    setListings((prevListings) =>
      prevListings.map((listing) =>
        selectedListings.includes(listing.id)
          ? { ...listing, status: bulkAction }
          : listing
      )
    );

    setSelectedListings([]);
    setShowBulkActionModal(false);
    setBulkAction("");
  };

  // Calculate performance metrics
  const getPerformanceMetrics = (listing) => {
    const conversionRate =
      listing.views > 0 ? (listing.sold / listing.views) * 100 : 0;
    const revenue = listing.sold * listing.price;

    return {
      conversionRate: conversionRate.toFixed(1),
      revenue,
      favoriteRate:
        listing.views > 0 ? (listing.favorites / listing.views) * 100 : 0,
    };
  };

  // Categories for filtering
  const categories = [...new Set(listings.map((listing) => listing.category))];
  const priceRanges = [
    { value: "0-100", label: "$0 - $100" },
    { value: "100-500", label: "$100 - $500" },
    { value: "500-1000", label: "$500 - $1,000" },
    { value: "1000-5000", label: "$1,000+" },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-3">
                <Package className="h-6 w-6 text-blue-600" />
                {config.title}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">{config.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                icon={<PlusCircle />}
                onClick={handleCreateListing}
              >
                Add Listing
              </Button>
              <Button variant="secondary" icon={<Download />}>
                Export
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mt-4">
            <div className="flex-1">
              <SearchInput
                placeholder="Search listings by title, SKU, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                placeholder="All Categories"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>

              <Select
                value={filterPriceRange}
                onChange={(e) => setFilterPriceRange(e.target.value)}
                placeholder="All Prices"
              >
                <option value="">All Prices</option>
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </Select>

              <IconButton variant="secondary" title="More Filters">
                <Filter className="h-4 w-4" />
              </IconButton>
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
                {filteredListings.length}{" "}
                {filteredListings.length === 1 ? "Listing" : "Listings"}
              </h3>
              {selectedListings.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {selectedListings.length} selected
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
              <IconButton variant="ghost" title="Refresh">
                <RefreshCw className="h-4 w-4" />
              </IconButton>
              <IconButton variant="ghost" title="Settings">
                <Settings className="h-4 w-4" />
              </IconButton>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      selectedListings.length === filteredListings.length &&
                      filteredListings.length > 0
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
                    onSort={() => handleSort("lastModified")}
                    sortDirection={
                      sortField === "lastModified" ? sortDirection : null
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
              {filteredListings.map((listing) => {
                const metrics = getPerformanceMetrics(listing);

                return (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedListings.includes(listing.id)}
                        onChange={() => handleSelectListing(listing.id)}
                      />
                    </TableCell>

                    {config.showColumns.includes("listing") && (
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={listing.images[0]?.url}
                            alt={listing.title}
                            className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 truncate">
                              {listing.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              SKU: {listing.sku}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    )}

                    {config.showColumns.includes("category") && (
                      <TableCell>
                        <div className="text-sm text-gray-900">
                          {listing.category}
                        </div>
                        <div className="text-xs text-gray-500">
                          {listing.subcategory}
                        </div>
                      </TableCell>
                    )}

                    {config.showColumns.includes("price") && (
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900">
                          ${listing.price.toLocaleString()}
                        </div>
                        {listing.originalPrice > listing.price && (
                          <div className="text-xs text-gray-500 line-through">
                            ${listing.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </TableCell>
                    )}

                    {config.showColumns.includes("quantity") && (
                      <TableCell>
                        <div
                          className={`text-sm font-medium ${
                            listing.quantity === 0
                              ? "text-red-600"
                              : listing.quantity < 5
                              ? "text-orange-600"
                              : "text-gray-900"
                          }`}
                        >
                          {listing.quantity}
                        </div>
                        {listing.quantity < 5 && listing.quantity > 0 && (
                          <div className="text-xs text-orange-500">
                            Low stock
                          </div>
                        )}
                      </TableCell>
                    )}

                    {config.showColumns.includes("sold") && (
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900">
                          {listing.sold}
                        </div>
                      </TableCell>
                    )}

                    {config.showColumns.includes("status") && (
                      <TableCell>
                        <Badge
                          variant={getStatusVariant(listing.status)}
                          icon={getStatusIcon(listing.status)}
                        >
                          {listing.status
                            .replace("-", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      </TableCell>
                    )}

                    {config.showColumns.includes("performance") && (
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Eye className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {listing.views}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Heart className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {listing.favorites}
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
                          {listing.lastModified}
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
                            title="View Product Page"
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
                                handleStatusChange(listing, "paused")
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
          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No listings found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || filterCategory || filterPriceRange
                  ? "Try adjusting your filters or search terms."
                  : `No ${config.title.toLowerCase()} available.`}
              </p>
              {!searchQuery && !filterCategory && !filterPriceRange && (
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
                    src={listingToDelete.images[0]?.url}
                    alt={listingToDelete.title}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {listingToDelete.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      SKU: {listingToDelete.sku}
                    </p>
                    <p className="text-sm text-gray-500">
                      {listingToDelete.sold} sold • ${listingToDelete.price}
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
          <Button variant="danger" onClick={confirmDeletion} icon={<Trash2 />}>
            Delete Listing
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
              Apply action to {selectedListings.length} selected listings
            </p>

            <FormField label="Action" required>
              <Select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                placeholder="Select an action..."
              >
                <option value="active">Activate Listings</option>
                <option value="paused">Pause Listings</option>
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
          <Button variant="primary" onClick={handleBulkAction}>
            Apply Action
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ListingManagement;
