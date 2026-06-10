"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#06282B] border-b border-[#1A3E42] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center" onClick={closeMobileMenu}>
              <Image 
                src="/logo.png" 
                alt="Property Saraansh Logo" 
                width={200} 
                height={80} 
                className="h-16 w-auto object-contain"
                priority
              />
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-white hover:text-[#E5C099] transition-colors font-medium text-sm uppercase tracking-wider">Home</Link>
            <Link href="/about-us" className="text-white hover:text-[#E5C099] transition-colors font-medium text-sm uppercase tracking-wider">About Us</Link>
            <Link href="/our-videos" className="text-white hover:text-[#E5C099] transition-colors font-medium text-sm uppercase tracking-wider">Our Videos</Link>
            <Link href="/commercial-properties" className="text-white hover:text-[#E5C099] transition-colors font-medium text-sm uppercase tracking-wider">Commercial</Link>
            <Link href="/residential-properties" className="text-white hover:text-[#E5C099] transition-colors font-medium text-sm uppercase tracking-wider">Residential</Link>
            <Link href="/blog" className="text-white hover:text-[#E5C099] transition-colors font-medium text-sm uppercase tracking-wider">Blogs</Link>
          </div>

          <div className="hidden md:flex">
             <Link href="/contact" className="btn-primary">
              Enquire Now
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMobileMenu}
              className="text-white hover:text-[#E5C099] focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#06282B] border-t border-[#1A3E42]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <Link href="/" onClick={closeMobileMenu} className="text-white hover:text-[#E5C099] block px-3 py-2 rounded-md text-base font-medium">Home</Link>
            <Link href="/about-us" onClick={closeMobileMenu} className="text-white hover:text-[#E5C099] block px-3 py-2 rounded-md text-base font-medium">About Us</Link>
            <Link href="/our-videos" onClick={closeMobileMenu} className="text-white hover:text-[#E5C099] block px-3 py-2 rounded-md text-base font-medium">Our Videos</Link>
            <Link href="/commercial-properties" onClick={closeMobileMenu} className="text-white hover:text-[#E5C099] block px-3 py-2 rounded-md text-base font-medium">Commercial</Link>
            <Link href="/residential-properties" onClick={closeMobileMenu} className="text-white hover:text-[#E5C099] block px-3 py-2 rounded-md text-base font-medium">Residential</Link>
            <Link href="/blog" onClick={closeMobileMenu} className="text-white hover:text-[#E5C099] block px-3 py-2 rounded-md text-base font-medium">Blogs</Link>
            <Link href="/contact" onClick={closeMobileMenu} className="text-[#E5C099] font-bold block px-3 py-2 rounded-md text-base mt-4">Enquire Now</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
