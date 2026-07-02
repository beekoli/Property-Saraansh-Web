export interface YTVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  category: string;
  views?: string;
  likes?: string;
  comments?: string;
}

export function getVideoSlug(video: { id: string; title: string }): string {
  const slugifiedTitle = video.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Trim hyphens
    .substring(0, 60); // Limit length to 60 chars
  return `${slugifiedTitle}-${video.id}`;
}

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || 'UC5eDcgQ_bYCzNrJUm34C4_w';

export const MOCK_YOUTUBE_VIDEOS: YTVideo[] = [
  {
      "id": "z-nxbCBtffY",
      "title": "Things Nobody Talks About Noida Residents | Social Issues Every Noida Resident Faces",
      "description": "Things Nobody Talks About Noida Residents | Social Issues Every Noida Resident Faces - An honest deep dive into the real social issues faced by Noida residents that nobody talks about. Property Saraansh explores the ground reality of living in Noida beyond just real estate.",
      "thumbnail": "https://i.ytimg.com/vi/z-nxbCBtffY/hqdefault.jpg",
      "publishedAt": "2026-06-16",
      "duration": "0:00",
      "category": "Real Estate",
      "views": "0 views",
      "likes": "0",
      "comments": "0"
    },
  {
      "id": "qWAgkIW6Mj0",
      "title": "Yamuna Expressway Investment 2030: Who Should Buy, Who Should Avoid & Future Price Prediction",
      "description": "Watch the full review of Yamuna Expressway Investment 2030: Who Should Buy, Who Should Avoid & Future Price Prediction by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/qWAgkIW6Mj0/hqdefault.jpg",
      "publishedAt": "13 days ago",
      "duration": "19:35",
      "category": "Real Estate",
      "views": "25K views views"
    },
    {
      "id": "pAs9OoMvjQE",
      "title": "CRC The Peridona Jaypee Greens Noida | Why This Is Noida’s Most Exclusive Project?",
      "description": "Watch the full review of CRC The Peridona Jaypee Greens Noida | Why This Is Noida’s Most Exclusive Project? by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/pAs9OoMvjQE/hqdefault.jpg",
      "publishedAt": "1 month ago",
      "duration": "20:09",
      "category": "Real Estate",
      "views": "18K views views"
    },
    {
      "id": "g2dN6stL3i0",
      "title": "Noida Market Slowdown: Effects on Builders, Sellers & Buyers in 2026",
      "description": "Watch the full review of Noida Market Slowdown: Effects on Builders, Sellers & Buyers in 2026 by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/g2dN6stL3i0/hqdefault.jpg",
      "publishedAt": "2 months ago",
      "duration": "10:51",
      "category": "Real Estate",
      "views": "15K views views"
    },
    {
      "id": "qfwf1IcrlsI",
      "title": "Max Estates 105 vs Max Estates 128 | Which One is Better?",
      "description": "Watch the full review of Max Estates 105 vs Max Estates 128 | Which One is Better? by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/qfwf1IcrlsI/hqdefault.jpg",
      "publishedAt": "2 months ago",
      "duration": "12:16",
      "category": "Real Estate",
      "views": "6.1K views views"
    },
    {
      "id": "YKWtYdh_4dQ",
      "title": "Noida Property Market Reality | Authority, Builder, Broker & Buyer Truth",
      "description": "Watch the full review of Noida Property Market Reality | Authority, Builder, Broker & Buyer Truth by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/YKWtYdh_4dQ/hqdefault.jpg",
      "publishedAt": "3 months ago",
      "duration": "11:56",
      "category": "Real Estate",
      "views": "6.5K views views"
    },
    {
      "id": "hCyx0D2_RzE",
      "title": "Eldeco 7 Peaks Residences Omicron 1 Greater Noida | 3BHK Layout Analysis + Investment Potential",
      "description": "Watch the full review of Eldeco 7 Peaks Residences Omicron 1 Greater Noida | 3BHK Layout Analysis + Investment Potential by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/hCyx0D2_RzE/hqdefault.jpg",
      "publishedAt": "3 months ago",
      "duration": "14:02",
      "category": "Real Estate",
      "views": "18K views views"
    },
    {
      "id": "LJo0YtPpTnY",
      "title": "Commercial Property in Noida: Builder Lease vs Self Lease",
      "description": "Watch the full review of Commercial Property in Noida: Builder Lease vs Self Lease by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/LJo0YtPpTnY/hqdefault.jpg",
      "publishedAt": "4 months ago",
      "duration": "12:30",
      "category": "Real Estate",
      "views": "8.2K views views"
    },
    {
      "id": "tWk2i0WUqiY",
      "title": "Godrej Arden Sigma 3 Review | Price, Floor Plan & Location Analysis",
      "description": "Watch the full review of Godrej Arden Sigma 3 Review | Price, Floor Plan & Location Analysis by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/tWk2i0WUqiY/hqdefault.jpg",
      "publishedAt": "4 months ago",
      "duration": "12:24",
      "category": "Real Estate",
      "views": "11K views views"
    },
    {
      "id": "41xfVmmczUA",
      "title": "Commercial investment in Noida | Builder Leased vs Self Lease ?",
      "description": "Watch the full review of Commercial investment in Noida | Builder Leased vs Self Lease ? by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/41xfVmmczUA/hqdefault.jpg",
      "publishedAt": "4 months ago",
      "duration": "12:38",
      "category": "Real Estate",
      "views": "5K views views"
    },
    {
      "id": "xicR-MeU77g",
      "title": "Noida Property Market 2025: What Worked & What Failed",
      "description": "Watch the full review of Noida Property Market 2025: What Worked & What Failed by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/xicR-MeU77g/hqdefault.jpg",
      "publishedAt": "5 months ago",
      "duration": "32:41",
      "category": "Real Estate",
      "views": "17K views views"
    },
    {
      "id": "9iAnowOVwjo",
      "title": "Exit Advice on 3 Residential Projects in Noida  Ace Terra, Godrej Tropical Isle and Ace Hanei",
      "description": "Watch the full review of Exit Advice on 3 Residential Projects in Noida  Ace Terra, Godrej Tropical Isle and Ace Hanei by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/9iAnowOVwjo/hqdefault.jpg",
      "publishedAt": "5 months ago",
      "duration": "11:47",
      "category": "Real Estate",
      "views": "28K views views"
    },
    {
      "id": "gYfkP-0pi0o",
      "title": "Experion Saatori Sector 151 Noida | Honest Review & Investment Analysis",
      "description": "Watch the full review of Experion Saatori Sector 151 Noida | Honest Review & Investment Analysis by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/gYfkP-0pi0o/hqdefault.jpg",
      "publishedAt": "6 months ago",
      "duration": "11:57",
      "category": "Real Estate",
      "views": "23K views views"
    },
    {
      "id": "6P-wf8O5Or8",
      "title": "Sobha Rivana Noida Extension Review Better Than Sobha Aurum or Overpriced?",
      "description": "Watch the full review of Sobha Rivana Noida Extension Review Better Than Sobha Aurum or Overpriced? by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/6P-wf8O5Or8/hqdefault.jpg",
      "publishedAt": "7 months ago",
      "duration": "11:34",
      "category": "Real Estate",
      "views": "7.5K views views"
    },
    {
      "id": "LRZV-H--Qlw",
      "title": "Jacob & Co Noida | India’s First Branded Residence in Noida | M3M x Jacob & Co Ultra Luxury Review",
      "description": "Watch the full review of Jacob & Co Noida | India’s First Branded Residence in Noida | M3M x Jacob & Co Ultra Luxury Review by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/LRZV-H--Qlw/hqdefault.jpg",
      "publishedAt": "7 months ago",
      "duration": "11:27",
      "category": "Real Estate",
      "views": "12K views views"
    },
    {
      "id": "oecEN5Ng0-o",
      "title": "L&T Green Reserve Noida price detail payment plan exit Policy & Appreciation Prospects",
      "description": "Watch the full review of L&T Green Reserve Noida price detail payment plan exit Policy & Appreciation Prospects by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/oecEN5Ng0-o/hqdefault.jpg",
      "publishedAt": "8 months ago",
      "duration": "13:05",
      "category": "Real Estate",
      "views": "5.3K views views"
    },
    {
      "id": "ugD-yKaiV2U",
      "title": "Prestige City Ghaziabad 4-Month Update | New Phase & Project Progress Explained",
      "description": "Watch the full review of Prestige City Ghaziabad 4-Month Update | New Phase & Project Progress Explained by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/ugD-yKaiV2U/hqdefault.jpg",
      "publishedAt": "8 months ago",
      "duration": "10:17",
      "category": "Real Estate",
      "views": "8.5K views views"
    },
    {
      "id": "YL6j01ID38w",
      "title": "⁠L&T Green Reserve Sector 128 Noida - Watch this video before you buy ! Compete Buying Guide",
      "description": "Watch the full review of ⁠L&T Green Reserve Sector 128 Noida - Watch this video before you buy ! Compete Buying Guide by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/YL6j01ID38w/hqdefault.jpg",
      "publishedAt": "9 months ago",
      "duration": "9:01",
      "category": "Real Estate",
      "views": "9.4K views views"
    },
    {
      "id": "qKtESl55t-8",
      "title": "Is Gaur's Yamuna Expressway Launch a Worthy or Overpriced?",
      "description": "Watch the full review of Is Gaur's Yamuna Expressway Launch a Worthy or Overpriced? by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/qKtESl55t-8/hqdefault.jpg",
      "publishedAt": "9 months ago",
      "duration": "10:41",
      "category": "Real Estate",
      "views": "6.7K views views"
    },
    {
      "id": "tQlCLCmTe5g",
      "title": "Noida Expressway's TOP3 Most PROFITABLE Self-Use Projects in 2025 Revealed",
      "description": "Watch the full review of Noida Expressway's TOP3 Most PROFITABLE Self-Use Projects in 2025 Revealed by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/tQlCLCmTe5g/hqdefault.jpg",
      "publishedAt": "9 months ago",
      "duration": "16:17",
      "category": "Real Estate",
      "views": "7.3K views views"
    },
    {
      "id": "Q54r9FzP6oA",
      "title": "Is Ace The Nest Studio Apartments and Ace Verde on Yamuna Expressway an Opportunity or Huge Mistake?",
      "description": "Watch the full review of Is Ace The Nest Studio Apartments and Ace Verde on Yamuna Expressway an Opportunity or Huge Mistake? by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/Q54r9FzP6oA/hqdefault.jpg",
      "publishedAt": "10 months ago",
      "duration": "15:38",
      "category": "Real Estate",
      "views": "10K views views"
    },
    {
      "id": "HJ461VdqOQ8",
      "title": "Is Panvel the NEW FUTURE of Mumbai's 3.O Real Estate Market? #GodrejCityPanvel",
      "description": "Watch the full review of Is Panvel the NEW FUTURE of Mumbai's 3.O Real Estate Market? #GodrejCityPanvel by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/HJ461VdqOQ8/hqdefault.jpg",
      "publishedAt": "11 months ago",
      "duration": "10:23",
      "category": "Real Estate",
      "views": "7.8K views views"
    },
    {
      "id": "i3FOJ1ZX79Q",
      "title": "Godrej Evergreen Square Apartments in Hinjewadi Pune",
      "description": "Watch the full review of Godrej Evergreen Square Apartments in Hinjewadi Pune by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/i3FOJ1ZX79Q/hqdefault.jpg",
      "publishedAt": "11 months ago",
      "duration": "6:35",
      "category": "Real Estate",
      "views": "5.2K views views"
    },
    {
      "id": "j3U6dH_TqC8",
      "title": "Sobha Aurum Greater Noida Sector 36 OR Prestige City Indirapuram Which ONE IS BETTER for you ?",
      "description": "Watch the full review of Sobha Aurum Greater Noida Sector 36 OR Prestige City Indirapuram Which ONE IS BETTER for you ? by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/j3U6dH_TqC8/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "10:59",
      "category": "Real Estate",
      "views": "9.3K views views"
    },
    {
      "id": "oL--4DULuS8",
      "title": "Is Godrej Majesty Noida extension worthy of an Investment?",
      "description": "Watch the full review of Is Godrej Majesty Noida extension worthy of an Investment? by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/oL--4DULuS8/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "11:02",
      "category": "Real Estate",
      "views": "4.7K views views"
    },
    {
      "id": "K-s0W7NJMrk",
      "title": "Is ACE ACREVILLE Really Worth the HIGH Price of 1.3L per yard?",
      "description": "Watch the full review of Is ACE ACREVILLE Really Worth the HIGH Price of 1.3L per yard? by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/K-s0W7NJMrk/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "11:12",
      "category": "Real Estate",
      "views": "4.3K views views"
    },
    {
      "id": "q37-HJHFhGc",
      "title": "Dasnac Yuva Studio Apartments Review | Rental Reality, ROI & Investment Analysis",
      "description": "Watch the full review of Dasnac Yuva Studio Apartments Review | Rental Reality, ROI & Investment Analysis by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/q37-HJHFhGc/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "7:13",
      "category": "Real Estate",
      "views": "12K views views"
    },
    {
      "id": "yXLifyXxDKc",
      "title": "Top 3 Ready to move flats on Noida Expressway",
      "description": "Watch the full review of Top 3 Ready to move flats on Noida Expressway by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/yXLifyXxDKc/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "11:43",
      "category": "Real Estate",
      "views": "8.8K views views"
    },
    {
      "id": "vhttyOmqcuQ",
      "title": "Sobha Aurum Greater Noida Sector 36, Is it worth the hype ?",
      "description": "Watch the full review of Sobha Aurum Greater Noida Sector 36, Is it worth the hype ? by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/vhttyOmqcuQ/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "14:25",
      "category": "Real Estate",
      "views": "17K views views"
    },
    {
      "id": "WGZZIqeLoaU",
      "title": "ATS Province D Olympia vs ACE Estate: Which Yamuna Expressway Township Is Better in 2025?",
      "description": "Watch the full review of ATS Province D Olympia vs ACE Estate: Which Yamuna Expressway Township Is Better in 2025? by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/WGZZIqeLoaU/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "5:35",
      "category": "Real Estate",
      "views": "20K views views"
    },
    {
      "id": "g805jc8GKhU",
      "title": "Purvanchal Sunbliss 22D Yamuna Expressway  Secrets For BEST Investment",
      "description": "Watch the full review of Purvanchal Sunbliss 22D Yamuna Expressway  Secrets For BEST Investment by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/g805jc8GKhU/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "7:19",
      "category": "Real Estate",
      "views": "12K views views"
    },
    {
      "id": "PbyXvIrful0",
      "title": "SKA estate Luxury Apartments in Greater Noida at Realistic Prices",
      "description": "Watch the full review of SKA estate Luxury Apartments in Greater Noida at Realistic Prices by Property Saraansh. Learn about layouts, project specifications, location advantages, pricing, and possession timelines in Noida.",
      "thumbnail": "https://i.ytimg.com/vi/PbyXvIrful0/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "15:41",
      "category": "Real Estate",
      "views": "15K views"
    },
    {
      "id": "RiwupPz-wmQ",
      "title": "Ace Groups New Residential Plots at Yamuna Expressway Noida",
      "description": "Residential Ace estate plots at Yamuna Expressway Noida  #aceestate #aceplots #aceacreville #aceyamunaexpressway #acegroup #plotsonyamunaexpressway #yamunapl...",
      "thumbnail": "https://i.ytimg.com/vi/RiwupPz-wmQ/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "6:33",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "Dfba98En7rk",
      "title": "Godrej Riverine – A Luxury Apartment Option Near Delhi",
      "description": "Godrej Riverine Sector 44 Noida: Redefining Premium Living  For those seeking a blend of luxury, comfort, and modern living in the thriving city of Noida, Go...",
      "thumbnail": "https://i.ytimg.com/vi/Dfba98En7rk/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "6:23",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "NAb2cM4Q-1I",
      "title": "Prestige City Ghaziabad Launch: Everything You Need to Know Now",
      "description": "Prestige City Indirapuram Ghaziabad – Everything You Need to Know NowWhen it comes to premium residential living, Prestige City Ghaziabad sets a new benchmar...",
      "thumbnail": "https://i.ytimg.com/vi/NAb2cM4Q-1I/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "9:40",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "_YKDglIq2Fg",
      "title": "Top 3 Studio Apartments in Noida for High ROI",
      "description": "Explore the top 3 studio apartments in Noida—#dasnacarc  #orion132 #FairfoxEON —that promise excellent rental returns and investment opportunities.Top 3 Stud...",
      "thumbnail": "https://i.ytimg.com/vi/_YKDglIq2Fg/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "7:41",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "jFlFfLNOKx0",
      "title": "Legacy by Gaurs Launches Dream Homes at Unbeatable Prices",
      "description": "Legacy by Gaurs ultra luxury apartments in Jaypee greens noida#legacybygaur #gaurlegacy #gaurlegacy #gaurparichok #gaurisland #gaurnoida #gaurgreaternoidaLeg...",
      "thumbnail": "https://i.ytimg.com/vi/jFlFfLNOKx0/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "8:32",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "NQf0pS1cjPE",
      "title": "What Makes ACE Hanei the MOST Desired 3 and 4 BHK in Noida",
      "description": "ACE Hanei Noida Extension Sector-12 New Project Luxurious 3 &amp; 4 BHK#Acehanei #Acehaneisector12 #AceHaneiGreaterNoida #acegroup #noidarealty #noidaproperties ...",
      "thumbnail": "https://i.ytimg.com/vi/NQf0pS1cjPE/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "9:22",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "WTMe76bD6-I",
      "title": "Taj Skyscape Noida | Why HNIs Are Choosing Hotel-Managed Residences Over Luxury Apartments",
      "description": "Taj Hotel Branded Residences Coming to Noida Expressway Collab with Gulshan Group | The G by Gulshan group 5 Star Presidential Apartment Suites in Noida |Big...",
      "thumbnail": "https://i.ytimg.com/vi/WTMe76bD6-I/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "5:40",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "d89gA6WupxM",
      "title": "M3M Cullinan and Max estate 128 on Noida Expressway are The MOST Luxurious Apartments",
      "description": "Ultra Luxury Apartments Options on Noida Expressway M3M The Cullinan Noida and max estate 128#m3mnoida #maxestatenoida #m3mcullinan #m3mproperties #maxestate...",
      "thumbnail": "https://i.ytimg.com/vi/d89gA6WupxM/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "6:43",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "ux80FKaXqdg",
      "title": "Further Clarity on Prestige City Ghaziabad Payment Plan | Exit Plan | Better than Gaur NYC?",
      "description": "Prestige City Ghaziabad - Further clarification #prestigesiddharthvihar #prestigeproperty #prestigecity #prestigeindrapuram #prestigeghaziabad Are you curious ...",
      "thumbnail": "https://i.ytimg.com/vi/ux80FKaXqdg/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "6:45",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "vhbwRsbIO5c",
      "title": "Comparing Top Noida Studio Projects - EON vs Orion vs M3M Vs Golden Palm",
      "description": "Studio Apartment - Brand New Pre-Launch option/EON Vs Orion/Dasnac Vs M3M/Zest Vs Golden Palm #dasnacarc #fairfoxeon #fairfoxnoida #M3Mtheline #m3mstudio #m3m...",
      "thumbnail": "https://i.ytimg.com/vi/vhbwRsbIO5c/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "7:25",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "qeOagu8B3Kc",
      "title": "Prestige City Ghaziabad - A Practical Review by Property Saraansh",
      "description": "OAKWOOD in the Prestige City Ghaziabad - A Practical Review by Property Saraansh #prestigesiddharthvihar #prestigeghaziabad #prestigecity #prestigeoakwood",
      "thumbnail": "https://i.ytimg.com/vi/qeOagu8B3Kc/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "8:54",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "WPmnUl3ru9U",
      "title": "Want to buy an Apartment in Noida? Things you should consider!",
      "description": "Investing in an apartment in Noida can be an excellent decision, but it's crucial to consider several factors before making a purchase. As a rapidly developing...",
      "thumbnail": "https://i.ytimg.com/vi/WPmnUl3ru9U/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "8:33",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "rbgRjoP2KIU",
      "title": "I Compared Dasnac ARC and M3M The Line for Rental Income Here's What I Found",
      "description": "I Compared Dasnac ARC and M3M The Line for Rental Income Here's What I Found #m3mline #dasnacarc #m3mstudio #m3mtheline #dasnacyuva #dasnac124 #studioapartment...",
      "thumbnail": "https://i.ytimg.com/vi/rbgRjoP2KIU/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "7:05",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "s6V6M2zApmI",
      "title": "Is Samridhi Daksh Avenue Really BETTER Than Prateek Canary For Investment",
      "description": "Sector 150 Noida Luxury Projects Samridhi Dakhsh Avenue Vs. Prateek Canary Discover the ultimate luxury living experience at Sector 150 Noida. Samridhi Dakhsh...",
      "thumbnail": "https://i.ytimg.com/vi/s6V6M2zApmI/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "8:57",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "fvggntit8Dg",
      "title": "Plots in Noida Top Factors to be considered",
      "description": "Investing in a plot in Noida can be a lucrative opportunity, but it's crucial to consider several factors before making a purchase. In this video explained all...",
      "thumbnail": "https://i.ytimg.com/vi/fvggntit8Dg/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "9:06",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "DidX6OywjW0",
      "title": "Studio Apartments in Noida-Best Small investment on Noida Expressway",
      "description": "Studio Apartments in Noida-Best Small investment on Noida Expressway #eonstudio #orionstudio #orion132 #dasnacarc #dasnacyuva #dasnac124 Investing in a studio...",
      "thumbnail": "https://i.ytimg.com/vi/DidX6OywjW0/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "7:47",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "1JFYaapc3eA",
      "title": "Is Sector 150 Noida's Hidden Real Estate Gem?",
      "description": "Which is the best place to buy a home in Noida? Is Sector 150 Noida's Hidden Real Estate Gem? #sector150noida #noidaexpressway #propertyinvestor #sportscityno...",
      "thumbnail": "https://i.ytimg.com/vi/1JFYaapc3eA/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "4:51",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "0crM1LCI8dk",
      "title": "Gulshan Dynasty Sample flat tour ready to move in 4 BHK Ultra Luxury Apartments",
      "description": "Gulshan Dynasty in Noida: 4 BHK Ultra Luxury Apartments on Noida Expressway #gulshandynasty #gulshangroup #ultraluxuryliving #propertyreview #realestateinves...",
      "thumbnail": "https://i.ytimg.com/vi/0crM1LCI8dk/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "3:04",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "LLYIqQZ9Qr8",
      "title": "Top 5 Residential Projects on Noida Expressway",
      "description": "Top 5 Residential Projects on Noida Expressway: Looking for the best place to call home along the Noida Expressway? Check out this video showcasing the top 5 ...",
      "thumbnail": "https://i.ytimg.com/vi/LLYIqQZ9Qr8/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "5:42",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "Hd7cHcVrBWE",
      "title": "Best Commercial Property on Noida Expressway for Investment",
      "description": "Best Commercial Property on Noida Expressway for Investment Noida Expressway has emerged as one of the most lucrative hubs for commercial real estate in Ind...",
      "thumbnail": "https://i.ytimg.com/vi/Hd7cHcVrBWE/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "4:59",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "P0qDqzgMcho",
      "title": "Max Estates 128 and Max Estates 360: Your Gateway to Luxury Living",
      "description": "Max Estates 128 and Max Estates 360: Your Gateway to Luxury Living Are you looking for a home that combines luxury, comfort, and holistic living? Max Estates ...",
      "thumbnail": "https://i.ytimg.com/vi/P0qDqzgMcho/hqdefault.jpg",
      "publishedAt": "1 year ago",
      "duration": "4:32",
      "category": "Real Estate",
      "views": "10K+ views"
    },
    {
      "id": "fslL0ubv2O4",
      "title": "Will Yamuna Expressway Actually Boom by 2030? #yamunaexpressway #noidarealestate",
      "description": "Will Yamuna Expressway Actually Boom by 2030? #yamunaexpressway #noidarealestate",
      "thumbnail": "https://i.ytimg.com/vi/fslL0ubv2O4/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "10K views"
    },
    {
      "id": "Hh_ZPRycdKE",
      "title": "CRC Sublimis Success ➝ Now CRC The Peridona Takes Over!",
      "description": "CRC Sublimis Success ➝ Now CRC The Peridona Takes Over!",
      "thumbnail": "https://i.ytimg.com/vi/Hh_ZPRycdKE/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "771 views"
    },
    {
      "id": "aYa-PtBcXl4",
      "title": "CRC The Flagship noida exclusivity begins here",
      "description": "CRC The Flagship noida exclusivity begins here",
      "thumbnail": "https://i.ytimg.com/vi/aYa-PtBcXl4/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "1K views"
    },
    {
      "id": "IDO0ymvDMN0",
      "title": "How Does the Same Land Price Double in Noida? #shorts",
      "description": "How Does the Same Land Price Double in Noida? #shorts",
      "thumbnail": "https://i.ytimg.com/vi/IDO0ymvDMN0/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "1.1K views"
    },
    {
      "id": "HH_BLcXgyh8",
      "title": "Sobha Rivana Noida Extension Review #shorts",
      "description": "Sobha Rivana Noida Extension Review #shorts",
      "thumbnail": "https://i.ytimg.com/vi/HH_BLcXgyh8/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "2.6K views"
    },
    {
      "id": "X-4FBRXMegE",
      "title": "Eldeco 7 Peaks Residences | Full Honest Review #eldecogreaternoida",
      "description": "Eldeco 7 Peaks Residences | Full Honest Review #eldecogreaternoida",
      "thumbnail": "https://i.ytimg.com/vi/X-4FBRXMegE/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "8.6K views"
    },
    {
      "id": "bPvVo3fyY0g",
      "title": "Elie Saab & Jacob & Co Noida vs M3M Cullinan Resale? #m3mnoida",
      "description": "Elie Saab & Jacob & Co Noida vs M3M Cullinan Resale? #m3mnoida",
      "thumbnail": "https://i.ytimg.com/vi/bPvVo3fyY0g/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "2.2K views"
    },
    {
      "id": "Xm0a4TfOIcs",
      "title": "ACE Estate vs ACE Acreville vs ATS Province D Olympia Plots on Yamuna Expressway: Fresh or Resale?",
      "description": "ACE Estate vs ACE Acreville vs ATS Province D Olympia Plots on Yamuna Expressway: Fresh or Resale?",
      "thumbnail": "https://i.ytimg.com/vi/Xm0a4TfOIcs/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "6.5K views"
    },
    {
      "id": "vLKKclfcVvU",
      "title": "Godrej Arden Review #godrejarden #shorts",
      "description": "Godrej Arden Review #godrejarden #shorts",
      "thumbnail": "https://i.ytimg.com/vi/vLKKclfcVvU/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "2.2K views"
    },
    {
      "id": "j9WmfwO6R1A",
      "title": "Builder Lease vs Self Lease Which is BEST for Your Noida Commercial Property #shorts",
      "description": "Builder Lease vs Self Lease Which is BEST for Your Noida Commercial Property #shorts",
      "thumbnail": "https://i.ytimg.com/vi/j9WmfwO6R1A/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "970 views"
    },
    {
      "id": "7W2HnVE_WyQ",
      "title": "Ace Terra Investors Exit ? #shorts #aceterra",
      "description": "Ace Terra Investors Exit ? #shorts #aceterra",
      "thumbnail": "https://i.ytimg.com/vi/7W2HnVE_WyQ/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "2.2K views"
    },
    {
      "id": "n3xQEmTDZS4",
      "title": "Unable to Exit Your Noida Property Investment? Watch This First  #propertysaraansh #noidarealty",
      "description": "Unable to Exit Your Noida Property Investment? Watch This First  #propertysaraansh #noidarealty",
      "thumbnail": "https://i.ytimg.com/vi/n3xQEmTDZS4/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "2.2K views"
    },
    {
      "id": "GD1ax-NI1gY",
      "title": "Experion 151 Noida Honest Review | Should You Buy Here?",
      "description": "Experion 151 Noida Honest Review | Should You Buy Here?",
      "thumbnail": "https://i.ytimg.com/vi/GD1ax-NI1gY/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "2.7K views"
    },
    {
      "id": "3uW5F19WXY0",
      "title": "Wishing You a Happy Diwali Team Property Saraansh #happydiwali",
      "description": "Wishing You a Happy Diwali Team Property Saraansh #happydiwali",
      "thumbnail": "https://i.ytimg.com/vi/3uW5F19WXY0/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "1.5K views"
    },
    {
      "id": "I1O5bCqKcgs",
      "title": "L&T Golf Course Apartments Sector 128 Noida Expressway Reserve Green EOI Started",
      "description": "L&T Golf Course Apartments Sector 128 Noida Expressway Reserve Green EOI Started",
      "thumbnail": "https://i.ytimg.com/vi/I1O5bCqKcgs/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "5K views"
    },
    {
      "id": "o1EvJ6eO9WI",
      "title": "ACE The Nest or Fairfox EON, Dasnac ARC ? | Which Studio Apartment Wins for ROI & Location in 2025?",
      "description": "ACE The Nest or Fairfox EON, Dasnac ARC ? | Which Studio Apartment Wins for ROI & Location in 2025?",
      "thumbnail": "https://i.ytimg.com/vi/o1EvJ6eO9WI/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "8.2K views"
    },
    {
      "id": "V0-CB-BHygo",
      "title": "Godrej Evergreen Square in Hinjewadi Pune #godrejevergreensquare #godrejhinjewadipune",
      "description": "Godrej Evergreen Square in Hinjewadi Pune #godrejevergreensquare #godrejhinjewadipune",
      "thumbnail": "https://i.ytimg.com/vi/V0-CB-BHygo/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "2.5K views"
    },
    {
      "id": "6hop-aVpJHs",
      "title": "The Future of Luxury Living in NOIDA Revealed #jaypeegreens #camellias #dlfprivana",
      "description": "The Future of Luxury Living in NOIDA Revealed #jaypeegreens #camellias #dlfprivana",
      "thumbnail": "https://i.ytimg.com/vi/6hop-aVpJHs/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "4K views"
    },
    {
      "id": "ddl6kteX9Ms",
      "title": "Sobha 36 greater Noida EOI process",
      "description": "Sobha 36 greater Noida EOI process",
      "thumbnail": "https://i.ytimg.com/vi/ddl6kteX9Ms/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "1.5K views"
    },
    {
      "id": "zhbuPaDFGqc",
      "title": "Oakwood At The Prestige City Ghaziabad #prestigesiddharthvihar #oawoodprestige #prestigeghaziabad",
      "description": "Oakwood At The Prestige City Ghaziabad #prestigesiddharthvihar #oawoodprestige #prestigeghaziabad",
      "thumbnail": "https://i.ytimg.com/vi/zhbuPaDFGqc/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "3.4K views"
    },
    {
      "id": "IAu1mHz5BPU",
      "title": "Prestige city Ghaziabad RERA Received #prestigesiddharthvihar #prestigeghaziabad",
      "description": "Prestige city Ghaziabad RERA Received #prestigesiddharthvihar #prestigeghaziabad",
      "thumbnail": "https://i.ytimg.com/vi/IAu1mHz5BPU/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "3.8K views"
    },
    {
      "id": "_KdW-ZbDDwg",
      "title": "Purvanchal Sunbliss Sector 22D on Yamuna Expressway Pricing and Pre-Launch Details",
      "description": "Purvanchal Sunbliss Sector 22D on Yamuna Expressway Pricing and Pre-Launch Details",
      "thumbnail": "https://i.ytimg.com/vi/_KdW-ZbDDwg/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "5.8K views"
    },
    {
      "id": "heHoAeyzVqI",
      "title": "₹9.4 Crore Luxury 4BHK in Noida That Sells Out Fast #LuxuryHomes #Noida",
      "description": "₹9.4 Crore Luxury 4BHK in Noida That Sells Out Fast #LuxuryHomes #Noida",
      "thumbnail": "https://i.ytimg.com/vi/heHoAeyzVqI/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "2.7K views"
    },
    {
      "id": "XaJAvEMOY3c",
      "title": "Wishing entire Family of PROPERTY SARAANSH a Very Happy New Year ! #happynewyear #newyear2025",
      "description": "Wishing entire Family of PROPERTY SARAANSH a Very Happy New Year ! #happynewyear #newyear2025",
      "thumbnail": "https://i.ytimg.com/vi/XaJAvEMOY3c/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "447 views"
    },
    {
      "id": "p8eeYqhVUgY",
      "title": "Prestige City Ghaziabad #prestigecityghaziabad",
      "description": "Prestige City Ghaziabad #prestigecityghaziabad",
      "thumbnail": "https://i.ytimg.com/vi/p8eeYqhVUgY/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "9.3K views"
    },
    {
      "id": "sF4KdO4AzsM",
      "title": "Prestige Siddharth Vihar Pre Launch Opportunity #prestigecity #prestigecityghaziabad",
      "description": "Prestige Siddharth Vihar Pre Launch Opportunity #prestigecity #prestigecityghaziabad",
      "thumbnail": "https://i.ytimg.com/vi/sF4KdO4AzsM/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "3.1K views"
    },
    {
      "id": "VMFJGlKdBD4",
      "title": "Orion 132 best commercial investment #noidaexpressway #commercialproperty #studioapartments",
      "description": "Orion 132 best commercial investment #noidaexpressway #commercialproperty #studioapartments",
      "thumbnail": "https://i.ytimg.com/vi/VMFJGlKdBD4/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "7.2K views"
    },
    {
      "id": "HDT3ksdZdCg",
      "title": "My attitude after closing 10 deals😛 #realtor #realtorsofinstagram  #realestatemarket2024 #realtors",
      "description": "My attitude after closing 10 deals😛 #realtor #realtorsofinstagram  #realestatemarket2024 #realtors",
      "thumbnail": "https://i.ytimg.com/vi/HDT3ksdZdCg/hqdefault.jpg",
      "publishedAt": "Recently",
      "duration": "0:59",
      "category": "Shorts",
      "views": "975 views"
    }
];

