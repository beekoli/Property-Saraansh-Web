# Property Saraansh — Frontend ↔ Backend Sync Review

_Reviewed from GitHub repo `beekoli/Property-Saraansh-Web` (branch `main`), which is what Vercel (`propertysaraansh-web`) deploys. The local folder `D:\...\Property saraansh website` is currently empty, so all analysis is from the repo._

## 1. How the system is wired

This is a **headless WordPress + Next.js** setup, not a single app:

- **Frontend** — Next.js 15 (App Router, React 19, Tailwind 4), deployed on Vercel. Serves the public site at `www.propertysaraansh.com`.
- **Backend (content)** — WordPress at `login.propertysaraansh.com`, exposed via the WP REST API (`/wp-json/wp/v2`). The repo ships a WordPress plugin, `ps-core-functionality/ps-core.php` ("Property Saraansh Core" v1.2.3), that registers the `properties` custom post type + Advanced Custom Fields (ACF).
- **Backend (server logic on the frontend)** — two Next.js API routes: `/api/leads` (form → Google Sheet + CRM + email) and `/api/revalidate` (WordPress webhook → clears Next cache).

Data flow: WordPress (content) → WP REST API → Next.js server components fetch + cache → static/ISR pages on Vercel. Leads flow the other way: website form → `/api/leads` → Google Sheets / CRM / SMTP email.

## 2. What is correctly in sync

- **Image hosts** — `next.config.ts` `images.remotePatterns` allows `login.propertysaraansh.com` (the WP host), matching where the REST API returns media URLs. ✅
- **WP asset proxy** — `next.config.ts` rewrites `/wp-content/*` and `/wp-includes/*` to the WP host, and the env var `NEXT_PUBLIC_WORDPRESS_URL` is used consistently for it. ✅
- **On-demand revalidation** — `/api/revalidate` clears `/properties`, `/properties/[slug]`, `/residential-properties`, `/commercial-properties`, and `/`, so publishing a property in WP can refresh those pages. ✅
- **Legacy URL redirects** — `middleware.ts` + `next.config.ts` redirects and the `/wp-admin`, `/wp-login` guards are consistent and protect old WordPress URLs / SEO. ✅
- **CPT + endpoint match** — the plugin registers the `properties` CPT with `show_in_rest`, and the frontend fetches `/properties`. ✅

## 3. The main sync problem: the committed WordPress plugin is stale

The frontend has **migrated to a newer WordPress schema that the committed plugin does not define.** Git commit history confirms an in-progress migration ("all listing surfaces read new field structure + builder taxonomy — unblocks removing the old field group", "old flat fields only as fallback").

Two data layers exist on the frontend and they disagree:

| Layer | Used by | Expects |
|---|---|---|
| `src/lib/wordpress.ts` | `/properties`, `/residential-properties`, `/commercial-properties`, home | Newer `getCardData()` reading **taxonomies** `ps_builder`, `property-type`, `location`, `project_status` + `youtube_url`, `price_display`; old flat ACF fields only as fallback |
| `src/lib/property.ts` | `/properties/[slug]` detail | **v2 structured/repeater fields**: `gallery[]`, `floor_plans[]`, `amenities[]`, `price_list[]`, `payment_steps[]`, `payment_milestones[]`, `faqs[]`, `master_plan`, `site_plan`, `logo_image`, `tagline`, `youtube_url`, taxonomies + `rank_math_json` |

But the committed plugin `ps-core.php` (v1.2.3) still registers the **old flat schema**:
- `gallery_image_1..10`, `floor_plan_1..4_*`, `amenity_1..12_*`, `faq_1..5_*`, `price_list_row_1..4_*`, `payment_step_1..3_*`, `payment_milestone_1..6_*`
- `property_type` as an ACF **select field** (Commercial/Residential/Ultra Luxury), `highlights` as a semicolon string, `project_logo`, `master_layout_image`, `site_plan_image`, `video_id`
- It does **not** register the taxonomies the frontend now queries (`property-type` term ids 74/75, `ps_builder`, `location`, `project_status`) — a code comment even says these were "created via Custom Post Type UI," i.e. by hand in wp-admin.

