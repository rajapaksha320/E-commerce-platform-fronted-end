// components/seller/MultiStepSellerForm.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Building,
  MapPin,
  Phone,
  Globe,
  Shield,
  CheckCircle,
  Store,
  FileText,
  X,
  ExternalLink,
  Sparkles,
  Home,
} from "lucide-react";

import { Button, Card, Input, Select, StepIndicator, StepNavigation } from "../../ui/sellerUis/SellerUis";
import { countries } from "./countries";
import {
  sellerRegistration,
  clearError,
  clearSuccess,
  selectLoading,
  selectError,
  selectSuccess,
  selectUser,
} from "../../../store/slices/authSlice";

// Success Modal Component
const SuccessModal = ({ isOpen, onClose, userData }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSellerHubNavigation = () => {
    navigate("/seller-dashboard");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Animation Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"></div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-16 right-16 w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-8 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-12 w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
        </div>

        <div className="relative p-8 text-center">
          {/* Success Icon with Animation */}
          <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          {/* Sparkles decoration */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>

          {/* Success Message */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            🎉 Registration Complete!
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Welcome to{" "}
            <span className="font-semibold text-blue-600">Emmover</span>,{" "}
            {userData?.firstName}!<br />
            Your seller account has been successfully created.
          </p>

          {/* User Details Summary */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-2">
            <div className="flex items-center text-sm">
              <User className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-gray-600 flex-1">
                {userData?.firstName} {userData?.lastName}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Mail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-gray-600 flex-1">{userData?.email}</span>
            </div>
            <div className="flex items-center text-sm">
              <Building className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-gray-600 flex-1">
                {userData?.businessName}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleSellerHubNavigation}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              size="lg"
            >
              <Store className="w-5 h-5 mr-2" />
              Access Seller Hub
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Close
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <Shield className="w-3 h-3 mr-1" />
              Your account is secure and ready to use
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions remain the same
const formatPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, "");
  const limitedDigits = digits.substring(0, 10);

  if (limitedDigits.length >= 6) {
    return `${limitedDigits.substring(0, 3)}-${limitedDigits.substring(
      3,
      6
    )}-${limitedDigits.substring(6)}`;
  } else if (limitedDigits.length >= 3) {
    return `${limitedDigits.substring(0, 3)}-${limitedDigits.substring(3)}`;
  } else {
    return limitedDigits;
  }
};

const validatePhoneNumber = (phone) => {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 0) {
    return "Phone number is required";
  }

  if (digits.length < 10) {
    return "Phone number must be at least 10 digits";
  }

  if (digits.length > 10) {
    return "Phone number must be exactly 10 digits";
  }

  if (!/^\d{10}$/.test(digits)) {
    return "Please enter a valid phone number";
  }

  return "";
};

// Country Select Component (remains the same)
const CountrySelect = ({ value, onChange, error, required = false }) => {
  return (
    <Select
      label="Country"
      error={error}
      required={required}
      value={value}
      onChange={onChange}
      icon={<Globe className="w-5 h-5" />}
    >
      <option value="">Select Country</option>
      {countries.map((country) => (
        <option key={country.code} value={country.code}>
          {country.flag} {country.name}
        </option>
      ))}
    </Select>
  );
};

// Phone Input Component (remains the same)
const PhoneInput = ({
  countryCode,
  phone,
  onCountryChange,
  onPhoneChange,
  error,
  required = false,
}) => {
  const selectedCountry = countries.find((c) => c.code === countryCode);

  const handlePhoneChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatPhoneNumber(rawValue);

    const formattedEvent = {
      target: {
        name: e.target.name,
        value: formattedValue,
      },
    };

    onPhoneChange(formattedEvent);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        Phone Number
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex gap-2">
        <div className="w-32">
          <select
            className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-sm"
            value={countryCode}
            onChange={onCountryChange}
          >
            <option value="">Code</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.dialCode}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              name="phone"
              placeholder="123-456-7890"
              className={`w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder:text-gray-400 ${
                error
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
              value={phone}
              onChange={handlePhoneChange}
              maxLength={12}
            />
          </div>
        </div>
      </div>
      {selectedCountry && (
        <p className="text-sm text-blue-600">
          {selectedCountry.flag} {selectedCountry.name} (
          {selectedCountry.dialCode})
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
      <p className="text-xs text-gray-500">Format: 123-456-7890 (10 digits)</p>
    </div>
  );
};

// Main Multi-Step Form
const MultiStepSellerForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const user = useSelector(selectUser);

  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",

    // Business Information
    businessName: "",
    businessType: "",
    taxId: "",
    website: "",

    // Contact Information
    street: "",
    city: "",
    state: "",
    zipCode: "",
    countryCode: "",
    phoneCountry: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  // Handle successful registration
  useEffect(() => {
    if (success && user?.userRole === 'seller') {
      setShowSuccessModal(true);
    }
  }, [success, user]);

  // Clear Redux state on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  const steps = [
    {
      title: "Personal Info",
      icon: User,
      description: "Tell us about yourself",
    },
    {
      title: "Business Info",
      icon: Building,
      description: "Your business details",
    },
    {
      title: "Contact Info",
      icon: MapPin,
      description: "Address and contact",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear Redux error
    if (error) {
      dispatch(clearError());
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
        }
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
          newErrors.password = "Password must include uppercase, lowercase, numbers and special characters";
        }
        if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
        else if (formData.confirmPassword !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;

      case 2: // Business Information
        if (!formData.businessName)
          newErrors.businessName = "Business name is required";
        if (!formData.businessType)
          newErrors.businessType = "Business type is required";
        break;

      case 3: {
        // Contact Information
        if (!formData.street) newErrors.street = "Street address is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.state) newErrors.state = "State/Region is required";
        if (!formData.zipCode)
          newErrors.zipCode = "ZIP/Postal code is required";
        if (!formData.countryCode)
          newErrors.countryCode = "Country is required";

        const phoneError = validatePhoneNumber(formData.phone);
        if (phoneError) {
          newErrors.phone = phoneError;
        }
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      try {
        await dispatch(sellerRegistration(formData)).unwrap();
      } catch (err) {
        // Error is handled by Redux state
        console.error('Seller registration failed:', err);
      }
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/seller-dashboard");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Personal Information
              </h3>
              <p className="text-gray-600">
                Let's start with your basic information
              </p>
            </div>

            {/* Display Redux error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                required
                icon={<User className="w-5 h-5" />}
                error={errors.firstName}
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                required
                icon={<User className="w-5 h-5" />}
                error={errors.lastName}
              />
            </div>

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              required
              icon={<Mail className="w-5 h-5" />}
              error={errors.email}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              icon={<Shield className="w-5 h-5" />}
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              icon={<Shield className="w-5 h-5" />}
              error={errors.confirmPassword}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Business Information
              </h3>
              <p className="text-gray-600">Tell us about your business</p>
            </div>

            {/* Display Redux error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="Your Business Name"
                required
                icon={<Store className="w-5 h-5" />}
                error={errors.businessName}
              />
              <Select
                label="Business Type"
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                required
                icon={<Building className="w-5 h-5" />}
                error={errors.businessType}
              >
                <option value="">Select Business Type</option>
                <option value="individual">Individual/Sole Proprietor</option>
                <option value="llc">LLC</option>
                <option value="corporation">Corporation</option>
                <option value="partnership">Partnership</option>
                <option value="nonprofit">Non-Profit</option>
              </Select>
              <Input
                label="Tax ID / EIN"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                placeholder="12-3456789"
                icon={<FileText className="w-5 h-5" />}
                error={errors.taxId}
              />
              <Input
                label="Website (Optional)"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://yourbusiness.com"
                icon={<Globe className="w-5 h-5" />}
                error={errors.website}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Contact Information
              </h3>
              <p className="text-gray-600">
                Your business address and contact details
              </p>
            </div>

            {/* Display Redux error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Input
              label="Street Address"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              placeholder="123 Main Street, Suite 100"
              required
              icon={<MapPin className="w-5 h-5" />}
              error={errors.street}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="New York"
                required
                error={errors.city}
              />
              <Input
                label="State/Region"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="NY"
                required
                error={errors.state}
              />
              <Input
                label="ZIP/Postal Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="10001"
                required
                error={errors.zipCode}
              />
            </div>

            <CountrySelect
              value={formData.countryCode}
              onChange={(e) =>
                handleInputChange({
                  target: { name: "countryCode", value: e.target.value },
                })
              }
              error={errors.countryCode}
              required
            />

            <PhoneInput
              countryCode={formData.phoneCountry}
              phone={formData.phone}
              onCountryChange={(e) =>
                handleInputChange({
                  target: { name: "phoneCountry", value: e.target.value },
                })
              }
              onPhoneChange={(e) =>
                handleInputChange({
                  target: { name: "phone", value: e.target.value },
                })
              }
              error={errors.phone}
              required
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(59_130_246)_1px,transparent_0)] opacity-[0.03] bg-[length:48px_48px]"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            {/* Logo */}
            <div className="flex items-center justify-center mb-12">
              <a 
                href="/"
                className="group relative p-3 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 text-gray-400 hover:text-blue-600 transition-all duration-500 transform hover:scale-110 hover:shadow-lg flex items-center justify-center w-14 h-14 border border-gray-200 hover:border-blue-200"
              >
                <Home className="w-8 h-8 transition-transform duration-500 group-hover:scale-110" />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium text-gray-600 whitespace-nowrap">
                  Back to Home
                </span>
              </a>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Become a
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-1">
                Seller Today
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Join our marketplace and start selling to millions of customers
              worldwide
            </p>
          </div>

          {/* Form Card */}
          <Card className="max-w-3xl mx-auto">
            <StepIndicator
              currentStep={currentStep}
              totalSteps={steps.length}
              steps={steps}
            />

            <div className="min-h-[500px]">{renderStepContent()}</div>

            <StepNavigation
              currentStep={currentStep}
              totalSteps={steps.length}
              onNext={handleNext}
              onPrev={handlePrev}
              onSubmit={handleSubmit}
              isSubmitting={isLoading}
              canProceed={true}
            />
          </Card>

          {/* Benefits Footer */}
          <div className="mt-12 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">
                  Secure & Protected
                </span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium text-gray-600">
                  Quick Approval
                </span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Store className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">
                  Start Selling Fast
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        userData={formData}
      />
    </>
  );
};

export default MultiStepSellerForm;