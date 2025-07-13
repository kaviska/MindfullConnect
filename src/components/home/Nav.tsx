'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData); // userData is already the user object, not wrapped
      } else if (response.status === 403) {
        // Counselor not approved - still show as logged in but redirect to pending page
        const errorData = await response.json();
        if (errorData.requiresApproval) {
          // You might want to handle this differently - maybe show a different UI state
          console.log('Counselor pending approval');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getDashboardUrl = () => {
    if (user?.role === 'counselor') return '/counsellor';
    if (user?.role === 'User') return '/patient';
    return '/dashboard';
  };

  const getDashboardButtonText = () => {
    if (user?.role === 'counselor') return 'Counsellor Dashboard';
    if (user?.role === 'User') return 'Patient Dashboard';
    return 'Dashboard';
  };

  // Filter navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { href: "/", label: "Home" },
      { href: "/blogMC", label: "Blog" },
      { href: "/find-counselor", label: "Find a Counselor" }
    ];

    // Only show "Join as a Counselor" if user is not a counselor
    if (!user || user.role !== 'counselor') {
      baseItems.push({ href: "/join-as-counselor", label: "Join as a Counselor" });
    }

    return baseItems;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 w-full border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <img
                className="h-10 w-auto transition-transform hover:scale-105"
                src="/logo.png"
                alt="MindfullConnect"
              />
            </Link>
            
            {/* Desktop menu items */}
            <div className="hidden md:ml-12 md:flex md:space-x-8">
              {getNavigationItems().map((item) => (
                <NavLink key={item.href} href={item.href}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Auth section - desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="flex space-x-3">
                <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-full"></div>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={getDashboardUrl()}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <User className="h-4 w-4" />
                  <span className="font-medium">{getDashboardButtonText()}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/login" 
                  className="bg-transparent text-gray-700 hover:text-blue-600 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border-2 border-gray-300 hover:border-blue-500 hover:shadow-sm"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition-all duration-200"
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
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {getNavigationItems().map((item) => (
              <MobileNavLink key={item.href} href={item.href}>
                {item.label}
              </MobileNavLink>
            ))}
            
            <div className="pt-4 border-t border-gray-200 space-y-2">
              {user ? (
                <>
                  <MobileNavLink 
                    href={getDashboardUrl()} 
                    className="flex items-center space-x-2 text-gray-700 font-medium"
                  >
                    <User className="h-4 w-4" />
                    <span>{getDashboardButtonText()}</span>
                  </MobileNavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center space-x-2 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink href="/login" className="text-gray-700 hover:bg-gray-50">
                    Login
                  </MobileNavLink>
                  <MobileNavLink 
                    href="/signup" 
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500 text-center"
                  >
                    Sign Up
                  </MobileNavLink>
                </>
              )}
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
    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 relative group"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
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
    className={`block px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
      className ? className : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
    }`}
  >
    {children}
  </Link>
);

export default Nav;