**Implication:** the real source of truth for the backend schema is the **live WordPress admin (manually configured)**, not the Git repo. The plugin in version control is out of date with both the live site and the frontend. If anyone reinstalls the plugin from the repo (or the multiple stale `.zip` copies at the repo root) onto a fresh WordPress, the property detail pages and the residential/commercial listings would render mostly empty, because the new fields and taxonomies wouldn't exist. This is the biggest risk to fix.

## 4. Secondary inconsistencies

1. **Two different fetch conventions for the same WordPress API.**
   - `wordpress.ts`: `NEXT_PUBLIC_WORDPRESS_API_URL` with **no fallback** (if the env var is unset it returns `null` and silently serves the committed mock JSON), cache `revalidate: 60`, and it **rewrites the WP hostname → frontend hostname** in responses.
   - `property.ts`: same env var but **with a hardcoded default** (`https://login.propertysaraansh.com/wp-json/wp/v2`), cache `revalidate: 300`, and it deliberately does **not** rewrite the hostname.

   Result: if `NEXT_PUBLIC_WORDPRESS_API_URL` is ever missing in Vercel, listing pages fall back to stale bundled JSON while detail pages still hit live WP — a confusing half-broken state. The mismatched cache windows (60s vs 300s) also mean a listing card and its detail page can disagree for up to 5 minutes.

2. **Stale static fallback data.** `src/data/blogs.json` (~190 KB) and `properties.json` (~18 KB) are bundled as fallbacks. They're snapshots and drift from WordPress over time; they only update on redeploy.

3. **Revalidation doesn't cover blogs/videos.** `/api/revalidate` refreshes property paths only. Publishing/editing a **blog** (`/blog/[slug]`) or **video** (`/our-videos/[slug]`) in WordPress won't trigger an on-demand refresh — those rely on the timed `revalidate` window instead.

4. **CRM default points to localhost.** `/api/leads` defaults `CRM_API_URL` to `http://localhost:3001/api/leads`. On Vercel (serverless) there is no localhost CRM, so unless `CRM_API_URL` is set in env, CRM logging always fails silently (it's caught and skipped). Google Sheets logging has a hardcoded working Apps Script URL; SMTP email only fires if `SMTP_*` env vars are set.

5. **Hardcoded taxonomy term ids.** `residential-properties` and `commercial-properties` hardcode term ids `74` and `75`. If those terms are ever recreated in WordPress with new ids, both pages silently show "No properties found" (no mock fallback on this path).

## 5. Recommended fixes (priority order)

1. **Update `ps-core.php` to match the live/production schema** — add the new taxonomies (`ps_builder`, `property-type`, `location`, `project_status`) and the v2 repeater/group fields, so the plugin in Git is a true source of truth. Then delete the stale `.zip` duplicates at the repo root (keep one). This removes the "only works because someone hand-configured wp-admin" fragility.
2. **Unify the two fetch helpers** — one shared WP client with one env-var convention, one default, one cache window, and one decision on hostname rewriting.
3. **Verify Vercel env vars are set**: `NEXT_PUBLIC_WORDPRESS_API_URL`, `NEXT_PUBLIC_WORDPRESS_URL`, `NEXT_PUBLIC_SITE_URL`, `REVALIDATION_SECRET`, `SMTP_*`, `LEAD_RECEIVER_EMAIL`, `CRM_API_URL`, `LEADS_GOOGLE_SHEET_URL`. If any WP URL is missing, listings quietly serve stale JSON.
4. **Extend `/api/revalidate`** to also revalidate blog and video paths, and have the WP webhook send the post type so the route can target the right paths.
5. **Replace hardcoded term ids** (74/75) with a slug-based taxonomy query so re-created terms don't silently break the listings.

---
_Note: I could not exhaustively diff the committed plugin against the live WordPress admin (no WP admin access in this review), but the frontend code + Git commit history make the schema drift unambiguous._
