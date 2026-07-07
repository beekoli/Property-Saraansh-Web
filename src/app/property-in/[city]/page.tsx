import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import { getCities, getCityBySlug, getPropertiesInCity } from '@/lib/property';
import { getCardData, getFeaturedImage } from '@/lib/wordpress';

export const revalidate = 60;

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  const cities = await getCities();
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const term = await getCityBySlug(city);
  const name = term?.name || city.replace(/-/g, ' ');
  return {
    title: `Property in ${name} | Projects, Price & Reviews | Property Saraansh`,
    description: `Explore residential and commercial projects in ${name} — price, floor plans, possession status and honest on-ground reviews from Property Saraansh.`,
    alternates: { canonical: `/property-in/${city}` },
  };
}

export default async function PropertyInCityPage({ params }: Props) {
  const { city } = await params;
  const term = await getCityBySlug(city);
  if (!term) return notFound();

  const [properties, allCities] = await Promise.all([
    getPropertiesInCity(term.id),
    getCities(),
  ]);

  const otherCities = allCities.filter((c) => c.id !== term.id);

  return (
    <div className="min-h-screen bg-brand-pale">
      {/* Hero */}
      <section className="bg-brand-dark pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 169, 106, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 169, 106, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-xs text-brand-pale/60 mb-6">
            <Link href="/" className="hover:text-brand-accent">Home</Link> / <Link href="/properties" className="hover:text-brand-accent">Projects</Link> / <span className="text-brand-accent">{term.name}</span>
          </div>
          <span className="text-brand-accent uppercase tracking-widest text-xs font-bold block mb-2">Location</span>
          <h1 className="heading-playfair text-3xl md:text-5xl text-brand-accent font-bold mb-3">
            Property in {term.name}
          </h1>
          <p className="text-brand-pale/80 text-sm md:text-base max-w-2xl font-light leading-relaxed">
            Every residential and commercial project we&apos;ve reviewed in {term.name} — with price, floor plans, possession status and our honest on-ground take.
          </p>
        </div>
      </section>

      {/* Projects grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {properties.length > 0 && (
          <div className="text-sm font-semibold text-brand-ink/70 mb-6 border-b border-brand-light/20 pb-4">
            Showing {properties.length} {properties.length === 1 ? 'project' : 'projects'} in {term.name}
          </div>
        )}

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
          <div className="text-center py-16 text-brand-dark/60 border border-brand-light/10 rounded-2xl bg-white shadow-sm">
            <p className="text-lg">No projects listed yet in {term.name}. Check back soon!</p>
          </div>
        )}

        {/* Other cities */}
        {otherCities.length > 0 && (
          <div className="mt-20">
            <h2 className="text-xl md:text-2xl font-bold heading-playfair text-brand-dark mb-6">
              Explore Other Locations
            </h2>
            <div className="flex flex-wrap gap-3">
              {otherCities.map((c) => (
                <Link
                  key={c.id}
                  href={`/property-in/${c.slug}`}
                  className="bg-white border border-brand-pale hover:border-brand-primary text-brand-ink hover:text-brand-primary rounded-lg px-5 py-3 text-sm font-semibold shadow-sm transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
