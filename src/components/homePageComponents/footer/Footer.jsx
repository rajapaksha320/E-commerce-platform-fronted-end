import React from "react";

import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  const footerLinks = {
    company: [
      { name: "About Us", href: "/about-us" },
      { name: "Our Story", href: "/our-story" },
      // { name: "Careers", href: "/careers" },
      // { name: "Press", href: "/press" },
      { name: "Blog", href: "/blogs" },
    ],
    support: [
      { name: "Contact Us", href: "/contact-us" },
      { name: "FAQs", href: "/faqs" },
      { name: "Tracking & Returns", href: "/returns-and-refund" },
      { name: "Shipping Info", href: "/shipping-info" },
      { name: "Size Guide", href: "/size-guide" },
    ],
    sellers: [
      { name: "Become a Seller", href: "/seller-registration" },
      { name: "Seller Dashboard", href: "/seller-dashboard" },
      // { name: "Seller Resources", href: "/seller-resources" },
      // { name: "API Documentation", href: "/api-docs" },
      // { name: "Fees & Pricing", href: "/pricing" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Refund Policy", href: "/refunds" },
    ],
    // categories: [
    //   { name: "Electronics", href: "/electronics" },
    //   { name: "Fashion", href: "/fashion" },
    //   { name: "Home & Garden", href: "/home-garden" },
    //   { name: "Sports", href: "/sports" },
    //   { name: "Books", href: "/books" },
    // ],
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
              <Mail className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-6">
              Stay Updated with Emmover
            </h3>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Get the latest deals, new arrivals, and exclusive offers delivered
              to your inbox. Join our community of smart shoppers and never miss
              a great deal again.
            </p>

            {/* Newsletter Form */}
            <div className="max-w-lg mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-6 py-4 rounded-xl text-white placeholder-blue-200 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-white/30 text-lg"
                  />
                  <button className="px-8 py-4 text-lg bg-white text-blue-900 hover:bg-gray-50 hover:text-blue-800 hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold rounded-xl inline-flex items-center justify-center gap-2">
                    Subscribe
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="text-blue-200 text-sm mt-3">
                🔒 We respect your privacy. Unsubscribe at any time.
              </p>
            </div>

            {/* Newsletter Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center gap-3 text-blue-100">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <span>Exclusive deals & discounts</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-blue-100">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🔔</span>
                </div>
                <span>New arrivals first</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-blue-100">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🎁</span>
                </div>
                <span>Special member offers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Emmover
            </h2>
            <p className="text-gray-300 mb-6 max-w-md">
              Your one-stop destination for quality products from trusted shops.
              Discover amazing deals and shop with confidence.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-3 text-blue-400" />
                <span>123 Commerce Street, City, State 12345</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-3 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-3 text-blue-400" />
                <span>hello@emmover.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-200"
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Seller Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              For Sellers
            </h3>
            <ul className="space-y-3">
              {footerLinks.sellers.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Links */}
          {/* <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Categories
            </h3>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 Emmover. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {footerLinks.legal.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
