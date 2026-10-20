# Property Saraansh — Property Listing + SEO Playbook & Prompt

Two things live in this file:
- **Part A–D**: the reference (architecture, exact WordPress fields, SEO checklist) so any
  Claude session can understand the setup fast.
- **Part E**: a **paste-ready prompt** you copy into a new Claude session when you want to
  list a new property (Claude web-searches the project, then hands you the exact field
  values + SEO to enter in WordPress).

---

## Part A — How the site is wired (30-second architecture)

- **Frontend**: Next.js 15 (App Router, React 19, Tailwind 4), deployed on **Vercel**.
  Repo: `github.com/beekoli/Property-Saraansh-Web` (branch `main` = production).
- **Backend/content**: **headless WordPress** at `login.propertysaraansh.com`, read over the
  WP REST API (`/wp-json/wp/v2`). You add content in WP; the site reads it.
- **Canonical domain**: `https://www.propertysaraansh.com` (next.config redirects non-www → www).
- **Property page data layer**: `src/lib/property.ts` → `getProperty(slug)` normalises the
  WP record; `buildSchemas()` emits JSON-LD; `src/app/properties/[slug]/page.tsx` renders it
  and sets metadata via `src/lib/seo.ts`.
- **Deploy workflow**: change → branch → PR → Vercel preview build must be **green** →
  merge to `main` → production. Property pages use ISR (`revalidate = 300`, 5 min).
- **Key env vars (Vercel)**: `NEXT_PUBLIC_WORDPRESS_API_URL`, `NEXT_PUBLIC_WORDPRESS_URL`,
  `NEXT_PUBLIC_SITE_URL`.

**To list a property you normally DON'T touch code at all** — you add a `Property` post in
WordPress with the right fields + taxonomy terms, and the frontend renders it automatically.

---

## Part B — WordPress fields for a property (exact names → what they drive)

Post type: **Properties**. Title = project name. Featured image = hero + OG share image.

### B1. Taxonomy terms to assign (this is what powers links, filters & breadcrumbs)

| Taxonomy (assign a term) | Example value | Drives |
|---|---|---|
| **Builder** (`ps_builder`) | M3M | "Meet the Builder" section, `/builders/[slug]`, schema brand |
| **Location** (`ps_location`) — assign **TWO** terms | `Noida` (city) **and** `Sector 94` (area) | City → breadcrumb + `/property-in/[city]`; area → sector line |
| **Property Type** (`ps_property_type`) | Residential / Commercial | Type label + "All … projects" link |
| **Project Status** (`ps_project_status`) | New Launch / Under Construction / Ready to Move | Status pill |

> City term **slug** must be one of: `noida, greater-noida, noida-extension,
> yamuna-expressway, ghaziabad, delhi, gurgaon, gurugram, faridabad`. Whichever assigned
> location term is NOT in that list is treated as the sector/area.

Builder term also has its own profile fields (fill once per builder): `builder_logo`,
`builder_description`, `builder_experience`, `builder_delivered_projects`,
`builder_ongoing_projects`.

### B2. Custom fields (ACF/SCF) on the property

| Field name | Example | Drives on page / SEO |
|---|---|---|
| `tagline` | "Ultra-luxury on the Noida Expressway" | Hero support text, schema description fallback |
| `project_overview` | HTML paragraph | Overview block (green quick-facts below it) |
| `rera_number` | UPRERAPRJ442214 | RERA pill + trust |
| `configuration` | 3.5, 4.5 & 5 BHK | Hero + quick facts |
| `base_price` | ₹25,000 / sq.ft. (approx.) | Hero price display |
| `price_display` / `price` | ₹6.2 Cr onwards | Price sub-line |
| **`price_min_numeric`** | 62000000 | **Product/Offer rich snippet (lowPrice)** |
| **`price_max_numeric`** | 118000000 | **Product/Offer rich snippet (highPrice)** |
| `launch_date` / `possession_date` | Apr 2023 / Apr 2028 | Quick facts + timeline |
| `quick_facts` → `total_land, total_towers, total_units, total_floors, units_per_floor, lifts_per_floor` | 13 Acres, 5, 374… | Quick-fact cards |
| `youtube_url` | full YouTube URL | Video section + **VideoObject schema** |
| `video_review_text` | 1–2 lines | "Saraansh Verdict" |
| `highlights_list` (repeater: `text`) | bullet points | Highlights grid |
| `master_plan`, `site_plan`, `logo_image` (images) | — | Layout section + logo |
| `floor_plans` (repeater: `title, description, image, pdf`) | — | Floor-plan tabs |
| `amenities` (repeater: `icon, name`) | 🏊 Pool | Amenities grid + schema `amenityFeature` |
| `price_list` (repeater: `type, size, base, total`) | — | Price table |
| `payment_steps` (`percentage, title, description`) / `payment_milestones` (`milestone, demand, cumulative`) | — | Payment plan |
| `eoi_note` | — | EOI benefit note |
| `address` | Sector 94, Noida | Hero address line + schema `PostalAddress` |
| `latitude`, `longitude` | 28.55, 77.33 | Map + schema `geo` (local SEO) |
| `location_adv` (repeater: `category, name, distance`) | metro, "Botanical Garden", 8 min | Location advantages. `category` ∈ metro/airport/school/hospital/retail/employment/other |
| `google_map_embed` | full `<iframe …>` | Map embed |
| `gallery` (images) | — | Gallery grid |
| `construction_timeline` (repeater: `stage, date, done`) | — | Progress tracker |
| `faqs` (repeater: `question, answer`) | ≥3 recommended | FAQ accordion + **FAQPage rich result** |
| **`meta_title`** (or `seo_title`) | ≤60 chars | `<title>` + OG/Twitter title |
| **`meta_description`** (or `seo_description`) | ≤155 chars | meta description + OG/Twitter desc |

