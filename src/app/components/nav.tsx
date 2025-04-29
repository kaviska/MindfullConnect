'use client'; // Add this directive at the top

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className=" shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="Logo"
              />
            </Link>
            
            {/* Desktop menu items */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/blog">Blog</NavLink>
              <NavLink href="/find-counselor">Find Counselor</NavLink>
              <NavLink href="/join-as-counselor">Join as Counselor</NavLink>
            </div>
          </div>

          {/* Auth buttons - desktop */}
          <div className="hidden md:flex items-center space-x-6 ml-5">
            <Link 
              href="/login" 
              className="bg-transparent-600 text-gray-700 text-black px-7 py-2 rounded-[25px]  text-sm font-medium transition-colors border-2 border-gray-500"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-[#70C6E6] hover:bg-blue-700 text-black px-7 py-2 rounded-[25px] text-sm font-medium transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition-colors"
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavLink href="/">Home</MobileNavLink>
            <MobileNavLink href="/blog">Blog</MobileNavLink>
            <MobileNavLink href="/find-counselor">Find Counselor</MobileNavLink>
            <MobileNavLink href="/join-as-counselor">Join as Counselor</MobileNavLink>
            <div className="pt-4 border-t border-gray-200">
              <MobileNavLink href="/login" className="text-gray-700">
                Login
              </MobileNavLink>
              <MobileNavLink 
                href="/signup" 
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Sign Up
              </MobileNavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// Reusable NavLink component for desktop
const NavLink = ({ 
  href, 
  children 
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
  >
    {children}
  </Link>
);

// Reusable MobileNavLink component
const MobileNavLink = ({ 
  href, 
  children,
  className = ''
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Link
    href={href}
    className={`block px-3 py-2 rounded-md text-base font-medium ${className} ${
      className.includes('bg-') 
        ? '' 
        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
    } transition-colors`}
  >
    {children}
  </Link>
);

export default Navbar;