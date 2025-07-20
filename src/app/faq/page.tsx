// ✅ Create src/app/faq/page.tsx
"use client";
import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, Search, Phone, Mail, Clock } from 'lucide-react';
import Footer from '@/components/home/Footer';
import Nav from '@/components/home/Nav'; // ✅ Add this import

// FAQ Data
const faqs = [
  {
    question: "How do I find the right counselor for me?",
    answer: `We make finding the right counselor easy with our comprehensive matching system:

• Browse counselor profiles with detailed specialties and backgrounds
• Use our filtering system to find counselors who specialize in your specific needs
• Read reviews and ratings from other clients
• Book a brief consultation call to ensure it's a good fit
• Our support team is also available to help match you with the perfect counselor`,
    isAccordionOpen: false,
  },
  {
    question: "How much does counseling cost?",
    answer: `Our pricing is transparent and affordable:

• Individual sessions: $75-150 per session
• Couple's therapy: $100-200 per session
• Group therapy: $30-60 per session
• Monthly subscription plans available starting at $200/month
• Many insurance plans accepted - we'll help verify your coverage
• Financial assistance programs available for qualifying individuals`,
    isAccordionOpen: false,
  },
  {
    question: "Is my information private and secure?",
    answer: `Your privacy and security are our top priorities:

• All conversations are end-to-end encrypted
• We comply with HIPAA regulations
• Data is stored on secure, encrypted servers
• We never share your information without your explicit consent
• You control what information is shared with your counselor
• Regular security audits and updates ensure maximum protection`,
    isAccordionOpen: false,
  },
  {
    question: "How do online therapy sessions work?",
    answer: `Online therapy sessions are convenient and effective:

• Sessions conducted via secure video calls
• Available on desktop, tablet, or mobile devices
• Same quality as in-person therapy with added convenience
• Flexible scheduling including evenings and weekends
• Chat messaging available between sessions
• Screen sharing and digital whiteboards for interactive sessions`,
    isAccordionOpen: false,
  },
  {
    question: "What if I need to cancel or reschedule a session?",
    answer: `We understand life happens and offer flexible options:

• Cancel or reschedule up to 24 hours before your session
• Emergency cancellations accepted with valid reasons
• Easy rescheduling through your client portal
• No cancellation fees for timely notice
• Automatic reminders sent 24 hours and 1 hour before sessions
• Makeup sessions available for emergency cancellations`,
    isAccordionOpen: false,
  },
  {
    question: "Do you accept insurance?",
    answer: `Yes, we work with most major insurance providers:

• We accept most PPO plans
• Many HMO plans with referrals
• Employee Assistance Programs (EAP)
• Health Savings Accounts (HSA) and Flexible Spending Accounts (FSA)
• We'll verify your benefits before your first session
• Direct billing available for most plans`,
    isAccordionOpen: false,
  },
  {
    question: "What types of therapy do you offer?",
    answer: `We offer a wide range of evidence-based therapeutic approaches:

• Cognitive Behavioral Therapy (CBT)
• Dialectical Behavior Therapy (DBT)
• Acceptance and Commitment Therapy (ACT)
• EMDR for trauma processing
• Family and couples therapy
• Group therapy sessions
• Specialized programs for anxiety, depression, PTSD, and more`,
    isAccordionOpen: false,
  },
  {
    question: "How do I get started?",
    answer: `Getting started is simple and takes just a few minutes:

1. Create your free account on our platform
2. Complete a brief assessment to help us understand your needs
3. Browse and select a counselor that matches your preferences
4. Schedule your first session at a time that works for you
5. Join your session from any device with internet access
6. Begin your journey to better mental health!`,
    isAccordionOpen: false,
  },
  {
    question: "What if I don't connect with my counselor?",
    answer: `Your comfort and progress are important to us:

• You can switch counselors at any time, no questions asked
• Our support team will help you find a better match
• No additional fees for switching counselors
• All your session history transfers to your new counselor (with your permission)
• We encourage trying at least 2-3 sessions before making a decision
• Exit surveys help us improve our matching process`,
    isAccordionOpen: false,
  },
  {
    question: "Is online therapy as effective as in-person therapy?",
    answer: `Research shows online therapy is just as effective as in-person therapy:

• Multiple studies confirm equivalent outcomes
• Many clients prefer the comfort and convenience of their own space
• Reduced travel time means more consistent attendance
• Technology enables innovative therapeutic tools and resources
• Particularly effective for anxiety, depression, and relationship issues
• Some clients actually open up more in a familiar environment`,
    isAccordionOpen: false,
  },
];

