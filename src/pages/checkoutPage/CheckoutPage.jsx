import { useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Shield,
  Truck,
  Clock,
  MapPin,
  Plus,
  Edit3,
  Check,
  User,
  Phone,
  Mail,
  Package,
  Zap,
  Calendar,
  Info,
  Lock,
  Star,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddressModal from "./AddressModal";
import ShippingOptions from "./ShippingOptions";
import OrderSummary from "./OrderSummary";
import SuccessModal from "./SuccessModal";
import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [cartItems] = useState([
    {
      id: 1,
      name: "Wireless Bluetooth Headphones Pro Max",
      brand: "TechAudio",
      price: 179.99,
      originalPrice: 249.99,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      inStock: true,
      shippingFree: true,
    },
    {
      id: 2,
      name: "Premium Leather Handbag",
      brand: "LuxeFashion",
      price: 299.99,
      originalPrice: 399.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
      inStock: true,
      shippingFree: true,
    },
  ]);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "home",
      firstName: "John",
      lastName: "Doe",
      company: "",
      address: "123 Main Street",
      apartment: "Apt 2B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
      isDefault: true,
    },
    {
      id: 2,
      type: "work",
      firstName: "John",
      lastName: "Doe",
      company: "Tech Corp",
      address: "456 Business Ave",
      apartment: "Suite 100",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      country: "United States",
      phone: "+1 (555) 987-6543",
      isDefault: false,
    },
  ]);

  const [selectedAddress, setSelectedAddress] = useState(
    addresses.find((addr) => addr.isDefault) || addresses[0]
  );

  const steps = [
    { id: 1, name: "Shipping", completed: currentStep > 1 },
    { id: 2, name: "Review", completed: false },
  ];

  const handleAddressEdit = (address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleAddressAdd = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const handleAddressSave = (addressData) => {
    if (addressData.id) {
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === addressData.id ? addressData : addr))
      );
    } else {
      const newAddress = { ...addressData, id: Date.now() };
      setAddresses((prev) => [...prev, newAddress]);
    }
    setShowAddressModal(false);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newOrderData = {
        orderId: "ORD-" + Date.now(),
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        total: total,
        estimatedDelivery:
          selectedShipping === "overnight"
            ? "1 business day"
            : selectedShipping === "express"
            ? "2-3 business days"
            : "5-7 business days",
        shippingAddress: selectedAddress,
        items: cartItems,
      };
      setOrderData(newOrderData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping =
    selectedShipping === "standard"
      ? 0
      : selectedShipping === "express"
      ? 15.99
      : 25.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

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
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2" />
                  Checkout
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Step {currentStep} of 2
                </p>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  LKR {total.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step.completed
                      ? "bg-green-600 border-green-600 text-white"
                      : currentStep === step.id
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  {step.completed ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    step.completed || currentStep === step.id
                      ? "text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      step.completed ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Shipping Address */}
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                      Shipping Address
                    </h2>
                    <Button
                      onClick={handleAddressAdd}
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add New
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer ${
                          selectedAddress?.id === address.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleAddressSelect(address)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge
                                variant={
                                  address.type === "home"
                                    ? "success"
                                    : "primary"
                                }
                                size="sm"
                              >
                                {address.type === "home" ? "Home" : "Work"}
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
                            {address.company && (
                              <p className="text-sm text-gray-600">
                                {address.company}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              {address.address}
                              {address.apartment && `, ${address.apartment}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.phone}
                            </p>
                          </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddressEdit(address);
                            }}
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Shipping Options */}
                <ShippingOptions
                  selectedShipping={selectedShipping}
                  onShippingChange={setSelectedShipping}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <Card>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Package className="h-5 w-5 text-blue-600 mr-2" />
                    Order Review
                  </h2>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">{item.brand}</p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            LKR {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="font-bold text-gray-900 mb-4">
                    Shipping Address
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold text-gray-900">
                      {selectedAddress.firstName} {selectedAddress.lastName}
                    </p>
                    <p>{selectedAddress.address}</p>
                    <p>
                      {selectedAddress.city}, {selectedAddress.state}{" "}
                      {selectedAddress.zipCode}
                    </p>
                    <p>{selectedAddress.phone}</p>
                  </div>
                </Card>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                onClick={handlePreviousStep}
                variant="outline"
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < 2 ? (
                <Button
                  onClick={handleNextStep}
                  className="flex items-center"
                  disabled={currentStep === 1 && !selectedAddress}
                >
                  Next
                  <ChevronDown className="h-4 w-4 ml-2 rotate-[-90deg]" />
                </Button>
              ) : (
                <Button
                  onClick={handlePlaceOrder}
                  className="flex items-center bg-green-600 hover:bg-green-700"
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              selectedShipping={selectedShipping}
            />
          </div>
        </div>
      </div>

      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSave={handleAddressSave}
        editingAddress={editingAddress}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        orderData={orderData}
        type="order"
      />
    </div>
  );
};

export default CheckoutPage;
