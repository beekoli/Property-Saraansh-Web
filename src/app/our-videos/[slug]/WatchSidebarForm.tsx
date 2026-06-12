"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  videoTitle: string;
}

export default function WatchSidebarForm({ videoTitle }: Props) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setSubmitted(true);

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: 'YouTube Video Watch Page',
          name,
          phone,
          message,
          videoTitle,
        }),
      });
    } catch (apiError) {
      console.error('Failed to forward lead to API:', apiError);
    }
    
    // Redirect to Thank You page after a short delay
    setTimeout(() => {
      router.push('/thank-you');
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-light/10 text-brand-ink">
      <h3 className="heading-playfair text-lg font-bold mb-1 text-brand-dark">Book Free Consultation</h3>
      <p className="text-xs text-brand-dark/60 mb-5 font-light leading-relaxed">
        Have questions about this review or want to discuss pricing? Message Saraansh Seth.
      </p>
      
      {submitted ? (
        <div className="bg-brand-pale/50 border border-brand-accent/30 rounded-xl p-5 text-center">
          <svg className="w-10 h-10 text-brand-accent mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="font-bold text-sm text-brand-dark mb-1">Request Received!</h4>
          <p className="text-xs text-brand-dark/70 font-light leading-relaxed">
            Redirecting you to WhatsApp to start your 1-on-1 strategy session...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-[10px] uppercase tracking-wider font-bold text-brand-primary mb-1">
              Your Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-pale/30 border border-brand-light/10 rounded-lg text-sm text-brand-dark focus:outline-none focus:border-brand-primary transition-all font-light"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-[10px] uppercase tracking-wider font-bold text-brand-primary mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-pale/30 border border-brand-light/10 rounded-lg text-sm text-brand-dark focus:outline-none focus:border-brand-primary transition-all font-light"
              placeholder="e.g. +91 98765 43210"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-[10px] uppercase tracking-wider font-bold text-brand-primary mb-1">
              Message (Optional)
            </label>
            <textarea
              id="message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-pale/30 border border-brand-light/10 rounded-lg text-sm text-brand-dark focus:outline-none focus:border-brand-primary transition-all font-light resize-none"
              placeholder="Specify budget, configuration or questions..."
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="w-full bg-brand-dark hover:bg-brand-primary text-white border border-brand-accent text-center py-3 rounded-lg text-xs uppercase tracking-wider font-bold font-sans flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-md"
          >
            <span>Request Details</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      )}

      {/* Direct Contact Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-brand-light/10">
        <a
          href={`https://wa.me/918076178189?text=${encodeURIComponent(`Hi Saraansh, I am interested in your review for "${videoTitle}". Let's chat.`)}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366] hover:bg-[#1ebd59] text-white rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all duration-300 shadow-sm cursor-pointer"
        >
          WhatsApp
        </a>
        <a
          href="tel:+918076178189"
          className="flex items-center justify-center gap-1.5 py-2.5 bg-brand-dark hover:bg-brand-primary text-white border border-brand-accent rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all duration-300 shadow-sm cursor-pointer"
        >
          Call Now
        </a>
      </div>
    </div>
  );
}
