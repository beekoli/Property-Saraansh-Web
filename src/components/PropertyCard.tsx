import Link from 'next/link';

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  imageUrl: string;
}

export default function PropertyCard({ id, title, location, price, type, imageUrl }: PropertyCardProps) {
  return (
    <div className="group bg-[#0A1A1C] rounded-xl overflow-hidden border border-[#1A3E42] hover:border-[#E5C099] transition-all duration-300 shadow-lg hover:shadow-2xl">
      <div className="relative h-64 overflow-hidden">
        {/* Placeholder for real image since we don't have actual property images yet */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
        <div className="absolute top-4 left-4 bg-[#E5C099] text-[#06282B] px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-md">
          {type}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[#E5C099] transition-colors">{title}</h3>
        <div className="flex items-center text-[#A0B2B4] mb-4 text-sm">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </div>
        
        <div className="flex items-center justify-between border-t border-[#1A3E42] pt-4 mt-4">
          <div className="text-lg font-bold text-[#E5C099]">{price}</div>
          <Link href={`/properties/${id}`} className="text-white hover:text-[#E5C099] text-sm font-medium transition-colors flex items-center">
            View Details
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