function decodeXml(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

export async function getLatestVideosFromRss(channelId: string, limit = 12): Promise<YTVideo[]> {
  try {
    const response = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error(`YouTube RSS returned status ${response.status}`);
    }
    
    const xml = await response.text();
    const entries: YTVideo[] = [];
    const entryMatches = xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g);
    
    for (const match of entryMatches) {
      const content = match[1];
      const videoIdMatch = content.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = content.match(/<title>([^<]+)<\/title>/);
      const publishedMatch = content.match(/<published>([^<]+)<\/published>/);
      const thumbMatch = content.match(/<media:thumbnail[^>]+url="([^"]+)"/);
      const descMatch = content.match(/<media:description>([\s\S]*?)<\/media:description>/);
      
      if (videoIdMatch && titleMatch) {
        const id = videoIdMatch[1].trim();
        const title = decodeXml(titleMatch[1].trim());
        const publishedVal = publishedMatch ? publishedMatch[1].trim() : "";
        let publishedAt = "Recently";
        if (publishedVal) {
          const d = new Date(publishedVal);
          publishedAt = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        }
          
        const thumbnail = thumbMatch ? thumbMatch[1].trim() : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
        const rawDesc = descMatch ? descMatch[1].trim() : "";
        const cleanDesc = decodeXml(rawDesc);
        const description = cleanDesc.substring(0, 160) + (cleanDesc.length > 160 ? "..." : "");
        
        const isShort = title.toLowerCase().includes('#shorts') ||
                        title.toLowerCase().includes('#short') ||
                        title.toLowerCase().includes('shorts') ||
                        cleanDesc.toLowerCase().includes('#shorts') ||
                        cleanDesc.toLowerCase().includes('#short');
        entries.push({
          id,
          title,
          description,
          thumbnail,
          publishedAt,
          duration: isShort ? "0:59" : "10:00",
          category: isShort ? "Shorts" : "Real Estate",
          views: "10K+ views"
        });
      }
      
      if (entries.length >= limit) {
        break;
      }
    }
    
    return entries;
  } catch (err) {
    console.error("Failed to parse YouTube RSS feed:", err);
    return [];
  }
}


