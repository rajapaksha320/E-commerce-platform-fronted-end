/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  ArrowLeft,
  Send,
  User,
  Globe,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button, Badge, ContactCard as Card } from "../../ui/ContactUis/Uis";
import LoginModal from "../../ui/LoginModalUi/LoginModal";
import ContactSuccessModal from "./ContactSuccessModal";

const ContactShop = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();

  // State management
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This should come from your auth context
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    urgency: "normal",
    contactMethod: "email",
  });

  // Mock shop data - replace with actual API call
  const [shopData, setShopData] = useState({
    id: shopId,
    name: "TechHub Electronics",
    logo: "https://images.unsplash.com/photo-1560472355-109703aa3edc?w=200&h=200&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop",
    rating: 4.8,
    reviews: 2340,
    verified: true,
    location: "New York, NY",
    phone: "+1 (555) 123-4567",
    email: "contact@techhub.com",
    website: "https://techhub.com",
    businessHours: "Mon-Fri 9AM-6PM",
    responseTime: "Usually responds within 2 hours",
    languages: ["English", "Spanish"],
    specialties: ["Electronics", "Mobile Accessories", "Gaming Gear"],
  });

  // Check auth status on component mount
  useEffect(() => {
    // Replace with actual auth check
    const checkAuthStatus = () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };

    checkAuthStatus();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success modal with contact data
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        subject: "",
        message: "",
        urgency: "normal",
        contactMethod: "email",
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle login
  const handleLogin = () => {
    setShowLoginModal(false);
    // Navigate to login page or trigger login modal
    navigate("/login");
  };

  // Generate contact data for success modal
  const contactData = {
    messageId: `MSG${Date.now().toString().slice(-6)}`,
    shopName: shopData.name,
    timestamp: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            </div>

            <div className="text-sm text-gray-600">Contact Shop</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shop Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Shop Card */}
            <Card shadow="lg" className="p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={shopData.logo}
                    alt={shopData.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.target.src = "/placehold.png";
                    }}
                  />
                  {shopData.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {shopData.name}
                </h2>

                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(shopData.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {shopData.rating} ({shopData.reviews} reviews)
                  </span>
                </div>

                {shopData.verified && (
                  <Badge variant="success" size="sm" className="mb-4">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified Shop
                  </Badge>
                )}
              </div>
            </Card>

            {/* Contact Information */}
            <Card shadow="lg" className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                {shopData.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{shopData.location}</span>
                  </div>
                )}
                {shopData.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{shopData.phone}</span>
                  </div>
                )}
                {shopData.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{shopData.email}</span>
                  </div>
                )}
                {shopData.businessHours && (
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">
                      {shopData.businessHours}
                    </span>
                  </div>
                )}
                {shopData.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <a
                      href={shopData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </Card>

            {/* Shop Stats */}
            <Card shadow="lg" className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Shop Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="text-sm font-medium text-green-600">
                    {shopData.responseTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Languages</span>
                  <span className="text-sm font-medium text-gray-900">
                    {shopData.languages.join(", ")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Specialties</span>
                  <div className="flex flex-wrap gap-1">
                    {shopData.specialties
                      .slice(0, 2)
                      .map((specialty, index) => (
                        <Badge key={index} variant="secondary" size="sm">
                          {specialty}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card shadow="lg" className="p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Contact {shopData.name}
                </h1>
                <p className="text-gray-600">
                  Send a message to the shop owner. They typically respond
                  within a few hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="What's your message about?"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Write your message here..."
                  />
                </div>

                {/* Options */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Urgency */}
                  <div>
                    <label
                      htmlFor="urgency"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Urgency Level
                    </label>
                    <select
                      id="urgency"
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="low">Low Priority</option>
                      <option value="normal">Normal</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label
                      htmlFor="contactMethod"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Preferred Contact Method
                    </label>
                    <select
                      id="contactMethod"
                      name="contactMethod"
                      value={formData.contactMethod}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="platform">Platform Message</option>
                    </select>
                  </div>
                </div>

                {/* Login Warning */}
                {!isLoggedIn && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-800">
                        <strong>Login Required:</strong> You need to be logged
                        in to send messages to shops.
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      <ContactSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        contactData={contactData}
      />
    </div>
  );
};

export default ContactShop;
