/* eslint-disable no-unused-vars */
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
  Lock,
  AlertTriangle,
} from "lucide-react";

// Import Redux actions and selectors
import {
  logout,
  selectUser,
  selectIsAuthenticated,
} from "../../../store/slices/authSlice";

// Import store selectors
import {
  selectHasStore,
  selectAllStores,
} from "../../../store/slices/sellerListingSlice";

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
  Alert,
} from "../../ui/sellerUis/Uis";

// Import child components
import SellerOverview from "../sellerDashboardComponents/OverviewContent/SellerOverview";
import OrderManagement from "../sellerDashboardComponents/OrderManagement/OrderManagement";
import ListingManagement from "../sellerDashboardComponents/ListingManagement/ListingManagement";
import ProfileManagement from "../sellerDashboardComponents/ProfileManagement/ProfileManagement";

const SellerLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux selectors
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const hasStore = useSelector(selectHasStore);
  const stores = useSelector(selectAllStores);

  const [activeTab, setActiveTab] = useState("overview");
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Updated navigation with conditional enabling
  const navigation = [
    {
      id: "overview",
      name: "Overview",
      href: "/seller/overview",
      enabled: true,
    },
    {
      id: "orders",
      name: "Orders",
      href: "/seller/orders",
      enabled: hasStore,
      disabledReason: "Create your store first to manage orders",
    },
    {
      id: "listings",
      name: "Listings",
      href: "/seller/listings",
      enabled: hasStore,
      disabledReason: "Create your store first to manage listings",
    },
    { id: "store", name: "Store", href: "/seller/profile", enabled: true },
  ];

  // Updated sidebar navigation with actual order statuses
  const sidebarNavigation = {
    orders: [
      { id: "all-orders", name: "All orders", status: null },
      { id: "pending", name: "Awaiting delivery", status: "pending" },
      { id: "shipped", name: "Paid and delivering", status: "shipped" },
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
    const navItem = navigation.find((item) => item.id === tabId);

    // Check if tab is enabled
    if (!navItem?.enabled) {
      return; // Don't navigate to disabled tabs
    }

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

  const handleInternalNavigation = (tabId) => {
    handleNavigation(tabId);
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
              {/* Store Status Indicator */}
              {!hasStore && (
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Store setup required</span>
                </div>
              )}

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
                const isDisabled = !item.enabled;

                return (
                  <div key={item.id} className="relative group">
                    <button
                      onClick={() => handleNavigation(item.id)}
                      disabled={isDisabled}
                      className={`relative py-4 px-1 text-sm font-medium whitespace-nowrap transition-colors ${
                        isActive
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : isDisabled
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      title={isDisabled ? item.disabledReason : item.name}
                    >
                      <div className="flex items-center gap-2">
                        {item.name}
                        {isDisabled && <Lock className="h-4 w-4" />}
                      </div>
                      {item.badge && (
                        <Badge variant="danger" size="xs" className="ml-2">
                          {item.badge}
                        </Badge>
                      )}
                    </button>

                    {/* Tooltip for disabled items */}
                    {isDisabled && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        {item.disabledReason}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Store Setup Alert */}
      {!hasStore && activeTab !== "store" && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <Alert
              variant="warning"
              title="Store Setup Required"
              className="bg-transparent border-0 p-0"
            >
              <div className="flex items-center justify-between">
                <span>
                  Complete your store setup to access listings and orders
                  management.
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleNavigation("store")}
                >
                  Setup Store
                </Button>
              </div>
            </Alert>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar - only show if tab is enabled and has sidebar */}
        {showSidebar && hasStore && (
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
                  <SellerOverview onNavigate={handleInternalNavigation} />
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

              {/* Other tabs content - only show if enabled */}
              {activeTab !== "overview" && activeTab !== "store" && (
                <div className="space-y-0">
                  {hasStore ? (
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

                        {/* Listings Management */}
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
                  ) : (
                    // Store setup required message
                    <div className="px-4 sm:px-6 lg:px-8 py-8">
                      <Card>
                        <CardContent className="text-center py-12">
                          <div className="text-amber-400 mb-4">
                            <Lock className="h-16 w-16 mx-auto" />
                          </div>
                          <h3 className="text-xl font-medium text-gray-900 mb-2">
                            Store Setup Required
                          </h3>
                          <p className="text-gray-500 mb-6">
                            You need to create your store before you can access{" "}
                            {activeTab} management.
                          </p>
                          <Button
                            variant="primary"
                            onClick={() => handleNavigation("store")}
                            icon={<ArrowRight />}
                          >
                            Setup Your Store
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
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
