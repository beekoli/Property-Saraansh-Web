"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { WPProperty, getFeaturedImage, MOCK_PROPERTIES } from '@/lib/wordpress';
import VideoPlayer from '@/components/VideoPlayer';
import PropertyCard from '@/components/PropertyCard';
import { MapPin, Phone, MessageSquare, ShieldCheck, Download, CheckCircle, ChevronRight, X, Waves, Dumbbell, Car, Leaf, TreePine, Home, Trophy, Baby, Footprints, Zap, Droplets, Video, Wifi, ArrowUpDown, ShoppingBag, PartyPopper, Flame, Bike } from 'lucide-react';

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
};

const getAmenityIcon = (name: string) => {
  const n = name.toLowerCase();
  
  // Swimming & Water
  if (n.includes('pool') || n.includes('swim') || n.includes('water') || n.includes('pond') || n.includes('stream')) {
    return <Waves className="w-10 h-10 mb-3 text-brand-accent" strokeWidth={1.5} />;
  }
  
  // Gym & Fitness
  if (n.includes('gym') || n.includes('fitness') || n.includes('yoga') || n.includes('meditation') || n.includes('aerobic') || n.includes('health')) {
    return <Dumbbell className="w-10 h-10 mb-3 text-brand-accent" strokeWidth={1.5} />;
  }
  
  // Security & Safety
  if (n.includes('secur') || n.includes('guard') || n.includes('cctv') || n.includes('camera') || n.includes('surveillance') || n.includes('gated')) {
    return <ShieldCheck className="w-10 h-10 mb-3 text-brand-accent" strokeWidth={1.5} />;
  }
  
  // Parks & Nature
  if (n.includes('park') && !n.includes('parking') && !n.includes('play')) {
    return <TreePine className="w-10 h-10 mb-3 text-brand-accent" strokeWidth={1.5} />;
  }
  
  // Gardens & Flora
  if (n.includes('garden') || n.includes('landscape') || n.includes('lawn') || n.includes('green') || n.includes('flora') || n.includes('tree')) {
    return <Leaf className="w-10 h-10 mb-3 text-brand-accent" strokeWidth={1.5} />;
  }
  
  // Parking & Vehicles
  if (n.includes('parking') || n.includes('car') || n.includes('garage') || n.includes('vehicle')) {
    return <Car className="w-10 h-10 mb-3 text-brand-accent" strokeWidth={1.5} />;
  }
  
  // Sports Courts & Games
  if (n.includes('court') || n.includes('sport') || n.includes('game') || n.includes('tennis') || n.includes('badminton') || n.includes('basketball') || n.includes('squash') || n.includes('table') || n.includes('skat') || n.includes('golf')) {
    return <Trophy className="w-10 h-10 mb-3 text-brand-accent" strokeWidth={1.5} />;
  }
  
  // Kids & Children
  if (n.includes('kid') || n.includes('child') || n.includes('toddler') || n.includes('play') || n.includes('creche')) {
    return <Baby className="w-10 h-10 mb-3 text-brand-accent" strokeWidth={1.5} />;
  }
  
  // Running, Walking & Cycling Tracks
  if (n.includes('track') || n.includes('walk') || n.includes('jog') || n.includes('run') || n.includes('path') || n.includes('reflexology')) {
    return <Footprints className="w-10 h-10 mb-3 text-brand-accent" strokeWidth={1.5} />;
  }
  if (n.includes('cycl') || n.includes('bicycle')) {
    return <Bike className="w-10 h-10 mb-3 text-brand-accent" strokeWidth={1.5} />;
  }
  
  // Club, Lounge & Community
  if (n.includes('club') || n.includes('lounge') || n.includes('hall') || n.includes('comm') || n.includes('hub') || n.includes('amphithea') || n.includes('gathering')) {
    return <Home className="w-10 h-10 mb-3 text-brand-accent" strokeWidth={1.5} />;
  }
  
  // Power & Electricity
  if (n.includes('power') || n.includes('backup') || n.includes('generator') || n.includes('electr')) {
    return <Zap className="w-10 h-10 mb-3 text-brand-accent" strokeWidth={1.5} />;
  }
  
  // Water Supply / Water Softener
  if (n.includes('water supply') || n.includes('ro water') || n.includes('rainwater') || n.includes('softener')) {
    return <Droplets className="w-10 h-10 mb-3 text-brand-accent" strokeWidth={1.5} />;
  }
  
  // Lift & Escalator
  if (n.includes('lift') || n.includes('elevator')) {
    return <ArrowUpDown className="w-10 h-10 mb-3 text-brand-accent" strokeWidth={1.5} />;
  }
  
  // Shops & Market
  if (n.includes('shop') || n.includes('market') || n.includes('store') || n.includes('grocer') || n.includes('retail')) {
    return <ShoppingBag className="w-10 h-10 mb-3 text-brand-accent" strokeWidth={1.5} />;
  }
  
  // Banquet / Party
  if (n.includes('banquet') || n.includes('party') || n.includes('celebration')) {
    return <PartyPopper className="w-10 h-10 mb-3 text-brand-accent" strokeWidth={1.5} />;
  }
  
  // Fire Fighting
  if (n.includes('fire') || n.includes('extinguish')) {
    return <Flame className="w-10 h-10 mb-3 text-brand-accent" strokeWidth={1.5} />;
  }

  // Default Fallback
  return <CheckCircle className="w-10 h-10 mb-3 text-brand-accent" strokeWidth={1.5} />;
};

