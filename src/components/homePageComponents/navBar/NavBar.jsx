import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  LogOut,
  Settings,
  Package,
  UserCircle,
  Filter,
  MapPin,
  ChevronDown,
  Bell,
  Star,
} from "lucide-react";

import { Button } from "../../ui/NavUis/Button";
import AuthModal from "../../authComponents/AuthModal";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState("login");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shops", href: "/shops" },
    { name: "Categories", href: "/categories" },
    { name: "Deals", href: "/deals" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleAuthModalOpen = (view = "login") => {
    setAuthView(view);
    setIsAuthModalOpen(true);
  };

  const handleLogin = (email) => {
    setUser({
      email: email,
      name: email.split("@")[0],
      avatar: null,
    });
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsProfileMenuOpen(false);
  };

  const getInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : "U";
  };

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        {/* Main Navigation Row */}
        <div className="border-b border-gray-100/50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
              {/* Logo Section */}
              <div className="flex items-center">
                <a href="/" className="flex items-center group">
                  <div className="relative">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-blue-900 transition-all duration-300">
                      Emmover.
                    </h1>
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-500"></div>
                  </div>
                </a>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="relative px-3 xl:px-4 py-2 text-gray-700 hover:text-blue-600 font-medium text-sm transition-all duration-200 rounded-lg hover:bg-blue-50/50 group"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-4/5 transition-all duration-300"></span>
                  </a>
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
                  >
                    <Package className="h-3 w-3 xl:h-4 xl:w-4 mr-1 xl:mr-2" />
                    <span className="hidden xl:inline">Sell with us</span>
                    <span className="xl:hidden">Sell</span>
                  </Button>
                </div>

                {/* Action Icons */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {/* Notifications - Tablet and Desktop */}
                  <button className="hidden md:block relative p-2 xl:p-2.5 text-gray-600 hover:text-blue-600 transition-all duration-200 rounded-xl hover:bg-blue-50 group">
                    <Bell className="h-4 w-4 xl:h-5 xl:w-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-3 w-3 xl:h-4 xl:w-4 flex items-center justify-center animate-pulse text-[10px] xl:text-xs">
                      2
                    </span>
                  </button>

                  {/* Wishlist - Mobile and up */}
                  <button className="relative p-2 xl:p-2.5 text-gray-600 hover:text-pink-600 transition-all duration-200 rounded-xl hover:bg-pink-50 group">
                    <Heart className="h-4 w-4 xl:h-5 xl:w-5 group-hover:fill-pink-100" />
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-3 w-3 xl:h-4 xl:w-4 flex items-center justify-center text-[10px] xl:text-xs">
                      2
                    </span>
                  </button>

                  {/* Shopping Cart */}
                  <button className="relative p-2 xl:p-2.5 text-gray-600 hover:text-blue-600 transition-all duration-200 rounded-xl hover:bg-blue-50 group">
                    <ShoppingCart className="h-4 w-4 xl:h-5 xl:w-5" />
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full h-4 w-4 xl:h-5 xl:w-5 flex items-center justify-center font-medium shadow-lg text-[10px] xl:text-xs">
                      3
                    </span>
                  </button>

                  {/* User Profile - Tablet and Desktop */}
                  <div className="hidden md:block relative ml-1 xl:ml-2">
                    {!user ? (
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
                        <button
                          onClick={() =>
                            setIsProfileMenuOpen(!isProfileMenuOpen)
                          }
                          className="flex items-center space-x-2 xl:space-x-3 p-1.5 xl:p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300 bg-white shadow-sm"
                        >
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt="Profile"
                              className="w-7 h-7 xl:w-9 xl:h-9 rounded-full ring-2 ring-blue-100"
                            />
                          ) : (
                            <div className="w-7 h-7 xl:w-9 xl:h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs xl:text-sm shadow-inner">
                              {getInitials(user.email)}
                            </div>
                          )}
                          <div className="text-left hidden lg:block">
                            <span className="text-xs xl:text-sm font-semibold text-gray-900 block max-w-20 xl:max-w-24 truncate">
                              {user.name}
                            </span>
                          </div>
                          <ChevronDown className="h-3 w-3 xl:h-4 xl:w-4 text-gray-400 hidden lg:block" />
                        </button>

                        {/* Enhanced Profile Dropdown */}
                        {isProfileMenuOpen && (
                          <div className="absolute right-0 mt-2 w-56 xl:w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 backdrop-blur-sm">
                            <div className="px-4 xl:px-6 py-3 xl:py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-sm xl:text-base">
                                  {getInitials(user.email)}
                                </div>
                                <div>
                                  <p className="text-xs xl:text-sm font-semibold text-gray-900">
                                    {user.name}
                                  </p>
                                  <p className="text-[10px] xl:text-xs text-gray-600 truncate">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="py-2">
                              <a
                                href="/profile"
                                className="flex items-center px-4 xl:px-6 py-2.5 xl:py-3 text-xs xl:text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                              >
                                <UserCircle className="h-4 w-4 xl:h-5 xl:w-5 mr-3" />
                                My Profile
                              </a>
                              <a
                                href="/orders"
                                className="flex items-center px-4 xl:px-6 py-2.5 xl:py-3 text-xs xl:text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                              >
                                <Package className="h-4 w-4 xl:h-5 xl:w-5 mr-3" />
                                My Orders
                              </a>
                              <a
                                href="/wishlist"
                                className="flex items-center px-4 xl:px-6 py-2.5 xl:py-3 text-xs xl:text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                              >
                                <Heart className="h-4 w-4 xl:h-5 xl:w-5 mr-3" />
                                Wishlist
                              </a>
                              <a
                                href="/settings"
                                className="flex items-center px-4 xl:px-6 py-2.5 xl:py-3 text-xs xl:text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                              >
                                <Settings className="h-4 w-4 xl:h-5 xl:w-5 mr-3" />
                                Settings
                              </a>
                            </div>

                            <div className="border-t border-gray-100 pt-2">
                              <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 xl:px-6 py-2.5 xl:py-3 text-xs xl:text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
                              >
                                <LogOut className="h-4 w-4 xl:h-5 xl:w-5 mr-3" />
                                Logout
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Mobile menu button */}
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-xl hover:bg-blue-50 touch-manipulation"
                    aria-label="Toggle menu"
                  >
                    {isMenuOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search Section */}
        <div className="hidden md:block bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-2xl xl:max-w-3xl">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search for products, brands and more..."
                    className="w-full pl-4 xl:pl-6 pr-12 xl:pr-14 py-3 xl:py-4 border border-gray-200 rounded-xl xl:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm hover:shadow-md text-gray-700 placeholder-gray-400 group-hover:border-gray-300 text-sm xl:text-base"
                  />
                  <button className="absolute right-2 top-2 xl:top-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 xl:p-2.5 rounded-lg xl:rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    <Search className="h-4 w-4 xl:h-5 xl:w-5" />
                  </button>

                  {/* Trending suggestions dropdown */}
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 group-focus-within:opacity-100 transition-all duration-200 z-10">
                    <div className="p-3 xl:p-4">
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                        <span>🔥 Trending searches:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-50 text-blue-600 px-2.5 xl:px-3 py-1 rounded-full text-xs xl:text-sm hover:bg-blue-100 cursor-pointer">
                          Electronics
                        </span>
                        <span className="bg-blue-50 text-blue-600 px-2.5 xl:px-3 py-1 rounded-full text-xs xl:text-sm hover:bg-blue-100 cursor-pointer">
                          Fashion
                        </span>
                        <span className="bg-blue-50 text-blue-600 px-2.5 xl:px-3 py-1 rounded-full text-xs xl:text-sm hover:bg-blue-100 cursor-pointer">
                          Home & Garden
                        </span>
                        <span className="bg-blue-50 text-blue-600 px-2.5 xl:px-3 py-1 rounded-full text-xs xl:text-sm hover:bg-blue-100 cursor-pointer">
                          Sports
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-4 pr-11 py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-sm placeholder-gray-400"
              />
              <button className="absolute right-2 top-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors touch-manipulation">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
            <div className="px-3 sm:px-4 pt-4 pb-6 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
              {/* User Section - Mobile */}
              {user && (
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {getInitials(user.email)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              <div className="space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-3.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-base active:bg-blue-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50 justify-start rounded-lg sm:rounded-xl border border-orange-200 py-3.5 text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package className="h-5 w-5 mr-3" />
                  Sell with us
                </Button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    className="flex items-center justify-center space-x-2 p-3.5 border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-200 transition-all duration-200 group active:bg-pink-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className="h-5 w-5 text-pink-600 group-hover:fill-pink-100" />
                    <span className="text-sm font-medium">Wishlist</span>
                    <span className="bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      2
                    </span>
                  </button>
                  <button
                    className="flex items-center justify-center space-x-2 p-3.5 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 active:bg-blue-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Bell className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Alerts</span>
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      2
                    </span>
                  </button>
                </div>

                {!user ? (
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
                      <a
                        href="/profile"
                        className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 active:bg-blue-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <UserCircle className="h-5 w-5 mr-3" />
                        <span className="text-base">My Profile</span>
                      </a>
                      <a
                        href="/orders"
                        className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 active:bg-blue-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Package className="h-5 w-5 mr-3" />
                        <span className="text-base">My Orders</span>
                      </a>
                      <a
                        href="/settings"
                        className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 active:bg-blue-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="h-5 w-5 mr-3" />
                        <span className="text-base">Settings</span>
                      </a>
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
