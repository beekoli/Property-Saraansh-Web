'use client';

import { useState } from 'react';

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
    <section className="my-16" aria-label="Frequently Asked Questions">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-1.5">
            Need Answers?
          </p>
          <h2 className="heading-playfair text-2xl md:text-3xl font-bold text-brand-dark leading-tight">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="hidden sm:flex shrink-0 items-center justify-center w-12 h-12 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 mt-1">
          <span className="text-brand-accent text-base font-bold">{faqs.length}</span>
        </div>
      </div>

      {/* Accordion */}
      <div className="space-y-2.5">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                isOpen
                  ? 'shadow-md ring-1 ring-brand-accent/30 bg-white'
                  : 'bg-[#F7F9F8] ring-1 ring-brand-light/10 hover:ring-brand-accent/20 hover:bg-white'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-start justify-between text-left px-5 md:px-6 py-4 md:py-5 gap-4 group cursor-pointer"
                aria-expanded={isOpen}
              >
                {/* Number + Question */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 transition-colors duration-200 ${
                      isOpen
                        ? 'bg-brand-accent text-white'
                        : 'bg-brand-light/20 text-brand-light group-hover:bg-brand-accent/20 group-hover:text-brand-accent'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={`text-sm md:text-base font-semibold leading-snug transition-colors duration-200 ${
                      isOpen
                        ? 'text-brand-dark'
                        : 'text-brand-ink/80 group-hover:text-brand-dark'
                    }`}
                  >
                    {faq.question}
                  </span>
                </div>

                {/* Chevron */}
                <div
                  className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full mt-0.5 transition-all duration-300 ${
                    isOpen ? 'bg-brand-accent/10 rotate-180' : 'bg-transparent'
                  }`}
                >
                  <svg
                    className={`w-4 h-4 transition-colors duration-200 ${
                      isOpen ? 'text-brand-accent' : 'text-brand-light group-hover:text-brand-accent'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Answer panel */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 md:px-6 pb-5 md:pb-6 ml-[42px]">
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

      {/* Bottom CTA */}
      <div className="mt-7 p-5 md:p-6 rounded-2xl bg-gradient-to-br from-brand-dark to-brand-primary border border-brand-accent/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white mb-0.5">Still have questions?</p>
          <p className="text-xs text-brand-pale/80 font-light">
            Talk to Saraansh Seth directly — free, unbiased advice.
          </p>
        </div>
        <a
          href="https://wa.me/918076178189?text=Hi%20Saraansh%2C%20I%20have%20a%20question%20about%20a%20Noida%20project"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 btn-glossy-whatsapp px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.739-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.588 1.977 14.128.951 11.998.951c-5.444 0-9.866 4.372-9.87 9.802 0 1.714.464 3.391 1.346 4.869l-.993 3.63 3.771-.98-.192-.31zM16.518 14.2c-.27-.135-1.59-.785-1.835-.875-.245-.09-.425-.135-.605.135-.18.27-.695.875-.855 1.05-.16.18-.32.2-.59.065-2.73-1.36-4.52-2.585-6.195-5.45-.16-.275-.16-.44-.025-.575.12-.12.27-.315.405-.47.135-.16.18-.27.27-.45.09-.18.045-.335-.02-.47-.065-.135-.605-1.46-.83-2.005-.22-.53-.46-.455-.63-.463-.165-.008-.355-.01-.545-.01-.19 0-.5.07-.76.36-.26.29-1 1.02-1 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.71.22 1.36.19 1.87.11.57-.08 1.59-.65 1.81-1.27.225-.62.225-1.15.15-1.27-.075-.12-.27-.18-.54-.315z" />
          </svg>
          Ask on WhatsApp
        </a>
      </div>
    </section>
  );
}
