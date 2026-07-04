"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { WPProperty, getFeaturedImage, MOCK_PROPERTIES } from '@/lib/wordpress';
import VideoPlayer from '@/components/VideoPlayer';
import { CheckCircle, MapPin, Phone, Download, ChevronDown, ChevronUp, ArrowLeft, X, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

// ─── helpers ──────────────────────────────────────────────────────────────────

function getAmenityIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('pool') || n.includes('swim'))
    return <span className="text-3xl mb-3">🏊</span>;
  if (n.includes('gym') || n.includes('fitness'))
    return <span className="text-3xl mb-3">🏋️</span>;
  if (n.includes('park') || n.includes('garden') || n.includes('green'))
    return <span className="text-3xl mb-3">🌳</span>;
  if (n.includes('club'))
    return <span className="text-3xl mb-3">🏛️</span>;
  if (n.includes('play') || n.includes('kids'))
    return <span className="text-3xl mb-3">🎪</span>;
  if (n.includes('court') || n.includes('sport') || n.includes('tennis') || n.includes('badminton') || n.includes('basketball') || n.includes('cricket') || n.includes('pickleball'))
    return <span className="text-3xl mb-3">🏸</span>;
  if (n.includes('yoga') || n.includes('meditation'))
    return <span className="text-3xl mb-3">🧘</span>;
  if (n.includes('jogging') || n.includes('track') || n.includes('running'))
    return <span className="text-3xl mb-3">🏃</span>;
  if (n.includes('library') || n.includes('reading'))
    return <span className="text-3xl mb-3">📚</span>;
  if (n.includes('amphitheater') || n.includes('amphitheatre'))
    return <span className="text-3xl mb-3">🎭</span>;
  if (n.includes('water') || n.includes('fountain') || n.includes('plaza'))
    return <span className="text-3xl mb-3">⛲</span>;
  if (n.includes('reflexo') || n.includes('path') || n.includes('walk'))
    return <span className="text-3xl mb-3">🚶</span>;
  if (n.includes('salon') || n.includes('spa'))
    return <span className="text-3xl mb-3">💆</span>;
  if (n.includes('cafe') || n.includes('restaurant') || n.includes('food'))
    return <span className="text-3xl mb-3">☕</span>;
  if (n.includes('banquet') || n.includes('hall') || n.includes('event'))
    return <span className="text-3xl mb-3">🎉</span>;
  if (n.includes('security') || n.includes('cctv') || n.includes('guard'))
    return <span className="text-3xl mb-3">🔒</span>;
  if (n.includes('parking') || n.includes('car'))
    return <span className="text-3xl mb-3">🚗</span>;
  if (n.includes('lift') || n.includes('elevator'))
    return <span className="text-3xl mb-3">🛗</span>;
  if (n.includes('concierge') || n.includes('lobby'))
    return <span className="text-3xl mb-3">🏨</span>;
  if (n.includes('multipurpose') || n.includes('multi'))
    return <span className="text-3xl mb-3">🎯</span>;
  if (n.includes('senior') || n.includes('elder'))
    return <span className="text-3xl mb-3">👴</span>;
  return <span className="text-3xl mb-3">✨</span>;
}

/** Pull the first src="…" from a Google Maps embed snippet, or return the raw string. */
function extractMapUrl(raw: string): string {
  if (!raw) return '';
  const m = raw.match(/src="([^"]+)"/);
  return m ? m[1] : raw;
}

