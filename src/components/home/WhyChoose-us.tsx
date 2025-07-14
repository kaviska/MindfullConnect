"use client"

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Monitor, 
  Award, 
  Users, 
  MessageCircle, 
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  Play,
  Pause
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

interface TestimonialProps {
  image: string;
  quote: string;
  clientName: string;
  date: string;
  rating?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-blue-200 relative overflow-hidden">
    {/* Animated background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative z-10">
      {/* Icon with animated background */}
      <div className="relative mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
          <div className="text-white group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
        {/* Floating animation ring */}
        <div className="absolute inset-0 w-16 h-16 mx-auto rounded-2xl border-2 border-blue-200 scale-125 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </p>
      )}
    </div>
  </div>
);

const TestimonialCard: React.FC<TestimonialProps> = ({ image, quote, clientName, date, rating = 5 }) => (
  <div className="bg-white rounded-3xl shadow-xl p-8 mx-4 transform transition-all duration-500 hover:scale-105 border border-gray-100">
    {/* Quote icon */}
    <div className="flex justify-center mb-6">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
        <Quote className="w-6 h-6 text-white" />
      </div>
    </div>

    {/* Rating stars */}
    <div className="flex justify-center mb-6">
      {[...Array(rating)].map((_, i) => (
        <Star 
          key={i} 
          className="w-5 h-5 fill-yellow-400 text-yellow-400 mx-0.5 animate-pulse" 
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>

    {/* Quote */}
    <blockquote className="text-gray-700 text-lg mb-8 leading-relaxed text-center font-medium italic">
      "{quote}"
    </blockquote>

    {/* Client info */}
    <div className="flex items-center justify-center space-x-4">
      <img 
        src={image} 
        alt={clientName}
        className="w-16 h-16 rounded-full object-cover border-4 border-blue-100 shadow-md"
      />
      <div className="text-center">
        <div className="font-bold text-gray-900 text-lg">{clientName}</div>
        <div className="text-gray-500 text-sm">{date}</div>
      </div>
    </div>
  </div>
);

const CounselingLandingSections: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const features: FeatureCardProps[] = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Confidential",
      description: "Bank-level encryption and HIPAA compliance ensure your privacy is protected at all times"
    },
    {
      icon: <Monitor className="w-8 h-8" />,
      title: "100% Online & Flexible",
      description: "Access professional therapy from the comfort of your home, on your schedule"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Licensed Professionals",
      description: "Work with board-certified therapists with years of experience and proven results"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Personalized Care",
      description: "One-on-one sessions tailored specifically to your unique needs and goals"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Stay connected with secure messaging and crisis support when you need it most"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Track Your Progress",
      description: "Monitor your mental health journey with detailed insights and milestone tracking"
    }
  ];

  const testimonials: TestimonialProps[] = [
    {
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face",
      quote: "The flexibility of online sessions changed my life. I can finally prioritize my mental health without disrupting my work schedule.",
      clientName: "Sarah M.",
      date: "June 2024",
      rating: 5
    },
    {
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      quote: "My counselor helped me develop coping strategies that actually work. The progress tracker keeps me motivated every day.",
      clientName: "Michael R.",
      date: "May 2024",
      rating: 5
    },
    {
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      quote: "I was skeptical about online therapy, but the secure messaging feature lets me reach out when I need support most.",
      clientName: "Emily C.",
      date: "July 2024",
      rating: 5
    },
    {
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      quote: "The one-on-one sessions feel just as personal as in-person therapy. My counselor really understands my challenges.",
      clientName: "David L.",
      date: "April 2024",
      rating: 5
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    if (!isAutoRotating) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoRotating, testimonials.length]);

  const nextTestimonial = () => {
    setIsAutoRotating(false);
    setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIsAutoRotating(false);
    setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setIsAutoRotating(false);
    setCurrentTestimonial(index);
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full opacity-10 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200 rounded-full opacity-10 animate-pulse delay-1000" />
      
      {/* Why Choose Us Section */}
      <section className="relative py-20 lg:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Award className="h-4 w-4 mr-2" />
              Why Choose Mindfull Connect
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Experience Premium
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 block">
                Mental Health Care
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands who have transformed their lives with our innovative platform 
              designed around your unique mental wellness journey
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "10,000+", label: "Sessions Completed" },
              { number: "95%", label: "Success Rate" },
              { number: "500+", label: "Licensed Therapists" },
              { number: "24/7", label: "Support Available" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20"
              >
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonials Section */}
      <section className="relative py-20 lg:py-32 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4 mr-2 fill-current" />
              Client Success Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Transforming Lives
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 block">
                One Session at a Time
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real people who found their path to better mental health
            </p>
          </div>

          {/* Testimonial Carousel */}
          <div className="relative max-w-4xl mx-auto">
            {/* Main testimonial display */}
            <div className="overflow-hidden rounded-3xl">
              <div 
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <TestimonialCard {...testimonial} />
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Navigation */}
            <div className="flex items-center justify-between mt-8">
              {/* Previous Button */}
              <button
                onClick={prevTestimonial}
                className="group flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-blue-600 text-gray-600 hover:text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:block font-medium">Previous</span>
              </button>

              {/* Dot Indicators with progress */}
              <div className="flex items-center space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToTestimonial(index)}
                    className={`relative w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'bg-blue-600 scale-125 shadow-lg' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  >
                    {index === currentTestimonial && isAutoRotating && (
                      <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping" />
                    )}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={nextTestimonial}
                className="group flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-blue-600 text-gray-600 hover:text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="hidden sm:block font-medium">Next</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Auto-rotation control */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
              >
                {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isAutoRotating ? 'Pause' : 'Play'} slideshow</span>
              </button>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 lg:p-12 text-white">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Ready to Start Your Journey?
              </h3>
              <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
                Join thousands of people who have already taken the first step towards better mental health
              </p>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105">
                Book Your First Session
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CounselingLandingSections;