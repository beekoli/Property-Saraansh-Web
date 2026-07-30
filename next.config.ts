import type { NextConfig } from "next";

/**
 * Legacy WordPress URLs -> their closest equivalent on the current site.
 *
 * The pre-migration WordPress site (archived at
 * orangered-caribou-678500.hostingersite.com) published 86 public URLs. Only 8
 * of them had redirects, so the rest were returning 404 and throwing away any
 * accumulated link equity. Sources are written without a trailing slash: Next
 * normalises "/foo/" to "/foo" before matching, so both forms are covered.
 *
 * Where no direct equivalent exists the target is the relevant hub rather than
 * the homepage — a homepage catch-all reads as a soft 404 to Google.
 */
const LEGACY_WORDPRESS_REDIRECTS: Record<string, string> = {
  // --- Blog posts ---------------------------------------------------------
  '/jacob-co-noida-luxury-branded-homes': '/properties/jacob-and-co-noida',
  '/dasnac-yuva-studio-apartments-a-detailed-investment-review':
    '/our-videos/dasnac-yuva-studio-apartments-review',
  '/noida-real-estate-reforms': '/our-videos/noida-property-market-reality',
  '/max-estates-105-noida-elevated-living-in-sector-105':
    '/blog/max-estates-105-noida-complete-review',
  '/experion-151-noida-full-project-breakdown-pricing-reality-check':
    '/blog/experion-saatori-sector-151-noida-review',
  '/elie-saab-noida-or-jacob-co-noida':
    '/our-videos/elie-saab-jacob-co-vs-m3m-cullinan-noida',
  '/eldeco-7-peaks-residences-a-low-density-landmark-at-omicron-1a-greater-noida':
    '/blog/eldeco-7-peaks-greater-noida-review',
  '/noida-real-estate-2026-why-dasnac-arc-fairfox-eon-m3m-the-cullinan-yamuna-expressway-plots-are-smart-buys':
    '/blog/noida-real-estate-2026-dasnac-arc-fairfox-eon',
  '/godrej-arden-review-the-honest-truth-about-price-location-competitors-in-sigma-3':
    '/blog/godrej-arden-detailed-review-price-analysis-investment-potential-in-greater-noida',
  '/commercial-real-estate-noida-builder-leased-or-self-lease':
    '/blog/commercial-property-in-noida-the-complete-guide',
  '/studio-apartments-in-noida-residential':
    '/our-videos/studio-apartments-noida-expressway-investment',
  '/m3m-the-cullinan-vs-max-estate-128':
    '/our-videos/m3m-cullinan-vs-max-estate-128-noida',
  '/taj-hotel-taj-branded-residences-coming-to-noida-a-landmark-collaboration-between-ihcl-and-gulshan-group':
    '/our-videos/taj-skyscape-noida-review',
  '/experion-151-noida-ultra-luxury-3-4-bhk-apartments-on-noida-expressway':
    '/properties/experion-saatori-sector-151-noida',
  '/is-panvel-the-future-of-mumbais-3-0-real-estate':
    '/blog/panvel-real-estate-mumbai-3-investment-review',
  '/sobha-noida-extension-a-detailed-review':
    '/blog/sobha-rivana-noida-extension-review',
  '/sobha-greater-noida-vs-prestige-city-ghaziabad':
    '/our-videos/sobha-aurum-sector-36-vs-prestige-indirapuram',
  '/ace-the-nest-studio-smart-investment-or-overhyped-hype':
    '/our-videos/ace-nest-studio-yamuna-expressway-review',
  '/gaur-yamuna-city-review': '/blog/gaur-chrysalis-yamuna-expressway-review',
  '/top-3-flats-on-expressway':
    '/our-videos/top-3-ready-to-move-flats-on-noida-expressway',

  // --- Property pages (Houzez CPT lived at /property/) ---------------------
  '/property': '/properties',
  '/property/eldeco-7-peaks-residence': '/properties/eldeco-7-peaks-residences',
  '/property/ace-verde-sector-22d-greater-noida':
    '/our-videos/ace-nest-studio-yamuna-expressway-review',
  '/property/ace-the-nest-yamunaexpressway':
    '/our-videos/ace-nest-studio-yamuna-expressway-review',
  '/property/sobha-aurum-greater-noida-36':
    '/our-videos/sobha-aurum-sector-36-greater-noida-review',
  '/property/jacob-co-noida': '/properties/jacob-and-co-noida',
  '/property/godrej-city-panvel-green-terraces':
    '/blog/panvel-real-estate-mumbai-3-investment-review',
  '/property/godrej-evergreen-square-hinjewadi':
    '/our-videos/godrej-evergreen-square-hinjewadi-pune',
  '/property/lt-green-reserve-sector-128-noida':
    '/blog/lt-green-reserve-sector-128-buying-guide',
  '/property/the-prestige-city-indirapuram':
    '/blog/prestige-city-ghaziabad-4-month-update',
  '/property/dasnac-yuva-124': '/our-videos/dasnac-yuva-studio-apartments-review',
  '/property/max-estate-128-noida': '/properties/max-estate-128-noida',
  // No equivalent yet — send to the projects hub rather than a 404.
  '/property/eldeco-ballads-of-bliss-yamuna-expressway': '/properties',
  '/property/vanaha-pune-by-shapoorji-pallonji': '/properties',

  // --- Static pages -------------------------------------------------------
  '/about-us-property-saraansh': '/about-us',
  '/property-saraansh-team': '/our-team',
  '/agents': '/our-team',
  '/contact-us': '/contact',
  '/apartments': '/properties',
  '/privacy': '/privacy-policy',
  '/terms-and-conditions': '/privacy-policy',

  // --- Watch pages (/our-videos) ------------------------------------------
  '/our-videos/lt-green-reserve-noida-review':
    '/our-videos/lt-green-reserve-noida-price-payment-plan',
  '/our-videos/prestige-city-ghaziabad-mayflower':
    '/blog/prestige-city-ghaziabad-4-month-update',
  '/our-videos/best-self-use-property-on-noida-expressway':
    '/our-videos/top-3-self-use-projects-noida-expressway',
  '/our-videos/gaur-yamuna-expressway':
    '/our-videos/gaurs-yamuna-expressway-launch-review',
  '/our-videos/jacob-and-co-noida-indias-first-branded-residence-in-noida':
    '/our-videos/m3m-jacob-co-noida',
  '/our-videos/ats-province-d-olympia-vs-ace-estate-yamuna-expressway':
    '/our-videos/ats-province-d-olympia-vs-ace-estate',
  '/our-videos/is-panvel-the-new-future-of-mumbais-3-o-real-estate-market':
    '/our-videos/panvel-real-estate-mumbai-3-investment-review',
  '/our-videos/sobha-greater-noida-vs-prestige-city-ghaziabad':
    '/our-videos/sobha-aurum-sector-36-vs-prestige-indirapuram',
  '/our-videos/is-ace-acreville-really-worth-the-high-price-of-1-3l-per-yard':
    '/our-videos/ace-acreville-price-review',
  '/our-videos/dasnac-yuva-review-noida':
    '/our-videos/dasnac-yuva-studio-apartments-review',
  '/our-videos/top-3-ready-to-move-flats-on-noida':
    '/our-videos/top-3-ready-to-move-flats-on-noida-expressway',
  '/our-videos/sobha-noida-extension-review':
    '/our-videos/sobha-rivana-noida-extension-review',
  '/our-videos/purvanchal-sunbliss-yamuna-expressway-secrets-for-best-investment':
    '/our-videos/purvanchal-sunbliss-22d-yamuna-expressway',
  '/our-videos/prestige-city-ghaziabad-launch-everything-you-need-to-know-now':
    '/our-videos/prestige-city-ghaziabad-launch-guide',
  '/our-videos/residential-ace-estate-plots-at-yamuna-expressway-noida':
    '/our-videos/ace-residential-plots-yamuna-expressway',
  '/our-videos/godrej-riverine-noida-luxury':
    '/our-videos/godrej-riverine-luxury-apartments-delhi',
  '/our-videos/m3m-cullinan-and-max-estate-128-on-noida-expressway-are-the-most-luxurious-apartments':
    '/our-videos/m3m-cullinan-vs-max-estate-128-noida',
  '/our-videos/experion-151-noida-pros-cons-final-verdict-property-saraansh-review':
    '/our-videos/experion-151-noida-review',
  '/our-videos/exit-advice-on-3-residential-projects-in-noida-ace-terra-godrej-tropical-isle-and-ace-hanei':
    '/our-videos/exit-advice-noida-residential-projects',
  '/our-videos/noida-real-estate-2025-wrap-up': '/our-videos/noida-property-market-2025',
  '/our-videos/taj-hotel-taj-branded-residences-coming-to-noida':
    '/our-videos/taj-skyscape-noida-review',
  '/our-videos/further-clarity-on-prestige-city-ghaziabad-payment-plan-exit-plan-better-than-gaur-nyc':
    '/our-videos/prestige-city-ghaziabad-payment-plan-exit',
  '/our-videos/explore-studio-apartments-in-noida-with-expert-insights-on-office-suites-residential-studios-commercial-studios-compare-roi-pricing-best-projects-before-investing':
    '/our-videos/noida-studio-projects-eon-vs-orion-vs-m3m',
  '/our-videos/prestige-city-ghaziabad-a-practical-review-by-property-saraansh':
    '/our-videos/prestige-city-ghaziabad-review',
  '/our-videos/commercial-real-estate-noida': '/our-videos/commercial-property-in-noida',
  '/our-videos/noida-real-estate-2026-dasnac-arc-fairfox-eon-cullinan-plots':
    '/blog/noida-real-estate-2026-dasnac-arc-fairfox-eon',
  '/our-videos/eldeco-7-peaks-residences-omicron-1-greater-noida-3bhk-layout-analysis-investment-potential':
    '/our-videos/eldeco-7-peaks-omicron-1',
  '/our-videos/max-105-vs-max-128-explained': '/our-videos/max-estates-105-vs-128',

  // --- Duplicate WordPress posts ------------------------------------------
  // The news script published this article twice seven minutes apart, so
  // WordPress gave the second copy a "-2" slug. The duplicate has been
  // trashed; this consolidates the URL rather than leaving it to 404.
  '/news/yeidas-new-yamuna-city-vision-firms-up-consultant-tender-closes-august-5-2':
    '/news/yeidas-new-yamuna-city-vision-firms-up-consultant-tender-closes-august-5',

  // --- Shorts -------------------------------------------------------------
  '/our-shorts/eldeco-7-peaks-residences-3-4-bhk-at-omicron-1a-eldeco-greater-noida':
    '/our-videos/eldeco-7-peaks-residences-greater-noida-review',
  '/our-shorts/godrej-arden-review': '/our-videos/godrej-arden-review-godrejarden-shorts',
  '/our-shorts/elie-saab-noida-jacob-co-noida-vs-m3m-cullinan-resale':
    '/our-videos/elie-saab-jacob-co-vs-m3m-cullinan-noida',
  '/our-shorts/ace-estate-ace-acreville-ats-province-d-olympia-plots-on-yamuna-expressway':
    '/our-videos/ace-estate-vs-acreville-vs-ats-olympia-plots',
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'login.propertysaraansh.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      },
    ],
  },
  async redirects() {
    return [
      ...Object.entries(LEGACY_WORDPRESS_REDIRECTS).map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'propertysaraansh.in',
          },
        ],
        destination: 'https://www.propertysaraansh.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.propertysaraansh.in',
          },
        ],
        destination: 'https://www.propertysaraansh.com/:path*',
        permanent: true,
      },
      {
        source: '/our-videos/experion-saatori-sector-151-noida-premium-3-4-bhk-review',
        destination: '/our-videos/experion-saatori-sector-151-noida',
        permanent: true,
      },
      {
        source: '/our-videos/exit-advice-on-3-residential-projects-in-noida-ace-terra-godrej-tropical-isle-an',
        destination: '/our-videos/exit-advice-noida-residential-projects',
        permanent: true,
      },
      {
        source: '/our-videos/exit-advice-on-3-residential-projects-in-noida',
        destination: '/our-videos/exit-advice-noida-residential-projects',
        permanent: true,
      },
      {
        source: '/our-videos/jacob-co-noida-first-branded-residence',
        destination: '/our-videos/m3m-jacob-co-noida',
        permanent: true,
      },
      {
        source: '/our-videos/jacob-co-noida-indias-first-branded-residence-in-noida-m3m-x-jacob-co-ultra-luxu',
        destination: '/our-videos/m3m-jacob-co-noida',
        permanent: true,
      },
      {
        source: '/blog/noida-residents-things-nobody-talks-aboutsocial-issues-best-sectors-the-real-picture-of-life-in-noida',
        destination: '/blog/noida-residents-social-issues-best-sectors',
        permanent: true,
      },
      {
        source: '/blog/eldeco-greater-noida-detailed-review-of-eldeco-7-peaks-residences-by-property-saraansh',
        destination: '/blog/eldeco-7-peaks-greater-noida-review',
        permanent: true,
      },
      {
        source: '/why-exit-has-become-the-biggest-problem-in-noida-real-estate/:path*',
        destination: '/blog/why-exit-has-become-the-biggest-problem-in-noida-real-estate/:path*',
        permanent: true,
      },
      {
        source: '/jacob-co-noida-first-branded-residences-in-noida',
        destination: '/our-videos/m3m-jacob-co-noida',
        permanent: true,
      },
      {
        source: '/our-videos/noida-market-slowdown-effects-on-builders-sellers-buyers-in-2026',
        destination: '/our-videos/noida-market-slowdown-2026',
        permanent: true,
      },
      {
        source: '/our-videos/noida-real-estate-market-slowdown-2026',
        destination: '/our-videos/noida-market-slowdown-2026',
        permanent: true,
      },
      {
        source: '/our-videos/max-estates-105-vs-max-estates-128-which-one-is-better',
        destination: '/our-videos/max-estates-105-vs-128',
        permanent: true,
      },
      {
        source: '/our-videos/max-estates-105-noida-price-floor-plan-review-investment-analysis',
        destination: '/our-videos/max-estates-105-vs-128',
        permanent: true,
      },
      {
        source: '/max-estates-105-noida-price-floor-plan',
        destination: '/our-videos/max-estates-105-vs-128',
        permanent: true,
      },
      {
        source: '/our-videos/noida-property-market-reality-authority-builder-broker-buyer-truth',
        destination: '/our-videos/noida-property-market-reality',
        permanent: true,
      },
      {
        source: '/noida-real-estate-reality-illegal-plotting',
        destination: '/our-videos/noida-property-market-reality',
        permanent: true,
      },
      {
        source: '/our-videos/eldeco-7-peaks-residences-omicron-1-greater-noida-3bhk-layout-analysis-investmen',
        destination: '/our-videos/eldeco-7-peaks-omicron-1',
        permanent: true,
      },
      {
        source: '/eldeco-7-peaks-residences-greater-noida',
        destination: '/our-videos/eldeco-7-peaks-omicron-1',
        permanent: true,
      },
      {
        source: '/our-videos/yamuna-expressway-investment-2030-who-should-buy-who-should-avoid-future-price-p',
        destination: '/our-videos/yamuna-expressway-investment-2030',
        permanent: true,
      },
      {
        source: '/our-videos/yamuna-expressway-noida-investment-2030-should-you-buy-property-near-jewar-airport',
        destination: '/our-videos/yamuna-expressway-investment-2030',
        permanent: true,
      },
      {
        source: '/blog/yamuna-expressway-noida-who-should-invest-and-what-will-the-real-estate-market-look-like-by-2030',
        destination: '/blog/yamuna-expressway-property-investment-2030',
        permanent: true,
      },
      {
        source: '/our-videos/eldeco-7-peaks-greater-noida',
        destination: '/our-videos/eldeco-7-peaks-omicron-1',
        permanent: true,
      },
      {
        source: '/our-videos/crc-the-peridona-jaypee-greens-noida-why-this-is-noidas-most-exclusive-project',
        destination: '/our-videos/crc-the-peridona-jaypee-greens',
        permanent: true,
      },
      {
        source: '/crc-the-peridona-jaypee-greens-noida',
        destination: '/our-videos/crc-the-peridona-jaypee-greens',
        permanent: true,
      },
      {
        source: '/eldeco-greater-noida-detailed-review-of-eldeco-7-peaks-residences',
        destination: '/our-videos/eldeco-7-peaks-omicron-1',
        permanent: true,
      },
      {
        source: '/our-videos/commercial-property-in-noida-builder-lease-vs-self-lease',
        destination: '/our-videos/commercial-property-in-noida',
        permanent: true,
      },
      {
        source: '/our-videos/builder-lease-vs-self-lease-noida',
        destination: '/our-videos/commercial-property-in-noida',
        permanent: true,
      },
      {
        source: '/our-videos/commercial-real-estate-in-noida',
        destination: '/our-videos/commercial-property-in-noida',
        permanent: true,
      },
      {
        source: '/our-videos/noida-property-market-2025-what-worked-what-failed',
        destination: '/our-videos/noida-property-market-2025',
        permanent: true,
      },
      {
        source: '/noida-real-estate-2025-conclusion-project-by-project-reality-check-by-property-saraansh',
        destination: '/our-videos/noida-property-market-2025',
        permanent: true,
      },
      {
        source: '/our-shorts/elie-saab-noida-vs-jacob-co-noida-vs-m3m-cullinan',
        destination: '/our-videos/elie-saab-jacob-co-vs-m3m-cullinan-noida',
        permanent: true,
      },
      {
        source: '/our-videos/godrej-arden-sigma-3-review-price-floor-plan-location-analysis',
        destination: '/our-videos/godrej-arden-sigma-3-review',
        permanent: true,
      },
      {
        source: '/our-videos/commercial-investment-in-noida-builder-leased-vs-self-lease',
        destination: '/our-videos/noida-commercial-builder-vs-self-lease',
        permanent: true,
      },
      {
        source: '/our-videos/experion-saatori-sector-151-noida-honest-review-investment-analysis',
        destination: '/our-videos/experion-saatori-sector-151-noida',
        permanent: true,
      },
      {
        source: '/our-videos/sobha-rivana-noida-extension-review-better-than-sobha-aurum-or-overpriced',
        destination: '/our-videos/sobha-rivana-noida-extension-review',
        permanent: true,
      },
      {
        source: '/our-videos/lt-green-reserve-noida-price-detail-payment-plan-exit-policy-appreciation-prospe',
        destination: '/our-videos/lt-green-reserve-noida-price-payment-plan',
        permanent: true,
      },
      {
        source: '/our-videos/prestige-city-ghaziabad-4-month-update-new-phase-project-progress-explained',
        destination: '/our-videos/prestige-city-ghaziabad-4-month-update',
        permanent: true,
      },
      {
        source: '/our-videos/lt-green-reserve-sector-128-noida-watch-this-video-before-you-buy-compete-buying',
        destination: '/our-videos/lt-green-reserve-sector-128-buying-guide',
        permanent: true,
      },
      {
        source: '/our-videos/lt-green-reserve-sector-128-noida',
        destination: '/our-videos/lt-green-reserve-sector-128-buying-guide',
        permanent: true,
      },
      {
        source: '/commercial-property-in-noida-the-complete-guide',
        destination: '/our-videos/noida-commercial-builder-vs-self-lease',
        permanent: true,
      },
      {
        source: '/our-videos/is-gaurs-yamuna-expressway-launch-a-worthy-or-overpriced',
        destination: '/our-videos/gaurs-yamuna-expressway-launch-review',
        permanent: true,
      },
      {
        source: '/our-videos/noida-expressways-top3-most-profitable-self-use-projects-in-2025-revealed',
        destination: '/our-videos/top-3-self-use-projects-noida-expressway',
        permanent: true,
      },
      {
        source: '/our-videos/is-ace-the-nest-studio-apartments-and-ace-verde-on-yamuna-expressway-an-opportun',
        destination: '/our-videos/ace-the-nest-ace-verde-yamuna-expressway',
        permanent: true,
      },
      {
        source: '/our-videos/is-panvel-the-new-future-of-mumbais-3o-real-estate-market-godrejcitypanvel',
        destination: '/our-videos/godrej-city-panvel-mumbai-review',
        permanent: true,
      },
      {
        source: '/our-videos/godrej-evergreen-square-apartments-in-hinjewadi-pune',
        destination: '/our-videos/godrej-evergreen-square-hinjewadi-pune',
        permanent: true,
      },
      {
        source: '/our-videos/sobha-aurum-greater-noida-sector-36-or-prestige-city-indirapuram-which-one-is-be',
        destination: '/our-videos/sobha-aurum-sector-36-vs-prestige-indirapuram',
        permanent: true,
      },
      {
        source: '/our-videos/is-godrej-majesty-noida-extension-worthy-of-an-investment',
        destination: '/our-videos/godrej-majesty-noida-extension-review',
        permanent: true,
      },
      {
        source: '/our-videos/is-ace-acreville-really-worth-the-high-price-of-13l-per-yard',
        destination: '/our-videos/ace-acreville-price-review',
        permanent: true,
      },
      {
        source: '/our-videos/dasnac-yuva-studio-apartments-review-rental-reality-roi-investment-analysis',
        destination: '/our-videos/dasnac-yuva-studio-apartments-review',
        permanent: true,
      },
      {
        source: '/our-videos/sobha-aurum-greater-noida-sector-36-is-it-worth-the-hype',
        destination: '/our-videos/sobha-aurum-sector-36-greater-noida-review',
        permanent: true,
      },
      {
        source: '/our-videos/ats-province-d-olympia-vs-ace-estate-which-yamuna-expressway-township-is-better-',
        destination: '/our-videos/ats-province-d-olympia-vs-ace-estate',
        permanent: true,
      },
      {
        source: '/our-videos/purvanchal-sunbliss-22d-yamuna-expressway-secrets-for-best-investment',
        destination: '/our-videos/purvanchal-sunbliss-22d-yamuna-expressway',
        permanent: true,
      },
      {
        source: '/our-videos/ska-estate-luxury-apartments-in-greater-noida-at-realistic-prices',
        destination: '/our-videos/ska-estate-greater-noida-review',
        permanent: true,
      },
      {
        source: '/our-videos/ace-groups-new-residential-plots-at-yamuna-expressway-noida',
        destination: '/our-videos/ace-residential-plots-yamuna-expressway',
        permanent: true,
      },
      {
        source: '/our-videos/godrej-riverine-a-luxury-apartment-option-near-delhi',
        destination: '/our-videos/godrej-riverine-luxury-apartments-delhi',
        permanent: true,
      },
      {
        source: '/our-videos/prestige-city-ghaziabad-launch-everything-you-need-to-know-n',
        destination: '/our-videos/prestige-city-ghaziabad-launch-guide',
        permanent: true,
      },
      {
        source: '/our-videos/legacy-by-gaurs-launches-dream-homes-at-unbeatable-prices',
        destination: '/our-videos/legacy-by-gaurs-launch',
        permanent: true,
      },
      {
        source: '/our-videos/what-makes-ace-hanei-the-most-desired-3-and-4-bhk-in-noida',
        destination: '/our-videos/ace-hanei-noida-3-4-bhk-review',
        permanent: true,
      },
      {
        source: '/our-videos/taj-skyscape-noida-why-hnis-are-choosing-hotel-managed-resid',
        destination: '/our-videos/taj-skyscape-noida-review',
        permanent: true,
      },
      {
        source: '/our-videos/m3m-cullinan-and-max-estate-128-on-noida-expressway-are-the-',
        destination: '/our-videos/m3m-cullinan-vs-max-estate-128-noida',
        permanent: true,
      },
      {
        source: '/our-videos/further-clarity-on-prestige-city-ghaziabad-payment-plan-exit',
        destination: '/our-videos/prestige-city-ghaziabad-payment-plan-exit',
        permanent: true,
      },
      {
        source: '/our-videos/comparing-top-noida-studio-projects-eon-vs-orion-vs-m3m-vs-g',
        destination: '/our-videos/noida-studio-projects-eon-vs-orion-vs-m3m',
        permanent: true,
      },
      {
        source: '/our-videos/prestige-city-ghaziabad-a-practical-review-by-property-saraa',
        destination: '/our-videos/prestige-city-ghaziabad-review',
        permanent: true,
      },
      {
        source: '/our-videos/want-to-buy-an-apartment-in-noida-things-you-should-consider',
        destination: '/our-videos/buying-apartment-in-noida-guide',
        permanent: true,
      },
      {
        source: '/our-videos/i-compared-dasnac-arc-and-m3m-the-line-for-rental-income-her',
        destination: '/our-videos/dasnac-arc-vs-m3m-the-line-rental-income',
        permanent: true,
      },
      {
        source: '/our-videos/is-samridhi-daksh-avenue-really-better-than-prateek-canary-f',
        destination: '/our-videos/samridhi-daksh-avenue-vs-prateek-canary',
        permanent: true,
      },
      {
        source: '/our-videos/studio-apartments-in-noida-best-small-investment-on-noida-ex',
        destination: '/our-videos/studio-apartments-noida-expressway-investment',
        permanent: true,
      },
      {
        source: '/our-videos/gulshan-dynasty-sample-flat-tour-ready-to-move-in-4-bhk-ultr',
        destination: '/our-videos/gulshan-dynasty-4-bhk-sample-flat-tour',
        permanent: true,
      },
      {
        source: '/our-videos/top-5-residential-projects-on-noida-expressway',
        destination: '/our-videos/top-5-residential-projects-noida-expressway',
        permanent: true,
      },
      {
        source: '/our-videos/best-commercial-property-on-noida-expressway-for-investment',
        destination: '/our-videos/best-commercial-property-noida-expressway',
        permanent: true,
      },
      {
        source: '/our-videos/max-estates-128-and-max-estates-360-your-gateway-to-luxury-l',
        destination: '/our-videos/max-estates-128-and-360-noida',
        permanent: true,
      },
      {
        source: '/our-videos/will-yamuna-expressway-actually-boom-by-2030-yamunaexpressway-noidarealestate',
        destination: '/our-videos/will-yamuna-expressway-boom-by-2030',
        permanent: true,
      },
      {
        source: '/our-videos/crc-sublimis-success-now-crc-the-peridona-takes-over',
        destination: '/our-videos/crc-sublimis-to-crc-the-peridona',
        permanent: true,
      },
      {
        source: '/our-videos/crc-the-flagship-noida-exclusivity-begins-here',
        destination: '/our-videos/crc-the-flagship-noida',
        permanent: true,
      },
      {
        source: '/our-videos/how-does-the-same-land-price-double-in-noida-shorts',
        destination: '/our-videos/how-land-price-doubles-in-noida',
        permanent: true,
      },
      {
        source: '/our-videos/eldeco-7-peaks-residences-full-honest-review-eldecogreaternoida',
        destination: '/our-videos/eldeco-7-peaks-full-review',
        permanent: true,
      },
      {
        source: '/our-videos/elie-saab-jacob-co-noida-vs-m3m-cullinan-resale-m3mnoida',
        destination: '/our-videos/elie-saab-jacob-co-vs-m3m-cullinan-noida',
        permanent: true,
      },
      {
        source: '/our-videos/ace-estate-vs-ace-acreville-vs-ats-province-d-olympia-plots-on-yamuna-expressway',
        destination: '/our-videos/ace-estate-vs-acreville-vs-ats-olympia-plots',
        permanent: true,
      },
      {
        source: '/our-videos/builder-lease-vs-self-lease-which-is-best-for-your-noida-commercial-property-sho',
        destination: '/our-videos/builder-lease-vs-self-lease-noida-short',
        permanent: true,
      },
      {
        source: '/our-videos/unable-to-exit-your-noida-property-investment-watch-this-first-propertysaraansh-',
        destination: '/our-videos/unable-to-exit-noida-property-investment',
        permanent: true,
      },
      {
        source: '/our-videos/experion-151-noida-honest-review-should-you-buy-here',
        destination: '/our-videos/experion-151-noida-review',
        permanent: true,
      },
      {
        source: '/our-videos/wishing-you-a-happy-diwali-team-property-saraansh-happydiwali',
        destination: '/our-videos/happy-diwali-property-saraansh',
        permanent: true,
      },
      {
        source: '/our-videos/lt-golf-course-apartments-sector-128-noida-expressway-reserve-green-eoi-started',
        destination: '/our-videos/lt-golf-course-apartments-sector-128-noida',
        permanent: true,
      },
      {
        source: '/our-videos/ace-the-nest-or-fairfox-eon-dasnac-arc-which-studio-apartment-wins-for-roi-locat',
        destination: '/our-videos/ace-nest-vs-fairfox-eon-vs-dasnac-arc',
        permanent: true,
      },
      {
        source: '/our-videos/godrej-evergreen-square-in-hinjewadi-pune-godrejevergreensquare-godrejhinjewadip',
        destination: '/our-videos/godrej-evergreen-square-hinjewadi-short',
        permanent: true,
      },
      {
        source: '/our-videos/the-future-of-luxury-living-in-noida-revealed-jaypeegreens-camellias-dlfprivana',
        destination: '/our-videos/future-of-luxury-living-in-noida',
        permanent: true,
      },
      {
        source: '/our-videos/oakwood-at-the-prestige-city-ghaziabad-prestigesiddharthvihar-oawoodprestige-pre',
        destination: '/our-videos/oakwood-prestige-city-ghaziabad',
        permanent: true,
      },
      {
        source: '/our-videos/prestige-city-ghaziabad-rera-received-prestigesiddharthvihar-prestigeghaziabad',
        destination: '/our-videos/prestige-city-ghaziabad-rera-received',
        permanent: true,
      },
      {
        source: '/our-videos/purvanchal-sunbliss-sector-22d-on-yamuna-expressway-pricing-and-pre-launch-detai',
        destination: '/our-videos/purvanchal-sunbliss-22d-pricing-details',
        permanent: true,
      },
      {
        source: '/our-videos/94-crore-luxury-4bhk-in-noida-that-sells-out-fast-luxuryhomes-noida',
        destination: '/our-videos/9-4-crore-luxury-4bhk-noida',
        permanent: true,
      },
      {
        source: '/our-videos/wishing-entire-family-of-property-saraansh-a-very-happy-new-year-happynewyear-ne',
        destination: '/our-videos/happy-new-year-property-saraansh',
        permanent: true,
      },
      {
        source: '/our-videos/prestige-siddharth-vihar-pre-launch-opportunity-prestigecity-prestigecityghaziab',
        destination: '/our-videos/prestige-siddharth-vihar-pre-launch',
        permanent: true,
      },
      {
        source: '/our-videos/orion-132-best-commercial-investment-noidaexpressway-commercialproperty-studioap',
        destination: '/our-videos/orion-132-commercial-investment-noida',
        permanent: true,
      },
      {
        source: '/our-videos/my-attitude-after-closing-10-deals-realtor-realtorsofinstagram-realestatemarket2',
        destination: '/our-videos/realtor-life-after-10-deals',
        permanent: true,
      },
      {
        source: '/blog/crc-the-peridona-jaypee-greens-an-honest-review-investment-analysis',
        destination: '/blog/crc-peridona-jaypee-greens-review-noida',
        permanent: true,
      },
      {
        source: '/blog/noida-real-estate-market-2026-slowdown-investment-opportunities-what-buyers-should-do',
        destination: '/blog/noida-real-estate-slowdown-2026',
        permanent: true,
      },
      {
        source: '/blog/noida-real-estate-2025-conclusion-project-by-project-reality-check-by-property-saraansh',
        destination: '/blog/noida-real-estate-2025-recap',
        permanent: true,
      },
      {
        source: '/wp-admin',
        destination: '/',
        permanent: false,
      },
      {
        source: '/wp-login.php',
        destination: '/',
        permanent: false,
      },
      {
        source: '/wp-login',
        destination: '/',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://login.propertysaraansh.com';
    return [
      {
        source: '/wp-content/:path*',
        destination: `${wpUrl}/wp-content/:path*`,
      },
      {
        source: '/wp-includes/:path*',
        destination: `${wpUrl}/wp-includes/:path*`,
      },
    ];
  },
};

export default nextConfig;
