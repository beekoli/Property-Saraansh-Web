"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const isLightPage = mounted && (
    pathname === '/contact' || 
    pathname === '/commercial-properties' || 
    pathname === '/residential-properties' || 
    (pathname && pathname.startsWith('/blog/') && pathname !== '/blog')
  );

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        (isScrolled || isLightPage) ? 'bg-brand-dark border-b border-brand-light/20 shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Monogram */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group" onClick={closeMobileMenu}>
              {/* Monogram Monogram: deep teal background, sand gold letters */}
              <div className="w-10 h-10 rounded-full bg-brand-dark border border-brand-accent flex items-center justify-center shadow-md group-hover:border-brand-accent-light transition-colors">
                <span className="heading-playfair text-brand-accent font-bold text-lg tracking-wider group-hover:text-brand-accent-light">PS</span>
              </div>
              <div className="flex flex-col">
                <span className="heading-playfair font-bold text-white text-base tracking-wide group-hover:text-brand-accent transition-colors leading-tight">Property Saraansh</span>
                <span className="text-[10px] text-brand-accent uppercase tracking-widest leading-none font-semibold">Real Estate Consultancy</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="text-white hover:text-brand-accent transition-colors font-medium text-sm">Home</Link>
            <Link href="/about-us" className="text-white hover:text-brand-accent transition-colors font-medium text-sm">About</Link>
            <Link href="/our-videos" className="text-white hover:text-brand-accent transition-colors font-medium text-sm">Our Videos</Link>
            
            {/* Projects Dropdown */}
            <div 
              className="relative group py-2"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button 
                className="text-white hover:text-brand-accent transition-colors font-medium text-sm flex items-center gap-1 focus:outline-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Projects
                <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`absolute left-0 mt-2 w-48 bg-brand-dark border border-brand-light/30 rounded-lg shadow-xl py-2 z-50 transition-all duration-200 origin-top-left ${
                  isDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                }`}
              >
                <Link href="/properties" onClick={closeMobileMenu} className="block px-4 py-2 text-sm text-brand-pale hover:bg-brand-light hover:text-white transition-colors">All Projects</Link>
                <Link href="/commercial-properties" onClick={closeMobileMenu} className="block px-4 py-2 text-sm text-brand-pale hover:bg-brand-light hover:text-white transition-colors">Commercial</Link>
                <Link href="/residential-properties" onClick={closeMobileMenu} className="block px-4 py-2 text-sm text-brand-pale hover:bg-brand-light hover:text-white transition-colors">Residential</Link>
              </div>
            </div>
            
            <Link href="/blog" className="text-white hover:text-brand-accent transition-colors font-medium text-sm">Blog</Link>
            <Link href="/contact" className="text-white hover:text-brand-accent transition-colors font-medium text-sm">Contact</Link>
          </div>

          {/* Consultation CTA */}
          <div className="hidden md:flex">
             <Link href="/contact" className="bg-brand-accent text-brand-dark px-6 py-2.5 rounded font-bold hover:bg-brand-accent-light transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm">
              Free Consultation
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMobileMenu}
              className="text-white hover:text-brand-accent focus:outline-none"
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
        <div className="md:hidden bg-brand-dark border-t border-brand-light/20 shadow-xl absolute w-full left-0">
          <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
            <Link href="/" onClick={closeMobileMenu} className="text-white hover:text-brand-accent block py-2 text-base font-medium">Home</Link>
            <Link href="/about-us" onClick={closeMobileMenu} className="text-white hover:text-brand-accent block py-2 text-base font-medium">About</Link>
            <Link href="/our-videos" onClick={closeMobileMenu} className="text-white hover:text-brand-accent block py-2 text-base font-medium">Our Videos</Link>
            
            <div className="pl-2 border-l border-brand-light/30 space-y-1">
              <Link href="/properties" onClick={closeMobileMenu} className="text-brand-pale hover:text-brand-accent block py-1 text-sm">All Projects</Link>
              <Link href="/commercial-properties" onClick={closeMobileMenu} className="text-brand-pale hover:text-brand-accent block py-1 text-sm">Commercial Projects</Link>
              <Link href="/residential-properties" onClick={closeMobileMenu} className="text-brand-pale hover:text-brand-accent block py-1 text-sm">Residential Projects</Link>
            </div>

            <Link href="/blog" onClick={closeMobileMenu} className="text-white hover:text-brand-accent block py-2 text-base font-medium">Blog</Link>
            <Link href="/contact" onClick={closeMobileMenu} className="text-white hover:text-brand-accent block py-2 text-base font-medium">Contact</Link>
            <Link href="/contact" onClick={closeMobileMenu} className="bg-brand-accent text-brand-dark block text-center py-3 rounded font-bold mt-4 shadow-md">Free Consultation</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
