/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import {
  User,
  ArrowLeft,
  Camera,
  Edit3,
  Save,
  X,
  MapPin,
  Phone,
  AlertTriangle,
  Trash2,
  UserCheck,
  Check,
  AlertCircle,
  Plus,
  Home,
  Building,
} from "lucide-react";
import {
  Button,
  Badge,
  ContactCard as Card,
  Input,
} from "../../components/ui/ContactUis/Uis";
import { useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { useSelector } from "react-redux";
import {
  selectUser as selectAuthUser,
  selectUserFullName,
  selectUserEmail,
} from "../../store/slices/authSlice";
import {
  AccountDeletionDialog,
  AddressDeletionDialog,
} from "../../components/ui/ConfirmationDialog";

// Address Modal Component
const AddressModal = ({
  isOpen,
  onClose,
  onSave,
  editingAddress,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    addressType: "home",
    firstName: "",
    lastName: "",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    isDefault: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingAddress) {
      setFormData(editingAddress);
    } else {
      setFormData({
        addressType: "home",
        firstName: "",
        lastName: "",
        streetAddress: "",
        apartment: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        isDefault: false,
      });
    }
  }, [editingAddress, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.streetAddress.trim())
      newErrors.streetAddress = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Type
              </label>
              <select
                value={formData.addressType}
                onChange={(e) => handleChange("addressType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
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
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <Input
                type="text"
                value={formData.streetAddress}
                onChange={(e) => handleChange("streetAddress", e.target.value)}
                className={errors.streetAddress ? "border-red-500" : ""}
              />
              {errors.streetAddress && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.streetAddress}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apartment/Unit (Optional)
              </label>
              <Input
                type="text"
                value={formData.apartment}
                onChange={(e) => handleChange("apartment", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <Input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <Input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  className={errors.state ? "border-red-500" : ""}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <Input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleChange("zipCode", e.target.value)}
                  className={errors.zipCode ? "border-red-500" : ""}
                />
                {errors.zipCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <Input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => handleChange("isDefault", e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                Set as default address
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : null}
                {editingAddress ? "Update" : "Add"} Address
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Redux selectors
  const authUser = useSelector(selectAuthUser);
  const userFullName = useSelector(selectUserFullName);
  const userEmail = useSelector(selectUserEmail);

  // User hook
  const {
    addresses,
    addressesLoading,
    addressesError,
    loading,
    error,
    success,
    message,
    userProfile,
    profileLoading,
    profileError,
    fetchAddresses,
    addAddress,
    editAddress,
    removeAddress,
    updateProfile,
    deleteAccount,
    fetchUserProfile,
    clearErrors,
    clearSuccessState,
    addressesSummary,
  } = useUser();

  // Profile data state - initialized from Redux
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
    avatar: null,
    bio: "",
  });

  // Address management state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // UI state
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);

  // Confirmation dialog states
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [showDeleteAddressDialog, setShowDeleteAddressDialog] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "account", label: "Account", icon: UserCheck },
  ];

  // Initialize profile data from Redux and API on component mount
  useEffect(() => {
    if (authUser) {
      // Set initial data from auth state
      setProfileData({
        firstName: authUser.firstName || "",
        lastName: authUser.lastName || "",
        email: authUser.email || "",
        phone: authUser.phoneNumber || "",
        dateOfBirth: authUser.dateOfBirth
          ? authUser.dateOfBirth.split("T")[0]
          : "",
        gender: authUser.gender || "male",
        avatar: null,
        bio: authUser.bio || "",
      });

      // Fetch fresh profile data from API
      fetchUserProfile(authUser._id);

      // Fetch addresses when component mounts
      fetchAddresses(authUser._id);
    }
  }, [authUser, fetchUserProfile, fetchAddresses]);

  // Update profile data when userProfile from API is loaded
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        email: userProfile.email || "",
        phone: userProfile.phoneNumber || "",
        dateOfBirth: userProfile.dateOfBirth
          ? userProfile.dateOfBirth.split("T")[0]
          : "",
        gender: userProfile.gender || "male",
        avatar: null,
        bio: userProfile.bio || "",
      });
    }
  }, [userProfile]);

  // Handle success/error messages
  useEffect(() => {
    if (success && message) {
      setSuccessMessage(message);
      setTimeout(() => {
        setSuccessMessage("");
        clearSuccessState();
      }, 3000);
    }
  }, [success, message, clearSuccessState]);

  // Clear errors when they exist
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        clearErrors();
      }, 5000);
    }
  }, [error, clearErrors]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Check if phone is a valid string
    if (!phone || typeof phone !== 'string') {
      return false;
    }
    
    // Remove all spaces, dashes, and parentheses
    const cleanedPhone = phone.replace(/[\s\-()]/g, "");
    
    // Validate Sri Lankan phone numbers:
    // 1. Local format: 07XXXXXXXX (9-10 digits starting with 07)
    // 2. International format: +947XXXXXXXX (11-12 digits starting with +947)
    const localPhoneRegex = /^07\d{7,8}$/;
    const internationalPhoneRegex = /^\+947\d{7,8}$/;
    
    return localPhoneRegex.test(cleanedPhone) || internationalPhoneRegex.test(cleanedPhone);
  };

  // Handle profile data changes
  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
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

   // Validate required fields including firstName and lastName
   if (!profileData.firstName.trim())
     newErrors.firstName = "First name is required";
   if (!profileData.lastName.trim())
     newErrors.lastName = "Last name is required";
   if (!validateEmail(profileData.email))
     newErrors.email = "Invalid email address";
   if (profileData.phone && !validatePhone(profileData.phone))
     newErrors.phone = "Invalid phone number";

   setErrors(newErrors);

   if (Object.keys(newErrors).length === 0) {
     try {
       // Updated payload to include firstName and lastName
       const updateData = {
         userId: authUser._id,
         firstName: profileData.firstName.trim(),
         lastName: profileData.lastName.trim(),
         phoneNumber: profileData.phone.trim(),
         dateOfBirth: profileData.dateOfBirth,
         gender: profileData.gender,
         bio: profileData.bio.trim(),
         isActive: true,
       };

       await updateProfile(updateData);
       setIsEditing(false);
     } catch (error) {
       setErrors({ general: "Failed to update profile. Please try again." });
     }
   }
 };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(authUser._id);
      // After successful deletion, redirect to home or login
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setErrors({ general: "Failed to delete account. Please try again." });
    } finally {
      setShowDeleteAccountDialog(false);
    }
  };

  // Address management functions
  const handleAddressAdd = () => {
    if (addressesSummary.maxReached) {
      setErrors({ address: "Maximum 5 addresses allowed" });
      return;
    }
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const handleAddressEdit = (address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleAddressSave = async (addressData) => {
    try {
      const addressPayload = {
        ...addressData,
        buyerId: authUser._id,
      };

      if (editingAddress) {
        await editAddress(editingAddress._id, addressData);
      } else {
        await addAddress(addressPayload);
      }

      setShowAddressModal(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleAddressDeleteClick = (address) => {
    setAddressToDelete(address);
    setShowDeleteAddressDialog(true);
  };

  const handleAddressDeleteConfirm = async () => {
    if (addressToDelete) {
      try {
        await removeAddress(addressToDelete._id);
      } catch (error) {
        console.error("Error deleting address:", error);
      } finally {
        setShowDeleteAddressDialog(false);
        setAddressToDelete(null);
      }
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case "home":
        return Home;
      case "work":
        return Building;
      default:
        return MapPin;
    }
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
              {isEditing && activeTab === "personal" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
              {activeTab === "personal" && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    isEditing ? handleSaveProfile() : setIsEditing(true)
                  }
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : isEditing ? (
                    <Save className="h-4 w-4 mr-2" />
                  ) : (
                    <Edit3 className="h-4 w-4 mr-2" />
                  )}
                  {isEditing ? "Save" : "Edit"}
                </Button>
              )}
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
        {(error || profileError || errors.general || errors.address) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">
              {error || profileError || errors.general || errors.address}
            </span>
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
                      onError={(e) => {
                        e.target.src = "/user.png";
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg border-4 border-blue-100">
                      {getInitials(
                        profileData.firstName || "U",
                        profileData.lastName || "U"
                      )}
                    </div>
                  )}
                  {isEditing && activeTab === "personal" && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">
                  {userFullName || "User"}
                </h3>
                <p className="text-sm text-gray-600">{userEmail}</p>
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
                      {tab.id === "addresses" && addresses.length > 0 && (
                        <Badge
                          variant="secondary"
                          size="sm"
                          className="ml-auto"
                        >
                          {addresses.length}
                        </Badge>
                      )}
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

                {profileLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">
                      Loading profile...
                    </span>
                  </div>
                ) : (
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
                        disabled={true} // Email cannot be changed
                        className="bg-gray-50 cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Email address cannot be changed for security reasons
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          handleProfileChange("phone", e.target.value)
                        }
                        disabled={!isEditing} // Make sure this is properly controlled by isEditing
                        className={errors.phone ? "border-red-500" : ""}
                        placeholder="+94771234567"
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
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) =>
                          handleProfileChange("bio", e.target.value)
                        }
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 resize-none"
                        placeholder="Tell us a bit about yourself..."
                      />
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </Card>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                    My Addresses
                  </h2>
                  <Button
                    onClick={handleAddressAdd}
                    variant="primary"
                    size="sm"
                    className="flex items-center"
                    disabled={addressesSummary.maxReached}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Address
                  </Button>
                </div>

                {addressesSummary.maxReached && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      Maximum of 5 addresses allowed. Delete an existing address
                      to add a new one.
                    </p>
                  </div>
                )}

                {addressesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No addresses found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Add your first address to get started with deliveries.
                    </p>
                    <Button
                      onClick={handleAddressAdd}
                      variant="primary"
                      className="flex items-center mx-auto"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Address
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => {
                      const AddressIcon = getAddressIcon(address.addressType);
                      return (
                        <div
                          key={address._id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <AddressIcon className="h-4 w-4 text-gray-600" />
                                <Badge
                                  variant={
                                    address.addressType === "home"
                                      ? "success"
                                      : address.addressType === "work"
                                      ? "primary"
                                      : "secondary"
                                  }
                                  size="sm"
                                >
                                  {address.addressType.charAt(0).toUpperCase() +
                                    address.addressType.slice(1)}
                                </Badge>
                                {address.isDefault && (
                                  <Badge variant="secondary" size="sm">
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <p className="font-semibold text-gray-900">
                                {address.firstName} {address.lastName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {address.streetAddress}
                                {address.apartment && `, ${address.apartment}`}
                              </p>
                              <p className="text-sm text-gray-600">
                                {address.city}, {address.state}{" "}
                                {address.zipCode}
                              </p>
                              <p className="text-sm text-gray-600 flex items-center mt-1">
                                <Phone className="h-3 w-3 mr-1" />
                                {address.phoneNumber}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                onClick={() => handleAddressEdit(address)}
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() =>
                                  handleAddressDeleteClick(address)
                                }
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            )}

            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="space-y-6">
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
                      onClick={() => setShowDeleteAccountDialog(true)}
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

      {/* Address Modal */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
        }}
        onSave={handleAddressSave}
        editingAddress={editingAddress}
        isLoading={addressesLoading}
      />

      {/* Delete Account Confirmation Dialog */}
      <AccountDeletionDialog
        isOpen={showDeleteAccountDialog}
        onClose={() => setShowDeleteAccountDialog(false)}
        onConfirm={handleDeleteAccount}
        isLoading={loading}
        userEmail={userEmail}
      />

      {/* Delete Address Confirmation Dialog */}
      <AddressDeletionDialog
        isOpen={showDeleteAddressDialog}
        onClose={() => {
          setShowDeleteAddressDialog(false);
          setAddressToDelete(null);
        }}
        onConfirm={handleAddressDeleteConfirm}
        isLoading={addressesLoading}
        address={addressToDelete}
      />
    </div>
  );
};

export default Profile;
