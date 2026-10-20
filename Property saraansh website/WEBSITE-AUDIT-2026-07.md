# Property Saraansh — Website Audit (7 Jul 2026)

Scope: full Next.js frontend + WordPress plugin code (`beekoli/Property-Saraansh-Web`).
Two things were requested: (1) remove unused code, (2) check SEO and fix easy wins.

---

## 1. SEO — what was fixed (shipped ✅)

**PR #14 — merged & deployed to production.** Metadata-only, no runtime change.

- **`metadataBase` added** in `src/app/layout.tsx`. Next.js can now turn relative
  Open-Graph / canonical URLs into absolute ones. This removes Next build warnings
  and fixes social-share image URLs across every page.
- **Default Open Graph + Twitter card** added at the site root. Static pages that had
  no social tags — home, about-us, careers, contact, our-team, privacy-policy,
  thank-you — now emit them. Property / video / blog detail pages still override with
  their own image + title, so nothing regresses.
- **Canonical host fix.** The `LocalBusiness` JSON-LD `url` was `https://propertysaraansh.com`
  (bare domain) while `next.config.ts` redirects everything to **`https://www.propertysaraansh.com`**.
  It now uses the www host, so the structured data matches the real canonical.

Verified on the preview build: `og:image` resolves to
`https://www.propertysaraansh.com/logo.png`, `og:site_name`, `og:type`, `og:locale`,
`twitter:card` all present, schema URL now www.

## 2. SEO — what is already good (no change needed)

- **Property detail pages** (`/properties/[slug]`) are well optimised: per-page
  `generateMetadata` with canonical, OG image (hero, 1200×630), and JSON-LD via
  `buildSchemas()`.
- **Video watch pages** emit VideoObject schema with ISO-8601 dates/durations.
- **`robots.ts`** allows all + points to the sitemap.
- **`sitemap.ts`** covers static routes + dynamic properties, blogs and videos.
- **`generateRankMathMetadata()`** cleanly maps RankMath/Yoast data → Next metadata,
  including HTML-entity decoding and WP→frontend URL rewriting.

## 3. SEO — recommendations NOT auto-applied (need your call)

These are judgement calls or interact with the 208-redirect `next.config.ts`, so
I left them for review rather than change blindly:

1. **Home page has no self-referencing canonical.** It inherits the root metadata but
   sets no `alternates.canonical`. Low risk to add `canonical: "/"` **only on the home
   page** (do NOT add it to the root layout — that would wrongly canonicalise every
   static page to the homepage).
2. **Static info pages** (careers, our-team, privacy-policy, thank-you) use a plain
   static `metadata` with title+description but no per-page canonical. Adding one each
   is a small, safe win.
3. **`sitemap.ts` omits** `/property-in/[city]` location pages, `/builders/[slug]`
   builder pages, and `/our-shorts/[…]`. Worth adding so they get discovered/indexed.
4. **Blog & video revalidation** — `/api/revalidate` only refreshes property paths;
   publishing a blog/video in WordPress won't purge its Next cache until the timed
   window elapses. Consider extending the webhook.

---

## 4. Unused code found (confirmed dead)

> Note on removal: the GitHub connector available in this session can **create/update**
> files but has **no delete capability**, and the sandbox has no push credentials — so
> I could not delete these for you automatically. A ready-to-run cleanup script is
> included alongside this report (`cleanup-dead-code.sh`). Everything below was verified
> to have **zero importers** anywhere in the codebase, so removal is safe. (These files
> are already tree-shaken out of the deployed bundle — this is repo hygiene, not a
> runtime speed-up.)

### 4a. Legacy property section components (superseded by `PropertyDetail.tsx`)
The current property page is the single self-contained `PropertyDetail.tsx`. These v1
sub-components are no longer imported by anything:

- `src/components/property/AboutSection.tsx`
- `src/components/property/AmenitiesGrid.tsx`
- `src/components/property/FloorPlans.tsx`
- `src/components/property/GallerySection.tsx`
- `src/components/property/HeroSection.tsx`
- `src/components/property/HighlightsGrid.tsx`
- `src/components/property/LocationAdvantages.tsx`
- `src/components/property/PriceList.tsx`
- `src/components/property/StickyNav.tsx`

### 4b. Other dead components
- `src/app/properties/[slug]/PropertyClient.tsx` — legacy stub, unused since detail v2.
- `src/components/VideoCard.tsx` — no importer (video lists use `VideoPlayer`/clients).

### 4c. Default create-next-app assets (never referenced)
- `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`
- `public/icon.png` — byte-for-byte duplicate of `src/app/icon.png`, which is the file
  Next App Router actually serves as the favicon. The `public/` copy is redundant.

### 4d. Duplicate WordPress-plugin build artifacts at repo root
The real plugin source lives in `ps-core-functionality/ps-core.php`. These zips are
stale packaged snapshots (several are byte-identical to each other):

- `property-saraansh-core-plugin.zip`
- `ps-core-functionality.zip`
- `ps-core-plugin-new.zip`  *(identical to ps-core-functionality.zip)*
- `ps-core-plugin.zip`
- `ps-core-single.zip`  *(identical to property-saraansh-core-plugin.zip)*

A fresh installable zip can be re-generated from the source folder any time.

### 4e. Unused exported functions (optional, lower priority)
These live inside files that ARE used, so they need careful in-file edits rather than
file deletion. Each has zero external callers:

- `src/lib/wordpress.ts` → `getWPVideoBySlug`, `getWPVideos`, `getPropertyBySlug`, `stripHtml`
- `src/lib/youtube.ts` → `getLatestYouTubeVideos`, `getVideoById`
- `src/lib/seo.ts` → `generateLocalBusinessSchema`, `generateRealEstateListingSchema`
  (+ their `…SchemaProps` interfaces). Note: the layout already has its own inline
  LocalBusiness schema, which is why these are dead.
- `scripts/backup-to-drive.ts` — appears to be an unused source twin of
  `backup-to-drive.js` (the `backup-drive` npm script runs the `.js`). Confirm before removing.

---

## 5. Older structural notes (from the earlier sync review — still open, optional)

- **Two WP fetch conventions.** `wordpress.ts` (`revalidate:60`, rewrites host, no
  env fallback → serves bundled mock JSON if the env var is missing) vs `property.ts`
  (`revalidate:300`, hardcoded API fallback, no rewrite). Worth unifying into one client.
- **CRM default = localhost.** `/api/leads` defaults `CRM_API_URL` to
  `http://localhost:3001` — always fails silently on Vercel unless the env var is set.
- **Hardcoded term ids 74/75** for residential/commercial listing pages — if those WP
  terms are ever recreated with new ids, both pages silently show "no properties".

---

*Generated during the 7 Jul 2026 audit session. SEO fixes are live; code-removal items
await your go-ahead (see `cleanup-dead-code.sh`).*
