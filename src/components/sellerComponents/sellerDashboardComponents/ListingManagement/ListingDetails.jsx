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
  ShoppingCart,
  Grid,
  Palette,
  Info,
  Award,
  Shield,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";

// Import Redux hooks
import {
  useListingDetails,
  useListings,
} from "../../../../hooks/useSellerListingData";

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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageViewMode, setImageViewMode] = useState('grid'); // 'grid' or 'carousel'

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
      case "inactive":
        return <Pause className="h-5 w-5 text-orange-600" />;
      case "outOfStock":
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

  const getVisibilityIcon = (visibility) => {
    return visibility === "public" ? (
      <Globe className="h-4 w-4 text-green-600" />
    ) : (
      <Lock className="h-4 w-4 text-gray-600" />
    );
  };

  // Helper function to extract image URL from different formats
  const extractImageUrl = (image) => {
    if (typeof image === 'string') return image;
    if (image?.url) return image.url;
    return '/placehold.png';
  };

  // Get main images - FIXED to prioritize main product images over variation images
  const getMainImages = () => {
    // First try to get images from main product images
    if (listing.images?.length > 0) {
      return listing.images.map(extractImageUrl);
    }
    
    // Only fallback to variation images if no main product images exist
    if (listing.hasVariations && listing.variations?.length > 0) {
      const defaultVariation = listing.variations.find(v => v.isDefault) || listing.variations[0];
      if (defaultVariation.images?.length > 0) {
        return defaultVariation.images.map(extractImageUrl);
      }
    }
    
    return ['/placehold.png']; // Fallback placeholder image
  };

  // Get current price and pricing info
  const getPricingInfo = () => {
    if (listing.hasVariations && listing.variations?.length > 0) {
      const defaultVariation = listing.variations.find(v => v.isDefault) || listing.variations[0];
      return {
        price: defaultVariation.price,
        originalPrice: defaultVariation.originalPrice,
        sku: defaultVariation.sku,
        quantity: defaultVariation.quantity,
      };
    }
    
    return {
      price: listing.price,
      originalPrice: listing.originalPrice,
      sku: listing.sku || listing.id,
      quantity: listing.quantity,
    };
  };

  // Calculate performance metrics
  const getPerformanceMetrics = () => {
    const views = listing.views || 0;
    const sold = listing.sold || 0;
    const favorites = listing.favorites || 0;
    const price = parseFloat(getPricingInfo().price) || 0;
    
    const conversionRate = views > 0 ? (sold / views) * 100 : 0;
    const revenue = sold * price;
    const favoriteRate = views > 0 ? (favorites / views) * 100 : 0;

    return {
      conversionRate: conversionRate.toFixed(1),
      revenue,
      favoriteRate: favoriteRate.toFixed(1),
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
      sku: `${listing.sku || listing.id}-COPY`,
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
    // actions.push({
    //   key: "edit",
    //   label: "Edit Listing",
    //   icon: <Edit />,
    //   variant: "primary",
    //   onClick: () => {
    //     onListingUpdate?.(listing, "edit");
    //     onClose();
    //   },
    // });

    // Duplicate action - always available
    // actions.push({
    //   key: "duplicate",
    //   label: "Duplicate",
    //   icon: <Copy />,
    //   variant: "secondary",
    //   onClick: handleDuplicateListing,
    // });

    // Status-specific actions
    switch (listing?.status) {
      case "active":
        actions.push({
          key: "pause",
          label: "Pause Listing",
          icon: <Pause />,
          variant: "warning",
          onClick: () => handleStatusChange("inactive"),
        });
        break;

      case "inactive":
      case "draft":
      case "outOfStock":
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

  // Image navigation handlers
  const nextImage = () => {
    const images = getMainImages();
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    const images = getMainImages();
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!listing) return null;

  const metrics = getPerformanceMetrics();
  const availableActions = getAvailableActions();
  const mainImages = getMainImages();
  const pricingInfo = getPricingInfo();

  // Responsive modal size based on screen size
  const modalSize = isFullscreen ? "full" : "6xl";

  return (
    <>
      <Modal
        isOpen={true}
        onClose={onClose}
        size={modalSize}
        title=""
        hideCloseButton={false}
      >
        <ModalContent className="p-0 flex flex-col" style={{ height: isFullscreen ? '100vh' : '85vh' }}>
          {/* Success/Error Messages */}
          {(error || success) && (
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
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
          <div className="p-4 lg:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">
                    {listing.title}
                  </h2>
                  <Badge
                    variant={getStatusVariant(listing.status)}
                    size="lg"
                    icon={getStatusIcon(listing.status)}
                  >
                    {getStatusLabel(listing.status)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 lg:gap-6 text-sm text-gray-600 flex-wrap">
                  <span className="truncate">SKU: {pricingInfo.sku}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="truncate">Created: {new Date(listing.createdAt).toLocaleDateString()}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    {getVisibilityIcon(listing.visibility || 'public')}
                    <span className="hidden sm:inline">{listing.visibility || 'public'}</span>
                  </span>
                  {listing.hasVariations && (
                    <>
                      <span className="hidden lg:inline">•</span>
                      <span className="flex items-center gap-1">
                        <Grid className="h-4 w-4" />
                        <span className="hidden sm:inline">{listing.variations?.length || 0} variations</span>
                        <span className="sm:hidden">{listing.variations?.length || 0}v</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <IconButton 
                  onClick={() => setIsFullscreen(!isFullscreen)} 
                  variant="ghost" 
                  className="text-gray-400 hover:text-gray-600"
                  title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </IconButton>
                <IconButton onClick={onClose} variant="ghost" className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </IconButton>
              </div>
            </div>

            {/* Quick Stats - Responsive Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="text-center">
                <p className="text-xl lg:text-2xl font-bold text-green-600">
                  LKR {parseFloat(pricingInfo.price || 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Current Price</p>
              </div>
              <div className="text-center">
                <p className="text-xl lg:text-2xl font-bold text-blue-600">
                  {pricingInfo.quantity || 0}
                </p>
                <p className="text-xs text-gray-500">In Stock</p>
              </div>
              <div className="text-center">
                <p className="text-xl lg:text-2xl font-bold text-purple-600">
                  {listing.sold || 0}
                </p>
                <p className="text-xs text-gray-500">Sold</p>
              </div>
              <div className="text-center">
                <p className="text-xl lg:text-2xl font-bold text-orange-600">
                  {listing.views || 0}
                </p>
                <p className="text-xs text-gray-500">Views</p>
              </div>
            </div>
          </div>

          {/* Content - Scrollable with Responsive Layout */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 p-4 lg:p-6">
                {/* Left Column - Images (Responsive) */}
                <div className="lg:col-span-5 xl:col-span-4">
                  <div className="space-y-4 lg:sticky lg:top-0">
                    {/* Main Image with Navigation */}
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={mainImages[selectedImageIndex]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/placehold.png";
                        }}
                      />
                      
                      {/* Image Navigation */}
                      {mainImages.length > 1 && (
                        <>
                          <button
                            onClick={previousImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                          
                          {/* Image Counter */}
                          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                            {selectedImageIndex + 1} / {mainImages.length}
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Image Thumbnails - Responsive Grid */}
                    {mainImages.length > 1 && (
                      <div className="grid grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        {mainImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                              selectedImageIndex === index 
                                ? 'border-blue-500' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${listing.title} - ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "/placehold.png";
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Image Source Indicator */}
                    <div className="text-center">
                      <Badge variant="secondary" size="sm">
                        {listing.images?.length > 0 ? "Main Product Images" : "Variation Images"}
                      </Badge>
                      {listing.images?.length > 0 && listing.variations?.some(v => v.images?.length > 0) && (
                        <p className="text-xs text-gray-500 mt-1">
                          Showing main product images. Each variation may have different images.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Details (Responsive) */}
                <div className="lg:col-span-7 xl:col-span-8">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    {/* Responsive Tab Navigation */}
                    <div className="mb-6 overflow-x-auto">
                      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 min-w-max lg:min-w-0">
                        <TabsTrigger value="overview" className="text-xs lg:text-sm">Overview</TabsTrigger>
                        <TabsTrigger value="details" className="text-xs lg:text-sm">Details</TabsTrigger>
                        <TabsTrigger value="performance" className="text-xs lg:text-sm">Performance</TabsTrigger>
                        <TabsTrigger value="shipping" className="text-xs lg:text-sm">Shipping</TabsTrigger>
                      </TabsList>
                    </div>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-4 lg:space-y-6">
                      {/* Basic Information */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Info className="h-5 w-5" />
                            Basic Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <CopyField
                              label="Product Title"
                              value={listing.title}
                              icon={<Tag />}
                              onCopy={() => handleCopy("title", listing.title)}
                              copied={copiedFields.title}
                            />
                            <CopyField
                              label="Brand"
                              value={listing.brand || 'N/A'}
                              icon={<Award />}
                              onCopy={() => handleCopy("brand", listing.brand || 'N/A')}
                              copied={copiedFields.brand}
                            />
                          </div>
                          
                          <CopyField
                            label="Category"
                            value={`${listing.category?.main || listing.category}${listing.category?.sub ? ` > ${listing.category.sub}` : ''}`}
                            icon={<Grid />}
                            onCopy={() => handleCopy("category", `${listing.category?.main || listing.category} > ${listing.category?.sub || ''}`)}
                            copied={copiedFields.category}
                          />

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                            <div className="bg-gray-50 rounded-lg p-4 border max-h-32 overflow-y-auto">
                              <p className="text-gray-700 text-sm leading-relaxed">{listing.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Pricing Information */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <DollarSign className="h-5 w-5" />
                            Pricing & Inventory
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Current Price</label>
                              <p className="text-xl lg:text-2xl font-bold text-green-600">
                                LKR {parseFloat(pricingInfo.price || 0).toLocaleString()}
                              </p>
                            </div>
                            {pricingInfo.originalPrice && pricingInfo.originalPrice > pricingInfo.price && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Original Price</label>
                                <p className="text-lg text-gray-500 line-through">
                                  LKR {parseFloat(pricingInfo.originalPrice).toLocaleString()}
                                </p>
                                <div className="text-xs text-green-600 font-medium">
                                  {Math.round(((pricingInfo.originalPrice - pricingInfo.price) / pricingInfo.originalPrice) * 100)}% OFF
                                </div>
                              </div>
                            )}
                            <div>
                              <label className="text-sm font-medium text-gray-700">Quantity in Stock</label>
                              <p className={`text-xl lg:text-2xl font-bold ${
                                (pricingInfo.quantity || 0) === 0 ? "text-red-600" :
                                (pricingInfo.quantity || 0) < 5 ? "text-orange-600" : "text-green-600"
                              }`}>
                                {pricingInfo.quantity || 0}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Tags */}
                      {listing.productTags?.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Tag className="h-5 w-5" />
                              Product Tags ({listing.productTags.length})
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {listing.productTags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    {/* Details Tab */}
                    <TabsContent value="details" className="space-y-4 lg:space-y-6">
                      {/* Variations */}
                      {listing.hasVariations && listing.variations?.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Grid className="h-5 w-5" />
                              Variations ({listing.variations.length})
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                              {listing.variations.map((variation, index) => (
                                <div key={variation.id || index} className="border border-gray-200 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                                    <h4 className="font-medium text-gray-900 flex items-center gap-2 flex-wrap">
                                      <span className="truncate">{variation.name || `Variation #${index + 1}`}</span>
                                      {variation.isDefault && (
                                        <Badge variant="primary" size="sm">Default</Badge>
                                      )}
                                    </h4>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-500 font-medium">Price:</span>
                                      <span className="ml-2 font-semibold text-green-600">
                                        LKR {parseFloat(variation.price || 0).toLocaleString()}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500 font-medium">Quantity:</span>
                                      <span className="ml-2 font-semibold">{variation.quantity || 0}</span>
                                    </div>
                                    {variation.sku && (
                                      <div className="sm:col-span-2">
                                        <span className="text-gray-500 font-medium">SKU:</span>
                                        <span className="ml-2 font-mono text-xs">{variation.sku}</span>
                                      </div>
                                    )}
                                    {variation.color?.length > 0 && (
                                      <div className="flex items-center sm:col-span-2">
                                        <span className="text-gray-500 font-medium">Color:</span>
                                        <div className="ml-2 flex items-center gap-2">
                                          <div
                                            className="w-5 h-5 rounded border border-gray-300 shadow-sm"
                                            style={{ backgroundColor: variation.color[0] }}
                                          />
                                          <span className="text-sm font-medium">{variation.color[0]}</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {variation.sizes?.length > 0 && (
                                    <div className="mt-3">
                                      <span className="text-gray-500 font-medium text-sm">Sizes:</span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {variation.sizes.map((size, sizeIndex) => (
                                          <Badge key={sizeIndex} variant="outline" size="xs">
                                            {size}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {variation.images?.length > 0 && (
                                    <div className="mt-3">
                                      <span className="text-gray-500 font-medium text-sm">Variation Images:</span>
                                      <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                                        {variation.images.slice(0, 4).map((image, imgIndex) => (
                                          <img
                                            key={imgIndex}
                                            src={extractImageUrl(image)}
                                            alt={`${variation.name} - ${imgIndex + 1}`}
                                            className="w-12 h-12 rounded border border-gray-200 object-cover flex-shrink-0"
                                            onError={(e) => {
                                              e.target.src = "/placehold.png";
                                            }}
                                          />
                                        ))}
                                        {variation.images.length > 4 && (
                                          <div className="w-12 h-12 rounded border border-gray-200 bg-gray-100 flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                                            +{variation.images.length - 4}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Physical Properties */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Package className="h-5 w-5" />
                            Physical Properties
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {listing.weight && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">Weight</label>
                              <p className="text-gray-900 font-semibold">{listing.weight} lbs</p>
                            </div>
                          )}
                          {(listing.dimensions?.length || listing.dimensions?.width || listing.dimensions?.height) && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">Dimensions</label>
                              <p className="text-gray-900 font-semibold">
                                {listing.dimensions.length || 0}" × {listing.dimensions.width || 0}" × {listing.dimensions.height || 0}"
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Performance Tab */}
                    <TabsContent value="performance" className="space-y-4 lg:space-y-6">
                      {/* Performance Metrics */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <BarChart3 className="h-5 w-5" />
                            Performance Metrics
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <Eye className="h-6 lg:h-8 w-6 lg:w-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-xl lg:text-2xl font-bold text-blue-900">
                              {listing.views || 0}
                            </p>
                            <p className="text-sm text-blue-700">Total Views</p>
                          </div>
                          <div className="text-center p-4 bg-red-50 rounded-lg">
                            <Heart className="h-6 lg:h-8 w-6 lg:w-8 text-red-600 mx-auto mb-2" />
                            <p className="text-xl lg:text-2xl font-bold text-red-900">
                              {listing.favorites || 0}
                            </p>
                            <p className="text-sm text-red-700">Favorites</p>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <TrendingUp className="h-6 lg:h-8 w-6 lg:w-8 text-green-600 mx-auto mb-2" />
                            <p className="text-xl lg:text-2xl font-bold text-green-900">
                              {metrics.conversionRate}%
                            </p>
                            <p className="text-sm text-green-700">Conversion Rate</p>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <DollarSign className="h-6 lg:h-8 w-6 lg:w-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-xl lg:text-2xl font-bold text-purple-900">
                              LKR {metrics.revenue.toLocaleString()}
                            </p>
                            <p className="text-sm text-purple-700">Total Revenue</p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Sales Summary */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Sales Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Units Sold</label>
                              <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                                {listing.sold || 0}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Total Revenue</label>
                              <p className="text-2xl lg:text-3xl font-bold text-green-600">
                                LKR {metrics.revenue.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Average Rating</label>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-2xl lg:text-3xl font-bold text-yellow-600">
                                  {listing.rating || 0}
                                </p>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 lg:h-5 w-4 lg:w-5 ${
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

                    {/* Shipping Tab */}
                    <TabsContent value="shipping" className="space-y-4 lg:space-y-6">
                      {listing.shippingClass && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Truck className="h-5 w-5" />
                              Shipping & Policies
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div>
                                <label className="text-sm font-medium text-gray-700">Shipping Weight</label>
                                <p className="text-gray-900 font-semibold">
                                  {listing.shippingClass.shippingWeight || 'Not specified'} {listing.shippingClass.shippingWeight ? 'lbs' : ''}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">Shipping Class</label>
                                <p className="text-gray-900 font-semibold capitalize">
                                  {listing.shippingClass.shippingClass || 'Standard'}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">Return Policy</label>
                                <p className="text-gray-900 font-semibold">
                                  {listing.shippingClass.returnPolicy || '30'} Days
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">Warranty</label>
                                <p className="text-gray-900 font-semibold">
                                  {listing.shippingClass.warranty || 'Not specified'}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Listing URL */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <ExternalLink className="h-5 w-5" />
                            Listing URL
                          </CardTitle>
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
              </div>
            </div>
          </div>
        </ModalContent>

        {/* Action Buttons Footer - Responsive */}
        <ModalFooter className="bg-gray-50 border-t border-gray-200 flex-shrink-0 p-4 lg:p-6">
          <div className="flex flex-wrap gap-2 lg:gap-3 justify-end w-full">
            {availableActions.map((action) => (
              <Button
                key={action.key}
                variant={action.variant}
                icon={action.icon}
                onClick={action.onClick}
                size="sm"
                disabled={isLoading}
                className="text-xs lg:text-sm"
              >
                <span className="hidden sm:inline">{action.label}</span>
                <span className="sm:hidden">{action.icon}</span>
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
              : `This will change the listing status to ${getStatusLabel(newStatus)}.`}
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
                  src={mainImages[0]}
                  alt={listing.title}
                  className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.src = "/placehold.png";
                  }}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-gray-900 truncate">{listing.title}</h4>
                  <p className="text-sm text-gray-500">SKU: {pricingInfo.sku}</p>
                  <p className="text-sm text-gray-500">
                    {listing.sold || 0} sold • LRK {pricingInfo.price || 0} • {listing.views || 0} views
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