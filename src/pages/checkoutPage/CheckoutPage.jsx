/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
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
  Loader,
} from "lucide-react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import AddressModal from "./AddressModal";
import ShippingOptions from "./ShippingOptions";
import OrderSummary from "./OrderSummary";
import SuccessModal from "./SuccessModal";
import ToastNotification, {
  useToast,
} from "../../components/ui/ToastNotification";
import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";
import useUser from "../../hooks/useUser";
import { selectUser as selectAuthUser } from "../../store/slices/authSlice";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const authUser = useSelector(selectAuthUser);
  const { toastRef, showToast } = useToast();

  // Redux hooks
  const {
    addresses,
    addressesLoading,
    addressesError,
    cartItems,
    cartLoading,
    cartError,
    fetchAddresses,
    addAddress,
    editAddress,
    removeAddress,
    fetchCartItems,
    createOrder,
    removeCartItem,
    clearErrors,
    getCheckoutItems,
    validateCartForCheckout,
    prepareOrderPayload,
    cartMetadata,
    getOrderDataForItems,
  } = useUser();

  const [currentStep, setCurrentStep] = useState(1);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState(null);

  // Get checkout items (from cart or specific product)
  const [checkoutItems, setCheckoutItems] = useState([]);

  const steps = [
    { id: 1, name: "Shipping", completed: currentStep > 1 },
    { id: 2, name: "Review", completed: false },
  ];

  // Initialize data on component mount
  useEffect(() => {
    if (!authUser?._id) {
      showToast.error("Please log in to proceed with checkout!");
      return;
    }

    // Fetch addresses and cart items
    fetchAddresses(authUser._id);
    fetchCartItems(authUser._id, 1, 100);

    // Clear any previous errors
    clearErrors();
  }, [authUser, fetchAddresses, fetchCartItems, clearErrors, navigate]);

  // Set default address when addresses are loaded
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr =
        addresses.find((addr) => addr.isDefault) || addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [addresses, selectedAddress]);

  // Handle checkout items with  data
  useEffect(() => {
    const productId = searchParams.get("product");
    const quantity = parseInt(searchParams.get("quantity")) || 1;

    // Check if we have selected items from cart
    if (location.state?.selectedItems && location.state?.fromCart) {
      console.log(
        "Using selected items from cart:",
        location.state.selectedItems
      );
      setCheckoutItems(location.state.selectedItems);
    } else if (location.state?.selectedItemIds && location.state?.fromCart) {
      // Use  checkout items getter
      const selectedItems = getCheckoutItems(location.state.selectedItemIds);
      console.log("Using selected items by IDs:", selectedItems);
      setCheckoutItems(selectedItems);
    } else if (productId) {
      // Single product checkout
      const productInCart = cartItems.find(
        (item) =>
          item.listingId === productId || item.listing?._id === productId
      );
      if (productInCart) {
        setCheckoutItems([{ ...productInCart, quantity }]);
      }
    } else {
      // Fallback to all cart items if no state passed
      console.log("Using all cart items as fallback");
      const allCheckoutItems = getCheckoutItems();
      setCheckoutItems(allCheckoutItems);
    }
  }, [searchParams, cartItems, location.state, getCheckoutItems]);

  const handleAddressEdit = (address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleAddressAdd = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const handleAddressSave = async (addressData) => {
    try {
      if (addressData._id) {
        await editAddress(addressData._id, addressData);
        showToast.success("Address updated successfully");
      } else {
        await addAddress(addressData);
        showToast.success("Address added successfully");
      }
      setShowAddressModal(false);
    } catch (error) {
      console.error("Error saving address:", error);
      showToast.error("Failed to save address. Please try again.");
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedAddress) {
        showToast.error("Please select a shipping address");
        return;
      }
    }

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Prepare shipping address string from address object
  const prepareShippingAddress = (address) => {
    if (!address) return null;

    // Construct a formatted address string in specific order
    const addressParts = [];

    // 1. Full name
    const fullName = `${address.firstName || ""} ${
      address.lastName || ""
    }`.trim();
    if (fullName) addressParts.push(fullName);

    // 2. Apartment (if exists)
    if (address.apartment && address.apartment.trim()) {
      addressParts.push(address.apartment.trim());
    }

    // 3. Street address
    if (address.streetAddress && address.streetAddress.trim()) {
      addressParts.push(address.streetAddress.trim());
    }

    // 4. City
    if (address.city && address.city.trim()) {
      addressParts.push(address.city.trim());
    }

    // 5. State
    if (address.state && address.state.trim()) {
      addressParts.push(address.state.trim());
    }

    // 6. Zip code
    if (address.zipCode && address.zipCode.trim()) {
      addressParts.push(address.zipCode.trim());
    }

    return addressParts.join(", ");
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showToast.error("Please select a shipping address");
      return;
    }

    if (checkoutItems.length === 0) {
      showToast.error("No items to checkout");
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Use new order preparation function
      const selectedItemIds = checkoutItems.map((item) => item._id);

      // Validate checkout items first
      const validation = validateCartForCheckout?.(selectedItemIds) || {
        isValid: true,
        errors: [],
        summary: { validItems: checkoutItems.length },
      };

      if (!validation.isValid) {
        showToast.error(
          `Checkout validation failed: ${validation.errors.join(", ")}`
        );
        setIsPlacingOrder(false);
        return;
      }

      // Get order data for selected items
      const orderDataFromCart = getOrderDataForItems?.(selectedItemIds) || {
        listingIds: checkoutItems
          .map((item) => item.listingId || item.listing?._id)
          .filter(Boolean),
        storeIds: [
          ...new Set(checkoutItems.map((item) => item.storeId).filter(Boolean)),
        ],
        sellerIds: [
          ...new Set(
            checkoutItems.map((item) => item.sellerId).filter(Boolean)
          ),
        ],
        itemCount: checkoutItems.length,
      };

      // Prepare order payload with shipping address object
      const orderPayload = {
        buyerId: authUser._id,
        listingIds: orderDataFromCart.listingIds,
        storeIds: orderDataFromCart.storeIds,
        sellerIds: orderDataFromCart.sellerIds,
        shippingAddress: prepareShippingAddress(selectedAddress), 
        shippingOption: selectedShipping,
        totalAmount: total,
      };

      console.log("Placing order with enhanced payload:", orderPayload);
      console.log("Order metadata:", {
        itemCount: orderDataFromCart.itemCount,
        storeCount: orderDataFromCart.storeIds.length,
        sellerCount: orderDataFromCart.sellerIds.length,
        validation: validation.summary,
        shippingAddress: prepareShippingAddress(selectedAddress),
      });

      const response = await createOrder(orderPayload);
      console.log("Order response:", response);

      // Remove items from cart individually (for selected items)
      if (location.state?.fromCart) {
        try {
          // Remove only the items that were checked out
          const removePromises = checkoutItems.map((item) =>
            removeCartItem(item._id)
          );
          await Promise.all(removePromises);
          console.log("Selected items removed from cart");
        } catch (error) {
          console.error("Error removing items from cart:", error);
          // Don't fail the order if cart cleanup fails
        }
      }

      // Prepare success modal data properly
      const successOrderData = {
        orderId:
          response.payload?.order?._id ||
          response.payload?._id ||
          "ORD-" + Date.now(),
        itemCount: checkoutItems.reduce((sum, item) => sum + item.quantity, 0),
        total: total,
        estimatedDelivery:
          selectedShipping === "overnight"
            ? "1 business day"
            : selectedShipping === "express"
            ? "2-3 business days"
            : "5-7 business days",
        shippingAddress: selectedAddress,
        items: checkoutItems,
        storeCount: orderDataFromCart.storeIds.length,
        sellerCount: orderDataFromCart.sellerIds.length,
      };

      console.log("Setting order data for success modal:", successOrderData);
      setOrderData(successOrderData);
      setShowSuccessModal(true);
      showToast.success("Order placed successfully!");

      // Clear checkout items to prevent "No items" message
      setCheckoutItems([]);
    } catch (error) {
      console.error("Error placing order:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to place order";
      showToast.error(errorMessage);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setOrderData(null);
    // Navigate back to home or orders page
    navigate("/orders");
  };

  // Calculate totals using enhanced cart data
  const subtotal = checkoutItems.reduce((sum, item) => {
    const price = parseFloat(
      item.price || item.listing?.variations?.[0]?.price || 0
    );
    return sum + price * item.quantity;
  }, 0);

  const shipping =
    selectedShipping === "standard"
      ? 0
      : selectedShipping === "express"
      ? 3500
      : 6500;

  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  // Loading state
  if (cartLoading || addressesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (cartError || addressesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Cannot Loading Checkout
          </h3>
          <p className="text-gray-600 mb-4">
            {cartError || addressesError || "Something went wrong"}
          </p>
          <Button onClick={() => navigate("/shopping-cart")} className="cursor-pointer">
            Back to Cart
          </Button>
        </Card>
      </div>
    );
  }

  // Only show "No items" if we're not showing success modal
  if (checkoutItems.length === 0 && !showSuccessModal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-8 max-w-md">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Items to Checkout
          </h3>
          <p className="text-gray-600 mb-4">
            Your cart is empty. Add some items to continue.
          </p>
          <Button onClick={() => navigate("/")}>Continue Shopping</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <ToastNotification ref={toastRef} />

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
                  Step {currentStep} of 2 • {checkoutItems.length} items
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
                      Delivery Address
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

                  {addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No addresses found
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Add a shipping address to continue with your order.
                      </p>
                      <Button onClick={handleAddressAdd}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div
                          key={address._id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedAddress?._id === address._id
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
                                    address.addressType === "home"
                                      ? "success"
                                      : "primary"
                                  }
                                  size="sm"
                                >
                                  {address.addressType === "home"
                                    ? "Home"
                                    : "Work"}
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
                              <p className="text-sm text-gray-600">
                                {address.phoneNumber}
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
                  )}
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
                    {checkoutItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={
                            item.image ||
                            item.listing?.images?.[0]?.url ||
                            "/placehold.png"
                          }
                          alt={item.name || item.listing?.title}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = "/placehold.png";
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {item.name || item.listing?.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.brand || item.listing?.brand}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                          {item.storeName && (
                            <p className="text-xs text-blue-600">
                              Store: {item.storeName}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            LKR{" "}
                            {(
                              parseFloat(
                                item.price ||
                                  item.listing?.variations?.[0]?.price ||
                                  0
                              ) * item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {selectedAddress && (
                  <Card>
                    <h3 className="font-bold text-gray-900 mb-4">
                      Delivery Address
                    </h3>
                    <div className="text-sm text-gray-600">
                      <p className="font-semibold text-gray-900">
                        {selectedAddress.firstName} {selectedAddress.lastName}
                      </p>
                      <p>{selectedAddress.streetAddress}</p>
                      <p>
                        {selectedAddress.city}, {selectedAddress.state}{" "}
                        {selectedAddress.zipCode}
                      </p>
                      <p>{selectedAddress.phoneNumber}</p>
                    </div>
                  </Card>
                )}

                {/* Order metadata display */}
                {cartMetadata && (
                  <Card>
                    <h3 className="font-bold text-gray-900 mb-4">
                      Order Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Items:</span>
                        <span className="font-medium ml-2">
                          {checkoutItems.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Stores:</span>
                        <span className="font-medium ml-2">
                          {
                            new Set(
                              checkoutItems
                                .map((item) => item.storeId)
                                .filter(Boolean)
                            ).size
                          }
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Sellers:</span>
                        <span className="font-medium ml-2">
                          {
                            new Set(
                              checkoutItems
                                .map((item) => item.sellerId)
                                .filter(Boolean)
                            ).size
                          }
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total:</span>
                        <span className="font-medium ml-2">
                          LKR {total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Card>
                )}
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
                  disabled={isPlacingOrder || !selectedAddress}
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
              cartItems={checkoutItems}
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
        onClose={handleSuccessModalClose}
        orderData={orderData}
        type="order"
      />
    </div>
  );
};

export default CheckoutPage;