export function parseIsoDuration(durationStr: string): { seconds: number; formatted: string } {
  const matches = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) {
    return { seconds: 0, formatted: "10:00" };
  }
  const hours = parseInt(matches[1] || '0', 10);
  const minutes = parseInt(matches[2] || '0', 10);
  const seconds = parseInt(matches[3] || '0', 10);
  
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  
  let formatted = "";
  if (hours > 0) {
    formatted += `${hours}:${minutes.toString().padStart(2, '0')}:`;
  } else {
    formatted += `${minutes}:`;
  }
  formatted += seconds.toString().padStart(2, '0');
  
  return { seconds: totalSeconds, formatted };
}

export function formatViewCount(viewsStr?: string): string {
  if (!viewsStr) return "10K+ views";
  const viewsNum = parseInt(viewsStr, 10);
  if (isNaN(viewsNum)) return "10K+ views";
  if (viewsNum >= 1000000) {
    return `${(viewsNum / 1000000).toFixed(1)}M views`;
  } else if (viewsNum >= 1000) {
    return `${(viewsNum / 1000).toFixed(0)}K views`;
  }
  return `${viewsNum} views`;
}

export async function getLatestYouTubeVideos(limit = 12): Promise<YTVideo[]> {
  if (!YOUTUBE_API_KEY || YOUTUBE_CHANNEL_ID === 'UC-placeholder') {
    const rssVideos = await getLatestVideosFromRss(YOUTUBE_CHANNEL_ID, limit);
    const seenIds = new Set(rssVideos.map(v => v.id));
    const combined = [...rssVideos];
    for (const mockVid of MOCK_YOUTUBE_VIDEOS) {
      if (!seenIds.has(mockVid.id)) {
        combined.push(mockVid);
      }
    }
    return combined.slice(0, limit);
  }

  const uploadsPlaylistId = YOUTUBE_CHANNEL_ID.startsWith('UC')
    ? 'UU' + YOUTUBE_CHANNEL_ID.substring(2)
    : YOUTUBE_CHANNEL_ID;

  let allVideos: YTVideo[] = [];
  let pageToken = '';

  try {
    while (allVideos.length < limit) {
      const fetchLimit = Math.min(limit - allVideos.length, 50);
      let url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${YOUTUBE_API_KEY}\u0026playlistId=${uploadsPlaylistId}\u0026part=snippet,contentDetails\u0026maxResults=${fetchLimit}`;
      if (pageToken) {
        url += `\u0026pageToken=${pageToken}`;
      }

      const response = await fetch(url, { next: { revalidate: 3600 } });
      if (!response.ok) {
        throw new Error(`YouTube API returned status ${response.status}`);
      }

      const data = await response.json();
      if (!data.items || data.items.length === 0) {
        break;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const videoIds = data.items.map((item: any) => item.snippet.resourceId?.videoId).filter(Boolean);
      const detailsMap: Record<string, { duration: string; views: string; likes: string; comments: string; isShort: boolean }> = {};
      
      if (videoIds.length > 0) {
        try {
          const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds.join(',')}&part=contentDetails,statistics`;
          const detailsRes = await fetch(detailsUrl, { next: { revalidate: 3600 } });
          if (detailsRes.ok) {
            const detailsData = await detailsRes.json();
            if (detailsData.items) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              detailsData.items.forEach((item: any) => {
                const durationStr = item.contentDetails?.duration || "";
                const viewsStr = item.statistics?.viewCount || "";
                const likesStr = item.statistics?.likeCount || "";
                const commentsStr = item.statistics?.commentCount || "";
                const { seconds, formatted } = parseIsoDuration(durationStr);
                const isShortDuration = seconds > 0 && seconds <= 60;
                
                detailsMap[item.id] = {
                  duration: formatted,
                  views: formatViewCount(viewsStr),
                  likes: formatViewCount(likesStr),
                  comments: formatViewCount(commentsStr),
                  isShort: isShortDuration
                };
              });
            }
          }
        } catch (detailErr) {
          console.error("Error fetching video details from YouTube API:", detailErr);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped = data.items.map((item: any) => {
        const videoId = item.snippet.resourceId?.videoId || "";
        const title = item.snippet.title || "";
        const desc = item.snippet.description || "";
        
        let isShort = title.toLowerCase().includes('#shorts') ||
                      title.toLowerCase().includes('#short') ||
                      title.toLowerCase().includes('shorts') ||
                      desc.toLowerCase().includes('#shorts') ||
                      desc.toLowerCase().includes('#short');
                      
        let duration = isShort ? "0:59" : "12:00";
        let views = "10K+ views";
        
        const details = detailsMap[videoId];
        if (details) {
          duration = details.duration;
          views = details.views;
          isShort = isShort || details.isShort;
        }

        return {
          id: videoId,
          title: title,
          description: desc,
          thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          duration,
          category: isShort ? "Shorts" : "Real Estate",
          views
        };
      });

      allVideos = [...allVideos, ...mapped];
      pageToken = data.nextPageToken;

      if (!pageToken) {
        break;
      }
    }

    return allVideos;
  } catch (err) {
    console.error("Error fetching YouTube videos via playlistItems:", err);
    const rssVideos = await getLatestVideosFromRss(YOUTUBE_CHANNEL_ID, limit);
    const seenIds = new Set(rssVideos.map(v => v.id));
    const combined = [...rssVideos];
    for (const mockVid of MOCK_YOUTUBE_VIDEOS) {
      if (!seenIds.has(mockVid.id)) {
        combined.push(mockVid);
      }
    }
    return combined.slice(0, limit);
  }
}

