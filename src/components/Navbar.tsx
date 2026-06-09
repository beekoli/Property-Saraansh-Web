import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-[#06282B] border-b border-[#1A3E42] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              {/* Placeholder for Logo - In a real app we'd use next/image */}
              <div className="text-[#E5C099] font-serif text-3xl font-bold tracking-wider">
                PS
              </div>
              <div className="flex flex-col text-white font-serif">
                <span className="text-lg leading-tight font-semibold">Property</span>
                <span className="text-sm leading-tight text-[#E5C099]">Saraansh</span>
              </div>
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
            <button className="text-white hover:text-[#E5C099] focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
