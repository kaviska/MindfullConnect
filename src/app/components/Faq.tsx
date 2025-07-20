// ✅ Updated Faq.tsx - Modern, beautiful design
"use client";
import React, { useState } from 'react';
import Image from "next/image";
import Accordian from './Accordian';
import plusIcon from '../../../public/plus35621.svg';
import minusIcon from '../../../public/minusIcon.svg';
import { faqs } from './data';
import { ChevronDown, HelpCircle, MessageCircle, Search } from 'lucide-react';

const Faq = () => {
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
                    <Accordian 
                      answer={faq.answer}
                      question={faq.question} 
                      isAccordionOpen={faq.isAccordionOpen}
                      
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

export default Faq;
