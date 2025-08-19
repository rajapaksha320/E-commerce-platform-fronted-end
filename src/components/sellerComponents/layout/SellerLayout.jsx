// components/seller/SellerLayout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart3,
  Package,
  ShoppingCart,
  MessageSquare,
  Bell,
  User,
  Settings,
  Search,
  ChevronDown,
  Home,
  LogOut,
  PlusCircle,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Filter,
  Users,
  CreditCard,
} from "lucide-react";

// Import Redux actions and selectors
import {
  logout,
  selectUser,
  selectIsAuthenticated,
} from "../../../store/slices/authSlice";

// Import UI components
import {
  Button,
  IconButton,
  Input,
  SearchInput,
  Select,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Avatar,
  Dropdown,
} from "../../ui/sellerUis/Uis";

import OrderManagement from "../sellerDashboardComponents/OrderManagement/OrderManagement";
import ListingManagement from "../sellerDashboardComponents/ListingManagement/ListingManagement";
import ProfileManagement from "../sellerDashboardComponents/ProfileManagement/ProfileManagement";

const SellerLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux selectors
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [activeTab, setActiveTab] = useState("overview");
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const navigation = [
    { id: "overview", name: "Overview", href: "/seller/overview" },
    { id: "orders", name: "Orders", href: "/seller/orders"},
    { id: "listings", name: "Listings", href: "/seller/listings" },
    { id: "store", name: "Store", href: "/seller/profile" },
  ];

  // Updated sidebar navigation with actual order statuses
  const sidebarNavigation = {
    orders: [
      { id: "all-orders", name: "All orders", status: null },
      { id: "pending", name: "Awaiting shipment", status: "pending" },
      { id: "shipped", name: "Paid and shipped", status: "shipped" },
      { id: "delivered", name: "Delivered orders", status: "delivered" },
      { id: "confirmed", name: "Completed orders", status: "confirmed" },
      { id: "cancelled", name: "Cancelled orders", status: "cancelled" },
    ],
    listings: [
      { id: "all-listings", name: "All listings", backendStatus: null },
      {
        id: "active-listings",
        name: "Active listings",
        backendStatus: "active",
      },
      {
        id: "inactive-listings",
        name: "Inactive listings",
        backendStatus: "inactive",
      },
      { id: "out-of-stock", name: "Out of stock", backendStatus: "outOfStock" },
      { id: "draft-listings", name: "Draft listings", backendStatus: "draft" },
      { id: "sold-listings", name: "Sold listings", backendStatus: "sold" },
    ],
    payments: [
      { id: "payouts", name: "Payouts" },
      { id: "transactions", name: "Transaction history" },
      { id: "fees", name: "Fees and charges" },
      { id: "tax-documents", name: "Tax documents" },
      { id: "payment-methods", name: "Payment methods" },
    ],
  };

  // Navigation handlers
  const handleNavigation = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "overview" || tabId === "store") {
      setActiveSubTab(null);
    } else {
      const firstSubItem = sidebarNavigation[tabId]?.[0];
      setActiveSubTab(firstSubItem ? firstSubItem.id : null);
    }
  };

  const handleSubNavigation = (subTabId) => {
    setActiveSubTab(subTabId);
  };

  const handleProfileNavigation = () => {
    setActiveTab("store");
    setActiveSubTab(null);
    setProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setProfileDropdownOpen(false);
  };

  const showSidebar =
    activeTab !== "overview" &&
    activeTab !== "store" &&
    sidebarNavigation[activeTab];

  // Filter Bar Component
  const FilterBar = ({ filters }) => {
    if (!filters || filters.length === 0) return null;

    return (
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Filter className="h-4 w-4" />
            <span>Filters:</span>
          </div>

          {filters.map((filter, index) => (
            <div key={index} className="flex items-center gap-2">
              {filter.type === "select" && (
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    {filter.label}:
                  </label>
                  <Select className="min-w-32">
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              {filter.type === "search" && (
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    {filter.label}:
                  </label>
                  <SearchInput
                    placeholder={filter.placeholder}
                    className="w-48"
                  />
                </div>
              )}
            </div>
          ))}

          <Button variant="secondary" size="sm">
            Reset Filters
          </Button>
        </div>
      </div>
    );
  };

  // Overview Content Component
  const OverviewContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Unread messages</p>
                <p className="text-2xl font-bold text-blue-900">0</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Awaiting shipment</p>
                <p className="text-2xl font-bold text-orange-900">0</p>
              </div>
              <Package className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Sales (31 days)</p>
                <p className="text-2xl font-bold text-green-900">LKR 0.00</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Seller level forecast</p>
                <p className="text-lg font-semibold text-purple-700">
                  Above Standard
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks, Sales, Orders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center py-8">No tasks pending.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sales</CardTitle>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center mb-6">
              <div className="text-gray-400">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">Sales chart visualization</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Today</span>
                <span className="font-medium">LKR 0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last 7 days</span>
                <span className="font-medium">LKR 0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last 31 days</span>
                <span className="font-medium">LKR 0.00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Orders</CardTitle>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Awaiting shipment</span>
                <Badge variant="default">0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Awaiting payment</span>
                <Badge variant="default">0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Delivered</span>
                <Badge variant="default">0</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="ghost"
              className="flex items-center gap-3 p-4 h-auto"
              onClick={() => navigate("/create-listing")}
            >
              <PlusCircle className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Create Listing</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-3 p-4 h-auto"
            >
              <Package className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Manage Inventory</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-3 p-4 h-auto"
            >
              <BarChart3 className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">View Analytics</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-3 p-4 h-auto"
            >
              <MessageSquare className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">Messages</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Home className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Seller Hub
                </span>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Profile Dropdown */}
              {isAuthenticated && user ? (
                <Dropdown
                  trigger={
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Avatar
                        size="sm"
                        fallback={
                          user?.firstName?.charAt(0) ||
                          user?.email?.charAt(0) ||
                          "S"
                        }
                      />
                      <div className="hidden md:block text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.firstName ||
                            user?.email?.split("@")[0] ||
                            "Seller"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user?.userRole || "seller"}
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Button>
                  }
                  isOpen={profileDropdownOpen}
                  onToggle={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="w-56"
                >
                  <div className="p-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        size="md"
                        fallback={
                          user?.firstName?.charAt(0) ||
                          user?.email?.charAt(0) ||
                          "S"
                        }
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user?.firstName
                            ? `${user.firstName} ${user.lastName || ""}`.trim()
                            : user?.email?.split("@")[0] || "Seller"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user?.email || "No email"}
                        </div>
                        <div className="text-xs text-blue-600 font-medium capitalize">
                          {user?.userRole || "seller"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center text-left"
                      onClick={handleProfileNavigation}
                    >
                      <User className="mr-3 h-4 w-4" />
                      Profile Settings
                    </button>
                    <button
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center text-left"
                      onClick={() => navigate("/seller-dashboard")}
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Dashboard
                    </button>
                  </div>

                  <div className="border-t border-gray-100 py-2">
                    <button
                      className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center text-left"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </Dropdown>
              ) : (
                <div className="text-sm text-gray-500">Not authenticated</div>
              )}
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200">
            <nav className="flex space-x-8 overflow-x-auto">
              {navigation.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`relative py-4 px-1 text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {item.name}
                    {item.badge && (
                      <Badge variant="danger" size="xs" className="ml-2">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
            <div className="p-4">
              <nav className="space-y-1">
                {sidebarNavigation[activeTab]?.map((item) => {
                  const isActive = activeSubTab === item.id;
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "primary" : "ghost"}
                      onClick={() => handleSubNavigation(item.id)}
                      className={`w-full justify-start text-left ${
                        isActive ? "border-r-2 border-blue-600" : ""
                      }`}
                    >
                      {item.name}
                    </Button>
                  );
                })}
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main className="flex-1">
          {children || (
            <>
              {/* Overview Dashboard */}
              {activeTab === "overview" && (
                <div className="px-4 sm:px-6 lg:px-8 py-8">
                  <OverviewContent />
                </div>
              )}

              {/* Profile Management */}
              {activeTab === "store" && (
                <div className="py-8">
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ProfileManagement user={user} />
                  </div>
                </div>
              )}

              {/* Other tabs content */}
              {activeTab !== "overview" && activeTab !== "store" && (
                <div className="space-y-0">
                  <div className="px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                      {/* Orders Management */}
                      {activeTab === "orders" && activeSubTab && (
                        <OrderManagement
                          activeSection={activeSubTab}
                          orderStatus={
                            sidebarNavigation.orders.find(
                              (item) => item.id === activeSubTab
                            )?.status
                          }
                        />
                      )}

                      {/* Listings Management - Pass the backend status */}
                      {activeTab === "listings" && activeSubTab && (
                        <ListingManagement
                          activeSection={activeSubTab}
                          backendStatus={
                            sidebarNavigation.listings.find(
                              (item) => item.id === activeSubTab
                            )?.backendStatus
                          }
                        />
                      )}

                      {/* Other sections content */}
                      {activeTab !== "orders" && activeTab !== "listings" && (
                        <>
                          <div className="flex items-center justify-between">
                            <div>
                              <h1 className="text-2xl font-bold text-gray-900">
                                {activeSubTab
                                  ? sidebarNavigation[activeTab]?.find(
                                      (item) => item.id === activeSubTab
                                    )?.name
                                  : navigation.find(
                                      (nav) => nav.id === activeTab
                                    )?.name}
                              </h1>
                              <p className="text-gray-600">
                                {activeSubTab
                                  ? `Manage your ${activeSubTab.replace(
                                      "-",
                                      " "
                                    )}`
                                  : `Select a section from the sidebar`}
                              </p>
                            </div>
                          </div>

                          <Card>
                            <CardContent className="text-center py-12">
                              <div className="text-gray-400 mb-4">
                                {activeTab === "payments" && (
                                  <CreditCard className="h-16 w-16 mx-auto" />
                                )}
                              </div>
                              <h3 className="text-xl font-medium text-gray-900 mb-2">
                                {activeSubTab
                                  ? sidebarNavigation[activeTab]?.find(
                                      (item) => item.id === activeSubTab
                                    )?.name
                                  : `Select a ${activeTab} section`}
                              </h3>
                              <p className="text-gray-500">
                                {activeSubTab
                                  ? "Add your content here."
                                  : "Choose an option from the sidebar to get started."}
                              </p>
                            </CardContent>
                          </Card>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
