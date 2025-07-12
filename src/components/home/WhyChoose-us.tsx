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
  Star
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
  <div className="bg-rose-50 rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-rose-100 group">
    <div className="flex justify-center mb-4 text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    {description && (
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    )}
  </div>
);

const TestimonialCard: React.FC<TestimonialProps> = ({ image, quote, clientName, date, rating = 5 }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 min-h-[200px]">
    <div className="flex-shrink-0">
      <img 
        src={image} 
        alt={clientName}
        className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
      />
    </div>
    <div className="flex-1 text-center md:text-left">
      <div className="flex justify-center md:justify-start mb-2">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <blockquote className="text-gray-700 italic text-lg mb-4 leading-relaxed">
        "{quote}"
      </blockquote>
      <div className="text-sm text-gray-500">
        <div className="font-semibold text-gray-800">{clientName}</div>
        <div>{date}</div>
      </div>
    </div>
  </div>
);

const CounselingLandingSections: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const features: FeatureCardProps[] = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Secure & Confidential",
      description: "Your privacy is our priority with end-to-end encryption and HIPAA compliance"
    },
    {
      icon: <Monitor className="w-12 h-12" />,
      title: "100% Online & Flexible",
      description: "Access therapy from anywhere, anytime that works for your schedule"
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "Licensed Counselors",
      description: "Work with qualified, experienced mental health professionals"
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "One-to-one Sessions",
      description: "Personalized therapy sessions tailored to your unique needs"
    },
    {
      icon: <MessageCircle className="w-12 h-12" />,
      title: "Chats with Counselor",
      description: "Stay connected between sessions with secure messaging"
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Progress Tracker",
      description: "Monitor your mental health journey with detailed insights"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Why Choose Us Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            Why Choose Us?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience premium mental health care with our innovative platform designed around your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      {/* Client Testimonials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">
              See What Our Clients Have to Say!
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from people who transformed their lives with our support
            </p>
          </div>

          <div className="relative">
            {/* Testimonial Display */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <TestimonialCard {...testimonial} />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 text-blue-600 hover:text-blue-700"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 text-blue-600 hover:text-blue-700"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial 
                    ? 'bg-blue-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-rotation indicator */}
          <div className="text-center mt-4">
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isAutoRotating ? 'Pause' : 'Resume'} auto-rotation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CounselingLandingSections;