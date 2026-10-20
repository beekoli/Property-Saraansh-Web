/**
 * Property Saraansh — Daily News → WordPress drafts
 * -------------------------------------------------
 * For each story in today.md:
 *   1. cleans special characters (₹ → "Rs", – — → -, curly quotes → straight),
 *   2. de-duplicates against ALL existing WordPress News posts (and within the file),
 *   3. creates (or updates in place) a DRAFT post in the "News" category,
 *   4. adds a sub-category + tags, Rank Math SEO, and a branded cover image.
 *
 * Credentials come from ./.env (git-ignored, never leaves your PC).
 *
 * Usage (from this folder):
 *   node create-news-drafts.js            # reads ./today.md → DRAFTS (review, then publish)
 *   node create-news-drafts.js --publish  # same, but posts go LIVE immediately
 *   node create-news-drafts.js file.md    # a specific file
 *   node create-news-drafts.js --dry-run  # parse + covers only, no posting
 *   node create-news-drafts.js --migrate-cities  # one-time: tag existing posts Noida/Pune
 *
 * City routing: each story is filed under "Noida News" or "Pune News" so it
 * shows on /noida-news or /pune-news. Add a "city": "Noida" | "Pune" field to
 * each item in today.md; if omitted, the city is inferred from the text.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const { WP_URL, WP_USERNAME, WP_APP_PASSWORD } = process.env;
const DRY_RUN = process.argv.includes('--dry-run');
const PUBLISH = process.argv.includes('--publish');   // go live directly instead of draft
const STATUS = PUBLISH ? 'publish' : 'draft';
const MIGRATE = process.argv.includes('--migrate-cities'); // one-time: tag existing posts by city
const DEDUP = process.argv.includes('--dedup'); // find same-title posts, keep the best, trash the rest
const inputArg = process.argv.slice(2).find((a) => !a.startsWith('--'));
const INPUT_FILE = inputArg ? path.resolve(inputArg) : path.join(__dirname, 'today.md');

function die(msg) { console.error('\n❌ ' + msg + '\n'); process.exit(1); }

if (!WP_URL || !WP_USERNAME || !WP_APP_PASSWORD) {
  die('Missing WP_URL / WP_USERNAME / WP_APP_PASSWORD. Fill in the .env file in this folder.');
}
const API = WP_URL.replace(/\/$/, '') + '/wp-json/wp/v2';
const AUTH = 'Basic ' + Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64');

// ---------- text helpers ----------
// Replace the special characters that show up garbled and normalise to clean ASCII.
function sanitize(s) {
  if (!s) return s || '';
  return String(s)
    .replace(/₹\s*/g, 'Rs ')      // ₹  -> "Rs "
    .replace(/[‒-―]/g, '-')   // ‒–—―  -> -
    .replace(/[‘’‛]/g, "'") // ‘ ’  -> '
    .replace(/[“”]/g, '"')    // “ ”  -> "
    .replace(/…/g, '...')          // …  -> ...
    .replace(/ /g, ' ')            // nbsp -> space
    .replace(/[^\x00-\x7F]/g, '')       // drop any other non-ASCII
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}
// Key used to detect the "same" story regardless of ₹/Rs, dashes or punctuation.
function dedupKey(s) {
  return sanitize(s).toLowerCase()
    .replace(/&#?[a-z0-9]+;/g, '')   // strip HTML entities (e.g. WP stores ' as &#8217;) before comparing
    .replace(/\brs\b/g, '')
    .replace(/[^a-z0-9]/g, '');
}
const slugify = (s) => sanitize(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);

function paragraphsToHtml(body) {
  const b = sanitize(body);
  if (!b) return '';
  if (/<\/?(p|h[1-6]|ul|ol|li|strong|em|br|blockquote|figure|img)\b/i.test(b)) return b;
  return b.split(/\n{2,}/).map((p) => `<p>${p.trim().replace(/\n/g, ' ')}</p>`).filter((p) => p !== '<p></p>').join('\n');
}

// Which city listing a story belongs to. Prefer an explicit `city` field in the
// daily file; otherwise infer from the title/location/keyword. Everything that
// isn't clearly Pune defaults to Noida (the primary market).
const PUNE_RE = /\b(pune|hinjewadi|hinjawadi|wakad|pimpri|chinchwad|pcmc|moshi|punawale|rahatani|baner|balewadi|kharadi|shivaji\s?nagar|shivajinagar|maharashtra|pmrda|mundhwa|purandar|uruli|fursungi|talegaon|wagholi|ravet|tathawade)\b/i;
function cityCategoryName(item) {
  const explicit = sanitize(item.city || '').toLowerCase();
  if (explicit.includes('pune')) return 'Pune News';
  if (explicit.includes('noida')) return 'Noida News';
  if (explicit) return 'Real Estate News'; // any other explicit city -> general Real Estate News column
  const hay = sanitize(`${item.title || ''} ${item.location || ''} ${item.focus_keyword || ''}`);
  return PUNE_RE.test(hay) ? 'Pune News' : 'Noida News';
}

// Backdate a post to the actual news date so listings sort newest-first.
// Accepts "YYYY-MM-DD" (gets a default noon time) or a full ISO string.
function normalizeNewsDate(d) {
  if (!d) return undefined;
  const t = String(d).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t + 'T12:00:00';
  return t;
}

function deriveTags(item) {
  const t = new Set();
  if (item.location) t.add(item.location);
  if (item.category && item.category.toLowerCase() !== 'news') t.add(item.category);
  if (item.focus_keyword) t.add(item.focus_keyword);
  t.add('Noida Real Estate');
  return [...t].map(sanitize).filter(Boolean).slice(0, 6);
}

function parseItems(raw) {
  const candidates = [];
  const push = (re) => { let m; const r = new RegExp(re, 'gi'); while ((m = r.exec(raw))) candidates.push(m[1]); };
  push('```json\\s*([\\s\\S]*?)```');
  push('```\\s*([\\s\\S]*?)```');
  const bracket = raw.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (bracket) candidates.push(bracket[0]);
  candidates.push(raw);
  for (const c of candidates) {
    try {
      const data = JSON.parse(c.trim());
      if (Array.isArray(data)) {
        const items = data.filter((it) => it && it.title);
        if (items.length) return items;
      }
    } catch { /* next */ }
  }
  die('Could not find a JSON array of news items in ' + path.basename(INPUT_FILE) + '. See today.example.md.');
}

// ---------- WordPress ----------
async function wp(pathname, options = {}) {
  const res = await fetch(API + pathname, { ...options, headers: { Authorization: AUTH, ...(options.headers || {}) } });
  const text = await res.text();
  let json; try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
  if (!res.ok) throw new Error(`WP ${options.method || 'GET'} ${pathname} → ${res.status}: ${(json?.message || json?.raw || res.statusText).toString().slice(0, 160)}`);
  return json;
}
async function getCategoryId(slug) {
  const rows = await wp(`/categories?slug=${encodeURIComponent(slug)}&_fields=id`);
  return Array.isArray(rows) && rows.length ? rows[0].id : null;
}
async function getOrCreateTerm(kind, name) {
  const slug = slugify(name);
  const rows = await wp(`/${kind}?slug=${encodeURIComponent(slug)}&_fields=id`);
  if (Array.isArray(rows) && rows.length) return rows[0].id;
  const created = await wp(`/${kind}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: sanitize(name), slug }) });
  return created.id;
}

async function uploadMedia(buffer, filename) {
  const res = await fetch(API + '/media', {
    method: 'POST',
    headers: { Authorization: AUTH, 'Content-Type': 'image/png', 'Content-Disposition': `attachment; filename="${filename}"` },
    body: buffer,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`media upload → ${res.status}: ${json?.message || res.statusText}`);
  return json.id;
}

// ---------- cover image (optional, degrades gracefully) ----------
async function makeCover(item) {
  let Canvas; try { Canvas = await import('@napi-rs/canvas'); } catch { return null; }
  try {
    const W = 1200, H = 630, canvas = Canvas.createCanvas(W, H), ctx = canvas.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0B3038'); g.addColorStop(1, '#124C57');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(213,179,124,0.06)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 44) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 44) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    const pad = 72, serif = 'Georgia', sans = 'Arial';
    ctx.fillStyle = '#D5B37C'; ctx.font = `bold 26px ${serif}`; ctx.fillText('Property Saraansh', pad, 96);
    ctx.font = `bold 15px ${sans}`;
    ctx.fillText('NOIDA REAL ESTATE NEWS', W - pad - ctx.measureText('NOIDA REAL ESTATE NEWS').width, 92);
    const cat = sanitize(item.category || 'News').toUpperCase();
    ctx.font = `bold 16px ${sans}`; const cw = ctx.measureText(cat).width;
    ctx.strokeStyle = 'rgba(213,179,124,0.5)'; ctx.fillStyle = 'rgba(18,76,87,0.6)';
    roundRect(ctx, pad, 150, cw + 56, 46, 23); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#D5B37C'; ctx.beginPath(); ctx.arc(pad + 22, 173, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillText(cat, pad + 38, 179);
    ctx.fillStyle = '#ffffff';
    const maxWidth = W - pad * 2; let size = 64, lines;
    do { ctx.font = `bold ${size}px ${serif}`; lines = wrap(ctx, sanitize(item.title), maxWidth); if (lines.length <= 4) break; size -= 4; } while (size > 40);
    let y = 300; for (const line of lines.slice(0, 5)) { ctx.fillText(line, pad, y); y += size * 1.12; }
    ctx.fillStyle = '#D5B37C'; ctx.fillRect(pad, y + 6, 120, 4);
    ctx.font = `bold 22px ${sans}`; ctx.fillStyle = '#D5B37C';
    ctx.fillText(sanitize(item.location || 'Noida & Greater Noida'), pad, H - 58);
    ctx.font = `18px ${sans}`; ctx.fillStyle = 'rgba(234,244,246,0.65)';
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
    ctx.fillText(dateStr, W - pad - ctx.measureText(dateStr).width, H - 58);
    return canvas.toBuffer('image/png');
  } catch (e) { console.warn('  (cover skipped: ' + e.message + ')'); return null; }
}
function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function wrap(ctx, text, maxWidth) {
  const words = text.split(' '); const lines = []; let line = '';
  for (const w of words) { const test = line ? line + ' ' + w : w; if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; } else line = test; }
  if (line) lines.push(line); return lines;
}

// ---------- one-time migration: tag existing News posts by city ----------
// Adds a "Noida News" or "Pune News" category to every existing post in the
// "News" category (kept alongside their current categories). Run once after the
// site update ships:  node create-news-drafts.js --migrate-cities
async function migrateCities() {
  console.log('\n🏙  Migrating existing News posts into city categories (Noida / Pune)\n');
  const newsCatId = await getCategoryId('news');
  if (!newsCatId) die('No "News" category found in WordPress.');
  const noidaId = await getOrCreateTerm('categories', 'Noida News');
  const puneId = await getOrCreateTerm('categories', 'Pune News');

  let page = 1, migrated = 0, pune = 0, noida = 0, already = 0;
  for (;;) {
    const rows = await wp(`/posts?categories=${newsCatId}&status=publish,draft,pending,future,private&per_page=100&page=${page}&_fields=id,title,categories&context=edit`);
    if (!Array.isArray(rows) || rows.length === 0) break;
    for (const p of rows) {
      const title = sanitize(p.title?.rendered || '');
      const cats = Array.isArray(p.categories) ? p.categories.slice() : [];
      const cityId = PUNE_RE.test(title) ? puneId : noidaId;
      const cityName = cityId === puneId ? 'Pune' : 'Noida';
      if (cats.includes(cityId)) { already++; console.log(`  = #${p.id} already ${cityName}: ${title.slice(0, 60)}`); continue; }
      cats.push(cityId);
      try {
        await wp(`/posts/${p.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ categories: cats }) });
        migrated++; cityId === puneId ? pune++ : noida++;
        console.log(`  → #${p.id} tagged ${cityName}: ${title.slice(0, 60)}`);
      } catch (e) { console.warn(`  ✗ #${p.id} failed: ` + e.message.slice(0, 120)); }
    }
    if (rows.length < 100) break;
    page++;
  }
  console.log(`\n✅ Migration done — ${migrated} updated (${noida} Noida, ${pune} Pune), ${already} already tagged.`);
  console.log('   Review Pune ones (in case a Noida story mentions Pune) at:');
  console.log(`   ${WP_URL.replace(/\/$/, '')}/wp-admin/edit.php?category_name=pune-news\n`);
}

// ---------- one-time cleanup: remove duplicate news posts ----------
// Finds posts in the News category that share the same (normalised) title and
// keeps the best copy — preferring a published post, then one with a cover
// image, then the most recently modified — moving the rest to Trash (which is
// recoverable in wp-admin for 30 days; nothing is permanently deleted).
// Preview first:  node create-news-drafts.js --dedup --dry-run
// Then run:       node create-news-drafts.js --dedup
async function dedupNews() {
  console.log(`\n🧹 Finding duplicate news posts${DRY_RUN ? ' (dry run — nothing will change)' : ''}\n`);
  const newsCatId = await getCategoryId('news');
  if (!newsCatId) die('No "News" category found.');
  // Also scan city categories so a duplicate tagged only Noida/Pune News is still caught.
  const scanCatIds = [newsCatId];
  for (const s of ['noida-news', 'pune-news', 'real-estate-news']) {
    const cid = await getCategoryId(s);
    if (cid && !scanCatIds.includes(cid)) scanCatIds.push(cid);
  }

  const MIN_PREFIX = 28; // min normalised chars before one title counts as an extension of another
  const all = [];
  const seenIds = new Set();
  for (const catId of scanCatIds) {
    let page = 1;
    for (;;) {
      const rows = await wp(`/posts?categories=${catId}&status=publish,draft,pending,future,private&per_page=100&page=${page}&_fields=id,slug,title,date,modified,featured_media,status&context=edit`);
      if (!Array.isArray(rows) || rows.length === 0) break;
      for (const p of rows) {
        if (seenIds.has(p.id)) continue;
        seenIds.add(p.id);
        const key = dedupKey(p.title?.rendered || '');
        if (key) all.push({ ...p, _key: key });
      }
      if (rows.length < 100) break;
      page++;
    }
  }

  // Group posts whose normalised titles are identical OR where one is a prefix
  // of the other — i.e. the same story where one headline just carries an extra
  // trailing clause (e.g. "...Sector 151" vs "...Sector 151 floodplain, frees 32,670 sqm").
  const groups = []; // [{ key, posts: [] }]
  for (const p of all) {
    let g = groups.find((grp) => {
      const shorter = p._key.length <= grp.key.length ? p._key : grp.key;
      const longer = p._key.length <= grp.key.length ? grp.key : p._key;
      return shorter.length >= MIN_PREFIX && longer.startsWith(shorter);
    });
    if (!g) { g = { key: p._key, posts: [] }; groups.push(g); }
    else if (p._key.length < g.key.length) g.key = p._key; // keep the shortest title as the group key
    g.posts.push(p);
  }

  let dupeGroups = 0, kept = 0, removed = 0;
  for (const g of groups) {
    const posts = g.posts;
    if (posts.length < 2) continue;
    dupeGroups++;
    posts.sort((a, b) => {
      const pub = (x) => (x.status === 'publish' ? 1 : 0);
      if (pub(b) !== pub(a)) return pub(b) - pub(a);
      const img = (x) => (x.featured_media ? 1 : 0);
      if (img(b) !== img(a)) return img(b) - img(a);
      const clean = (x) => (/-\d+$/.test(x.slug || '') ? 0 : 1); // prefer original (no -2/-3 slug)
      if (clean(b) !== clean(a)) return clean(b) - clean(a);
      return new Date(b.modified || b.date) - new Date(a.modified || a.date);
    });
    const keep = posts[0];
    console.log(`• "${sanitize(keep.title?.rendered || '').slice(0, 60)}"`);
    console.log(`    ✓ KEEP  #${keep.id} /${keep.slug} (${keep.status}${keep.featured_media ? ', cover' : ', no cover'})`);
    kept++;
    for (const p of posts.slice(1)) {
      if (DRY_RUN) { console.log(`    ✗ would trash #${p.id} /${p.slug} (${p.status})`); removed++; continue; }
      try {
        await wp(`/posts/${p.id}`, { method: 'DELETE' }); // no force -> moves to Trash (recoverable)
        console.log(`    ✗ trashed #${p.id} /${p.slug}`);
        removed++;
      } catch (e) { console.warn(`    ! could not trash #${p.id}: ` + e.message.slice(0, 120)); }
    }
  }
  console.log(`\n✅ ${dupeGroups} duplicate group(s) found — kept ${kept}, ${DRY_RUN ? 'would remove' : 'removed'} ${removed}.`);
  if (!DRY_RUN && removed) console.log('   Removed posts are recoverable in wp-admin -> Posts -> Trash for 30 days.\n');
}

// ---------- main ----------
(async () => {
  if (MIGRATE) { await migrateCities(); return; }
  if (DEDUP) { await dedupNews(); return; }
  if (!fs.existsSync(INPUT_FILE)) die(`Input file not found: ${INPUT_FILE}`);
  const items = parseItems(fs.readFileSync(INPUT_FILE, 'utf8'));
  if (!items.length) die('No news items found.');

  console.log(`\n📰 ${items.length} news item(s) from ${path.basename(INPUT_FILE)}`);
  console.log(DRY_RUN ? '   (dry run — nothing will be posted)\n' : `   Target: ${WP_URL}  [mode: ${PUBLISH ? 'PUBLISH LIVE' : 'draft'}]\n`);

  let newsCatId = null;
  const existing = new Map(); // dedupKey -> post id  (all existing News posts, any status)
  if (!DRY_RUN) {
    newsCatId = await getCategoryId('news');
    if (!newsCatId) die('No "News" category found in WordPress. Create a category with slug "news" first.');
    try {
      const rows = await wp(`/posts?categories=${newsCatId}&status=publish,draft,pending,future,private&per_page=100&_fields=id,title&context=edit`);
      if (Array.isArray(rows)) for (const p of rows) existing.set(dedupKey(p.title?.rendered || ''), p.id);
      console.log(`   Found ${existing.size} existing News post(s) — will update matches in place, skip duplicates.\n`);
    } catch (e) { console.warn('   (could not preload existing posts: ' + e.message + ')\n'); }
  }

  const seen = new Set();
  let created = 0, updated = 0, skipped = 0;

  for (const [i, raw] of items.entries()) {
    const item = { ...raw, title: sanitize(raw.title) };
    const key = dedupKey(item.title);
    // "replaces": update an EARLIER headline in place (keeps its URL/date-history)
    // instead of creating a new post — for follow-ups/corrections to a story.
    const lookupKey = item.replaces ? dedupKey(item.replaces) : key;
    const label = `[${i + 1}/${items.length}] ${item.title.slice(0, 66)}`;

    if (seen.has(key)) { console.log('• ' + label + '\n    ↷ duplicate within today.md — skipped'); skipped++; continue; }
    seen.add(key);
    console.log('• ' + label);

    let cover = null;
    if (item.image_file) {
      try { cover = fs.readFileSync(path.isAbsolute(item.image_file) ? item.image_file : path.join(__dirname, item.image_file)); console.log('    · using AI image: ' + item.image_file); }
      catch (e) { console.warn('    · image_file not found (' + item.image_file + '), using generated cover'); }
    }
    if (!cover) cover = await makeCover(item);
    if (DRY_RUN) {
      if (cover) fs.writeFileSync(path.join(__dirname, `preview-${i + 1}.png`), cover);
      console.log('    tags: ' + deriveTags(item).join(', '));
      console.log('    cover: ' + (cover ? `preview-${i + 1}.png` : 'none') + ' | (dry run)');
      continue;
    }

    // find existing (preloaded map, else title search) or create
    let postId = existing.get(lookupKey) || null;
    if (!postId) {
      try {
        const found = await wp(`/posts?search=${encodeURIComponent(item.replaces || item.title)}&status=publish,draft,pending,future,private&per_page=10&_fields=id,title&context=edit`);
        if (Array.isArray(found)) { const hit = found.find((p) => dedupKey(p.title?.rendered) === lookupKey); if (hit) postId = hit.id; }
      } catch { /* create below */ }
    }
    if (postId && item.replaces) console.log(`    ↻ updating earlier post #${postId} in place (replaces: "${sanitize(item.replaces).slice(0, 48)}")`);

    const contentHtml = paragraphsToHtml(item.body || item.dek || '');
    if (postId) {
      try {
        const upd = { title: item.title, content: contentHtml, excerpt: sanitize(item.dek || '') };
        if (normalizeNewsDate(item.date)) upd.date = normalizeNewsDate(item.date);
        if (PUBLISH) upd.status = 'publish';
        await wp(`/posts/${postId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(upd) });
        console.log(`    ↷ updated existing post #${postId} (clean text${PUBLISH ? ', published live' : ''})`); updated++;
      } catch (e) { console.warn('    ✗ update failed: ' + e.message.slice(0, 200)); continue; }
    } else {
      try {
        const post = await wp('/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: item.title, content: contentHtml, excerpt: sanitize(item.dek || ''), status: STATUS, ...(normalizeNewsDate(item.date) ? { date: normalizeNewsDate(item.date) } : {}) }) });
        postId = post.id; existing.set(key, postId);
        console.log(`    ✓ ${PUBLISH ? 'published' : 'draft'} #${postId} created`); created++;
      } catch (e) { console.error('    ✗ create failed: ' + e.message.slice(0, 200)); continue; }
    }

    // categories (News parent + city + topical sub) + tags
    try {
      const cityCat = cityCategoryName(item);
      const cats = [newsCatId, await getOrCreateTerm('categories', cityCat)];
      if (item.category && item.category.toLowerCase() !== 'news') cats.push(await getOrCreateTerm('categories', item.category));
      const tagIds = [];
      for (const t of deriveTags(item)) { try { tagIds.push(await getOrCreateTerm('tags', t)); } catch { /* skip one */ } }
      await wp(`/posts/${postId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ categories: cats, tags: tagIds }) });
      console.log('      · ' + cityCat + ' + tags set (' + deriveTags(item).length + ' tags)');
    } catch (e) { console.warn('      · category/tags step failed: ' + e.message.slice(0, 160)); }

    // Rank Math SEO
    try {
      await wp(`/posts/${postId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meta: {
          rank_math_title: sanitize(item.meta_title || `${item.title} | Property Saraansh`).slice(0, 60),
          rank_math_description: sanitize(item.meta_description || item.dek || '').slice(0, 160),
          rank_math_focus_keyword: sanitize(item.focus_keyword || item.location || 'Noida real estate'),
        } }) });
      console.log('      · SEO meta set');
    } catch (e) { console.warn('      · SEO meta skipped: ' + e.message.slice(0, 120)); }

    // cover
    if (cover) {
      try { const mediaId = await uploadMedia(cover, slugify(item.title) + '.png');
        await wp(`/posts/${postId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ featured_media: mediaId }) });
        console.log('      · cover attached');
      } catch (e) { console.warn('      · cover step failed: ' + e.message.slice(0, 160)); }
    }
  }

  if (DRY_RUN) { console.log('\n✅ Dry run complete.\n'); return; }
  console.log(`\n✅ Done — ${created} created, ${updated} updated, ${skipped} duplicate(s) skipped.  [mode: ${PUBLISH ? 'PUBLISH LIVE' : 'draft'}]`);
  if (PUBLISH) {
    console.log('   These posts are now LIVE: https://www.propertysaraansh.com/news');
    console.log(`   (all posts view: ${WP_URL.replace(/\/$/, '')}/wp-admin/edit.php?post_type=post)\n`);
  } else {
    console.log(`   Review & publish: ${WP_URL.replace(/\/$/, '')}/wp-admin/edit.php?post_status=draft&post_type=post`);
    console.log('   Live after you publish: https://www.propertysaraansh.com/news\n');
  }
})().catch((e) => die(e.message));
