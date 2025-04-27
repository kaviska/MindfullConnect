// components/Navbar.jsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bell } from 'lucide-react';

const StudioNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="bg-gray-50 shadow w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative h-10 w-10 mr-2">
                <Image 
                  src="/api/placeholder/40/40" 
                  alt="Logo" 
                  className="rounded-full"
                  width={40}
                  height={40}
                  priority
                />
              </div>
            </Link>
          </div>
          
          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-900 hover:text-gray-700 font-medium">
              Home
            </Link>
            <Link href="/blog" className="text-gray-900 hover:text-gray-700 font-medium">
              Blog
            </Link>
            <Link href="/find-counsellor" className="text-gray-900 hover:text-gray-700 font-medium">
              Find a Counsellor
            </Link>
            <Link href="/join" className="text-gray-900 hover:text-gray-700 font-medium">
              Join as a Counsellor
            </Link>
          </div>
          
          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Profile icon */}
            <div className="flex items-center">
              <div className="relative h-8 w-8">
                <Image 
                  src="/api/placeholder/32/32" 
                  alt="Profile" 
                  className="rounded-full border-2 border-gray-200"
                  width={32}
                  height={32}
                />
              </div>
            </div>
            
            {/* Notification bell */}
            <button className="text-gray-700 hover:text-gray-900">
              <Bell size={24} />
            </button>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <svg 
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg 
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100">
            Home
          </Link>
          <Link href="/blog" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100">
            Blog
          </Link>
          <Link href="/find-counsellor" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100">
            Find a Counsellor
          </Link>
          <Link href="/join" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100">
            Join as a Counsellor
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default StudioNavbar;