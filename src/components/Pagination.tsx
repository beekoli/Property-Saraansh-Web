import Link from 'next/link';

interface Props {
  /** Current 1-based page number. */
  page: number;
  totalPages: number;
  /** Base path without a query string, e.g. "/blog" or "/news". */
  basePath: string;
  /** Total item count, shown alongside the page counter when > 0. */
  total?: number;
  /** Plural noun for the counter, e.g. "articles" or "stories". */
  itemLabel?: string;
}

/**
 * Build the compact page list: always show first and last, plus a window
 * around the current page, with gaps marked by null.
 */
function buildPageList(current: number, totalPages: number): Array<number | null> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages, current]);
  if (current - 1 > 1) pages.add(current - 1);
  if (current + 1 < totalPages) pages.add(current + 1);

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const withGaps: Array<number | null> = [];

  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) withGaps.push(null);
    withGaps.push(p);
  });

  return withGaps;
}

const linkClass =
  'px-4 py-2.5 rounded-full text-xs font-bold bg-white text-brand-primary border border-brand-light/20 hover:border-brand-light transition-all shadow-sm';

/**
 * Crawlable pagination.
 *
 * Rendered as real <a href> links rather than click handlers so Googlebot can
 * follow them. The listings used to render a fixed slice with no pagination at
 * all, which left every item past that slice with no inbound internal link —
 * orphan pages that Google reports as "Crawled - currently not indexed".
 */
export default function Pagination({
  page,
  totalPages,
  basePath,
  total = 0,
  itemLabel = 'items',
}: Props) {
  if (totalPages <= 1) return null;

  const href = (p: number) => (p <= 1 ? basePath : `${basePath}?page=${p}`);
  const pageList = buildPageList(page, totalPages);

  return (
    <nav aria-label="Pagination" className="mt-16 flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {page > 1 && (
          <Link href={href(page - 1)} rel="prev" className={`${linkClass} uppercase tracking-wider`}>
            ← Previous
          </Link>
        )}

        {pageList.map((p, i) =>
          p === null ? (
            <span key={`gap-${i}`} className="px-2 text-brand-ink/40 select-none">
              …
            </span>
          ) : p === page ? (
            <span
              key={p}
              aria-current="page"
              className="px-4 py-2.5 rounded-full text-xs font-bold bg-brand-primary text-white shadow-md"
            >
              {p}
            </span>
          ) : (
            <Link key={p} href={href(p)} className={linkClass}>
              {p}
            </Link>
          )
        )}

        {page < totalPages && (
          <Link href={href(page + 1)} rel="next" className={`${linkClass} uppercase tracking-wider`}>
            Next →
          </Link>
        )}
      </div>

      <p className="text-xs text-brand-ink/50">
        Page {page} of {totalPages}
        {total > 0 && ` · ${total} ${itemLabel}`}
      </p>
    </nav>
  );
}
