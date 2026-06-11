export interface YTVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  category: string;
  views?: string;
}

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || 'UC-placeholder';

export const MOCK_YOUTUBE_VIDEOS: YTVideo[] = [
  {
    id: "e-WJp9zY7o8",
    title: "Eldeco 7 Peaks Residences — Full Review & Price Analysis",
    description: "A low density project with only 4 units per floor — check how the developer justified the price point. Watch the full video before you choose.",
    thumbnail: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
    publishedAt: "Jun 11, 2026",
    duration: "14:02",
    category: "Project Reviews",
    views: "15K views"
  },
  {
    id: "dQw4w9WgXcQ", // standard placeholder
    title: "Noida Sector 150: The Greenest Sector - Honest Ground Report 2026",
    description: "Analyzing Sector 150's infrastructure, current residency status, parks, connectivity, and upcoming projects. Is it worth the premium price in 2026?",
    thumbnail: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800",
    publishedAt: "Jun 10, 2026",
    duration: "15:20",
    category: "Area Reviews",
    views: "24K views"
  },
  {
    id: "video-2",
    title: "Top 5 Ultra-Luxury Apartments on Noida Expressway",
    description: "A detailed review of the top 5 luxury residential options on Noida Expressway. We compare density, specifications, pricing, and possession timelines.",
    thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    publishedAt: "Jun 08, 2026",
    duration: "18:45",
    category: "Residential",
    views: "32K views"
  },
  {
    id: "video-3",
    title: "M3M The Cullinan Sector 94: Noida's Most Expensive Project Reviewed",
    description: "An honest ground report and walkthrough of M3M The Cullinan in Sector 94. We look at construction progress, unit configurations, and premium amenities.",
    thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
    publishedAt: "Jun 06, 2026",
    duration: "22:10",
    category: "Project Reviews",
    views: "45K views"
  },
  {
    id: "video-4",
    title: "Noida Real Estate Market Crash or Boom in 2026? | Expert Analysis",
    description: "Is the Noida real estate market hitting a bubble? We analyze price trends, inventory levels, RERA updates, and macro-economic factors to give you the truth.",
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    publishedAt: "Jun 03, 2026",
    duration: "12:45",
    category: "Market Updates",
    views: "18K views"
  },
  {
    id: "video-5",
    title: "Godrej Woods Sector 43 Noida: Construction Update & Forest Theme Review",
    description: "A walk-through of the Godrej Woods construction site. We analyze the forest landscape concept, check the sample flats, and review the recent appreciation.",
    thumbnail: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    publishedAt: "May 30, 2026",
    duration: "14:15",
    category: "Project Reviews",
    views: "21K views"
  },
  {
    id: "video-6",
    title: "Yamuna Expressway Authority Plots: Ground Reality & Investment Guide",
    description: "Should you buy authority plots near the Jewar Airport? We explain the bidding process, transfer charges, current rates, and future growth triggers.",
    thumbnail: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    publishedAt: "May 25, 2026",
    duration: "20:30",
    category: "Investment Tips",
    views: "29K views"
  },
  {
    id: "video-7",
    title: "Is Commercial Retail Shop in Sector 129 Noida a Good Investment?",
    description: "Deep dive into commercial real estate options in Sector 129. We calculate potential rental yields, footfall projections, and list nearby residential catchments.",
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
    publishedAt: "May 20, 2026",
    duration: "16:50",
    category: "Commercial",
    views: "11K views"
  },
  {
    id: "video-8",
    title: "Jewar Airport Metro Line & Film City: Impact on Noida Real Estate",
    description: "Noida News Update: Breaking down the latest route maps, budget sanctions, and timelines for the Jewar Airport Metro and Noida Film City projects.",
    thumbnail: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800",
    publishedAt: "May 15, 2026",
    duration: "11:15",
    category: "Noida News",
    views: "52K views"
  },
  {
    id: "video-9",
    title: "RERA Registration Checklist: 5 Things Every Homebuyer Must Know",
    description: "Don't get scammed! Learn how to verify RERA numbers, check quarterly progress reports, lookup litigation history, and read builder-buyer agreements.",
    thumbnail: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
    publishedAt: "May 10, 2026",
    duration: "09:40",
    category: "Legal Advice",
    views: "16K views"
  },
  {
    id: "video-10",
    title: "County 107 Noida Sector 107: Ready to Move Luxury Apartments",
    description: "Taking an inside tour of County 107 in Sector 107. Checking the operational clubhouse, landscaping, elevator speeds, and layout space efficiency.",
    thumbnail: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800",
    publishedAt: "May 05, 2026",
    duration: "17:35",
    category: "Project Reviews",
    views: "27K views"
  },
  {
    id: "video-11",
    title: "Commercial Office Spaces vs Retail Shops: Where to Invest in Noida?",
    description: "Comparing capital appreciation, lease lock-in periods, tenant profiles, and risk factors between Noida office spaces and high-street retail shops.",
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    publishedAt: "Apr 28, 2026",
    duration: "13:25",
    category: "Commercial",
    views: "14K views"
  }
];

export async function getLatestYouTubeVideos(limit = 12): Promise<YTVideo[]> {
  if (!YOUTUBE_API_KEY || YOUTUBE_CHANNEL_ID === 'UC-placeholder') {
    return MOCK_YOUTUBE_VIDEOS.slice(0, limit);
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=${limit}&type=video`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`YouTube API returned status ${response.status}`);
    }

    const data = await response.json();
    if (!data.items) return MOCK_YOUTUBE_VIDEOS.slice(0, limit);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      duration: "12:00", // Search endpoint doesn't give durations, default placeholder
      category: "Real Estate",
      views: "10K+ views"
    }));
  } catch (err) {
    console.error("Error fetching YouTube videos:", err);
    return MOCK_YOUTUBE_VIDEOS.slice(0, limit);
  }
}

export async function getChannelStats(): Promise<{ subscriberCount: string; videoCount: string }> {
  const fallback = { subscriberCount: '150K+', videoCount: '500+' };
  
  if (!YOUTUBE_API_KEY || YOUTUBE_CHANNEL_ID === 'UC-placeholder') {
    return fallback;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?key=${YOUTUBE_API_KEY}&id=${YOUTUBE_CHANNEL_ID}&part=statistics`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error(`YouTube API returned status ${response.status}`);
    }

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      const stats = data.items[0].statistics;
      
      const subsNum = parseInt(stats.subscriberCount, 10);
      let subsStr = stats.subscriberCount;
      if (subsNum >= 1000000) {
        subsStr = `${(subsNum / 1000000).toFixed(1)}M`;
      } else if (subsNum >= 1000) {
        subsStr = `${(subsNum / 1000).toFixed(0)}K+`;
      }

      return {
        subscriberCount: subsStr,
        videoCount: `${parseInt(stats.videoCount, 10)}+`
      };
    }
    return fallback;
  } catch (err) {
    console.error("Error fetching YouTube statistics:", err);
    return fallback;
  }
}
