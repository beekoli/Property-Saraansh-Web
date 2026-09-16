"use client";

import { useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { CITIES, type LaunchAlert, type CityKey } from '@/lib/launchAlerts';

const BRAND_GREEN = '#0B3038';

function AlertCard({ alert }: { alert: LaunchAlert }) {
  return (
    <article className="mb-4 rounded-2xl border border-[#e8ecf1] bg-white p-5 shadow-[0_1px_2px_rgba(8,33,38,.04)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="heading-playfair text-[21px] font-bold leading-tight text-brand-dark">
            {alert.title}
          </h3>
          <p className="mt-1 text-[13.5px] text-[#66788c]">
            {[alert.builder, alert.location].filter(Boolean).join(' · ')}
          </p>
        </div>
        <span
          className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${
            alert.registered ? 'bg-[#e8f2ea] text-[#1f7a43]' : 'bg-[#eaf0f6] text-[#2f5a86]'
          }`}
        >
          {alert.registered ? 'RERA Registered' : 'Newly Launched'}
        </span>
      </div>

      {alert.price && (
        <p className="mt-3.5 text-[16px] font-semibold text-brand-ink">
          {alert.price}{' '}
          {alert.priceNote && (
            <span className="text-[13.5px] font-normal text-[#66788c]">{alert.priceNote}</span>
          )}
        </p>
      )}

      {/* The fine print is the product. Everything above it is on any portal;
          this line is the reason someone comes back to the page. */}
      <p className="mt-3 rounded-r-lg border-l-[3px] border-[#c99a45] bg-[#fbf5ea] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-[#7a5a1c]">
        <b className="text-[#5f4514]">Fine print &mdash; </b>
        {alert.finePrint}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5">
        <span className="text-[12px] text-[#9aa4b0]">{alert.sourceNote}</span>
        {alert.propertyHref && (
          <Link
            href={alert.propertyHref}
            className="rounded-lg px-4 py-2 text-[12.5px] font-bold text-white transition hover:brightness-125"
            style={{ background: BRAND_GREEN }}
          >
            Full project details &rarr;
          </Link>
        )}
      </div>
    </article>
  );
}

export default function NewLaunchesClient({ alerts }: { alerts: LaunchAlert[] }) {
  const available = useMemo(
    () => CITIES.filter((c) => alerts.some((a) => a.city === c.key)),
    [alerts]
  );
  const [city, setCity] = useState<CityKey | 'all'>('all');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const shown = city === 'all' ? alerts : alerts.filter((a) => a.city === city);

  async function subscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const wanted = String(fd.get('city') || 'Any city');

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'New Launch Alerts',
          name: fd.get('name'),
          phone: fd.get('phone'),
          type: fd.get('type') || '',
          budget: fd.get('budget') || '',
          message: `Wants new launch alerts for ${wanted}.`,
        }),
      });
    } catch (err) {
      console.error('Failed to submit alert subscription:', err);
    }
    setSent(true);
    setSending(false);
  }

  const inputCls =
    'w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/45 focus:border-brand-accent';

  return (
    <>
      {available.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCity('all')}
            className={`rounded-full border px-4 py-2 text-[13.5px] font-medium transition ${
              city === 'all'
                ? 'border-brand-dark bg-brand-dark text-white'
                : 'border-[#e8ecf1] bg-white text-[#3c4653] hover:border-brand-accent'
            }`}
          >
            All
          </button>
          {available.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setCity(c.key)}
              className={`rounded-full border px-4 py-2 text-[13.5px] font-medium transition ${
                city === c.key
                  ? 'border-brand-dark bg-brand-dark text-white'
                  : 'border-[#e8ecf1] bg-white text-[#3c4653] hover:border-brand-accent'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {shown.length > 0 ? (
        shown.map((a) => <AlertCard key={a.id} alert={a} />)
      ) : (
        <p className="rounded-2xl border border-dashed border-[#e8ecf1] bg-white px-5 py-8 text-center text-sm text-[#66788c]">
          No launches logged here yet. Subscribe below and we will send the next one.
        </p>
      )}

      <div
        className="mt-8 rounded-2xl p-6 text-center sm:p-7"
        style={{ background: `linear-gradient(160deg, #124C57, ${BRAND_GREEN})` }}
      >
        {sent ? (
          <>
            <h2 className="heading-playfair text-[20px] font-semibold text-white">
              You are on the list
            </h2>
            <p className="mt-1.5 text-[13.5px] text-[#aebccb]">
              We will message you when the next launch in your city is worth knowing about.
            </p>
          </>
        ) : (
          <>
            <h2 className="heading-playfair text-[20px] font-semibold text-white">
              Get every new launch first
            </h2>
            <p className="mb-5 mt-1.5 text-[13.5px] text-[#aebccb]">
              WhatsApp updates &middot; choose your city, budget and property type
            </p>
            <form onSubmit={subscribe} className="mx-auto grid max-w-md gap-2.5 text-left">
              <input name="name" required placeholder="Your name" className={inputCls} />
              <input
                name="phone"
                required
                type="tel"
                pattern="[0-9+ ]{10,15}"
                placeholder="Phone number"
                className={inputCls}
              />
              <select name="city" defaultValue="" className={inputCls}>
                <option value="" disabled>
                  Which city?
                </option>
                {CITIES.map((c) => (
                  <option key={c.key} value={c.label} className="text-brand-ink">
                    {c.label}
                  </option>
                ))}
              </select>
              <select name="budget" defaultValue="" className={inputCls}>
                <option value="" disabled>
                  Budget
                </option>
                <option className="text-brand-ink">Under &#8377;1 Cr</option>
                <option className="text-brand-ink">&#8377;1&ndash;2 Cr</option>
                <option className="text-brand-ink">&#8377;2&ndash;4 Cr</option>
                <option className="text-brand-ink">Above &#8377;4 Cr</option>
              </select>
              <select name="type" defaultValue="" className={inputCls}>
                <option value="" disabled>
                  Property type
                </option>
                <option className="text-brand-ink">Apartment</option>
                <option className="text-brand-ink">Plot</option>
                <option className="text-brand-ink">Commercial</option>
                <option className="text-brand-ink">Studio</option>
              </select>
              <button
                type="submit"
                disabled={sending}
                className="mt-1 rounded-lg bg-brand-accent px-6 py-3 text-[13.5px] font-extrabold text-[#17110a] transition hover:brightness-110 disabled:opacity-70"
              >
                {sending ? 'Sending…' : 'Subscribe to alerts'}
              </button>
              <p className="text-center text-[11.5px] text-[#8fa3ab]">
                No spam. Unsubscribe by replying STOP.
              </p>
            </form>
          </>
        )}
      </div>
    </>
  );
}
