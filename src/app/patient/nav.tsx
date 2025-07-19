"use client"
import React, { PropsWithChildren, useState, useEffect, useRef } from 'react';
import { Bell, Target, FileText, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface NavLinkProps extends PropsWithChildren {
  href: string;
  active?: boolean;
}

const Nav = () => {
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is logged in by checking cookies or localStorage
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });
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

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ✅ Logout function
  const handleLogout = async () => {
    try {
      // Call your existing logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        // Clear any local storage or session storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear user state
        setUser(null);
        
        // Close dropdown
        setIsDropdownOpen(false);
        
        // Redirect to login page
        router.push('/login');
        
        console.log('✅ Logged out successfully');
      } else {
        console.error('Logout failed');
        // Even if API fails, clear local storage and redirect
        localStorage.clear();
        sessionStorage.clear();
        setUser(null);
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: clear everything and redirect
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ✅ Updated Logo/Brand Section */}
          <Link href="/patient" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">MC</span>
            </div>
            <span className="text-xl font-bold text-gray-900">MindfulConnect</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <NavLink href="/patient" active={pathname === '/patient'}>
              Home
            </NavLink>
            {user && (
              <>
                <NavLink href="/patient/my-goals" active={pathname === '/patient/my-goals'}>
                  <div className="flex items-center gap-2">
                    <Target size={16} />
                    My Goals
                  </div>
                </NavLink>
                <NavLink href="/patient/my-quizzes" active={pathname === '/patient/my-quizzes'}>
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    My Quizzes
                  </div>
                </NavLink>
              </>
            )}
            <NavLink href="#" active={false}>FAQ</NavLink>
            <NavLink href="#" active={false}>Services</NavLink>
            <NavLink href="/session" active={pathname === '/session'}>Find a Counsellor</NavLink>
          </nav>

          {/* Right Section - Avatar & Notifications */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            
            {/* ✅ User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <div className="relative">
                  {user?.profileImageUrl ? (
                    <img
                      className="h-10 w-10 rounded-full border-2 border-gray-200 object-cover"
                      src={user.profileImageUrl}
                      alt="Avatar"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full border-2 border-gray-200 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
                </div>
                <ChevronDown 
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* ✅ Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    {/* User Info */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.fullName || 'User'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <Link
                      href="/patient/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      My Profile
                    </Link>

                    <Link
                      href="/patient/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Link>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button className="p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
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
          : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  );
};

export default Nav;