import Link from 'next/link';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* MindfulConnect Information */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">MindfulConnect</h3>
            <p className="text-sm mb-4">
              Connecting you with professional counsellors for your mental health journey.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <Facebook fontSize="small" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-400">
                <Twitter fontSize="small" />
              </a>
              <a href="#" className="text-gray-500 hover:text-pink-600">
                <Instagram fontSize="small" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-700">
                <LinkedIn fontSize="small" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/session" className="hover:text-blue-600 transition-colors">
                  Find a counsellor
                </Link>
              </li>
              <li>
                <Link href="/counsellor" className="hover:text-blue-600 transition-colors">
                  Join as a counsellor
                </Link>
              </li>
              {/* <li>
                <Link href="/progress-tracker" className="hover:text-blue-600 transition-colors">
                  Progress tracker
                </Link>
              </li> */}
              <li>
                <Link href="/get-started" className="hover:text-blue-600 transition-colors">
                  Get started
                </Link>
              </li>
            </ul>
          </div>

          {/* General */}
          <div>
            <h3 className="text-lg font-semibold mb-4">General</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-blue-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/Contact" className="hover:text-blue-600 transition-colors">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="" className="hover:text-blue-600 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-600 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-blue-600 transition-colors">
                  Refund policy
                </Link>
              </li>
              <li>
                {/* <Link href="/terms-and-conditions" className="hover:text-blue-600 transition-colors">
                  Terms and conditions
                </Link> */}
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-center">
          <p>© {new Date().getFullYear()} MindfulConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;