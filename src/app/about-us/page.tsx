export default function AboutUs() {
  return (
    <div className="bg-[#0A1A1C] min-h-screen pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-serif text-[#E5C099] mb-8 text-center">About Property Saraansh</h1>
        
        <div className="bg-[#06282B] rounded-xl p-8 md:p-12 shadow-2xl border border-[#1A3E42]">
          <h2 className="text-2xl text-white font-semibold mb-6">Noida&apos;s Most Trusted Real Estate Advisors</h2>
          
          <div className="space-y-6 text-[#A0B2B4] leading-relaxed">
            <p>
              Property Saraansh is a premier real estate consulting agency based in Noida. We specialize in providing transparent, data-driven, and highly researched property advisory services to our clients.
            </p>
            <p>
              With our strong presence on YouTube, we believe in educating our investors before they make a decision. Our in-depth video reviews of commercial and residential projects across Noida and Greater Noida have helped thousands of families and investors find their perfect property.
            </p>
            <p>
              Our mission is to bring absolute clarity to the real estate buying process, ensuring that every investment you make is secure, profitable, and aligned with your long-term goals.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 border border-[#1A3E42] rounded-lg">
              <div className="text-4xl text-[#E5C099] font-bold mb-2">500+</div>
              <div className="text-white text-sm uppercase tracking-wider">Happy Families</div>
            </div>
            <div className="p-6 border border-[#1A3E42] rounded-lg">
              <div className="text-4xl text-[#E5C099] font-bold mb-2">50+</div>
              <div className="text-white text-sm uppercase tracking-wider">Projects Reviewed</div>
            </div>
            <div className="p-6 border border-[#1A3E42] rounded-lg">
              <div className="text-4xl text-[#E5C099] font-bold mb-2">100K+</div>
              <div className="text-white text-sm uppercase tracking-wider">YouTube Subs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