export async function getChannelStats(): Promise<{ subscriberCount: string; videoCount: string }> {
  const fallback = { subscriberCount: '60K+', videoCount: '180+' };
  
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

export async function getVideoById(id: string): Promise<YTVideo | null> {
  // 1. Try to find in mock list first
  const mockVideo = MOCK_YOUTUBE_VIDEOS.find(v => v.id === id);
  if (mockVideo) return mockVideo;

  // 2. If API Key is present, try YouTube API
  if (YOUTUBE_API_KEY && YOUTUBE_CHANNEL_ID !== 'UC-placeholder') {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${id}&part=snippet`,
        { next: { revalidate: 86400 } } // Cache for 24 hours
      );
      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const item = data.items[0];
          const title = item.snippet.title || "";
          const desc = item.snippet.description || "";
          const isShort = title.toLowerCase().includes('#shorts') ||
                          title.toLowerCase().includes('#short') ||
                          title.toLowerCase().includes('shorts') ||
                          desc.toLowerCase().includes('#shorts') ||
                          desc.toLowerCase().includes('#short');
          return {
            id: item.id,
            title: title,
            description: desc,
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
            publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            duration: isShort ? "0:59" : "12:00",
            category: isShort ? "Shorts" : "Real Estate",
            views: "10K+ views"
          };
        }
      }
    } catch (err) {
      console.error("Error fetching video by ID from API:", err);
    }
  }

  // 3. Fallback: Try RSS feed to find it
  try {
    const rssVideos = await getLatestVideosFromRss(YOUTUBE_CHANNEL_ID, 50);
    const rssVideo = rssVideos.find(v => v.id === id);
    if (rssVideo) return rssVideo;
  } catch (err) {
    console.error("Error searching RSS feed for video ID:", err);
  }

  // 4. Ultimate Fallback: Construct a generated metadata placeholder
  return {
    id,
    title: "Noida Real Estate Video Walkthrough | Property Saraansh",
    description: "Watch this comprehensive real estate video walkthrough. Join Saraansh Seth as he reviews property layouts, construction quality, price guides, and developer credentials in the Noida area.",
    thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    publishedAt: "Recently",
    duration: "10:00",
    category: "Real Estate",
    views: "10K+ views"
  };
}
