'use client';

export default function StickyNav() {
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
    <div className="sticky top-0 z-50 bg-[#1e2333] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-4 py-4 text-sm font-semibold uppercase tracking-wider">
        <button onClick={() => scrollNav('about')} className="hover:text-amber-500 transition-colors">About Project</button>
        <button onClick={() => scrollNav('highlights')} className="hover:text-amber-500 transition-colors">Highlights</button>
        <button onClick={() => scrollNav('floorplan')} className="hover:text-amber-500 transition-colors">Floor Plan</button>
        <button onClick={() => scrollNav('amenities')} className="hover:text-amber-500 transition-colors">Amenities</button>
        <button onClick={() => scrollNav('gallery')} className="hover:text-amber-500 transition-colors">Gallery</button>
        <button onClick={() => scrollNav('price')} className="hover:text-amber-500 transition-colors">Price List</button>
        <button onClick={() => scrollNav('location')} className="hover:text-amber-500 transition-colors">Location</button>
      </div>
    </div>
  );
}
