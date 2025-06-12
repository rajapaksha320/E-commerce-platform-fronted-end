/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Tag,
  Twitter,
  Facebook,
  Linkedin,
  Link,
  ThumbsUp,
  BookOpen,
  TrendingUp,
  Mail,
  Target,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

import {
  Button,
  Badge,
  ContactCard as Card,
  Textarea,
} from "../../components/ui/ContactUis/Uis";

const BlogPostView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [readingProgress, setReadingProgress] = useState(0);

  // Sample blog post data (in real app, this would come from API)
  const blogPost = {
    id: 1,
    title: "The Ultimate Guide to Smart Home Automation in 2024",
    excerpt:
      "Transform your living space with the latest smart home technologies. From voice assistants to automated lighting, discover how to create the perfect connected home.",
    author: "Sarah Johnson",
    authorBio:
      "Sarah is a tech enthusiast and smart home expert with over 8 years of experience in home automation. She helps families create more efficient and comfortable living spaces.",
    authorImage: "👩‍💻",
    date: "2024-06-10",
    readTime: "8 min read",
    category: "tech",
    image: "🏠",
    views: 1420,
    likes: 89,
    commentsCount: 23,
    tags: [
      "Smart Home",
      "Technology",
      "IoT",
      "Automation",
      "Home Security",
      "Energy Efficiency",
    ],
    content: `
# Introduction

Smart home automation has evolved from a futuristic concept to an accessible reality that's transforming how we live, work, and interact with our living spaces. In 2024, the technology has become more sophisticated, affordable, and user-friendly than ever before.

Whether you're a tech enthusiast looking to create the ultimate connected home or a beginner wanting to dip your toes into home automation, this comprehensive guide will walk you through everything you need to know.

## Why Smart Home Automation Matters

### Convenience and Comfort
Smart home automation brings unprecedented convenience to your daily routine. Imagine walking into a home that:
- Automatically adjusts lighting based on the time of day
- Sets the perfect temperature before you arrive
- Plays your favorite music as you enter
- Starts your coffee maker when your alarm goes off

### Energy Efficiency and Cost Savings
Modern smart home systems can significantly reduce your energy consumption:
- **Smart thermostats** can save up to 23% on heating and cooling costs
- **Automated lighting** reduces electricity waste by turning off lights in unoccupied rooms
- **Smart water heaters** optimize heating schedules based on usage patterns
- **Energy monitoring** helps identify power-hungry devices

### Enhanced Security
Smart security systems provide peace of mind with features like:
- Real-time monitoring and alerts
- Remote access to cameras and sensors
- Automated lighting to simulate occupancy
- Integration with professional monitoring services

## Getting Started: Your Smart Home Foundation

### 1. Choose Your Ecosystem
The first and most important decision is selecting your smart home ecosystem. The major players in 2024 are:

**Amazon Alexa**
- Extensive device compatibility
- Strong voice recognition
- Affordable entry point
- Great for entertainment integration

**Google Assistant**
- Superior natural language processing
- Excellent integration with Google services
- Strong multi-user support
- Best for information and search queries

**Apple HomeKit**
- Premium security and privacy
- Seamless integration with Apple devices
- Local processing capabilities
- Higher price point but excellent build quality

### 2. Start with the Basics
Begin your smart home journey with these essential devices:

**Smart Speaker or Display**
Your central command hub for voice control and automation management.

**Smart Lighting**
- Philips Hue for premium color-changing options
- LIFX for vibrant colors and effects
- Wyze for budget-friendly basic automation

**Smart Thermostat**
- Nest Learning Thermostat for AI-powered optimization
- Ecobee for room sensors and remote monitoring
- Honeywell for traditional HVAC compatibility

**Smart Plugs**
Transform any appliance into a smart device instantly.

## Advanced Automation Ideas

### Morning Routine Automation
Create the perfect start to your day:
\`\`\`
6:30 AM - Gradually increase bedroom lighting
6:45 AM - Start coffee maker
7:00 AM - Turn on news briefing
7:15 AM - Adjust shower temperature
7:30 AM - Start car (if compatible)
\`\`\`

### Evening Wind-Down
Set the mood for relaxation:
\`\`\`
Sunset - Dim all lights to 50%
8:00 PM - Close smart blinds
9:00 PM - Switch to warm lighting
10:00 PM - Lock all doors
10:30 PM - Activate sleep mode
\`\`\`

### Security Automation
Protect your home intelligently:
\`\`\`
Motion detected - Turn on pathway lights
Door opened - Send notification
Away mode - Activate all sensors
Vacation mode - Simulate occupancy
\`\`\`

## Smart Home Security and Privacy

### Data Protection Best Practices
1. **Regular Updates**: Keep all devices updated with latest firmware
2. **Strong Passwords**: Use unique passwords for each device
3. **Network Segmentation**: Create a separate IoT network
4. **Review Permissions**: Regularly audit app permissions
5. **Local Processing**: Choose devices that process data locally when possible

### Recommended Security Devices
- **Ring Video Doorbell Pro 2** for package delivery monitoring
- **Arlo Pro 4** for wireless outdoor security
- **Yale Assure Lock SL** for keyless entry
- **SimpliSafe** for comprehensive monitoring

## Product Recommendations by Budget

### Budget-Friendly ($100-$300)
- Amazon Echo Dot + Smart Plugs
- Wyze Cam v3 Security Camera
- Kasa Smart Light Switches
- Basic smart thermostat

### Mid-Range ($300-$800)
- Google Nest Hub + Nest devices
- Philips Hue Starter Kit
- Ring Video Doorbell + Chime
- Smart locks and sensors

### Premium ($800+)
- Apple HomePod + HomeKit devices
- Lutron Caseta Pro lighting system
- Nest Secure security system
- High-end smart appliances

## Troubleshooting Common Issues

### Connectivity Problems
- Ensure strong Wi-Fi coverage throughout your home
- Consider mesh networking for large homes
- Update router firmware regularly
- Use 2.4GHz networks for better range

### Device Responsiveness
- Restart devices monthly
- Check for firmware updates
- Monitor network bandwidth usage
- Consider upgrading internet speed

## Future of Smart Home Technology

### Emerging Trends for 2024-2025
- **AI-Powered Automation**: More predictive and learning capabilities
- **Health Monitoring**: Integration with wellness and health devices
- **Sustainability Focus**: Energy optimization and carbon tracking
- **Voice Evolution**: More natural conversation capabilities
- **Privacy-First Design**: Local processing becoming standard

### What's Coming Next
- Matter/Thread standardization for better interoperability
- 5G integration for faster response times
- Edge computing for reduced cloud dependence
- Biometric integration for personalized experiences

## Building Your Smart Home Action Plan

### Phase 1: Foundation (Month 1)
1. Choose your ecosystem
2. Install smart speaker/display
3. Add basic lighting control
4. Set up smart thermostat

### Phase 2: Expansion (Months 2-3)
1. Add security cameras
2. Install smart locks
3. Expand lighting to more rooms
4. Introduce automation routines

### Phase 3: Optimization (Months 4-6)
1. Fine-tune automations
2. Add sensors for advanced triggers
3. Integrate with entertainment systems
4. Optimize energy usage

## Conclusion

Smart home automation in 2024 offers unprecedented opportunities to create a more comfortable, efficient, and secure living environment. The key to success is starting small, choosing compatible devices, and gradually building your system over time.

Remember that the best smart home is one that enhances your lifestyle without adding complexity. Focus on solving real problems and improving daily routines rather than collecting gadgets for their own sake.

**Ready to start your smart home journey?** Begin with a simple starter kit and expand based on your needs and interests. The future of living is here, and it's more accessible than ever.

---

*Want to explore the smart home products mentioned in this guide? Check out our curated collection of verified smart home devices with detailed reviews and competitive pricing.*
    `,
    tableOfContents: [
      { title: "Introduction", anchor: "introduction" },
      { title: "Why Smart Home Automation Matters", anchor: "why-smart-home" },
      {
        title: "Getting Started: Your Smart Home Foundation",
        anchor: "getting-started",
      },
      { title: "Advanced Automation Ideas", anchor: "advanced-automation" },
      { title: "Smart Home Security and Privacy", anchor: "security-privacy" },
      {
        title: "Product Recommendations by Budget",
        anchor: "product-recommendations",
      },
      { title: "Troubleshooting Common Issues", anchor: "troubleshooting" },
      { title: "Future of Smart Home Technology", anchor: "future-trends" },
      { title: "Building Your Smart Home Action Plan", anchor: "action-plan" },
      { title: "Conclusion", anchor: "conclusion" },
    ],
  };

  const relatedPosts = [
    {
      id: 2,
      title: "Building the Perfect Gaming Setup on Any Budget",
      image: "🎮",
      readTime: "12 min read",
      category: "gaming",
    },
    {
      id: 3,
      title: "10 Kitchen Gadgets That Will Change Your Cooking Game",
      image: "🍳",
      readTime: "7 min read",
      category: "home",
    },
    {
      id: 4,
      title: "The Rise of Smartwatches: Features You Need to Know",
      image: "⌚",
      readTime: "6 min read",
      category: "tech",
    },
  ];

  const sampleComments = [
    {
      id: 1,
      author: "Mike Chen",
      avatar: "👨‍💼",
      date: "2 days ago",
      content:
        "Great article! I just started my smart home journey with a Nest thermostat and I'm already seeing the energy savings. The step-by-step approach you outlined is exactly what I needed.",
      likes: 12,
      replies: 2,
    },
    {
      id: 2,
      author: "Emma Rodriguez",
      avatar: "👩‍🎨",
      date: "1 day ago",
      content:
        "The security section was particularly helpful. I had no idea about network segmentation for IoT devices. Definitely implementing this ASAP!",
      likes: 8,
      replies: 1,
    },
    {
      id: 3,
      author: "David Kim",
      avatar: "👨‍🔧",
      date: "6 hours ago",
      content:
        "As someone who's been in home automation for years, this is one of the most comprehensive guides I've seen. The budget breakdown is spot on.",
      likes: 15,
      replies: 0,
    },
  ];

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setReadingProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBackToBlog = () => {
    navigate("/blogs");
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blogPost.title;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${url}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        break;
    }
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: "You",
        avatar: "👤",
        date: "Just now",
        content: comment,
        likes: 0,
        replies: 0,
      };
      setComments([newComment, ...comments]);
      setComment("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBackToBlog}
              className="flex items-center space-x-2"
            >
              <ArrowLeft size={16} />
              <span>Back to Blog</span>
            </Button>

            <div className="flex items-center space-x-4">
              <Button
                variant={isBookmarked ? "primary" : "ghost"}
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark
                  size={16}
                  className={isBookmarked ? "fill-current" : ""}
                />
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare("twitter")}
                >
                  <Twitter size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare("facebook")}
                >
                  <Facebook size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare("linkedin")}
                >
                  <Linkedin size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare("copy")}
                >
                  <Link size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24 space-y-6">
              <Card shadow="lg" hover={false}>
                <Card.Header>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <BookOpen className="mr-2 text-blue-500" size={20} />
                    Table of Contents
                  </h3>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-2">
                    {blogPost.tableOfContents.map((item, index) => (
                      <a
                        key={index}
                        href={`#${item.anchor}`}
                        className="block text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                </Card.Body>
              </Card>

              {/* Author Info */}
              <Card shadow="lg" hover={false}>
                <Card.Body>
                  <div className="text-center">
                    <div className="text-4xl mb-3">{blogPost.authorImage}</div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      {blogPost.author}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      {blogPost.authorBio}
                    </p>
                    {/* <Button variant="outline" size="sm" className="w-full">
                      Follow Author
                    </Button> */}
                  </div>
                </Card.Body>
              </Card>

              {/* Newsletter Signup */}
              <Card
                shadow="lg"
                hover={false}
                className="bg-gradient-to-br from-blue-50 to-purple-50"
              >
                <Card.Body>
                  <div className="text-center">
                    <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                      <Mail size={20} className="text-blue-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      Weekly Tech Insights
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Get expert tips delivered to your inbox
                    </p>
                    {/* <Button variant="primary" size="sm" className="w-full">
                      Subscribe
                    </Button> */}
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <article>
              {/* Header */}
              <Card shadow="xl" hover={false} className="mb-8">
                <Card.Body className="p-8">
                  <div className="mb-6">
                    <Badge variant="primary" className="mb-4">
                      {blogPost.category}
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                      {blogPost.title}
                    </h1>
                    <p className="text-xl text-gray-600 mb-6">
                      {blogPost.excerpt}
                    </p>
                  </div>

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                      <User size={16} className="mr-2" />
                      <span>{blogPost.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      <span>
                        {new Date(blogPost.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2" />
                      <span>{blogPost.readTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye size={16} className="mr-2" />
                      <span>{blogPost.views} views</span>
                    </div>
                  </div>

                  {/* Hero Image */}
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-8xl mb-6">
                    {blogPost.image}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {blogPost.tags.map((tag, index) => (
                      <Badge key={index} variant="ghost" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Social Actions */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant={isLiked ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => setIsLiked(!isLiked)}
                        className="flex items-center space-x-2"
                      >
                        <Heart
                          size={16}
                          className={isLiked ? "fill-current" : ""}
                        />
                        <span>{blogPost.likes + (isLiked ? 1 : 0)}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <MessageSquare size={16} />
                        <span>{blogPost.commentsCount}</span>
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare("copy")}
                      className="flex items-center space-x-2"
                    >
                      <Share2 size={16} />
                      <span>Share</span>
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              {/* Article Content */}
              <Card shadow="xl" hover={false} className="mb-8">
                <Card.Body className="p-8">
                  <div className="prose prose-lg max-w-none">
                    <div
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: blogPost.content
                          .replace(/\n/g, "<br/>")
                          .replace(/#{1,6} /g, (match) => {
                            const level = match.length - 1;
                            return `<h${level} class="text-${
                              4 - level
                            }xl font-bold text-gray-900 mt-8 mb-4">`;
                          })
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(
                            /`([^`]+)`/g,
                            '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>'
                          ),
                      }}
                    />
                  </div>
                </Card.Body>
              </Card>

              {/* Comments Section */}
              <Card shadow="xl" hover={false} className="mb-8">
                <Card.Header>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <MessageSquare className="mr-3 text-blue-500" size={24} />
                    Comments ({sampleComments.length + comments.length})
                  </h3>
                </Card.Header>
                <Card.Body>
                  {/* Comment Form */}
                  <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Join the discussion
                    </h4>
                    <Textarea
                      placeholder="Share your thoughts on this article..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="mb-4"
                      rows={4}
                    />
                    <Button
                      variant="primary"
                      onClick={handleCommentSubmit}
                      disabled={!comment.trim()}
                    >
                      Post Comment
                    </Button>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-6">
                    {[...comments, ...sampleComments].map((comment) => (
                      <div
                        key={comment.id}
                        className="border-b border-gray-200 pb-6 last:border-b-0"
                      >
                        <div className="flex space-x-4">
                          <div className="flex-shrink-0 text-2xl">
                            {comment.avatar}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center space-x-2 mb-2">
                              <h5 className="font-semibold text-gray-900">
                                {comment.author}
                              </h5>
                              <span className="text-sm text-gray-500">
                                {comment.date}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">
                              {comment.content}
                            </p>
                            <div className="flex items-center space-x-4 text-sm">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center space-x-1"
                              >
                                <ThumbsUp size={14} />
                                <span>{comment.likes}</span>
                              </Button>
                              <Button variant="ghost" size="sm">
                                Reply
                              </Button>
                              {comment.replies > 0 && (
                                <span className="text-gray-500">
                                  {comment.replies} replies
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>

              {/* Related Posts */}
              <Card shadow="xl" hover={false}>
                <Card.Header>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <TrendingUp className="mr-3 text-green-500" size={24} />
                    Related Articles
                  </h3>
                </Card.Header>
                <Card.Body>
                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedPosts.map((post) => (
                      <Card
                        key={post.id}
                        shadow="lg"
                        hover
                        className="group cursor-pointer"
                        onClick={() => navigate(`/blog/${post.id}`)}
                      >
                        <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-4xl rounded-t-lg">
                          {post.image}
                        </div>
                        <Card.Body>
                          <Badge variant="ghost" size="sm" className="mb-2">
                            {post.category}
                          </Badge>
                          <h4 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </h4>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Clock size={14} className="mr-1" />
                            {post.readTime}
                          </p>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </article>
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
              <Target size={32} className="text-purple-500" />
              <h3 className="text-3xl font-bold text-gray-900">
                Ready to Build Your Smart Home?
              </h3>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Explore our curated collection of smart home devices mentioned in
              this guide. From beginner-friendly starter kits to advanced
              automation systems.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/product-collections")}
                className="flex items-center space-x-2"
              >
                <Target size={20} />
                <span>Shop Smart Home</span>
                <ArrowRight size={20} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/contact-us")}
                className="flex items-center space-x-2"
              >
                <MessageSquare size={20} />
                <span>Get Expert Advice</span>
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <Badge
                variant="primary"
                size="lg"
                icon={<CheckCircle size={16} />}
              >
                All products verified and tested by our experts
              </Badge>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BlogPostView;
