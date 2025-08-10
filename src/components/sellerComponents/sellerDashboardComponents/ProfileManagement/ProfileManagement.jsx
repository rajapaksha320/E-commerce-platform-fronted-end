// Example: components/seller/sellerDashboardComponents/ProfileManagement/ProfileManagement.jsx
import React, { useState, useEffect } from "react";
import {
  User,
  Camera,
  Upload,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  Save,
  Loader,
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
} from "../../../ui/sellerUis/Uis";
import { useSellerStore } from "../../../../hooks/useSellerStore";
import { toast } from "react-toastify"; // Assuming you use react-toastify

const ProfileManagement = () => {
  const {
    storeProfile,
    storeStats,
    loading,
    error,
    success,
    message,
    hasStore,
    storeId,
    createStore,
    fetchStoreProfile,
    updateStore,
    uploadLogo,
    uploadBanner,
    clearError,
    clearSuccess,
  } = useSellerStore();

  const [activeSection, setActiveSection] = useState("basic");
  const [formData, setFormData] = useState({
    storeName: "",
    storeTagLine: "",
    storeDescription: "",
    storeLocation: "",
    storeContactNumber: "",
    storeEmail: "",
    storeWebsite: "",
    storeBusinessHours: "",
    storeLogo: "",
    bannerImage: "",
  });

  // Fetch store profile on mount
  useEffect(() => {
    fetchStoreProfile();
  }, [fetchStoreProfile]);

  // Update form when store profile loads
  useEffect(() => {
    if (storeProfile) {
      setFormData({
        storeName: storeProfile.basicInformation?.storeName || "",
        storeTagLine: storeProfile.basicInformation?.storeTagLine || "",
        storeDescription: storeProfile.basicInformation?.storeDescription || "",
        storeLocation: storeProfile.contactDetails?.storeLocation || "",
        storeContactNumber: storeProfile.contactDetails?.storeContactNumber || "",
        storeEmail: storeProfile.contactDetails?.storeEmail || "",
        storeWebsite: storeProfile.contactDetails?.storeWebsite || "",
        storeBusinessHours: storeProfile.contactDetails?.storeBusinessHours || "",
        storeLogo: storeProfile.shopMedia?.storeLogo || "",
        bannerImage: storeProfile.shopMedia?.bannerImage || "",
      });
    }
  }, [storeProfile]);

  // Handle success and error messages
  useEffect(() => {
    if (success && message) {
      toast.success(message);
      clearSuccess();
    }
  }, [success, message, clearSuccess]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          let response;
          if (type === "logo") {
            response = await uploadLogo(file);
          } else {
            response = await uploadBanner(file);
          }
          
          // The URL is already updated in the store through the reducer
          // Just update local form data
          if (response.payload?.url) {
            setFormData((prev) => ({
              ...prev,
              [type === "logo" ? "storeLogo" : "bannerImage"]: response.payload.url,
            }));
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    };
    input.click();
  };

  const handleSave = async () => {
    try {
      if (hasStore && storeId) {
        // Update existing store
        await updateStore(storeId, formData);
      } else {
        // Create new store
        await createStore(formData);
      }
    } catch (error) {
      console.error("Error saving store:", error);
    }
  };

  const sections = [
    { id: "basic", name: "Basic Information", icon: User },
    { id: "contact", name: "Contact Details", icon: Phone },
    { id: "media", name: "Shop Media", icon: Camera },
  ];

  const renderBasicInformation = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shop Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Display non-editable stats */}
          {hasStore && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-xl font-bold">{storeStats.totalSales}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-xl font-bold">{storeStats.totalProducts}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-xl font-bold">⭐ {storeStats.rating}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-xl font-bold capitalize">{storeProfile?.status}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Name *
            </label>
            <Input
              value={formData.storeName}
              onChange={(e) => handleInputChange("storeName", e.target.value)}
              placeholder="Enter your shop name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline
            </label>
            <Input
              value={formData.storeTagLine}
              onChange={(e) => handleInputChange("storeTagLine", e.target.value)}
              placeholder="A short description of your shop"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Description
            </label>
            <textarea
              value={formData.storeDescription}
              onChange={(e) => handleInputChange("storeDescription", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your shop, what you sell, and what makes you unique..."
            />
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
              value={formData.storeLocation}
              onChange={(e) => handleInputChange("storeLocation", e.target.value)}
              placeholder="City, State/Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline h-4 w-4 mr-1" />
              Phone Number
            </label>
            <Input
              value={formData.storeContactNumber}
              onChange={(e) => handleInputChange("storeContactNumber", e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline h-4 w-4 mr-1" />
              Email Address
            </label>
            <Input
              type="email"
              value={formData.storeEmail}
              onChange={(e) => handleInputChange("storeEmail", e.target.value)}
              placeholder="contact@yourshop.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="inline h-4 w-4 mr-1" />
              Website URL
            </label>
            <Input
              value={formData.storeWebsite}
              onChange={(e) => handleInputChange("storeWebsite", e.target.value)}
              placeholder="https://yourshop.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline h-4 w-4 mr-1" />
              Business Hours
            </label>
            <Input
              value={formData.storeBusinessHours}
              onChange={(e) => handleInputChange("storeBusinessHours", e.target.value)}
              placeholder="Mon-Fri 9AM-6PM"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderShopMedia = () => (
    <div className="space-y-6">
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
              <Avatar 
                size="lg" 
                src={formData.storeLogo} 
                fallback="Logo" 
              />
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleImageUpload("logo")}
                  disabled={loading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
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
                  src={formData.bannerImage || "/api/placeholder/800/300"}
                  alt="Cover"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleImageUpload("banner")}
                    disabled={loading}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Change Cover
                  </Button>
                </div>
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

  const renderContent = () => {
    switch (activeSection) {
      case "basic":
        return renderBasicInformation();
      case "contact":
        return renderContactDetails();
      case "media":
        return renderShopMedia();
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
            Shop Management
          </h1>
          <p className="text-gray-600">
            Manage your shop profile and settings
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {hasStore ? "Update Shop" : "Create Shop"}
            </>
          )}
        </Button>
      </div>

      {/* Show error alert if exists */}
      {error && (
        <Alert variant="danger" title="Error">
          {error}
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
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {loading && !storeProfile ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;