/** Split a newline/semicolon-delimited advantages string into bullet strings. */
function parseLocationAdvantages(raw: string): string[] {
  return raw
    .split(/[\n;]+/)
    .map(s => s.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
}

// ─── prop type ────────────────────────────────────────────────────────────────

interface PropertyClientProps {
  property: WPProperty;
  allProperties: WPProperty[];
}

// ─── component ────────────────────────────────────────────────────────────────

export default function PropertyClient({ property, allProperties }: PropertyClientProps) {
  const router = useRouter();
  const acf = property.acf || {};
  const featuredImage = getFeaturedImage(property);

  // ── state ──
  const [activeFloorPlan, setActiveFloorPlan] = useState(1);
  const [activeSitePlanTab, setActiveSitePlanTab] = useState<'master' | 'site'>('master');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [isFloorPlanModalOpen, setIsFloorPlanModalOpen] = useState(false);
  const [floorPlanModalTitle, setFloorPlanModalTitle] = useState('');
  const [floorPlanForm, setFloorPlanForm] = useState({ name: '', phone: '' });
  const [floorPlanSubmitting, setFloorPlanSubmitting] = useState(false);
  const [floorPlanSubmitSuccess, setFloorPlanSubmitSuccess] = useState(false);
  const [floorPlanSubmitError, setFloorPlanSubmitError] = useState('');
  const [isFloorPlanTextExpanded, setIsFloorPlanTextExpanded] = useState(false);
  const [showFloorPlanReadMore, setShowFloorPlanReadMore] = useState(false);
  const [isPriceListTextExpanded, setIsPriceListTextExpanded] = useState(false);
  const [showPriceListReadMore, setShowPriceListReadMore] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  const floorPlanTextRef = useRef<HTMLParagraphElement>(null);
  const priceListTextRef = useRef<HTMLDivElement>(null);

  // ── sticky nav ──
  useEffect(() => {
    const handler = () => setIsSticky(window.scrollY > 80);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // ── read-more detection for floor plan footer text ──
  useEffect(() => {
    const el = floorPlanTextRef.current;
    if (el) setShowFloorPlanReadMore(el.scrollHeight > el.clientHeight + 2);
  }, [acf.floor_plan_footer_text, isFloorPlanTextExpanded]);

  // ── read-more detection for price list description ──
  useEffect(() => {
    const el = priceListTextRef.current;
    if (el) setShowPriceListReadMore(el.scrollHeight > el.clientHeight + 2);
  }, [acf.price_list_desc, isPriceListTextExpanded]);

  // ── keyboard handler for lightbox ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setLightboxIndex(i => Math.min(i + 1, gallery.length - 1));
      if (e.key === 'ArrowLeft') setLightboxIndex(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen]);

  const scrollNav = (id: string) => {
    setIsMobileNavOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 72;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // ── derived data ──

  // Extract Highlights
  const highlightsList = acf.highlights ? acf.highlights.split(';').map(h => h.trim()).filter(Boolean) : [];

  // Extract Location Advantages
  const locationAdvantagesList = acf.location_advantages
    ? parseLocationAdvantages(acf.location_advantages)
    : [];

  // Extract Gallery (only real ACF/property_gallery images, not the featured image)
  const gallery: string[] = [];
  for (let i = 1; i <= 10; i++) {
    const imgUrl = acf[`gallery_image_${i}` as keyof typeof acf];
    if (imgUrl && typeof imgUrl === 'string' && imgUrl.trim() !== '') {
      if (!gallery.includes(imgUrl)) {
        gallery.push(imgUrl);
      }
    }
  }
  if (property.property_gallery && property.property_gallery.length > 0) {
    property.property_gallery.forEach(imgUrl => {
      if (imgUrl && typeof imgUrl === 'string' && imgUrl.trim() !== '' && !gallery.includes(imgUrl)) {
        gallery.push(imgUrl);
      }
    });
  }
  // No fallback images — only show real gallery images

  // Extract Floor Plans
  const floorPlans = [
    {
      id: 1,
      title: acf.floor_plan_1_title,
      size: "",
      desc: acf.floor_plan_1_desc,
      image: acf.floor_plan_1_image
    },
    {
      id: 2,
      title: acf.floor_plan_2_title,
      size: "",
      desc: acf.floor_plan_2_desc,
      image: acf.floor_plan_2_image
    },
    {
      id: 3,
      title: acf.floor_plan_3_title,
      size: "",
      desc: acf.floor_plan_3_desc,
      image: acf.floor_plan_3_image
    }
  ].filter(plan => plan.title || plan.image);

  // Extract Amenities
  const amenities: { id: number; name: string; icon: string }[] = [];
  for (let i = 1; i <= 12; i++) {
    const name = acf[`amenity_${i}_name` as keyof typeof acf];
    const icon = acf[`amenity_${i}_icon` as keyof typeof acf];
    if (name) {
      amenities.push({ id: i, name, icon: icon || "" });
    }
  }

  // Extract Price List Rows (1 to 4)
  const priceList = [];
  for (let i = 1; i <= 4; i++) {
    const type = acf[`price_list_row_${i}_type` as keyof typeof acf];
    const size = acf[`price_list_row_${i}_size` as keyof typeof acf];
    const base = acf[`price_list_row_${i}_base` as keyof typeof acf];
    const total = acf[`price_list_row_${i}_total` as keyof typeof acf];
    
    if (type) {
      priceList.push({
        id: i,
        type,
        size: size || "",
        base: base || "",
        total: total || ""
      });
    }
  }

  // Extract FAQs (1 to 5 slots)
  const faqs = [];
  for (let i = 1; i <= 5; i++) {
    const question = acf[`faq_${i}_question` as keyof typeof acf];
    const answer = acf[`faq_${i}_answer` as keyof typeof acf];
    
    if (question && typeof question === 'string' && question.trim() &&
        answer && typeof answer === 'string' && answer.trim()) {
      faqs.push({
        id: i,
        question: question.trim(),
        answer: answer.trim()
      });
    }
  }

  // Extract Site Plan Image
  const sitePlanImage = acf.site_plan_image && typeof acf.site_plan_image === 'string' && acf.site_plan_image.trim() !== '' 
    ? acf.site_plan_image.trim() 
    : null;

  const masterLayoutImage = acf.master_layout_image && typeof acf.master_layout_image === 'string' && acf.master_layout_image.trim() !== ''
    ? acf.master_layout_image.trim()
    : null;

  // Only show amenities from ACF data; no hardcoded fallbacks

  // Related Videos
  const relatedVideos = allProperties
    .filter(p => p.slug !== property.slug)
    .slice(0, 2)
    .map(p => ({
      title: `${p.title.rendered} — Sector ${p.acf.location?.match(/\d+/)?.[0] || '150'} Analysis`,
      slug: p.slug
    }));

  const relatedProperties = allProperties
    .filter(p => p.slug !== property.slug)
    .slice(0, 3);

  return (
    <div className="bg-brand-pale text-brand-ink min-h-screen flex flex-col font-sans pb-20 md:pb-0">
      
      {/* ── Hero ── */}
      <div className="relative w-full h-[55vw] max-h-[420px] min-h-[220px] overflow-hidden">
        {featuredImage ? (
          <Image
            src={featuredImage}
            alt={property.title.rendered}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-brand-dark flex items-center justify-center">
            <span className="text-brand-pale/40 text-4xl font-bold">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/30 to-transparent" />

        {/* back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-10 bg-white/20 backdrop-blur-sm text-white rounded-full p-2 hover:bg-white/30 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        {/* hero text */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap gap-2 mb-2">
              {acf.location && (
                <span className="bg-brand-accent/90 text-brand-dark text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  📍 {acf.location}
                </span>
              )}
              {acf.possession_date && (
                <span className="bg-brand-primary/80 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {acf.possession_date.includes('Ready') ? '✅ Ready to Move' : '🚀 New Launch'}
                </span>
              )}
            </div>
            <h1 className="heading-playfair text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-md">
              {property.title.rendered}
            </h1>
            {acf.developer && (
              <p className="text-brand-pale/80 text-sm mt-1 font-medium">by {acf.developer}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Sticky Nav ── */}
      <div className={`sticky top-0 z-30 transition-all duration-300 ${isSticky ? 'bg-brand-dark/95 backdrop-blur-sm shadow-lg' : 'bg-brand-dark'}`}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* nav pills — desktop */}
          <nav className="hidden md:flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-brand-pale/70 flex-wrap">
            <button onClick={() => scrollNav('overview')} className="hover:text-brand-accent transition-colors">Overview</button>
            <span className="text-brand-pale/30">·</span>
            <button onClick={() => scrollNav('highlights')} className="hover:text-brand-accent transition-colors">Highlights</button>
            <span className="text-brand-pale/30">·</span>
            <button onClick={() => scrollNav('floorplan')} className="hover:text-brand-accent transition-colors">Floor Plan</button>
            <span className="text-brand-pale/30">·</span>
            <button onClick={() => scrollNav('amenities')} className="hover:text-brand-accent transition-colors">Amenities</button>
            <span className="text-brand-pale/30">·</span>
            <button onClick={() => scrollNav('price')} className="hover:text-brand-accent transition-colors">Price</button>
            <span className="text-brand-pale/30">·</span>
            <button onClick={() => scrollNav('location')} className="hover:text-brand-accent transition-colors">Location</button>
            <span className="text-brand-pale/30">·</span>
            <button onClick={() => scrollNav('gallery')} className="hover:text-brand-accent transition-colors">Gallery</button>
          </nav>

          {/* mobile hamburger */}
          <button
            className="md:hidden text-brand-pale/80 hover:text-brand-accent transition-colors"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            aria-label="Toggle navigation"
          >
            <Menu size={20} />
          </button>

          {/* CTA */}
          <a
            href="tel:+919999999999"
            className="flex items-center gap-1.5 bg-brand-accent text-brand-dark text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-full hover:bg-brand-accent/90 transition-colors shrink-0"
          >
            <Phone size={12} />
            Call Now
          </a>
        </div>

        {/* mobile nav dropdown */}
        {isMobileNavOpen && (
          <div className="md:hidden bg-brand-dark/98 border-t border-brand-light/10 px-4 py-3 grid grid-cols-3 gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-pale/70">
            {['overview','highlights','floorplan','amenities','price','location','gallery','possession','faq'].map(id => (
              <button key={id} onClick={() => scrollNav(id)} className="hover:text-brand-accent transition-colors text-left py-1">
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Price bar ── */}
      {(acf.price_range || acf.base_price) && (
        <div className="bg-brand-primary text-white px-4 py-3 text-center text-sm font-bold">
          {acf.price_range && <span>Starting ₹ {acf.price_range}</span>}
          {acf.base_price && acf.price_range && <span className="mx-2 opacity-50">·</span>}
          {acf.base_price && <span>Base Price: {acf.base_price}</span>}
        </div>
      )}

      {/* ── Main content ── */}
      <div className="max-w-4xl mx-auto w-full px-4 py-6 space-y-8 flex-1" id="overview">

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
              <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                Project Overview
              </h2>

              {acf.project_overview ? (
                <p className="text-brand-ink/80 text-sm leading-relaxed mb-6 font-medium text-justify whitespace-pre-line">
                  {acf.project_overview}
                </p>
              ) : property.content?.rendered ? (
                <div 
                  className="prose prose-sm max-w-none text-brand-ink/80 leading-relaxed mb-6 font-medium text-justify"
                  dangerouslySetInnerHTML={{ __html: property.content.rendered }}
                />
              ) : (
                <p className="text-brand-ink/80 text-sm leading-relaxed mb-6 font-medium text-justify">
                  Welcome to {property.title.rendered || "this premium property"}. This exceptional project offers high-end residential spaces designed for modern living. Strategically located with excellent connectivity, it features world-class amenities, premium structural quality, and meticulously planned layouts to ensure comfortable, luxury living for your family.
                </p>
              )}
              
              {(acf.total_land || acf.configuration || acf.total_units || acf.total_floors || acf.units_per_floor || acf.possession_date || acf.launch_date || acf.lifts_per_floor || acf.base_price) && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-brand-ink">
                {acf.total_land && (
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Total Land</span>
                  <span className="text-base font-bold text-brand-dark">{acf.total_land}</span>
                </div>
                )}
                {acf.configuration && (
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Configuration</span>
                  <span className="text-base font-bold text-brand-dark">{acf.configuration}</span>
                </div>
                )}
                {acf.total_units && (
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Total Units</span>
                  <span className="text-base font-bold text-brand-dark">{acf.total_units}</span>
                </div>
                )}
                {acf.total_floors && (
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Total Floors</span>
                  <span className="text-base font-bold text-brand-dark">{acf.total_floors}</span>
                </div>
                )}
                {acf.units_per_floor && (
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Units Per Floor</span>
                  <span className="text-base font-bold text-brand-dark">{acf.units_per_floor}</span>
                </div>
                )}
                {acf.possession_date && (
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Possession</span>
                  <span className="text-base font-bold text-brand-dark">{acf.possession_date}</span>
                </div>
                )}
                {acf.launch_date && (
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Launch Date</span>
                  <span className="text-base font-bold text-brand-dark">{acf.launch_date}</span>
                </div>
                )}
                {acf.lifts_per_floor && (
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Lifts Per Floor</span>
                  <span className="text-base font-bold text-brand-dark">{acf.lifts_per_floor}</span>
                </div>
                )}
                {acf.base_price && (
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Base Price</span>
                  <span className="text-base font-bold text-brand-dark">{acf.base_price}</span>
                </div>
                )}
              </div>
              )}
            </div>

            {/* saraansh interactive review */}
            {acf.video_id && (
            <div id="saraansh-review" className="bg-brand-dark text-white rounded-2xl p-6 md:p-8 shadow-md border border-brand-primary">
              <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-accent border-b border-brand-light/20 pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                {property.title.rendered} - Property Saraansh Review
              </h2>
              
              <div className="space-y-6">
                {/* 16:9 embedded YouTube video */}
                <div className="bg-[#09221D] p-2 rounded-xl shadow-inner border border-brand-primary/30 overflow-hidden">
                  <VideoPlayer videoId={acf.video_id} title={property.title.rendered} />
                </div>
                
                {/* Video description callout underneath */}
                {acf.video_review_text && (
                <div className="bg-brand-primary/40 border-l-4 border-brand-accent p-5 rounded-r-xl">
                  <p className="text-brand-pale text-sm md:text-base font-light italic leading-relaxed">
                    &ldquo;{acf.video_review_text}&rdquo;
                  </p>
                </div>
                )}
              </div>
            </div>
            )}

            {/* highlights section */}
            {highlightsList.length > 0 && (
            <div id="highlights" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
              <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                Project Highlights
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlightsList.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3 text-brand-ink">
                    <CheckCircle className="text-brand-primary mt-0.5 shrink-0" size={18} />
                    <span className="text-sm font-medium leading-relaxed">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* site plan & master layout section */}
            {(sitePlanImage || masterLayoutImage) && (() => {
              const activeImg = masterLayoutImage && sitePlanImage
                ? (activeSitePlanTab === 'master' ? masterLayoutImage : sitePlanImage)
                : (masterLayoutImage || sitePlanImage);
              return (
                <div id="siteplan" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
                  <div className="mb-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-accent">PROJECT LAYOUT</span>
                  </div>
                  <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-3 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                    {masterLayoutImage && sitePlanImage ? 'Master Layout & Site Plan' : masterLayoutImage ? 'Master Layout' : 'Site Plan'}
                  </h2>

                  {masterLayoutImage && sitePlanImage && (
                    <div className="flex gap-2 mb-4 border-b border-brand-pale pb-3">
                      <button
                        onClick={() => setActiveSitePlanTab('master')}
                        className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                          activeSitePlanTab === 'master'
                            ? 'bg-brand-primary text-white shadow-md'
                            : 'bg-brand-pale text-brand-primary hover:bg-brand-light/10'
                        }`}
                      >
                        Master Layout
                      </button>
                      <button
                        onClick={() => setActiveSitePlanTab('site')}
                        className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                          activeSitePlanTab === 'site'
                            ? 'bg-brand-primary text-white shadow-md'
                            : 'bg-brand-pale text-brand-primary hover:bg-brand-light/10'
                        }`}
                      >
                        Site Plan
                      </button>
                    </div>
                  )}

                  {activeImg && (
                    <div
                      className="aspect-[4/3] max-w-lg mx-auto bg-brand-pale rounded-xl border border-brand-light/20 relative overflow-hidden group cursor-zoom-in"
                      onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
                    >
                      <Image
                        src={activeImg}
                        alt={activeSitePlanTab === 'master' ? 'Master Layout' : 'Site Plan'}
                        fill
                        sizes="(max-width: 768px) 100vw, 512px"
                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                        <span className="bg-brand-dark/80 text-white text-xs px-4 py-2 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity">Click to Expand</span>
                      </div>
                    </div>
                  )}

                  <p className="text-center text-xs text-brand-light mt-4 font-light">
                    Explore the complete layout of {property.title.rendered}{acf.total_land ? ` — ${acf.total_land} of ultra-luxury living` : ''} within the 452-acre Jaypee Greens township.
                  </p>
                </div>
              );
            })()}

            {/* floor plans section */}
            {floorPlans.length > 0 && (
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
                      <Image 
                        src={plan.image} 
                        alt={plan.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, 512px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                        <span className="bg-brand-dark/80 text-white text-xs px-4 py-2 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity">Click to Expand</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={() => {
                          setFloorPlanModalTitle(plan.title);
                          setFloorPlanForm({ name: '', phone: '' });
                          setFloorPlanSubmitError('');
                          setIsFloorPlanModalOpen(true);
                        }}
                        className="bg-brand-accent hover:bg-brand-accent/90 text-brand-dark font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto"
                      >
                        <Download className="w-4 h-4" />
                        Download Floor Plan
                      </button>
                    </div>

                    {acf.floor_plan_footer_text && (
                    <div className="max-w-md mx-auto mt-4 text-center">
                      <p
                        ref={floorPlanTextRef}
                        className={`text-xs text-brand-light font-light leading-relaxed transition-all duration-300 ${
                          isFloorPlanTextExpanded ? '' : 'line-clamp-2'
                        }`}
                      >
                        {acf.floor_plan_footer_text}
                      </p>
                      {showFloorPlanReadMore && (
                        <button
                          onClick={() => setIsFloorPlanTextExpanded(!isFloorPlanTextExpanded)}
                          className="text-brand-primary hover:text-brand-accent text-[11px] font-bold uppercase tracking-wider mt-1.5 transition-colors focus:outline-none"
                        >
                          {isFloorPlanTextExpanded ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                    </div>
                    )}
                  </div>
                );
              })}
            </div>
            )}

            {/* amenities section */}
            {amenities.length > 0 && (
            <div id="amenities" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
              <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                Premium Amenities
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-brand-ink">
                {amenities.map((amenity) => (
                  <div key={amenity.id} className="flex flex-col items-center justify-center p-5 border border-brand-pale rounded-xl bg-white hover:shadow-md hover:-translate-y-0.5 transition-all text-center">
                    {amenity.icon ? (
                      <img src={amenity.icon} alt={amenity.name} className="w-12 h-12 mb-3 object-contain" />
                    ) : (
                      getAmenityIcon(amenity.name)
                    )}
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* price list section */}
            {priceList.length > 0 && (
              <div id="price" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
                <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                  Price List
                </h2>

                <div className="overflow-x-auto rounded-xl border border-brand-pale">
                  <table className="w-full text-sm text-brand-ink">
                    <thead>
                      <tr className="bg-brand-primary text-white text-xs uppercase tracking-wider">
                        <th className="py-3 px-4 text-left font-bold">Type</th>
                        <th className="py-3 px-4 text-left font-bold">Size</th>
                        <th className="py-3 px-4 text-left font-bold">Base Price</th>
                        <th className="py-3 px-4 text-left font-bold">All-In Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-pale">
                      {priceList.map((row) => (
                        <tr key={row.id} className="hover:bg-brand-pale/10">
                          <td className="py-4 px-4 font-bold text-brand-dark">{row.type}</td>
                          <td className="py-4 px-4">{row.size}</td>
                          <td className="py-4 px-4">{row.base}</td>
                          <td className="py-4 px-4 text-brand-accent font-bold">{row.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="max-w-none text-center">
                  <div className="flex justify-center mt-6 mb-5">
                    <button
                      onClick={() => {
                        setFloorPlanModalTitle("Price List");
                        setFloorPlanForm({ name: '', phone: '' });
                        setFloorPlanSubmitError('');
                        setIsFloorPlanModalOpen(true);
                      }}
                      className="bg-brand-accent hover:bg-brand-accent/90 text-brand-dark font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto"
                    >
                      <Download className="w-4 h-4" />
                      Download Price List
                    </button>
                  </div>

                  <div 
                    ref={priceListTextRef}
                    className={`mt-4 text-[11px] text-brand-light leading-relaxed font-light italic [&_p]:text-[11px] [&_p]:text-brand-light [&_p]:leading-relaxed [&_p]:font-light [&_p]:italic transition-all duration-300 ${
                      isPriceListTextExpanded ? '' : 'line-clamp-2'
                    }`}
                    dangerouslySetInnerHTML={{ 
                      __html: acf.price_list_desc || "*PLCs + GST applicable. BSP of ₹12,000/sq.ft includes central air-conditioning, 10% discount on booking first 50 units." 
                    }}
                  />
                  {showPriceListReadMore && (
                    <button
                      onClick={() => setIsPriceListTextExpanded(!isPriceListTextExpanded)}
                      className="text-brand-primary hover:text-brand-accent text-[11px] font-bold uppercase tracking-wider mt-1.5 transition-colors focus:outline-none"
                    >
                      {isPriceListTextExpanded ? 'Read Less' : 'Read More'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* location advantages & map section */}
            {(acf.location_advantages || acf.google_map_embed) && (
            <div id="location" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
              <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                Location Advantages
              </h2>
              
              <div className="space-y-6">
                {acf.location_advantages && (
                <div className="space-y-3.5 text-brand-ink">
                  {locationAdvantagesList.map((adv, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="w-1 h-5 bg-brand-accent shrink-0 mt-1"></span>
                      <span className="text-sm font-semibold leading-relaxed">{adv.trim()}</span>
                    </div>
                  ))}
                </div>
                )}

                {/* Google Map frame */}
                {acf.google_map_embed && (
                <div className="w-full aspect-[21/9] bg-brand-pale rounded-xl overflow-hidden border border-brand-light/20 relative shadow-inner">
                  <iframe 
                    src={extractMapUrl(acf.google_map_embed)} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy"
                    title="Google Map embed location"
                  ></iframe>
                </div>
                )}
              </div>
            </div>
            )}

            {/* project gallery section */}
            {gallery.length > 0 && (
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
            )}

            {/* possession timelines section */}
            {(acf.launch_date || acf.possession_date) && (
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
                  {acf.launch_date && (
                  <div className="absolute left-0 -top-2 flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-brand-primary border-4 border-white shadow-md flex items-center justify-center"></div>
                    <span className="text-[10px] font-bold text-brand-primary uppercase mt-2">Launch ({acf.launch_date})</span>
                  </div>
                  )}
                  
                  <div className="absolute left-[40%] -top-2 flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-brand-accent border-4 border-white shadow-md flex items-center justify-center animate-pulse"></div>
                    <span className="text-[10px] font-bold text-brand-accent uppercase mt-2">New Launch</span>
                  </div>
                  
                  {acf.possession_date && (
                  <div className="absolute right-0 -top-2 flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-brand-pale border-4 border-white shadow-sm flex items-center justify-center"></div>
                    <span className="text-[10px] font-bold text-brand-light uppercase mt-2">Possession ({acf.possession_date})</span>
                  </div>
                  )}
                </div>

                <div className="bg-brand-pale/50 border border-brand-light/20 p-4 rounded-xl mt-12 flex justify-between items-center text-xs">
                  <span className="font-semibold text-brand-ink">Timeline Phase:</span>
                  <span className="font-bold text-brand-primary uppercase tracking-widest">New Launch - Booking Open</span>
                </div>
              </div>
            </div>
            )}


            {/* About The Project Section */}
            {(acf.project_overview || property.content?.rendered) && (
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-brand-light/10 text-center">
              {/* Pill label */}
              <div className="inline-flex items-center border border-brand-ink/20 rounded-full px-5 py-1.5 mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-ink/50">About The Project</span>
              </div>

              {/* Two-tone title */}
              <h2 className="heading-playfair text-2xl md:text-3xl font-bold leading-tight mb-4">
                <span className="text-brand-dark">{property.title.rendered}</span>
                {acf.tagline && (
                  <> &mdash; <span className="text-brand-accent">{acf.tagline}</span></>
                )}
              </h2>

              {/* Gold separator */}
              <div className="w-12 h-0.5 bg-brand-accent mx-auto mb-6"></div>

              {/* Description with Read More */}
              <div className="max-w-3xl mx-auto text-left">
                <p
                  className={`text-brand-ink/75 text-sm md:text-[15px] leading-relaxed font-medium text-justify transition-all duration-300 ${
                    !isAboutExpanded ? 'line-clamp-4' : ''
                  }`}
                >
                  {acf.project_overview || ''}
                </p>
                <div className="flex justify-center mt-5">
                  <button
                    onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                    className="border border-brand-dark text-brand-dark text-[13px] font-semibold px-7 py-2.5 rounded-full hover:bg-brand-dark hover:text-white transition-all duration-200"
                  >
                    {isAboutExpanded ? 'Read Less ▲' : 'Read More ▼'}
                  </button>
                </div>
              </div>
            </div>
            )}

            {/* FAQ Section */}
            {faqs.length > 0 && (
              <div id="faq" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
                <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                  Frequently Asked Questions
                </h2>
                
                <div className="space-y-4">
                  {faqs.map((faq, idx) => {
                    const isOpen = activeFaqIndex === idx;
                    return (
                      <div 
                        key={faq.id} 
                        className="border border-brand-pale rounded-xl overflow-hidden transition-all duration-300"
                      >
                        <button
                          onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                          className="w-full flex justify-between items-center p-4 text-left font-bold text-sm md:text-base text-brand-dark hover:bg-brand-pale/20 transition-colors focus:outline-none"
                        >
                          <span>{faq.question}</span>
                          {isOpen ? <ChevronUp size={18} className="text-brand-primary shrink-0" /> : <ChevronDown size={18} className="text-brand-primary shrink-0" />}
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 text-sm text-brand-ink/80 leading-relaxed border-t border-brand-pale">
                            <p className="pt-3">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Related Properties */}
            {relatedProperties.length > 0 && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
                <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                  Explore More Properties
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedProperties.map((prop) => {
                    const propImg = getFeaturedImage(prop);
                    return (
                      <Link
                        key={prop.slug}
                        href={`/properties/${prop.slug}`}
                        className="group block rounded-xl overflow-hidden border border-brand-pale hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <div className="relative h-32 overflow-hidden bg-brand-pale">
                          {propImg ? (
                            <Image
                              src={propImg}
                              alt={prop.title.rendered}
                              fill
                              sizes="(max-width: 768px) 100vw, 300px"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-brand-dark/20 flex items-center justify-center">
                              <span className="text-brand-light/50 text-xs">No Image</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent" />
                        </div>
                        <div className="p-3">
                          <h3 className="font-bold text-sm text-brand-dark leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
                            {prop.title.rendered}
                          </h3>
                          {prop.acf?.location && (
                            <p className="text-xs text-brand-light mt-1 flex items-center gap-1">
                              <MapPin size={10} />
                              {prop.acf.location}
                            </p>
                          )}
                          {prop.acf?.video_id && (
                            <div className="mt-2">
                              <VideoPlayer videoId={prop.acf.video_id} title={prop.title.rendered} />
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && gallery.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white z-10 bg-brand-dark/50 rounded-full p-2"
            onClick={() => setLightboxOpen(false)}
          >
            <X size={24} />
          </button>

          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 bg-brand-dark/50 rounded-full p-2"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => Math.max(i - 1, 0)); }}
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {lightboxIndex < gallery.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 bg-brand-dark/50 rounded-full p-2"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => Math.min(i + 1, gallery.length - 1)); }}
            >
              <ChevronRight size={24} />
            </button>
          )}

          <div
            className="relative max-w-4xl max-h-[85vh] w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={gallery[Math.min(lightboxIndex, gallery.length - 1)]}
              alt={`Gallery image ${lightboxIndex + 1}`}
              className="w-full h-full object-contain max-h-[80vh] rounded-lg"
            />
            <p className="text-center text-white/50 text-xs mt-3 font-medium">
              <span className="font-semibold">{lightboxIndex + 1} / {gallery.length} • Project Photos</span>
            </p>
          </div>
        </div>
      )}

      {/* ── Floor Plan Download Modal ── */}
      {isFloorPlanModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4" onClick={() => setIsFloorPlanModalOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="heading-playfair text-lg font-bold text-brand-dark">
                Get {floorPlanModalTitle} Details
              </h3>
              <button onClick={() => setIsFloorPlanModalOpen(false)} className="text-brand-light hover:text-brand-dark transition-colors">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-brand-ink/70 mb-5">Enter your details to receive the floor plan and price sheet.</p>
            
            {floorPlanSubmitSuccess ? (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-brand-primary mx-auto mb-3" />
                <p className="font-bold text-brand-dark text-lg">Thank you!</p>
                <p className="text-sm text-brand-light mt-1">Our team will reach out shortly with the details.</p>
                <button onClick={() => { setIsFloorPlanModalOpen(false); setFloorPlanSubmitSuccess(false); }} className="mt-4 btn-primary rounded-xl px-6 py-2.5 text-sm font-bold">Close</button>
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                setFloorPlanSubmitting(true);
                setFloorPlanSubmitError('');
                try {
                  const res = await fetch('/api/lead', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: floorPlanForm.name,
                      phone: floorPlanForm.phone,
                      property: property.title.rendered,
                      interest: floorPlanModalTitle,
                      source: 'floor_plan_modal'
                    })
                  });
                  if (!res.ok) throw new Error('Failed');
                  setFloorPlanSubmitSuccess(true);
                } catch {
                  setFloorPlanSubmitError('Something went wrong. Please try again.');
                } finally {
                  setFloorPlanSubmitting(false);
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-primary mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={floorPlanForm.name}
                    onChange={e => setFloorPlanForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-brand-pale rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-primary mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={floorPlanForm.phone}
                    onChange={e => setFloorPlanForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-brand-pale rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-colors"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-primary mb-1.5">Interested In</label>
                  <select
                    className="w-full border border-brand-pale rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-colors bg-white"
                    defaultValue={floorPlanModalTitle}
                  >
                    <option value="3BHK" className="bg-brand-dark">Interested in 3 BHK</option>
                    <option value="4BHK" className="bg-brand-dark">Interested in 4 BHK</option>
                    <option value="Duplex" className="bg-brand-dark">Interested in Duplex</option>
                    <option value="Price List" className="bg-brand-dark">Price List</option>
                  </select>
                </div>
                {floorPlanSubmitError && (
                  <p className="text-red-500 text-xs font-medium">{floorPlanSubmitError}</p>
                )}
                <button
                  type="submit"
                  disabled={floorPlanSubmitting}
                  className="w-full btn-primary rounded-xl py-3 text-sm font-bold transition-all disabled:opacity-60"
                >
                  {floorPlanSubmitting ? 'Sending...' : 'Get Details →'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Mobile sticky CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-brand-dark/95 backdrop-blur-sm border-t border-brand-light/10 px-4 py-3 flex gap-3">
        <button
          onClick={() => {
            setFloorPlanModalTitle("General Inquiry");
            setFloorPlanForm({ name: '', phone: '' });
            setFloorPlanSubmitError('');
            setIsFloorPlanModalOpen(true);
          }}
          className="flex-1 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Download size={14} />
          Get Brochure
        </button>
        <a
          href="tel:+919999999999"
          className="flex-1 flex items-center justify-center gap-2 btn-primary rounded-xl py-3 text-sm font-bold transition-all shadow-md active:scale-95"
        >
          <Phone size={16} />
          Call Now
        </a>
      </div>

    </div>
  );
}
