"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { WPProperty, getFeaturedImage, MOCK_PROPERTIES } from '@/lib/wordpress';
import VideoPlayer from '@/components/VideoPlayer';
import { MapPin, Phone, MessageSquare, ShieldCheck, Download, CheckCircle, ChevronRight, X } from 'lucide-react';

const DEVELOPER_BIOS: Record<string, { description: string; established: string; projects: string }> = {
  "Eldeco Group": {
    established: "1985",
    projects: "150+",
    description: "Eldeco Group has been at the forefront of Real Estate development in North India since 1985. The group is synonymous with timely delivery, high-quality construction, and customer-centric design in residential, commercial, and township sectors."
  },
  "Godrej Properties": {
    established: "1990",
    projects: "120+",
    description: "Godrej Properties brings the Godrej Group philosophy of innovation, sustainability, and excellence to the real estate industry. Each Godrej development combines a legacy of trust with cutting-edge design and technology."
  },
  "M3M Group": {
    established: "2010",
    projects: "45+",
    description: "M3M (Magnificence in the Trinity of Men, Materials & Money) Group is one of India's fastest-growing luxury real estate developers. M3M is known for its iconic sky condominiums, high-street retail, and world-class commercial developments."
  },
  "County Group": {
    established: "2007",
    projects: "15+",
    description: "County Group is a premium luxury developer in Noida, famous for creating landmark projects like Cleo County, Orange County, and County 107. They focus on bringing unique lifestyle concepts, elevated skywalks, and high-end landscaping."
  },
  "ATS Group": {
    established: "1998",
    projects: "50+",
    description: "ATS Infrastructure is an established real estate leader in NCR, known for high quality construction, lush green landscapes, and beautiful Mediterranean architecture. ATS projects command a premium for their structural longevity."
  },
  "Max Estates": {
    established: "2016",
    projects: "10+",
    description: "Max Estates, the real estate arm of the Max Group, aims to bring the Group's values of Sevabhav, Excellence, and Credibility to Indian real estate. They specialize in design-led, wellness-centered residential and commercial hubs."
  }
};

const getDeveloperBio = (devName: string) => {
  const cleanName = devName.toLowerCase();
  for (const [key, bio] of Object.entries(DEVELOPER_BIOS)) {
    if (cleanName.includes(key.toLowerCase()) || key.toLowerCase().includes(cleanName)) {
      return { name: key, ...bio };
    }
  }
  return {
    name: devName,
    established: "N/A",
    projects: "Multiple",
    description: `${devName} is a prominent developer committed to delivering premium architectural designs and structural quality in the Noida and Delhi NCR real estate markets.`
  };
};

interface Props {
  property: WPProperty;
}

