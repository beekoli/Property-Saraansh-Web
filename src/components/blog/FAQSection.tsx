'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="my-14">
      <h2 className="heading-playfair text-2xl md:text-3xl font-bold text-brand-dark mb-8 flex items-center gap-3">
        <span className="w-1.5 h-8 bg-brand-accent rounded-full"></span>
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                isOpen 
                  ? 'border-brand-accent/40 shadow-lg bg-white' 
                  : 'border-brand-light/20 bg-brand-pale/20 hover:border-brand-accent/20'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between text-left px-5 md:px-6 py-4 md:py-5 gap-4 group cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className={`text-sm md:text-base font-semibold leading-snug transition-colors ${
                  isOpen ? 'text-brand-dark' : 'text-brand-ink/80 group-hover:text-brand-dark'
                }`}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-brand-accent' : 'text-brand-light'
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                  <div className="border-t border-brand-light/10 pt-4">
                    <p className="text-sm md:text-base text-brand-ink/70 leading-relaxed font-light">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
