"use client";

import { useState } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { WPProperty } from '@/lib/wordpress';
import Link from 'next/link';

interface Props {
  properties: WPProperty[];
}

export default function PropertiesClient({ properties }: Props) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter States
  const [location, setLocation] = useState('All');
  const [type, setType] = useState('All');
  const [status, setStatus] = useState('All');
  const [maxBudget, setMaxBudget] = useState(10); // in Crores, 10 represents 10Cr+

  // Parse price string to numeric value in Crores for filtering
  const getMinPriceInCrores = (priceStr?: string): number => {
    if (!priceStr) return 0;
    
    // Extract numbers from string
    const cleanStr = priceStr.replace(/,/g, '').toLowerCase();
    const match = cleanStr.match(/(\d+\.?\d*)\s*(cr|lakh)/);
    
    if (match) {
      const val = parseFloat(match[1]);
      const unit = match[2];
      if (unit === 'cr') return val;
      if (unit === 'lakh') return val / 100;
    }
    
    // Check for ranges like "3.5 - 5.2" and grab the first one
    const rangeMatch = cleanStr.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
    if (rangeMatch) {
      return parseFloat(rangeMatch[1]);
    }
    
    return 0; // fallback if "Price on Request"
  };

  // Perform client-side filtering
  const filteredProjects = properties.filter((project) => {
    const acf = project.acf || {};
    
    // 1. Location Filter
    if (location !== 'All') {
      const projectLoc = (acf.location || '').toLowerCase();
      if (!projectLoc.includes(location.toLowerCase())) return false;
    }
    
    // 2. Type Filter
    if (type !== 'All') {
      const projectType = (acf.property_type || '').toLowerCase();
      if (!projectType.includes(type.toLowerCase())) return false;
    }
    
    // 3. Status Filter
    if (status !== 'All') {
      const projectStatus = (acf.possession_date || '').toLowerCase();
      const statusKey = status.toLowerCase();
      
      if (statusKey === 'ready to move') {
        if (!projectStatus.includes('ready')) return false;
      } else if (statusKey === 'under construction') {
        if (!projectStatus.includes('construction') && !projectStatus.includes('202')) return false;
      } else if (statusKey === 'new launch') {
        if (!projectStatus.includes('launch') && !projectStatus.includes('2025') && !projectStatus.includes('2026')) return false;
      }
    }
    
    // 4. Budget Filter (if maxBudget is less than 10, filter by price)
    if (maxBudget < 10) {
      const minPrice = getMinPriceInCrores(acf.price);
      if (minPrice > maxBudget && minPrice > 0) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-brand-pale flex flex-col">
      {/* Page Header */}
      <section className="bg-brand-dark pt-28 pb-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ 
            backgroundImage: `
              linear-gradient(rgba(212, 169, 106, 0.15) 1px, transparent 1px), 
              linear-gradient(90deg, rgba(212, 169, 106, 0.15) 1px, transparent 1px)
            `, 
            backgroundSize: '40px 40px' 
          }}
        ></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="heading-playfair text-4xl md:text-5xl text-brand-accent mb-4 font-bold">
            Discover Premium Projects
          </h1>
          <p className="text-brand-pale/80 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Handpicked residential and commercial properties in Noida with high ROI potential, verified reviews, and premium layouts.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-brand-dark border-y border-brand-light/20 py-8 px-4 sm:px-6 lg:px-8 shadow-lg z-10 relative -mt-6 mx-4 md:mx-8 rounded-2xl max-w-7xl lg:mx-auto lg:w-[calc(100%-4rem)] w-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-brand-accent uppercase tracking-widest mb-2">Location</label>
            <select 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-brand-primary/20 border border-brand-light/30 text-white rounded-lg p-3 outline-none focus:border-brand-accent text-sm font-semibold transition-colors"
            >
              <option value="All" className="bg-brand-dark text-white">All Locations</option>
              <option value="Sector 150" className="bg-brand-dark text-white">Sector 150</option>
              <option value="Sector 94" className="bg-brand-dark text-white">Sector 94</option>
              <option value="Sector 43" className="bg-brand-dark text-white">Sector 43</option>
              <option value="Sector 107" className="bg-brand-dark text-white">Sector 107</option>
              <option value="Sector 124" className="bg-brand-dark text-white">Sector 124</option>
              <option value="Sector 128" className="bg-brand-dark text-white">Sector 128</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-bold text-brand-accent uppercase tracking-widest mb-2">Type</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-brand-primary/20 border border-brand-light/30 text-white rounded-lg p-3 outline-none focus:border-brand-accent text-sm font-semibold transition-colors"
            >
              <option value="All" className="bg-brand-dark text-white">All Types</option>
              <option value="Residential" className="bg-brand-dark text-white">Residential</option>
              <option value="Commercial" className="bg-brand-dark text-white">Commercial</option>
              <option value="Plots" className="bg-brand-dark text-white">Plots</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-brand-accent uppercase tracking-widest mb-2">Status</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-brand-primary/20 border border-brand-light/30 text-white rounded-lg p-3 outline-none focus:border-brand-accent text-sm font-semibold transition-colors"
            >
              <option value="All" className="bg-brand-dark text-white">All Statuses</option>
              <option value="Ready to Move" className="bg-brand-dark text-white">Ready to Move</option>
              <option value="Under Construction" className="bg-brand-dark text-white">Under Construction</option>
              <option value="New Launch" className="bg-brand-dark text-white">New Launch</option>
            </select>
          </div>

          {/* Budget Range Slider */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-brand-accent uppercase tracking-widest">Max Budget</label>
              <span className="text-xs font-bold text-white bg-brand-primary/50 px-2 py-0.5 rounded border border-brand-light/30">
                {maxBudget === 10 ? '₹ 10 Cr+' : `₹ ${maxBudget} Cr`}
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={maxBudget}
              onChange={(e) => setMaxBudget(parseInt(e.target.value))}
              className="w-full h-2 bg-brand-primary/20 border border-brand-light/30 rounded-lg appearance-none cursor-pointer accent-brand-accent"
            />
          </div>

          {/* Search CTA */}
          <div>
            <button className="w-full btn-primary font-bold rounded-lg p-3 transition-all shadow-md hover:shadow-lg text-sm uppercase tracking-wider">
              Search Projects
            </button>
          </div>
        </div>
      </section>

      {/* Results & Grid Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full text-brand-ink">
        <div className="flex justify-between items-center mb-8 border-b border-brand-light/20 pb-4">
          <div className="font-semibold text-sm">
            Showing {filteredProjects.length} exclusive projects
          </div>
          <div className="flex bg-white rounded-lg border border-brand-light/10 p-1 shadow-sm">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-brand-pale text-brand-primary shadow-sm' : 'text-brand-light hover:text-brand-primary'}`}
              aria-label="Grid View"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/></svg>
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-brand-pale text-brand-primary shadow-sm' : 'text-brand-light hover:text-brand-primary'}`}
              aria-label="List View"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/></svg>
            </button>
          </div>
        </div>

        {/* Projects Render */}
        {filteredProjects.length > 0 ? (
          <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredProjects.map((project) => {
              const acf = project.acf || {};
              const bhks = acf.configuration ? acf.configuration.split(', ') : ["3 BHK", "4 BHK"];
              const imgUrl = acf.gallery_image_1 || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800";
              
              if (viewMode === 'list') {
                return (
                  <div key={project.id} className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-sm border border-brand-pale hover:shadow-xl transition-all">
                    {/* Left: Image (16:9 equivalent) */}
                    <div className="md:w-1/3 relative h-56 md:h-auto overflow-hidden bg-brand-pale">
                      <img 
                        src={imgUrl} 
                        alt={project.title.rendered} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                      />
                      <div className="absolute top-4 left-4 bg-brand-accent text-brand-dark px-3 py-1 rounded text-xs font-bold tracking-wide shadow-md">
                        {acf.property_type || 'Residential'}
                      </div>
                    </div>
                    {/* Right: Info */}
                    <div className="md:w-2/3 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2 gap-4">
                          <div>
                            <p className="text-[11px] text-brand-primary font-bold uppercase tracking-wider mb-1 leading-none">{acf.developer || 'Eldeco Group'}</p>
                            <h3 className="text-xl font-bold heading-playfair text-brand-ink">{project.title.rendered}</h3>
                          </div>
                          <div className="text-lg font-bold text-brand-accent text-right whitespace-nowrap">{acf.price || 'Price on Request'}</div>
                        </div>
                        
                        <div className="flex items-center text-brand-dark/70 mb-4 text-xs font-light">
                          <svg className="w-4 h-4 mr-1 text-brand-light flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {acf.location}
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {bhks.map((item, index) => (
                            <span key={index} className="bg-brand-pale text-brand-primary text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-4 border-t border-brand-pale pt-4">
                        <Link 
                          href={`/properties/${project.slug}?video=1`} 
                          className="flex-1 btn-outline text-center text-xs py-2.5 border border-brand-light text-brand-primary hover:bg-brand-light hover:text-white rounded font-bold"
                        >
                          Watch Review ▶
                        </Link>
                        <Link 
                          href={`/properties/${project.slug}`} 
                          className="flex-1 btn-primary text-center text-xs py-2.5 rounded font-bold"
                        >
                          Get Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <PropertyCard 
                  key={project.id}
                  id={project.slug}
                  title={project.title.rendered}
                  developer={acf.developer}
                  location={acf.location || "Noida"}
                  price={acf.price || "Price on Request"}
                  type={acf.property_type || "Residential"}
                  imageUrl={imgUrl}
                  bhk={bhks}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-brand-ink/60">
            <p className="text-lg">No projects match your search criteria. Please adjust filters and try again.</p>
          </div>
        )}
      </div>
    </div>
  );
}