export default function PropertyClient({ property }: Props) {
  const router = useRouter();
  const acf = property.acf || {};
  const featuredImage = getFeaturedImage(property);
  const developerBio = getDeveloperBio(acf.developer || "Eldeco Group");

  // States
  const [activeFloorPlan, setActiveFloorPlan] = useState<number>(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', budget: '', type: '3BHK' });

  // Scroll visibility tracker for sticky subnav offset
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 80) {
        if (currentScrollY > lastScrollY) {
          setIsNavbarVisible(false); // Scroll Down -> hide main navbar, subnav moves to top-0
        } else {
          setIsNavbarVisible(true); // Scroll Up -> show main navbar, subnav moves to top-[80px]
        }
      } else {
        setIsNavbarVisible(true); // Near top -> show main navbar
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Handle Form Submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setFormSubmitted(true);
    
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: 'Property Details Page Sidebar',
          name: formData.name,
          phone: formData.phone,
          budget: formData.budget,
          type: formData.type,
          project: property.title.rendered,
        }),
      });
    } catch (apiError) {
      console.error('Failed to forward lead to API:', apiError);
    }

    // Redirect to Thank You page after a short delay
    setTimeout(() => {
      router.push('/thank-you');
    }, 800);
  };

  // Scroll Helper
  const scrollNav = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 130, // Account for sticky headers
        behavior: 'smooth'
      });
    }
  };

  // Extract Highlights
  const highlightsList = acf.highlights 
    ? acf.highlights.split(';') 
    : [
        "7 standalone towers, v/s sprawling density",
        "Wide spread open spaces for optimal airflow",
        "Wraparound corner balconies in every unit",
        "All apartments face greens or water features",
        "Swimming pool and heated kids' pool",
        "Lavish clubhouse with premium amenities",
        "Near upcoming Noida International Airport",
        "Close to Noida Metro Sector 148 Line"
      ];

  // Extract Location Advantages
  const locationAdvantagesList = acf.location_advantages
    ? acf.location_advantages.split(';')
    : [
        "Seamless access to Noida Expressway, Yamuna Expressway & FNG Expressway",
        "Close proximity to Noida International Airport",
        "Near Sector 148 Metro Station (Aqua Line)",
        "Close to Sector 153 & Sector 154 Industrial Areas",
        "Sector 150 Noida - 1.5 km"
      ];

  // Extract Gallery
  const gallery = property.property_gallery && property.property_gallery.length > 0 
    ? property.property_gallery 
    : [
        featuredImage,
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
      ];

  // Extract Floor Plans
  const floorPlans = [
    {
      id: 1,
      title: acf.floor_plan_1_title || "3BHK",
      size: "1825 - 2100 sq.ft",
      desc: acf.floor_plan_1_desc || "1825 sq. ft. to 2100 sq. ft. size.",
      image: acf.floor_plan_1_image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: acf.floor_plan_2_title || "4BHK",
      size: "2850 sq.ft",
      desc: acf.floor_plan_2_desc || "2850 sq. ft. size.",
      image: acf.floor_plan_2_image || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: acf.floor_plan_3_title || "Duplex",
      size: "3400 sq.ft",
      desc: acf.floor_plan_3_desc || "3400 Sq. Ft. size.",
      image: acf.floor_plan_3_image || "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
    }
  ];

  // Extract Amenities
  let amenities = [];
  for (let i = 1; i <= 8; i++) {
    const name = acf[`amenity_${i}_name` as keyof typeof acf];
    const icon = acf[`amenity_${i}_icon` as keyof typeof acf];
    if (name && icon) {
      amenities.push({ id: i, name, icon });
    }
  }
  if (amenities.length === 0) {
    amenities = [
      { id: 1, name: "Pickleball Court", icon: "https://cdn-icons-png.flaticon.com/512/8145/8145100.png" },
      { id: 2, name: "Swimming Pool", icon: "https://cdn-icons-png.flaticon.com/512/4831/4831206.png" },
      { id: 3, name: "Jogging Track", icon: "https://cdn-icons-png.flaticon.com/512/3014/3014169.png" },
      { id: 4, name: "Senior Garden", icon: "https://cdn-icons-png.flaticon.com/512/3063/3063076.png" },
      { id: 5, name: "Multipurpose Court", icon: "https://cdn-icons-png.flaticon.com/512/8145/8145100.png" },
      { id: 6, name: "Kids Play Area", icon: "https://cdn-icons-png.flaticon.com/512/3063/3063076.png" },
      { id: 7, name: "Water Plaza", icon: "https://cdn-icons-png.flaticon.com/512/4831/4831206.png" },
      { id: 8, name: "Reflexology Path", icon: "https://cdn-icons-png.flaticon.com/512/3014/3014169.png" },
    ];
  }

  // Related Videos
  const relatedVideos = MOCK_PROPERTIES
    .filter(p => p.slug !== property.slug)
    .slice(0, 2)
    .map(p => ({
      title: `${p.title.rendered} — Sector ${p.acf.location?.match(/\d+/)?.[0] || '150'} Analysis`,
      slug: p.slug
    }));

  return (
    <div className="bg-brand-pale text-brand-ink min-h-screen flex flex-col font-sans pb-20 md:pb-0">
      
      {/* 1. Header Info Banner (Dark Teal) */}
      <section className="bg-brand-dark text-white pt-28 pb-10 px-4 sm:px-6 lg:px-8 border-b border-brand-light/20 relative">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center text-brand-pale/60 text-xs mb-4 uppercase tracking-widest font-bold">
            <Link href="/" className="hover:text-brand-accent">Home</Link>
            <ChevronRight size={12} className="mx-2" />
            <Link href="/properties" className="hover:text-brand-accent">Projects</Link>
            <ChevronRight size={12} className="mx-2" />
            <span className="text-brand-accent">{property.title.rendered}</span>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold heading-playfair mb-3 leading-tight tracking-tight text-white uppercase">
                {property.title.rendered}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-brand-pale text-sm md:text-base font-light">
                <span className="flex items-center text-brand-accent">
                  <MapPin size={18} className="mr-1.5" />
                  {acf.location || "Sector 150, Noida"}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-light"></span>
                <span className="bg-brand-accent/20 text-brand-accent border border-brand-accent/30 text-xs px-3 py-1 rounded font-bold uppercase tracking-wider">
                  {acf.possession_date ? (acf.possession_date.includes('Ready') ? 'Ready to Move' : 'New Launch') : 'New Launch'}
                </span>
                <span className="bg-brand-primary/40 text-brand-pale border border-brand-light/30 text-xs px-3 py-1 rounded font-bold uppercase tracking-wider">
                  {acf.property_type || "Residential"}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4 w-full lg:w-auto">
              <div className="bg-brand-accent text-brand-dark px-6 py-3 rounded-lg font-bold text-2xl shadow-xl tracking-tight leading-none text-center border border-amber-400 w-full lg:w-auto">
                {acf.price || "₹ 2.35 Cr - 4.65 Cr"}
              </div>
              <div className="flex gap-2 w-full lg:w-auto justify-end">
                <button onClick={() => scrollNav('contact-form')} className="btn-outline border-brand-light text-brand-pale hover:bg-brand-light hover:text-white px-4 py-2 text-xs rounded font-bold transition-all flex-grow lg:flex-grow-0">
                  Request Callback
                </button>
                <button onClick={() => scrollNav('saraansh-review')} className="btn-primary px-4 py-2 text-xs rounded font-bold transition-all shadow-md flex-grow lg:flex-grow-0">
                  Watch Full Review
                </button>
                <button onClick={() => scrollNav('contact-form')} className="btn-outline border-brand-light text-brand-pale hover:bg-brand-light hover:text-white px-4 py-2 text-xs rounded font-bold transition-all flex-grow lg:flex-grow-0">
                  Get Brochure
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sticky Sub-Navigation Bar */}
      <div className={`sticky ${isNavbarVisible ? 'top-[80px]' : 'top-0'} z-40 bg-brand-dark/90 backdrop-blur-md text-brand-pale border-y border-brand-accent/20 shadow-lg transition-all duration-300 block`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-start gap-6 md:gap-8 py-3.5 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest overflow-x-auto whitespace-nowrap scrollbar-none">
          <button onClick={() => scrollNav('overview')} className="hover:text-brand-accent transition-colors">Overview</button>
          <button onClick={() => scrollNav('saraansh-review')} className="hover:text-brand-accent transition-colors">Saraansh&apos;s Review</button>
          <button onClick={() => scrollNav('highlights')} className="hover:text-brand-accent transition-colors">Highlights</button>
          <button onClick={() => scrollNav('floorplan')} className="hover:text-brand-accent transition-colors">Floor Plan</button>
          <button onClick={() => scrollNav('amenities')} className="hover:text-brand-accent transition-colors">Amenities</button>
          <button onClick={() => scrollNav('price')} className="hover:text-brand-accent transition-colors">Price List</button>
          <button onClick={() => scrollNav('location')} className="hover:text-brand-accent transition-colors">Location</button>
          <button onClick={() => scrollNav('gallery')} className="hover:text-brand-accent transition-colors">Gallery</button>
          <button onClick={() => scrollNav('possession')} className="hover:text-brand-accent transition-colors">Possession</button>
          <button onClick={() => scrollNav('builder')} className="hover:text-brand-accent transition-colors">About Builder</button>
        </div>
      </div>

      {/* 3. Main Split Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          {/* LEFT COLUMN: 70% Width */}
          <div className="w-full lg:w-8/12 space-y-10">
            
            {/* overview section */}
            <div id="overview" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
              <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                Project Overview
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-brand-ink">
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Total Land</span>
                  <span className="text-base font-bold text-brand-dark">{acf.total_land || "7.5 Acres"}</span>
                </div>
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Configuration</span>
                  <span className="text-base font-bold text-brand-dark">{acf.configuration || "3BHK, 4BHK, Duplex"}</span>
                </div>
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Total Units</span>
                  <span className="text-base font-bold text-brand-dark">{acf.total_units || "350"}</span>
                </div>
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Total Floors</span>
                  <span className="text-base font-bold text-brand-dark">{acf.total_floors || "G + 30"}</span>
                </div>
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Units Per Floor</span>
                  <span className="text-base font-bold text-brand-dark">{acf.units_per_floor || "4"}</span>
                </div>
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Possession</span>
                  <span className="text-base font-bold text-brand-dark">{acf.possession_date || "July 2030"}</span>
                </div>
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Launch Date</span>
                  <span className="text-base font-bold text-brand-dark">{acf.launch_date || "Oct 2025"}</span>
                </div>
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Lifts Per Floor</span>
                  <span className="text-base font-bold text-brand-dark">{acf.lifts_per_floor || "3"}</span>
                </div>
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Base Price</span>
                  <span className="text-base font-bold text-brand-dark">{acf.base_price || "₹ 12,000 / sq.ft"}</span>
                </div>
              </div>
            </div>

            {/* saraansh interactive review */}
            <div id="saraansh-review" className="bg-brand-dark text-white rounded-2xl p-6 md:p-8 shadow-md border border-brand-primary">
              <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-accent border-b border-brand-light/20 pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                Saraansh Seth&apos;s Interactive
              </h2>
              
              <div className="space-y-6">
                {/* 16:9 embedded YouTube video */}
                <div className="bg-[#09221D] p-2 rounded-xl shadow-inner border border-brand-primary/30 overflow-hidden">
                  <VideoPlayer videoId={acf.video_id || "e-WJp9zY7o8"} title={property.title.rendered} />
                </div>
                
                {/* Video description callout underneath */}
                <div className="bg-brand-primary/40 border-l-4 border-brand-accent p-5 rounded-r-xl">
                  <p className="text-brand-pale text-sm md:text-base font-light italic leading-relaxed">
                    &ldquo;{acf.video_review_text || "A low density project with only 4 units per floor — check how the developer justified the price point. Watch the full video before you choose."}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* highlights section */}
            <div id="highlights" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
              <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                Project Highlights
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlightsList.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3 text-brand-ink">
                    <CheckCircle className="text-brand-primary mt-0.5 shrink-0" size={18} />
                    <span className="text-sm font-medium leading-relaxed">{highlight.trim()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* floor plans section */}
            <div id="floorplan" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
              <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                Floor Plans
              </h2>
              
              {/* Tabs */}
              <div className="flex gap-2 border-b border-brand-pale pb-4 mb-6">
                {floorPlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setActiveFloorPlan(plan.id)}
                    className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      activeFloorPlan === plan.id
                      ? 'bg-brand-primary text-white shadow-md'
                      : 'bg-brand-pale text-brand-primary hover:bg-brand-light/10'
                    }`}
                  >
                    {plan.title}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {floorPlans.map((plan) => {
                if (plan.id !== activeFloorPlan) return null;
                return (
                  <div key={plan.id} className="space-y-6 animate-fade-in">
                    <div className="aspect-[4/3] max-w-lg mx-auto bg-brand-pale rounded-xl border border-brand-light/20 relative overflow-hidden group cursor-zoom-in" onClick={() => { setLightboxIndex(plan.id + 5); setLightboxOpen(true); }}>
                      <img src={plan.image} alt={plan.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                        <span className="bg-brand-dark/80 text-white text-xs px-4 py-2 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity">Click to Expand</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2.5 justify-center">
                      <span className="bg-brand-accent/25 border border-brand-accent/40 text-brand-dark text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider">{plan.size}</span>
                      <span className="bg-brand-pale text-brand-primary text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider">Premium Specs</span>
                    </div>

                    <p className="text-center text-xs text-brand-light font-light leading-relaxed">
                      Floor plan images loaded from your WordPress media library. Click any to expand.
                    </p>
                  </div>
                );
              })}
            </div>

            {/* amenities section */}
            <div id="amenities" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
              <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                Premium Amenities
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-brand-ink">
                {amenities.map((amenity) => (
                  <div key={amenity.id} className="flex flex-col items-center justify-center p-5 border border-brand-pale rounded-xl bg-white hover:shadow-md hover:-translate-y-0.5 transition-all text-center">
                    <img src={amenity.icon} alt={amenity.name} className="w-12 h-12 mb-3 object-contain" />
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* price list section */}
            <div id="price" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
              <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                Price List
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-brand-pale bg-brand-pale/40 text-brand-primary font-bold uppercase text-xs tracking-wider">
                      <th className="py-3.5 px-4 rounded-tl-lg">Type</th>
                      <th className="py-3.5 px-4">Size</th>
                      <th className="py-3.5 px-4">Base Price</th>
                      <th className="py-3.5 px-4 rounded-tr-lg">Total Price</th>
                    </tr>
                  </thead>
                  <tbody className="text-brand-ink divide-y divide-brand-pale font-medium">
                    <tr className="hover:bg-brand-pale/10">
                      <td className="py-4 px-4 font-bold text-brand-dark">3 BHK</td>
                      <td className="py-4 px-4">1825 – 2100 sq.ft</td>
                      <td className="py-4 px-4">₹12,000/sq.ft</td>
                      <td className="py-4 px-4 text-brand-accent font-bold">₹2.35 Cr*</td>
                    </tr>
                    <tr className="hover:bg-brand-pale/10">
                      <td className="py-4 px-4 font-bold text-brand-dark">4 BHK</td>
                      <td className="py-4 px-4">2850 sq.ft</td>
                      <td className="py-4 px-4">₹12,000/sq.ft</td>
                      <td className="py-4 px-4 text-brand-accent font-bold">₹3.55 Cr*</td>
                    </tr>
                    <tr className="hover:bg-brand-pale/10">
                      <td className="py-4 px-4 font-bold text-brand-dark">Duplex</td>
                      <td className="py-4 px-4">3400 sq.ft</td>
                      <td className="py-4 px-4">₹12,000/sq.ft</td>
                      <td className="py-4 px-4 text-brand-accent font-bold">₹4.65 Cr*</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-[11px] text-brand-light leading-relaxed font-light italic">
                *PLCs + GST applicable. BSP of ₹12,000/sq.ft includes central air-conditioning, 10% discount on booking first 50 units.
              </div>
            </div>

            {/* location advantages & map section */}
            <div id="location" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
              <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                Location Advantages
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-3.5 text-brand-ink">
                  {locationAdvantagesList.map((adv, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="w-1 h-5 bg-brand-accent shrink-0 mt-1"></span>
                      <span className="text-sm font-semibold leading-relaxed">{adv.trim()}</span>
                    </div>
                  ))}
                </div>

                {/* Google Map frame */}
                <div className="w-full aspect-[21/9] bg-brand-pale rounded-xl overflow-hidden border border-brand-light/20 relative shadow-inner">
                  <iframe 
                    src={acf.google_map_embed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14041.517377561848!2d77.46535694999999!3d28.3776652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cc0272b144ab9%3A0x6b63f53835e5d16c!2sSector%20150%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy"
                    title="Google Map embed location"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* project gallery section */}
            <div id="gallery" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
              <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                Project Gallery
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.slice(0, 5).map((img, idx) => (
                  <div 
                    key={idx} 
                    className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer shadow-sm group"
                    onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                  >
                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                  </div>
                ))}
                
                {/* +9 More Card */}
                {gallery.length > 5 && (
                  <div 
                    className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer shadow-sm group bg-brand-dark flex flex-col items-center justify-center border border-brand-light/30"
                    onClick={() => { setLightboxIndex(5); setLightboxOpen(true); }}
                  >
                    <img src={gallery[5]} alt="Gallery extra" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-brand-dark/40"></div>
                    <div className="relative z-10 text-center text-white">
                      <span className="text-2xl font-bold font-sans tracking-wide block">+{gallery.length - 5}</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-brand-accent mt-1 block">View More</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* possession timelines section */}
            <div id="possession" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
              <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                Possession & Construction Status
              </h2>
              
              <div className="pt-6 pb-2 px-4">
                {/* Timeline slider bar */}
                <div className="relative w-full h-2.5 bg-brand-pale rounded-full border border-brand-light/10">
                  <div className="absolute left-0 top-0 h-full bg-brand-primary rounded-full w-[40%]"></div>
                  
                  {/* Nodes */}
                  <div className="absolute left-0 -top-2 flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-brand-primary border-4 border-white shadow-md flex items-center justify-center"></div>
                    <span className="text-[10px] font-bold text-brand-primary uppercase mt-2">Launch ({acf.launch_date || 'Oct 2025'})</span>
                  </div>
                  
                  <div className="absolute left-[40%] -top-2 flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-brand-accent border-4 border-white shadow-md flex items-center justify-center animate-pulse"></div>
                    <span className="text-[10px] font-bold text-brand-accent uppercase mt-2">New Launch</span>
                  </div>
                  
                  <div className="absolute right-0 -top-2 flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-brand-pale border-4 border-white shadow-sm flex items-center justify-center"></div>
                    <span className="text-[10px] font-bold text-brand-light uppercase mt-2">Possession ({acf.possession_date || 'Jul 2030'})</span>
                  </div>
                </div>

                <div className="bg-brand-pale/50 border border-brand-light/20 p-4 rounded-xl mt-12 flex justify-between items-center text-xs">
                  <span className="font-semibold text-brand-ink">Timeline Phase:</span>
                  <span className="font-bold text-brand-primary uppercase tracking-widest">New Launch - Booking Open</span>
                </div>
              </div>
            </div>

            {/* About Builder Section */}
            <div id="builder" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
              <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                About the Developer
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* Bio Description */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-brand-dark font-sans">{developerBio.name}</h3>
                  <p className="text-sm font-light text-brand-ink/80 leading-relaxed">
                    {developerBio.description}
                  </p>
                </div>
                
                {/* Stats Box */}
                <div className="bg-brand-pale/40 border border-brand-light/10 rounded-2xl p-5 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-primary tracking-wider block">Established</span>
                    <span className="text-base font-bold text-brand-dark">{developerBio.established}</span>
                  </div>
                  <div className="border-t border-brand-light/10 pt-3">
                    <span className="text-[10px] uppercase font-bold text-brand-primary tracking-wider block">Total Projects</span>
                    <span className="text-base font-bold text-brand-dark">{developerBio.projects}</span>
                  </div>
                  <div className="border-t border-brand-light/10 pt-3">
                    <span className="text-[10px] uppercase font-bold text-brand-primary tracking-wider block">Core Domain</span>
                    <span className="text-base font-bold text-brand-dark">Residential & Commercial</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: 30% Width (Sticky Sidebar) */}
          <div className="w-full lg:w-4/12 lg:sticky lg:top-[140px] space-y-6">
            
            {/* 1. Consultation Form Card */}
            <div id="contact-form" className="bg-brand-dark text-white rounded-2xl p-6 shadow-xl border border-brand-primary relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <div className="relative z-10">
                <h3 className="heading-playfair text-lg font-bold text-brand-accent uppercase tracking-wider mb-5 pb-2 border-b border-brand-light/20 text-center">
                  Book a free consultation
                </h3>

                {formSubmitted ? (
                  <div className="text-center py-8 bg-brand-primary/20 border border-brand-light/20 rounded-xl p-4 animate-fade-in">
                    <CheckCircle className="text-brand-accent mx-auto mb-3" size={36} />
                    <h4 className="font-bold text-white text-base mb-1">Enquiry Registered!</h4>
                    <p className="text-xs text-brand-pale leading-relaxed">Saraansh Seth will contact you on your phone shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <input 
                        type="text" 
                        placeholder="Your name" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-brand-primary/40 border border-brand-light/30 rounded-lg px-4 py-3 text-sm text-white placeholder-brand-pale/50 focus:outline-none focus:border-brand-accent font-semibold transition-colors"
                      />
                    </div>
                    <div>
                      <input 
                        type="tel" 
                        placeholder="Phone number" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-brand-primary/40 border border-brand-light/30 rounded-lg px-4 py-3 text-sm text-white placeholder-brand-pale/50 focus:outline-none focus:border-brand-accent font-semibold transition-colors"
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        placeholder="Budget (e.g. ₹2-3 Cr)" 
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                        className="w-full bg-brand-primary/40 border border-brand-light/30 rounded-lg px-4 py-3 text-sm text-white placeholder-brand-pale/50 focus:outline-none focus:border-brand-accent font-semibold transition-colors"
                      />
                    </div>
                    <div>
                      <select 
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full bg-brand-primary/40 border border-brand-light/30 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-accent font-semibold transition-colors"
                      >
                        <option value="3BHK" className="bg-brand-dark">Interested in 3 BHK</option>
                        <option value="4BHK" className="bg-brand-dark">Interested in 4 BHK</option>
                        <option value="Duplex" className="bg-brand-dark">Interested in Duplex</option>
                      </select>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full btn-primary font-bold rounded-lg py-3.5 transition-all shadow-md hover:shadow-lg text-sm uppercase tracking-wider"
                    >
                      Get Price Breakdown
                    </button>
                  </form>
                )}

                {/* Secondary Call Actions */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <a 
                    href={`https://wa.me/918076178189?text=Hi%20Saraansh,%20I'm%20interested%20in%20${encodeURIComponent(property.title.rendered)}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 border border-brand-light/30 bg-brand-primary/30 hover:bg-[#25D366] hover:text-white hover:border-transparent rounded-lg py-2.5 text-xs font-bold transition-all text-brand-pale"
                  >
                    <MessageSquare size={14} />
                    WhatsApp
                  </a>
                  <a 
                    href="tel:+918076178189" 
                    className="flex items-center justify-center gap-1.5 border border-brand-light/30 bg-brand-primary/30 hover:bg-brand-accent hover:text-brand-dark hover:border-transparent rounded-lg py-2.5 text-xs font-bold transition-all text-brand-pale"
                  >
                    <Phone size={14} />
                    Call Now
                  </a>
                </div>
              </div>
            </div>

            {/* 2. Fact Sheet Table */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-light/10 text-xs">
              <div className="divide-y divide-brand-pale">
                <div className="py-2.5 flex justify-between">
                  <span className="text-brand-light font-medium">Location</span>
                  <span className="font-bold text-brand-dark">{acf.location || "Sector 150, Noida"}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-brand-light font-medium">Type</span>
                  <span className="font-bold text-brand-dark">{acf.property_type || "Residential"}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-brand-light font-medium">Starting</span>
                  <span className="font-bold text-brand-accent">{acf.price?.split(' - ')[0] || "₹2.35 Cr"}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-brand-light font-medium">Possession</span>
                  <span className="font-bold text-brand-dark">{acf.possession_date || "July 2030"}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-brand-light font-medium">Developer</span>
                  <span className="font-bold text-brand-dark">{acf.developer || "Eldeco Group"}</span>
                </div>
              </div>
            </div>

            {/* 3. RERA Badge */}
            <div className="bg-brand-pale border border-brand-primary/20 rounded-2xl p-5 shadow-sm text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <ShieldCheck className="text-brand-primary" size={24} />
                <span className="text-xs uppercase font-bold tracking-wider text-brand-primary">UP-RERA Registered</span>
              </div>
              <div className="bg-brand-primary text-brand-accent px-4 py-2 rounded-lg text-sm font-bold border border-brand-accent/20 tracking-wider shadow-inner">
                {acf.rera_number || "UPRERAPRJ108729"}
              </div>
            </div>

            {/* 4. Download Brochure Button */}
            <a 
              href={`https://wa.me/918076178189?text=Hi%20Saraansh,%20please%20send%20me%20the%20${encodeURIComponent(property.title.rendered)}%20brochure.`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full border border-brand-primary text-brand-primary bg-white hover:bg-brand-primary hover:text-white rounded-xl py-3.5 text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md"
            >
              <Download size={16} />
              Download Brochure (WhatsApp)
            </a>

            {/* 5. More Project Videos */}
            <div className="bg-brand-dark text-white rounded-2xl p-5 shadow-sm border border-brand-primary">
              <h4 className="text-brand-accent text-xs font-bold uppercase tracking-wider mb-4 pb-2 border-b border-brand-light/20 flex items-center gap-1.5">
                <span className="w-1.5 h-3.5 bg-brand-accent rounded-full"></span>
                More project videos
              </h4>
              <div className="space-y-3">
                {relatedVideos.map((video, idx) => (
                  <Link 
                    key={idx} 
                    href={`/properties/${video.slug}`}
                    className="flex gap-3 items-center group"
                  >
                    <div className="w-16 h-10 bg-brand-light/35 rounded overflow-hidden relative flex-shrink-0 border border-brand-light/10">
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors">
                        <svg className="w-4 h-4 text-brand-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-bold text-brand-pale group-hover:text-brand-accent transition-colors line-clamp-2 leading-snug">
                        {video.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* LIGHTBOX LIGHTROOM MODAL */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center animate-fade-in">
          <button 
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-brand-accent transition-colors bg-white/10 p-2.5 rounded-full"
          >
            <X size={24} />
          </button>
          
          <div className="max-w-4xl max-h-[80vh] px-4 flex flex-col items-center justify-center">
            {lightboxIndex >= 6 ? (
              // Floor plan index
              <img 
                src={floorPlans[lightboxIndex - 6].image} 
                alt={floorPlans[lightboxIndex - 6].title} 
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl" 
              />
            ) : (
              // Gallery index
              <img 
                src={gallery[lightboxIndex]} 
                alt={`Lightbox image ${lightboxIndex + 1}`} 
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl" 
              />
            )}
            
            {/* Lightbox Info */}
            <div className="mt-6 text-center text-white text-sm">
              {lightboxIndex >= 6 ? (
                <>
                  <span className="font-bold block text-brand-accent text-lg">{floorPlans[lightboxIndex - 6].title} Layout</span>
                  <span className="text-xs text-brand-pale/80 font-light">{floorPlans[lightboxIndex - 6].desc}</span>
                </>
              ) : (
                <span className="font-semibold">{lightboxIndex + 1} / {gallery.length} • Project Photos</span>
              )}
            </div>
            
            {/* Gallery Mini Navigation */}
            {lightboxIndex < 6 && (
              <div className="flex gap-2 mt-4 overflow-x-auto max-w-lg p-1.5 bg-white/5 rounded-full">
                {gallery.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setLightboxIndex(idx)}
                    className={`w-10 h-8 rounded overflow-hidden relative shrink-0 transition-all ${
                      lightboxIndex === idx ? 'border-2 border-brand-accent scale-110 shadow-lg' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="mini" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Sticky bottom CTA bar (Call & WhatsApp) - property page details only */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-brand-dark/95 backdrop-blur-md border-t border-brand-light/20 p-4 shadow-2xl flex gap-3 md:hidden">
        <a 
          href={`https://wa.me/918076178189?text=Hi%20Saraansh,%20I'm%20interested%20in%20${encodeURIComponent(property.title.rendered)}.`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-xl py-3 text-sm font-bold transition-all shadow-md active:scale-95"
        >
          <MessageSquare size={16} />
          WhatsApp
        </a>
        <a 
          href="tel:+918076178189" 
          className="flex-1 flex items-center justify-center gap-2 btn-primary rounded-xl py-3 text-sm font-bold transition-all shadow-md active:scale-95"
        >
          <Phone size={16} />
          Call Now
        </a>
      </div>

    </div>
  );
}
