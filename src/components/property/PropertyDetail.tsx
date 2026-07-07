"use client";

/**
 * Property Saraansh — property detail UI (approved v2 design, balanced gold)
 * Desktop: sticky lead form in right sidebar. Mobile: 2-button bottom bar.
 * Client component (renders to HTML on the server too — SEO-safe).
 */

import { useState, type ReactNode, type FormEvent } from "react";
import Image from "next/image";
import type { Property } from "@/lib/property";
import type { WPBuilderTerm } from "@/lib/wordpress";

const GOLD = "linear-gradient(115deg,#b8913c 0%,#d9b25e 55%,#c9a24b 100%)";
const BRAND_GREEN = "#0B3038"; // site header button + footer color
const PHONE = process.env.NEXT_PUBLIC_PHONE || "+918076178189";
const WHATSAPP = `https://api.whatsapp.com/send?phone=${PHONE.replace("+", "")}&text=`;

const CAT_LABELS: Record<string, string> = {
  metro: "🚇 Metro & Transit", airport: "✈️ Airport & Roads", school: "🏫 Schools",
  hospital: "🏥 Hospitals", retail: "🛍️ Retail & Leisure", employment: "🏭 Employment Hubs", other: "✨ Other",
};

const FACT_ICONS: Record<string, string> = {
  "Total Land": "📐", "Towers": "🏙️", "Total Units": "🏢", "Total Floors": "🏗️",
  "Units / Floor": "🚪", "Lifts / Floor": "🛗", "Configuration": "🛏️",
  "Launch": "🚀", "Possession": "🔑", "RERA No.": "✅", "Base Price": "💰",
};

const SECTIONS = [
  ["overview", "Overview"], ["builder", "Builder"], ["video", "Video Review"], ["highlights", "Highlights"],
  ["layout", "Layout"], ["floor-plans", "Floor Plans"], ["amenities", "Amenities"],
  ["price", "Price"], ["payment", "Payment Plan"], ["location", "Location"],
  ["gallery", "Gallery"], ["status", "Possession & Construction"],
] as const;

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-5">
      <div className="text-[11.5px] font-extrabold tracking-[2.5px] uppercase text-[#8a6a1e]">{eyebrow}</div>
      <h2 className="relative mt-1 pb-2.5 text-[23px] font-bold text-[#0f2137]">
        {title}
        <span className="absolute bottom-0 left-0 h-[3.5px] w-16 rounded" style={{ background: GOLD }} />
      </h2>
    </div>
  );
}

function GoldBtn({ href, children, onClick }: { href?: string; children: ReactNode; onClick?: () => void }) {
  const cls = "inline-block rounded-[10px] px-6 py-3 text-sm font-extrabold text-white shadow-[0_2px_10px_rgba(201,162,75,.35)] transition hover:brightness-105";
  return href
    ? <a href={href} className={cls} style={{ background: GOLD }} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener">{children}</a>
    : <button onClick={onClick} className={cls} style={{ background: GOLD }}>{children}</button>;
}

