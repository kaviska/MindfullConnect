"use client"
import React, { PropsWithChildren, useState, useEffect } from 'react';
import { Bell, Target, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps extends PropsWithChildren {
  href: string;
  active?: boolean;
}

const Nav = () => {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in by checking cookies or localStorage
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData); // userData is the user object directly
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, []);

  return (
    <header className="w-full bg-[#E1F3FD] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Profile Section */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src="/ava2.svg"
                alt="Profile"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <NavLink href="/counsellor/dashboard" active={pathname === '/counsellor/dashboard'}>
              Dashboard
            </NavLink>
            <NavLink href="/counsellor/goals" active={pathname === '/counsellor/goals'}>
              Goals & Quizzes
            </NavLink>
            <NavLink href="/counsellor/patient-progress" active={pathname === '/counsellor/patient-progress'}>
              Patient Progress
            </NavLink>
            <NavLink href="/counsellor/patient-quiz-results" active={pathname === '/counsellor/patient-quiz-results'}>
              Quiz Results
            </NavLink>
            <NavLink href="/counsellor/sessions" active={pathname === '/counsellor/sessions'}>
              Sessions
            </NavLink>
          </nav>

          {/* Right Section - Avatar & Notifications */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-white/50 transition-colors">
              <Bell className="h-5 w-5 text-gray-500" />
            </button>
            <div className="relative">
              <img
                className="h-10 w-10 rounded-full border-2 border-gray-200"
                src={user?.profileImageUrl || "/ava2.svg"}
                alt="Avatar"
              />
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// NavLink component for consistent styling
const NavLink: React.FC<NavLinkProps> = ({ href, children, active = false }) => {
  return (
    <Link
      href={href}
      className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
        active
          ? 'border-blue-500 text-gray-900'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
      }`}
    >
      {children}
    </Link>
  );
};

export default Nav;