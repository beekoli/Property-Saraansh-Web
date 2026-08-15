import { permanentRedirect } from 'next/navigation';

// The /news listing has been split into two city pages — /noida-news and
// /pune-news. Noida is the primary market, so the old /news listing URL now
// permanently redirects there (308), preserving its accumulated link equity.
//
// NOTE: this only affects the listing. Article pages live at /news/[slug]
// (a separate route segment) and are NOT touched by this redirect.
export default function News() {
  permanentRedirect('/noida-news');
}
