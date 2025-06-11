/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Search,
  Package,
  RefreshCw,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Camera,
  Shield,
  CreditCard,
  X,
  Sparkles,
  User,
  Mail,
  Building,
  Store,
  ExternalLink,
} from "lucide-react";

import {
  Button,
  Badge,
  Card,
  Input,
  Select,
  Textarea,
  Pagination,
} from "../../components/ui/CommonUis/Ui";

// Success Modal Component
const SuccessModal = ({ isOpen, onClose, returnData }) => {
  if (!isOpen) return null;

  const handleTrackNavigation = () => {
    // Navigate to track returns tab
    onClose();
    // This would typically trigger parent component to switch tabs
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
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
            🎉 Return Request Submitted!
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your return request has been successfully submitted.
            <br />
            We'll process it within 1-2 business days.
          </p>

          {/* Return Details Summary */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-2">
            <div className="flex items-center text-sm">
              <Package className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-gray-600 flex-1">
                Return ID: {returnData?.returnId}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <FileText className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-gray-600 flex-1">
                {returnData?.itemCount} item(s) selected
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-gray-600 flex-1">
                Processing time: 1-2 business days
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleTrackNavigation}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              size="lg"
            >
              <Truck className="w-5 h-5 mr-2" />
              Track Return Status
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
              You'll receive email updates about your return
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReturnAndTrackingItems = () => {
  const [activeTab, setActiveTab] = useState("start");
  const [selectedItems, setSelectedItems] = useState([]);
  const [returnReason, setReturnReason] = useState("");
  const [comments, setComments] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const itemsPerPage = 3;

  // Mock order data with multiple orders
  const mockOrders = [
    {
      orderNumber: "ORD-2024-001",
      date: "2024-05-15",
      total: "$299.97",
      status: "Delivered",
      items: [
        {
          id: 1,
          name: "Wireless Bluetooth Headphones",
          price: "$99.99",
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop&crop=center",
          quantity: 1,
          eligible: true,
          sku: "WBH-001",
        },
        {
          id: 2,
          name: "Smartphone Case - Blue",
          price: "$29.99",
          image:
            "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=80&h=80&fit=crop&crop=center",
          quantity: 2,
          eligible: true,
          sku: "SC-BLU-002",
        },
        {
          id: 3,
          name: "USB-C Charging Cable",
          price: "$19.99",
          image:
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=80&h=80&fit=crop&crop=center",
          quantity: 1,
          eligible: false,
          sku: "USB-C-003",
        },
      ],
    },
    {
      orderNumber: "ORD-2024-002",
      date: "2024-05-12",
      total: "$149.97",
      status: "Delivered",
      items: [
        {
          id: 4,
          name: "Wireless Mouse",
          price: "$45.99",
          image:
            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=80&h=80&fit=crop&crop=center",
          quantity: 1,
          eligible: true,
          sku: "WM-004",
        },
        {
          id: 5,
          name: "Laptop Stand",
          price: "$79.99",
          image:
            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=80&h=80&fit=crop&crop=center",
          quantity: 1,
          eligible: true,
          sku: "LS-005",
        },
      ],
    },
    {
      orderNumber: "ORD-2024-003",
      date: "2024-05-10",
      total: "$199.99",
      status: "Delivered",
      items: [
        {
          id: 6,
          name: "Gaming Keyboard",
          price: "$129.99",
          image:
            "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=80&h=80&fit=crop&crop=center",
          quantity: 1,
          eligible: true,
          sku: "GK-006",
        },
        {
          id: 7,
          name: "Mouse Pad",
          price: "$19.99",
          image:
            "https://images.unsplash.com/photo-1615750185084-9b9694d45e08?w=80&h=80&fit=crop&crop=center",
          quantity: 1,
          eligible: true,
          sku: "MP-007",
        },
      ],
    },
  ];

  // Mock return history
  const mockReturns = [
    {
      id: "RET-2024-001",
      orderNumber: "ORD-2024-002",
      date: "2024-05-10",
      status: "Processing",
      items: ["Gaming Mouse", "Keyboard"],
      refundAmount: "$129.98",
      trackingNumber: "1Z999AA1234567890",
    },
    {
      id: "RET-2024-002",
      orderNumber: "ORD-2024-003",
      date: "2024-05-08",
      status: "Completed",
      items: ["Laptop Stand"],
      refundAmount: "$49.99",
      trackingNumber: "1Z999BB1234567891",
    },
    {
      id: "RET-2024-003",
      orderNumber: "ORD-2024-004",
      date: "2024-05-05",
      status: "Refunded",
      items: ["Wireless Earbuds"],
      refundAmount: "$89.99",
      trackingNumber: "1Z999CC1234567892",
    },
  ];

  const returnReasons = [
    { value: "", label: "Select a reason" },
    { value: "defective", label: "Defective/Damaged item" },
    { value: "wrong_item", label: "Wrong item received" },
    { value: "not_described", label: "Item not as described" },
    { value: "changed_mind", label: "Changed my mind" },
    { value: "better_price", label: "Found better price elsewhere" },
    { value: "quality", label: "Quality issues" },
    { value: "size_fit", label: "Size/fit issues" },
    { value: "other", label: "Other" },
  ];

  // Filter orders based on order number and SKU
  const filteredOrders = mockOrders.filter((order) => {
    if (!orderSearchTerm) return true;

    const searchLower = orderSearchTerm.toLowerCase();

    // Check if order number matches
    const orderMatches = order.orderNumber.toLowerCase().includes(searchLower);

    // Check if any item SKU matches
    const skuMatches = order.items.some((item) =>
      item.sku.toLowerCase().includes(searchLower)
    );

    return orderMatches || skuMatches;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "Completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Refunded":
        return <CreditCard className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "warning";
      case "Completed":
        return "success";
      case "Refunded":
        return "primary";
      default:
        return "secondary";
    }
  };

  const handleItemSelect = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleImageUpload = (files) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    console.log("📁 Files selected:", fileArray.length);

    fileArray.forEach((file, index) => {
      if (file && file.type.startsWith("image/")) {
        console.log(
          "🖼️ Processing file:",
          file.name,
          "Type:",
          file.type,
          "Size:",
          file.size
        );

        const reader = new FileReader();

        reader.onload = (e) => {
          const result = e.target.result;
          console.log(
            "📖 FileReader result for",
            file.name,
            "- Length:",
            result?.length,
            "Starts with:",
            result?.substring(0, 30)
          );

          if (result && result.startsWith("data:image/")) {
            const newImage = {
              id: Date.now() + Math.random() + index,
              file,
              url: result,
              name: file.name,
              size: file.size,
              type: file.type,
            };

            console.log("✅ Creating image object:", newImage.name);
            setUploadedImages((prev) => {
              const updated = [...prev, newImage];
              console.log("📊 Updated images array length:", updated.length);
              return updated;
            });
          } else {
            console.error("❌ Invalid data URL generated for:", file.name);
          }
        };

        reader.onerror = (error) => {
          console.error("❌ FileReader error for", file.name, ":", error);
        };

        reader.onloadstart = () => {
          console.log("⏳ Starting to read:", file.name);
        };

        reader.onloadend = () => {
          console.log("🏁 Finished reading:", file.name);
        };

        reader.readAsDataURL(file);
      } else {
        console.log("❌ Invalid file type or file:", file?.type, file?.name);
      }
    });
  };

  const removeImage = (imageId) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  const handleSubmitReturn = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to return.");
      return;
    }
    if (!returnReason) {
      alert("Please select a reason for return.");
      return;
    }

    // Generate return ID and show success modal
    const returnId = `RET-${Date.now()}`;
    const returnData = {
      returnId,
      itemCount: selectedItems.length,
      orderNumbers: filteredOrders.map((order) => order.orderNumber).join(", "),
    };

    setShowSuccessModal(true);

    // Reset form after submission
    setTimeout(() => {
      setSelectedItems([]);
      setReturnReason("");
      setComments("");
      setUploadedImages([]);
    }, 2000);
  };

  // Filter returns based on search
  const filteredReturns = mockReturns.filter(
    (returnItem) =>
      returnItem.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination for returns
  const totalPages = Math.ceil(filteredReturns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReturns = filteredReturns.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setActiveTab("track");
        }}
        returnData={{
          returnId: `RET-${Date.now()}`,
          itemCount: selectedItems.length,
        }}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Returns & Refunds
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Easy returns and hassle-free refunds within 30 days of purchase.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                className="flex items-center space-x-2"
                onClick={() => setActiveTab("start")}
              >
                <RefreshCw size={20} />
                <span>Start Return</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex items-center space-x-2 border-white/20 text-white hover:bg-white/10"
                onClick={() => setActiveTab("track")}
              >
                <Package size={20} />
                <span>Track Returns</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <Card shadow="xl" hover={false} className="mb-12">
          <Card.Body>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant={activeTab === "start" ? "primary" : "ghost"}
                size="md"
                onClick={() => setActiveTab("start")}
                className="flex items-center space-x-2"
              >
                <RefreshCw size={16} />
                <span>Start Return</span>
              </Button>
              <Button
                variant={activeTab === "track" ? "primary" : "ghost"}
                size="md"
                onClick={() => setActiveTab("track")}
                className="flex items-center space-x-2"
              >
                <Package size={16} />
                <span>Track Returns</span>
              </Button>
              <Button
                variant={activeTab === "policy" ? "primary" : "ghost"}
                size="md"
                onClick={() => setActiveTab("policy")}
                className="flex items-center space-x-2"
              >
                <FileText size={16} />
                <span>Return Policy</span>
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Start Return Tab */}
        {activeTab === "start" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Start a Return
              </h2>
              <p className="text-gray-600">
                Search your orders by order number or SKU and select items to
                return
              </p>
            </div>

            {/* Search Orders */}
            <Card shadow="lg" hover={false}>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Search Your Orders</h3>
                  <Badge variant="primary">
                    {filteredOrders.length} order(s) found
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <Input
                  placeholder="Search by order number (e.g., ORD-2024-001) or SKU (e.g., WBH-001)..."
                  value={orderSearchTerm}
                  onChange={(e) => setOrderSearchTerm(e.target.value)}
                  icon={<Search size={20} />}
                  size="lg"
                />
                {orderSearchTerm && (
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      {filteredOrders.length === 0
                        ? "No orders found matching your search"
                        : `Found ${filteredOrders.length} order(s) matching "${orderSearchTerm}"`}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setOrderSearchTerm("")}
                      className="text-blue-600"
                    >
                      Clear search
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Orders Display */}
            {filteredOrders.length > 0 ? (
              <Card shadow="lg" hover={false}>
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Your Orders</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Select items to return from the orders below
                      </p>
                    </div>
                    <Badge variant="primary">
                      {filteredOrders.length} order(s) available
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="max-h-[600px] overflow-y-auto space-y-6 pr-2 border border-gray-100 rounded-lg p-4">
                    {filteredOrders.map((order) => (
                      <div
                        key={order.orderNumber}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold">
                              Order {order.orderNumber}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Placed on {order.date} • Total: {order.total}
                            </p>
                          </div>
                          <Badge variant="success">{order.status}</Badge>
                        </div>

                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className={`border rounded-lg p-3 transition-all ${
                                selectedItems.includes(item.id)
                                  ? "border-blue-300 bg-blue-50 shadow-sm"
                                  : "border-gray-200 hover:border-gray-300"
                              } ${!item.eligible ? "opacity-50" : ""}`}
                            >
                              <div className="flex items-center space-x-3">
                                {item.eligible && (
                                  <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => handleItemSelect(item.id)}
                                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                                  />
                                )}
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-md border border-gray-200"
                                />
                                <div className="flex-1">
                                  <h5 className="font-medium text-sm">
                                    {item.name}
                                  </h5>
                                  <p className="text-xs text-gray-600">
                                    SKU: {item.sku} • Qty: {item.quantity}
                                  </p>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {item.price}
                                  </p>
                                </div>
                                {!item.eligible && (
                                  <Badge variant="secondary" size="sm">
                                    Not Eligible
                                  </Badge>
                                )}
                                {selectedItems.includes(item.id) && (
                                  <Badge variant="primary" size="sm">
                                    Selected
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedItems.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-blue-900">
                            {selectedItems.length} item(s) selected for return
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedItems([]);
                            setUploadedImages([]);
                          }}
                          className="text-blue-600 border-blue-300 hover:bg-blue-100"
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ) : orderSearchTerm ? (
              <Card shadow="lg" hover={false} className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <Search size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No orders found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    No orders match your search for "{orderSearchTerm}". Try
                    searching with a different order number or SKU.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setOrderSearchTerm("")}
                  >
                    Clear search
                  </Button>
                </div>
              </Card>
            ) : (
              <Card shadow="lg" hover={false} className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <Package size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Search for your orders
                  </h3>
                  <p className="text-gray-600">
                    Enter an order number or SKU above to find your orders and
                    start a return.
                  </p>
                </div>
              </Card>
            )}

            {/* Return Form */}
            {selectedItems.length > 0 && (
              <Card shadow="lg" hover={false}>
                <Card.Header>
                  <h3 className="text-lg font-semibold">Return Details</h3>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-6">
                    <Select
                      label="Reason for Return"
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      options={returnReasons}
                      required
                    />

                    <Textarea
                      label="Additional Comments (Optional)"
                      placeholder="Please provide any additional details about your return..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={4}
                    />

                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Camera size={16} className="text-blue-600" />
                          <h4 className="font-medium text-blue-900">
                            Photo Documentation
                          </h4>
                        </div>
                        <p className="text-sm text-blue-700 mb-4">
                          For defective or damaged items, please upload photos
                          to help us process your return faster.
                        </p>

                        {/* File Upload Area */}
                        <div
                          className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                        >
                          <Camera
                            size={32}
                            className="text-blue-400 mx-auto mb-3"
                          />
                          <p className="text-sm text-blue-600 mb-3">
                            Drag and drop images here, or click below to browse
                          </p>

                          {/* Upload Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="mb-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                            onClick={() => {
                              const input =
                                document.getElementById("file-upload");
                              if (input) {
                                input.click();
                              }
                            }}
                          >
                            <Camera size={16} className="mr-2" />
                            Choose Files
                          </Button>

                          <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                              console.log(
                                "File input changed:",
                                e.target.files?.length
                              );
                              if (e.target.files && e.target.files.length > 0) {
                                handleImageUpload(e.target.files);
                              }
                              // Reset input value to allow same file selection
                              e.target.value = "";
                            }}
                            style={{ display: "none" }}
                          />

                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB each
                          </p>
                        </div>

                        {/* Image Previews */}
                        {uploadedImages.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-3">
                              Uploaded Images ({uploadedImages.length})
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                              {uploadedImages.map((image, index) => (
                                <div
                                  key={image.id}
                                  className="relative group bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 w-full h-32"
                                >
                                  {/* Debug info for each image */}
                                  <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded z-10">
                                    {index + 1}
                                  </div>

                                  <img
                                    src={image.url}
                                    alt={image.name}
                                    className="w-full h-full object-contain bg-white"
                                    style={{
                                      display: "block",
                                      maxWidth: "100%",
                                      maxHeight: "100%",
                                    }}
                                    onLoad={(e) => {
                                      console.log(
                                        "✅ Image displayed successfully:",
                                        image.name
                                      );
                                      console.log(
                                        "📏 Image dimensions:",
                                        e.target.naturalWidth,
                                        "x",
                                        e.target.naturalHeight
                                      );
                                    }}
                                    onError={(e) => {
                                      console.error(
                                        "❌ Image failed to load:",
                                        image.name
                                      );
                                      console.log(
                                        "🔍 Checking image URL...",
                                        image.url?.substring(0, 100)
                                      );
                                    }}
                                  />

                                  {/* Hover overlay */}
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                                    <button
                                      onClick={() => {
                                        console.log(
                                          "Removing image:",
                                          image.name
                                        );
                                        removeImage(image.id);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                                      title="Remove image"
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>

                                  {/* File info */}
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                    <p className="text-white text-xs truncate">
                                      {image.name}
                                    </p>
                                    <p className="text-white text-xs opacity-75">
                                      {(image.size / 1024).toFixed(1)}KB
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleSubmitReturn}
                      >
                        Submit Return Request
                      </Button>
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => {
                          setSelectedItems([]);
                          setUploadedImages([]);
                        }}
                      >
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}
          </div>
        )}

        {/* Track Returns Tab */}
        {activeTab === "track" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Track Your Returns
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredReturns.length} return
                  {filteredReturns.length !== 1 ? "s" : ""} found
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </div>
            </div>

            {/* Search */}
            <Card shadow="lg" hover={false}>
              <Card.Body>
                <Input
                  placeholder="Search by order number or return ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search size={20} />}
                  size="lg"
                />
              </Card.Body>
            </Card>

            {/* Returns List */}
            {filteredReturns.length > 0 ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  {paginatedReturns.map((returnItem) => (
                    <Card key={returnItem.id} shadow="lg" hover={true}>
                      <Card.Body>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">
                              Return #{returnItem.id}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Order: {returnItem.orderNumber} • Submitted:{" "}
                              {returnItem.date}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(returnItem.status)}
                            <Badge variant={getStatusColor(returnItem.status)}>
                              {returnItem.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">
                              Items
                            </h4>
                            <p className="text-sm text-gray-600">
                              {returnItem.items.join(", ")}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">
                              Refund Amount
                            </h4>
                            <p className="text-sm font-semibold text-green-600">
                              {returnItem.refundAmount}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">
                              Tracking Number
                            </h4>
                            <p className="text-sm text-blue-600 font-mono">
                              {returnItem.trackingNumber}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Truck size={16} className="mr-1" />
                              Track Package
                            </Button>
                            <Button variant="ghost" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {filteredReturns.length > itemsPerPage && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredReturns.length}
                    className="mt-8 pt-8 border-t border-gray-200"
                  />
                )}
              </div>
            ) : (
              <Card shadow="lg" hover={false} className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <Package size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No returns found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You haven't submitted any return requests yet.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setActiveTab("start")}
                  >
                    Start a Return
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Return Policy Tab */}
        {activeTab === "policy" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Return Policy
              </h2>
              <p className="text-gray-600">
                Everything you need to know about our return process
              </p>
            </div>

            <div className="grid gap-6">
              <Card shadow="lg" hover={false}>
                <Card.Header>
                  <div className="flex items-center space-x-2">
                    <Clock size={20} className="text-blue-600" />
                    <h3 className="text-lg font-semibold">Return Window</h3>
                  </div>
                </Card.Header>
                <Card.Body>
                  <p className="text-gray-600 leading-relaxed">
                    You have <strong>30 days</strong> from the delivery date to
                    return most items. Items must be in their original condition
                    with tags attached. Some restrictions apply to personalized
                    items, perishables, and intimate apparel.
                  </p>
                </Card.Body>
              </Card>

              <Card shadow="lg" hover={false}>
                <Card.Header>
                  <div className="flex items-center space-x-2">
                    <CreditCard size={20} className="text-green-600" />
                    <h3 className="text-lg font-semibold">Refund Process</h3>
                  </div>
                </Card.Header>
                <Card.Body>
                  <p className="text-gray-600 leading-relaxed">
                    Refunds are processed within{" "}
                    <strong>5-7 business days</strong>
                    after we receive your returned items. The refund will be
                    issued to your original payment method. For faster
                    processing, use our prepaid return labels.
                  </p>
                </Card.Body>
              </Card>

              <Card shadow="lg" hover={false}>
                <Card.Header>
                  <div className="flex items-center space-x-2">
                    <Truck size={20} className="text-purple-600" />
                    <h3 className="text-lg font-semibold">Return Shipping</h3>
                  </div>
                </Card.Header>
                <Card.Body>
                  <p className="text-gray-600 leading-relaxed">
                    Return shipping is <strong>free for defective items</strong>
                    . For other returns, a $5.99 return shipping fee applies.
                    Use our prepaid return labels for convenience, or ship with
                    your preferred carrier.
                  </p>
                </Card.Body>
              </Card>

              <Card shadow="lg" hover={false}>
                <Card.Header>
                  <div className="flex items-center space-x-2">
                    <Shield size={20} className="text-indigo-600" />
                    <h3 className="text-lg font-semibold">
                      Non-Returnable Items
                    </h3>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="text-gray-600 leading-relaxed">
                    <p className="mb-3">
                      The following items cannot be returned:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Personalized or custom items</li>
                      <li>Perishable goods and food items</li>
                      <li>Digital downloads and gift cards</li>
                      <li>Intimate apparel and swimwear</li>
                      <li>Items marked as "Final Sale"</li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </div>

            {/* Contact Section */}
            <Card
              shadow="xl"
              className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100"
              hover={false}
            >
              <Card.Header>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Need Help?
                  </h3>
                  <Badge variant="primary" icon={<Clock size={12} />}>
                    Customer Support Available
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="text-center">
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Our support team is here to help with any questions about
                    returns, refunds, or exchanges.
                  </p>
                  <Button variant="primary" size="lg">
                    Contact Support
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnAndTrackingItems;
