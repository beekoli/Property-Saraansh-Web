import { Metadata } from 'next';
import Link from 'next/link';
import { getBuilders } from '@/lib/wordpress';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Builders & Developers in Noida | Property Saraansh',
    description: 'Explore trusted real estate developers and builders in Noida, Greater Noida and Yamuna Expressway — their track record, delivered projects, and current listings, reviewed by Property Saraansh.',
  };
}

export default async function BuildersPage() {
  const builders = await getBuilders();
  const sorted = [...builders].sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-brand-pale">
      {/* Page Header */}
      <section className="bg-brand-dark pt-28 pb-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
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
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="heading-playfair text-4xl md:text-5xl text-brand-accent mb-4 font-bold">
            Builders &amp; Developers
          </h1>
          <p className="text-brand-pale/80 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Trusted developers building in Noida, Greater Noida and the Yamuna Expressway corridor — track record, delivered projects, and everything they have live with us.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {sorted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((builder) => {
              const logo = builder.acf?.builder_logo;
              return (
                <Link
                  key={builder.id}
                  href={`/builders/${builder.slug}`}
                  className="group bg-white rounded-xl border border-brand-pale hover:border-brand-light p-6 flex items-center gap-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-16 h-16 rounded-lg bg-brand-pale flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logo} alt={builder.name} className="w-full h-full object-contain p-2" />
                    ) : (
                      <span className="text-brand-primary font-bold text-lg heading-playfair">
                        {builder.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-brand-ink text-base group-hover:text-brand-primary transition-colors line-clamp-1">
                      {builder.name}
                    </h2>
                    <p className="text-xs text-brand-dark/60 mt-1">
                      {builder.count} {builder.count === 1 ? 'Project' : 'Projects'} with us
                    </p>
                    {builder.acf?.builder_experience && (
                      <p className="text-[11px] text-brand-primary font-semibold mt-0.5">
                        {builder.acf.builder_experience} Experience
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-brand-dark/60 border border-brand-light/10 rounded-2xl bg-white shadow-sm">
            <p className="text-lg">No builders found yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
