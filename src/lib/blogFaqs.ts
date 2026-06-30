/**
 * Blog FAQs — keyed by blog slug.
 * Add FAQs for any blog post here and they will automatically:
 *   1. Render as an accordion in the blog post
 *   2. Generate FAQPage JSON-LD schema for Google rich results
 */

export interface BlogFAQ {
  question: string;
  answer: string;
}

const yamunaExpressway2030FAQs: BlogFAQ[] = [
  {
    question: "Is Yamuna Expressway a good investment in 2026?",
    answer: "Yes, for investors with a 6-8 year horizon and the capacity to hold. Yamuna Expressway is currently an investor-driven market with limited end-user (resident) demand, so it suits patient capital rather than quick flips or immediate rental income. Buyers needing fast exits or rental yield today may find better options elsewhere."
  },
  {
    question: "What is the current plot price on Yamuna Expressway?",
    answer: "Township plots on the corridor start at around ₹1.4 lakh per square yard. YEIDA's 2026 authority residential scheme (RPS-10) priced plots at about ₹36,260 per square metre across Sectors 15C, 18 and 24A near the Noida International Airport. Authority (YEIDA) plots carry far lower title and approval risk than private deals."
  },
  {
    question: "What is the average apartment price on Yamuna Expressway?",
    answer: "Apartments on the Yamuna Expressway corridor average around ₹9,700 per sq ft, with premium listed-developer projects (such as Godrej, ATS, Migsun and Eldeco) ranging from roughly ₹9,000 to ₹15,000+ per sq ft depending on sector and specification."
  },
  {
    question: "Will Jewar Airport increase property prices?",
    answer: "Over the long term, yes — but not instantly. Airports serve demand rather than create it. Gurgaon's example shows that a real estate boom follows large-scale white-collar job growth, which can take years after an airport becomes operational. The Noida International Airport at Jewar (Phase 1 inaugurated March 2026) is a powerful catalyst, but a sustainable price rise depends on well-paid jobs arriving in numbers."
  },
  {
    question: "What are the risks of investing in Yamuna Expressway?",
    answer: "The main risks are possession delays, infrastructure gaps (metro/RRTS connectivity is still years away, leaving the expressway as the main access), aggressive over-pricing, and fraud from plots sold without proper approvals. Protect yourself by buying only directly from YEIDA or from RERA-registered, verified developers, and by physically and online verifying the survey number, approvals and RERA registration before any payment."
  }
];

