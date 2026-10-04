'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { HONEYPOT_FIELD, RENDERED_AT_FIELD, MIN_FILL_MS } from '@/lib/leadFormFields';

/**
 * An input no human ever sees. Automated form-fillers populate every field
 * they find, so anything arriving with this filled is discarded server-side.
 * Positioned off-screen rather than display:none — some bots skip hidden
 * inputs — and removed from the tab order and the accessibility tree.
 */
export function LeadHoneypot({ inputRef }: { inputRef: RefObject<HTMLInputElement | null> }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor={HONEYPOT_FIELD}>Company website</label>
      <input
        ref={inputRef}
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}

export function useLeadGuard() {
  const renderedAt = useRef(0);
  const honeypotRef = useRef<HTMLInputElement | null>(null);

  // Set on mount, never during SSR — a prerendered page would otherwise carry
  // a build-time timestamp and every real lead would look stale.
  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  const guardFields = () => ({
    [RENDERED_AT_FIELD]: renderedAt.current || Date.now() - MIN_FILL_MS * 2,
    [HONEYPOT_FIELD]: honeypotRef.current?.value || '',
  });

  return { guardFields, honeypotRef };
}
