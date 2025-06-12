import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Users,
  Star,
  Lightbulb,
  Target,
  Rocket,
  Globe,
  Award,
  TrendingUp,
  Coffee,
  Clock,
  MapPin,
  Quote,
  ArrowRight,
  Play,
  Sparkles,
  Gift,
  ShoppingBag,
  Zap,
  Camera,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";

import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";

const OurStory = () => {
  const navigate = useNavigate();
  const [activeChapter, setActiveChapter] = useState(0);

  const handleJoinJourney = () => {
    navigate("/seller-registration");
  };

  const handleContactUs = () => {
    navigate("/contact-us");
  };

  const storyChapters = [
    {
      year: "2020",
      title: "The Spark of an Idea",
      subtitle: "A Late Night Revelation",
      icon: Lightbulb,
      color: "from-yellow-400 to-orange-500",
      story:
        "It was 2 AM when our founder Sarah couldn't find the perfect gift for her mother's birthday online. After hours of frustrating searches across multiple websites, she realized there had to be a better way. That sleepless night sparked the idea for Emmover - a place where finding the perfect product would be effortless and enjoyable.",
      highlight: "Born from frustration, built with love",
      image: "💡",
    },
    {
      year: "2020",
      title: "The First Step",
      subtitle: "From Garage to Global Vision",
      icon: Rocket,
      color: "from-blue-400 to-purple-500",
      story:
        "With $5,000 in savings and unwavering determination, Sarah and her college friend Mark started coding in Sarah's garage. They survived on instant noodles and endless coffee, driven by the vision of creating something that would genuinely help people. Their first prototype was ugly, but it worked.",
      highlight: "Big dreams start small",
      image: "🚀",
    },
    {
      year: "2021",
      title: "The First Customer",
      subtitle: "Maria from Portland",
      icon: Heart,
      color: "from-pink-400 to-red-500",
      story:
        "Maria from Portland became our first customer. She bought a handmade scarf for her daughter. When she sent us a photo of her daughter's smile, we knew we were onto something special. That moment taught us that behind every purchase is a story, a relationship, a moment of joy.",
      highlight: "Every customer has a story",
      image: "❤️",
    },
    {
      year: "2022",
      title: "Growing Pains",
      subtitle: "Learning Through Challenges",
      icon: TrendingUp,
      color: "from-green-400 to-blue-500",
      story:
        "Growth brought challenges. Server crashes, inventory mishaps, and sleepless nights became the norm. But with each problem, we learned, adapted, and grew stronger. Our team expanded from 2 to 20, and our customer base grew from 1 to 10,000. Every setback taught us something valuable.",
      highlight: "Challenges shape character",
      image: "📈",
    },
    {
      year: "2023",
      title: "Global Recognition",
      subtitle: "Making Waves Worldwide",
      icon: Globe,
      color: "from-purple-400 to-indigo-500",
      story:
        "When we won the 'Emerging Ecommerce Platform of the Year' award, it wasn't just recognition - it was validation that our approach of putting customers first was working. We expanded to 25 countries, but never forgot our roots: genuine care for every person who chooses to shop with us.",
      highlight: "Recognition fuels purpose",
      image: "🌍",
    },
    {
      year: "2024",
      title: "Today & Tomorrow",
      subtitle: "The Journey Continues",
      icon: Sparkles,
      color: "from-indigo-400 to-purple-500",
      story:
        "Today, we serve over 500,000 customers worldwide, but we're still the same team that believes in making shopping a delightful experience. We're constantly innovating, always listening, and forever grateful for the trust our customers place in us every day.",
      highlight: "The best is yet to come",
      image: "✨",
    },
  ];

  const teamValues = [
    {
      icon: Heart,
      title: "Customer Obsession",
      description:
        "Every decision starts with 'How does this help our customers?'",
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We're always looking for better ways to serve you",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "We're building more than a business - we're building relationships",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "Good enough isn't good enough when it comes to your experience",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  const customerStories = [
    {
      name: "Emma Rodriguez",
      location: "Barcelona, Spain",
      story:
        "Found the perfect wedding dress accessories here when local stores couldn't help",
      rating: 5,
      image: "👰",
      highlight: "Made my special day perfect",
    },
    {
      name: "James Chen",
      location: "Toronto, Canada",
      story:
        "Emmover helped me find unique gifts for my entire family's birthdays this year",
      rating: 5,
      image: "🎁",
      highlight: "One-stop gift solution",
    },
    {
      name: "Priya Patel",
      location: "Mumbai, India",
      story:
        "Amazing customer service when my order had issues. They went above and beyond",
      rating: 5,
      image: "🌟",
      highlight: "Exceptional support",
    },
  ];

  const funFacts = [
    {
      icon: Coffee,
      number: "2,847",
      label: "Cups of Coffee",
      subtitle: "Fueling late-night innovations",
    },
    {
      icon: Heart,
      number: "500K+",
      label: "Happy Customers",
      subtitle: "And counting every day",
    },
    {
      icon: Globe,
      number: "50+",
      label: "Countries",
      subtitle: "Bringing joy worldwide",
    },
    {
      icon: Star,
      number: "4.9",
      label: "Average Rating",
      subtitle: "Your satisfaction drives us",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center">
            <Badge
              variant="primary"
              size="lg"
              className="mb-6"
              icon={<Quote size={16} />}
            >
              Our Story
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Every Great Journey
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Starts with a Dream
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              From a frustrated late-night shopping experience to serving over
              500,000 customers worldwide - this is the story of how Emmover
              became more than just a marketplace. It became a community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleJoinJourney}
                className="flex items-center space-x-2"
              >
                <ShoppingBag size={20} />
                <span>Join Our Journey</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 flex items-center space-x-2"
              >
                <Play size={20} />
                <span>Watch Our Story</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Fun Facts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <Card shadow="xl" hover={false} className="mb-16">
          <Card.Body>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {funFacts.map((fact, index) => (
                <div key={index} className="text-center group cursor-pointer">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full w-fit mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <fact.icon size={28} className="text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {fact.number}
                  </div>
                  <div className="text-gray-700 font-medium mb-1">
                    {fact.label}
                  </div>
                  <div className="text-sm text-gray-500">{fact.subtitle}</div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Interactive Timeline Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <Badge variant="info" className="mb-4" icon={<Clock size={16} />}>
            Our Journey
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The Chapters of Our Story
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Click on each chapter to discover the moments that shaped who we are
            today
          </p>
        </div>

        {/* Timeline Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {storyChapters.map((chapter, index) => {
            const ChapterIcon = chapter.icon;
            return (
              <Button
                key={index}
                variant={activeChapter === index ? "primary" : "ghost"}
                size="sm"
                onClick={() => setActiveChapter(index)}
                className="flex items-center space-x-2"
              >
                <ChapterIcon size={16} />
                <span>{chapter.year}</span>
              </Button>
            );
          })}
        </div>

        {/* Active Chapter Display */}
        <Card shadow="xl" hover={false} className="mb-16">
          <div
            className={`h-2 bg-gradient-to-r ${storyChapters[activeChapter].color} rounded-t-lg`}
          ></div>
          <Card.Body className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div
                    className={`p-3 bg-gradient-to-r ${storyChapters[activeChapter].color} text-white rounded-full`}
                  >
                    {React.createElement(storyChapters[activeChapter].icon, {
                      size: 24,
                    })}
                  </div>
                  <div>
                    <Badge variant="primary" className="mb-2">
                      {storyChapters[activeChapter].year}
                    </Badge>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {storyChapters[activeChapter].title}
                    </h3>
                    <p className="text-lg text-purple-600 font-medium">
                      {storyChapters[activeChapter].subtitle}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {storyChapters[activeChapter].story}
                </p>
                <Badge
                  variant="success"
                  size="lg"
                  icon={<Sparkles size={16} />}
                  className="inline-block"
                >
                  {storyChapters[activeChapter].highlight}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-8xl mb-4 filter drop-shadow-lg">
                  {storyChapters[activeChapter].image}
                </div>
                <div
                  className={`h-1 bg-gradient-to-r ${storyChapters[activeChapter].color} rounded-full w-24 mx-auto`}
                ></div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Values Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <Badge
              variant="purple"
              className="mb-4"
              icon={<Target size={16} />}
            >
              What Drives Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These are not just words on a wall - they are the principles that
              guide every decision we make
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamValues.map((value, index) => {
              const ValueIcon = value.icon;
              return (
                <Card
                  key={index}
                  shadow="lg"
                  hover
                  className="group text-center"
                >
                  <Card.Body>
                    <div
                      className={`p-4 ${value.bgColor} rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <ValueIcon size={32} className={value.color} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">{value.description}</p>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Customer Stories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Badge
            variant="success"
            className="mb-4"
            icon={<MessageSquare size={16} />}
          >
            Customer Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The Real Stories That
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Keep Us Going
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Behind every order is a person with a story. Here are just a few
            that remind us why we do what we do.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {customerStories.map((story, index) => (
            <Card key={index} shadow="lg" hover className="group">
              <Card.Body>
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{story.image}</div>
                  <div className="flex justify-center mb-2">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="text-yellow-500 fill-current"
                      />
                    ))}
                  </div>
                </div>
                <Quote size={20} className="text-purple-400 mb-3" />
                <p className="text-gray-600 mb-4 italic">"{story.story}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{story.name}</p>
                  <p className="text-sm text-gray-500">{story.location}</p>
                  <Badge variant="primary" size="sm" className="mt-2">
                    {story.highlight}
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      {/* Behind the Scenes */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <Badge
              variant="indigo"
              className="mb-4"
              icon={<Camera size={16} />}
            >
              Behind the Scenes
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Team Behind the Magic
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                More Than Just Colleagues
              </h3>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  We are a diverse team of dreamers, builders, and
                  problem-solvers from around the world. What unites us is not
                  just our love for ecommerce - it is our shared belief that
                  shopping should be a delightful experience.
                </p>
                <p>
                  From our developers who code with passion to our customer
                  service team who genuinely care about every interaction, we
                  are all driven by the same mission: making your day a little
                  brighter through amazing products and exceptional service.
                </p>
                <p>
                  We celebrate together, learn together, and grow together.
                  Because when we succeed, our customers succeed - and that is
                  what matters most.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card shadow="lg" hover className="p-6 text-center">
                <Users size={32} className="text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">50+ Team Members</h4>
                <p className="text-sm text-gray-600">
                  Passionate professionals worldwide
                </p>
              </Card>
              <Card shadow="lg" hover className="p-6 text-center">
                <Globe size={32} className="text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">15 Countries</h4>
                <p className="text-sm text-gray-600">
                  Diverse perspectives, unified vision
                </p>
              </Card>
              <Card shadow="lg" hover className="p-6 text-center">
                <Zap size={32} className="text-yellow-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">24/7 Support</h4>
                <p className="text-sm text-gray-600">
                  Always here when you need us
                </p>
              </Card>
              <Card shadow="lg" hover className="p-6 text-center">
                <ThumbsUp size={32} className="text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Customer First</h4>
                <p className="text-sm text-gray-600">
                  Every decision starts with you
                </p>
              </Card>
            </div>
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
              <Sparkles size={32} className="text-purple-500" />
              <h3 className="text-3xl font-bold text-gray-900">
                Your Story Starts Here
              </h3>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Every great story needs amazing characters. We would love for you
              to be part of ours. Join our community and let us create something
              beautiful together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleJoinJourney}
                className="flex items-center space-x-2"
              >
                <Gift size={20} />
                <span>Start Your Journey</span>
                <ArrowRight size={20} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleContactUs}
                className="flex items-center space-x-2"
              >
                <Heart size={20} />
                <span>Share Your Story</span>
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <Badge variant="primary" size="lg" icon={<Users size={16} />}>
                Join 500,000+ Happy Customers Worldwide
              </Badge>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OurStory;