const parseLocationAdvantages = (htmlOrText: string): string[] => {
  if (!htmlOrText) return [];

  // Decode basic HTML entities
  const decodeHtml = (str: string) => {
    return str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
  };

  // If it contains <li> tags, extract text from them first
  if (htmlOrText.includes('<li')) {
    const items: string[] = [];
    const regex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let match;
    while ((match = regex.exec(htmlOrText)) !== null) {
      const cleanText = match[1].replace(/<[^>]*>/g, '').trim();
      if (cleanText) {
        items.push(decodeHtml(cleanText));
      }
    }
    if (items.length > 0) return items;
  }

  // If no <li> tags, convert block tags to newlines, then strip remaining tags
  let text = htmlOrText
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '');

  text = decodeHtml(text);

  // Split by semicolons or newlines
  const rawItems = text.split(/[;\n]/);
  return rawItems
    .map(item => item.trim())
    .filter(item => item.length > 3);
};

const extractMapUrl = (embedString: string): string => {
  if (!embedString) return "";
  if (embedString.includes('<iframe')) {
    const match = embedString.match(/src="([^"]+)"/);
    return match ? match[1] : "";
  }
  return embedString;
};

const DEVELOPER_BIOS_EXTENDED: Record<string, { description: string; established: string; projects: string }> = {
  ...DEVELOPER_BIOS,
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
  allProperties?: WPProperty[];
}

