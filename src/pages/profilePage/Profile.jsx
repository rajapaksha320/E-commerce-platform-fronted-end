/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import {
  User,
  ArrowLeft,
  Camera,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  Shield,
  Settings,
  Bell,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  Trash2,
  Lock,
  Key,
  UserCheck,
  Download,
  Upload,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  Button,
  Badge,
  ContactCard as Card,
  Input,
} from "../../components/ui/ContactUis/Uis";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Profile data state
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-01-15",
    gender: "male",
    avatar: null,
    bio: "Tech enthusiast and avid online shopper.",
  });

  // Account settings state
  const [accountSettings, setAccountSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    orderUpdates: true,
    newsletter: false,
    twoFactorAuth: false,
  });

  // Security state
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // UI state
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "account", label: "Account", icon: UserCheck },
  ];

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-()]/g, ""));
  };

  const validatePassword = (password) => {
    return (
      password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
    );
  };

  // Handle profile data changes
  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle account settings changes
  const handleSettingChange = (setting, value) => {
    setAccountSettings((prev) => ({ ...prev, [setting]: value }));
  };

  // Handle security data changes
  const handleSecurityChange = (field, value) => {
    setSecurityData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrors((prev) => ({
          ...prev,
          avatar: "File size must be less than 5MB",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData((prev) => ({ ...prev, avatar: e.target.result }));
        setErrors((prev) => ({ ...prev, avatar: "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate and save profile
  const handleSaveProfile = async () => {
    const newErrors = {};

    if (!profileData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!profileData.lastName.trim())
      newErrors.lastName = "Last name is required";
    if (!validateEmail(profileData.email))
      newErrors.email = "Invalid email address";
    if (!validatePhone(profileData.phone))
      newErrors.phone = "Invalid phone number";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsEditing(false);
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        setErrors({ general: "Failed to update profile. Please try again." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    const newErrors = {};

    if (!securityData.currentPassword)
      newErrors.currentPassword = "Current password is required";
    if (!validatePassword(securityData.newPassword)) {
      newErrors.newPassword =
        "Password must be at least 8 characters with uppercase, lowercase, and numbers";
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSecurityData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setSuccessMessage("Password updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        setErrors({ general: "Failed to update password. Please try again." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Redirect to goodbye page or home
      navigate("/account-deleted");
    } catch (error) {
      setErrors({ general: "Failed to delete account. Please try again." });
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigate(-1)}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2" />
                  My Profile
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Manage your account settings and preferences
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  activeTab === "personal"
                    ? isEditing
                      ? handleSaveProfile()
                      : setIsEditing(true)
                    : null
                }
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : isEditing ? (
                  <Save className="h-4 w-4 mr-2" />
                ) : (
                  <Edit3 className="h-4 w-4 mr-2" />
                )}
                {isEditing ? "Save" : "Edit"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <Check className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{errors.general}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              {/* Profile Preview */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg border-4 border-blue-100">
                      {getInitials(profileData.firstName, profileData.lastName)}
                    </div>
                  )}
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">
                  {profileData.firstName} {profileData.lastName}
                </h3>
                <p className="text-sm text-gray-600">{profileData.email}</p>
              </div>

              {/* Tab Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Personal Information Tab */}
            {activeTab === "personal" && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <User className="h-5 w-5 text-blue-600 mr-2" />
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <Input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) =>
                        handleProfileChange("firstName", e.target.value)
                      }
                      disabled={!isEditing}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <Input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) =>
                        handleProfileChange("lastName", e.target.value)
                      }
                      disabled={!isEditing}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        handleProfileChange("email", e.target.value)
                      }
                      disabled={!isEditing}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        handleProfileChange("phone", e.target.value)
                      }
                      disabled={!isEditing}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) =>
                        handleProfileChange("dateOfBirth", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={profileData.gender}
                      onChange={(e) =>
                        handleProfileChange("gender", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleProfileChange("bio", e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 resize-none"
                    placeholder="Tell us a bit about yourself..."
                  />
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Shield className="h-5 w-5 text-blue-600 mr-2" />
                    Security Settings
                  </h2>

                  {/* Change Password */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Key className="h-4 w-4 text-gray-600 mr-2" />
                      Change Password
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Input
                          type={
                            showPasswordFields.current ? "text" : "password"
                          }
                          value={securityData.currentPassword}
                          onChange={(e) =>
                            handleSecurityChange(
                              "currentPassword",
                              e.target.value
                            )
                          }
                          className={
                            errors.currentPassword ? "border-red-500" : ""
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setShowPasswordFields((prev) => ({
                              ...prev,
                              current: !prev.current,
                            }))
                          }
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                        >
                          {showPasswordFields.current ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.currentPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPasswordFields.new ? "text" : "password"}
                          value={securityData.newPassword}
                          onChange={(e) =>
                            handleSecurityChange("newPassword", e.target.value)
                          }
                          className={errors.newPassword ? "border-red-500" : ""}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setShowPasswordFields((prev) => ({
                              ...prev,
                              new: !prev.new,
                            }))
                          }
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                        >
                          {showPasswordFields.new ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.newPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Input
                          type={
                            showPasswordFields.confirm ? "text" : "password"
                          }
                          value={securityData.confirmPassword}
                          onChange={(e) =>
                            handleSecurityChange(
                              "confirmPassword",
                              e.target.value
                            )
                          }
                          className={
                            errors.confirmPassword ? "border-red-500" : ""
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setShowPasswordFields((prev) => ({
                              ...prev,
                              confirm: !prev.confirm,
                            }))
                          }
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                        >
                          {showPasswordFields.confirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="primary"
                      onClick={handlePasswordChange}
                      disabled={
                        isLoading ||
                        !securityData.currentPassword ||
                        !securityData.newPassword ||
                        !securityData.confirmPassword
                      }
                      className="flex items-center"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Lock className="h-4 w-4 mr-2" />
                      )}
                      Update Password
                    </Button>
                  </div>
                </Card>

                {/* Two-Factor Authentication */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-4 w-4 text-gray-600 mr-2" />
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security to your account
                      </p>
                      <Badge
                        variant={
                          accountSettings.twoFactorAuth
                            ? "success"
                            : "secondary"
                        }
                        className="mt-2"
                      >
                        {accountSettings.twoFactorAuth ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <Button
                      variant={
                        accountSettings.twoFactorAuth ? "danger" : "primary"
                      }
                      onClick={() =>
                        handleSettingChange(
                          "twoFactorAuth",
                          !accountSettings.twoFactorAuth
                        )
                      }
                    >
                      {accountSettings.twoFactorAuth ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Settings className="h-5 w-5 text-blue-600 mr-2" />
                  Notification Preferences
                </h2>

                <div className="space-y-6">
                  {[
                    {
                      key: "emailNotifications",
                      label: "Email Notifications",
                      description: "Receive notifications via email",
                    },
                    {
                      key: "smsNotifications",
                      label: "SMS Notifications",
                      description: "Receive notifications via text message",
                    },
                    {
                      key: "marketingEmails",
                      label: "Marketing Emails",
                      description: "Receive promotional emails and offers",
                    },
                    {
                      key: "orderUpdates",
                      label: "Order Updates",
                      description: "Get notified about order status changes",
                    },
                    {
                      key: "newsletter",
                      label: "Newsletter",
                      description: "Subscribe to our weekly newsletter",
                    },
                  ].map((setting) => (
                    <div
                      key={setting.key}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {setting.label}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {setting.description}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={accountSettings[setting.key]}
                          onChange={(e) =>
                            handleSettingChange(setting.key, e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <UserCheck className="h-5 w-5 text-blue-600 mr-2" />
                    Account Management
                  </h2>

                  <div className="space-y-6">
                    {/* Account Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="flex items-center justify-center p-4 h-auto"
                        onClick={() => navigate("/orders")}
                      >
                        <div className="text-center">
                          <Download className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                          <h3 className="font-medium">Download Data</h3>
                          <p className="text-sm text-gray-600">
                            Export your account data
                          </p>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className="flex items-center justify-center p-4 h-auto"
                        onClick={() => navigate("/addresses")}
                      >
                        <div className="text-center">
                          <MapPin className="h-6 w-6 mx-auto mb-2 text-green-600" />
                          <h3 className="font-medium">Manage Addresses</h3>
                          <p className="text-sm text-gray-600">
                            Update delivery addresses
                          </p>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className="flex items-center justify-center p-4 h-auto"
                        onClick={() => navigate("/payment-methods")}
                      >
                        <div className="text-center">
                          <CreditCard className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                          <h3 className="font-medium">Payment Methods</h3>
                          <p className="text-sm text-gray-600">
                            Manage saved cards
                          </p>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className="flex items-center justify-center p-4 h-auto"
                      >
                        <div className="text-center">
                          <Upload className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                          <h3 className="font-medium">Import Data</h3>
                          <p className="text-sm text-gray-600">
                            Import preferences
                          </p>
                        </div>
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Delete Account */}
                <Card className="p-6 border-red-200 bg-red-50">
                  <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    Danger Zone
                  </h3>
                  <div className="bg-white p-4 rounded-lg border border-red-200">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Delete Account
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Permanently delete your account and all associated data.
                      This action cannot be undone.
                    </p>
                    <Button
                      variant="danger"
                      onClick={() => setShowDeleteModal(true)}
                      className="flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete Account
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete your account? This action is
                permanent and cannot be undone. All your data will be
                permanently removed.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteAccount}
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
