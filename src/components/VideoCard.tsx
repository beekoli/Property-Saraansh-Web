import Link from 'next/link';
import { getVideoSlug } from '@/lib/youtube';

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  date: string;
  duration: string;
}

export default function VideoCard({ id, title, thumbnail, category, date, duration }: VideoCardProps) {
  return (
    <Link href={`/our-videos/${getVideoSlug({ id, title })}`} className="group block bg-white rounded-xl overflow-hidden border border-brand-pale hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
      <div className="relative aspect-video overflow-hidden bg-brand-dark">
        {/* Real image integration placeholder */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${thumbnail})` }}
        ></div>
        
        <div className="absolute top-3 left-3 bg-brand-primary text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded shadow">
          {category}
        </div>
        
        <div className="absolute bottom-3 right-3 bg-brand-accent text-brand-dark text-xs font-bold px-2 py-0.5 rounded shadow">
          {duration}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-brand-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <svg className="w-16 h-16 text-brand-accent opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 delay-100" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-[15px] font-medium text-brand-ink mb-3 line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors">{title}</h3>
        <div className="flex items-center text-brand-light text-[13px]">
          <svg className="w-4 h-4 mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {date}
        </div>
      </div>
    </Link>
  );
}
