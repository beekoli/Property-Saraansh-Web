const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export interface WPPost {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
    'wp:term'?: Array<Array<{
      name: string;
    }>>;
  };
}

export interface WPPage {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf?: Record<string, string>;
  yoast_head?: string;
  yoast_head_json?: {
    title?: string;
    description?: string;
    og_title?: string;
    og_description?: string;
    og_image?: Array<{ url: string }>;
  };
}

export interface WPProperty {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt?: {
    rendered: string;
  };
  acf: {
    price?: string;
    location?: string;
    property_type?: string;
    developer?: string;
    total_land?: string;
    rera_number?: string;
    configuration?: string;
    total_units?: string;
    possession_date?: string;
    launch_date?: string;
    total_floors?: string;
    units_per_floor?: string;
    lifts_per_floor?: string;
    price_list_desc?: string;
    location_advantages?: string;
    base_price?: string;
    video_id?: string;
    video_review_text?: string;
    highlights?: string; // Semicolon-separated list of highlights
    google_map_embed?: string;
    project_logo?: string;
    [key: `amenity_${number}_icon`]: string | false;
    [key: `amenity_${number}_name`]: string;
    [key: `floor_plan_${number}_title`]: string;
    [key: `floor_plan_${number}_desc`]: string;
    [key: `floor_plan_${number}_image`]: string | false;
    [key: `gallery_image_${number}`]: string | false;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
  property_gallery?: string[];
}

// Fallback Mock Blog Data
export const MOCK_BLOGS: WPPost[] = [
  {
    id: 1,
    date: "Jun 10, 2026",
    slug: "is-commercial-real-estate-in-noida-a-good-investment",
    title: { rendered: "Is Commercial Real Estate in Noida a Good Investment in 2026?" },
    excerpt: { rendered: "Analyzing the ROI, rental yields, and upcoming commercial hubs in Noida and Greater Noida..." },
    content: { 
      rendered: `
        <p>Noida's commercial real estate is experiencing an unprecedented boom in 2026. With major infrastructural drivers like the Jewar International Airport nearing completion and massive corporate relocations, investors are looking closely at high-street retail shops and office spaces.</p>
        
        <h2>Why Noida Commercial?</h2>
        <p>Unlike residential properties which typically yield a 2-3% rental return, commercial spaces in prime Noida sectors like Sector 62, 129, and 132 are delivering rental yields of 7-9%. Furthermore, the capital appreciation along the Noida-Greater Noida Expressway has averaged 15% annually over the last three years.</p>
        
        <blockquote>"Investing in commercial retail shops along the Expressway is currently the highest-yielding real estate play in the entire NCR region, backed by rapid corporate density."</blockquote>
        
        <h2>Key Areas to Watch</h2>
        <p>Keep a close eye on Sector 94, Sector 129, and Greater Noida West. These micro-markets have high residential catchment populations, which is essential to drive footfall for commercial retail ventures.</p>
      ` 
    },
    _embedded: {
      'wp:featuredmedia': [{ source_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800" }]
    }
  },
  {
    id: 2,
    date: "Jun 05, 2026",
    slug: "top-5-upcoming-residential-projects-noida-expressway",
    title: { rendered: "Top 5 Upcoming Residential Projects in Noida Expressway" },
    excerpt: { rendered: "A comprehensive review of the most anticipated premium and luxury projects launching this year..." },
    content: {
      rendered: `
        <p>The Noida Expressway remains the hotbed for luxury residential developments in Delhi NCR. With low-density project approvals and green corridors, developers are offering world-class living standards.</p>
        
        <h2>Top Pick: Eldeco 7 Peaks Residences</h2>
        <p>Located in Sector 150, Eldeco 7 Peaks Residences is a prime example of premium living. Spanning 7.5 Acres, it features G+30 standalone towers with only 4 apartments per floor. Its proximity to the upcoming Jewar Airport makes it a highly sought-after investment.</p>
        
        <blockquote>"The expressway projects are no longer just apartments; they are lifestyle enclaves with sky clubs, private pools, and double-height lobbies."</blockquote>
        
        <h2>Other Notable Launches</h2>
        <p>Other major luxury projects include M3M The Cullinan in Sector 94 and County 107 in Sector 107. Both projects are pushing the envelope of luxury with fully air-conditioned residences, private golf courses, and high-street retail below.</p>
      `
    },
    _embedded: {
      'wp:featuredmedia': [{ source_url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800" }]
    }
  },
  {
    id: 3,
    date: "May 28, 2026",
    slug: "understanding-rera-guidelines-homebuyers",
    title: { rendered: "Understanding the RERA Guidelines for Homebuyers" },
    excerpt: { rendered: "Don't invest before reading this! Protect your investment with these crucial RERA rules and checks." },
    content: {
      rendered: `
        <p>The Real Estate Regulatory Authority (RERA) has transformed how property transactions occur in India. As a homebuyer in Noida, understanding RERA regulations is your biggest safeguard against builder delays and project defaults.</p>
        
        <h2>What to Check First?</h2>
        <p>Every builder must advertise their RERA registration number. You should always visit the UP-RERA portal and cross-verify the project details. Look for construction timelines, land ownership approvals, and escrow account records.</p>
        
        <blockquote>"A registered RERA number is your legal armor. Never sign an allotment letter or pay a booking amount for a project that does not have active UP-RERA approval."</blockquote>
        
        <h2>Key Protections under RERA</h2>
        <p>Under RERA, builders cannot charge more than 10% of the property cost as an advance booking fee before signing a registered builder-buyer agreement. Additionally, 70% of the money collected from buyers must be deposited in a separate escrow account dedicated solely to construction costs for that project.</p>
      `
    },
    _embedded: {
      'wp:featuredmedia': [{ source_url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800" }]
    }
  }
];

// Fallback Mock Property Data (Matches mockup exactly)
export const MOCK_PROPERTIES: WPProperty[] = [
  {
    id: 101,
    slug: "eldeco-7-peaks-residences",
    title: { rendered: "Eldeco 7 Peaks Residences" },
    content: { rendered: "<p>Eldeco 7 Peaks Residences in Sector 150, Noida is a premium low-density residential community. Designed for optimal ventilation and privacy, it features spacious standalone towers with only four apartments per floor. Residents will enjoy extensive open spaces, wraparound corner balconies, and premium features including swimming pools, kid's pools, a luxury clubhouse, and physical courts. Its strategic location offers seamless access to the Noida-Greater Noida Expressway, Sector 148 Metro Station, and the upcoming Jewar International Airport.</p>" },
    acf: {
      project_logo: "https://img.logoipsum.com/296.svg",
      price: "₹ 2.35 Cr - 4.65 Cr",
      location: "Sector 150, Noida",
      property_type: "Residential",
      developer: "Eldeco Group",
      total_land: "7.5 Acres",
      rera_number: "UPRERAPRJ108729",
      configuration: "3BHK, 4BHK, Duplex",
      total_units: "350",
      possession_date: "July 2030",
      launch_date: "Oct 2025",
      total_floors: "G + 30",
      units_per_floor: "4",
      lifts_per_floor: "3",
      base_price: "₹ 12,000 / sq.ft",
      video_id: "e-WJp9zY7o8",
      video_review_text: "A low density project with only 4 units per floor — check how the developer justified the price point. Watch the full video before you choose.",
      highlights: "7 standalone towers, v/s sprawling density;Wide spread open spaces for optimal airflow;Wraparound corner balconies in every unit;All apartments face greens or water features;Swimming pool and heated kids' pool;Lavish clubhouse with premium amenities;Near upcoming Noida International Airport;Close to Noida Metro Sector 148 Line",
      google_map_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14041.517377561848!2d77.46535694999999!3d28.3776652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cc0272b144ab9%3A0x6b63f53835e5d16c!2sSector%20150%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      
      floor_plan_1_title: "3BHK",
      floor_plan_1_desc: "1825 sq. ft. to 2100 sq. ft. size with three spacious bedrooms, large kitchen, and 3 toilets.",
      floor_plan_1_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      
      floor_plan_2_title: "4BHK",
      floor_plan_2_desc: "2850 sq. ft. size with four premium bedrooms, separate family lounge, and wraparound balconies.",
      floor_plan_2_image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
      
      floor_plan_3_title: "Duplex",
      floor_plan_3_desc: "3400 sq. ft. size ultra-luxury double-height duplex living, private garden area, and servant room.",
      floor_plan_3_image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
      
      amenity_1_name: "Pickleball Court",
      amenity_1_icon: "https://cdn-icons-png.flaticon.com/512/8145/8145100.png",
      amenity_2_name: "Swimming Pool",
      amenity_2_icon: "https://cdn-icons-png.flaticon.com/512/4831/4831206.png",
      amenity_3_name: "Jogging Track",
      amenity_3_icon: "https://cdn-icons-png.flaticon.com/512/3014/3014169.png",
      amenity_4_name: "Senior Garden",
      amenity_4_icon: "https://cdn-icons-png.flaticon.com/512/3063/3063076.png",
      amenity_5_name: "Multipurpose Court",
      amenity_5_icon: "https://cdn-icons-png.flaticon.com/512/8145/8145100.png",
      amenity_6_name: "Kids Play Area",
      amenity_6_icon: "https://cdn-icons-png.flaticon.com/512/3063/3063076.png",
      amenity_7_name: "Water Plaza",
      amenity_7_icon: "https://cdn-icons-png.flaticon.com/512/4831/4831206.png",
      amenity_8_name: "Reflexology Path",
      amenity_8_icon: "https://cdn-icons-png.flaticon.com/512/3014/3014169.png",

      gallery_image_1: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      gallery_image_2: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
      gallery_image_3: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      gallery_image_4: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      gallery_image_5: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    },
    _embedded: {
      'wp:featuredmedia': [{ source_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800" }]
    },
    property_gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 102,
    slug: "godrej-woods-phase-2",
    title: { rendered: "Godrej Woods Phase 2" },
    content: { rendered: "<p>Godrej Woods Phase 2 in Sector 43 is Noida's premium forest-themed development. Surrounded by over 600 trees, this project offers highly luxurious residences with high quality fittings, a modular kitchen, private pool options, and immediate access to city hubs like Sector 18 and Noida Golf Course. Ideal for families seeking green living inside the city.</p>" },
    acf: {
      price: "₹ 3.5 Cr - 5.2 Cr",
      location: "Sector 43, Noida",
      property_type: "Residential",
      developer: "Godrej Properties",
      total_land: "11 Acres",
      rera_number: "UPRERAPRJ145320",
      configuration: "3 BHK, 4 BHK, 5 BHK",
      total_units: "420",
      possession_date: "Dec 2028",
      launch_date: "Jan 2025",
      total_floors: "G + 28",
      units_per_floor: "4",
      lifts_per_floor: "3",
      base_price: "₹ 16,500 / sq.ft",
      video_id: "video-5",
      video_review_text: "Forest living in the center of Noida. We check out the site progress and evaluate if Sector 43 justifies this premium pricing.",
      highlights: "Low-density forest living concept;Over 600 mature trees inside complex;Infinity edge pool and luxury wellness center;Double-height entrance lobby in all towers;Excellent connectivity to Noida Golf Course;Modular VRV air-conditioned apartments",
      google_map_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14013.910344569588!2d77.34863895!3d28.58543825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce456b3b55555%3A0x89e0ff5b3f2cc22!2sSector%2043%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      
      floor_plan_1_title: "3BHK",
      floor_plan_1_desc: "2000 sq. ft. forest view apartment with 3 beds and large decks.",
      floor_plan_1_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      floor_plan_2_title: "4BHK",
      floor_plan_2_desc: "2500 sq. ft. corner apartment with premium specifications.",
      floor_plan_2_image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",

      amenity_1_name: "Swimming Pool",
      amenity_1_icon: "https://cdn-icons-png.flaticon.com/512/4831/4831206.png",
      amenity_2_name: "Jogging Track",
      amenity_2_icon: "https://cdn-icons-png.flaticon.com/512/3014/3014169.png",
      amenity_3_name: "Kids Play Area",
      amenity_3_icon: "https://cdn-icons-png.flaticon.com/512/3063/3063076.png",

      gallery_image_1: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      gallery_image_2: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    },
    _embedded: {
      'wp:featuredmedia': [{ source_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" }]
    },
    property_gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 103,
    slug: "m3m-the-cullinan",
    title: { rendered: "M3M The Cullinan" },
    content: { rendered: "<p>M3M The Cullinan in Sector 94 is a mixed-use luxury landmark. Located right at the gateway of Noida (0 km from Delhi), it offers iconic sky condominiums, high-street premium retail outlets, multiple clubhouses, a private golfing range, and unprecedented luxury configurations. Perfect for ultra-HNI buyers demanding state of the art amenities.</p>" },
    acf: {
      price: "₹ 5.8 Cr Onwards",
      location: "Sector 94, Noida",
      property_type: "Residential",
      developer: "M3M Group",
      total_land: "12.8 Acres",
      rera_number: "UPRERAPRJ428710",
      configuration: "3 BHK, 4 BHK, 5 BHK",
      total_units: "380",
      possession_date: "Dec 2029",
      launch_date: "Jun 2024",
      total_floors: "G + 38",
      units_per_floor: "2",
      lifts_per_floor: "4",
      base_price: "₹ 21,000 / sq.ft",
      video_id: "video-3",
      video_review_text: "Noida's most expensive project reviewed. We evaluate the retail potential and high-end residential towers.",
      highlights: "Iconic mixed-use development at Noida-Delhi border;Private airconditioned lift lobbies for each flat;Double-height sky bridge connecting towers;Private putting greens and golf practice area;Premium high street retail plaza on lower floors;7-star concierge and club services",
      google_map_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14016.326261546944!2d77.320494!3d28.5673418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce4c1605ec1d5%3A0xe54497a7604323c9!2sSector%2094%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      
      floor_plan_1_title: "4BHK",
      floor_plan_1_desc: "3200 sq. ft. luxury condo with private lounge and deck.",
      floor_plan_1_image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",

      amenity_1_name: "Swimming Pool",
      amenity_1_icon: "https://cdn-icons-png.flaticon.com/512/4831/4831206.png",
      amenity_2_name: "Kids Play Area",
      amenity_2_icon: "https://cdn-icons-png.flaticon.com/512/3063/3063076.png",
    },
    _embedded: {
      'wp:featuredmedia': [{ source_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" }]
    },
    property_gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 104,
    slug: "county-107",
    title: { rendered: "County 107" },
    content: { rendered: "<p>County 107 in Sector 107, Noida is India's first residential project with an elevated skywalk. Ready to move in, this ultra-luxury community offers massive 4BHK and 5BHK apartments. Features include private elevators, home automation, and an indoor temperature-controlled pool.</p>" },
    acf: {
      price: "₹ 4.2 Cr - 7.5 Cr",
      location: "Sector 107, Noida",
      property_type: "Residential",
      developer: "County Group",
      total_land: "5.5 Acres",
      rera_number: "UPRERAPRJ983271",
      configuration: "4 BHK, 5 BHK",
      total_units: "230",
      possession_date: "Ready to Move",
      launch_date: "Jan 2021",
      total_floors: "G + 30",
      units_per_floor: "2",
      lifts_per_floor: "2",
      base_price: "₹ 15,000 / sq.ft",
      video_id: "video-10",
      video_review_text: "Ready to move in luxury. We tour the skywalk and check the finishing quality of the club and penthouses.",
      highlights: "First project in India with an elevated skywalk;Ready to move in premium finishing;Home automation preloaded in all apartments;Indoor temperature controlled pool;Spacious layouts with direct elevator access",
      google_map_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14015.429344!2d77.3764831!3d28.5714389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5631c51888b%3A0xe544c7b80a5f782c!2sSector%20107%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      floor_plan_1_title: "4BHK",
      floor_plan_1_desc: "2850 sq. ft. ready to move luxury apartment.",
      floor_plan_1_image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
      amenity_1_name: "Swimming Pool",
      amenity_1_icon: "https://cdn-icons-png.flaticon.com/512/4831/4831206.png"
    },
    _embedded: {
      'wp:featuredmedia': [{ source_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800" }]
    },
    property_gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 105,
    slug: "ats-knightsbridge",
    title: { rendered: "ATS Knightsbridge" },
    content: { rendered: "<p>ATS Knightsbridge in Sector 124, Noida features ultra-luxury towers overlooking the Yamuna. Each apartment occupies an entire floor, ensuring absolute 360-degree views, private lobbies, and premium specifications. Ready to move, this project offers maximum luxury and HNI privacy.</p>" },
    acf: {
      price: "₹ 9.5 Cr Onwards",
      location: "Sector 124, Noida",
      property_type: "Residential",
      developer: "ATS Group",
      total_land: "6.2 Acres",
      rera_number: "UPRERAPRJ873210",
      configuration: "4 BHK, 5 BHK",
      total_units: "150",
      possession_date: "Ready to Move",
      launch_date: "Jan 2020",
      total_floors: "G + 47",
      units_per_floor: "1",
      lifts_per_floor: "3",
      base_price: "₹ 18,000 / sq.ft",
      video_id: "dQw4w9WgXcQ",
      video_review_text: "Checking out ATS Knightsbridge - where single flat-per-floor layouts redefine space and luxury.",
      highlights: "Only 1 apartment per floor for absolute privacy;Iconic 47-storey towers overlooking Yamuna;Private swimming pools in double-height decks;Exclusive cigar lounge and clubhouse;Immediate possession",
      google_map_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14013.9103!2d77.32049!3d28.5854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce456b!2sSector%20124%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      floor_plan_1_title: "4BHK",
      floor_plan_1_desc: "6000 sq. ft. layout.",
      floor_plan_1_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      amenity_1_name: "Swimming Pool",
      amenity_1_icon: "https://cdn-icons-png.flaticon.com/512/4831/4831206.png"
    },
    _embedded: {
      'wp:featuredmedia': [{ source_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80" }]
    },
    property_gallery: []
  },
  {
    id: 106,
    slug: "max-estates-128",
    title: { rendered: "Max Estates 128" },
    content: { rendered: "<p>Max Estates 128 in Sector 128 is a luxury low-density residential community. Designed for holistic wellness, it features a massive central park, sports amenities, and dynamic floor layouts. The developer focus is on clean indoor air quality and double-height structural spacing.</p>" },
    acf: {
      price: "₹ 6.0 Cr - 12.0 Cr",
      location: "Sector 128, Noida",
      property_type: "Residential",
      developer: "Max Estates",
      total_land: "10 Acres",
      rera_number: "UPRERAPRJ763290",
      configuration: "3 BHK, 4 BHK",
      total_units: "280",
      possession_date: "Under Construction",
      launch_date: "Jun 2025",
      total_floors: "G + 25",
      units_per_floor: "3",
      lifts_per_floor: "3",
      base_price: "₹ 19,500 / sq.ft",
      video_id: "dQw4w9WgXcQ",
      video_review_text: "Checking out Max Estates Sector 128. Is this the new standard for quality residential development?",
      highlights: "Designed for wellness and IGBC Gold certified;Highly efficient double-height floor configurations;Central forest landscape with multiple sports amenities;Top tier constructor and structural quality",
      google_map_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14013.9103!2d77.348638!3d28.5854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce456b!2sSector%20128%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      floor_plan_1_title: "3BHK",
      floor_plan_1_desc: "2400 sq. ft. layout.",
      floor_plan_1_image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
      amenity_1_name: "Swimming Pool",
      amenity_1_icon: "https://cdn-icons-png.flaticon.com/512/4831/4831206.png"
    },
    _embedded: {
      'wp:featuredmedia': [{ source_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80" }]
    },
    property_gallery: []
  }
];

async function fetchAPI(endpoint: string) {
  if (!API_URL) {
    return null;
  }
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("WordPress Fetch Error:", err);
    return null;
  }
}

export async function getLatestBlogs(limit = 3): Promise<WPPost[]> {
  const data = await fetchAPI(`/posts?_embed&per_page=${limit}`);
  return data && data.length > 0 ? data : MOCK_BLOGS.slice(0, limit);
}

export async function getBlogBySlug(slug: string): Promise<WPPost | null> {
  const data = await fetchAPI(`/posts?_embed&slug=${slug}`);
  if (data && data.length > 0) return data[0];
  const local = MOCK_BLOGS.find(b => b.slug === slug);
  return local || null;
}

export async function getProperties(limit = 10, propertyType?: string): Promise<WPProperty[]> {
  const data = await fetchAPI(`/properties?_embed&per_page=${limit}`);
  const list = data && data.length > 0 ? data : MOCK_PROPERTIES;
  
  if (propertyType) {
    return list.filter((p: WPProperty) => 
      p.acf?.property_type?.toLowerCase().includes(propertyType.toLowerCase())
    );
  }
  return list.slice(0, limit);
}

export async function getPropertyBySlug(slug: string): Promise<WPProperty | null> {
  const data = await fetchAPI(`/properties?_embed&slug=${slug}`);
  if (data && data.length > 0) return data[0];
  const local = MOCK_PROPERTIES.find(p => p.slug === slug);
  return local || null;
}

export function getFeaturedImage(post: WPPost | WPProperty): string {
  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'].length > 0) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, '');
}

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  const data = await fetchAPI(`/pages?slug=${slug}&_embed`);
  return data && data.length > 0 ? data[0] : null;
}
