'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-8xl mx-14 px-4 sm:px-4 lg:px-6">
        <div className="flex justify-between h-26">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 m-6">
              <img
                className="h-12 w-auto"
                src="/logo.png"
                alt="Logo"
              />
            </Link>
            
            {/* Desktop menu items */}
            <div className="hidden md:ml-10 md:flex md:space-x-14 px-12">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/blogMC">Blog</NavLink>
              <NavLink href="/find-counselor">Find a Counselor</NavLink>
              <NavLink href="/join-as-counselor">Join as a Counselor</NavLink>
            </div>
          </div>

          {/* Auth buttons - desktop */}
          <div className="hidden md:flex items-center space-x-16 mr-10">
            <Link 
              href="/login" 
              className="bg-transparent text-gray-700 px-10 py-3 rounded-[30px] text-lg font-medium transition-colors border-2 border-gray-500 hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-[#70C6E6] hover:bg-blue-700 text-black px-10 py-3 rounded-[30px] text-lg font-medium transition-colors"
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
                <X className="h-8 w-8" />
              ) : (
                <Menu className="h-8 w-8" />
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
    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-lg font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
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
    className={`block px-3 py-3 rounded-md text-xl font-medium ${className} ${
      className.includes('bg-') 
        ? '' 
        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
    } transition-colors`}
  >
    {children}
  </Link>
);

export default Navbar;