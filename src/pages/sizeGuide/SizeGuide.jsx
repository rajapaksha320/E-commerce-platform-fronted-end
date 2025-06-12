import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ruler,
  Shirt,
  User,
  Footprints,
  Clock,
  Globe,
  Info,
  CheckCircle,
  ArrowLeft,
  Search,
  Calculator,
  Target,
  Award,
  Star,
  Eye,
  Zap,
  Heart,
  Package,
  Shield,
  MessageSquare,
  Phone,
  Mail,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Watch,
  Home,
  Baby,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

import {
  Button,
  Badge,
  ContactCard as Card,
  Input,
  Select,
} from "../../components/ui/ContactUis/Uis";

const SizeGuide = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("clothing");
  const [selectedRegion, setSelectedRegion] = useState("US");
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaq, setOpenFaq] = useState({});

  const categories = [
    {
      id: "clothing",
      name: "Clothing",
      icon: Shirt,
      description: "Shirts, pants, dresses & jackets",
      color: "blue",
    },
    {
      id: "shoes",
      name: "Shoes",
      icon: Footprints,
      description: "Sneakers, boots & formal shoes",
      color: "purple",
    },
    {
      id: "accessories",
      name: "Accessories",
      icon: Watch,
      description: "Watches, belts & jewelry",
      color: "green",
    },
    {
      id: "electronics",
      name: "Electronics",
      icon: Smartphone,
      description: "Phone cases & device accessories",
      color: "indigo",
    },
    {
      id: "home",
      name: "Home & Living",
      icon: Home,
      description: "Furniture & home decor",
      color: "yellow",
    },
    {
      id: "kids",
      name: "Kids & Baby",
      icon: Baby,
      description: "Children clothing & accessories",
      color: "pink",
    },
  ];

  const regions = [
    { code: "US", name: "United States" },
    { code: "EU", name: "Europe" },
    { code: "UK", name: "United Kingdom" },
    { code: "JP", name: "Japan" },
    { code: "CN", name: "China" },
    { code: "INT", name: "International" },
  ];

  // Clothing size charts
  const clothingSizes = {
    men: {
      shirts: {
        headers: ["Size", "Chest (in)", "Waist (in)", "Length (in)"],
        rows: [
          ["XS", "32-34", "28-30", "25"],
          ["S", "34-36", "30-32", "26"],
          ["M", "36-38", "32-34", "27"],
          ["L", "38-40", "34-36", "28"],
          ["XL", "40-42", "36-38", "29"],
          ["XXL", "42-44", "38-40", "30"],
          ["XXXL", "44-46", "40-42", "31"],
        ],
      },
      pants: {
        headers: ["Size", "Waist (in)", "Hip (in)", "Inseam (in)"],
        rows: [
          ["28", "28", "34", "30-34"],
          ["30", "30", "36", "30-34"],
          ["32", "32", "38", "30-34"],
          ["34", "34", "40", "30-34"],
          ["36", "36", "42", "30-34"],
          ["38", "38", "44", "30-34"],
          ["40", "40", "46", "30-34"],
        ],
      },
    },
    women: {
      tops: {
        headers: ["Size", "Bust (in)", "Waist (in)", "Hip (in)"],
        rows: [
          ["XS", "30-32", "24-26", "34-36"],
          ["S", "32-34", "26-28", "36-38"],
          ["M", "34-36", "28-30", "38-40"],
          ["L", "36-38", "30-32", "40-42"],
          ["XL", "38-40", "32-34", "42-44"],
          ["XXL", "40-42", "34-36", "44-46"],
        ],
      },
      dresses: {
        headers: ["Size", "Bust (in)", "Waist (in)", "Hip (in)", "Length (in)"],
        rows: [
          ["XS", "30-32", "24-26", "34-36", "35"],
          ["S", "32-34", "26-28", "36-38", "36"],
          ["M", "34-36", "28-30", "38-40", "37"],
          ["L", "36-38", "30-32", "40-42", "38"],
          ["XL", "38-40", "32-34", "42-44", "39"],
          ["XXL", "40-42", "34-36", "44-46", "40"],
        ],
      },
    },
  };

  const shoeSizes = {
    headers: ["US Men", "US Women", "EU", "UK", "Length (cm)"],
    rows: [
      ["6", "7.5", "39", "5.5", "24.1"],
      ["6.5", "8", "39.5", "6", "24.5"],
      ["7", "8.5", "40", "6.5", "25.0"],
      ["7.5", "9", "40.5", "7", "25.4"],
      ["8", "9.5", "41", "7.5", "25.9"],
      ["8.5", "10", "42", "8", "26.2"],
      ["9", "10.5", "42.5", "8.5", "26.7"],
      ["9.5", "11", "43", "9", "27.1"],
      ["10", "11.5", "44", "9.5", "27.6"],
      ["10.5", "12", "44.5", "10", "28.0"],
      ["11", "12.5", "45", "10.5", "28.4"],
      ["11.5", "13", "45.5", "11", "28.9"],
      ["12", "13.5", "46", "11.5", "29.3"],
    ],
  };

  const measurementGuides = [
    {
      title: "How to Measure Chest/Bust",
      icon: User,
      steps: [
        "Stand straight with arms relaxed at your sides",
        "Wrap measuring tape around the fullest part of your chest/bust",
        "Keep the tape parallel to the floor",
        "Breathe normally and take the measurement",
      ],
      image: "📏",
      tip: "For best results, have someone else take the measurement",
    },
    {
      title: "How to Measure Waist",
      icon: Target,
      steps: [
        "Find your natural waistline (smallest part of your torso)",
        "Wrap measuring tape around your waist",
        "Keep the tape snug but not tight",
        "Make sure the tape is level all around",
      ],
      image: "⚖️",
      tip: "Your natural waist is usually about 1-2 inches above your belly button",
    },
    {
      title: "How to Measure Hips",
      icon: Calculator,
      steps: [
        "Stand with feet together",
        "Measure around the fullest part of your hips",
        "Keep measuring tape parallel to the floor",
        "Ensure tape is snug but not compressing",
      ],
      image: "📐",
      tip: "The fullest part is usually 7-9 inches below your natural waist",
    },
    {
      title: "How to Measure Foot Length",
      icon: Footprints,
      steps: [
        "Place foot on a piece of paper against a wall",
        "Mark the longest toe and heel on the paper",
        "Measure the distance between the marks",
        "Repeat for both feet and use the larger measurement",
      ],
      image: "👟",
      tip: "Measure feet at the end of the day when they are largest",
    },
  ];

  const sizingTips = [
    {
      icon: Clock,
      title: "Measure at the Right Time",
      description:
        "Take measurements at the end of the day when your body is at its largest for the most accurate fit.",
    },
    {
      icon: Eye,
      title: "Check Product Reviews",
      description:
        "Read customer reviews for insights on how items fit compared to the size chart.",
    },
    {
      icon: Shield,
      title: "Consider the Fabric",
      description:
        "Stretchy fabrics may fit differently than non-stretch materials. Check fabric composition.",
    },
    {
      icon: TrendingUp,
      title: "When in Doubt, Size Up",
      description:
        "If you're between sizes, it's usually better to go with the larger size for comfort.",
    },
  ];

  const faqData = [
    {
      question: "What if I'm between two sizes?",
      answer:
        "If you're between sizes, consider the fit you prefer. For a more relaxed fit, choose the larger size. For a more fitted look, choose the smaller size. Also check if the fabric has stretch - stretchy materials can accommodate being sized down.",
    },
    {
      question: "Do sizes vary between brands?",
      answer:
        "Yes, sizing can vary between different brands and manufacturers. Always refer to the specific size chart for each product rather than assuming your usual size will fit the same across all brands.",
    },
    {
      question: "How do I convert international sizes?",
      answer:
        "Use our size conversion charts above. Keep in mind that international sizing can vary, so measurements are always more accurate than size labels when shopping globally.",
    },
    {
      question: "What if the item doesn't fit?",
      answer:
        "We offer free returns and exchanges within 30 days of purchase. If an item doesn't fit as expected, you can easily return or exchange it through our returns portal.",
    },
    {
      question: "Are the measurements exact?",
      answer:
        "Measurements may vary slightly (±0.5 inches) due to manufacturing tolerances. This is normal and within industry standards.",
    },
    {
      question: "How often are size charts updated?",
      answer:
        "We regularly review and update our size charts based on customer feedback and manufacturer specifications to ensure accuracy.",
    },
  ];

  const stats = [
    {
      icon: Star,
      number: "99%",
      label: "Accurate Sizing",
      subtitle: "Based on customer feedback",
    },
    {
      icon: Shield,
      number: "30 Days",
      label: "Free Returns",
      subtitle: "If sizing is incorrect",
    },
    {
      icon: Globe,
      number: "6 Regions",
      label: "Size Standards",
      subtitle: "International compatibility",
    },
    {
      icon: Award,
      number: "24/7",
      label: "Sizing Help",
      subtitle: "Expert assistance available",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaq((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleContactSupport = () => {
    navigate("/contact-us");
  };

  const SizeChart = ({ data, title }) => (
    <Card shadow="lg" hover={false} className="mb-6">
      <Card.Header>
        <h4 className="text-lg font-bold text-gray-900">{title}</h4>
      </Card.Header>
      <Card.Body>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {data.headers.map((header, index) => (
                  <th
                    key={index}
                    className="text-left py-3 px-4 font-semibold text-gray-900"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="py-3 px-4 text-gray-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Button>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <MessageSquare size={16} className="mr-2" />
                Sizing Help
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Badge
              variant="primary"
              size="lg"
              className="mb-6"
              icon={<Ruler size={16} />}
            >
              Size Guide
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Find Your
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Perfect Fit
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Get the perfect fit every time with our comprehensive size guide.
              From clothing to shoes, we'll help you find your ideal size across
              all categories.
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <Input
                placeholder="Search for size information..."
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

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
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
        {/* Category Navigation */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <Badge variant="info" className="mb-4" icon={<Package size={16} />}>
              Size Categories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Category
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the product category to view detailed size charts and
              measurement guides.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <Card
                  key={category.id}
                  shadow="lg"
                  hover
                  className={`group cursor-pointer ${
                    selectedCategory === category.id
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Card.Body className="p-6 text-center">
                    <div
                      className={`p-4 bg-${category.color}-100 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <CategoryIcon
                        size={32}
                        className={`text-${category.color}-600`}
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                    {selectedCategory === category.id && (
                      <Badge variant="primary" size="sm" className="mt-3">
                        Selected
                      </Badge>
                    )}
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Size Charts */}
            {selectedCategory === "clothing" && (
              <div className="space-y-8">
                <Card shadow="xl" hover={false}>
                  <Card.Header>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <Shirt className="mr-3 text-blue-500" size={24} />
                        Clothing Size Charts
                      </h3>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">Region:</label>
                        <Select
                          value={selectedRegion}
                          onChange={(e) => setSelectedRegion(e.target.value)}
                          className="w-32"
                        >
                          {regions.map((region) => (
                            <option key={region.code} value={region.code}>
                              {region.name}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div className="space-y-6">
                      <SizeChart
                        data={clothingSizes.men.shirts}
                        title="Men's Shirts"
                      />
                      <SizeChart
                        data={clothingSizes.men.pants}
                        title="Men's Pants"
                      />
                      <SizeChart
                        data={clothingSizes.women.tops}
                        title="Women's Tops"
                      />
                      <SizeChart
                        data={clothingSizes.women.dresses}
                        title="Women's Dresses"
                      />
                    </div>
                  </Card.Body>
                </Card>
              </div>
            )}

            {selectedCategory === "shoes" && (
              <Card shadow="xl" hover={false}>
                <Card.Header>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <Footprints className="mr-3 text-purple-500" size={24} />
                    Shoe Size Conversion Chart
                  </h3>
                </Card.Header>
                <Card.Body>
                  <SizeChart
                    data={shoeSizes}
                    title="International Shoe Size Conversion"
                  />
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Info size={20} className="text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">
                          Shoe Sizing Tips
                        </h4>
                        <ul className="text-blue-800 text-sm space-y-1">
                          <li>
                            • Measure feet at the end of the day when they're
                            largest
                          </li>
                          <li>
                            • Always measure both feet and use the larger
                            measurement
                          </li>
                          <li>
                            • Consider the width of your foot, not just length
                          </li>
                          <li>
                            • Leave about 0.5 inches of space between your
                            longest toe and shoe front
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}

            {selectedCategory === "accessories" && (
              <Card shadow="xl" hover={false}>
                <Card.Header>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <Watch className="mr-3 text-green-500" size={24} />
                    Accessories Size Guide
                  </h3>
                </Card.Header>
                <Card.Body>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Watch Bands
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b pb-1">
                          <span>Small</span>
                          <span>5.5" - 6.5"</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span>Medium</span>
                          <span>6.5" - 7.5"</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span>Large</span>
                          <span>7.5" - 8.5"</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Belt Sizes
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b pb-1">
                          <span>30</span>
                          <span>26" - 30"</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span>32</span>
                          <span>28" - 32"</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span>34</span>
                          <span>30" - 34"</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Measurement Guide */}
            <Card shadow="xl" hover={false} className="mt-8">
              <Card.Header>
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Calculator className="mr-3 text-purple-500" size={24} />
                  How to Measure
                </h3>
              </Card.Header>
              <Card.Body>
                <div className="grid md:grid-cols-2 gap-6">
                  {measurementGuides.map((guide, index) => {
                    const GuideIcon = guide.icon;
                    return (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="text-3xl">{guide.image}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {guide.title}
                            </h4>
                            <GuideIcon size={16} className="text-gray-500" />
                          </div>
                        </div>
                        <ol className="space-y-2 text-sm text-gray-600 mb-3">
                          {guide.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex">
                              <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">
                                {stepIndex + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                        <div className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                          <p className="text-xs text-yellow-800">
                            <strong>Tip:</strong> {guide.tip}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sizing Tips */}
            <Card shadow="lg" hover={false}>
              <Card.Header>
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Target className="mr-2 text-green-500" size={20} />
                  Sizing Tips
                </h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  {sizingTips.map((tip, index) => {
                    const TipIcon = tip.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="p-2 bg-green-100 rounded-full flex-shrink-0">
                          <TipIcon size={16} className="text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {tip.title}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {tip.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>

            {/* Quick Size Finder */}
            <Card
              shadow="lg"
              hover={false}
              className="bg-gradient-to-br from-blue-50 to-purple-50"
            >
              <Card.Body>
                <div className="text-center">
                  <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                    <Zap size={24} className="text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    Need Personal Help?
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Our sizing experts are available 24/7 to help you find the
                    perfect fit.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleContactSupport}
                    className="w-full"
                  >
                    Chat with Expert
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Return Policy */}
            <Card shadow="lg" hover={false}>
              <Card.Header>
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Shield className="mr-2 text-purple-500" size={20} />
                  Size Guarantee
                </h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <CheckCircle size={16} className="mr-2 text-green-500" />
                    <span>30-day free returns</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CheckCircle size={16} className="mr-2 text-green-500" />
                    <span>Free size exchanges</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CheckCircle size={16} className="mr-2 text-green-500" />
                    <span>Expert sizing support</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CheckCircle size={16} className="mr-2 text-green-500" />
                    <span>Fit guarantee policy</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <Badge
              variant="warning"
              className="mb-4"
              icon={<HelpCircle size={16} />}
            >
              Frequently Asked Questions
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sizing Questions Answered
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find quick answers to common sizing and fit questions.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
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
              <Heart size={32} className="text-red-500" />
              <h3 className="text-3xl font-bold text-gray-900">
                Still Need Help Finding Your Size?
              </h3>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Our sizing experts are here to help you find the perfect fit. Get
              personalized recommendations and sizing advice.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleContactSupport}
                className="flex items-center space-x-2"
              >
                <MessageSquare size={20} />
                <span>Chat with Expert</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/product-collections")}
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
                <span>sizing@emmover.com</span>
              </div>
              <Badge variant="primary" size="lg" icon={<Clock size={16} />}>
                24/7 Sizing Support
              </Badge>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SizeGuide;
