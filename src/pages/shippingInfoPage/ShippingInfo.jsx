/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Truck,
  Package,
  Globe,
  Clock,
  Shield,
  MapPin,
  Calculator,
  Zap,
  Heart,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  Plane,
  Ship,
  Home,
  Building,
  Search,
  Calendar,
  CreditCard,
  Gift,
  ArrowRight,
  Phone,
  Mail,
  MessageSquare,
  Users,
  Award,
  Target,
  DollarSign,
  Timer,
  Box,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  Button,
  Badge,
  ContactCard as Card,
  Input,
  Select,
} from "../../components/ui/ContactUis/Uis";

const ShippingInfo = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [openFaq, setOpenFaq] = useState({});
  const [trackingNumber, setTrackingNumber] = useState("");

  const shippingMethods = [
    {
      id: "standard",
      name: "Standard Shipping",
      icon: Package,
      description: "Reliable delivery for everyday orders",
      time: "5-7 Business Days",
      cost: "$5.99",
      freeThreshold: "$75",
      features: [
        "Order tracking",
        "Delivery confirmation",
        "Lost package protection",
      ],
      color: "blue",
    },
    {
      id: "express",
      name: "Express Shipping",
      icon: Zap,
      description: "Fast delivery when you need it quickly",
      time: "2-3 Business Days",
      cost: "$12.99",
      freeThreshold: "$150",
      features: [
        "Priority handling",
        "Real-time tracking",
        "Guaranteed delivery",
      ],
      color: "purple",
    },
    {
      id: "overnight",
      name: "Overnight Express",
      icon: Plane,
      description: "Next business day delivery",
      time: "1 Business Day",
      cost: "$24.99",
      freeThreshold: "$300",
      features: [
        "Next-day delivery",
        "Morning delivery option",
        "Signature required",
      ],
      color: "green",
    },
    {
      id: "weekend",
      name: "Weekend Delivery",
      icon: Calendar,
      description: "Saturday and Sunday delivery available",
      time: "Weekend Days",
      cost: "+$8.99",
      freeThreshold: "Add-on only",
      features: [
        "Weekend delivery",
        "Flexible scheduling",
        "SMS notifications",
      ],
      color: "indigo",
    },
  ];

  const deliveryZones = [
    {
      zone: "Local Metro Area",
      areas: ["Same city delivery", "Metropolitan areas"],
      timeframe: "1-2 Business Days",
      cost: "$3.99",
      icon: Home,
      color: "green",
    },
    {
      zone: "Regional",
      areas: ["Within state", "Neighboring states"],
      timeframe: "2-4 Business Days",
      cost: "$5.99",
      icon: MapPin,
      color: "blue",
    },
    {
      zone: "National",
      areas: ["Nationwide coverage", "All 50 states"],
      timeframe: "3-7 Business Days",
      cost: "$7.99",
      icon: Building,
      color: "purple",
    },
    {
      zone: "International",
      areas: ["50+ countries", "Global delivery"],
      timeframe: "7-21 Business Days",
      cost: "Varies by location",
      icon: Globe,
      color: "indigo",
    },
  ];

  const internationalCountries = [
    { code: "CA", name: "Canada", time: "7-10 days", cost: "$15.99" },
    { code: "UK", name: "United Kingdom", time: "10-14 days", cost: "$19.99" },
    { code: "AU", name: "Australia", time: "12-18 days", cost: "$24.99" },
    { code: "DE", name: "Germany", time: "10-14 days", cost: "$22.99" },
    { code: "JP", name: "Japan", time: "8-12 days", cost: "$26.99" },
    { code: "FR", name: "France", time: "10-14 days", cost: "$21.99" },
  ];

  const specialItems = [
    {
      type: "Large Items",
      description: "Furniture, appliances, and oversized products",
      icon: Box,
      details: [
        "White glove delivery available",
        "Curbside or in-home placement",
        "Additional fees may apply",
        "Appointment scheduling required",
      ],
      cost: "Starting at $49.99",
    },
    {
      type: "Fragile Items",
      description: "Electronics, glassware, and delicate products",
      icon: Shield,
      details: [
        "Extra protective packaging",
        "Signature required on delivery",
        "Insurance included",
        "Handle with care labeling",
      ],
      cost: "Additional $4.99",
    },
    {
      type: "Hazardous Materials",
      description: "Batteries, chemicals, and restricted items",
      icon: AlertCircle,
      details: [
        "Ground shipping only",
        "Extended delivery times",
        "Special handling fees",
        "Compliance documentation",
      ],
      cost: "Additional $9.99",
    },
  ];

  const shippingFaqs = [
    {
      question: "When will my order ship?",
      answer:
        "Most orders ship within 1-2 business days. Orders placed before 2 PM EST on weekdays typically ship the same day. Weekend orders ship on the next business day.",
    },
    {
      question: "How can I track my package?",
      answer:
        "Once your order ships, you'll receive a tracking number via email and SMS. You can track your package on our website or directly on the carrier's website.",
    },
    {
      question: "What if my package is lost or damaged?",
      answer:
        "All shipments include protection against loss and damage. Contact our support team within 48 hours of delivery if you experience any issues, and we'll resolve it immediately.",
    },
    {
      question: "Can I change my shipping address after ordering?",
      answer:
        "Shipping addresses can be changed within 1 hour of placing your order. After this time, please contact our support team - we'll do our best to accommodate changes before shipment.",
    },
    {
      question: "Do you ship to P.O. Boxes?",
      answer:
        "We ship to P.O. Boxes for standard shipping only. Express and overnight deliveries require a physical address. Some large items cannot be delivered to P.O. Boxes.",
    },
    {
      question: "What about customs and duties for international orders?",
      answer:
        "International customers are responsible for customs duties, taxes, and any additional fees imposed by their country. These fees are not included in our shipping costs.",
    },
  ];

  const stats = [
    {
      icon: Package,
      number: "1M+",
      label: "Orders Delivered",
      subtitle: "Successfully worldwide",
    },
    {
      icon: Clock,
      number: "99.2%",
      label: "On-Time Delivery",
      subtitle: "Reliable service",
    },
    {
      icon: Globe,
      number: "50+",
      label: "Countries Served",
      subtitle: "Global reach",
    },
    {
      icon: Award,
      number: "4.9/5",
      label: "Customer Rating",
      subtitle: "Shipping satisfaction",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaq((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleTrackOrder = () => {
    if (trackingNumber.trim()) {
      navigate(`/track-parcel?number=${trackingNumber}`);
    }
  };

  const handleContactSupport = () => {
    navigate("/contact-us");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge
              variant="primary"
              size="lg"
              className="mb-6"
              icon={<Truck size={16} />}
            >
              Shipping Information
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Fast, Reliable
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Worldwide Delivery
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Get your orders delivered quickly and safely with our
              comprehensive shipping options. From same-day local delivery to
              international shipping, we've got you covered.
            </p>

            {/* Track Order */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Enter tracking number..."
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  icon={<Search size={20} />}
                  size="lg"
                  className="bg-white/90 backdrop-blur-sm border-white/20 text-gray-800 flex-grow"
                />
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleTrackOrder}
                  className="flex items-center space-x-2"
                >
                  <Package size={20} />
                  <span>Track Order</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <Card shadow="xl" hover={false} className="mb-16">
          <Card.Body>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div key={index} className="text-center group cursor-pointer">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full w-fit mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <StatIcon size={28} className="text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-gray-700 font-medium mb-1">
                      {stat.label}
                    </div>
                    <div className="text-sm text-gray-500">{stat.subtitle}</div>
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Shipping Methods */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="info" className="mb-4" icon={<Truck size={16} />}>
              Shipping Options
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Delivery Speed
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From budget-friendly standard shipping to lightning-fast overnight
              delivery, we have options that fit your timeline and budget.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {shippingMethods.map((method) => {
              const MethodIcon = method.icon;
              return (
                <Card key={method.id} shadow="lg" hover className="group">
                  <Card.Body className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-3 bg-${method.color}-100 rounded-full group-hover:scale-110 transition-transform duration-300`}
                      >
                        <MethodIcon
                          size={24}
                          className={`text-${method.color}-600`}
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {method.name}
                          </h3>
                          <Badge variant={method.color} size="lg">
                            {method.cost}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">
                          {method.description}
                        </p>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock size={16} className="mr-2" />
                            <span>{method.time}</span>
                          </div>
                          <div className="flex items-center text-sm text-green-600">
                            <Gift size={16} className="mr-2" />
                            <span>Free over {method.freeThreshold}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {method.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center text-sm text-gray-600"
                            >
                              <CheckCircle
                                size={14}
                                className="mr-2 text-green-500"
                              />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Delivery Zones */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge
              variant="success"
              className="mb-4"
              icon={<MapPin size={16} />}
            >
              Delivery Areas
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              We Deliver Everywhere
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From local same-day delivery to international shipping, we reach
              customers wherever they are.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryZones.map((zone, index) => {
              const ZoneIcon = zone.icon;
              return (
                <Card
                  key={index}
                  shadow="lg"
                  hover
                  className="text-center group"
                >
                  <Card.Body className="p-6">
                    <div
                      className={`p-4 bg-${zone.color}-100 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <ZoneIcon
                        size={32}
                        className={`text-${zone.color}-600`}
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {zone.zone}
                    </h3>
                    <div className="space-y-1 mb-4">
                      {zone.areas.map((area, i) => (
                        <p key={i} className="text-sm text-gray-600">
                          {area}
                        </p>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center text-sm">
                        <Clock size={14} className="mr-2 text-gray-500" />
                        <span className="text-gray-700">{zone.timeframe}</span>
                      </div>
                      <Badge variant={zone.color} size="sm">
                        {zone.cost}
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </div>

        {/* International Shipping */}
        <div className="mb-16">
          <Card
            shadow="xl"
            hover={false}
            className="bg-gradient-to-br from-blue-50 to-purple-50"
          >
            <Card.Body className="p-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Globe size={32} className="text-blue-600" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    International Shipping
                  </h3>
                </div>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  We ship to over 50 countries worldwide with competitive rates
                  and reliable delivery times.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {internationalCountries.map((country, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 text-center"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {country.name}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center justify-center">
                        <Clock size={14} className="mr-2" />
                        <span>{country.time}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <DollarSign size={14} className="mr-2" />
                        <span>{country.cost}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Badge variant="info" icon={<Info size={16} />}>
                  Customs duties and taxes may apply for international orders
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Special Items */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="warning" className="mb-4" icon={<Box size={16} />}>
              Special Handling
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Special Item Shipping
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Some items require special handling and delivery procedures.
              Here's what you need to know about shipping unique products.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {specialItems.map((item, index) => {
              const ItemIcon = item.icon;
              return (
                <Card key={index} shadow="lg" hover className="group">
                  <Card.Body className="p-6">
                    <div className="text-center mb-4">
                      <div className="p-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-full w-fit mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                        <ItemIcon size={32} className="text-orange-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {item.type}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {item.description}
                      </p>
                    </div>

                    <div className="space-y-2 mb-4">
                      {item.details.map((detail, i) => (
                        <div
                          key={i}
                          className="flex items-start text-sm text-gray-600"
                        >
                          <CheckCircle
                            size={14}
                            className="mr-2 text-green-500 mt-0.5 flex-shrink-0"
                          />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-center">
                      <Badge variant="warning" size="sm">
                        {item.cost}
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Shipping FAQs */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge
              variant="purple"
              className="mb-4"
              icon={<HelpCircle size={16} />}
            >
              Frequently Asked Questions
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shipping Questions Answered
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find quick answers to the most common shipping and delivery
              questions.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {shippingFaqs.map((faq, index) => (
              <Card key={index} shadow="lg" hover={false}>
                <div
                  className="cursor-pointer"
                  onClick={() => toggleFaq(index)}
                >
                  <div className="flex items-center justify-between p-6">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openFaq[index] ? (
                        <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </div>
                  </div>
                  {openFaq[index] && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <Card
        shadow="xl"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100"
        hover={false}
      >
        <Card.Body className="py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Truck size={32} className="text-blue-500" />
              <h3 className="text-3xl font-bold text-gray-900">
                Still Have Questions?
              </h3>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Our shipping specialists are here to help with any questions about
              delivery options, tracking, or special shipping requirements.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleContactSupport}
                className="flex items-center space-x-2"
              >
                <MessageSquare size={20} />
                <span>Contact Support</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/products")}
                className="flex items-center space-x-2"
              >
                <Package size={20} />
                <span>Start Shopping</span>
                <ArrowRight size={20} />
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center text-gray-600">
                <Phone size={16} className="mr-2" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail size={16} className="mr-2" />
                <span>shipping@emmover.com</span>
              </div>
              <Badge variant="primary" size="lg" icon={<Clock size={16} />}>
                24/7 Support Available
              </Badge>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ShippingInfo;
