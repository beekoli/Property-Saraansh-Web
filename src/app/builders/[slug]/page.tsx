import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import { getBuilders, getBuilderBySlug, getPropertiesByBuilder, getFeaturedImage, getCardData } from '@/lib/wordpress';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const builders = await getBuilders();
  return builders.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const builder = await getBuilderBySlug(slug);
  if (!builder) return { title: 'Builder Not Found | Property Saraansh' };

  return {
    title: `${builder.name} Projects in Noida | Property Saraansh`,
    description: `Explore all ${builder.name} projects in Noida, Greater Noida and Yamuna Expressway — price, floor plans, possession status, and honest reviews from Property Saraansh.`,
  };
}

export default async function BuilderProfilePage({ params }: Props) {
  const { slug } = await params;
  const builder = await getBuilderBySlug(slug);
  if (!builder) return notFound();

  const [properties, allBuilders] = await Promise.all([
    getPropertiesByBuilder(builder.id),
    getBuilders(),
  ]);

  const otherBuilders = allBuilders.filter((b) => b.id !== builder.id).slice(0, 8);
  const acf = builder.acf || {};

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
            <Link href="/" className="hover:text-brand-accent">Home</Link> / <Link href="/builders" className="hover:text-brand-accent">Builders</Link> / <span className="text-brand-accent">{builder.name}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-24 h-24 rounded-xl bg-white flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg">
              {acf.builder_logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={acf.builder_logo} alt={builder.name} className="w-full h-full object-contain p-3" />
              ) : (
                <span className="text-brand-primary font-bold text-2xl heading-playfair">
                  {builder.name.slice(0, 3).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h1 className="heading-playfair text-3xl md:text-4xl text-brand-accent font-bold mb-2">
                {builder.name} — Projects in Noida
              </h1>
              {acf.builder_description && (
                <p className="text-brand-pale/80 text-sm md:text-base max-w-2xl font-light leading-relaxed">
                  {acf.builder_description}
                </p>
              )}
            </div>
          </div>

          {/* Trust stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {acf.builder_delivered_projects && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-xl md:text-2xl font-bold text-brand-accent">{acf.builder_delivered_projects}</div>
                <div className="text-[11px] text-brand-pale/70 mt-1 uppercase tracking-wide">Delivered</div>
              </div>
            )}
            {acf.builder_experience && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-xl md:text-2xl font-bold text-brand-accent">{acf.builder_experience}</div>
                <div className="text-[11px] text-brand-pale/70 mt-1 uppercase tracking-wide">Experience</div>
              </div>
            )}
            {acf.builder_ongoing_projects && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-xl md:text-2xl font-bold text-brand-accent">{acf.builder_ongoing_projects}</div>
                <div className="text-[11px] text-brand-pale/70 mt-1 uppercase tracking-wide">Ongoing</div>
              </div>
            )}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-brand-accent">{builder.count}</div>
              <div className="text-[11px] text-brand-pale/70 mt-1 uppercase tracking-wide">Reviewed by Us</div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-xl md:text-2xl font-bold heading-playfair text-brand-dark mb-6">
          {builder.name} Projects We&apos;ve Reviewed
        </h2>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => {
              const card = getCardData(prop);
              return (
                <PropertyCard
                  key={prop.id}
                  id={prop.slug}
                  title={prop.title.rendered}
                  developer={card.developer || builder.name}
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
            <p className="text-lg">No projects listed yet for {builder.name}.</p>
          </div>
        )}

        {/* Other builders */}
        {otherBuilders.length > 0 && (
          <div className="mt-20">
            <h2 className="text-xl md:text-2xl font-bold heading-playfair text-brand-dark mb-6">
              Explore Other Builders
            </h2>
            <div className="flex flex-wrap gap-3">
              {otherBuilders.map((b) => (
                <Link
                  key={b.id}
                  href={`/builders/${b.slug}`}
                  className="bg-white border border-brand-pale hover:border-brand-primary text-brand-ink hover:text-brand-primary rounded-lg px-5 py-3 text-sm font-semibold shadow-sm transition-colors"
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
