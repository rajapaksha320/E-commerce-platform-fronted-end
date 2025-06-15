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
  Shield,
  Save,
  Eye,
  EyeOff,
  Plus,
  X,
  Verified,
  Star,
  Package,
  Truck,
  RotateCcw,
} from "lucide-react";
import {
  Button,
  Input,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Avatar,
} from "../../../ui/sellerUis/Uis";

const ProfileManagement = () => {
  const [showPassword, setShowPassword] = useState(false);
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

  // Policies state
  const [policies, setPolicies] = useState([
    {
      id: 1,
      title: "Returns",
      description: "30-day return policy",
      icon: RotateCcw,
    },
    {
      id: 2,
      title: "Shipping",
      description: "Free shipping over $50",
      icon: Truck,
    },
    {
      id: 3,
      title: "Quality",
      description: "100% authentic products",
      icon: Shield,
    },
  ]);

  // Account settings state
  const [accountSettings, setAccountSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    orderNotifications: true,
    marketingEmails: false,
    twoFactorAuth: false,
  });

  const sections = [
    { id: "basic", name: "Basic Information", icon: User },
    { id: "contact", name: "Contact Details", icon: Phone },
    { id: "media", name: "Shop Media", icon: Camera },
    { id: "policies", name: "Shop Policies", icon: Shield },
    { id: "account", name: "Account Settings", icon: User },
  ];

  const handleInputChange = (section, field, value) => {
    if (section === "shop") {
      setShopProfile((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else if (section === "account") {
      setAccountSettings((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
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

  const addPolicy = () => {
    const newPolicy = {
      id: Date.now(),
      title: "New Policy",
      description: "Policy description",
      icon: Package,
    };
    setPolicies([...policies, newPolicy]);
  };

  const updatePolicy = (id, field, value) => {
    setPolicies(
      policies.map((policy) =>
        policy.id === id ? { ...policy, [field]: value } : policy
      )
    );
  };

  const removePolicy = (id) => {
    setPolicies(policies.filter((policy) => policy.id !== id));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving profile...", {
      shopProfile,
      policies,
      accountSettings,
    });
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
                handleInputChange("shop", "name", e.target.value)
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
                handleInputChange("shop", "tagline", e.target.value)
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
                handleInputChange("shop", "description", e.target.value)
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
                handleInputChange("shop", "badge", e.target.value)
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
                handleInputChange("shop", "location", e.target.value)
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
                handleInputChange("shop", "phone", e.target.value)
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
                handleInputChange("shop", "email", e.target.value)
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
                handleInputChange("shop", "website", e.target.value)
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
                handleInputChange("shop", "businessHours", e.target.value)
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

  const renderShopPolicies = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Shop Policies</CardTitle>
          <Button variant="outline" size="sm" onClick={addPolicy}>
            <Plus className="h-4 w-4 mr-2" />
            Add Policy
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="p-4 border border-gray-200 rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <policy.icon className="h-5 w-5 text-blue-600" />
                    <Input
                      value={policy.title}
                      onChange={(e) =>
                        updatePolicy(policy.id, "title", e.target.value)
                      }
                      className="font-medium"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePolicy(policy.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <textarea
                  value={policy.description}
                  onChange={(e) =>
                    updatePolicy(policy.id, "description", e.target.value)
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Policy description..."
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={accountSettings.currentPassword}
                onChange={(e) =>
                  handleInputChange(
                    "account",
                    "currentPassword",
                    e.target.value
                  )
                }
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <Input
              type="password"
              value={accountSettings.newPassword}
              onChange={(e) =>
                handleInputChange("account", "newPassword", e.target.value)
              }
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <Input
              type="password"
              value={accountSettings.confirmPassword}
              onChange={(e) =>
                handleInputChange("account", "confirmPassword", e.target.value)
              }
              placeholder="Confirm new password"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Notifications
              </label>
              <p className="text-xs text-gray-500">
                Receive general email notifications
              </p>
            </div>
            <input
              type="checkbox"
              checked={accountSettings.emailNotifications}
              onChange={(e) =>
                handleInputChange(
                  "account",
                  "emailNotifications",
                  e.target.checked
                )
              }
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Order Notifications
              </label>
              <p className="text-xs text-gray-500">
                Get notified about new orders and updates
              </p>
            </div>
            <input
              type="checkbox"
              checked={accountSettings.orderNotifications}
              onChange={(e) =>
                handleInputChange(
                  "account",
                  "orderNotifications",
                  e.target.checked
                )
              }
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Marketing Emails
              </label>
              <p className="text-xs text-gray-500">
                Receive promotional emails and updates
              </p>
            </div>
            <input
              type="checkbox"
              checked={accountSettings.marketingEmails}
              onChange={(e) =>
                handleInputChange(
                  "account",
                  "marketingEmails",
                  e.target.checked
                )
              }
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Two-Factor Authentication
              </label>
              <p className="text-xs text-gray-500">
                Add an extra layer of security to your account
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={accountSettings.twoFactorAuth}
                onChange={(e) =>
                  handleInputChange(
                    "account",
                    "twoFactorAuth",
                    e.target.checked
                  )
                }
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              {accountSettings.twoFactorAuth && (
                <Badge variant="success" size="xs">
                  <Verified className="h-3 w-3 mr-1" />
                  Enabled
                </Badge>
              )}
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
      case "policies":
        return renderShopPolicies();
      case "account":
        return renderAccountSettings();
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
            Profile Management
          </h1>
          <p className="text-gray-600">
            Manage your shop profile and account settings
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
