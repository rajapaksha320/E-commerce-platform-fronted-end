import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Heart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  Truck,
  Shield,
  CreditCard,
  X,
  Star,
  Clock,
} from "lucide-react";

import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";
import Pagination from "../../components/ui/ContactUis/Pagination";
import { useNavigate } from "react-router-dom"; 

const ShoppingCartPage = () => {

  // Pagination states
  const [cartPage, setCartPage] = useState(1);
  const [savedPage, setSavedPage] = useState(1);
  const itemsPerPage = 3; 
  const savedItemsPerPage = 6;
  const navigate = useNavigate();

  const handleNavigateCheckout = () => {
    navigate("/checkout");
  }

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Wireless Bluetooth Headphones Pro Max",
      brand: "TechAudio",
      price: 179.99,
      originalPrice: 249.99,
      discount: 28,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      inStock: true,
      rating: 4.8,
      totalReviews: 1247,
      badge: "Best Seller",
      shippingFree: true,
    },
    {
      id: 2,
      name: "Premium Leather Handbag",
      brand: "LuxeFashion",
      price: 299.99,
      originalPrice: 399.99,
      discount: 25,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
      inStock: true,
      rating: 4.6,
      totalReviews: 823,
      badge: "New",
      shippingFree: true,
    },
    {
      id: 3,
      name: "Smart Fitness Watch",
      brand: "FitTech",
      price: 199.99,
      originalPrice: 279.99,
      discount: 29,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
      inStock: false,
      rating: 4.7,
      totalReviews: 956,
      badge: "Popular",
      shippingFree: false,
    },
    {
      id: 4,
      name: "Gaming Mechanical Keyboard",
      brand: "GamePro",
      price: 149.99,
      originalPrice: 199.99,
      discount: 25,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
      inStock: true,
      rating: 4.5,
      totalReviews: 678,
      badge: "Gaming",
      shippingFree: true,
    },
    {
      id: 5,
      name: "Organic Coffee Beans",
      brand: "BrewMaster",
      price: 24.99,
      originalPrice: 34.99,
      discount: 29,
      quantity: 3,
      image:
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
      inStock: true,
      rating: 4.9,
      totalReviews: 445,
      badge: "Organic",
      shippingFree: false,
    },
  ]);

  const [savedItems, setSavedItems] = useState([
    {
      id: 101,
      name: "Bluetooth Speaker",
      brand: "SoundMax",
      price: 89.99,
      originalPrice: 119.99,
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
      rating: 4.3,
      totalReviews: 234,
    },
    {
      id: 102,
      name: "Phone Case Premium",
      brand: "ProtectPro",
      price: 29.99,
      originalPrice: 39.99,
      image:
        "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
      rating: 4.6,
      totalReviews: 156,
    },
    {
      id: 103,
      name: "Desk Lamp LED",
      brand: "BrightLux",
      price: 49.99,
      originalPrice: 69.99,
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
      rating: 4.5,
      totalReviews: 389,
    },
    {
      id: 104,
      name: "Water Bottle Steel",
      brand: "HydroMax",
      price: 34.99,
      originalPrice: 44.99,
      image:
        "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop",
      rating: 4.8,
      totalReviews: 267,
    },
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const saveForLater = (item) => {
    setSavedItems((prev) => [...prev, item]);
    removeItem(item.id);
    if (
      cartPage > Math.ceil((cartItems.length - 1) / itemsPerPage) &&
      cartPage > 1
    ) {
      setCartPage(cartPage - 1);
    }
  };

  const moveToCart = (item) => {
    setCartItems((prev) => [...prev, { ...item, quantity: 1 }]);
    setSavedItems((prev) => prev.filter((saved) => saved.id !== item.id));
    if (
      savedPage > Math.ceil((savedItems.length - 1) / savedItemsPerPage) &&
      savedPage > 1
    ) {
      setSavedPage(savedPage - 1);
    }
  };

  const getBadgeVariant = (badge) => {
    const variants = {
      "Best Seller": "success",
      New: "primary",
      Popular: "warning",
      Organic: "success",
      Gaming: "primary",
      "Eco-Friendly": "success",
    };
    return variants[badge] || "default";
  };

  // Pagination calculations
  const totalCartPages = Math.ceil(cartItems.length / itemsPerPage);
  const totalSavedPages = Math.ceil(savedItems.length / savedItemsPerPage);

  // Get paginated data
  const getPaginatedCartItems = () => {
    const startIndex = (cartPage - 1) * itemsPerPage;
    return cartItems.slice(startIndex, startIndex + itemsPerPage);
  };

  const getPaginatedSavedItems = () => {
    const startIndex = (savedPage - 1) * savedItemsPerPage;
    return savedItems.slice(startIndex, startIndex + savedItemsPerPage);
  };

  const paginatedCartItems = getPaginatedCartItems();
  const paginatedSavedItems = getPaginatedSavedItems();

  // Reset pagination when items change
  useEffect(() => {
    if (cartPage > totalCartPages && totalCartPages > 0) {
      setCartPage(totalCartPages);
    }
  }, [cartItems.length, cartPage, totalCartPages]);

  useEffect(() => {
    if (savedPage > totalSavedPages && totalSavedPages > 0) {
      setSavedPage(totalSavedPages);
    }
  }, [savedItems.length, savedPage, totalSavedPages]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  // Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = cartItems.some((item) => !item.shippingFree) ? 9.99 : 0;
  const freeShipping = shipping === 0;
  const finalShipping = freeShipping ? 0 : shipping;
  const tax = subtotal * 0.08;
  const total = subtotal + finalShipping + tax;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Mobile-First Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => window.history.back()}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center truncate">
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">Shopping Cart</span>
                  <span className="sm:hidden">Cart</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
            {/* Mobile Cart Total */}
            <div className="sm:hidden">
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  ${total.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <Card className="text-center py-12 sm:py-16">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 flex items-center justify-center">
                <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Looks like you haven't added any items to your cart yet. Start
                exploring our amazing products!
              </p>
              <Button size="lg" className="w-full sm:w-auto">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Start Shopping
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items - Mobile First */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Cart Items
                </h2>
                <Badge variant="primary" size="sm">
                  {itemCount} items
                </Badge>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4 sm:space-y-6">
                {paginatedCartItems.map((item) => (
                  <Card
                    key={item.id}
                    className="p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="space-y-4">
                      {/* Mobile Layout */}
                      <div className="sm:hidden">
                        <div className="flex space-x-4">
                          {/* Image */}
                          <div className="flex-shrink-0 relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            {item.badge && (
                              <div className="absolute -top-1 -right-1">
                                <Badge
                                  variant={getBadgeVariant(item.badge)}
                                  size="sm"
                                >
                                  {item.badge}
                                </Badge>
                              </div>
                            )}
                            {!item.inStock && (
                              <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs font-medium bg-red-600 px-2 py-1 rounded">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-blue-600 font-medium mb-1">
                              {item.brand}
                            </p>
                            <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">
                              {item.name}
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center space-x-1 mb-2">
                              {renderStars(item.rating)}
                              <span className="text-xs text-gray-500 ml-1">
                                {item.rating} (
                                {item.totalReviews.toLocaleString()})
                              </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-bold text-gray-900">
                                ${item.price}
                              </span>
                              {item.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${item.originalPrice}
                                </span>
                              )}
                              {item.discount && (
                                <Badge variant="danger" size="sm">
                                  -{item.discount}%
                                </Badge>
                              )}
                            </div>

                            {item.shippingFree && (
                              <div className="flex items-center text-green-600 text-xs mb-2">
                                <Truck className="h-3 w-3 mr-1" />
                                <span className="font-medium">
                                  Free Shipping
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            {item.originalPrice && (
                              <p className="text-xs text-gray-500 line-through">
                                $
                                {(item.originalPrice * item.quantity).toFixed(
                                  2
                                )}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Mobile Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          {/* Quantity */}
                          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
                            <Button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              variant="ghost"
                              size="sm"
                              className="p-1 h-8 w-8"
                              disabled={!item.inStock}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-semibold text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              variant="ghost"
                              size="sm"
                              className="p-1 h-8 w-8"
                              disabled={!item.inStock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => saveForLater(item)}
                              variant="outline"
                              size="sm"
                              className="text-xs px-3"
                            >
                              <Heart className="h-3 w-3 mr-1" />
                              Save
                            </Button>
                            <Button
                              onClick={() => removeItem(item.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:block">
                        <div className="flex space-x-6">
                          {/* Image */}
                          <div className="flex-shrink-0 relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-24 h-24 lg:w-28 lg:h-28 object-cover rounded-lg"
                            />
                            {item.badge && (
                              <div className="absolute -top-2 -left-2">
                                <Badge
                                  variant={getBadgeVariant(item.badge)}
                                  size="sm"
                                >
                                  {item.badge}
                                </Badge>
                              </div>
                            )}
                            {!item.inStock && (
                              <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                                <span className="text-white font-semibold text-sm bg-red-600 px-3 py-1 rounded-full">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="mb-3">
                              <p className="text-sm text-blue-600 font-semibold mb-1">
                                {item.brand}
                              </p>
                              <h3 className="font-semibold text-gray-900 text-base lg:text-lg mb-2">
                                {item.name}
                              </h3>
                            </div>

                            <div className="flex items-center space-x-1 mb-3">
                              {renderStars(item.rating)}
                              <span className="text-sm text-gray-600 ml-2">
                                {item.rating} (
                                {item.totalReviews.toLocaleString()})
                              </span>
                            </div>

                            <div className="flex items-center space-x-3 mb-4">
                              <span className="font-bold text-gray-900 text-xl">
                                ${item.price}
                              </span>
                              {item.originalPrice && (
                                <span className="text-base text-gray-500 line-through">
                                  ${item.originalPrice}
                                </span>
                              )}
                              {item.discount && (
                                <Badge variant="danger" size="sm">
                                  -{item.discount}%
                                </Badge>
                              )}
                            </div>

                            {item.shippingFree && (
                              <div className="flex items-center text-green-600 text-sm mb-4">
                                <Truck className="h-4 w-4 mr-2" />
                                <span className="font-medium">
                                  Free Shipping
                                </span>
                              </div>
                            )}

                            {/* Desktop Actions */}
                            <div className="flex items-center space-x-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-3 bg-white rounded-xl border border-gray-200 p-1">
                                <Button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  variant="ghost"
                                  size="sm"
                                  className="p-2"
                                  disabled={!item.inStock}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-10 text-center font-semibold text-lg">
                                  {item.quantity}
                                </span>
                                <Button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  variant="ghost"
                                  size="sm"
                                  className="p-2"
                                  disabled={!item.inStock}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center space-x-2">
                                <Button
                                  onClick={() => saveForLater(item)}
                                  variant="outline"
                                  size="sm"
                                  className="text-sm"
                                >
                                  <Heart className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                                <Button
                                  onClick={() => removeItem(item.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="font-bold text-xl text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            {item.originalPrice && (
                              <p className="text-sm text-gray-500 line-through">
                                $
                                {(item.originalPrice * item.quantity).toFixed(
                                  2
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Cart Pagination */}
              {cartItems.length > itemsPerPage && (
                <div className="mt-6">
                  <Pagination
                    currentPage={cartPage}
                    totalPages={totalCartPages}
                    onPageChange={setCartPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={cartItems.length}
                  />
                </div>
              )}

              {/* Saved for Later */}
              {savedItems.length > 0 && (
                <Card className="mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">
                      Saved for Later
                    </h3>
                    <Badge variant="secondary" size="sm">
                      {savedItems.length} items
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {paginatedSavedItems.map((item) => (
                      <div
                        key={item.id}
                        className="group relative bg-gray-50/50 rounded-lg p-3 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="relative mb-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <Button
                            onClick={() =>
                              setSavedItems((prev) =>
                                prev.filter((saved) => saved.id !== item.id)
                              )
                            }
                            variant="ghost"
                            size="sm"
                            className="absolute top-1 right-1 p-1 bg-white/90 hover:bg-white rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                          {item.name}
                        </h4>
                        <div className="flex items-center space-x-1 mb-2">
                          {renderStars(item.rating)}
                          <span className="text-xs text-gray-500">
                            ({item.totalReviews})
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-sm font-bold text-gray-900">
                            ${item.price}
                          </span>
                          {item.originalPrice && (
                            <span className="text-xs text-gray-500 line-through">
                              ${item.originalPrice}
                            </span>
                          )}
                        </div>
                        <Button
                          onClick={() => moveToCart(item)}
                          size="sm"
                          className="w-full text-xs"
                        >
                          Move to Cart
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Saved Items Pagination */}
                  {savedItems.length > savedItemsPerPage && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <Pagination
                        currentPage={savedPage}
                        totalPages={totalSavedPages}
                        onPageChange={setSavedPage}
                        itemsPerPage={savedItemsPerPage}
                        totalItems={savedItems.length}
                      />
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Order Summary - Mobile Optimized */}
            <div className="lg:col-span-1 order-first lg:order-last">
              <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">
                {/* Mobile Checkout Button */}
                <div className="sm:hidden">
                  <Button className="w-full" size="lg">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Checkout - ${total.toFixed(2)}
                  </Button>
                </div>

                {/* Order Summary */}
                <Card>
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Subtotal ({itemCount} items)
                      </span>
                      <span className="font-semibold">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span
                        className={
                          finalShipping === 0
                            ? "text-green-600 font-semibold"
                            : "font-semibold"
                        }
                      >
                        {finalShipping === 0
                          ? "Free"
                          : `$${finalShipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-base font-bold">
                        <span>Total</span>
                        <span className="text-blue-600">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Checkout */}
                  <div className="mt-6 space-y-4 hidden sm:block">
                    <Button className="w-full" size="lg" onClick={handleNavigateCheckout}>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Proceed to Checkout
                    </Button>

                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                      <div className="flex items-center justify-center space-x-2 bg-gray-50 rounded-lg p-3">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Secure</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 bg-gray-50 rounded-lg p-3">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Free Returns</span>
                      </div>
                    </div>
                  </div>

                  {/* Free Shipping Progress */}
                  {!freeShipping && subtotal < 75 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center text-blue-700 text-sm mb-2">
                        <Truck className="h-4 w-4 mr-2" />
                        <span className="font-medium">
                          Add ${(75 - subtotal).toFixed(2)} more for free
                          shipping!
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((subtotal / 75) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Trust Badges - Mobile */}
                <div className="sm:hidden grid grid-cols-3 gap-2 text-xs">
                  <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg border border-gray-200">
                    <Shield className="h-5 w-5 text-green-600 mb-1" />
                    <span className="font-medium text-gray-700">Secure</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg border border-gray-200">
                    <Truck className="h-5 w-5 text-blue-600 mb-1" />
                    <span className="font-medium text-gray-700">
                      Free Returns
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg border border-gray-200">
                    <Clock className="h-5 w-5 text-purple-600 mb-1" />
                    <span className="font-medium text-gray-700">Fast Ship</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartPage;
