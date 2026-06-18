'use client';

import { useState, useEffect } from 'react';
import { List, ChevronRight } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  htmlContent: string;
}

export default function TableOfContents({ htmlContent }: TableOfContentsProps) {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Parse headings from the WordPress HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const headings = doc.querySelectorAll('h2, h3');
    
    const tocItems: TOCItem[] = [];
    headings.forEach((heading, index) => {
      const text = heading.textContent?.trim() || '';
      if (text.length > 0) {
        const id = `toc-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${index}`;
        tocItems.push({ id, text, level: parseInt(heading.tagName.charAt(1)) });
      }
    });
    setItems(tocItems);

    // Add IDs to actual DOM headings after the content renders
    setTimeout(() => {
      const contentEl = document.querySelector('.blog-content');
      if (contentEl) {
        const domHeadings = contentEl.querySelectorAll('h2, h3');
        domHeadings.forEach((heading, index) => {
          const text = heading.textContent?.trim() || '';
          if (text.length > 0) {
            const id = `toc-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${index}`;
            heading.id = id;
          }
        });
      }
    }, 500);
  }, [htmlContent]);

  // Intersection Observer for active heading
  useEffect(() => {
    if (items.length === 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    const timer = setTimeout(() => {
      items.forEach(item => {
        const el = document.getElementById(item.id);
        if (el) observer.observe(el);
      });
    }, 800);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [items]);

  if (items.length < 2) return null;

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <nav className="my-10 bg-gradient-to-br from-brand-pale/60 to-brand-pale/30 border border-brand-light/20 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 md:px-6 py-4 md:py-5 cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-dark rounded-lg flex items-center justify-center shadow-sm">
            <List className="w-4 h-4 text-brand-accent" />
          </div>
          <span className="heading-playfair text-base md:text-lg font-bold text-brand-dark">
            Table of Contents
          </span>
          <span className="text-[10px] uppercase tracking-widest text-brand-light font-semibold bg-white/60 px-2.5 py-1 rounded-full border border-brand-light/10">
            {items.length} sections
          </span>
        </div>
        <ChevronRight
          className={`w-5 h-5 text-brand-light transition-transform duration-300 ${
            isOpen ? 'rotate-90' : ''
          }`}
        />
      </button>

      {/* Items */}
      <div
        className={`overflow-hidden transition-all duration-400 ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
          <div className="border-t border-brand-light/15 pt-4 space-y-0.5">
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer ${
                  activeId === item.id
                    ? 'bg-brand-dark text-white shadow-md'
                    : 'hover:bg-white/60 text-brand-ink/70 hover:text-brand-dark'
                } ${item.level === 3 ? 'ml-5' : ''}`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-widest shrink-0 mt-0.5 ${
                  activeId === item.id ? 'text-brand-accent' : 'text-brand-light'
                }`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={`text-sm leading-snug ${
                  activeId === item.id ? 'font-semibold' : 'font-medium'
                }`}>
                  {item.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
