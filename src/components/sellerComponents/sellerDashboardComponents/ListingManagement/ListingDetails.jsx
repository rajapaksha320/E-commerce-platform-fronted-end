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
} from "../../../ui/sellerUis/Uis";

const ListingDetails = ({ listing, onClose, onListingUpdate }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedFields, setCopiedFields] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusReason, setStatusReason] = useState("");

  const handleCopy = (fieldName) => {
    setCopiedFields((prev) => ({ ...prev, [fieldName]: true }));
    setTimeout(() => {
      setCopiedFields((prev) => ({ ...prev, [fieldName]: false }));
    }, 2000);
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
    const revenue = listing?.sold * listing?.price;
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

  const confirmStatusChange = () => {
    const updatedListing = {
      ...listing,
      status: newStatus,
      lastModified: new Date().toISOString().split("T")[0],
    };

    onListingUpdate?.(updatedListing);
    setShowStatusModal(false);
    onClose();
  };

  const handleDeleteListing = () => {
    onListingUpdate?.(null, "delete");
    setShowDeleteModal(false);
    onClose();
  };

  const handleDuplicateListing = () => {
    const duplicatedListing = {
      ...listing,
      id: `LST-${Date.now()}`,
      title: `${listing.title} (Copy)`,
      status: "draft",
      createdDate: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
      views: 0,
      favorites: 0,
      sold: 0,
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
      onClick: () => console.log("Edit listing"), // Would navigate to edit page
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
        onClick: () => window.open(`/listing/${listing.id}`, "_blank"),
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
          url: `${window.location.origin}/listing/${listing?.id}`,
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
          {/* Header */}
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-start gap-6">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200 shadow-sm"
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
                      <span>Created: {listing.createdDate}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {getVisibilityIcon(listing.visibility)}
                        {listing.visibility}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={getStatusVariant(listing.status)}
                    size="lg"
                    icon={getStatusIcon(listing.status)}
                  >
                    {listing.status
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      ${listing.price}
                    </p>
                    <p className="text-xs text-gray-500">Current Price</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {listing.quantity}
                    </p>
                    <p className="text-xs text-gray-500">In Stock</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {listing.sold}
                    </p>
                    <p className="text-xs text-gray-500">Sold</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {listing.views}
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
                            {listing.favorites}
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
                              {listing.rating}
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
                      onCopy={() => handleCopy("title")}
                      copied={copiedFields.title}
                    />
                    <CopyField
                      label="SKU"
                      value={listing.sku}
                      icon={<Package />}
                      onCopy={() => handleCopy("sku")}
                      copied={copiedFields.sku}
                    />
                    <CopyField
                      label="Category"
                      value={`${listing.category} > ${listing.subcategory}`}
                      icon={<Tag />}
                      onCopy={() => handleCopy("category")}
                      copied={copiedFields.category}
                    />
                    <CopyField
                      label="Condition"
                      value={
                        listing.condition.charAt(0).toUpperCase() +
                        listing.condition.slice(1)
                      }
                      icon={<CheckCircle />}
                      onCopy={() => handleCopy("condition")}
                      copied={copiedFields.condition}
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

                {/* Images */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="h-5 w-5" />
                      Images ({listing.images.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {listing.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`${listing.title} - Image ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" />
                        </div>
                      ))}
                    </div>
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
                        ${listing.price}
                      </p>
                    </div>
                    {listing.originalPrice > listing.price && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Original Price
                        </label>
                        <p className="text-lg text-gray-500 line-through">
                          ${listing.originalPrice}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Quantity in Stock
                      </label>
                      <p
                        className={`text-2xl font-bold ${
                          listing.quantity === 0
                            ? "text-red-600"
                            : listing.quantity < 5
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {listing.quantity}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Features */}
                {listing.features && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {listing.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Shipping */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Weight
                      </label>
                      <p className="text-gray-900">
                        {listing.shipping.weight} lbs
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Dimensions
                      </label>
                      <p className="text-gray-900">
                        {listing.shipping.dimensions}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Shipping Options
                      </label>
                      <div className="space-y-1">
                        {listing.shipping.freeShipping && (
                          <Badge variant="success">Free Shipping</Badge>
                        )}
                        {listing.shipping.expedited && (
                          <Badge variant="primary">Expedited Available</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
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
                        {listing.views}
                      </p>
                      <p className="text-sm text-blue-700">Total Views</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-red-900">
                        {listing.favorites}
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
                        ${metrics.revenue}
                      </p>
                      <p className="text-sm text-purple-700">Total Revenue</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Sales History */}
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
                          {listing.sold}
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
                            {listing.rating}
                          </p>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < Math.floor(listing.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            ({listing.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SEO Tab */}
              <TabsContent value="seo" className="space-y-6">
                {listing.seo && (
                  <Card>
                    <CardHeader>
                      <CardTitle>SEO Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Meta Title
                        </label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded border">
                          {listing.seo.metaTitle}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Meta Description
                        </label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded border">
                          {listing.seo.metaDescription}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Keywords
                        </label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {listing.seo.keywords.map((keyword, index) => (
                            <Badge key={index} variant="outline">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
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
                      value={`${window.location.origin}/listing/${listing.id}`}
                      icon={<ExternalLink />}
                      onCopy={() => handleCopy("url")}
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
              >
                {action.label}
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
          >
            {newStatus === "active" ? "Activate Listing" : "Update Status"}
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
                  src={listing.images[0]}
                  alt={listing.title}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{listing.title}</h4>
                  <p className="text-sm text-gray-500">SKU: {listing.sku}</p>
                  <p className="text-sm text-gray-500">
                    {listing.sold} sold • ${listing.price} • {listing.views}{" "}
                    views
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
          >
            Delete Listing
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ListingDetails;
