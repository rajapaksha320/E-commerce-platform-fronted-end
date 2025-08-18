import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ShoppingBag,
  RefreshCw,
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

const ContactUsPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    orderNumber: "",
    category: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // EmailJS integration function
  const sendEmailToAdmin = async (formData) => {
    try {
      // Load EmailJS if not already loaded
      if (typeof window.emailjs === "undefined") {
        // Load EmailJS script
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
        document.head.appendChild(script);

        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      //  Public Key Email js
      window.emailjs.init("MmCkj2k0KfXCCHeMO"); 

      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        inquiry_type: formData.category,
        order_number: formData.orderNumber || "N/A",
        timestamp: new Date().toLocaleString(),
        to_email: "admin@emmover.com", // Your admin email
      };

      // Send email using EmailJS
      const result = await window.emailjs.send(
        "service_99nawzm",
        "template_anml6ne",
        templateParams
      );

      console.log("Email sent successfully:", result);
      return { success: true };
    } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, error: error.message };
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = await sendEmailToAdmin(formData);

      if (result.success) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          orderNumber: "",
          category: "general",
          message: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  // Direct to FAQs page
  const handleFAQs = () => {
    navigate("/faqs");
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "support@emmover.com",
      details: "Response within 24 hours",
      color: "text-blue-600",
      badge: { variant: "primary", text: "24h Response" },
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "+1 (555) 123-4567",
      details: "Mon-Fri, 9AM-6PM EST",
      color: "text-green-600",
      badge: { variant: "success", text: "Live Support" },
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our team",
      details: "Available 24/7",
      color: "text-purple-600",
      badge: { variant: "purple", text: "24/7 Available" },
    },
  ];

  const supportCategories = [
    {
      icon: ShoppingBag,
      title: "Order Inquiries",
      description: "Track orders, shipping updates, delivery questions",
      badge: { variant: "primary", text: "Orders" },
    },
    {
      icon: RefreshCw,
      title: "Returns & Exchanges",
      description: "Return policy, exchange process, refund status",
      badge: { variant: "warning", text: "Returns" },
    },
    {
      icon: Star,
      title: "Product Support",
      description: "Product questions, recommendations, technical help",
      badge: { variant: "success", text: "Products" },
    },
  ];

  const inquiryOptions = [
    { value: "general", label: "General Inquiry" },
    { value: "order", label: "Order Support" },
    { value: "return", label: "Returns & Exchanges" },
    { value: "product", label: "Product Question" },
    { value: "billing", label: "Billing Issue" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Get in Touch with Emmover
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We're here to help with your orders, questions, and everything in
              between. Your satisfaction is our priority at Emmover.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method, index) => (
            <Card
              key={index}
              shadow="xl"
              hover={false}
              className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div
                    className={`p-3 rounded-full bg-gray-50 ${method.color}`}
                  >
                    <method.icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold ml-4">{method.title}</h3>
                </div>
                <Badge variant={method.badge.variant} size="sm">
                  {method.badge.text}
                </Badge>
              </div>
              <p className="text-gray-900 font-medium mb-2">
                {method.description}
              </p>
              <p className="text-gray-600 text-sm">{method.details}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <Card shadow="xl" hover={false}>
            <Card.Header>
              <h2 className="text-3xl font-bold text-gray-900">
                Send us a Message
              </h2>
            </Card.Header>

            <Card.Body>
              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <Badge variant="success" icon={<Star size={12} />}>
                      Success
                    </Badge>
                    <p className="text-green-800 font-medium ml-3">
                      Thank you! Your message has been sent successfully to
                      Emmover. We'll get back to you soon.
                    </p>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <Badge variant="warning">Error</Badge>
                    <p className="text-red-800 font-medium ml-3">
                      Sorry, there was an error sending your message. Please try
                      again or contact us directly.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Select
                    label="Inquiry Type"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    options={inquiryOptions}
                    placeholder="Select inquiry type"
                  />
                  <Input
                    label="Order Number (Optional)"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleInputChange}
                    placeholder="#12345"
                  />
                </div>

                <Input
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="How can we help you?"
                  required
                />

                <Textarea
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Please provide details about your inquiry..."
                  rows={6}
                  required
                />

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  size="lg"
                  className="w-full"
                >
                  <Send size={20} className="mr-2" />
                  Send Message to Emmover
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Support Information */}
          <div className="space-y-8">
            {/* Support Categories */}
            <Card shadow="xl" hover={false}>
              <Card.Header>
                <h3 className="text-2xl font-bold text-gray-900">
                  How Can Emmover Help?
                </h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-6">
                  {supportCategories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <category.icon size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {category.title}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {category.description}
                          </p>
                        </div>
                      </div>
                      <Badge variant={category.badge.variant} size="sm">
                        {category.badge.text}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Business Info */}
            <Card shadow="xl" hover={false}>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Visit Emmover Store
                  </h3>
                  <Badge variant="info" icon={<MapPin size={12} />}>
                    Physical Location
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin size={20} className="text-gray-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">
                        123 Emmover Commerce Street
                      </p>
                      <p className="text-gray-600">New York, NY 10001</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock size={20} className="text-gray-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Store Hours</p>
                      <p className="text-gray-600">Mon-Sat: 10AM-8PM</p>
                      <p className="text-gray-600">Sunday: 12PM-6PM</p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* FAQ Card */}
            <Card
              shadow="lg"
              className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100"
              hover={false}
            >
              <Card.Header>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    Need Quick Answers?
                  </h3>
                  <Badge variant="primary">FAQ</Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <p className="text-gray-600 mb-6">
                  Check out our FAQ section for instant answers to common
                  questions about Emmover orders, shipping, returns, and more.
                </p>
                <Button variant="outline" size="md" onClick={handleFAQs}>
                  View Emmover FAQ
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
