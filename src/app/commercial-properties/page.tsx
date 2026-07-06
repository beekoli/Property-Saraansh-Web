import { Metadata } from 'next';
import PropertyCard from '@/components/PropertyCard';
import { getPropertiesByTypeTerm, getFeaturedImage } from '@/lib/wordpress';

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Commercial Properties in Noida | High ROI Investment | Property Saraansh',
    description: 'Explore high-yielding commercial properties in Noida and Greater Noida. Retail shops, office spaces, and food courts with maximum footfall and rental growth.',
  };
}

export default async function CommercialProperties() {
  const properties = await getPropertiesByTypeTerm(20, 75); // Commercial taxonomy term id

  return (
    <div className="bg-brand-pale min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-brand-primary uppercase tracking-widest text-xs font-bold block mb-2">Investment Hubs</span>
          <h1 className="text-4xl md:text-5xl font-bold heading-playfair text-brand-dark mb-4">Commercial Properties</h1>
          <div className="w-20 h-0.5 bg-brand-accent mx-auto mb-6"></div>
          <p className="text-brand-dark/75 text-sm md:text-base font-light leading-relaxed">
            High ROI commercial investments across Noida. Handpicked retail shops, premium office spaces, and modern food courts.
          </p>
        </div>

        {/* Results meta */}
        {properties.length > 0 && (
          <div className="text-sm font-semibold text-brand-ink/70 mb-6 border-b border-brand-light/20 pb-4">
            Showing {properties.length} commercial {properties.length === 1 ? 'project' : 'projects'}
          </div>
        )}

        {/* Grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => {
              const acf = prop.acf || {};
              const bhks = acf.configuration ? acf.configuration.split(', ') : ["Commercial Shop"];
              return (
                <PropertyCard
                  key={prop.id}
                  id={prop.slug}
                  title={prop.title.rendered}
                  developer={acf.developer || "M3M Group"}
                  location={acf.location || 'Noida'}
                  price={acf.price || 'Price on Request'}
                  type={acf.property_type || 'Commercial'}
                  imageUrl={getFeaturedImage(prop)}
                  bhk={bhks}
                  videoId={acf.video_id}
                  reraNumber={acf.rera_number}
                  possessionDate={acf.possession_date}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-brand-dark/60 border border-brand-light/10 rounded-2xl bg-white shadow-sm">
            <p className="text-lg">No commercial properties found yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
