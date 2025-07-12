/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Copy,
  Download,
  Share2,
  ArrowLeft,
  Search,
  AlertCircle,
  Info,
  Star,
  Navigation,
  Home,
  Building,
  Plane,
  Box,
  Shield,
  FileText,
  Smartphone,
  Bell,
  MessageSquare,
  Heart,
  RefreshCw,
  Eye,
  Timer,
  Target,
  Award,
  Globe,
  Zap,
  ExternalLink,
} from "lucide-react";

import {
  Button,
  Badge,
  ContactCard as Card,
  Input,
} from "../../components/ui/ContactUis/Uis";

const TrackParcel = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState("");
  const [autoTracked, setAutoTracked] = useState(false);

  // Sample tracking data
  const sampleTrackingData = {
    trackingNumber: "EM1234567890",
    status: "In Transit",
    statusType: "in-transit",
    estimatedDelivery: "2024-06-15",
    currentLocation: "Los Angeles, CA Distribution Center",
    carrier: "FedEx Express",
    service: "Express Shipping",
    weight: "2.5 lbs",
    dimensions: '12" x 8" x 4"',
    recipient: {
      name: "John Smith",
      address: "123 Main Street, Apt 4B",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
    },
    sender: {
      name: "Emmover Fulfillment Center",
      address: "456 Warehouse Blvd",
      city: "Las Vegas",
      state: "NV",
    },
    timeline: [
      {
        status: "Order Placed",
        description: "Your order has been placed and is being prepared",
        location: "Emmover.com",
        date: "2024-06-10",
        time: "2:30 PM",
        completed: true,
        icon: Package,
      },
      {
        status: "Processing",
        description:
          "Order is being picked and packed at our fulfillment center",
        location: "Las Vegas, NV Fulfillment Center",
        date: "2024-06-11",
        time: "8:15 AM",
        completed: true,
        icon: Box,
      },
      {
        status: "Shipped",
        description: "Package has been picked up by carrier and is on its way",
        location: "Las Vegas, NV",
        date: "2024-06-11",
        time: "4:45 PM",
        completed: true,
        icon: Truck,
      },
      {
        status: "In Transit",
        description: "Package is currently in transit to destination",
        location: "Los Angeles, CA Distribution Center",
        date: "2024-06-12",
        time: "11:20 AM",
        completed: true,
        icon: Navigation,
        current: true,
      },
      {
        status: "Out for Delivery",
        description: "Package is out for delivery and will arrive today",
        location: "San Francisco, CA",
        date: "2024-06-15",
        time: "Expected",
        completed: false,
        icon: Truck,
      },
      {
        status: "Delivered",
        description: "Package has been successfully delivered",
        location: "123 Main Street, San Francisco, CA",
        date: "2024-06-15",
        time: "Expected by 6:00 PM",
        completed: false,
        icon: CheckCircle,
      },
    ],
  };

  // Get tracking number from URL params if available and auto-track
  useEffect(() => {
    const numberFromUrl = searchParams.get("number");
    if (numberFromUrl && !autoTracked) {
      setTrackingNumber(numberFromUrl);
      setAutoTracked(true);
      handleTrackPackage(numberFromUrl);
    }
  }, [searchParams, autoTracked]);

  const handleTrackPackage = async (number = trackingNumber) => {
    if (!number.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    setIsLoading(true);
    setError("");

    // Update URL with tracking number if not already there
    if (searchParams.get("number") !== number) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("number", number);
      setSearchParams(newSearchParams, { replace: true });
    }

    // Simulate API call
    setTimeout(() => {
      // For demo purposes, show data for any tracking number
      // In real app, this would be an actual API call
      if (number.length >= 8) {
        setTrackingData({
          ...sampleTrackingData,
          trackingNumber: number,
        });
      } else {
        setError("Invalid tracking number. Please check and try again.");
        setTrackingData(null);
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(
      trackingData?.trackingNumber || trackingNumber
    );
    // You could add a toast notification here
  };

  const handleBackToShipping = () => {
    navigate("/shipping-info");
  };

  const handleBackToOrders = () => {
    navigate("/orders");
  };

  const handleShareTracking = () => {
    const currentUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: "Track Package",
        text: `Track package ${trackingData?.trackingNumber || trackingNumber}`,
        url: currentUrl,
      });
    } else {
      navigator.clipboard.writeText(currentUrl);
      // You could add a toast notification here
    }
  };

  const getStatusColor = (statusType) => {
    switch (statusType) {
      case "delivered":
        return "success";
      case "in-transit":
        return "primary";
      case "processing":
        return "warning";
      case "exception":
        return "danger";
      default:
        return "info";
    }
  };

  const getStatusIcon = (statusType) => {
    switch (statusType) {
      case "delivered":
        return CheckCircle;
      case "in-transit":
        return Truck;
      case "processing":
        return Clock;
      case "exception":
        return AlertCircle;
      default:
        return Package;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBackToOrders}
                className="flex items-center space-x-2"
              >
                <ArrowLeft size={16} />
                <span>Back to Orders</span>
              </Button>

              {/* Breadcrumb */}
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <span>Orders</span>
                <span>•</span>
                <span className="text-gray-900">Track Package</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {trackingData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareTracking}
                >
                  <Share2 size={16} className="mr-2" />
                  Share
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Bell size={16} className="mr-2" />
                Get Updates
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Badge
              variant="primary"
              size="lg"
              className="mb-6"
              icon={<Package size={16} />}
            >
              Package Tracking
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Track Your
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Package
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Get real-time updates on your package location and delivery
              status. Enter your tracking number below for detailed information.
            </p>

            {/* Tracking Input */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Enter tracking number (e.g., EM1234567890)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleTrackPackage()}
                  icon={<Search size={20} />}
                  size="lg"
                  className="bg-white/90 backdrop-blur-sm border-white/20 text-gray-800 flex-grow"
                />
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => handleTrackPackage()}
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  {isLoading ? (
                    <RefreshCw size={20} className="animate-spin" />
                  ) : (
                    <Search size={20} />
                  )}
                  <span>{isLoading ? "Tracking..." : "Track Package"}</span>
                </Button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center text-red-700">
                  <AlertCircle size={16} className="mr-2" />
                  <span>{error}</span>
                </div>
              )}

              {/* Auto-tracked notification */}
              {autoTracked && trackingData && (
                <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg flex items-center text-green-700">
                  <CheckCircle size={16} className="mr-2" />
                  <span>
                    Package tracking loaded automatically from your order
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {trackingData ? (
          <div className="space-y-8">
            {/* Package Status Overview */}
            <Card shadow="xl" hover={false}>
              <Card.Body className="p-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Current Status */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-4 mb-6">
                      <div
                        className={`p-4 bg-${getStatusColor(
                          trackingData.statusType
                        )}-100 rounded-full`}
                      >
                        {React.createElement(
                          getStatusIcon(trackingData.statusType),
                          {
                            size: 32,
                            className: `text-${getStatusColor(
                              trackingData.statusType
                            )}-600`,
                          }
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {trackingData.status}
                        </h2>
                        <p className="text-gray-600">
                          {trackingData.currentLocation}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Tracking Details
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Tracking Number:
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-gray-900">
                                {trackingData.trackingNumber}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopyTracking}
                                title="Copy tracking number"
                              >
                                <Copy size={14} />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Carrier:</span>
                            <span className="text-gray-900">
                              {trackingData.carrier}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Service:</span>
                            <span className="text-gray-900">
                              {trackingData.service}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Weight:</span>
                            <span className="text-gray-900">
                              {trackingData.weight}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Delivery Information
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Estimated Delivery:
                            </span>
                            <Badge variant="primary" size="sm">
                              {new Date(
                                trackingData.estimatedDelivery
                              ).toLocaleDateString()}
                            </Badge>
                          </div>
                          <div className="flex items-start justify-between">
                            <span className="text-gray-600">Deliver To:</span>
                            <div className="text-right text-gray-900">
                              <div>{trackingData.recipient.name}</div>
                              <div className="text-xs text-gray-500">
                                {trackingData.recipient.address}
                                <br />
                                {trackingData.recipient.city},{" "}
                                {trackingData.recipient.state}{" "}
                                {trackingData.recipient.zip}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Bell size={16} className="mr-2" />
                        Set Delivery Alerts
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Calendar size={16} className="mr-2" />
                        Reschedule Delivery
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <MapPin size={16} className="mr-2" />
                        Change Address
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <MessageSquare size={16} className="mr-2" />
                        Contact Support
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Download size={16} className="mr-2" />
                        Download Receipt
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={handleBackToOrders}
                      >
                        <Package size={16} className="mr-2" />
                        View All Orders
                      </Button>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Tracking Timeline */}
            <Card shadow="xl" hover={false}>
              <Card.Header>
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Navigation className="mr-3 text-blue-500" size={24} />
                  Package Journey
                </h3>
              </Card.Header>
              <Card.Body className="p-8">
                <div className="relative">
                  {trackingData.timeline.map((event, index) => {
                    const EventIcon = event.icon;
                    const isLast = index === trackingData.timeline.length - 1;

                    return (
                      <div
                        key={index}
                        className="flex items-start space-x-4 pb-8 relative"
                      >
                        {/* Timeline Line */}
                        {!isLast && (
                          <div
                            className={`absolute left-6 top-12 w-0.5 h-16 ${
                              event.completed ? "bg-green-500" : "bg-gray-300"
                            }`}
                          ></div>
                        )}

                        {/* Icon */}
                        <div
                          className={`p-3 rounded-full border-2 ${
                            event.completed
                              ? event.current
                                ? "bg-blue-100 border-blue-500 ring-4 ring-blue-200"
                                : "bg-green-100 border-green-500"
                              : "bg-gray-100 border-gray-300"
                          } z-10 relative`}
                        >
                          <EventIcon
                            size={20}
                            className={
                              event.completed
                                ? event.current
                                  ? "text-blue-600"
                                  : "text-green-600"
                                : "text-gray-400"
                            }
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-1">
                            <h4
                              className={`font-semibold ${
                                event.completed
                                  ? "text-gray-900"
                                  : "text-gray-500"
                              }`}
                            >
                              {event.status}
                              {event.current && (
                                <Badge
                                  variant="primary"
                                  size="sm"
                                  className="ml-2"
                                >
                                  Current
                                </Badge>
                              )}
                            </h4>
                            <div className="text-sm text-gray-500">
                              {event.date} {event.time}
                            </div>
                          </div>
                          <p
                            className={`text-sm ${
                              event.completed
                                ? "text-gray-600"
                                : "text-gray-400"
                            } mb-1`}
                          >
                            {event.description}
                          </p>
                          <p
                            className={`text-xs ${
                              event.completed
                                ? "text-gray-500"
                                : "text-gray-400"
                            }`}
                          >
                            {event.location}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>

            {/* Additional Information */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Delivery Instructions */}
              <Card shadow="lg" hover={false}>
                <Card.Header>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Info className="mr-2 text-blue-500" size={20} />
                    Delivery Instructions
                  </h3>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        Delivery Notes
                      </h4>
                      <p className="text-blue-800 text-sm">
                        Package will be delivered to your doorstep. Signature
                        may be required for this shipment. If you're not
                        available, the package will be left in a safe location.
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Shield size={16} className="mr-2 text-green-500" />
                        <span>Package insurance included</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Bell size={16} className="mr-2 text-blue-500" />
                        <span>SMS notifications enabled</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-2 text-purple-500" />
                        <span>Delivery window: 9 AM - 6 PM</span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Contact Information */}
              <Card shadow="lg" hover={false}>
                <Card.Header>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <MessageSquare className="mr-2 text-green-500" size={20} />
                    Need Help?
                  </h3>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm">
                      Have questions about your delivery? Our support team is
                      here to help.
                    </p>

                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Phone size={16} className="mr-2" />
                        Call: (555) 123-4567
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Mail size={16} className="mr-2" />
                        Email: support@emmover.com
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <MessageSquare size={16} className="mr-2" />
                        Live Chat Support
                      </Button>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <Badge
                        variant="success"
                        size="sm"
                        icon={<Clock size={12} />}
                      >
                        24/7 Support Available
                      </Badge>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        ) : (
          !isLoading &&
          !error && (
            /* No Tracking Data - Getting Started */
            <div className="text-center py-16">
              <Card shadow="xl" hover={false} className="max-w-2xl mx-auto">
                <Card.Body className="p-12">
                  <Package size={64} className="text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Track Your Package
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Enter your tracking number above to get real-time updates on
                    your package location and delivery status.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                        <Search size={24} className="text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Enter Number
                      </h4>
                      <p className="text-sm text-gray-600">
                        Input your tracking number in the search box
                      </p>
                    </div>
                    <div>
                      <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                        <Eye size={24} className="text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        View Status
                      </h4>
                      <p className="text-sm text-gray-600">
                        See real-time location and delivery updates
                      </p>
                    </div>
                    <div>
                      <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                        <CheckCircle size={24} className="text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Get Delivered
                      </h4>
                      <p className="text-sm text-gray-600">
                        Receive your package on time
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        variant="outline"
                        onClick={handleBackToOrders}
                        className="flex items-center space-x-2"
                      >
                        <Package size={16} />
                        <span>View My Orders</span>
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => navigate("/product-collections")}
                        className="flex items-center space-x-2"
                      >
                        <ExternalLink size={16} />
                        <span>Continue Shopping</span>
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )
        )}

        {isLoading && (
          /* Loading State */
          <div className="text-center py-16">
            <Card shadow="xl" hover={false} className="max-w-md mx-auto">
              <Card.Body className="p-12">
                <RefreshCw
                  size={48}
                  className="text-blue-500 mx-auto mb-6 animate-spin"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Tracking Your Package
                </h3>
                <p className="text-gray-600 mb-4">
                  Please wait while we fetch the latest information...
                </p>
                {trackingNumber && (
                  <Badge variant="primary" className="font-mono">
                    {trackingNumber}
                  </Badge>
                )}
              </Card.Body>
            </Card>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <Card
        shadow="xl"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100"
        hover={false}
      >
        <Card.Body className="py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart size={32} className="text-red-500" />
              <h3 className="text-3xl font-bold text-gray-900">
                Love Your Shopping Experience?
              </h3>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Share your feedback and help us improve our delivery service. Your
              satisfaction is our top priority.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/product-collections")}
                className="flex items-center space-x-2"
              >
                <Package size={20} />
                <span>Shop More</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/leave-review")}
                className="flex items-center space-x-2"
              >
                <Star size={20} />
                <span>Leave Review</span>
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <Badge variant="primary" size="lg" icon={<Award size={16} />}>
                99.2% On-Time Delivery Rate
              </Badge>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TrackParcel;
