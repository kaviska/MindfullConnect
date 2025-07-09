import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-white shadow-[0_2px_20px_rgba(0,0,0,0.05)] sticky top-0 z-[100]">
      <nav className="max-w-[1200px] mx-auto px-5 py-0 flex items-center justify-between h-[70px]">
        <a href="#" className="text-2xl font-bold text-[#0369a1] no-underline">Mindfull Connect</a>
        <ul className={`flex list-none gap-7 items-center ${isMobileMenuOpen ? 'flex-col absolute top-[70px] left-0 w-full bg-white p-5 shadow-md' : 'hidden md:flex'}`}>
          <li><a href="#" className="no-underline text-[#64748b] font-medium py-2 px-4 rounded-full hover:text-[#0369a1] hover:bg-[#f0f9ff] transition-all">Home</a></li>
          <li><a href="#" className="no-underline text-[#0369a1] font-medium py-2 px-4 rounded-full bg-[#e0f2fe]">Book Session</a></li>
          <li><a href="#" className="no-underline text-[#64748b] font-medium py-2 px-4 rounded-full hover:text-[#0369a1] hover:bg-[#f0f9ff] transition-all">My Bookings</a></li>
        </ul>
        <div className="flex items-center gap-5">
          <svg className="w-6 h-6 text-[#64748b] cursor-pointer hover:text-[#0369a1] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5-5c.55 0 1-.45 1-1V6a4 4 0 00-8 0v5c0 .55.45 1 1 1l-5 5h5m2 0a2 2 0 11-4 0"/>
          </svg>
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face&auto=format"
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-[#e0f2fe] hover:border-[#0369a1] transition-colors"
          />
          <div className="md:hidden flex flex-col cursor-pointer p-1" onClick={toggleMobileMenu}>
            <span className="w-6 h-[3px] bg-[#64748b] my-[3px] rounded transition-all"></span>
            <span className="w-6 h-[3px] bg-[#64748b] my-[3px] rounded transition-all"></span>
            <span className="w-6 h-[3px] bg-[#64748b] my-[3px] rounded transition-all"></span>
          </div>
        </div>
      </nav>
    </div>
  );
}