import { Metadata } from 'next';
import { getPageBySlug } from '@/lib/wordpress';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('about-us');
  if (!page || !page.yoast_head_json) return { title: 'About Us | Property Saraansh' };

  return {
    title: page.yoast_head_json.title || 'About Us | Property Saraansh',
    description: page.yoast_head_json.description || 'Noida\'s Most Trusted Real Estate Advisors',
    openGraph: {
      title: page.yoast_head_json.og_title,
      description: page.yoast_head_json.og_description,
      images: page.yoast_head_json.og_image?.map(img => img.url) || [],
    }
  };
}

export default async function AboutUs() {
  const page = await getPageBySlug('about-us');

  // Fallback defaults if WordPress is not yet configured
  const title = page?.acf?.hero_title || 'About Property Saraansh';
  const subtitle = page?.acf?.subtitle || "Noida's Most Trusted Real Estate Advisors";
  const paragraph1 = page?.acf?.paragraph_1 || "Property Saraansh is a premier real estate consulting agency based in Noida. We specialize in providing transparent, data-driven, and highly researched property advisory services to our clients.";
  const paragraph2 = page?.acf?.paragraph_2 || "With our strong presence on YouTube, we believe in educating our investors before they make a decision. Our in-depth video reviews of commercial and residential projects across Noida and Greater Noida have helped thousands of families and investors find their perfect property.";
  const paragraph3 = page?.acf?.paragraph_3 || "Our mission is to bring absolute clarity to the real estate buying process, ensuring that every investment you make is secure, profitable, and aligned with your long-term goals.";
  
  const stat1_value = page?.acf?.stat_1_value || "500+";
  const stat1_label = page?.acf?.stat_1_label || "Happy Families";
  const stat2_value = page?.acf?.stat_2_value || "50+";
  const stat2_label = page?.acf?.stat_2_label || "Projects Reviewed";
  const stat3_value = page?.acf?.stat_3_value || "100K+";
  const stat3_label = page?.acf?.stat_3_label || "YouTube Subs";

  return (
    <div className="bg-[#0A1A1C] min-h-screen pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-serif text-[#E5C099] mb-8 text-center">{title}</h1>
        
        <div className="bg-[#06282B] rounded-xl p-8 md:p-12 shadow-2xl border border-[#1A3E42]">
          <h2 className="text-2xl text-white font-semibold mb-6">{subtitle}</h2>
          
          <div className="space-y-6 text-[#A0B2B4] leading-relaxed">
            <p>{paragraph1}</p>
            <p>{paragraph2}</p>
            <p>{paragraph3}</p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 border border-[#1A3E42] rounded-lg">
              <div className="text-4xl text-[#E5C099] font-bold mb-2">{stat1_value}</div>
              <div className="text-white text-sm uppercase tracking-wider">{stat1_label}</div>
            </div>
            <div className="p-6 border border-[#1A3E42] rounded-lg">
              <div className="text-4xl text-[#E5C099] font-bold mb-2">{stat2_value}</div>
              <div className="text-white text-sm uppercase tracking-wider">{stat2_label}</div>
            </div>
            <div className="p-6 border border-[#1A3E42] rounded-lg">
              <div className="text-4xl text-[#E5C099] font-bold mb-2">{stat3_value}</div>
              <div className="text-white text-sm uppercase tracking-wider">{stat3_label}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

