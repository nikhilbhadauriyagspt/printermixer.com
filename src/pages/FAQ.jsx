import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '@/components/SEO';
import { ChevronDown, HelpCircle, Search, Mail, MapPin, Plus, Minus, ChevronRight, Sparkles, ArrowRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqData = [
  {
    category: "Orders & Purchasing",
    questions: [
      { q: "How do I place an order on Printer Mixer?", a: "Simply browse our products, add your items to the cart, and complete the checkout using your preferred payment method." },
      { q: "Do I need an account to purchase?", a: "No. You can checkout as a guest. However, creating an account helps you track orders and access your purchase history." },
      { q: "How can I check my order status?", a: "Log into your account and visit My Orders to view real-time updates. You will also receive email notifications." },
      { q: "Can I modify or cancel my order after placing it?", a: "Orders can be modified or canceled before shipping. Once the item is dispatched, cancellations aren’t possible." },
      { q: "What payment methods do you accept?", a: "We accept major credit/debit cards (Visa, Mastercard), PayPal, and other secure digital payment options." },
      { q: "Is shopping on Printer Mixer secure?", a: "Yes. All transactions are encrypted and processed through verified, PCI-compliant payment networks including PayPal Secure." }
    ]
  },
  {
    category: "Shipping & Delivery",
    questions: [
      { q: "What are your shipping options?", a: "We offer standard and expedited shipping across the USA, depending on your location." },
      { q: "Do you deliver nationwide?", a: "Yes, we ship to all 50 states, including business addresses." },
      { q: "How long does delivery take?", a: "Delivery typically takes 3–7 business days, based on your region and order volume." },
      { q: "How much does shipping cost?", a: "Shipping charges vary by product weight, location, and delivery speed. Final charges appear at checkout." },
      { q: "Will I receive a tracking number?", a: "Yes. You’ll receive a tracking link via email as soon as your order ships." },
      { q: "What if my order is delayed?", a: "You can use your tracking link or contact our support team for an immediate update." }
    ]
  },
  {
    category: "Products & Availability",
    questions: [
      { q: "Are your products covered under warranty?", a: "Yes. All products are 100% Real come with an official manufacturer's warranty." },
      { q: "Do you sell only HP products or other brands too?", a: "We also sell printers, and accessories from other trusted brands." },
      { q: "How can I choose the right hardware?", a: "You can contact our expert support for personalized buying recommendations based on your usage and budget." },
      { q: "What if an item is out of stock?", a: "You can join the Back in Stock alert on the product page, and we’ll notify you as soon as it becomes available." }
    ]
  },
  {
    category: "Warranty & Support",
    questions: [
      { q: "Do your products come with a manufacturer's warranty?", a: "Yes. Every product includes full brand-backed warranty with repair/replacement coverage." },
      { q: "How do I claim warranty for HP products?", a: "You can contact HP Support directly or reach out to us for guidance and warranty assistance." },
      { q: "What if my hardware arrives damaged?", a: "Contact us within 48 hours with photos/videos. We’ll arrange a replacement or initiate a claim." },
      { q: "Do you provide expert support?", a: "Yes. We offer setup help, troubleshooting, installation support, and product-related guidance." }
    ]
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(faqData[0].category);
  const [openIndex, setOpenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = faqData.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q =>
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-900 pb-20 pt-4">
      <SEO
        title="Knowledge Base | Support FAQ"
        description="Find detailed answers to common questions about orders, hardware, shipping, and support."
      />

      {/* --- Breadcrumbs Header --- */}
      <div className="w-full mx-auto px-6 lg:px-16 py-10 md:py-14 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-4">
            <nav className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              <Link to="/" className="hover:text-[#0978CD] transition-colors">Home</Link>
              <ChevronRight size={14} className="text-slate-300" />
              <span className="text-[#0978CD]">Knowledge Base</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-none tracking-tighter">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0978CD] to-blue-500 italic">Questions.</span>
            </h1>
          </div>

          <div className="w-full max-w-xl relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0978CD] transition-colors" size={20} strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Search help documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 pl-14 pr-6 bg-white border border-slate-100 rounded-2xl focus:border-[#0978CD] outline-none text-sm font-bold text-slate-800 transition-all placeholder:text-slate-300 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
            <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-2xl shadow-indigo-100/20">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 block ml-2">Topic Categories</span>
              <div className="space-y-2">
                {faqData.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => {
                      setActiveCategory(cat.category);
                      setOpenIndex(0);
                    }}
                    className={`w-full text-left px-6 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all ${activeCategory === cat.category
                      ? 'bg-[#0978CD] text-white shadow-xl shadow-indigo-100 translate-x-1'
                      : 'text-slate-400 hover:bg-slate-50 hover:text-[#0978CD]'
                      }`}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>
            </div>

            {/* Support CTA */}
            <div className="p-10 bg-slate-900 text-white relative overflow-hidden rounded-[32px] group shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0978CD] rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-indigo-400" size={24} strokeWidth={2.5} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Expert Help</span>
                </div>
                <h4 className="text-2xl font-black leading-tight tracking-tight italic">Need Personal Assistance?</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">Our specialists are ready to help with your complex expert inquiries.</p>
                <Link to="/contact" className="inline-flex items-center gap-3 bg-[#0978CD] text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/40">
                  Contact Support <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ Accordion Stage */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1.5 h-6 bg-[#0978CD] rounded-full" />
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight italic">
                    {activeCategory}
                  </h3>
                </div>

                {filteredData.find(c => c.category === activeCategory)?.questions.map((faq, idx) => (
                  <div
                    key={idx}
                    className={`bg-white rounded-[32px] border transition-all duration-500 overflow-hidden ${openIndex === idx ? 'border-[#0978CD] shadow-2xl shadow-indigo-100/50' : 'border-slate-100 hover:border-indigo-200'
                      }`}
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                      className="w-full px-10 py-10 flex items-center justify-between text-left group"
                    >
                      <span className={`text-lg font-bold leading-tight pr-12 transition-colors ${openIndex === idx ? 'text-[#0978CD]' : 'text-slate-800 group-hover:text-[#0978CD]'
                        }`}>
                        {faq.q}
                      </span>
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${openIndex === idx ? 'bg-[#0978CD] text-white rotate-180' : 'bg-slate-50 text-slate-300 group-hover:bg-indigo-50 group-hover:text-[#0978CD]'
                        }`}>
                        {openIndex === idx ? <Minus size={20} strokeWidth={3} /> : <Plus size={20} strokeWidth={3} />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {openIndex === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "circOut" }}
                        >
                          <div className="px-10 pb-10">
                            <div className="bg-slate-50 rounded-[24px] p-8 border border-slate-100">
                              <p className="text-slate-500 text-lg font-medium leading-relaxed italic">
                                {faq.a}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {filteredData.length === 0 && (
                  <div className="py-32 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                      <Search size={32} className="text-slate-200" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">No results found</h4>
                    <p className="text-slate-400 font-medium mt-3 text-base">Try broader keywords or browse categories for assistance.</p>
                    <button onClick={() => setSearchQuery('')} className="mt-8 text-[#0978CD] font-black uppercase text-[10px] tracking-widest underline underline-offset-8">Clear Search Filter</button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}

