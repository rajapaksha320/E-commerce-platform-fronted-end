import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  Clock,
  User,
  Tag,
  TrendingUp,
  Heart,
  Share2,
  BookOpen,
  Star,
  ArrowRight,
  Filter,
  Grid,
  List,
  Eye,
  MessageSquare,
  ChevronRight,
  Sparkles,
  Gift,
  ShoppingBag,
  Home,
  Shirt,
  Smartphone,
  Gamepad2,
  Camera,
  Coffee,
  Mail,
} from "lucide-react";

import {
  Button,
  Badge,
  ContactCard as Card,
  Input,
} from "../../components/ui/ContactUis/Uis";

import Pagination from "../../components/ui/ContactUis/Pagination";

const Blogs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = [
    {
      id: "all",
      name: "All Posts",
      icon: BookOpen,
      count: 24,
      color: "primary",
    },
    {
      id: "lifestyle",
      name: "Lifestyle",
      icon: Heart,
      count: 8,
      color: "pink",
    },
    {
      id: "tech",
      name: "Tech & Gadgets",
      icon: Smartphone,
      count: 6,
      color: "blue",
    },
    { id: "fashion", name: "Fashion", icon: Shirt, count: 5, color: "purple" },
    { id: "home", name: "Home & Living", icon: Home, count: 3, color: "green" },
    { id: "gaming", name: "Gaming", icon: Gamepad2, count: 2, color: "indigo" },
  ];

  const blogPosts = [
    {
      id: 1,
      title: "The Ultimate Guide to Smart Home Automation in 2024",
      excerpt:
        "Transform your living space with the latest smart home technologies. From voice assistants to automated lighting, discover how to create the perfect connected home.",
      author: "Sarah Johnson",
      date: "2024-06-10",
      readTime: "8 min read",
      category: "tech",
      image: "🏠",
      views: 1420,
      likes: 89,
      comments: 23,
      featured: true,
      tags: ["Smart Home", "Technology", "IoT", "Automation"],
    },
    {
      id: 2,
      title: "Summer Fashion Trends: What to Wear This Season",
      excerpt:
        "Stay stylish and comfortable with our curated selection of summer fashion trends. From breathable fabrics to vibrant colors, find your perfect summer look.",
      author: "Emma Chen",
      date: "2024-06-08",
      readTime: "6 min read",
      category: "fashion",
      image: "👗",
      views: 980,
      likes: 156,
      comments: 34,
      featured: false,
      tags: ["Fashion", "Summer", "Trends", "Style"],
    },
    {
      id: 3,
      title: "Building the Perfect Gaming Setup on Any Budget",
      excerpt:
        "Create an amazing gaming experience without breaking the bank. Our comprehensive guide covers everything from budget builds to premium setups.",
      author: "Mike Rodriguez",
      date: "2024-06-06",
      readTime: "12 min read",
      category: "gaming",
      image: "🎮",
      views: 2150,
      likes: 203,
      comments: 67,
      featured: true,
      tags: ["Gaming", "Setup", "Budget", "PC Building"],
    },
    {
      id: 4,
      title: "10 Kitchen Gadgets That Will Change Your Cooking Game",
      excerpt:
        "Discover innovative kitchen tools that make cooking easier, faster, and more enjoyable. From smart appliances to clever accessories.",
      author: "Lisa Wang",
      date: "2024-06-04",
      readTime: "7 min read",
      category: "home",
      image: "🍳",
      views: 1680,
      likes: 142,
      comments: 45,
      featured: false,
      tags: ["Kitchen", "Cooking", "Gadgets", "Home"],
    },
    {
      id: 5,
      title: "Sustainable Living: Eco-Friendly Products for Modern Life",
      excerpt:
        "Make a positive impact on the environment with our selection of sustainable products. Learn how small changes can make a big difference.",
      author: "David Green",
      date: "2024-06-02",
      readTime: "9 min read",
      category: "lifestyle",
      image: "🌱",
      views: 1340,
      likes: 178,
      comments: 29,
      featured: false,
      tags: ["Sustainability", "Eco-Friendly", "Environment", "Green Living"],
    },
    {
      id: 6,
      title: "Photography Gear for Beginners: Start Your Journey",
      excerpt:
        "Begin your photography adventure with the right equipment. Our beginner-friendly guide covers cameras, lenses, and essential accessories.",
      author: "Alex Turner",
      date: "2024-05-30",
      readTime: "10 min read",
      category: "tech",
      image: "📸",
      views: 890,
      likes: 95,
      comments: 18,
      featured: false,
      tags: ["Photography", "Beginner", "Camera", "Equipment"],
    },
    {
      id: 7,
      title: "Work From Home: Creating Your Perfect Productivity Space",
      excerpt:
        "Design a home office that boosts productivity and comfort. From ergonomic furniture to lighting solutions, create your ideal workspace.",
      author: "Jennifer Lee",
      date: "2024-05-28",
      readTime: "8 min read",
      category: "home",
      image: "💻",
      views: 1560,
      likes: 134,
      comments: 52,
      featured: false,
      tags: ["Work From Home", "Productivity", "Office", "Workspace"],
    },
    {
      id: 8,
      title: "The Rise of Smartwatches: Features You Need to Know",
      excerpt:
        "Explore the latest smartwatch technologies and find the perfect device for your lifestyle. Health tracking, notifications, and more.",
      author: "Ryan Park",
      date: "2024-05-26",
      readTime: "6 min read",
      category: "tech",
      image: "⌚",
      views: 1120,
      likes: 87,
      comments: 31,
      featured: false,
      tags: ["Smartwatch", "Wearables", "Health", "Technology"],
    },
  ];

  const trendingTopics = [
    { name: "Smart Home", posts: 12, trend: "+15%" },
    { name: "Sustainable Living", posts: 8, trend: "+23%" },
    { name: "Gaming Setup", posts: 6, trend: "+8%" },
    { name: "Summer Fashion", posts: 9, trend: "+19%" },
    { name: "Work From Home", posts: 7, trend: "+12%" },
  ];

  // Filter blogs based on search and category
  const filteredBlogs = blogPosts.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get featured posts
  const featuredPosts = blogPosts.filter((blog) => blog.featured);

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