### B3. Auto-generated for you (no action needed, but improved by good data)
`generateMetadata` sets the **canonical** (`…/properties/{slug}`) and OG image (hero) automatically.
`buildSchemas()` emits: **ApartmentComplex, Product/AggregateOffer** (needs the two
`price_*_numeric`), **FAQPage** (needs faqs), **BreadcrumbList**, **VideoObject** (needs
`youtube_url`). Site-wide LocalBusiness/RealEstateAgent schema is already in the layout.

---

## Part C — Per-property SEO checklist (the "complete SEO setting")

Tick these for every new listing to be search- and AI-answer-friendly:

1. **Slug** — clean & keyword-rich: `m3m-the-cullinan-sector-94-noida` (project + sector + city).
2. **Featured image** set (becomes hero + OG share card); give it descriptive alt text.
3. **`meta_title`** ≤ 60 chars — pattern: `{Project} {Sector} {City} | Price, Floor Plan & Review`.
4. **`meta_description`** ≤ 155 chars — include price range, configuration, location, 1 CTA.
5. **`price_min_numeric` + `price_max_numeric`** filled → unlocks the Product/price rich snippet.
6. **`rera_number`** filled (trust signal Google & buyers look for).
7. **≥ 3 FAQs** (real buyer questions) → FAQ rich result + great for AI answer engines.
8. **`youtube_url`** filled → Video rich result + keeps users on page.
9. **`address` + `latitude` + `longitude`** → local/geo relevance.
10. **Assign all 4 taxonomies** (builder, city+area location, type, status) → internal links & breadcrumbs.
11. **Alt text on every image** (gallery, floor plans, master/site plan).
12. **Overview** ≥ 120 words, mentioning project, builder, location, USP, RERA, possession —
    written for humans first (this is what AI search quotes).

> AI-search tip: answer engines (ChatGPT/Gemini/Perplexity/Claude) favour clear, factual,
> well-structured text + valid schema. The FAQ block, the overview paragraph, and the
> AggregateOffer/RERA fields are the highest-leverage things to get right.

---

## Part D — If a field/section doesn't exist in WordPress yet

Most fields above already exist in the v2 SCF group. If you want a **new** field or section
(e.g. a "Why Invest" block), that needs a small code change on the frontend + the field in
WP — hand this playbook to Claude and it can add it (branch → PR → verify preview → deploy).

---

## Part E — PASTE-READY PROMPT (copy this into a new Claude session)

> Fill in the two bracketed lines, paste the whole block. Claude will web-search the project
> and return exactly what to type into WordPress, SEO included.

```
You are helping me list a new property on Property Saraansh (headless WordPress +
Next.js). Context about my setup is in the file
"LISTING-PLAYBOOK-and-PROMPT.md" in this project — read Parts A–C before you start
so you know the exact WordPress field names, the 4 taxonomies, and the per-property
SEO checklist. My canonical domain is https://www.propertysaraansh.com and adding a
property is normally a WordPress-content task (no code change).

PROJECT TO LIST: [PROJECT NAME + SECTOR + CITY, e.g. "Godrej Riverine, Sector 44, Noida"]
PRIMARY BUYER INTENT / ANGLE: [e.g. "luxury end-user + NRI investor"]

Do this:
1. Web-search the project and gather current, verifiable facts: builder, RERA number,
   configuration & sizes, price (per sq.ft. + ticket range, and numeric min/max in ₹),
   launch & possession dates, towers/units/floors/land, key amenities, location
   advantages (metro/airport/schools/hospitals with distances), and the YouTube review
   URL if Property Saraansh has one. Cite sources. Flag anything you can't verify rather
   than inventing it.
2. Produce a WordPress fill-in sheet mapped to the EXACT field names in Part B
   (taxonomy terms to assign + every ACF field with the value to paste). Include
   `price_min_numeric` and `price_max_numeric` as plain numbers.
3. Write the SEO fields per Part C: an SEO `meta_title` (≤60 chars), `meta_description`
   (≤155 chars), the recommended URL slug, a 120–160 word `project_overview` paragraph,
   and at least 5 buyer FAQs (question + answer) for the FAQ schema.
4. Give me descriptive alt text for the hero + each image slot.
5. End with the per-property SEO checklist from Part C, ticked against what you provided
   and listing anything still missing that I need to supply (e.g. exact lat/long, gallery
   images).

Keep every factual claim grounded in search results. Do not change any code unless I
ask — this is a content + SEO task.
```

---

*Reference generated 7 Jul 2026 from the live `property.ts` data layer and `ps-core.php`
plugin. If the field structure changes later, update Part B.*
