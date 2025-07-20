// ✅ Update Accordian.tsx for better styling
"use client";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordianProps {
  question: string;
  answer: string;
  isAccordionOpen?: boolean;
  index?: number;
}

const Accordian: React.FC<AccordianProps> = ({ 
  question, 
  answer, 
  isAccordionOpen = false,
  index = 0 
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

export default Accordian;