export const blogFAQs: Record<string, BlogFAQ[]> = {
  // Yamuna Expressway investment article — keyed under both the new SEO slug and the
  // current slug so the FAQ accordion + FAQPage schema render regardless of which is live.
  "yamuna-expressway-property-investment-2030": yamunaExpressway2030FAQs,
  "yamuna-expressway-noida-who-should-invest-and-what-will-the-real-estate-market-look-like-by-2030": yamunaExpressway2030FAQs,
  "noida-residents-things-nobody-talks-aboutsocial-issues-best-sectors-the-real-picture-of-life-in-noida": [
    {
      question: "What are the most common social issues faced by Noida residents?",
      answer: "Noida residents commonly face issues like traffic congestion during peak hours, lack of community spaces in high-rise societies, water supply inconsistencies in some sectors, stray animal menace, and challenges with civic maintenance. These problems vary by sector and are often not discussed in property marketing materials."
    },
    {
      question: "Which are the best sectors to live in Noida in 2026?",
      answer: "The best sectors to live in Noida in 2026 include Sector 150 for its greenery and wide roads, Sector 137 for proximity to the Noida Expressway and IT hubs, Sector 128 for premium living, Sector 44 and 50 for established infrastructure, and Greater Noida West for affordable options with upcoming metro connectivity."
    },
    {
      question: "Is Noida a good place to live compared to Gurgaon and Delhi?",
      answer: "Noida offers significantly better value for money compared to Gurgaon and South Delhi. It has wider roads, more green spaces, better planned sectors, and affordable property prices. However, Gurgaon has an edge in nightlife and corporate offices, while Delhi offers more cultural and historical amenities. For families, Noida is increasingly the preferred choice."
    },
    {
      question: "What are the infrastructure challenges in Noida?",
      answer: "Key infrastructure challenges include incomplete metro connectivity in some sectors, pending road widening projects, inadequate waste management in a few areas, waterlogging during monsoons in low-lying sectors, and the need for more public hospitals and government schools. However, the Noida Authority has been actively working on improvements."
    },
    {
      question: "How is the safety situation in Noida for families?",
      answer: "Noida is generally considered safe for families, especially in gated societies and established sectors. The presence of CCTV cameras on major roads, active police patrolling, and the women's helpline have improved safety. Sectors closer to the Expressway and well-lit commercial areas are considered the safest zones."
    },
    {
      question: "What are the real pros and cons of buying property in Noida?",
      answer: "Pros include excellent connectivity (Expressways, Metro), affordable prices compared to Delhi NCR, RERA-regulated projects, wide roads, and green planning. Cons include delayed possessions in some projects, authority dues impacting some builders, limited nightlife, and some sectors still developing basic amenities."
    },
    {
      question: "How does the Noida Metro and Aqua Line impact daily life?",
      answer: "The Noida Metro and Aqua Line have significantly improved daily commutes for residents. The Blue Line connects Noida to Delhi, while the Aqua Line connects Noida to Greater Noida. However, last-mile connectivity from metro stations to residential areas remains a challenge in some sectors, often requiring auto-rickshaws or e-rickshaws."
    },
    {
      question: "What should first-time homebuyers know before buying in Noida?",
      answer: "First-time buyers should verify the builder's RERA registration, check for pending authority dues, visit the site physically, understand the difference between leasehold and freehold, factor in maintenance costs for high-rise societies, and research the sector's existing infrastructure rather than relying solely on brochures."
    }
  ],
  "crc-the-peridona-jaypee-greens-an-honest-review-investment-analysis": [
    {
      question: "What is CRC The Peridona in Jaypee Greens Noida?",
      answer: "CRC The Peridona is an ultra-luxury residential project by CRC Group located in the Jaypee Greens township, Sector 128, Noida Expressway. It offers 4 BHK and 5 BHK premium apartments spread across 7 towers of 43 floors each. The project sits within the prestigious Jaypee Greens ecosystem, which includes an 18-hole PGA golf course, 5-star hotels, and a world-class clubhouse spanning 1.8 lakh square feet."
    },
    {
      question: "What is the price of flats in CRC The Peridona?",
      answer: "CRC The Peridona apartments start from approximately ₹13 Crore for 4 BHK units with a carpet area of around 5,500 sq ft. The 5 BHK and larger configurations are priced higher. Given the ultra-luxury positioning within the Jaypee Greens address, pricing reflects a significant premium over standard Noida Expressway projects. Always verify current pricing directly with the developer or an authorised channel partner."
    },
    {
      question: "Is CRC The Peridona a good investment in 2025-26?",
      answer: "CRC The Peridona is positioned as a long-term investment in the ultra-luxury segment of the Noida Expressway. Its location within Jaypee Greens — home to a PGA golf course, premium hotels, and established commercial zones — gives it strong addressal value. The Noida Expressway corridor has seen consistent appreciation, and supply in the true luxury segment (above ₹10 Cr) remains limited. However, buyers should conduct thorough RERA due diligence and assess their holding horizon before investing."
    },
    {
      question: "Where exactly is CRC The Peridona located?",
      answer: "CRC The Peridona is located in Sector 128, Noida Expressway, within the Jaypee Greens integrated township. It enjoys proximity to the Jaypee Greens golf course, DND Flyway, and key commercial hubs like Sector 135 and the IT corridor. The project is approximately 30-40 minutes from Connaught Place, Delhi, and well-connected to the upcoming Jewar International Airport via the Yamuna Expressway."
    },
    {
      question: "What amenities are available at CRC The Peridona?",
      answer: "CRC The Peridona residents get access to a 1.8 lakh sq ft clubhouse — one of the largest in the NCR — featuring swimming pools, a spa, gymnasium, sports courts, fine dining, and banquet halls. The Jaypee Greens township adds an 18-hole PGA-standard golf course, 5-star hotels, a hospital, and schools. Within the project, amenities include concierge services, smart home integration, EV charging, a sky lounge, and landscaped podiums."
    },
    {
      question: "Who is the developer of CRC The Peridona and what is their track record?",
      answer: "CRC The Peridona is developed by CRC Group, an NCR-based real estate developer known for previous projects like CRC Sublimis and CRC Joyous in Greater Noida West. With Peridona, CRC has entered the ultra-luxury segment for the first time, marking a significant shift in their product positioning. Buyers should review the developer's RERA registration and delivery history before making a booking decision."
    },
    {
      question: "How does CRC The Peridona compare to other luxury projects on the Noida Expressway?",
      answer: "Among luxury projects on the Noida Expressway, CRC The Peridona competes with Gaur Legacy (Sector 129), L&T Green Reserve (Sector 128), and ATS Knightsbridge. Peridona's key differentiator is its location inside the Jaypee Greens township, offering golf course access and 5-star hotel proximity. In terms of apartment size and pricing, it sits at the very top of the Noida luxury market, most comparable to ATS Knightsbridge."
    },
    {
      question: "What floor plan configurations are available in CRC The Peridona?",
      answer: "CRC The Peridona offers 4 BHK and 5 BHK configurations. The 4 BHK apartments cover approximately 5,500 sq ft of carpet area, making them among the largest in the category on the Noida Expressway. The 5 BHK units offer even larger living spaces with private lift lobbies, premium imported fittings, and expansive balconies with golf course or expressway views."
    }
  ],
};

/**
 * Generate FAQPage JSON-LD schema from blog FAQs.
 */
export function generateFAQSchema(faqs: BlogFAQ[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}
