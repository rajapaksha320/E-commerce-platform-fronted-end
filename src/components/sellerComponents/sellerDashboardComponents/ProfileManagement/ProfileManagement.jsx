/* eslint-disable no-unused-vars */
// ProfileManagement.jsx - Redux Integrated (Store Management)
import React, { useState, useEffect } from "react";
import { useStore, useImageUpload } from "../../../../hooks/useSellerData";
import {
  User,
  Camera,
  Upload,
  MapPin,
  Edit,
  Clock,
  Phone,
  Mail,
  Globe,
  Save,
  Store,
  DollarSign,
  Package,
  Star,
  TrendingUp,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import {
  Button,
  Input,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Avatar,
  Alert,
  Badge,
} from "../../../ui/sellerUis/Uis";

const ProfileManagement = () => {
  // Redux hooks
  const {
    stores,
    currentStore,
    hasStore,
    isLoading,
    error,
    success,
    message,
    createStore,
    updateCurrentStore,
    refreshStores,
    clearMessages,
  } = useStore();

  const {
    isUploading,
    uploadSingleImage,
  } = useImageUpload();

  // Local state for form
  const [activeSection, setActiveSection] = useState("basic");
  const [isEditing, setIsEditing] = useState(!hasStore);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Shop profile state - initialized from Redux store
  const [shopProfile, setShopProfile] = useState({
    storeName: "",
    storeTagLine: "",
    storeDescription: "",
    storeLogo: "/placehold.png",
    bannerImage: "/placehold.png",
    storeLocation: "",
    storeBusinessHours: "Mon-Fri 9AM-6PM",
    storeContactNumber: "",
    storeEmail: "",
    storeWebsite: "",
    status: "active",
  });

  // Initialize form with current store data
  useEffect(() => {
    if (currentStore) {
      setShopProfile({
        storeName: currentStore.basicInformation?.storeName || currentStore.storeName || "",
        storeTagLine: currentStore.basicInformation?.storeTagLine || currentStore.storeTagLine || "",
        storeDescription: currentStore.basicInformation?.storeDescription || currentStore.storeDescription || "",
        storeLogo: currentStore.shopMedia?.storeLogo || currentStore.storeLogo || "/placehold.png",
        bannerImage: currentStore.shopMedia?.bannerImage || currentStore.bannerImage || "/placehold.png",
        storeLocation: currentStore.contactDetails?.storeLocation || currentStore.storeLocation || "",
        storeBusinessHours: currentStore.contactDetails?.storeBusinessHours || currentStore.storeBusinessHours || "Mon-Fri 9AM-6PM",
        storeContactNumber: currentStore.contactDetails?.storeContactNumber?.toString() || currentStore.storeContactNumber?.toString() || "",
        storeEmail: currentStore.contactDetails?.storeEmail || currentStore.storeEmail || "",
        storeWebsite: currentStore.contactDetails?.storeWebsite || currentStore.storeWebsite || "",
        status: currentStore.status || "active",
      });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [currentStore]);

  // Clear messages on unmount
  useEffect(() => {
    return () => clearMessages();
  }, []);


  // need to remove success and error messages within few seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 3000); // Clear messages after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [success, error, clearMessages]);

  const sections = [
    { id: "basic", name: "Basic Information", icon: User },
    { id: "contact", name: "Contact Details", icon: Phone },
    { id: "media", name: "Shop Media", icon: Camera },
    { id: "stats", name: "Store Statistics", icon: TrendingUp },
  ];

  const handleInputChange = (field, value) => {
    setShopProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleImageUpload = async (type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          setUploadError(null);
          const imageUrl = await uploadSingleImage(file);
          
          setShopProfile((prev) => ({
            ...prev,
            [type]: imageUrl,
          }));
          setHasChanges(true);
        } catch (error) {
          console.error("Failed to upload image:", error);
          setUploadError("Failed to upload image. Please try again.");
        }
      }
    };
    input.click();
  };

  const handleSave = async () => {
    try {
      clearMessages();
      
      const storeData = {
        storeName: shopProfile.storeName,
        storeTagLine: shopProfile.storeTagLine,
        storeDescription: shopProfile.storeDescription,
        storeLocation: shopProfile.storeLocation,
        storeContactNumber: parseInt(shopProfile.storeContactNumber) || 0,
        storeEmail: shopProfile.storeEmail,
        storeWebsite: shopProfile.storeWebsite,
        storeBusinessHours: shopProfile.storeBusinessHours,
        storeLogo: shopProfile.storeLogo,
        bannerImage: shopProfile.bannerImage,
        status: shopProfile.status,
      };

      if (hasStore && currentStore) {
        // Update existing store
        await updateCurrentStore({
          basicInformation: {
            storeName: storeData.storeName,
            storeTagLine: storeData.storeTagLine,
            storeDescription: storeData.storeDescription,
          },
          contactDetails: {
            storeLocation: storeData.storeLocation,
            storeContactNumber: storeData.storeContactNumber,
            storeEmail: storeData.storeEmail,
            storeWebsite: storeData.storeWebsite,
            storeBusinessHours: storeData.storeBusinessHours,
          },
          shopMedia: {
            storeLogo: storeData.storeLogo,
            bannerImage: storeData.bannerImage,
          },
          status: storeData.status,
        });
      } else {
        // Create new store
        await createStore(storeData);
      }
      
      setHasChanges(false);
      setIsEditing(false);
      await refreshStores();
    } catch (error) {
      console.error("Failed to save store profile:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset to original data
    if (currentStore) {
      setShopProfile({
        storeName: currentStore.basicInformation?.storeName || "",
        storeTagLine: currentStore.basicInformation?.storeTagLine || "",
        storeDescription: currentStore.basicInformation?.storeDescription || "",
        storeLogo: currentStore.shopMedia?.storeLogo || "/placehold.png",
        bannerImage: currentStore.shopMedia?.bannerImage || "/placehold.png",
        storeLocation: currentStore.contactDetails?.storeLocation || "",
        storeBusinessHours: currentStore.contactDetails?.storeBusinessHours || "Mon-Fri 9AM-6PM",
        storeContactNumber: currentStore.contactDetails?.storeContactNumber?.toString() || "",
        storeEmail: currentStore.contactDetails?.storeEmail || "",
        storeWebsite: currentStore.contactDetails?.storeWebsite || "",
        status: currentStore.status || "active",
      });
    }
    setIsEditing(false);
    setHasChanges(false);
  };

  const renderBasicInformation = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shop Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Name *
            </label>
            <Input
              value={shopProfile.storeName}
              onChange={(e) => handleInputChange("storeName", e.target.value)}
              placeholder="Enter your shop name"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline
            </label>
            <Input
              value={shopProfile.storeTagLine}
              onChange={(e) => handleInputChange("storeTagLine", e.target.value)}
              placeholder="A short description of your shop"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Description
            </label>
            <textarea
              value={shopProfile.storeDescription}
              onChange={(e) => handleInputChange("storeDescription", e.target.value)}
              rows={4}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Describe your shop, what you sell, and what makes you unique..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Status
            </label>
            <Select
              value={shopProfile.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              disabled={!isEditing}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContactDetails = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Location
            </label>
            <Input
              value={shopProfile.storeLocation}
              onChange={(e) => handleInputChange("storeLocation", e.target.value)}
              placeholder="City, State/Country"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline h-4 w-4 mr-1" />
              Business Hours
            </label>
            <Input
              value={shopProfile.storeBusinessHours}
              onChange={(e) => handleInputChange("storeBusinessHours", e.target.value)}
              placeholder="Mon-Fri 9AM-6PM"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline h-4 w-4 mr-1" />
              Phone Number
            </label>
            <Input
              value={shopProfile.storeContactNumber}
              onChange={(e) => handleInputChange("storeContactNumber", e.target.value)}
              placeholder="1234567890"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline h-4 w-4 mr-1" />
              Email Address
            </label>
            <Input
              type="email"
              value={shopProfile.storeEmail}
              onChange={(e) => handleInputChange("storeEmail", e.target.value)}
              placeholder="contact@yourshop.com"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="inline h-4 w-4 mr-1" />
              Website URL
            </label>
            <Input
              value={shopProfile.storeWebsite}
              onChange={(e) => handleInputChange("storeWebsite", e.target.value)}
              placeholder="https://yourshop.com"
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderShopMedia = () => (
    <div className="space-y-6">
      {uploadError && (
        <Alert variant="danger" title="Upload Error">
          {uploadError}
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Shop Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Shop Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Logo
            </label>
            <div className="flex items-center space-x-4">
              <Avatar size="lg" src={shopProfile.storeLogo} fallback="Logo" />
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleImageUpload("storeLogo")}
                  disabled={!isEditing || isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload Logo"}
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 300x300px, max 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <div className="space-y-4">
              <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={shopProfile.bannerImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleImageUpload("bannerImage")}
                      disabled={isUploading}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {isUploading ? "Uploading..." : "Change Cover"}
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Recommended: 1200x400px, max 5MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStoreStatistics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Store Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentStore ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900">
                  ${currentStore.totalSales || 0}
                </p>
                <p className="text-sm text-green-700">Total Sales</p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900">
                  {currentStore.totalProducts || 0}
                </p>
                <p className="text-sm text-blue-700">Total Products</p>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-900">
                  {currentStore.rating || 0}
                </p>
                <p className="text-sm text-yellow-700">Store Rating</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <Badge variant={currentStore.status === "active" ? "success" : "warning"}>
                  {currentStore.status || "Inactive"}
                </Badge>
                <p className="text-sm text-purple-700 mt-2">Store Status</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No store data available</p>
              <p className="text-sm text-gray-400 mt-2">Create your store profile to see statistics</p>
            </div>
          )}
        </CardContent>
      </Card>

      {currentStore && (
        <Card>
          <CardHeader>
            <CardTitle>Store Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Store ID</span>
              <span className="text-sm font-medium">{currentStore.storeId || currentStore._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Created</span>
              <span className="text-sm font-medium">
                {currentStore.createdAt ? new Date(currentStore.createdAt).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="text-sm font-medium">
                {currentStore.updatedAt ? new Date(currentStore.updatedAt).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Seller ID</span>
              <span className="text-sm font-medium">{currentStore.sellerId || "N/A"}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "basic":
        return renderBasicInformation();
      case "contact":
        return renderContactDetails();
      case "media":
        return renderShopMedia();
      case "stats":
        return renderStoreStatistics();
      default:
        return renderBasicInformation();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Store Management
          </h1>
          <p className="text-gray-600">
            {hasStore ? "Manage your shop profile and settings" : "Create your shop profile"}
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            onClick={refreshStores}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {!isEditing && hasStore && (
            <Button variant="primary" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
          {isEditing && (
            <>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSave}
                disabled={isLoading || !hasChanges}
              >
                <Save className="h-4 w-4 mr-2" />
                {hasStore ? "Save Changes" : "Create Store"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <Alert variant="danger" title="Error">
          {error}
        </Alert>
      )}
      
      {success && message && (
        <Alert variant="success" title="Success">
          {message}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <section.icon className="h-4 w-4 mr-3" />
                      {section.name}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          {hasStore && currentStore && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Total Products</p>
                  <p className="text-lg font-semibold">{currentStore.totalProducts || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Store Rating</p>
                  <div className="flex items-center gap-1">
                    <p className="text-lg font-semibold">{currentStore.rating || 0}</p>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <Badge variant={currentStore.status === "active" ? "success" : "warning"}>
                    {currentStore.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                <p className="ml-3 text-gray-500">Loading store data...</p>
              </CardContent>
            </Card>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;