export default function PropertyClient({ property, allProperties = [] }: Props) {
  const router = useRouter();
  const acf = property.acf || {};
  const featuredImage = getFeaturedImage(property);
  const developerBio = getDeveloperBio(acf.developer || "");

  // Parse video ID in case user pastes full YouTube URL instead of just the ID
  let parsedVideoId = acf.video_id || "";
  if (parsedVideoId.includes('youtube.com/watch?v=')) {
    parsedVideoId = parsedVideoId.split('v=')[1].split('&')[0];
  } else if (parsedVideoId.includes('youtu.be/')) {
    parsedVideoId = parsedVideoId.split('youtu.be/')[1].split('?')[0];
  } else if (parsedVideoId.includes('youtube.com/embed/')) {
    parsedVideoId = parsedVideoId.split('embed/')[1].split('?')[0];
  }

  // States
  const [activeFloorPlan, setActiveFloorPlan] = useState<number>(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', budget: '', type: '3BHK' });
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  // Floor Plan Lead Capture States
  const [isFloorPlanModalOpen, setIsFloorPlanModalOpen] = useState(false);
  const [floorPlanForm, setFloorPlanForm] = useState({ name: '', phone: '' });
  const [floorPlanModalTitle, setFloorPlanModalTitle] = useState('');
  const [floorPlanSubmitError, setFloorPlanSubmitError] = useState('');
  const [isFloorPlanSubmitting, setIsFloorPlanSubmitting] = useState(false);

  // Floor Plan Footer Text Collapsible States
  const floorPlanTextRef = useRef<HTMLParagraphElement>(null);
  const [showFloorPlanReadMore, setShowFloorPlanReadMore] = useState(false);
  const [isFloorPlanTextExpanded, setIsFloorPlanTextExpanded] = useState(false);

  useEffect(() => {
    if (isFloorPlanTextExpanded) return;

    const checkOverflow = () => {
      if (floorPlanTextRef.current) {
        const hasOverflow = floorPlanTextRef.current.scrollHeight > floorPlanTextRef.current.clientHeight;
        setShowFloorPlanReadMore(hasOverflow);
      }
    };

    const timer = setTimeout(checkOverflow, 100);
    window.addEventListener('resize', checkOverflow);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [acf.floor_plan_footer_text, isFloorPlanTextExpanded]);

  // Price List Footer Text Collapsible States
  const priceListTextRef = useRef<HTMLDivElement>(null);
  const [showPriceListReadMore, setShowPriceListReadMore] = useState(false);
  const [isPriceListTextExpanded, setIsPriceListTextExpanded] = useState(false);

  useEffect(() => {
    if (isPriceListTextExpanded) return;

    const checkOverflow = () => {
      if (priceListTextRef.current) {
        const hasOverflow = priceListTextRef.current.scrollHeight > priceListTextRef.current.clientHeight;
        setShowPriceListReadMore(hasOverflow);
      }
    };

    const timer = setTimeout(checkOverflow, 100);
    window.addEventListener('resize', checkOverflow);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [acf.price_list_desc, isPriceListTextExpanded]);

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

  // Handle scrolling to URL hash on initial page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let userScrolled = false;
      const onUserScroll = () => {
        userScrolled = true;
        window.removeEventListener('wheel', onUserScroll);
        window.removeEventListener('touchmove', onUserScroll);
        window.removeEventListener('keydown', onUserScroll);
      };
      
      window.addEventListener('wheel', onUserScroll, { passive: true });
      window.addEventListener('touchmove', onUserScroll, { passive: true });
      window.addEventListener('keydown', onUserScroll, { passive: true });

      const performScroll = (attempt: number) => {
        if (userScrolled) return;
        
        const hash = window.location.hash;
        if (!hash) return;
        
        const id = hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          const targetTop = el.getBoundingClientRect().top + window.scrollY;
          // Determine target offset based on location. Deep section hashes scroll with compact header offset,
          // sections near top (or first section) scroll with larger navbar offset.
          const offset = targetTop > 150 ? 60 : 140;
          
          window.scrollTo({
            top: targetTop - offset,
            behavior: attempt === 1 ? 'auto' : 'smooth'
          });
        }
      };

      // Staggered attempts to account for layout shifts as images, iframes, and dynamic content load
      const timers = [100, 400, 1000, 2000].map((delay, index) => 
        setTimeout(() => performScroll(index + 1), delay)
      );

      // Also listen for window load event to trigger scrolling once ready
      const handleLoad = () => performScroll(2);
      if (document.readyState === 'complete') {
        performScroll(1);
      } else {
        window.addEventListener('load', handleLoad);
      }

      return () => {
        timers.forEach(clearTimeout);
        window.removeEventListener('load', handleLoad);
        window.removeEventListener('wheel', onUserScroll);
        window.removeEventListener('touchmove', onUserScroll);
        window.removeEventListener('keydown', onUserScroll);
      };
    }
  }, []);

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

  // Handle Floor Plan Download Form Submission
  const handleFloorPlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!floorPlanForm.name || !floorPlanForm.phone) return;

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(floorPlanForm.phone)) {
      setFloorPlanSubmitError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsFloorPlanSubmitting(true);
    setFloorPlanSubmitError('');

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: `Floor Plan Download (${floorPlanModalTitle})`,
          name: floorPlanForm.name,
          phone: floorPlanForm.phone,
          project: property.title.rendered,
          type: 'floorplan',
        }),
      });
      setIsFloorPlanModalOpen(false);
      router.push('/thank-you');
    } catch (apiError) {
      console.error('Failed to forward floor plan lead to API:', apiError);
      setFloorPlanSubmitError('Failed to submit. Please try again.');
      setIsFloorPlanSubmitting(false);
    }
  };

  // Scroll Helper
  const scrollNav = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const targetTop = el.getBoundingClientRect().top + window.scrollY;
      const isScrollingDown = targetTop > window.scrollY;
      // If scrolling down, the main navbar hides, so sub-nav sticks at top-0 (offset = 60px)
      // If scrolling up (or staying at top), main navbar shows, so sub-nav sticks at top-[80px] (offset = 140px)
      const offset = isScrollingDown ? 60 : 140;

      window.scrollTo({
        top: targetTop - offset,
        behavior: 'smooth'
      });
      // Update URL hash without causing a page jump
      if (typeof window !== 'undefined' && window.history.pushState) {
        window.history.pushState(null, '', `#${id}`);
      }
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
    ? parseLocationAdvantages(acf.location_advantages)
    : [
        "Seamless access to Noida Expressway, Yamuna Expressway & FNG Expressway",
        "Close proximity to Noida International Airport",
        "Near Sector 148 Metro Station (Aqua Line)",
        "Close to Sector 153 & Sector 154 Industrial Areas",
        "Sector 150 Noida - 1.5 km"
      ];

  // Extract Gallery
  let gallery: string[] = [];
  if (featuredImage) {
    gallery.push(featuredImage);
  }
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
  if (gallery.length === 0) {
    gallery = ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"];
  }

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

  // Extract Payment Plan Steps (1 to 3)
  const paymentSteps = [];
  for (let i = 1; i <= 3; i++) {
    const pct = acf[`payment_step_${i}_pct` as keyof typeof acf];
    const label = acf[`payment_step_${i}_label` as keyof typeof acf];
    const desc = acf[`payment_step_${i}_desc` as keyof typeof acf];
    if (pct && label) {
      paymentSteps.push({ id: i, pct, label, desc: desc || "" });
    }
  }

  // Extract Payment Milestone Table (1 to 6 rows)
  const paymentMilestones = [];
  for (let i = 1; i <= 6; i++) {
    const name = acf[`payment_milestone_${i}_name` as keyof typeof acf];
    const demand = acf[`payment_milestone_${i}_demand` as keyof typeof acf];
    const cumulative = acf[`payment_milestone_${i}_cumulative` as keyof typeof acf];
    if (name && demand) {
      paymentMilestones.push({ id: i, name, demand, cumulative: cumulative || "" });
    }
  }

  const paymentEoiNote = acf.payment_eoi_note || "";

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

  // Extract Master Layout Image (paired with Site Plan in the "Project Layout" section)
  const masterLayoutImage = acf.master_layout_image && typeof acf.master_layout_image === 'string' && acf.master_layout_image.trim() !== ''
    ? acf.master_layout_image.trim()
    : null;

  // No fallback to hardcoded defaults so that rows are 100% WordPress-driven
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
      
      {/* 0. Top Featured Image Area */}
      <div className="bg-brand-dark w-full pt-24 md:pt-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="w-full h-[300px] md:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden relative shadow-2xl border border-brand-light/10 bg-brand-pale">
            <Image 
              src={featuredImage} 
              alt={property.title.rendered} 
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
              className="object-cover" 
            />
          </div>
        </div>
      </div>

      {/* 2. Sticky Sub-Navigation Bar */}
      <div className={`sticky ${isNavbarVisible ? 'top-[80px]' : 'top-0'} z-40 bg-brand-dark/90 backdrop-blur-md text-brand-pale border-y border-brand-accent/20 shadow-lg transition-all duration-300 block`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-start gap-6 md:gap-8 py-3.5 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest overflow-x-auto whitespace-nowrap scrollbar-none">
          <button onClick={() => scrollNav('overview')} className="hover:text-brand-accent transition-colors">Overview</button>
          <button onClick={() => scrollNav('saraansh-review')} className="hover:text-brand-accent transition-colors">Saraansh&apos;s Review</button>
          <button onClick={() => scrollNav('highlights')} className="hover:text-brand-accent transition-colors">Highlights</button>
          {(sitePlanImage || masterLayoutImage) && (
            <button onClick={() => scrollNav('siteplan')} className="hover:text-brand-accent transition-colors">Layout</button>
          )}
          <button onClick={() => scrollNav('floorplan')} className="hover:text-brand-accent transition-colors">Floor Plan</button>
          <button onClick={() => scrollNav('amenities')} className="hover:text-brand-accent transition-colors">Amenities</button>
          {priceList.length > 0 && (
            <button onClick={() => scrollNav('price')} className="hover:text-brand-accent transition-colors">Price List</button>
          )}
          {paymentSteps.length > 0 && (
            <button onClick={() => scrollNav('payment-plan')} className="hover:text-brand-accent transition-colors">Payment Plan</button>
          )}
          <button onClick={() => scrollNav('location')} className="hover:text-brand-accent transition-colors">Location</button>
          <button onClick={() => scrollNav('gallery')} className="hover:text-brand-accent transition-colors">Gallery</button>
          <button onClick={() => scrollNav('possession')} className="hover:text-brand-accent transition-colors">Possession</button>
          {faqs.length > 0 && (
            <button onClick={() => scrollNav('faq')} className="hover:text-brand-accent transition-colors">FAQs</button>
          )}
          <button onClick={() => scrollNav('builder')} className="hover:text-brand-accent transition-colors">About Builder</button>
        </div>
      </div>

      {/* 1. Header Info Banner (Dark Teal) */}
      <section className="bg-brand-dark text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-brand-light/20 relative">
        <div className="max-w-7xl mx-auto">
          {/* Project Logo (provisioned top area) */}
          {acf.project_logo && (
            <div className="mb-5 flex items-center justify-start">
              <img 
                src={acf.project_logo} 
                alt={`${property.title.rendered} Logo`} 
                className="h-10 md:h-12 w-auto object-contain bg-white/5 backdrop-blur-sm px-3.5 py-1.5 rounded-lg border border-white/10 shadow-md" 
              />
            </div>
          )}

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
                <span className="bg-[#1B5E52]/60 text-brand-accent border border-brand-accent/30 text-xs px-3 py-1 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck size={14} className="text-brand-accent" />
                  RERA: {acf.rera_number || "UPRERAPRJ108729"}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4 w-full lg:w-auto">
              <div className="bg-brand-accent text-brand-dark px-6 py-3 rounded-lg font-bold text-2xl shadow-xl tracking-tight leading-none text-center border border-amber-400 w-full lg:w-auto">
                {acf.price || "₹ 2.35 Cr - 4.65 Cr"}
              </div>
              <div className="flex gap-2 w-full lg:w-auto justify-end">
                <a href="tel:+918076178189" className="btn-outline border-brand-light text-brand-pale hover:bg-brand-light hover:text-white px-4 py-2 text-xs rounded font-bold transition-all flex-grow lg:flex-grow-0 text-center flex items-center justify-center">
                  Request Callback
                </a>
                <button 
                  onClick={() => {
                    setFloorPlanModalTitle("Brochure");
                    setIsFloorPlanModalOpen(true);
                  }} 
                  className="btn-outline border-brand-light text-brand-pale hover:bg-brand-light hover:text-white px-4 py-2 text-xs rounded font-bold transition-all flex-grow lg:flex-grow-0"
                >
                  Get Brochure
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Split Layout */}
      <div id="overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          {/* LEFT COLUMN: 70% Width */}
          <div className="w-full lg:w-8/12 space-y-10">
            
            {/* overview section */}
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
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-brand-ink">
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Total Land</span>
                  <span className="text-base font-bold text-brand-dark">{acf.total_land || "7.5 Acres"}</span>
                </div>
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Configuration</span>
                  <span className="text-base font-bold text-brand-dark">{acf.configuration || "3BHK, 4BHK, Duplex"}</span>
                </div>
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Total Units</span>
                  <span className="text-base font-bold text-brand-dark">{acf.total_units || "350"}</span>
                </div>
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Total Floors</span>
                  <span className="text-base font-bold text-brand-dark">{acf.total_floors || "G + 30"}</span>
                </div>
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Units Per Floor</span>
                  <span className="text-base font-bold text-brand-dark">{acf.units_per_floor || "4"}</span>
                </div>
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Possession</span>
                  <span className="text-base font-bold text-brand-dark">{acf.possession_date || "July 2030"}</span>
                </div>
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Launch Date</span>
                  <span className="text-base font-bold text-brand-dark">{acf.launch_date || "Oct 2025"}</span>
                </div>
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Lifts Per Floor</span>
                  <span className="text-base font-bold text-brand-dark">{acf.lifts_per_floor || "3"}</span>
                </div>
                <div className="p-4 bg-brand-pale/30 rounded-xl border border-brand-light/5 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block mb-1">Base Price</span>
                  <span className="text-base font-bold text-brand-dark">{acf.base_price || "₹ 12,000 / sq.ft"}</span>
                </div>
              </div>
            </div>

            {/* saraansh interactive review */}
            <div id="saraansh-review" className="bg-brand-dark text-white rounded-2xl p-6 md:p-8 shadow-md border border-brand-primary">
              <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-accent border-b border-brand-light/20 pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                {property.title.rendered} - Property Saraansh Review
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

            {/* project layout section (master plan + site map) */}
            {(sitePlanImage || masterLayoutImage) && (
              <div id="siteplan" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
                <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                  Project Layout
                </h2>

                <div className={`grid grid-cols-1 ${masterLayoutImage && sitePlanImage ? 'md:grid-cols-2' : ''} gap-6`}>
                  {masterLayoutImage && (
                    <div>
                      <div
                        className="bg-brand-pale rounded-xl border border-brand-light/20 relative overflow-hidden group cursor-zoom-in shadow-inner"
                        onClick={() => {
                          setLightboxIndex(998);
                          setLightboxOpen(true);
                        }}
                      >
                        <div className="relative aspect-[16/10] w-full">
                          <Image
                            src={masterLayoutImage}
                            alt={`${property.title.rendered} Master Layout`}
                            fill
                            sizes="(max-width: 768px) 100vw, 600px"
                            className="object-contain p-2 group-hover:scale-[1.03] transition-transform duration-500"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                          <span className="bg-brand-dark/80 text-white text-xs px-4 py-2 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity">Click to Expand</span>
                        </div>
                      </div>
                      <p className="text-xs text-brand-light font-light leading-relaxed text-center mt-3">
                        Master Layout — towers, clubhouse &amp; green zones
                      </p>
                    </div>
                  )}

                  {sitePlanImage && (
                    <div>
                      <div
                        className="bg-brand-pale rounded-xl border border-brand-light/20 relative overflow-hidden group cursor-zoom-in shadow-inner"
                        onClick={() => {
                          setLightboxIndex(999);
                          setLightboxOpen(true);
                        }}
                      >
                        <div className="relative aspect-[16/10] w-full">
                          <Image
                            src={sitePlanImage}
                            alt={`${property.title.rendered} Site Map`}
                            fill
                            sizes="(max-width: 768px) 100vw, 600px"
                            className="object-contain p-2 group-hover:scale-[1.03] transition-transform duration-500"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                          <span className="bg-brand-dark/80 text-white text-xs px-4 py-2 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity">Click to Expand</span>
                        </div>
                      </div>
                      <p className="text-xs text-brand-light font-light leading-relaxed text-center mt-3">
                        Site Map — tower positioning across the project
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

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

                    <div className="max-w-md mx-auto mt-4 text-center">
                      <p
                        ref={floorPlanTextRef}
                        className={`text-xs text-brand-light font-light leading-relaxed transition-all duration-300 ${
                          isFloorPlanTextExpanded ? '' : 'line-clamp-2'
                        }`}
                      >
                        {acf.floor_plan_footer_text || "Floor plan images loaded from your WordPress media library. Click any to expand."}
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

            {/* price list section */}
            {priceList.length > 0 && (
              <div id="price" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
                <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                  Price List
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-brand-dark text-white font-bold uppercase text-xs tracking-wider">
                        <th className="py-3.5 px-4 rounded-tl-lg">Type</th>
                        <th className="py-3.5 px-4">Size</th>
                        <th className="py-3.5 px-4">Base Price</th>
                        <th className="py-3.5 px-4 rounded-tr-lg">Total Price</th>
                      </tr>
                    </thead>
                    <tbody className="text-brand-ink divide-y divide-brand-pale font-medium">
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

            {/* payment plan section */}
            {paymentSteps.length > 0 && (
              <div id="payment-plan" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
                <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                  Payment Plan
                </h2>

                <div className={`grid grid-cols-1 ${paymentSteps.length > 1 ? 'md:grid-cols-3' : ''} gap-4 mb-8`}>
                  {paymentSteps.map((step) => (
                    <div key={step.id} className="bg-brand-pale/30 border-t-4 border-brand-accent rounded-xl p-5 text-center shadow-sm">
                      <div className="text-3xl font-black text-brand-accent">{step.pct}</div>
                      <div className="text-sm font-bold text-brand-dark mt-1">{step.label}</div>
                      {step.desc && (
                        <div className="text-xs text-brand-light mt-1">{step.desc}</div>
                      )}
                    </div>
                  ))}
                </div>

                {paymentMilestones.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-brand-dark text-white text-xs uppercase tracking-wider">
                          <th className="py-3 px-4 rounded-tl-lg">Milestone</th>
                          <th className="py-3 px-4">Demand</th>
                          <th className="py-3 px-4 rounded-tr-lg">Cumulative</th>
                        </tr>
                      </thead>
                      <tbody className="text-brand-ink divide-y divide-brand-pale font-medium">
                        {paymentMilestones.map((row) => (
                          <tr key={row.id} className="hover:bg-brand-pale/10">
                            <td className="py-3 px-4">{row.name}</td>
                            <td className="py-3 px-4 font-bold text-brand-accent">{row.demand}</td>
                            <td className="py-3 px-4">{row.cumulative}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {paymentEoiNote && (
                  <div className="mt-5 bg-brand-accent/10 border border-dashed border-brand-accent/40 rounded-xl p-4 text-sm text-brand-ink/80">
                    <span className="font-bold text-brand-dark">EOI Benefit: </span>
                    {paymentEoiNote}
                  </div>
                )}
              </div>
            )}

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
                    src={extractMapUrl(acf.google_map_embed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14041.517377561848!2d77.46535694999999!3d28.3776652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cc0272b144ab9%3A0x6b63f53835e5d16c!2sSector%20150%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin")} 
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                  <div className="border border-brand-pale rounded-xl p-3 text-center">
                    <div className="text-sm font-bold text-brand-dark">{acf.rera_number || "UPRERAPRJ108729"}</div>
                    <div className="text-[10px] text-brand-light uppercase tracking-wider mt-1">RERA Registered</div>
                  </div>
                  <div className="border border-brand-pale rounded-xl p-3 text-center">
                    <div className="text-sm font-bold text-brand-dark">{acf.launch_date || "Oct 2025"}</div>
                    <div className="text-[10px] text-brand-light uppercase tracking-wider mt-1">Launch Date</div>
                  </div>
                  <div className="border border-brand-pale rounded-xl p-3 text-center">
                    <div className="text-sm font-bold text-brand-dark">{acf.possession_date || "Jul 2030"}</div>
                    <div className="text-[10px] text-brand-light uppercase tracking-wider mt-1">RERA Possession</div>
                  </div>
                  <div className="border border-brand-pale rounded-xl p-3 text-center">
                    <div className="text-sm font-bold text-brand-dark">Quarterly</div>
                    <div className="text-[10px] text-brand-light uppercase tracking-wider mt-1">Updates on our YouTube</div>
                  </div>
                </div>
              </div>
            </div>

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
                          <span className="text-brand-primary shrink-0 ml-4">
                            {isOpen ? (
                              <svg className="w-5 h-5 transition-transform duration-300 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </span>
                        </button>
                        
                        <div 
                          className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                          }`}
                        >
                          <div className="p-4 pt-0 text-brand-ink/80 text-sm leading-relaxed border-t border-brand-pale/50 whitespace-pre-line font-medium text-justify">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* About Builder Section */}
            <div id="builder" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-light/10">
              <h2 className="heading-playfair text-xl md:text-2xl font-bold mb-6 text-brand-dark border-b border-brand-pale pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                About the Developer
              </h2>
              
              <div className="space-y-6">
                {/* Bio Description */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-brand-dark font-sans">{developerBio.name}</h3>
                  <p className="text-sm font-light text-brand-ink/80 leading-relaxed">
                    {acf.developer_description || developerBio.description}
                  </p>
                </div>
                
                {/* Stats Box - Horizontal Layout below Description */}
                <div className="grid grid-cols-3 gap-4 bg-brand-pale/40 border border-brand-light/10 rounded-2xl p-5 text-center">
                  <div className="px-2">
                    <span className="text-[10px] uppercase font-bold text-brand-primary tracking-wider block mb-1">Experience</span>
                    <span className="text-base font-bold text-brand-dark">
                      {acf.developer_experience || (developerBio.established ? `${new Date().getFullYear() - parseInt(developerBio.established)} Years` : "15+ Years")}
                    </span>
                  </div>
                  <div className="border-l border-brand-light/10 px-2">
                    <span className="text-[10px] uppercase font-bold text-brand-primary tracking-wider block mb-1">Delivered Projects</span>
                    <span className="text-base font-bold text-brand-dark">
                      {acf.developer_delivered_projects || developerBio.projects || "50+"}
                    </span>
                  </div>
                  <div className="border-l border-brand-light/10 px-2">
                    <span className="text-[10px] uppercase font-bold text-brand-primary tracking-wider block mb-1">Ongoing Projects</span>
                    <span className="text-base font-bold text-brand-dark">
                      {acf.developer_ongoing_projects || "10+"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: 30% Width (Sticky Sidebar) */}
          <div className={`w-full lg:w-4/12 lg:sticky transition-all duration-300 ${isNavbarVisible ? 'lg:top-[140px]' : 'lg:top-[60px]'} space-y-6`}>
            
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
                    className="flex items-center justify-center gap-1.5 border border-brand-light/30 bg-brand-primary/30 hover:bg-[#25D366] hover:text-white hover:border-transparent rounded-lg py-2.5 text-xs font-bold transition-all text-brand-pale group"
                  >
                    <MessageSquare size={14} className="group-hover:text-white" />
                    <span className="group-hover:text-white">WhatsApp</span>
                  </a>
                  <a 
                    href="tel:+918076178189" 
                    className="flex items-center justify-center gap-1.5 border border-brand-light/30 bg-brand-primary/30 hover:bg-brand-accent hover:border-transparent rounded-lg py-2.5 text-xs font-bold transition-all text-brand-pale group"
                  >
                    <Phone size={14} className="group-hover:text-brand-dark" />
                    <span className="group-hover:text-brand-dark">Call Now</span>
                  </a>
                </div>
              </div>
            </div>


          </div>

        </div>
      </div>

      {/* 4. Related Projects Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-brand-light/20 w-full mb-12">
        <h2 className="heading-playfair text-2xl md:text-3xl font-bold mb-10 text-brand-dark text-center flex items-center justify-center gap-3">
          <span className="w-8 h-[1px] bg-brand-accent"></span>
          Related Projects
          <span className="w-8 h-[1px] bg-brand-accent"></span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedProperties.map((prop) => (
            <PropertyCard 
              key={prop.slug}
              id={prop.slug}
              title={prop.title.rendered}
              developer={prop.acf.developer}
              location={prop.acf.location || "Noida"}
              price={prop.acf.price || "Contact for Price"}
              type={prop.acf.property_type || "Residential"}
              imageUrl={getFeaturedImage(prop)}
              bhk={(prop.acf.configuration || "3 BHK").split(',').map(s => s.trim())}
              videoId={prop.acf.video_id}
            />
          ))}
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
            {lightboxIndex === 998 ? (
              // Master Layout index
              <img 
                src={masterLayoutImage || ""} 
                alt="Master Layout" 
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl" 
              />
            ) : lightboxIndex === 999 ? (
              // Site Plan index
              <img 
                src={sitePlanImage || ""} 
                alt="Site Plan Layout" 
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl" 
              />
            ) : lightboxIndex >= 6 ? (
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
              {lightboxIndex === 998 ? (
                <>
                  <span className="font-bold block text-brand-accent text-lg">Master Layout</span>
                  <span className="text-xs text-brand-pale/80 font-light">Master Layout for {property.title.rendered}</span>
                </>
              ) : lightboxIndex === 999 ? (
                <>
                  <span className="font-bold block text-brand-accent text-lg">Site Map</span>
                  <span className="text-xs text-brand-pale/80 font-light">Site Map for {property.title.rendered}</span>
                </>
              ) : lightboxIndex >= 6 ? (
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

      {/* FLOOR PLAN DOWNLOAD LEAD POPUP */}
      {isFloorPlanModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          {/* Backdrop closer */}
          <div className="absolute inset-0 cursor-default" onClick={() => setIsFloorPlanModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-brand-light/10 transform scale-100 transition-transform duration-300 z-10 animate-scale-up">
            {/* Top Bar / Brand header */}
            <div className="relative bg-brand-primary p-6 text-white text-center">
              <button 
                onClick={() => setIsFloorPlanModalOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
              
              <h3 className="heading-playfair text-xl font-bold mb-1">
                {floorPlanModalTitle.toLowerCase().includes('price') 
                  ? 'Download Price List' 
                  : floorPlanModalTitle.toLowerCase().includes('brochure')
                    ? 'Download Brochure'
                    : 'Download Floor Plan'}
              </h3>
              <p className="text-xs text-brand-pale/90 font-light">
                {floorPlanModalTitle.toLowerCase().includes('price') 
                  ? `Please enter your details to receive the price list for ${property.title.rendered}.` 
                  : floorPlanModalTitle.toLowerCase().includes('brochure')
                    ? `Please enter your details to receive the brochure for ${property.title.rendered}.`
                    : `Please enter your details to receive the ${floorPlanModalTitle} layout.`}
              </p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleFloorPlanSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="modal-name" className="block text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
                  Full Name
                </label>
                <input
                  id="modal-name"
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={floorPlanForm.name}
                  onChange={(e) => setFloorPlanForm({ ...floorPlanForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-pale focus:outline-none focus:border-brand-primary text-sm font-light text-brand-dark transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="modal-phone" className="block text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
                  Mobile Number
                </label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-brand-pale bg-brand-pale text-brand-light text-sm font-semibold select-none">
                    +91
                  </span>
                  <input
                    id="modal-phone"
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit number"
                    value={floorPlanForm.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, ''); // Keep only digits
                      setFloorPlanForm({ ...floorPlanForm, phone: val });
                    }}
                    className="w-full px-4 py-2.5 rounded-r-xl border border-brand-pale focus:outline-none focus:border-brand-primary text-sm font-light text-brand-dark transition-colors"
                  />
                </div>
              </div>

              {floorPlanSubmitError && (
                <p className="text-red-500 text-xs text-center font-medium mt-2">
                  {floorPlanSubmitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isFloorPlanSubmitting}
                className="w-full bg-brand-accent hover:bg-brand-accent/90 text-brand-dark font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow hover:shadow-md transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFloorPlanSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Download size={14} />
                    <span>
                      {floorPlanModalTitle.toLowerCase().includes('price') 
                        ? 'Download Price List PDF' 
                        : floorPlanModalTitle.toLowerCase().includes('brochure')
                          ? 'Download Brochure PDF'
                          : 'Download Layout PDF'}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Sticky bottom CTA bar (Call & WhatsApp) - property page details only */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-brand-dark/95 backdrop-blur-md border-t border-brand-light/20 p-4 shadow-2xl flex gap-3 md:hidden">
        <a 
          href={`https://wa.me/918076178189?text=Hi%20Saraansh,%20I'm%20interested%20in%20${encodeURIComponent(property.title.rendered)}.`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white hover:!text-white rounded-xl py-3 text-sm font-bold transition-all shadow-md active:scale-95"
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
