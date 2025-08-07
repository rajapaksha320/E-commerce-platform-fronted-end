import React, { useState } from "react";
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
} from "../../../ui/sellerUis/Uis";

const ProfileManagement = () => {
  const [activeSection, setActiveSection] = useState("basic");

  // Shop profile state
  const [shopProfile, setShopProfile] = useState({
    name: "My Shop",
    tagline: "Quality products at great prices",
    description:
      "We specialize in providing high-quality products with excellent customer service.",
    logo: "/api/placeholder/150/150",
    coverImage: "/api/placeholder/800/300",
    location: "New York, NY",
    businessHours: "Mon-Fri 9AM-6PM",
    phone: "+1 (555) 123-4567",
    email: "contact@myshop.com",
    website: "https://myshop.com",
    verified: false,
    badge: "Top Seller",
  });

  const sections = [
    { id: "basic", name: "Basic Information", icon: User },
    { id: "contact", name: "Contact Details", icon: Phone },
    { id: "media", name: "Shop Media", icon: Camera },
  ];

  const handleInputChange = (field, value) => {
    setShopProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setShopProfile((prev) => ({
            ...prev,
            [type]: e.target.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving profile...", shopProfile);
    alert("Profile updated successfully!");
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
              value={shopProfile.name}
              onChange={(e) =>
                handleInputChange("name", e.target.value)
              }
              placeholder="Enter your shop name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline
            </label>
            <Input
              value={shopProfile.tagline}
              onChange={(e) =>
                handleInputChange("tagline", e.target.value)
              }
              placeholder="A short description of your shop"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Description
            </label>
            <textarea
              value={shopProfile.description}
              onChange={(e) =>
                handleInputChange("description", e.target.value)
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your shop, what you sell, and what makes you unique..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Badge
            </label>
            <Select
              value={shopProfile.badge}
              onChange={(e) =>
                handleInputChange("badge", e.target.value)
              }
            >
              <option value="">No Badge</option>
              <option value="Top Seller">Top Seller</option>
              <option value="Verified">Verified</option>
              <option value="Premium">Premium</option>
              <option value="New Seller">New Seller</option>
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
              value={shopProfile.location}
              onChange={(e) =>
                handleInputChange("location", e.target.value)
              }
              placeholder="City, State/Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline h-4 w-4 mr-1" />
              Phone Number
            </label>
            <Input
              value={shopProfile.phone}
              onChange={(e) =>
                handleInputChange("phone", e.target.value)
              }
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
              value={shopProfile.email}
              onChange={(e) =>
                handleInputChange("email", e.target.value)
              }
              placeholder="contact@yourshop.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="inline h-4 w-4 mr-1" />
              Website URL
            </label>
            <Input
              value={shopProfile.website}
              onChange={(e) =>
                handleInputChange("website", e.target.value)
              }
              placeholder="https://yourshop.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline h-4 w-4 mr-1" />
              Business Hours
            </label>
            <Input
              value={shopProfile.businessHours}
              onChange={(e) =>
                handleInputChange("businessHours", e.target.value)
              }
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
              <Avatar size="lg" src={shopProfile.logo} fallback="Logo" />
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleImageUpload("logo")}
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
                  src={shopProfile.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleImageUpload("coverImage")}
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
            Manage your shop  and settings
          </p>
        </div>
        <Button variant="primary" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

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
        <div className="lg:col-span-3">{renderContent()}</div>
      </div>
    </div>
  );
};

export default ProfileManagement;