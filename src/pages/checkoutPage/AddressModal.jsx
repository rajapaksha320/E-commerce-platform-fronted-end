/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { X, Home, Building, User, Phone, MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";
import { selectUser as selectAuthUser } from "../../store/slices/authSlice";

const AddressModal = ({ isOpen, onClose, onSave, editingAddress = null }) => {
  const authUser = useSelector(selectAuthUser);

  const [formData, setFormData] = useState({
    _id: null,
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sri Lankan provinces/states
  const states = [
    "Western",
    "Central",
    "Southern",
    "Northern",
    "Eastern",
    "North Western",
    "North Central",
    "Uva",
    "Sabaragamuwa",
  ];

  // Initialize form data when editing address changes
  useEffect(() => {
    if (editingAddress) {
      setFormData({
        _id: editingAddress._id,
        addressType: editingAddress.addressType || "home",
        firstName: editingAddress.firstName || "",
        lastName: editingAddress.lastName || "",
        streetAddress: editingAddress.streetAddress || "",
        apartment: editingAddress.apartment || "",
        city: editingAddress.city || "",
        state: editingAddress.state || "",
        zipCode: editingAddress.zipCode || "",
        phoneNumber: editingAddress.phoneNumber || "",
        isDefault: editingAddress.isDefault || false,
      });
    } else {
      // Reset form for new address
      setFormData({
        _id: null,
        addressType: "home",
        firstName: authUser?.firstName || "",
        lastName: authUser?.lastName || "",
        streetAddress: "",
        apartment: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: authUser?.phoneNumber || "",
        isDefault: false,
      });
    }
    setErrors({});
  }, [editingAddress, authUser]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.streetAddress.trim())
      newErrors.streetAddress = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "Province is required";
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "Postal code is required";
    } else if (!/^\d{5}$/.test(formData.zipCode)) {
      newErrors.zipCode = "Invalid postal code format (5 digits)";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[+]?[0-9\s\-()]{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Map form data to API structure
      const addressPayload = {
        buyerId: authUser._id,
        addressType: formData.addressType,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        streetAddress: formData.streetAddress.trim(),
        apartment: formData.apartment.trim() || "",
        city: formData.city.trim(),
        state: formData.state,
        zipCode: formData.zipCode.trim(),
        phoneNumber: formData.phoneNumber.replace(/[\s\-()]/g, ""), // Clean phone number
        isDefault: formData.isDefault,
      };

      // If editing, include the ID
      if (formData._id) {
        await onSave({ ...addressPayload, _id: formData._id });
      } else {
        await onSave(addressPayload);
      }
    } catch (error) {
      console.error("Error saving address:", error);
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      _id: null,
      addressType: "home",
      firstName: authUser?.firstName || "",
      lastName: authUser?.lastName || "",
      streetAddress: "",
      apartment: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: authUser?.phoneNumber || "",
      isDefault: false,
    });
    setErrors({});
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(
      3,
      6
    )} ${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (value) => {
    const formatted = formatPhoneNumber(value);
    handleChange("phoneNumber", formatted);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <MapPin className="h-5 w-5 text-blue-600 mr-2" />
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-2"
              disabled={isSubmitting}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Address Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Address Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "home", label: "Home", icon: Home },
                { id: "work", label: "Work", icon: Building },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleChange("addressType", id)}
                  disabled={isSubmitting}
                  className={`p-3 rounded-lg border-2 transition-colors duration-200 flex items-center justify-center space-x-2 ${
                    formData.addressType === id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              value={formData.streetAddress}
              onChange={(e) => handleChange("streetAddress", e.target.value)}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                errors.streetAddress ? "border-red-500" : "border-gray-300"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="Enter street address"
            />
            {errors.streetAddress && (
              <p className="mt-1 text-sm text-red-600">
                {errors.streetAddress}
              </p>
            )}
          </div>

          {/* Apartment/Suite */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apartment, Suite, etc. (Optional)
            </label>
            <input
              type="text"
              value={formData.apartment}
              onChange={(e) => handleChange("apartment", e.target.value)}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              placeholder="Apt, Suite, Floor, etc."
            />
          </div>

          {/* City, State, ZIP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                  errors.city ? "border-red-500" : "border-gray-300"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                placeholder="Enter city"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Province *
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                  errors.state ? "border-red-500" : "border-gray-300"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <option value="">Select province</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code *
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => handleChange("zipCode", e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                  errors.zipCode ? "border-red-500" : "border-gray-300"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                placeholder="12345"
                maxLength={5}
              />
              {errors.zipCode && (
                <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="077 123 4567"
              maxLength={15}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Default Address Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => handleChange("isDefault", e.target.checked)}
              disabled={isSubmitting}
              className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
            <label
              htmlFor="isDefault"
              className={`ml-2 block text-sm text-gray-700 ${
                isSubmitting ? "opacity-50" : ""
              }`}
            >
              Set as default address
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 sm:flex-none"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 sm:flex-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : editingAddress ? (
                "Update Address"
              ) : (
                "Save Address"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