export default function PropertyDetail({ p, builder }: { p: Property; builder?: WPBuilderTerm | null }) {
  const [fpTab, setFpTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [galleryCount, setGalleryCount] = useState(6);

  const wa = WHATSAPP + encodeURIComponent(`Hi, I am interested in ${p.title}. Please share details.`);
  const doneCount = p.timeline.filter((t) => t.done).length;
  const progressPct = p.timeline.length > 1 ? ((doneCount - 0.5) / p.timeline.length) * 100 : 10;

  const advByCat: Record<string, Property["locationAdv"]> = {};
  for (const a of p.locationAdv) (advByCat[a.category] = advByCat[a.category] || []).push(a);

  const citySlug = p.city ? p.city.toLowerCase().replace(/\s+/g, "-") : "";
  const typeHref = p.type
    ? (p.type.toLowerCase().includes("commercial") ? "/commercial-properties" : "/residential-properties")
    : "";

  // Lead form — until the forms/CRM setup is done, submissions open WhatsApp
  // pre-filled with the visitor's details so no lead is lost.
  // TODO: POST to lead API / CRM when forms are set up.
  function submitLead(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const msg = `Hi, I am ${fd.get("name")} (${fd.get("phone")})${fd.get("buyer_type") ? ", " + fd.get("buyer_type") : ""}. I am interested in ${p.title}. Please share the brochure & price list.`;
    window.open(WHATSAPP + encodeURIComponent(msg), "_blank");
    if (p.brochurePdf) window.open(p.brochurePdf, "_blank");
  }

  const inputCls = "mb-2.5 w-full rounded-lg border border-[#e8ecf1] bg-[#fbfcfe] px-3 py-2.5 text-sm outline-none focus:border-[#c9a24b]";

  return (
    <div className="bg-[#fafbfc] text-[#1c2733]">

      {/* ================= HERO ================= */}
      <div className="relative flex h-[420px] items-end overflow-hidden bg-[#1d3550]">
        {p.hero && (
          <Image src={p.hero.url} alt={p.hero.alt} fill priority className="object-cover" sizes="100vw" />
        )}
        {/* dark top scrim — keeps the transparent site header menu readable over bright images */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-44 bg-gradient-to-b from-[rgba(8,18,30,.88)] via-[rgba(8,18,30,.45)] to-transparent" />
        <div className="relative z-10 w-full bg-gradient-to-t from-[rgba(8,18,30,.94)] to-transparent pb-6 pt-24">
          <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-5">
            <div className="min-w-0 flex-1">
              <h1 className="text-[34px] font-bold leading-tight text-white">{p.title}</h1>
              {p.builder && (
                builder?.slug
                  ? <a href={`/builders/${builder.slug}`} className="mt-1 inline-block text-[15px] font-semibold text-[#f0d894] underline decoration-[#f0d894]/40 underline-offset-2 hover:decoration-[#f0d894]">by {p.builder}</a>
                  : <div className="mt-1 text-[15px] font-semibold text-[#f0d894]">by {p.builder}</div>
              )}
              {(p.status || p.rera) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.status && <span className="rounded-2xl px-3.5 py-1 text-xs font-extrabold text-white" style={{ background: GOLD }}>🚀 {p.status}</span>}
                  {p.rera && <span className="rounded-2xl border border-white/20 bg-white/15 px-3.5 py-1 text-xs text-white backdrop-blur">RERA: {p.rera}</span>}
                </div>
              )}
              <div className="mt-2 text-sm text-[#b9c8d9]">📍 {p.address || `${p.sector}, ${p.city}`}</div>
            </div>
            {p.basePrice && (
              <div className="shrink-0 text-right">
                <div
                  className="text-[18px] font-extrabold leading-tight text-white sm:text-[26px]"
                  style={{ textShadow: "0 1px 16px rgba(240,216,148,.55), 0 1px 3px rgba(0,0,0,.5)" }}
                >{p.basePrice}</div>
                {p.priceDisplay && <div className="mt-0.5 text-[11px] text-[#b9c8d9] sm:text-xs">{p.priceDisplay} · {p.configuration}</div>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= JUMP NAV (brand green, attention marquee) ================= */}
      <div className="ps-marquee sticky top-0 z-40 border-b border-white/10" style={{ background: BRAND_GREEN }}>
        <div className="ps-marquee-viewport mx-auto max-w-6xl overflow-hidden px-5 [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]">
          <div className="ps-marquee-track flex h-[50px] w-max items-center gap-7">
            {[...SECTIONS, ...SECTIONS].map(([id, label], i) => (
              <a
                key={`${id}-${i}`}
                href={`#${id}`}
                aria-hidden={i >= SECTIONS.length}
                tabIndex={i >= SECTIONS.length ? -1 : undefined}
                className="whitespace-nowrap text-[13.5px] font-semibold tracking-wide text-white/85 transition hover:text-[#f0d894]"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes ps-marquee { from { transform: translateX(-50%); } to { transform: translateX(0); } }
          .ps-marquee-track { animation: ps-marquee 28s linear infinite; will-change: transform; }
          .ps-marquee:hover .ps-marquee-track { animation-play-state: paused; }
          @media (prefers-reduced-motion: reduce) {
            .ps-marquee-track { animation: none; }
            .ps-marquee-viewport { overflow-x: auto; }
          }
        `}</style>
      </div>

      {/* ================= CONTENT + DESKTOP SIDEBAR ================= */}
      <div className="mx-auto max-w-6xl px-5 pb-24 lg:grid lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-8 lg:pb-16">
        <div className="min-w-0">

        {/* ================= OVERVIEW ================= */}
        <section id="overview" className="scroll-mt-24 pt-9">
          <SectionHead eyebrow="Project Overview" title={p.title} />
          <div className="rounded-2xl border border-[#e8ecf1] bg-white p-6 shadow-sm">
            <div className="prose prose-sm max-w-none text-[14.5px] leading-relaxed" dangerouslySetInnerHTML={{ __html: p.overviewHtml }} />
            {p.quickFacts.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {p.quickFacts.map((f) => (
                  <div key={f.label} className="flex items-start gap-3 rounded-xl border border-[#eadfc4] bg-gradient-to-br from-[#fffdf7] to-[#f8f3e6] p-3.5 transition hover:shadow-md">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(201,162,75,.16)] text-[16px]">{FACT_ICONS[f.label] ?? "✦"}</span>
                    <div className="min-w-0">
                      <div className="text-[10.5px] font-bold uppercase tracking-wide text-[#9b8a5c]">{f.label}</div>
                      <div className={`mt-0.5 break-words text-[13.5px] font-bold leading-snug ${/RERA|Price/.test(f.label) ? "text-[#8a6a1e]" : "text-[#0f2137]"}`}>{f.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ================= BUILDER / DEVELOPER ================= */}
        {builder && (
          <section id="builder" className="scroll-mt-24 pt-9">
            <SectionHead eyebrow="About the Developer" title={`Meet the Builder — ${builder.name}`} />
            <div className="rounded-2xl border border-[#e8ecf1] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f8f3e6]">
                  {builder.acf?.builder_logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={builder.acf.builder_logo} alt={builder.name} className="h-full w-full object-contain p-2" />
                  ) : (
                    <span className="text-xl font-bold text-[#8a6a1e] heading-playfair">{builder.name.slice(0, 3).toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-[19px] font-bold text-[#0f2137]">{builder.name}</div>
                  {builder.acf?.builder_description && (
                    <p className="mt-1 text-[13.5px] leading-relaxed text-[#66788c]">{builder.acf.builder_description}</p>
                  )}
                </div>
              </div>

              {(builder.acf?.builder_experience || builder.acf?.builder_delivered_projects || builder.acf?.builder_ongoing_projects) && (
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {builder.acf?.builder_experience && (
                    <div className="rounded-xl border border-[#eadfc4] bg-gradient-to-br from-[#fffdf7] to-[#f8f3e6] p-3.5 text-center">
                      <div className="text-lg font-black text-[#8a6a1e]">{builder.acf.builder_experience}</div>
                      <div className="mt-0.5 text-[10.5px] font-bold uppercase tracking-wide text-[#9b8a5c]">Experience</div>
                    </div>
                  )}
                  {builder.acf?.builder_delivered_projects && (
                    <div className="rounded-xl border border-[#eadfc4] bg-gradient-to-br from-[#fffdf7] to-[#f8f3e6] p-3.5 text-center">
                      <div className="text-lg font-black text-[#8a6a1e]">{builder.acf.builder_delivered_projects}</div>
                      <div className="mt-0.5 text-[10.5px] font-bold uppercase tracking-wide text-[#9b8a5c]">Delivered</div>
                    </div>
                  )}
                  {builder.acf?.builder_ongoing_projects && (
                    <div className="rounded-xl border border-[#eadfc4] bg-gradient-to-br from-[#fffdf7] to-[#f8f3e6] p-3.5 text-center">
                      <div className="text-lg font-black text-[#8a6a1e]">{builder.acf.builder_ongoing_projects}</div>
                      <div className="mt-0.5 text-[10.5px] font-bold uppercase tracking-wide text-[#9b8a5c]">Ongoing</div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-5">
                <GoldBtn href={`/builders/${builder.slug}`}>View all {builder.name} projects →</GoldBtn>
              </div>
            </div>
          </section>
        )}

        {/* ================= VIDEO REVIEW ================= */}
        {p.youtubeId && (
          <section id="video" className="scroll-mt-24 pt-9">
            <SectionHead eyebrow="Watch Before You Buy" title={`${p.title} — Property Saraansh Review`} />
            <div className="overflow-hidden rounded-xl bg-[#0d1b2a]">
              <div className="relative aspect-video">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${p.youtubeId}?rel=0`}
                  title={`${p.title} video review by Property Saraansh`}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            {p.verdict && (
              <blockquote className="mt-4 rounded-r-xl border-l-4 border-[#c9a24b] bg-[#fff7e0] p-4 text-[14.5px] italic text-[#4a3a12]">
                <b className="not-italic text-[#8a6a1e]">Saraansh Verdict: </b>{p.verdict}
              </blockquote>
            )}
          </section>
        )}

        {/* ================= HIGHLIGHTS ================= */}
        {p.highlights.length > 0 && (
          <section id="highlights" className="scroll-mt-24 pt-9">
            <SectionHead eyebrow="Why This Project" title="Project Highlights" />
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {p.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 rounded-xl border border-[#e8ecf1] bg-white px-4 py-3 text-sm">
                  <span className="text-[#c9a24b]">✦</span>{h}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ================= PROJECT LAYOUT ================= */}
        {(p.masterPlan || p.sitePlan) && (
          <section id="layout" className="scroll-mt-24 pt-9">
            <SectionHead eyebrow="Project Layout" title="Master Plan & Site Map" />
            <div className="grid gap-4 md:grid-cols-2">
              {[{ img: p.masterPlan, cap: "Master Layout" }, { img: p.sitePlan, cap: "Site Plan / Site Map" }]
                .filter((x) => x.img).map(({ img, cap }) => (
                <figure key={cap}>
                  <button onClick={() => setLightbox(img!.url)} className="group relative block w-full overflow-hidden rounded-xl border border-[#e8ecf1]" aria-label={`Expand ${cap}`}>
                    <Image src={img!.url} alt={img!.alt} width={img!.width ?? 900} height={img!.height ?? 600} className="h-72 w-full object-cover transition group-hover:scale-[1.02]" />
                    <span className="absolute bottom-3 right-3 rounded-2xl bg-[rgba(15,33,55,.85)] px-3 py-1.5 text-[11.5px] text-white">🔍 Click to Expand</span>
                  </button>
                  <figcaption className="mt-2 text-center text-[13px] text-[#66788c]">{cap}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* ================= FLOOR PLANS ================= */}
        {p.floorPlans.length > 0 && (
          <section id="floor-plans" className="scroll-mt-24 pt-9">
            <SectionHead eyebrow="Configurations" title="Floor Plans" />
            <div className="mb-4 flex flex-wrap gap-2">
              {p.floorPlans.map((f, i) => (
                <button key={f.title} onClick={() => setFpTab(i)}
                  className={`rounded-full px-4 py-2 text-[13px] transition ${i === fpTab ? "font-extrabold text-white" : "border-[1.5px] border-[#e8ecf1] bg-white text-[#1c2733]"}`}
                  style={i === fpTab ? { background: GOLD } : undefined}>
                  {f.title}
                </button>
              ))}
            </div>
            {p.floorPlans[fpTab] && (
              <div>
                {p.floorPlans[fpTab].description && <p className="mb-3 text-sm text-[#66788c]">{p.floorPlans[fpTab].description}</p>}
                {p.floorPlans[fpTab].image && (
                  <button onClick={() => setLightbox(p.floorPlans[fpTab].image!.url)} className="relative block w-full overflow-hidden rounded-xl border border-[#e8ecf1]">
                    <Image src={p.floorPlans[fpTab].image!.url} alt={p.floorPlans[fpTab].image!.alt} width={1100} height={700} className="max-h-[420px] w-full bg-white object-contain" />
                    <span className="absolute bottom-3 right-3 rounded-2xl bg-[rgba(15,33,55,.85)] px-3 py-1.5 text-[11.5px] text-white">🔍 Click to Expand</span>
                  </button>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {p.floorPlans[fpTab].pdf && <GoldBtn href={p.floorPlans[fpTab].pdf}>📄 Download Floor Plan</GoldBtn>}
                  {p.floorPlanNote && <span className="text-xs text-[#66788c]">{p.floorPlanNote}</span>}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ================= AMENITIES ================= */}
        {p.amenities.length > 0 && (
          <section id="amenities" className="scroll-mt-24 pt-9">
            <SectionHead eyebrow="Lifestyle" title="Premium Amenities" />
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {p.amenities.map((m) => (
                <div key={m.name} className="rounded-xl border border-[#e8ecf1] bg-white px-3 py-4 text-center text-[12.5px]">
                  <span className="mb-1.5 block text-[22px]">{m.icon}</span>{m.name}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= PRICE LIST ================= */}
        {p.priceList.length > 0 && (
          <section id="price" className="scroll-mt-24 pt-9">
            <SectionHead eyebrow="Pricing" title="Price List" />
            <div className="overflow-x-auto rounded-xl shadow-sm">
              <table className="w-full border-collapse bg-white text-sm">
                <thead>
                  <tr className="bg-[#0f2137] text-left text-xs tracking-wide text-white">
                    <th className="px-4 py-3">TYPE</th><th className="px-4 py-3">SIZE</th>
                    <th className="px-4 py-3">BASE PRICE</th><th className="px-4 py-3">ALL-IN PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  {p.priceList.map((r) => (
                    <tr key={r.type + r.size} className="border-b border-[#e8ecf1] last:border-0 even:bg-[#fbfcfe]">
                      <td className="px-4 py-3">{r.type}</td><td className="px-4 py-3">{r.size}</td>
                      <td className="px-4 py-3">{r.base}</td><td className="px-4 py-3 font-extrabold text-[#0f2137]">{r.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {p.priceListPdf && <GoldBtn href={p.priceListPdf}>📄 Download Price List</GoldBtn>}
            </div>
            {p.priceNote && <p className="mt-3 text-xs text-[#66788c]">{p.priceNote}</p>}
          </section>
        )}

        {/* ================= PAYMENT PLAN ================= */}
        {(p.paymentSteps.length > 0 || p.paymentMilestones.length > 0 || p.eoiNote) && (
          <section id="payment" className="scroll-mt-24 pt-9">
            <SectionHead eyebrow="How You Pay" title="Payment Plan" />
            {p.paymentSteps.length > 0 && (
              <div className="mb-5 grid gap-3.5 sm:grid-cols-3">
                {p.paymentSteps.map((s) => (
                  <div key={s.title} className="rounded-xl border border-[#e8ecf1] border-t-4 border-t-[#c9a24b] bg-white p-4 text-center shadow-sm">
                    <div className="bg-clip-text text-3xl font-black text-transparent" style={{ backgroundImage: GOLD }}>{s.percentage}</div>
                    <div className="mt-1 text-sm font-bold text-[#0f2137]">{s.title}</div>
                    {s.description && <div className="mt-1 text-xs text-[#66788c]">{s.description}</div>}
                  </div>
                ))}
              </div>
            )}
            {p.paymentMilestones.length > 0 && (
              <div className="overflow-x-auto rounded-xl shadow-sm">
                <table className="w-full border-collapse bg-white text-[13.5px]">
                  <thead>
                    <tr className="bg-[#0f2137] text-left text-xs tracking-wide text-white">
                      <th className="px-4 py-3">MILESTONE</th><th className="px-4 py-3">DEMAND</th><th className="px-4 py-3">CUMULATIVE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.paymentMilestones.map((m) => (
                      <tr key={m.milestone} className="border-b border-[#e8ecf1] last:border-0">
                        <td className="px-4 py-2.5">{m.milestone}</td>
                        <td className="px-4 py-2.5 font-extrabold text-[#8a6a1e]">{m.demand}</td>
                        <td className="px-4 py-2.5">{m.cumulative}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {p.eoiNote && (
              <div className="mt-4 rounded-xl border border-dashed border-[#c9a24b] bg-[#fff7e0] p-3.5 text-[13.5px]">
                <b className="text-[#8a6a1e]">EOI Benefit: </b>{p.eoiNote}
              </div>
            )}
          </section>
        )}

        {/* ================= LOCATION ================= */}
        {(p.locationAdv.length > 0 || p.mapEmbedSrc) && (
          <section id="location" className="scroll-mt-24 pt-9">
            <SectionHead eyebrow="Connectivity" title="Location Advantages" />
            {p.locationAdv.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(advByCat).map(([cat, items]) => (
                  <div key={cat} className="rounded-xl border border-[#e8ecf1] bg-white p-3.5">
                    <div className="mb-1.5 text-xs font-extrabold uppercase tracking-wide text-[#c9a24b]">{CAT_LABELS[cat] ?? cat}</div>
                    <ul>
                      {items.map((a) => (
                        <li key={a.name} className="flex justify-between gap-2 py-1 text-[13px]">
                          <span>{a.name}</span>
                          {a.distance && <span className="shrink-0 text-xs text-[#66788c]">{a.distance}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            {p.mapEmbedSrc && (
              <div className="mt-4 overflow-hidden rounded-xl border border-[#e8ecf1]">
                <iframe src={p.mapEmbedSrc} title={`${p.title} location map`} className="h-72 w-full" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
              </div>
            )}
          </section>
        )}

        {/* ================= GALLERY ================= */}
        {p.gallery.length > 0 && (
          <section id="gallery" className="scroll-mt-24 pt-9">
            <SectionHead eyebrow="Visuals" title="Project Gallery" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {p.gallery.slice(0, galleryCount).map((g) => (
                <button key={g.url} onClick={() => setLightbox(g.url)} className="overflow-hidden rounded-xl border border-[#e8ecf1]">
                  <Image src={g.url} alt={g.alt} width={480} height={320} className="h-44 w-full object-cover transition hover:scale-[1.03]" />
                </button>
              ))}
            </div>
            {p.gallery.length > galleryCount && (
              <div className="mt-4 text-center">
                <GoldBtn onClick={() => setGalleryCount(p.gallery.length)}>+{p.gallery.length - galleryCount} View More</GoldBtn>
              </div>
            )}
          </section>
        )}

        {/* ================= POSSESSION & CONSTRUCTION STATUS ================= */}
        {p.timeline.length > 0 && (
          <section id="status" className="scroll-mt-24 pt-9">
            <SectionHead eyebrow="Track The Progress" title="Possession & Construction Status" />
            <div className="rounded-2xl border border-[#e8ecf1] bg-white p-7 shadow-sm">
              <div className="relative mx-2 mt-6 h-2 rounded bg-[#e8ecf1]">
                <div className="absolute inset-y-0 left-0 rounded" style={{ width: `${Math.max(8, Math.min(progressPct, 100))}%`, background: GOLD }} />
              </div>
              <div className="mx-2 flex justify-between">
                {p.timeline.map((t) => (
                  <div key={t.stage} className="relative pt-4 text-center text-xs text-[#66788c]" style={{ width: `${100 / p.timeline.length}%` }}>
                    <span className={`absolute -top-[15px] left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-[3px] ${t.done ? "border-[#a97e22]" : "border-[#cfd8e2] bg-white"}`}
                      style={t.done ? { background: GOLD } : undefined} />
                    <b className="block text-[12.5px] text-[#0f2137]">{t.stage}</b>{t.date}
                  </div>
                ))}
              </div>
              <div className="mt-5 text-center">
                <span className="rounded-2xl bg-[#e7f4ee] px-4 py-1.5 text-[12.5px] font-extrabold text-[#1e8e5a]">
                  ✓ Current Phase: {p.timeline.filter((t) => t.done).at(-1)?.stage ?? p.currentPhase}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ================= FAQs ================= */}
        {p.faqs.length > 0 && (
          <section id="faqs" className="scroll-mt-24 pt-9">
            <SectionHead eyebrow="Common Questions" title="Frequently Asked Questions" />
            <div className="rounded-2xl border border-[#e8ecf1] bg-white px-6 py-2 shadow-sm">
              {p.faqs.map((f, i) => (
                <div key={f.question} className="border-b border-[#e8ecf1] py-3.5 last:border-0">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between text-left text-[14.5px] font-bold text-[#0f2137]" aria-expanded={openFaq === i}>
                    {f.question}
                    <span className="ml-3 font-black text-[#c9a24b]">{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {/* answer stays in the HTML (hidden) so crawlers always see it */}
                  <p className={`mt-1.5 text-[13.5px] text-[#66788c] ${openFaq === i ? "" : "hidden"}`}>{f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= KEEP EXPLORING (tag interlinks) ================= */}
        {(p.city || p.type || builder?.slug) && (
          <section className="scroll-mt-24 pt-9">
            <SectionHead eyebrow="Keep Exploring" title="Similar Projects" />
            <div className="flex flex-wrap gap-2.5">
              {p.city && (
                <a href={`/property-in/${citySlug}`} className="rounded-full border-[1.5px] border-[#e8ecf1] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0f2137] transition hover:border-[#c9a24b] hover:text-[#8a6a1e]">
                  📍 All projects in {p.city}
                </a>
              )}
              {typeHref && (
                <a href={typeHref} className="rounded-full border-[1.5px] border-[#e8ecf1] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0f2137] transition hover:border-[#c9a24b] hover:text-[#8a6a1e]">
                  🏢 All {p.type} projects
                </a>
              )}
              {builder?.slug && (
                <a href={`/builders/${builder.slug}`} className="rounded-full border-[1.5px] border-[#e8ecf1] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0f2137] transition hover:border-[#c9a24b] hover:text-[#8a6a1e]">
                  🏗️ More by {p.builder}
                </a>
              )}
            </div>
          </section>
        )}

        </div>{/* /main column */}

        {/* ================= DESKTOP STICKY LEAD FORM ================= */}
        <aside className="hidden lg:block">
          <div className="sticky top-[66px] pt-9">
            <form onSubmit={submitLead} className="rounded-2xl border border-[#e8ecf1] bg-white p-5 shadow-sm">
              <h3 className="text-[16.5px] font-bold text-[#0f2137]">Interested in this project?</h3>
              <p className="mb-3.5 mt-1 text-xs text-[#66788c]">Get price list, payment plan & site visit — free, no spam.</p>
              <input name="name" required placeholder="Your Name" className={inputCls} />
              <input name="phone" required type="tel" pattern="[0-9+ ]{10,15}" placeholder="Phone Number" className={inputCls} />
              <select name="buyer_type" defaultValue="" className={inputCls + " text-[#66788c]"}>
                <option value="" disabled>I am a…</option>
                <option>Home Buyer</option>
                <option>Investor</option>
                <option>NRI Buyer</option>
              </select>
              <button type="submit" className="mt-1 w-full rounded-[10px] py-3 text-sm font-extrabold text-white shadow-[0_2px_10px_rgba(201,162,75,.35)] transition hover:brightness-105" style={{ background: GOLD }}>
                Get Brochure & Price List
              </button>
              <a href={wa} target="_blank" rel="noopener" className="mt-2.5 block w-full rounded-[10px] bg-[#e7f4ee] py-3 text-center text-[13.5px] font-extrabold text-[#1e8e5a]">💬 Chat on WhatsApp</a>
              <a href={`tel:${PHONE}`} className="mt-2.5 block w-full rounded-[10px] border-[1.5px] border-[#0f2137] py-3 text-center text-[13.5px] font-extrabold text-[#0f2137]">📞 {PHONE.replace("+91", "+91 ")}</a>
              <p className="mt-2.5 text-center text-[11px] text-[#66788c]">Our expert will call you back shortly</p>
            </form>
            {p.builder && (
              <div className="mt-4 rounded-2xl border border-[#e8ecf1] bg-white p-5 text-[13px] shadow-sm">
                <div className="text-[15px] font-extrabold text-[#0f2137]">{p.builder}</div>
                <div className="mt-0.5 text-[#66788c]">{p.status} · {p.city}</div>
                {p.possessionDate && <div className="mt-1 text-[#66788c]">Possession: <b className="text-[#0f2137]">{p.possessionDate}</b></div>}
                {builder?.slug && <a href={`/builders/${builder.slug}`} className="mt-2 inline-block text-[12px] font-bold text-[#8a6a1e] hover:underline">View all {p.builder} projects →</a>}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ================= MOBILE BOTTOM BAR — 2 buttons only ================= */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e8ecf1] bg-white/95 backdrop-blur lg:hidden">
        <div className="flex">
          <a href={wa} target="_blank" rel="noopener" className="flex-1 bg-[#e7f4ee] py-4 text-center text-sm font-extrabold text-[#1e8e5a]">💬 WhatsApp</a>
          <a href={`tel:${PHONE}`} className="flex-1 py-4 text-center text-sm font-extrabold text-white" style={{ background: GOLD }}>📞 Call Now</a>
        </div>
      </div>

      {/* ================= LIGHTBOX ================= */}
      {lightbox && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(8,18,30,.92)] p-6" onClick={() => setLightbox(null)} role="dialog" aria-label="Image preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="Expanded view" className="max-h-full max-w-full rounded-lg object-contain" />
          <button className="absolute right-5 top-5 text-3xl text-white" aria-label="Close">✕</button>
        </div>
      )}
    </div>
  );
}
