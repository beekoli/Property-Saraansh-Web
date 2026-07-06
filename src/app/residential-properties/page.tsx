import { Metadata } from 'next';
import PropertyCard from '@/components/PropertyCard';
import { getPropertiesByTypeTerm, getFeaturedImage, getCardData } from '@/lib/wordpress';

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Luxury Residential Properties in Noida | Premium Living | Property Saraansh',
    description: 'Find your dream home with low-density residential towers, premium villas, and luxury sky condos in Noida Expressway and Sector 150. Honest reviews.',
  };
}

export default async function ResidentialProperties() {
  const properties = await getPropertiesByTypeTerm(20, 74); // Residential taxonomy term id

  return (
    <div className="bg-brand-pale min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-brand-primary uppercase tracking-widest text-xs font-bold block mb-2">Luxury living</span>
          <h1 className="text-4xl md:text-5xl font-bold heading-playfair text-brand-dark mb-4">Residential Properties</h1>
          <div className="w-20 h-0.5 bg-brand-accent mx-auto mb-6"></div>
          <p className="text-brand-dark/75 text-sm md:text-base font-light leading-relaxed">
            Discover luxury living spaces, low-density apartment towers, and premium sky condominiums for your family in Sector 150 and Noida Expressway.
          </p>
        </div>

        {/* Results meta */}
        {properties.length > 0 && (
          <div className="text-sm font-semibold text-brand-ink/70 mb-6 border-b border-brand-light/20 pb-4">
            Showing {properties.length} residential {properties.length === 1 ? 'project' : 'projects'}
          </div>
        )}

        {/* Grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => {
              const card = getCardData(prop);
              return (
                <PropertyCard
                  key={prop.id}
                  id={prop.slug}
                  title={prop.title.rendered}
                  developer={card.developer}
                  location={card.location}
                  price={card.price}
                  type={card.type}
                  imageUrl={getFeaturedImage(prop)}
                  bhk={card.bhk.length ? card.bhk : ["3 BHK", "4 BHK"]}
                  videoId={card.videoId}
                  reraNumber={card.reraNumber}
                  possessionDate={card.possessionDate}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-brand-dark/60 border border-brand-light/10 rounded-2xl bg-white shadow-sm">
            <p className="text-lg">No residential properties found yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
