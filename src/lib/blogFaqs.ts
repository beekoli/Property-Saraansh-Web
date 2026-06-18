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

export const blogFAQs: Record<string, BlogFAQ[]> = {
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
