'use client';
import { PlayCircle, Image as ImageIcon, MapPin, Search } from 'lucide-react';

interface Props {
  titleHtml: string;
  price: string;
  location: string;
  featuredImage: string;
  gallery: string[];
}

export default function HeroSection({ titleHtml, price, location, featuredImage, gallery }: Props) {
  // Ensure we have exactly 5 images to fill the grid.
  const gridImages = [...gallery];
  while (gridImages.length < 5) {
    gridImages.push(featuredImage);
  }

  const scrollNav = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full bg-[#1e2333] pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Title & Info */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 uppercase tracking-wide font-serif" dangerouslySetInnerHTML={{ __html: titleHtml }} />
            <div className="flex items-center text-gray-300 text-sm md:text-base font-medium">
              <MapPin size={18} className="mr-2 text-amber-500" />
              {location}
            </div>
          </div>
          <div className="bg-amber-500 text-white px-6 py-2 rounded font-bold text-xl shadow-lg border border-amber-400">
            {price}
          </div>
        </div>

        {/* 5-Box Grid Container */}
        <div className="relative w-full h-[400px] md:h-[500px] flex gap-2 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Left Large Box (50%) */}
          <div className="w-full md:w-1/2 h-full relative group cursor-pointer overflow-hidden bg-black">
            <img src={gridImages[0]} alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Floating Navigation Pill */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex overflow-hidden">
              <button onClick={() => scrollNav('gallery')} className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors border-r border-gray-200">
                <ImageIcon size={16} className="text-[#1e2333] mr-2" />
                <span className="text-sm font-bold text-[#1e2333]">4+ Photos</span>
              </button>
              <button onClick={() => scrollNav('gallery')} className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors border-r border-gray-200">
                <PlayCircle size={16} className="text-[#1e2333] mr-2" />
                <span className="text-sm font-bold text-[#1e2333]">Videos</span>
              </button>
              <button onClick={() => scrollNav('floorplan')} className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors">
                <Search size={16} className="text-[#1e2333] mr-2" />
                <span className="text-sm font-bold text-[#1e2333]">Floor Plans</span>
              </button>
            </div>
          </div>

          {/* Right 4-Box Grid (50% - Hidden on Mobile) */}
          <div className="hidden md:grid w-1/2 h-full grid-cols-2 grid-rows-2 gap-2">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="relative w-full h-full group cursor-pointer overflow-hidden bg-black">
                <img src={gridImages[idx]} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
