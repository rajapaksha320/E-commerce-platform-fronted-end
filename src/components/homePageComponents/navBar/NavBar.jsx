/* eslint-disable no-unused-vars */
// components/homePageComponents/navBar/NavBar.jsx
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LocateFixed,
  Heart,
  LogOut,
  Settings,
  Package,
  UserCircle,
  ChevronDown,
  Bell,
  Star,
} from "lucide-react";

import { Button, Input } from "../../ui/ContactUis/Uis";
import AuthModal from "../../authComponents/AuthModal";
import SearchDropdown from "./SearchDropdown";
import { useNavigate } from "react-router-dom";

// 🏢 PROFESSIONAL: Redux selectors
import { 
  logout,
  selectIsAuthenticated,
  selectUser,
  selectUserRole
} from "../../../store/slices/authSlice";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // 🏢 PROFESSIONAL: Redux state
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);

  // Local state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState("login");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Cart state (you can move this to global state management)
  const [cartItemsCount, setCartItemsCount] = useState(3);

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shops", href: "/shop-collections" },
    { name: "Categories", href: "/category-collections" },
    { name: "Deals", href: "/deals" },
    { name: "About", href: "/about-us" },
    { name: "Contact", href: "/contact-us" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsSearchDropdownOpen(false);
        setIsSearchFocused(false);
      }

      // Close profile menu when clicking outside
      if (
        isProfileMenuOpen &&
        !event.target.closest(".profile-menu-container")
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // Search handlers
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 0 || isSearchFocused) {
      setIsSearchDropdownOpen(true);
    } else {
      setIsSearchDropdownOpen(false);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setIsSearchDropdownOpen(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setIsSearchFocused(false);
      if (!searchQuery) {
        setIsSearchDropdownOpen(false);
      }
    }, 200);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleViewAllResults(searchQuery.trim());
    }
  };

  const handleViewAllResults = (query) => {
    setIsSearchDropdownOpen(false);
    setIsSearchFocused(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleProductSelect = (product) => {
    setIsSearchDropdownOpen(false);
    setIsSearchFocused(false);
    navigate(`/product/${product.id}`);
  };

  // Navigation handlers
  const handleShoppingCartClick = () => {
    navigate("/shopping-cart");
  };

  const handleAuthModalOpen = (view = "login") => {
    setAuthView(view);
    setIsAuthModalOpen(true);
  };

  const handleLogin = () => {
    setIsAuthModalOpen(false);
  };

  const handleSellWithUs = () => {
    navigate("/seller-registration");
  };

  // 🏢 PROFESSIONAL: Logout handler
  const handleLogout = () => {
    dispatch(logout());
    setIsProfileMenuOpen(false);
  };

  const handleWishlistClick = () => {
    navigate("/wish-list");
  };

  const handleNavItemClick = (href) => {
    navigate(href);
    setIsMenuOpen(false);
  };

  // 🏢 PROFESSIONAL: Helper function to get user display info
  const getUserInfo = () => {
    if (!user) return null;
    
    return {
      name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 
            user.email ? user.email.split("@")[0] : 'User',
      email: user.email || '',
      avatar: user.avatar || null
    };
  };

  // 🏢 PROFESSIONAL: Generate user initials
  const getInitials = (name, email) => {
    if (name && name !== email?.split("@")[0]) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email ? email.charAt(0).toUpperCase() : "U";
  };

  const userInfo = getUserInfo();

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        {/* Main Navigation Row */}
        <div className="border-b border-gray-100/50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
              {/* Logo Section */}
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/")}
                  className="flex items-center group p-0 hover:bg-transparent"
                >
                  <div className="relative">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-blue-900 transition-all duration-300">
                      Emmover.
                    </h1>
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-500"></div>
                  </div>
                </Button>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    onClick={() => navigate(item.href)}
                    className="relative px-3 xl:px-4 py-2 text-gray-700 hover:text-blue-600 font-medium text-sm transition-all duration-200 rounded-lg hover:bg-blue-50/50 group"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-4/5 transition-all duration-300"></span>
                  </Button>
                ))}
              </div>

              {/* Right Actions */}
              <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                {/* Sell Button - Desktop */}
                <div className="hidden lg:block">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-semibold border border-orange-200 hover:border-orange-300 rounded-full px-4 xl:px-6 text-xs xl:text-sm"
                    onClick={handleSellWithUs}
                  >
                    <Package className="h-3 w-3 xl:h-4 xl:w-4 mr-1 xl:mr-2" />
                    <span className="hidden xl:inline">Sell with us</span>
                    <span className="xl:hidden">Sell</span>
                  </Button>
                </div>

                {/* Action Icons */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {/* Notifications - Tablet and Desktop */}
                  <Button
                    variant="ghost"
                    className="hidden md:block relative p-2 xl:p-2.5 text-gray-600 hover:text-blue-600 transition-all duration-200 rounded-xl hover:bg-blue-50 group"
                  >
                    <Bell className="h-4 w-4 xl:h-5 xl:w-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-3 w-3 xl:h-4 xl:w-4 flex items-center justify-center animate-pulse text-[10px] xl:text-xs">
                      2
                    </span>
                  </Button>

                  {/* Wishlist - Mobile and up */}
                  <Button
                    variant="ghost"
                    onClick={handleWishlistClick}
                    className="relative p-2 xl:p-2.5 text-gray-600 hover:text-pink-600 transition-all duration-200 rounded-xl hover:bg-pink-50 group"
                  >
                    <Heart className="h-4 w-4 xl:h-5 xl:w-5 group-hover:fill-pink-100" />
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-3 w-3 xl:h-4 xl:w-4 flex items-center justify-center text-[10px] xl:text-xs">
                      2
                    </span>
                  </Button>

                  {/* Shopping Cart with Navigation */}
                  <Button
                    variant="ghost"
                    onClick={handleShoppingCartClick}
                    className="relative p-2 xl:p-2.5 text-gray-600 hover:text-blue-600 transition-all duration-200 rounded-xl hover:bg-blue-50 group"
                  >
                    <ShoppingCart className="h-4 w-4 xl:h-5 xl:w-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full h-4 w-4 xl:h-5 xl:w-5 flex items-center justify-center font-medium shadow-lg text-[10px] xl:text-xs">
                        {cartItemsCount > 99 ? "99+" : cartItemsCount}
                      </span>
                    )}
                  </Button>

                  {/* 🏢 PROFESSIONAL: User Profile - Tablet and Desktop */}
                  <div className="hidden md:block relative ml-1 xl:ml-2 profile-menu-container">
                    {!isAuthenticated ? (
                      <div className="flex space-x-2 xl:space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAuthModalOpen("login")}
                          className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-full px-3 xl:px-4 text-xs xl:text-sm"
                        >
                          <User className="h-3 w-3 xl:h-4 xl:w-4 mr-1 xl:mr-2" />
                          Login
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAuthModalOpen("register")}
                          className="rounded-full px-4 xl:px-6 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-xs xl:text-sm"
                        >
                          Sign Up
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setIsProfileMenuOpen(!isProfileMenuOpen)
                          }
                          className="flex items-center space-x-2 xl:space-x-3 p-1.5 xl:p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300 bg-white shadow-sm"
                        >
                          {userInfo?.avatar ? (
                            <img
                              src={userInfo.avatar}
                              alt="Profile"
                              className="w-7 h-7 xl:w-9 xl:h-9 rounded-full ring-2 ring-blue-100"
                            />
                          ) : (
                            <div className="w-7 h-7 xl:w-9 xl:h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs xl:text-sm shadow-inner">
                              {getInitials(userInfo?.name, userInfo?.email)}
                            </div>
                          )}
                          <div className="text-left hidden lg:block">
                            <span className="text-xs xl:text-sm font-semibold text-gray-900 block max-w-20 xl:max-w-24 truncate">
                              {userInfo?.name}
                            </span>
                            {userRole && (
                              <span className="text-[10px] xl:text-xs text-gray-500 capitalize">
                                {userRole}
                              </span>
                            )}
                          </div>
                          <ChevronDown className="h-3 w-3 xl:h-4 xl:w-4 text-gray-400 hidden lg:block" />
                        </Button>

                        {/* 🏢 PROFESSIONAL: Enhanced Profile Dropdown */}
                        {isProfileMenuOpen && (
                          <div className="absolute right-0 mt-2 w-56 xl:w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 backdrop-blur-sm">
                            <div className="px-4 xl:px-6 py-3 xl:py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-sm xl:text-base">
                                  {getInitials(userInfo?.name, userInfo?.email)}
                                </div>
                                <div>
                                  <p className="text-xs xl:text-sm font-semibold text-gray-900">
                                    {userInfo?.name}
                                  </p>
                                  <p className="text-[10px] xl:text-xs text-gray-600 truncate">
                                    {userInfo?.email}
                                  </p>
                                  {userRole && (
                                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] rounded-full capitalize font-medium">
                                      {userRole}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="py-2">
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  navigate("/profile");
                                  setIsProfileMenuOpen(false);
                                }}
                                className="flex items-center w-full px-4 xl:px-6 py-2.5 xl:py-3 text-xs xl:text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 justify-start"
                              >
                                <UserCircle className="h-4 w-4 xl:h-5 xl:w-5 mr-3" />
                                My Profile
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  navigate("/orders");
                                  setIsProfileMenuOpen(false);
                                }}
                                className="flex items-center w-full px-4 xl:px-6 py-2.5 xl:py-3 text-xs xl:text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 justify-start"
                              >
                                <Package className="h-4 w-4 xl:h-5 xl:w-5 mr-3" />
                                My Orders
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  handleWishlistClick();
                                  setIsProfileMenuOpen(false);
                                }}
                                className="flex items-center w-full px-4 xl:px-6 py-2.5 xl:py-3 text-xs xl:text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 justify-start"
                              >
                                <Heart className="h-4 w-4 xl:h-5 xl:w-5 mr-3" />
                                Wishlist
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  navigate("/track-parcel");
                                  setIsProfileMenuOpen(false);
                                }}
                                className="flex items-center w-full px-4 xl:px-6 py-2.5 xl:py-3 text-xs xl:text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 justify-start"
                              >
                                <LocateFixed className="h-4 w-4 xl:h-5 xl:w-5 mr-3" />
                                Track Orders
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  navigate("/profile");
                                  setIsProfileMenuOpen(false);
                                }}
                                className="flex items-center w-full px-4 xl:px-6 py-2.5 xl:py-3 text-xs xl:text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 justify-start"
                              >
                                <Settings className="h-4 w-4 xl:h-5 xl:w-5 mr-3" />
                                Settings
                              </Button>

                              {/* 🏢 PROFESSIONAL: Seller-specific menu item */}
                              {userRole === 'seller' && (
                                <>
                                  <div className="border-t border-gray-100 my-2"></div>
                                  <Button
                                    variant="ghost"
                                    onClick={() => {
                                      navigate("/seller-dashboard");
                                      setIsProfileMenuOpen(false);
                                    }}
                                    className="flex items-center w-full px-4 xl:px-6 py-2.5 xl:py-3 text-xs xl:text-sm text-orange-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 justify-start"
                                  >
                                    <Package className="h-4 w-4 xl:h-5 xl:w-5 mr-3" />
                                    Seller Dashboard
                                  </Button>
                                </>
                              )}
                            </div>

                            <div className="border-t border-gray-100 pt-2">
                              <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 xl:px-6 py-2.5 xl:py-3 text-xs xl:text-sm text-red-600 hover:bg-red-50 transition-all duration-200 justify-start"
                              >
                                <LogOut className="h-4 w-4 xl:h-5 xl:w-5 mr-3" />
                                Logout
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Mobile menu button */}
                  <Button
                    variant="ghost"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-xl hover:bg-blue-50 touch-manipulation"
                    aria-label="Toggle menu"
                  >
                    {isMenuOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search Section */}
        <div className="hidden md:block bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-center">
              <div
                className="w-full max-w-2xl xl:max-w-3xl relative"
                ref={searchRef}
              >
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative group">
                    <Input
                      type="text"
                      placeholder="Search for products, brands and more..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      className="w-full pl-4 xl:pl-6 pr-12 xl:pr-14 py-3 xl:py-4 border border-gray-200 rounded-xl xl:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm hover:shadow-md text-gray-700 placeholder-gray-400 group-hover:border-gray-300 text-sm xl:text-base"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      className="absolute right-2 top-2 xl:top-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 xl:p-2.5 rounded-lg xl:rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Search className="h-4 w-4 xl:h-5 xl:w-5" />
                    </Button>
                  </div>
                </form>

                {/* Search Dropdown */}
                <div ref={dropdownRef}>
                  <SearchDropdown
                    searchQuery={searchQuery}
                    isOpen={isSearchDropdownOpen}
                    onClose={() => setIsSearchDropdownOpen(false)}
                    onViewAll={handleViewAllResults}
                    onProductSelect={handleProductSelect}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-4 pr-11 py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-sm placeholder-gray-400"
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="absolute right-2 top-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors touch-manipulation"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* 🏢 PROFESSIONAL: Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
            <div className="px-3 sm:px-4 pt-4 pb-6 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
              {/* User Section - Mobile */}
              {isAuthenticated && userInfo && (
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {getInitials(userInfo.name, userInfo.email)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userInfo.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {userInfo.email}
                    </p>
                    {userRole && (
                      <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full capitalize font-medium">
                        {userRole}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    onClick={() => handleNavItemClick(item.href)}
                    className="w-full text-left px-4 py-3.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-base active:bg-blue-100 justify-start"
                  >
                    {item.name}
                  </Button>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50 justify-start rounded-lg sm:rounded-xl border border-orange-200 py-3.5 text-base"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleSellWithUs();
                  }}
                >
                  <Package className="h-5 w-5 mr-3" />
                  Sell with us
                </Button>

                <div className="grid grid-cols-3 gap-2.5">
                  <Button
                    variant="ghost"
                    className="flex flex-col items-center justify-center space-y-1 p-3.5 border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-200 transition-all duration-200 group active:bg-pink-100"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleWishlistClick();
                    }}
                  >
                    <div className="relative">
                      <Heart className="h-5 w-5 text-pink-600 group-hover:fill-pink-100" />
                      <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        2
                      </span>
                    </div>
                    <span className="text-xs font-medium">Wishlist</span>
                  </Button>

                  <Button
                    variant="ghost"
                    className="flex flex-col items-center justify-center space-y-1 p-3.5 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 active:bg-blue-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="relative">
                      <Bell className="h-5 w-5 text-blue-600" />
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        2
                      </span>
                    </div>
                    <span className="text-xs font-medium">Alerts</span>
                  </Button>

                  <Button
                    variant="ghost"
                    className="flex flex-col items-center justify-center space-y-1 p-3.5 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 active:bg-blue-100"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleShoppingCartClick();
                    }}
                  >
                    <div className="relative">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {cartItemsCount > 9 ? "9+" : cartItemsCount}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium">Cart</span>
                  </Button>
                </div>

                {/* 🏢 PROFESSIONAL: Auth section */}
                {!isAuthenticated ? (
                  <div className="space-y-3 pt-2">
                    <Button
                      variant="outline"
                      className="w-full justify-center rounded-lg sm:rounded-xl py-3.5 text-base active:bg-gray-100"
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleAuthModalOpen("login");
                      }}
                    >
                      <User className="h-5 w-5 mr-2" />
                      Login
                    </Button>
                    <Button
                      variant="primary"
                      className="w-full justify-center rounded-lg sm:rounded-xl py-3.5 shadow-lg text-base active:scale-95"
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleAuthModalOpen("register");
                      }}
                    >
                      Sign Up
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          navigate("/profile");
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 active:bg-blue-100 justify-start"
                      >
                        <UserCircle className="h-5 w-5 mr-3" />
                        <span className="text-base">My Profile</span>
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          navigate("/orders");
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 active:bg-blue-100 justify-start"
                      >
                        <Package className="h-5 w-5 mr-3" />
                        <span className="text-base">My Orders</span>
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          navigate("/profile");
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 active:bg-blue-100 justify-start"
                      >
                        <Settings className="h-5 w-5 mr-3" />
                        <span className="text-base">Settings</span>
                      </Button>

                      {/* Seller Dashboard for mobile */}
                      {userRole === 'seller' && (
                        <Button
                          variant="ghost"
                          onClick={() => {
                            navigate("/seller-dashboard");
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-3 text-orange-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 active:bg-orange-100 justify-start"
                        >
                          <Package className="h-5 w-5 mr-3" />
                          <span className="text-base">Seller Dashboard</span>
                        </Button>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 justify-center rounded-lg sm:rounded-xl py-3.5 text-base active:bg-red-100"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView={authView}
        onLogin={handleLogin}
      />
    </>
  );
};

export default NavBar;