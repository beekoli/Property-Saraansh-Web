import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.propertysaraansh.com";
const SITE_TITLE = "Property Saraansh | Real Estate Consultancy Noida";
const SITE_DESCRIPTION =
  "Trusted real estate consultancy in Noida. We provide expert property advisory, investment guidance, and YouTube-based project reviews.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  verification: {
    google: "_Xr2QUL1CTNah4TlCKAyFAwRQwVlS0lHxqA1gHz74VU",
  },
  openGraph: {
    type: "website",
    siteName: "Property Saraansh",
    locale: "en_IN",
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Property Saraansh" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/logo.png"],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "RealEstateAgent"],
  name: "Property Saraansh",
  description:
    "Property Saraansh is Noida's trusted real estate consultancy, helping home buyers, investors, and NRIs find the right residential and commercial properties across Noida, Greater Noida, and Noida Extension.",
  url: "https://www.propertysaraansh.com",
  telephone: "+91-80761-78189",
  email: "karmaglobalretail@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Office No. 1604, Tower-A, ATS Bouquet, Block B, Sector 132",
    addressLocality: "Noida",
    addressRegion: "Uttar Pradesh",
    postalCode: "201301",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 28.5022,
    longitude: 77.4053,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:30",
      closes: "18:30",
    },
  ],
  sameAs: [
    "https://www.youtube.com/@PropertySaraansh",
    "https://www.facebook.com/PropertySaraansh",
    "https://instagram.com/propertysaraansh",
    "https://www.linkedin.com/company/propertysaraansh/",
    "https://x.com/propsaraansh",
  ],
  areaServed: [
    { "@type": "City", name: "Noida" },
    { "@type": "City", name: "Greater Noida" },
    { "@type": "City", name: "Noida Extension" },
  ],
  founder: {
    "@type": "Person",
    name: "Saraansh Seth",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* LocalBusiness JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TWS3H2JB');`,
          }}
        />
        {/* End Google Tag Manager */}
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8Q2JGP02QS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8Q2JGP02QS');
          `}
        </Script>
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TWS3H2JB"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        {/* End Google Tag Manager (noscript) */}
        <Navbar />
        <main className="flex-grow animate-fade-in bg-brand-dark text-white">
          {children}
        </main>
        <Footer />

      </body>
    </html>
  );
}
