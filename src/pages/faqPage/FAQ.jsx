/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Package,
  CreditCard,
  Truck,
  RefreshCw,
  Shield,
  Headphones,
  Clock,
  Star,
} from "lucide-react";

import {
  Button,
  Badge,
  ContactCard as Card,
  Input,
  Select,
  Textarea,
} from "../../components/ui/ContactUis/Uis";


import Pagination from "../../components/ui/ContactUis/Pagination"; 

// FAQ Item Component
const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  return (
    <Card hover={false} shadow="sm" className="mb-4">
      <div className="cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between p-6">
          <h3 className="text-lg font-semibold text-gray-900 pr-4">
            {question}
          </h3>
          <div className="flex-shrink-0">
            {isOpen ? (
              <ChevronUp size={20} className="text-gray-500" />
            ) : (
              <ChevronDown size={20} className="text-gray-500" />
            )}
          </div>
        </div>
        {isOpen && (
          <div className="px-6 pb-6 pt-0">
            <div className="text-gray-600 leading-relaxed">{answer}</div>
          </div>
        )}
      </div>
    </Card>
  );
};

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of FAQs per page
  const navigate = useNavigate();

  // Direct to ContactUs page
  const handleContactUs = () => {
    navigate("/contact-us");
  };

  const toggleFAQItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setOpenItems({}); // Close all open items when changing pages
    // Scroll to top of FAQ section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset to first page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
    setOpenItems({});
  }, [searchTerm, selectedCategory]);

  const categories = [
    { id: "all", name: "All Questions", icon: Star, badge: "primary" },
    { id: "orders", name: "Orders", icon: Package, badge: "info" },
    { id: "shipping", name: "Shipping", icon: Truck, badge: "success" },
    { id: "returns", name: "Returns", icon: RefreshCw, badge: "warning" },
    { id: "payment", name: "Payment", icon: CreditCard, badge: "purple" },
    { id: "account", name: "Account", icon: Shield, badge: "indigo" },
    { id: "support", name: "Support", icon: Headphones, badge: "pink" },
  ];

  const faqData = [
    {
      category: "orders",
      question: "How do I track my order?",
      answer:
        "You can track your order by logging into your account and visiting the \"My Orders\" section. You'll also receive a tracking number via email once your order ships. Simply click the tracking link or enter the number on our shipping partner's website.",
    },
    {
      category: "orders",
      question: "Can I modify or cancel my order after placing it?",
      answer:
        "Orders can be modified or cancelled within 1 hour of placement. After this time, your order enters our fulfillment process and cannot be changed. Please contact our support team immediately if you need to make changes.",
    },
    {
      category: "orders",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and Buy Now Pay Later options through Klarna and Afterpay.",
    },
    {
      category: "shipping",
      question: "What are your shipping options and costs?",
      answer:
        "We offer several shipping options: Standard (5-7 business days, $5.99), Express (2-3 business days, $12.99), and Overnight ($24.99). Free standard shipping is available on orders over $75.",
    },
    {
      category: "shipping",
      question: "Do you ship internationally?",
      answer:
        "Yes! We ship to over 50 countries worldwide. International shipping costs vary by location and typically take 7-14 business days. Customs duties and taxes may apply and are the responsibility of the customer.",
    },
    {
      category: "shipping",
      question: "What if my package is lost or damaged?",
      answer:
        "If your package is lost during transit, we'll work with our shipping partners to locate it. If it cannot be found after 14 days, we'll send a replacement or provide a full refund. For damaged packages, please contact us within 48 hours of delivery with photos.",
    },
    {
      category: "returns",
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Return shipping is free for defective items, otherwise a $5.99 return shipping fee applies. Refunds are processed within 5-7 business days.",
    },
    {
      category: "returns",
      question: "How do I initiate a return?",
      answer:
        'To start a return, log into your account and select "Return Item" next to the product you wish to return. Print the prepaid return label and drop off your package at any authorized shipping location.',
    },
    {
      category: "returns",
      question: "Can I exchange an item instead of returning it?",
      answer:
        'Yes! During the return process, you can select "Exchange" and choose a different size or color. Exchanges are processed faster than returns and typically ship within 2-3 business days of receiving your original item.',
    },
    {
      category: "payment",
      question: "Is my payment information secure?",
      answer:
        "Absolutely. We use industry-standard SSL encryption and are PCI DSS compliant. Your payment information is never stored on our servers and is processed through secure payment gateways like Stripe and PayPal.",
    },
    {
      category: "payment",
      question: "When will I be charged for my order?",
      answer:
        "Your payment method is charged immediately when you place your order. For pre-orders or backordered items, you'll be charged when the item ships. Buy Now Pay Later options have different payment schedules as outlined by each provider.",
    },
    {
      category: "account",
      question: "How do I create an account?",
      answer:
        'You can create an account during checkout or by clicking "Sign Up" in the top right corner of our website. You\'ll need to provide your email address and create a password. Account creation is optional but recommended for order tracking and faster checkout.',
    },
    {
      category: "account",
      question: "I forgot my password. How do I reset it?",
      answer:
        "Click \"Forgot Password\" on the login page and enter your email address. We'll send you a secure link to reset your password. If you don't receive the email within 10 minutes, check your spam folder or contact support.",
    },
    {
      category: "support",
      question: "How can I contact customer support?",
      answer:
        "You can reach our support team via email at support@yourstore.com, phone at (555) 123-4567 (Mon-Fri 9AM-6PM EST), or live chat on our website (available 24/7). We typically respond to emails within 24 hours.",
    },
    {
      category: "support",
      question: "Do you offer price matching?",
      answer:
        "Yes! We offer price matching for identical items from authorized retailers. The item must be in stock and the competitor's price must be verifiable. Contact our support team with the competitor's URL and we'll match the price.",
    },
    // Adding a few more FAQs to demonstrate pagination better
    {
      category: "orders",
      question: "How long does order processing take?",
      answer:
        "Most orders are processed within 1-2 business days. During peak seasons or sales events, processing may take up to 3-4 business days. You'll receive a confirmation email once your order has been processed and shipped.",
    },
    {
      category: "shipping",
      question: "Can I change my shipping address after placing an order?",
      answer:
        "Shipping addresses can only be changed within 1 hour of placing your order and only if the order hasn't entered fulfillment. Please contact our support team immediately if you need to update your shipping address.",
    },
    {
      category: "returns",
      question: "What items cannot be returned?",
      answer:
        "The following items cannot be returned: personalized or custom items, perishable goods, digital downloads, intimate apparel, and items marked as final sale. Gift cards are also non-returnable.",
    },
    {
      category: "payment",
      question: "Can I use multiple payment methods for one order?",
      answer:
        "Currently, we only accept one payment method per order. However, you can use gift cards in combination with another payment method to complete your purchase.",
    },
    {
      category: "account",
      question: "How do I update my account information?",
      answer:
        'You can update your account information by logging in and visiting the "Account Settings" section. Here you can change your email, password, shipping addresses, and communication preferences.',
    },
    {
      category: "support",
      question: "What are your customer service hours?",
      answer:
        "Our customer service team is available Monday through Friday from 9 AM to 6 PM EST. Live chat support is available 24/7, and email support typically responds within 24 hours.",
    },
  ];

  // Filter FAQs based on search term and category
  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredFAQs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFAQs = filteredFAQs.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Find quick answers to common questions about orders, shipping,
              returns, and more.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <Input
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={20} />}
                size="lg"
                className="bg-white/90 backdrop-blur-sm border-white/20 text-gray-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <Card shadow="xl" hover={false} className="mb-12">
          <Card.Body>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "primary" : "ghost"
                  }
                  size="md"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2"
                >
                  <category.icon size={16} />
                  <span>{category.name}</span>
                  <Badge
                    variant={
                      selectedCategory === category.id
                        ? "indigo"
                        : category.badge
                    }
                    size="sm"
                  >
                    {
                      faqData.filter(
                        (faq) =>
                          category.id === "all" || faq.category === category.id
                      ).length
                    }
                  </Badge>
                </Button>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* FAQ Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Results Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === "all"
                  ? "All Questions"
                  : categories.find((cat) => cat.id === selectedCategory)?.name}
              </h2>
              <p className="text-gray-600 mt-1">
                {filteredFAQs.length} question
                {filteredFAQs.length !== 1 ? "s" : ""} found
                {searchTerm && ` for "${searchTerm}"`}
                {filteredFAQs.length > itemsPerPage &&
                  ` (Page ${currentPage} of ${totalPages})`}
              </p>
            </div>
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </Button>
            )}
          </div>
        </div>

        {/* FAQ Items */}
        {filteredFAQs.length > 0 ? (
          <div className="space-y-6">
            <div className="space-y-4">
              {paginatedFAQs.map((faq, index) => {
                const globalIndex = startIndex + index; // Calculate global index for unique keys
                return (
                  <FAQItem
                    key={globalIndex}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openItems[globalIndex]}
                    onToggle={() => toggleFAQItem(globalIndex)}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            {filteredFAQs.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={filteredFAQs.length}
                className="mt-8 pt-8 border-t border-gray-200"
              />
            )}
          </div>
        ) : (
          <Card shadow="lg" hover={false} className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Search size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No questions found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or browse a different category.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                View All Questions
              </Button>
            </div>
          </Card>
        )}

        {/* Still Need Help Section */}
        <Card
          shadow="xl"
          className="mt-16 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100"
          hover={false}
        >
          <Card.Header>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Headphones size={24} className="text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Still Need Help?
                </h3>
              </div>
              <Badge variant="primary" icon={<Clock size={12} />}>
                24/7 Support Available
              </Badge>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="text-center">
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Can't find what you're looking for? Our friendly support team is
                here to help you with any questions or concerns.
              </p>

              <div className="grid md:grid-cols-1 gap-6">
                <Card hover={false} shadow="sm" className="p-4">
                  <div className="text-center">
                    <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                      <Package size={20} className="text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Contact Form</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Send us a detailed message
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleContactUs}
                    >
                      Contact Us
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;