// Accordion Component
interface AccordionProps {
  question: string;
  answer: string;
  isAccordionOpen?: boolean;
  index: number;
}

const Accordion: React.FC<AccordionProps> = ({ 
  question, 
  answer, 
  isAccordionOpen = false,
  index 
}) => {
  const [isOpen, setIsOpen] = useState(isAccordionOpen);

  return (
    <div className="group">
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-blue-50/50 transition-all duration-200 focus:outline-none focus:bg-blue-50"
      >
        <div className="flex items-start gap-4 flex-1">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
            {index + 1}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 leading-relaxed">
            {question}
          </h3>
        </div>
        
        <div className={`ml-4 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 pb-6 ml-12">
          <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-blue-500">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FaqPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState(faqs);

  // Filter FAQs based on search
  React.useEffect(() => {
    const filtered = faqs.filter(
      faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFaqs(filtered);
  }, [searchTerm]);

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {/* ✅ Decorative Background Elements */}
      <Nav />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* ✅ Header Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-blue-100 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-6">
            <HelpCircle className="w-5 h-5" />
            Support Center
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6 leading-tight">
            Frequently Asked
            <br />
            <span className="text-blue-600">Questions</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Find quick answers to common questions about our mental health platform and services
          </p>

          {/* ✅ Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-500 shadow-lg"
              />
            </div>
          </div>

          {/* ✅ Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Common Questions</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="text-3xl font-bold text-green-600 mb-2">99%</div>
              <div className="text-gray-600">Issues Resolved</div>
            </div>
          </div>
        </section>

        {/* ✅ FAQ Section */}
        <section className="max-w-4xl mx-auto">
          {searchTerm && (
            <div className="mb-8 p-4 bg-blue-50 rounded-2xl border border-blue-200">
              <p className="text-blue-700 font-medium">
                {filteredFaqs.length > 0 
                  ? `Found ${filteredFaqs.length} result${filteredFaqs.length !== 1 ? 's' : ''} for "${searchTerm}"`
                  : `No results found for "${searchTerm}". Try different keywords.`
                }
              </p>
            </div>
          )}

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {filteredFaqs.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredFaqs.map((faq, index) => (
                  <div key={index} className="group hover:bg-gray-50/50 transition-colors duration-200">
                    <Accordion 
                      answer={faq.answer}
                      question={faq.question} 
                      isAccordionOpen={faq.isAccordionOpen}
                      index={index}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No FAQs Found</h3>
                <p className="text-gray-500">Try adjusting your search terms or browse all questions below.</p>
              </div>
            )}
          </div>

          {/* ✅ Contact Support Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-center text-white shadow-2xl">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
              <p className="text-blue-100 mb-8 text-lg">
                Can't find what you're looking for? Our support team is here to help you 24/7.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Contact Support
                </button>
                <button className="bg-white/20 text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-200 transform hover:scale-105">
                  Live Chat
                </button>
              </div>
            </div>
          </div>

          {/* ✅ Contact Methods */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-white/20">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Phone Support</h4>
              <p className="text-gray-600 text-sm mb-3">Speak with our support team</p>
              <p className="text-blue-600 font-semibold">1-800-MINDFUL</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-white/20">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Email Support</h4>
              <p className="text-gray-600 text-sm mb-3">Get help via email</p>
              <p className="text-green-600 font-semibold">support@mindfulconnect.com</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-white/20">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">24/7 Availability</h4>
              <p className="text-gray-600 text-sm mb-3">Round-the-clock support</p>
              <p className="text-purple-600 font-semibold">Always Here for You</p>
            </div>
          </div>

          {/* ✅ Popular Topics */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Popular Topics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Account Setup', 'Billing', 'Privacy', 'Sessions', 'Technical', 'Counselors', 'Security', 'Mobile App'].map((topic, index) => (
                <button 
                  key={index}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 text-center hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <div className="font-semibold text-gray-700">{topic}</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ✅ Footer */}
      <Footer />

      {/* ✅ Add required CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default FaqPage;