//   const handleNewsletterSignup = () => {
//     navigate("/newsletter");
//   };

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
              icon={<BookOpen size={16} />}
            >
              Emmover Blog
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Stories, Insights &
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Inspiration
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Discover the latest trends, expert insights, and inspiring stories
              from the world of technology, lifestyle, and everything in
              between. Your source for thoughtful content.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <Input
                placeholder="Search articles, topics, or authors..."
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
              {categories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "primary" : "ghost"
                    }
                    size="md"
                    onClick={() => handleCategoryChange(category.id)}
                    className="flex items-center space-x-2"
                  >
                    <CategoryIcon size={16} />
                    <span>{category.name}</span>
                    <Badge
                      variant={
                        selectedCategory === category.id
                          ? "indigo"
                          : category.color
                      }
                      size="sm"
                    >
                      {category.count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Posts Section */}
            {selectedCategory === "all" && !searchTerm && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Star className="mr-2 text-yellow-500" size={24} />
                    Featured Posts
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {featuredPosts.slice(0, 2).map((post) => (
                    <Card
                      key={post.id}
                      shadow="lg"
                      hover
                      className="group cursor-pointer"
                      onClick={() => handleBlogClick(post.id)}
                    >
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-6xl rounded-t-lg">
                        {post.image}
                      </div>
                      <Card.Body>
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge variant="primary" size="sm">
                            Featured
                          </Badge>
                          <Badge variant="ghost" size="sm">
                            {post.category}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <User size={14} className="mr-1" />
                              {post.author}
                            </span>
                            <span className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              {post.readTime}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center">
                              <Eye size={14} className="mr-1" />
                              {post.views}
                            </span>
                            <span className="flex items-center">
                              <Heart size={14} className="mr-1" />
                              {post.likes}
                            </span>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Blog Posts Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === "all"
                    ? "Latest Articles"
                    : categories.find((cat) => cat.id === selectedCategory)
                        ?.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredBlogs.length} article
                  {filteredBlogs.length !== 1 ? "s" : ""} found
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid size={16} />
                </Button>
                <Button
                  variant={viewMode === "list" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List size={16} />
                </Button>
              </div>
            </div>

            {/* Blog Posts Grid/List */}
            {filteredBlogs.length > 0 ? (
              <div className="space-y-6">
                <div
                  className={
                    viewMode === "grid"
                      ? "grid md:grid-cols-2 gap-6"
                      : "space-y-6"
                  }
                >
                  {paginatedBlogs.map((post) => (
                    <Card
                      key={post.id}
                      shadow="lg"
                      hover
                      className="group cursor-pointer"
                      onClick={() => handleBlogClick(post.id)}
                    >
                      {viewMode === "grid" ? (
                        <>
                          <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-6xl rounded-t-lg">
                            {post.image}
                          </div>
                          <Card.Body>
                            <div className="flex items-center space-x-2 mb-3">
                              <Badge variant="ghost" size="sm">
                                {post.category}
                              </Badge>
                              {post.featured && (
                                <Badge variant="primary" size="sm">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 mb-4">{post.excerpt}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-4">
                                <span className="flex items-center">
                                  <User size={14} className="mr-1" />
                                  {post.author}
                                </span>
                                <span className="flex items-center">
                                  <Clock size={14} className="mr-1" />
                                  {post.readTime}
                                </span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className="flex items-center">
                                  <Heart size={14} className="mr-1" />
                                  {post.likes}
                                </span>
                                <span className="flex items-center">
                                  <MessageSquare size={14} className="mr-1" />
                                  {post.comments}
                                </span>
                              </div>
                            </div>
                          </Card.Body>
                        </>
                      ) : (
                        <Card.Body>
                          <div className="flex space-x-4">
                            <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-3xl">
                              {post.image}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="ghost" size="sm">
                                  {post.category}
                                </Badge>
                                {post.featured && (
                                  <Badge variant="primary" size="sm">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {post.title}
                              </h3>
                              <p className="text-gray-600 mb-3 line-clamp-2">
                                {post.excerpt}
                              </p>
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center space-x-4">
                                  <span className="flex items-center">
                                    <User size={14} className="mr-1" />
                                    {post.author}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock size={14} className="mr-1" />
                                    {post.readTime}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className="flex items-center">
                                    <Heart size={14} className="mr-1" />
                                    {post.likes}
                                  </span>
                                  <span className="flex items-center">
                                    <MessageSquare size={14} className="mr-1" />
                                    {post.comments}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      )}
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {filteredBlogs.length > itemsPerPage && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredBlogs.length}
                    className="mt-8 pt-8 border-t border-gray-200"
                  />
                )}
              </div>
            ) : (
              <Card shadow="lg" hover={false} className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No articles found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search terms or browse a different
                    category.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                  >
                    View All Articles
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card shadow="lg" hover={false}>
              <Card.Header>
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <TrendingUp className="mr-2 text-green-500" size={20} />
                  Trending Topics
                </h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {topic.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {topic.posts} posts
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="success" size="sm">
                          {topic.trend}
                        </Badge>
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Newsletter Signup */}
            {/* <Card
              shadow="lg"
              hover={false}
              className="bg-gradient-to-br from-blue-50 to-purple-50"
            >
              <Card.Body>
                <div className="text-center">
                  <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                    <Mail size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Stay Updated
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Get the latest articles and insights delivered to your inbox
                    weekly.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleNewsletterSignup}
                    className="w-full"
                  >
                    Subscribe Now
                  </Button>
                </div>
              </Card.Body>
            </Card> */}

            {/* Popular Tags */}
            <Card shadow="lg" hover={false}>
              <Card.Header>
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Tag className="mr-2 text-purple-500" size={20} />
                  Popular Tags
                </h3>
              </Card.Header>
              <Card.Body>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Smart Home",
                    "Fashion",
                    "Gaming",
                    "Sustainability",
                    "Photography",
                    "Productivity",
                    "Health",
                    "Technology",
                  ].map((tag, index) => (
                    <Badge
                      key={index}
                      variant="ghost"
                      className="cursor-pointer hover:bg-blue-50 hover:text-blue-600"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <Card
        shadow="xl"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100"
        hover={false}
      >
        <Card.Body className="py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles size={32} className="text-purple-500" />
              <h3 className="text-3xl font-bold text-gray-900">
                Discover Amazing Products
              </h3>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Ready to put these insights into action? Explore our curated
              collection of products featured in our articles and find your next
              favorite item.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/products")}
                className="flex items-center space-x-2"
              >
                <ShoppingBag size={20} />
                <span>Shop Now</span>
                <ArrowRight size={20} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/contact-us")}
                className="flex items-center space-x-2"
              >
                <MessageSquare size={20} />
                <span>Get in Touch</span>
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <Badge variant="primary" size="lg" icon={<BookOpen size={16} />}>
                New articles published weekly
              </Badge>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Blogs;
