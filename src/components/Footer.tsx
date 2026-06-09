import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#031416] text-[#A0B2B4] py-12 border-t border-[#1A3E42]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="text-[#E5C099] font-serif text-3xl font-bold tracking-wider">
                PS
              </div>
              <div className="flex flex-col text-white font-serif">
                <span className="text-lg leading-tight font-semibold">Property</span>
                <span className="text-sm leading-tight text-[#E5C099]">Saraansh</span>
              </div>
            </Link>
            <p className="text-sm">
              Your trusted YouTube-based real estate consultancy in Noida. We provide expert property advisory and investment guidance.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-[#E5C099] transition-colors">Home</Link></li>
              <li><Link href="/about-us" className="hover:text-[#E5C099] transition-colors">About Us</Link></li>
              <li><Link href="/our-videos" className="hover:text-[#E5C099] transition-colors">Our Videos</Link></li>
              <li><Link href="/blog" className="hover:text-[#E5C099] transition-colors">Blogs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Properties</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/commercial-properties" className="hover:text-[#E5C099] transition-colors">Commercial in Noida</Link></li>
              <li><Link href="/residential-properties" className="hover:text-[#E5C099] transition-colors">Residential in Noida</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>Noida, Uttar Pradesh, India</li>
              <li><a href="mailto:info@propertysaraansh.com" className="hover:text-[#E5C099] transition-colors">info@propertysaraansh.com</a></li>
              <li><Link href="/contact" className="text-[#E5C099] hover:text-white transition-colors">Get in touch →</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-[#1A3E42] text-sm text-center flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Property Saraansh. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link href="#" className="hover:text-[#E5C099] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#E5C099] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
