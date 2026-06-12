import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Thank You | Property Saraansh',
  description: 'Thank you for your enquiry. We will get back to you shortly.',
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      {/* Decorative circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-md w-full bg-white/5 backdrop-blur-md border border-brand-light/10 p-8 md:p-10 rounded-2xl shadow-2xl text-center relative z-10 space-y-6">
        <div className="flex justify-center">
          <div className="bg-brand-primary/20 p-4 rounded-full border border-brand-accent/20">
            <CheckCircle2 size={48} className="text-brand-accent" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold heading-playfair text-brand-accent">Thank You!</h1>
          <p className="text-brand-accent-light text-xs uppercase tracking-widest font-bold font-sans">
            Inquiry Successfully Captured
          </p>
        </div>

        <p className="text-brand-pale/80 text-sm font-light leading-relaxed">
          Your request has been successfully recorded in our secure Google Sheet database. 
          Saraansh Seth or one of our lead real estate experts will analyze your requirements 
          and reach out to you within 24 hours.
        </p>

        <div className="border-t border-brand-light/10 pt-6 space-y-3">
          <Link 
            href="/"
            className="w-full btn-primary py-3 rounded-lg text-xs uppercase tracking-wider font-bold font-sans flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-brand-accent/10"
          >
            Back to Home
          </Link>
          
          <Link 
            href="/properties"
            className="w-full btn-outline py-3 rounded-lg text-xs uppercase tracking-wider font-bold font-sans flex items-center justify-center gap-2 cursor-pointer border-brand-light/35 text-brand-pale hover:bg-brand-light hover:text-white"
          >
            Explore Projects
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
