'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  GENERAL_MESSAGE,
  blogMessage,
  newsMessage,
  projectMessage,
  videoMessage,
} from '@/lib/whatsapp';

export type PageKind = 'project' | 'video' | 'news' | 'blog';

type Page = { kind: PageKind; title: string } | null;

type Ctx = {
  page: Page;
  setPage: (p: Page) => void;
};

const WhatsAppCtx = createContext<Ctx>({ page: null, setPage: () => {} });

export function WhatsAppProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>(null);
  return (
    <WhatsAppCtx.Provider value={{ page, setPage }}>{children}</WhatsAppCtx.Provider>
  );
}

/** The message the floating button should carry on the current page. */
export function useWhatsAppMessage(): { message: string; project: string | null } {
  const { page } = useContext(WhatsAppCtx);
  if (!page) return { message: GENERAL_MESSAGE, project: null };
  switch (page.kind) {
    case 'project':
      return { message: projectMessage(page.title), project: page.title };
    case 'video':
      return { message: videoMessage(page.title), project: null };
    case 'news':
      return { message: newsMessage(page.title), project: null };
    case 'blog':
      return { message: blogMessage(page.title), project: null };
    default:
      return { message: GENERAL_MESSAGE, project: null };
  }
}

/**
 * Rendered by a project or article page to tell the floating button what this
 * page is about. Renders nothing. Clears itself on unmount so a client-side
 * navigation away from a project page falls back to the general message.
 */
export function WhatsAppPageContext({ kind, title }: { kind: PageKind; title: string }) {
  const { setPage } = useContext(WhatsAppCtx);
  useEffect(() => {
    setPage({ kind, title });
    return () => setPage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, title]);
  return null;
}
