/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Target,
  Users,
  Award,
  Globe,
  Shield,
  Zap,
  Truck,
  Star,
  CheckCircle,
  ArrowRight,
  Mail,
  Clock,
  Package,
  Headphones,
  CreditCard,
  Recycle,
} from "lucide-react";

import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";

const AboutUs = () => {
  const navigate = useNavigate();

  // Direct to ContactUs page
  const handleContactUs = () => {
    navigate("/contact-us");
  };

  const handleGetStarted = () => {
    navigate("/product-collections");
  };

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description:
        "Every decision we make starts with our customers in mind. Your satisfaction drives our innovation.",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description:
        "We prioritize the security of your data and transactions with industry-leading protection.",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "We constantly evolve our platform to bring you the latest in ecommerce technology.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Connecting businesses and customers across borders with seamless international solutions.",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Recycle,
      title: "Sustainability",
      description:
        "Committed to environmentally responsible practices in everything we do.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Building strong relationships with our customers, partners, and team members.",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const features = [
    {
      icon: Package,
      title: "Premium Products",
      description:
        "Curated selection of high-quality products from trusted brands worldwide.",
    },
    {
      icon: Truck,
      title: "Fast Shipping",
      description:
        "Lightning-fast delivery with real-time tracking for peace of mind.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description:
        "Round-the-clock customer service to assist you whenever you need help.",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description:
        "Multiple payment options with bank-level security for safe transactions.",
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description:
        "Started with a vision to revolutionize online shopping experience.",
    },
    {
      year: "2021",
      title: "10K+ Customers",
      description:
        "Reached our first major milestone of serving 10,000 happy customers.",
    },
    {
      year: "2022",
      title: "Global Expansion",
      description:
        "Expanded operations to serve customers in over 25 countries.",
    },
    {
      year: "2023",
      title: "Innovation Award",
      description:
        "Recognized as 'Best Emerging Ecommerce Platform' by Industry Leaders.",
    },
    {
      year: "2024",
      title: "100K+ Products",
      description:
        "Expanded our catalog to over 100,000 products across multiple categories.",
    },
  ];

  const stats = [
    { number: "500K+", label: "Happy Customers", icon: Users },
    { number: "1M+", label: "Orders Delivered", icon: Package },
    { number: "50+", label: "Countries Served", icon: Globe },
    { number: "99.9%", label: "Uptime Guarantee", icon: Shield },
  ];

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
              icon={<Heart size={16} />}
            >
              About Emmover
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Redefining Your
              <br />
              Shopping Experience
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              We're more than just an ecommerce platform. We're your trusted
              partner in discovering amazing products, connecting with quality
              brands, and enjoying a seamless shopping journey that puts you
              first.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleGetStarted}
                className="flex items-center space-x-2"
              >
                <span>Explore Products</span>
                <ArrowRight size={20} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleContactUs}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <Card shadow="xl" hover={false} className="mb-16">
          <Card.Body>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                    <stat.icon size={24} className="text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="info" className="mb-4" icon={<Target size={16} />}>
              Our Story
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Built on Passion,
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Driven by Purpose
              </span>
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Emmover was born from a simple yet powerful idea: shopping
                online should be effortless, enjoyable, and trustworthy. Founded
                in 2020 by a team of passionate entrepreneurs, we set out to
                create more than just another ecommerce platform.
              </p>
              <p>
                We envisioned a place where customers could discover exceptional
                products, connect with amazing brands, and enjoy a shopping
                experience that truly understands their needs. Every feature we
                build, every partnership we form, and every decision we make is
                guided by this vision.
              </p>
              <p>
                Today, we're proud to serve hundreds of thousands of customers
                worldwide, but we're just getting started. Our commitment to
                innovation, quality, and customer satisfaction continues to
                drive us forward.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card shadow="lg" hover className="p-6 text-center">
              <Award size={32} className="text-purple-600 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Award Winning</h4>
              <p className="text-sm text-gray-600">
                Recognized for excellence in customer service
              </p>
            </Card>
            <Card shadow="lg" hover className="p-6 text-center">
              <CheckCircle size={32} className="text-green-600 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Trusted Platform</h4>
              <p className="text-sm text-gray-600">
                Verified secure and reliable shopping
              </p>
            </Card>
            <Card shadow="lg" hover className="p-6 text-center">
              <Globe size={32} className="text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Global Reach</h4>
              <p className="text-sm text-gray-600">
                Serving customers in 50+ countries
              </p>
            </Card>
            <Card shadow="lg" hover className="p-6 text-center">
              <Star size={32} className="text-yellow-600 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">5-Star Rated</h4>
              <p className="text-sm text-gray-600">
                Consistently high customer satisfaction
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <Badge
              variant="purple"
              className="mb-4"
              icon={<Target size={16} />}
            >
              Mission & Vision
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Drives Us Forward
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card shadow="xl" hover={false}>
              <Card.Header>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Target size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Our Mission
                  </h3>
                </div>
              </Card.Header>
              <Card.Body>
                <p className="text-gray-600 leading-relaxed">
                  To empower businesses and delight customers by providing a
                  seamless, secure, and innovative ecommerce platform that
                  connects people with the products they love. We strive to make
                  online shopping accessible, enjoyable, and trustworthy for
                  everyone, everywhere.
                </p>
              </Card.Body>
            </Card>

            <Card shadow="xl" hover={false}>
              <Card.Header>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Heart size={24} className="text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Our Vision
                  </h3>
                </div>
              </Card.Header>
              <Card.Body>
                <p className="text-gray-600 leading-relaxed">
                  To become the world's most trusted and beloved ecommerce
                  platform, where every interaction creates value, builds
                  relationships, and contributes to a more connected global
                  marketplace that benefits customers, businesses, and
                  communities alike.
                </p>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Badge variant="success" className="mb-4" icon={<Users size={16} />}>
            Our Values
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The Principles That Guide Us
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These core values shape our culture, influence our decisions, and
            define how we interact with our customers and each other.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card key={index} shadow="lg" hover className="group">
              <Card.Body>
                <div className="text-center">
                  <div
                    className={`p-4 ${value.bgColor} rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <value.icon size={32} className={value.color} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      {/* What We Offer Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <Badge
              variant="indigo"
              className="mb-4"
              icon={<Package size={16} />}
            >
              What We Offer
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Amazing Shopping
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} shadow="lg" hover className="text-center group">
                <Card.Body>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon size={32} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Badge variant="warning" className="mb-4" icon={<Clock size={16} />}>
            Our Journey
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Milestones & Achievements
          </h2>
        </div>

        <div className="space-y-8">
          {milestones.map((milestone, index) => (
            <Card key={index} shadow="lg" hover className="group">
              <Card.Body>
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full font-bold group-hover:scale-110 transition-transform duration-300">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <Card
        shadow="xl"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100"
        hover={false}
      >
        <Card.Body className="py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart size={32} className="text-red-500" />
              <h3 className="text-3xl font-bold text-gray-900">
                Ready to Join Our Community?
              </h3>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover why hundreds of thousands of customers trust Emmover for
              their shopping needs. Start your journey with us today and
              experience the difference.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleGetStarted}
                className="flex items-center space-x-2"
              >
                <Package size={20} />
                <span>Start Shopping</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleContactUs}
                className="flex items-center space-x-2"
              >
                <Mail size={20} />
                <span>Get in Touch</span>
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <Badge
                variant="primary"
                size="lg"
                icon={<Headphones size={16} />}
              >
                Questions? We're here to help 24/7
              </Badge>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AboutUs;
