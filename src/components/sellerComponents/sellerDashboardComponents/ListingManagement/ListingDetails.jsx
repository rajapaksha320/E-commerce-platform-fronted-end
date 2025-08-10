/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Package,
  Tag,
  DollarSign,
  Eye,
  Heart,
  Share2,
  TrendingUp,
  BarChart3,
  Edit,
  Copy,
  Play,
  Pause,
  Trash2,
  ExternalLink,
  Image,
  Star,
  MapPin,
  Truck,
  Calendar,
  User,
  MessageCircle,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Settings,
  Globe,
  Lock,
} from "lucide-react";

// Import Redux hooks
import {
  useListingDetails,
  useListings,
} from "../../../../hooks/useSellerData";

// Import UI components
import {
  Button,
  IconButton,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Modal,
  ModalContent,
  ModalFooter,
  CopyField,
  Alert,
  FormField,
  Select,
  Textarea,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  LoadingSpinner,
} from "../../../ui/sellerUis/Uis";

const ListingDetails = ({ listing, onClose, onListingUpdate }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedFields, setCopiedFields] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusReason, setStatusReason] = useState("");

  // Redux hooks
  const {
    updateExistingListing,
    deleteExistingListing,
    isLoading,
    error,
    success,
    clearMessages,
  } = useListings();

  const {
    updateListing: updateListingDetails,
    performOptimisticUpdate,
  } = useListingDetails(listing._id || listing.id);

  const handleCopy = (fieldName, value) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedFields((prev) => ({ ...prev, [fieldName]: true }));
      setTimeout(() => {
        setCopiedFields((prev) => ({ ...prev, [fieldName]: false }));
      }, 2000);
    }).catch((err) => {
      console.error('Failed to copy to clipboard:', err);
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "paused":
        return <Pause className="h-5 w-5 text-orange-600" />;
      case "out-of-stock":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "draft":
        return <Clock className="h-5 w-5 text-gray-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
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

  const getVisibilityIcon = (visibility) => {
    return visibility === "public" ? (
      <Globe className="h-4 w-4 text-green-600" />
    ) : (
      <Lock className="h-4 w-4 text-gray-600" />
    );
  };

  // Calculate performance metrics
  const getPerformanceMetrics = () => {
    const conversionRate =
      listing?.views > 0 ? (listing.sold / listing.views) * 100 : 0;
    const revenue = (listing?.sold || 0) * (listing?.price || 0);
    const favoriteRate =
      listing?.views > 0 ? (listing.favorites / listing.views) * 100 : 0;
    const profitMargin =
      listing?.originalPrice > 0
        ? ((listing.price - listing.originalPrice * 0.7) / listing.price) * 100
        : 0;

    return {
      conversionRate: conversionRate.toFixed(1),
      revenue,
      favoriteRate: favoriteRate.toFixed(1),
      profitMargin: profitMargin.toFixed(1),
    };
  };

  // Action handlers
  const handleStatusChange = (status) => {
    setNewStatus(status);
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    try {
      // Optimistic update for immediate UI feedback
      performOptimisticUpdate({ status: newStatus });
      
      // Update via Redux
      const result = await updateExistingListing(listing._id || listing.id, {
        status: newStatus,
        statusChangeReason: statusReason,
        lastModified: new Date().toISOString(),
      });

      if (result.type?.endsWith('fulfilled')) {
        // Notify parent component
        onListingUpdate?.(result.payload.listing || result.payload);
        setShowStatusModal(false);
        setStatusReason("");
        setNewStatus("");
      }
    } catch (error) {
      console.error("Error updating listing status:", error);
      // Revert optimistic update if needed
      performOptimisticUpdate({ status: listing.status });
    }
  };

  const handleDeleteListing = async () => {
    try {
      const result = await deleteExistingListing(listing._id || listing.id);
      
      if (result.type?.endsWith('fulfilled')) {
        onListingUpdate?.(null, "delete");
        setShowDeleteModal(false);
        onClose();
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  const handleDuplicateListing = () => {
    const duplicatedListing = {
      ...listing,
      id: undefined,
      _id: undefined,
      title: `${listing.title} (Copy)`,
      sku: `${listing.sku}-COPY`,
      status: "draft",
      createdDate: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
      views: 0,
      favorites: 0,
      sold: 0,
      rating: 0,
      reviews: 0,
    };

    onListingUpdate?.(duplicatedListing, "duplicate");
    onClose();
  };

  const getAvailableActions = () => {
    const actions = [];

    // Edit action - always available
    actions.push({
      key: "edit",
      label: "Edit Listing",
      icon: <Edit />,
      variant: "primary",
      onClick: () => {
        onListingUpdate?.(listing, "edit");
        onClose();
      },
    });

    // Duplicate action - always available
    actions.push({
      key: "duplicate",
      label: "Duplicate",
      icon: <Copy />,
      variant: "secondary",
      onClick: handleDuplicateListing,
    });

    // Status-specific actions
    switch (listing?.status) {
      case "active":
        actions.push({
          key: "pause",
          label: "Pause Listing",
          icon: <Pause />,
          variant: "warning",
          onClick: () => handleStatusChange("paused"),
        });
        break;

      case "paused":
      case "draft":
      case "out-of-stock":
        actions.push({
          key: "activate",
          label: "Activate Listing",
          icon: <Play />,
          variant: "success",
          onClick: () => handleStatusChange("active"),
        });
        break;
    }

    // View on site - for active listings
    if (listing?.status === "active") {
      actions.push({
        key: "view",
        label: "View on Site",
        icon: <ExternalLink />,
        variant: "secondary",
        onClick: () => window.open(`/listing/${listing._id || listing.id}`, "_blank"),
      });
    }

    // Share action
    actions.push({
      key: "share",
      label: "Share",
      icon: <Share2 />,
      variant: "secondary",
      onClick: () =>
        navigator.share?.({
          title: listing?.title,
          url: `${window.location.origin}/listing/${listing?._id || listing?.id}`,
        }),
    });

    // Delete action
    actions.push({
      key: "delete",
      label: "Delete",
      icon: <Trash2 />,
      variant: "danger",
      onClick: () => setShowDeleteModal(true),
    });

    return actions;
  };

  if (!listing) return null;

  const metrics = getPerformanceMetrics();
  const availableActions = getAvailableActions();

  // Handle different image format possibilities
  const getImageUrl = (image) => {
    if (typeof image === 'string') return image;
    if (image?.url) return image.url;
    return '/api/placeholder/400/400';
  };

  const mainImage = listing.images?.[0];
  const mainImageUrl = mainImage ? getImageUrl(mainImage) : '/api/placeholder/400/400';

  return (
    <>
      <Modal
        isOpen={true}
        onClose={onClose}
        size="3xl"
        title="Listing Details"
        hideCloseButton={false}
      >
        <ModalContent className="p-0">
          {/* Success/Error Messages */}
          {(error || success) && (
            <div className="p-4 border-b border-gray-200">
              <Alert
                variant={success ? "success" : "danger"}
                title={success ? "Success" : "Error"}
                onClose={clearMessages}
              >
                {success || error}
              </Alert>
            </div>
          )}

          {/* Header */}
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-start gap-6">
              <img
                src={mainImageUrl}
                alt={listing.title}
                className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200 shadow-sm"
                onError={(e) => {
                  e.target.src = "/api/placeholder/96/96";
                }}
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {listing.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>SKU: {listing.sku}</span>
                      <span>•</span>
                      <span>Created: {listing.createdDate || listing.createdAt?.split('T')[0]}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {getVisibilityIcon(listing.visibility || 'public')}
                        {listing.visibility || 'public'}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={getStatusVariant(listing.status)}
                    size="lg"
                    icon={getStatusIcon(listing.status)}
                  >
                    {(listing.status || 'draft')
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      ${listing.price || 0}
                    </p>
                    <p className="text-xs text-gray-500">Current Price</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {listing.quantity || 0}
                    </p>
                    <p className="text-xs text-gray-500">In Stock</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {listing.sold || 0}
                    </p>
                    <p className="text-xs text-gray-500">Sold</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {listing.views || 0}
                    </p>
                    <p className="text-xs text-gray-500">Views</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="seo">SEO & Marketing</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600">
                            Revenue
                          </p>
                          <p className="text-xl font-bold text-green-900">
                            ${metrics.revenue.toLocaleString()}
                          </p>
                        </div>
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">
                            Conversion
                          </p>
                          <p className="text-xl font-bold text-blue-900">
                            {metrics.conversionRate}%
                          </p>
                        </div>
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-red-600">
                            Favorites
                          </p>
                          <p className="text-xl font-bold text-red-900">
                            {listing.favorites || 0}
                          </p>
                        </div>
                        <Heart className="h-6 w-6 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-600">
                            Rating
                          </p>
                          <div className="flex items-center gap-1">
                            <p className="text-xl font-bold text-purple-900">
                              {listing.rating || 0}
                            </p>
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          </div>
                        </div>
                        <Star className="h-6 w-6 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CopyField
                      label="Product Title"
                      value={listing.title}
                      icon={<Tag />}
                      onCopy={() => handleCopy("title", listing.title)}
                      copied={copiedFields.title}
                    />
                    <CopyField
                      label="SKU"
                      value={listing.sku}
                      icon={<Package />}
                      onCopy={() => handleCopy("sku", listing.sku)}
                      copied={copiedFields.sku}
                    />
                    <CopyField
                      label="Category"
                      value={`${listing.category?.main || listing.category} ${listing.category?.sub || listing.subcategory ? `> ${listing.category?.sub || listing.subcategory}` : ''}`}
                      icon={<Tag />}
                      onCopy={() => handleCopy("category", `${listing.category?.main || listing.category} > ${listing.category?.sub || listing.subcategory}`)}
                      copied={copiedFields.category}
                    />
                    <CopyField
                      label="Brand"
                      value={listing.brand || 'N/A'}
                      icon={<CheckCircle />}
                      onCopy={() => handleCopy("brand", listing.brand || 'N/A')}
                      copied={copiedFields.brand}
                    />
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-gray-700">{listing.description}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Variations */}
                {listing.hasVariations && listing.variations?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Variations ({listing.variations.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {listing.variations.map((variation, index) => (
                          <div key={variation.id || index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">
                                {variation.name || `Variation #${index + 1}`}
                              </h4>
                              {variation.isDefault && (
                                <Badge variant="primary" size="sm">Default</Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Price:</span>
                                <span className="ml-2 font-medium">${variation.price || 0}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Quantity:</span>
                                <span className="ml-2 font-medium">{variation.quantity || 0}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">SKU:</span>
                                <span className="ml-2 font-medium">{variation.sku || 'N/A'}</span>
                              </div>
                              {variation.color && (
                                <div className="flex items-center">
                                  <span className="text-gray-500">Color:</span>
                                  <div className="ml-2 flex items-center gap-2">
                                    <div
                                      className="w-4 h-4 rounded border border-gray-300"
                                      style={{ backgroundColor: variation.color.hex }}
                                    />
                                    <span className="text-sm">{variation.color.name}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Images */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="h-5 w-5" />
                      Images ({listing.images?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {listing.images?.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {listing.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={getImageUrl(image)}
                              alt={`${listing.title} - Image ${index + 1}`}
                              className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.target.src = "/api/placeholder/200/200";
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <Image className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p>No images available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-6">
                {/* Pricing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Pricing & Inventory
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Current Price
                      </label>
                      <p className="text-2xl font-bold text-green-600">
                        ${listing.price || 0}
                      </p>
                    </div>
                    {listing.originalPrice && listing.originalPrice > listing.price && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Original Price
                        </label>
                        <p className="text-lg text-gray-500 line-through">
                          ${listing.originalPrice}
                        </p>
                        <div className="text-xs text-green-600 font-medium">
                          {Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100)}% OFF
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Quantity in Stock
                      </label>
                      <p
                        className={`text-2xl font-bold ${
                          (listing.quantity || 0) === 0
                            ? "text-red-600"
                            : (listing.quantity || 0) < 5
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {listing.quantity || 0}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Colors & Sizes (for non-variation products) */}
                {!listing.hasVariations && (listing.colors?.length > 0 || listing.sizes?.length > 0) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Colors & Sizes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {listing.colors?.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Available Colors
                          </label>
                          <div className="flex flex-wrap gap-3">
                            {listing.colors.map((color, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                <div
                                  className="w-6 h-6 border border-gray-300 rounded"
                                  style={{ backgroundColor: color.hex }}
                                />
                                <span className="text-sm font-medium">{color.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {listing.sizes?.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Available Sizes
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {listing.sizes.map((size, index) => (
                              <Badge key={index} variant="secondary">
                                {size}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Physical Properties */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Physical Properties
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {listing.weight && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Weight</label>
                        <p className="text-gray-900">{listing.weight} lbs</p>
                      </div>
                    )}
                    {(listing.dimensions?.length || listing.dimensions?.width || listing.dimensions?.height) && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Dimensions</label>
                        <p className="text-gray-900">
                          {listing.dimensions.length || 0}" × {listing.dimensions.width || 0}" × {listing.dimensions.height || 0}"
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tags */}
                {listing.tags?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {listing.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-6">
                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-900">
                        {listing.views || 0}
                      </p>
                      <p className="text-sm text-blue-700">Total Views</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-red-900">
                        {listing.favorites || 0}
                      </p>
                      <p className="text-sm text-red-700">Favorites</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-900">
                        {metrics.conversionRate}%
                      </p>
                      <p className="text-sm text-green-700">Conversion Rate</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-purple-900">
                        ${metrics.revenue.toLocaleString()}
                      </p>
                      <p className="text-sm text-purple-700">Total Revenue</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Sales Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Units Sold
                        </label>
                        <p className="text-3xl font-bold text-gray-900">
                          {listing.sold || 0}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Total Revenue
                        </label>
                        <p className="text-3xl font-bold text-green-600">
                          ${metrics.revenue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Average Rating
                        </label>
                        <div className="flex items-center gap-2">
                          <p className="text-3xl font-bold text-yellow-600">
                            {listing.rating || 0}
                          </p>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < Math.floor(listing.rating || 0)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            ({listing.reviews || 0} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SEO Tab */}
              <TabsContent value="seo" className="space-y-6">
                {(listing.metaTitle || listing.metaDescription) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>SEO Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {listing.metaTitle && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Meta Title
                          </label>
                          <p className="text-gray-900 bg-gray-50 p-3 rounded border">
                            {listing.metaTitle}
                          </p>
                        </div>
                      )}
                      {listing.metaDescription && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Meta Description
                          </label>
                          <p className="text-gray-900 bg-gray-50 p-3 rounded border">
                            {listing.metaDescription}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Listing URL */}
                <Card>
                  <CardHeader>
                    <CardTitle>Listing URL</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CopyField
                      label="Public URL"
                      value={`${window.location.origin}/listing/${listing._id || listing.id}`}
                      icon={<ExternalLink />}
                      onCopy={() => handleCopy("url", `${window.location.origin}/listing/${listing._id || listing.id}`)}
                      copied={copiedFields.url}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ModalContent>

        {/* Action Buttons Footer */}
        <ModalFooter className="bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap gap-3 justify-end">
            {availableActions.map((action) => (
              <Button
                key={action.key}
                variant={action.variant}
                icon={action.icon}
                onClick={action.onClick}
                size="sm"
                disabled={isLoading}
              >
                {action.label}
                {isLoading && action.key === 'delete' && <LoadingSpinner size="sm" className="ml-2" />}
              </Button>
            ))}
          </div>
        </ModalFooter>
      </Modal>

      {/* Status Change Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Change Listing Status"
        size="md"
      >
        <ModalContent className="space-y-4">
          <Alert
            variant={newStatus === "active" ? "success" : "warning"}
            title={`${
              newStatus === "active" ? "Activate" : "Change Status of"
            } "${listing.title}"`}
          >
            {newStatus === "active"
              ? "This listing will become visible to customers and available for purchase."
              : `This will change the listing status to ${newStatus}.`}
          </Alert>

          <FormField label="Reason for Change (Optional)">
            <Textarea
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              placeholder="Provide additional details about the status change..."
              rows={3}
              resize={false}
            />
          </FormField>
        </ModalContent>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button
            variant={newStatus === "active" ? "success" : "primary"}
            onClick={confirmStatusChange}
            icon={newStatus === "active" ? <Play /> : <Settings />}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : (newStatus === "active" ? "Activate Listing" : "Update Status")}
            {isLoading && <LoadingSpinner size="sm" className="ml-2" />}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Listing"
        size="md"
      >
        <ModalContent className="space-y-4">
          <Alert
            variant="danger"
            title={`Permanently Delete "${listing.title}"`}
          >
            This action cannot be undone. The listing and all associated data
            will be permanently removed.
          </Alert>

          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <img
                  src={mainImageUrl}
                  alt={listing.title}
                  className="h-16 w-16 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/64/64";
                  }}
                />
                <div>
                  <h4 className="font-medium text-gray-900">{listing.title}</h4>
                  <p className="text-sm text-gray-500">SKU: {listing.sku}</p>
                  <p className="text-sm text-gray-500">
                    {listing.sold || 0} sold • ${listing.price || 0} • {listing.views || 0} views
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ModalContent>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteListing}
            icon={<Trash2 />}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Listing"}
            {isLoading && <LoadingSpinner size="sm" className="ml-2" />}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ListingDetails;