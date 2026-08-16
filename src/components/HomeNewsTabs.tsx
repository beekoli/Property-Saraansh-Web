"use client";

import { useState } from 'react';
import Link from 'next/link';
import NewsCard from '@/components/NewsCard';
import StaggerContainer from '@/components/animations/StaggerContainer';
import StaggerItem from '@/components/animations/StaggerItem';

/**
 * Plain shape for a news item on the homepage. Deliberately not a WPPost —
 * this is a client component, and only what the card renders should cross the
 * boundary.
 */
export interface HomeNewsItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  thumbnail: string;
}

interface Props {
  noida: HomeNewsItem[];
  pune: HomeNewsItem[];
}

type CityKey = 'noida' | 'pune';

const CITIES: { key: CityKey; label: string; href: string }[] = [
  { key: 'noida', label: 'Noida', href: '/noida-news' },
  { key: 'pune', label: 'Pune', href: '/pune-news' },
];

/**
 * The homepage news section, split by city.
 *
 * Both feeds are fetched on the server and handed over together, so switching
 * cities is instant — no request, no spinner, no layout shift. That matters
 * more than it sounds: this section sits well down the homepage, and a tab that
 * stalls is worse than no tab at all.
 */
export default function HomeNewsTabs({ noida, pune }: Props) {
  const available = CITIES.filter((c) => (c.key === 'noida' ? noida : pune).length > 0);
  const [active, setActive] = useState<CityKey>(available[0]?.key ?? 'noida');

  const items = active === 'noida' ? noida : pune;
  const activeCity = CITIES.find((c) => c.key === active) ?? CITIES[0];

  if (available.length === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-white border-t border-brand-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <span className="inline-flex items-center gap-2 text-brand-primary uppercase tracking-widest text-[10px] font-bold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></span>
              Updated Daily
            </span>
            <h2 className="heading-playfair text-3xl md:text-4xl text-brand-ink relative inline-block font-bold">
              Real Estate News
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-accent -mb-3"></span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* City switch. Only rendered when both feeds have something in
                them — a lone tab is decoration, not a control. */}
            {available.length > 1 && (
              <div
                role="tablist"
                aria-label="Choose a city"
                className="inline-flex rounded-full bg-brand-pale p-1 border border-brand-light/20 shadow-sm"
              >
                {available.map((city) => {
                  const isActive = city.key === active;
                  return (
                    <button
                      key={city.key}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActive(city.key)}
                      className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                        isActive
                          ? 'bg-brand-dark text-brand-accent shadow-md'
                          : 'text-brand-primary hover:text-brand-dark'
                      }`}
                    >
                      {city.label}
                    </button>
                  );
                })}
              </div>
            )}

            <Link
              href={activeCity.href}
              className="hidden md:flex text-brand-primary font-bold hover:text-brand-accent transition-colors items-center gap-1 group whitespace-nowrap"
            >
              All {activeCity.label} news
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Keying on the active city replays the stagger animation on switch,
            so the change reads as a deliberate transition rather than a flicker. */}
        <StaggerContainer key={active} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <StaggerItem key={item.id}>
              <NewsCard
                slug={item.slug}
                title={item.title}
                excerpt={item.excerpt}
                category={item.category}
                date={item.date}
                thumbnail={item.thumbnail}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="md:hidden text-center mt-8">
          <Link
            href={activeCity.href}
            className="text-brand-primary font-bold hover:text-brand-accent transition-colors flex items-center justify-center gap-1 group"
          >
            All {activeCity.label} news
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
