import PropertyCard from '@/components/PropertyCard';
import { getProperties, getFeaturedImage } from '@/lib/wordpress';

export const revalidate = 60;

export default async function CommercialProperties() {
  // Fetch commercial properties. 
  // In a real WP setup, you'd filter by taxonomy/ACF field. For now, we fetch all and filter client/server-side if possible.
  const properties = await getProperties(20, 'commercial');

  return (
    <div className="bg-[#0A1A1C] min-h-screen pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif text-[#E5C099] mb-4">Commercial Properties</h1>
          <p className="text-[#A0B2B4] max-w-2xl mx-auto">
            High ROI commercial investments across Noida. Handpicked retail shops, office spaces, and food courts.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.length > 0 ? (
            properties.map((prop) => (
              <PropertyCard 
                key={prop.id}
                id={prop.slug}
                title={prop.title.rendered}
                location={prop.acf?.location || 'Noida'}
                price={prop.acf?.price || 'Price on Request'}
                type={prop.acf?.property_type || 'Commercial'}
                imageUrl={getFeaturedImage(prop)}
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 text-center py-12 text-[#A0B2B4]">
              <p>No commercial properties found yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

