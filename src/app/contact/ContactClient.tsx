"use client";

import { useState } from 'react';
import { MapPin, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react';

interface Props {
  address: string;
  phone: string;
  email: string;
}

export default function ContactClient({ address, phone, email }: Props) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    budget: '₹2.5Cr - ₹5Cr',
    propertyType: 'Residential',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) return;
    setFormSubmitted(true);
    console.log("Contact Form Lead Generated:", formData);
  };

  return (
    <div className="bg-[#E8F5F2] min-h-screen pt-24 pb-32 text-brand-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-brand-primary uppercase tracking-widest text-xs font-bold block mb-2">Get in touch</span>
          <h1 className="text-4xl md:text-5xl font-bold heading-playfair text-brand-dark mb-4">Contact Our Experts</h1>
          <div className="w-20 h-0.5 bg-brand-accent mx-auto mb-6"></div>
          <p className="text-brand-dark/75 text-sm md:text-base font-light leading-relaxed">
            Ready to find your dream property? Fill out the form below, and Saraansh Seth will guide you with deep market analysis.
          </p>
        </div>
        
        {/* Split Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl overflow-hidden border border-brand-light/10 shadow-lg">
          
          {/* Left Column: Lead Form */}
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold heading-playfair text-brand-dark mb-6 flex items-center gap-2 uppercase tracking-wide">
              <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
              Send us an enquiry
            </h2>
            
            {formSubmitted ? (
              <div className="text-center py-16 bg-brand-pale/50 border border-brand-light/20 rounded-2xl p-6 animate-fade-in">
                <CheckCircle className="text-brand-primary mx-auto mb-4" size={48} />
                <h3 className="font-bold text-brand-dark text-xl mb-2">Thank You!</h3>
                <p className="text-sm text-brand-dark/70 max-w-xs mx-auto leading-relaxed">
                  Your property query has been successfully logged. Saraansh Seth or a lead consultant will call you back within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-brand-pale/30 border border-brand-light/25 rounded-lg px-4 py-3 text-sm placeholder-brand-light/50 focus:outline-none focus:border-brand-primary font-semibold transition-colors" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-brand-pale/30 border border-brand-light/25 rounded-lg px-4 py-3 text-sm placeholder-brand-light/50 focus:outline-none focus:border-brand-primary font-semibold transition-colors" 
                      placeholder="+91 98765 43210" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-brand-pale/30 border border-brand-light/25 rounded-lg px-4 py-3 text-sm placeholder-brand-light/50 focus:outline-none focus:border-brand-primary font-semibold transition-colors" 
                      placeholder="john@example.com" 
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">Your Current City</label>
                    <input 
                      type="text" 
                      id="city" 
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full bg-brand-pale/30 border border-brand-light/25 rounded-lg px-4 py-3 text-sm placeholder-brand-light/50 focus:outline-none focus:border-brand-primary font-semibold transition-colors" 
                      placeholder="Delhi / Noida / Mumbai" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="budget" className="block text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">Budget Range</label>
                    <select 
                      id="budget" 
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      className="w-full bg-brand-pale/30 border border-brand-light/25 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary font-semibold transition-colors"
                    >
                      <option>Under ₹1.5 Cr</option>
                      <option>₹1.5Cr - ₹2.5Cr</option>
                      <option>₹2.5Cr - ₹5Cr</option>
                      <option>₹5Cr - ₹10Cr</option>
                      <option>₹10 Cr+</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="propertyType" className="block text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">Property Type</label>
                    <select 
                      id="propertyType" 
                      value={formData.propertyType}
                      onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                      className="w-full bg-brand-pale/30 border border-brand-light/25 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary font-semibold transition-colors"
                    >
                      <option>Residential</option>
                      <option>Commercial</option>
                      <option>Plots / Authority Land</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">Your Requirements / Message</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-brand-pale/30 border border-brand-light/25 rounded-lg px-4 py-3 text-sm placeholder-brand-light/50 focus:outline-none focus:border-brand-primary font-semibold transition-colors" 
                    placeholder="I am looking for a ready-to-move 3BHK flat on Noida Expressway..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full btn-primary font-bold rounded-lg py-3.5 transition-all shadow-md hover:shadow-lg text-sm uppercase tracking-wider"
                >
                  Send Enquiry
                </button>
              </form>
            )}
          </div>
          
          {/* Right Column: Contact Details & Map (Dark Teal Bg) */}
          <div className="bg-brand-dark text-white p-8 md:p-12 flex flex-col justify-between border-l border-brand-light/20 relative">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-2xl font-bold heading-playfair text-brand-accent mb-6 flex items-center gap-2 uppercase tracking-wide">
                <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                Contact Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 text-brand-accent mt-1">
                    <MapPin size={22} />
                  </div>
                  <div className="ml-4 text-brand-pale/80 font-light">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wide">Office Address</h3>
                    <p className="mt-1 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: address }}></p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 text-brand-accent mt-1">
                    <Phone size={22} />
                  </div>
                  <div className="ml-4 text-brand-pale/80 font-light">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wide">Phone</h3>
                    <p className="mt-1 leading-none text-sm">{phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 text-brand-accent mt-1">
                    <Mail size={22} />
                  </div>
                  <div className="ml-4 text-brand-pale/80 font-light">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wide">Email</h3>
                    <p className="mt-1 leading-none text-sm">{email}</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Google Maps embed */}
              <div className="w-full aspect-[2/1] rounded-xl overflow-hidden shadow-inner border border-brand-light/10">
                <iframe 
                  src={process.env.NEXT_PUBLIC_GOOGLE_MAP_EMBED_URL || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.743126002166!2d77.36836487532392!3d28.549265275685794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ceb9148d89a7f%3A0x6e76839352e89694!2sATS%20Bouquet%2C%20Block%20A%2C%20Sector%20132%2C%20Noida%2C%20Uttar%20Pradesh%20201304!5e0!3m2!1sen!2sin!4v1718127600000!5m2!1sen!2sin"} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy"
                  title="Office map location"
                ></iframe>
              </div>
            </div>
            
            <div className="mt-12 relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-t border-brand-light/20 pt-6">
              <div>
                <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-3">WhatsApp Directly</h3>
                <a 
                  href="https://wa.me/918076178189?text=Hi%20Saraansh,%20I'm%20looking%20for%20a%20property%20consultation." 
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-2.5 rounded-lg text-xs hover:bg-[#1ebd59] transition-all shadow-md"
                >
                  <MessageSquare size={16} />
                  Chat on WhatsApp
                </a>
              </div>
              
              <div>
                <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-3">Follow Us</h3>
                <div className="flex flex-wrap gap-4 text-brand-accent">
                  <a href="https://www.youtube.com/@PropertySaraansh" target="_blank" rel="noreferrer" className="hover:text-brand-accent-light transition-colors text-xs font-bold uppercase tracking-wider">YouTube</a>
                  <a href="https://instagram.com/propertysaraansh" target="_blank" rel="noreferrer" className="hover:text-brand-accent-light transition-colors text-xs font-bold uppercase tracking-wider">Instagram</a>
                  <a href="https://www.facebook.com/PropertySaraansh" target="_blank" rel="noreferrer" className="hover:text-brand-accent-light transition-colors text-xs font-bold uppercase tracking-wider">Facebook</a>
                  <a href="https://www.linkedin.com/company/propertysaraansh/" target="_blank" rel="noreferrer" className="hover:text-brand-accent-light transition-colors text-xs font-bold uppercase tracking-wider">LinkedIn</a>
                  <a href="https://x.com/propsaraansh" target="_blank" rel="noreferrer" className="hover:text-brand-accent-light transition-colors text-xs font-bold uppercase tracking-wider">X</a>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
