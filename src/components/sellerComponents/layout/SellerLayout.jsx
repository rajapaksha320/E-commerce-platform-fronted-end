import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

// Import the ProfileManagement component
import ProfileManagement from "../sellerDashboardComponents/ProfileManagement/ProfileManagement";

const SellerLayout = ({
  children,
  shopName = "My shop",
  shopRating = "257 ⭐",
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);

  const navigation = [
    { id: "overview", name: "Overview", href: "/seller/overview" },
    { id: "orders", name: "Orders", href: "/seller/orders", badge: "12" },
    { id: "listings", name: "Listings", href: "/seller/listings" },
    { id: "customer", name: "Customer", href: "/seller/customer", badge: "3" },
    { id: "payments", name: "Payments", href: "/seller/payments" },
    { id: "profile", name: "Profile", href: "/seller/profile" },
  ];

  const sidebarNavigation = {
    orders: [
      { id: "all-orders", name: "All orders" },
      { id: "awaiting-payment", name: "Awaiting payment" },
      { id: "awaiting-shipment", name: "Awaiting shipment" },
      { id: "paid-shipped", name: "Paid and shipped" },
      { id: "cancellations", name: "Cancellations" },
      { id: "returns", name: "Returns" },
      { id: "disputes", name: "Requests and disputes" },
    ],
    listings: [
      { id: "all-listings", name: "All listings" },
      { id: "active-listings", name: "Active listings" },
      { id: "inactive-listings", name: "Inactive listings" },
      { id: "out-of-stock", name: "Out of stock" },
      { id: "draft-listings", name: "Draft listings" },
      { id: "sold-listings", name: "Sold listings" },
    ],
    customer: [
      { id: "messages", name: "Customer messages" },
      { id: "questions", name: "Item questions" },
      { id: "cases", name: "Open cases" },
      { id: "feedback", name: "Feedback management" },
      { id: "reviews", name: "Reviews and ratings" },
    ],
    payments: [
      { id: "payouts", name: "Payouts" },
      { id: "transactions", name: "Transaction history" },
      { id: "fees", name: "Fees and charges" },
      { id: "tax-documents", name: "Tax documents" },
      { id: "payment-methods", name: "Payment methods" },
    ],
  };

  const filterConfigurations = {
    orders: {
      "all-orders": [
        {
          type: "select",
          label: "Order Status",
          options: [
            { value: "all", label: "All Orders" },
            { value: "pending", label: "Pending Payment" },
            { value: "paid", label: "Paid" },
            { value: "shipped", label: "Shipped" },
            { value: "delivered", label: "Delivered" },
            { value: "cancelled", label: "Cancelled" },
          ],
        },
        {
          type: "select",
          label: "Time Period",
          options: [
            { value: "all", label: "All Time" },
            { value: "7days", label: "Last 7 days" },
            { value: "30days", label: "Last 30 days" },
            { value: "90days", label: "Last 90 days" },
          ],
        },
        {
          type: "search",
          label: "Search by buyer",
          placeholder: "Enter buyer name...",
        },
        {
          type: "search",
          label: "Order number",
          placeholder: "Enter order number...",
        },
      ],
      "awaiting-payment": [
        {
          type: "select",
          label: "Payment Method",
          options: [
            { value: "all", label: "All Methods" },
            { value: "paypal", label: "PayPal" },
            { value: "credit-card", label: "Credit Card" },
            { value: "bank-transfer", label: "Bank Transfer" },
          ],
        },
        {
          type: "select",
          label: "Time Period",
          options: [
            { value: "all", label: "All Time" },
            { value: "7days", label: "Last 7 days" },
            { value: "30days", label: "Last 30 days" },
          ],
        },
        {
          type: "search",
          label: "Search buyer",
          placeholder: "Buyer name...",
        },
      ],
      "awaiting-shipment": [
        {
          type: "select",
          label: "Shipping Method",
          options: [
            { value: "all", label: "All Methods" },
            { value: "standard", label: "Standard" },
            { value: "express", label: "Express" },
          ],
        },
        {
          type: "select",
          label: "Priority",
          options: [
            { value: "all", label: "All Orders" },
            { value: "urgent", label: "Urgent (Same Day)" },
            { value: "normal", label: "Normal" },
          ],
        },
        {
          type: "search",
          label: "Search order",
          placeholder: "Order number...",
        },
      ],
      "paid-shipped": [
        {
          type: "select",
          label: "Status",
          options: [
            { value: "all", label: "All" },
            { value: "shipped", label: "Shipped" },
            { value: "delivered", label: "Delivered" },
          ],
        },
        {
          type: "select",
          label: "Shipping Method",
          options: [
            { value: "all", label: "All Methods" },
            { value: "standard", label: "Standard" },
            { value: "express", label: "Express" },
          ],
        },
        {
          type: "search",
          label: "Tracking Number",
          placeholder: "Enter tracking number...",
        },
      ],
      cancellations: [
        {
          type: "select",
          label: "Cancel Reason",
          options: [
            { value: "all", label: "All Reasons" },
            { value: "customer-request", label: "Customer Request" },
            { value: "out-of-stock", label: "Out of Stock" },
            { value: "pricing-error", label: "Pricing Error" },
            { value: "other", label: "Other" },
          ],
        },
        {
          type: "select",
          label: "Time Period",
          options: [
            { value: "all", label: "All Time" },
            { value: "7days", label: "Last 7 days" },
            { value: "30days", label: "Last 30 days" },
          ],
        },
        {
          type: "search",
          label: "Search order",
          placeholder: "Order number...",
        },
      ],
      returns: [
        {
          type: "select",
          label: "Return Status",
          options: [
            { value: "all", label: "All Returns" },
            { value: "requested", label: "Requested" },
            { value: "approved", label: "Approved" },
            { value: "completed", label: "Completed" },
          ],
        },
        {
          type: "search",
          label: "Search order",
          placeholder: "Order number...",
        },
      ],
      disputes: [
        {
          type: "select",
          label: "Dispute Type",
          options: [
            { value: "all", label: "All Disputes" },
            { value: "item-not-received", label: "Item Not Received" },
            { value: "item-not-described", label: "Item Not As Described" },
            { value: "return-request", label: "Return Request" },
          ],
        },
        {
          type: "select",
          label: "Status",
          options: [
            { value: "all", label: "All Status" },
            { value: "open", label: "Open" },
            { value: "closed", label: "Closed" },
          ],
        },
        {
          type: "search",
          label: "Search case",
          placeholder: "Case ID...",
        },
      ],
    },
    listings: {
      "all-listings": [
        {
          type: "select",
          label: "Status",
          options: [
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "paused", label: "Paused" },
            { value: "out-of-stock", label: "Out of Stock" },
            { value: "draft", label: "Draft" },
          ],
        },
        {
          type: "select",
          label: "Category",
          options: [
            { value: "all", label: "All Categories" },
            { value: "electronics", label: "Electronics" },
            { value: "gaming", label: "Gaming" },
            { value: "fashion", label: "Fashion" },
            { value: "home", label: "Home & Garden" },
          ],
        },
        {
          type: "select",
          label: "Price Range",
          options: [
            { value: "all", label: "All Prices" },
            { value: "0-100", label: "$0 - $100" },
            { value: "100-500", label: "$100 - $500" },
            { value: "500-1000", label: "$500 - $1,000" },
            { value: "1000-5000", label: "$1,000+" },
          ],
        },
        {
          type: "search",
          label: "Search listings",
          placeholder: "Product name, SKU, or tags...",
        },
      ],
      "active-listings": [
        {
          type: "select",
          label: "Category",
          options: [
            { value: "all", label: "All Categories" },
            { value: "electronics", label: "Electronics" },
            { value: "gaming", label: "Gaming" },
            { value: "fashion", label: "Fashion" },
          ],
        },
        {
          type: "select",
          label: "Performance",
          options: [
            { value: "all", label: "All Performance" },
            { value: "high-views", label: "High Views" },
            { value: "low-conversion", label: "Low Conversion" },
            { value: "top-rated", label: "Top Rated" },
          ],
        },
        {
          type: "search",
          label: "Search active listings",
          placeholder: "Product name or SKU...",
        },
      ],
      "inactive-listings": [
        {
          type: "select",
          label: "Reason",
          options: [
            { value: "all", label: "All Reasons" },
            { value: "paused", label: "Manually Paused" },
            { value: "policy", label: "Policy Violation" },
            { value: "temporary", label: "Temporary Hold" },
          ],
        },
        {
          type: "select",
          label: "Time Period",
          options: [
            { value: "all", label: "All Time" },
            { value: "7days", label: "Last 7 days" },
            { value: "30days", label: "Last 30 days" },
          ],
        },
        {
          type: "search",
          label: "Search inactive",
          placeholder: "Product name...",
        },
      ],
      "out-of-stock": [
        {
          type: "select",
          label: "Category",
          options: [
            { value: "all", label: "All Categories" },
            { value: "electronics", label: "Electronics" },
            { value: "gaming", label: "Gaming" },
            { value: "fashion", label: "Fashion" },
          ],
        },
        {
          type: "select",
          label: "Priority",
          options: [
            { value: "all", label: "All Items" },
            { value: "high-demand", label: "High Demand" },
            { value: "low-stock-alert", label: "Low Stock Alert" },
          ],
        },
        {
          type: "search",
          label: "Search out of stock",
          placeholder: "Product name...",
        },
      ],
      "draft-listings": [
        {
          type: "select",
          label: "Completion Status",
          options: [
            { value: "all", label: "All Drafts" },
            { value: "incomplete", label: "Incomplete" },
            { value: "ready", label: "Ready to Publish" },
            { value: "needs-review", label: "Needs Review" },
          ],
        },
        {
          type: "select",
          label: "Last Modified",
          options: [
            { value: "all", label: "All Time" },
            { value: "today", label: "Today" },
            { value: "7days", label: "Last 7 days" },
            { value: "30days", label: "Last 30 days" },
          ],
        },
        {
          type: "search",
          label: "Search drafts",
          placeholder: "Draft name...",
        },
      ],
      "sold-listings": [
        {
          type: "select",
          label: "Time Period",
          options: [
            { value: "30days", label: "Last 30 days" },
            { value: "90days", label: "Last 90 days" },
            { value: "year", label: "This year" },
            { value: "all", label: "All time" },
          ],
        },
        {
          type: "select",
          label: "Sales Performance",
          options: [
            { value: "all", label: "All Performance" },
            { value: "best-sellers", label: "Best Sellers" },
            { value: "low-performers", label: "Low Performers" },
          ],
        },
        {
          type: "search",
          label: "Search sold items",
          placeholder: "Product name...",
        },
      ],
    },
    customer: {
      messages: [
        {
          type: "select",
          label: "Message Status",
          options: [
            { value: "all", label: "All Messages" },
            { value: "unread", label: "Unread" },
            { value: "replied", label: "Replied" },
            { value: "pending", label: "Pending Response" },
          ],
        },
        {
          type: "select",
          label: "Time Period",
          options: [
            { value: "all", label: "All Time" },
            { value: "today", label: "Today" },
            { value: "7days", label: "Last 7 days" },
          ],
        },
        {
          type: "search",
          label: "Search customer",
          placeholder: "Customer name...",
        },
      ],
      questions: [
        {
          type: "select",
          label: "Question Status",
          options: [
            { value: "all", label: "All Questions" },
            { value: "unanswered", label: "Unanswered" },
            { value: "answered", label: "Answered" },
          ],
        },
        {
          type: "search",
          label: "Search questions",
          placeholder: "Question or product...",
        },
      ],
      cases: [
        {
          type: "select",
          label: "Case Status",
          options: [
            { value: "all", label: "All Cases" },
            { value: "open", label: "Open" },
            { value: "closed", label: "Closed" },
            { value: "escalated", label: "Escalated" },
          ],
        },
        {
          type: "select",
          label: "Case Type",
          options: [
            { value: "all", label: "All Types" },
            { value: "return", label: "Return Request" },
            { value: "dispute", label: "Dispute" },
            { value: "complaint", label: "Complaint" },
          ],
        },
        {
          type: "search",
          label: "Search case",
          placeholder: "Case ID...",
        },
      ],
      feedback: [
        {
          type: "select",
          label: "Feedback Type",
          options: [
            { value: "all", label: "All Feedback" },
            { value: "positive", label: "Positive" },
            { value: "negative", label: "Negative" },
            { value: "neutral", label: "Neutral" },
          ],
        },
        {
          type: "search",
          label: "Search feedback",
          placeholder: "Customer or order...",
        },
      ],
      reviews: [
        {
          type: "select",
          label: "Rating",
          options: [
            { value: "all", label: "All Ratings" },
            { value: "5", label: "5 Stars" },
            { value: "4", label: "4 Stars" },
            { value: "3", label: "3 Stars" },
            { value: "2", label: "2 Stars" },
            { value: "1", label: "1 Star" },
          ],
        },
        {
          type: "search",
          label: "Search reviews",
          placeholder: "Product or customer...",
        },
      ],
    },
    payments: {
      payouts: [
        {
          type: "select",
          label: "Payout Status",
          options: [
            { value: "all", label: "All Payouts" },
            { value: "pending", label: "Pending" },
            { value: "completed", label: "Completed" },
            { value: "failed", label: "Failed" },
          ],
        },
        {
          type: "select",
          label: "Time Period",
          options: [
            { value: "30days", label: "Last 30 days" },
            { value: "90days", label: "Last 90 days" },
            { value: "year", label: "This year" },
          ],
        },
        {
          type: "search",
          label: "Search payout",
          placeholder: "Payout ID...",
        },
      ],
      transactions: [
        {
          type: "select",
          label: "Transaction Type",
          options: [
            { value: "all", label: "All Transactions" },
            { value: "sale", label: "Sales" },
            { value: "refund", label: "Refunds" },
            { value: "fee", label: "Fees" },
          ],
        },
        {
          type: "select",
          label: "Time Period",
          options: [
            { value: "30days", label: "Last 30 days" },
            { value: "90days", label: "Last 90 days" },
            { value: "year", label: "This year" },
          ],
        },
        {
          type: "search",
          label: "Search transaction",
          placeholder: "Transaction ID...",
        },
      ],
      fees: [
        {
          type: "select",
          label: "Fee Type",
          options: [
            { value: "all", label: "All Fees" },
            { value: "listing", label: "Listing Fees" },
            { value: "final-value", label: "Final Value Fees" },
            { value: "payment", label: "Payment Processing" },
          ],
        },
        {
          type: "select",
          label: "Time Period",
          options: [
            { value: "30days", label: "Last 30 days" },
            { value: "90days", label: "Last 90 days" },
            { value: "year", label: "This year" },
          ],
        },
      ],
      "tax-documents": [
        {
          type: "select",
          label: "Document Type",
          options: [
            { value: "all", label: "All Documents" },
            { value: "1099", label: "1099 Forms" },
            { value: "tax-summary", label: "Tax Summary" },
          ],
        },
        {
          type: "select",
          label: "Year",
          options: [
            { value: "2024", label: "2024" },
            { value: "2023", label: "2023" },
            { value: "2022", label: "2022" },
          ],
        },
      ],
      "payment-methods": [
        {
          type: "select",
          label: "Method Type",
          options: [
            { value: "all", label: "All Methods" },
            { value: "bank", label: "Bank Account" },
            { value: "paypal", label: "PayPal" },
            { value: "card", label: "Credit Card" },
          ],
        },
        {
          type: "select",
          label: "Status",
          options: [
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ],
        },
      ],
    },
  };

  const notifications = [
    {
      id: 1,
      title: "New order received",
      message: "Order #12345 from John Doe",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Low stock alert",
      message: "iPhone 15 Pro has only 3 items left",
      time: "1 hour ago",
      unread: true,
    },
  ];

  const handleNavigation = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "overview" || tabId === "profile") {
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
    setActiveTab("profile");
    setActiveSubTab(null);
    setProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    // Clear any stored auth tokens, user data, etc.
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    // Navigate to home/login page
    navigate("/");

    // Close the dropdown
    setProfileDropdownOpen(false);
  };

  const getCurrentFilters = () => {
    const tabFilters = filterConfigurations[activeTab];
    if (!tabFilters || !activeSubTab) return [];
    return tabFilters[activeSubTab] || [];
  };

  const showSidebar =
    activeTab !== "overview" &&
    activeTab !== "profile" &&
    sidebarNavigation[activeTab];

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
                <p className="text-2xl font-bold text-green-900">$0.00</p>
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
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last 7 days</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last 31 days</span>
                <span className="font-medium">$0.00</span>
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
                <span className="text-sm text-gray-600">Returns</span>
                <Badge variant="default">0</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="ghost"
              className="flex items-center gap-3 p-4 h-auto"
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
              <div className="ml-4 text-sm text-gray-500">
                {shopName} ({shopRating})
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Messages */}
              <Button variant="secondary" size="sm">
                Messages (0)
              </Button>

              {/* Notifications */}
              <Dropdown
                trigger={
                  <IconButton className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  </IconButton>
                }
                isOpen={notificationDropdownOpen}
                onToggle={() =>
                  setNotificationDropdownOpen(!notificationDropdownOpen)
                }
                className="w-80"
              >
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                        notification.unread ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
              </Dropdown>

              {/* Profile Dropdown */}
              <Dropdown
                trigger={
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-3 p-2"
                  >
                    <Avatar size="sm" fallback="U" />
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </Button>
                }
                isOpen={profileDropdownOpen}
                onToggle={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-48"
              >
                <div className="py-2">
                  <button
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={handleProfileNavigation}
                  >
                    <User className="mr-3 h-4 w-4" />
                    Profile
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Log out
                  </button>
                </div>
              </Dropdown>
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

              {/* Profile Management - Constrained Width, No Sidebar */}
              {activeTab === "profile" && (
                <div className="py-8">
                  <div className="max-w-7/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <ProfileManagement />
                  </div>
                </div>
              )}

              {/* Other tabs content - With Sidebar */}
              {activeTab !== "overview" && activeTab !== "profile" && (
                <div className="space-y-0">
                  {/* Filter Bar - Show for all sections with filters */}
                  {activeSubTab && getCurrentFilters().length > 0 && (
                    <FilterBar filters={getCurrentFilters()} />
                  )}

                  <div className="px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                      {/* Orders Management */}
                      {activeTab === "orders" && activeSubTab && (
                        <OrderManagement activeSection={activeSubTab} />
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
                                {activeTab === "customer" && (
                                  <Users className="h-16 w-16 mx-auto" />
                                )}
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
                                  ? "We didn't find any results. Try adjusting your filters."
                                  : "Choose an option from the sidebar to get started."}
                              </p>
                            </CardContent>
                          </Card>
                        </>
                      )}

                      {/* Listings Management */}
                      {activeTab === "listings" && activeSubTab && (
                        <ListingManagement activeSection={activeSubTab} />
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
