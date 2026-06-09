export default function Contact() {
  return (
    <div className="bg-[#0A1A1C] min-h-screen pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif text-[#E5C099] mb-4">Contact Us</h1>
          <p className="text-[#A0B2B4] max-w-2xl mx-auto">
            Ready to find your dream property? Get in touch with our experts today.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-[#06282B] rounded-xl overflow-hidden border border-[#1A3E42] shadow-2xl">
          
          {/* Contact Form */}
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-serif text-white mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#A0B2B4] mb-1">Full Name</label>
                <input type="text" id="name" className="w-full bg-[#0A1A1C] border border-[#1A3E42] rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#E5C099] transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#A0B2B4] mb-1">Phone Number</label>
                <input type="tel" id="phone" className="w-full bg-[#0A1A1C] border border-[#1A3E42] rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#E5C099] transition-colors" placeholder="+91 98765 43210" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#A0B2B4] mb-1">Email Address</label>
                <input type="email" id="email" className="w-full bg-[#0A1A1C] border border-[#1A3E42] rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#E5C099] transition-colors" placeholder="john@example.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#A0B2B4] mb-1">Your Requirements</label>
                <textarea id="message" rows={4} className="w-full bg-[#0A1A1C] border border-[#1A3E42] rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#E5C099] transition-colors" placeholder="I am looking for a commercial shop in Sector 150..."></textarea>
              </div>
              <button type="button" className="w-full btn-primary">
                Submit Enquiry
              </button>
            </form>
          </div>
          
          {/* Contact Info */}
          <div className="bg-[#1A3E42] p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-2xl font-serif text-white mb-8">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 text-[#E5C099] mt-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-4 text-[#A0B2B4]">
                  <h3 className="text-white font-medium">Office Address</h3>
                  <p className="mt-1">Noida, Uttar Pradesh<br/>India</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 text-[#E5C099] mt-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="ml-4 text-[#A0B2B4]">
                  <h3 className="text-white font-medium">Phone</h3>
                  <p className="mt-1">+91 XXXXX XXXXX</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 text-[#E5C099] mt-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4 text-[#A0B2B4]">
                  <h3 className="text-white font-medium">Email</h3>
                  <p className="mt-1">info@propertysaraansh.com</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <h3 className="text-white font-medium mb-4">Follow Us</h3>
              <div className="flex space-x-4 text-[#E5C099]">
                {/* Social Icons Placeholders */}
                <a href="#" className="hover:text-white transition-colors">YouTube</a>
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
