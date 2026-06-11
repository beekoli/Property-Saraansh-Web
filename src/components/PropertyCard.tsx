import Link from 'next/link';

interface PropertyCardProps {
  id: string;
  title: string;
  developer?: string;
  location: string;
  price: string;
  type: string;
  imageUrl: string;
  bhk?: string[];
}

export default function PropertyCard({ id, title, developer = "Eldeco Group", location, price, type, imageUrl, bhk = ["2 BHK", "3 BHK"] }: PropertyCardProps) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-brand-pale hover:border-brand-light transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col h-full relative">
      <div className="relative aspect-video overflow-hidden w-full bg-brand-pale">
        <img 
          src={imageUrl} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          loading="lazy"
        />
        <div className="absolute top-4 left-4 bg-brand-accent text-brand-dark px-3 py-1 rounded text-xs font-bold tracking-wide shadow-md">
          {type}
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <p className="text-[11px] text-brand-primary font-bold uppercase tracking-wider mb-1 leading-none">{developer}</p>
          <h3 className="text-base font-bold heading-playfair text-brand-ink mb-2 line-clamp-1">{title}</h3>
          
          <div className="flex items-center text-brand-dark/70 mb-4 text-xs">
            <svg className="w-4 h-4 mr-1 text-brand-light flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{location}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {bhk.map((item, index) => (
              <span key={index} className="bg-brand-pale text-brand-primary text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                {item}
              </span>
            ))}
          </div>
        </div>
        
        <div className="border-t border-brand-pale pt-4">
          <div className="text-base font-bold text-brand-accent mb-4">{price}</div>
          <div className="flex gap-2">
            <Link 
              href={`/properties/${id}?video=1`} 
              className="flex-1 btn-outline text-center text-xs py-2 px-0 flex items-center justify-center gap-1 group/btn border border-brand-light text-brand-primary hover:bg-brand-light hover:text-white rounded font-bold"
            >
              Watch Review ▶
            </Link>
            <Link 
              href={`/properties/${id}`} 
              className="flex-1 btn-primary text-center text-xs py-2 px-0 bg-brand-accent text-brand-dark hover:bg-brand-accent-light rounded font-bold"
            >
              Get Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
