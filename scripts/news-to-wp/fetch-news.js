/**
 * Property Saraansh — News candidate fetcher (Google News RSS)
 * -----------------------------------------------------------
 * Reads your search terms from ./search-terms.txt, queries the free
 * Google News RSS search feed for each (India-localised), de-duplicates,
 * drops anything already published on your site, and writes a ranked
 * candidate list you can skim and pick from.
 *
 * It does NOT publish anything and needs NO API key. It only READS the
 * public list of your live post titles (no password used) to avoid
 * suggesting stories you've already covered.
 *
 * Usage (from this folder):
 *   node fetch-news.js                 # last 7 days, writes candidates.md + candidates.json
 *   node fetch-news.js --days=3        # narrow the time window
 *   node fetch-news.js --max=8         # max articles kept per search term (default 10)
 *   node fetch-news.js --no-site-dedup # skip the "already on site" filter
 *
 * Edit search-terms.txt to change what it watches (one term per line, # = comment).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

// WP_URL is used ONLY to read the public list of live post titles (no auth, no password).
const WP_URL = (process.env.WP_URL || '').replace(/\/$/, '');

const arg = (name, def) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : def;
};
const DAYS = parseInt(arg('days', '7'), 10) || 7;
const MAX_PER_TERM = parseInt(arg('max', '10'), 10) || 10;
const SITE_DEDUP = !process.argv.includes('--no-site-dedup');

const TERMS_FILE = path.join(__dirname, 'search-terms.txt');
const OUT_MD = path.join(__dirname, 'candidates.md');
const OUT_JSON = path.join(__dirname, 'candidates.json');

// ---------- helpers ----------
function decodeEntities(s = '') {
  return s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .trim();
}

// Normalised key for de-duplication (lowercase, alphanumeric words, first 8 words).
function titleKey(title = '') {
  return decodeEntities(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 8)
    .join(' ');
}

function cleanTitle(raw = '') {
  // Google News titles end with " - Publisher"; strip that for readability.
  const t = decodeEntities(raw);
  const i = t.lastIndexOf(' - ');
  return i > 20 ? t.slice(0, i).trim() : t;
}

function parseRss(xml) {
  const items = [];
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  for (const b of blocks) {
    const title = (b.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
    const link = (b.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '';
    const pub = (b.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || '';
    const source = (b.match(/<source[^>]*>([\s\S]*?)<\/source>/) || [])[1] || '';
    items.push({
      title: cleanTitle(title),
      rawTitle: decodeEntities(title),
      link: decodeEntities(link),
      source: decodeEntities(source),
      date: pub ? new Date(pub) : null,
    });
  }
  return items;
}

function readTerms() {
  if (!fs.existsSync(TERMS_FILE)) {
    const defaults = `# One search term per line. Lines starting with # are ignored.
# Edit freely - these feed Google News. Keep them specific to your beats.

Noida real estate
Greater Noida property
Noida Extension property
YEIDA Yamuna Expressway real estate
Noida International Airport Jewar real estate
Noida commercial property lease
UP-RERA Noida
New Noida DNGIR
Pune real estate
Pune property market
NRI real estate investment India
`;
    fs.writeFileSync(TERMS_FILE, defaults);
    console.log(`   (created ${path.basename(TERMS_FILE)} with starter terms - edit it anytime)\n`);
  }
  return fs
    .readFileSync(TERMS_FILE, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));
}

async function fetchTerm(term) {
  const q = encodeURIComponent(`${term} when:${DAYS}d`);
  const url = `https://news.google.com/rss/search?q=${q}&hl=en-IN&gl=IN&ceid=IN:en`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (PropertySaraansh news fetcher)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  return parseRss(xml);
}

// Pull the public list of live post titles so we don't resuggest covered stories.
async function fetchSiteTitles() {
  if (!WP_URL) return new Set();
  const keys = new Set();
  for (let page = 1; page <= 3; page++) {
    const url = `${WP_URL}/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=title`;
    const res = await fetch(url, { headers: { 'User-Agent': 'PropertySaraansh news fetcher' } });
    if (!res.ok) break;
    const arr = await res.json();
    if (!Array.isArray(arr) || arr.length === 0) break;
    for (const p of arr) keys.add(titleKey(p?.title?.rendered || ''));
    if (arr.length < 100) break;
  }
  return keys;
}

// ---------- main ----------
(async () => {
  console.log('\n============================================================');
  console.log('  Property Saraansh - News candidate fetcher (Google News)');
  console.log('============================================================');
  const terms = readTerms();
  console.log(`   ${terms.length} search term(s) | last ${DAYS} day(s) | up to ${MAX_PER_TERM} per term\n`);

  let siteKeys = new Set();
  if (SITE_DEDUP) {
    try {
      siteKeys = await fetchSiteTitles();
      console.log(`   Loaded ${siteKeys.size} live post title(s) to skip already-covered stories.\n`);
    } catch (e) {
      console.log(`   (could not read live post titles - continuing without site de-dup: ${e.message})\n`);
    }
  }

  const seen = new Map(); // titleKey -> candidate
  let rawCount = 0;

  for (const term of terms) {
    let items = [];
    try {
      items = await fetchTerm(term);
    } catch (e) {
      console.log(`   ! ${term} - fetch failed (${e.message})`);
      continue;
    }
    items.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
    items = items.slice(0, MAX_PER_TERM);
    rawCount += items.length;

    let kept = 0;
    for (const it of items) {
      const key = titleKey(it.rawTitle);
      if (!key) continue;
      if (siteKeys.has(key)) continue; // already on the site
      if (seen.has(key)) {
        seen.get(key).terms.add(term); // same story matched another term
        continue;
      }
      seen.set(key, { ...it, terms: new Set([term]) });
      kept++;
    }
    console.log(`   - ${term}: ${items.length} found, ${kept} new`);
  }

  const candidates = [...seen.values()].sort(
    (a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0)
  );

  // ----- write candidates.md -----
  const fmtDate = (d) => (d ? d.toISOString().slice(0, 10) : '?');
  const today = new Date().toISOString().slice(0, 10);
  let md = `# News candidates - ${today}\n\n`;
  md += `_${candidates.length} new stories across ${terms.length} search terms (last ${DAYS} days). `;
  md += `Tick the ones worth covering, then share the link here to turn into a post._\n\n`;
  for (const c of candidates) {
    md += `- [ ] **${c.title}**  \n`;
    md += `  ${c.source || 'Unknown source'} - ${fmtDate(c.date)} - _${[...c.terms].join(', ')}_  \n`;
    md += `  ${c.link}\n\n`;
  }
  fs.writeFileSync(OUT_MD, md);

  // ----- write candidates.json -----
  fs.writeFileSync(
    OUT_JSON,
    JSON.stringify(
      candidates.map((c) => ({
        title: c.title,
        source: c.source,
        date: fmtDate(c.date),
        terms: [...c.terms],
        link: c.link,
      })),
      null,
      2
    )
  );

  console.log('\n------------------------------------------------------------');
  console.log(`   ${rawCount} articles scanned -> ${candidates.length} new candidate(s) after de-dup.`);
  console.log(`   Written: ${path.basename(OUT_MD)}  and  ${path.basename(OUT_JSON)}`);
  console.log('   Open candidates.md, pick the stories you want, and share each link here.\n');
})();
