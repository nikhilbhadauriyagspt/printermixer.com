import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '@/components/SEO';
import { Mail, MapPin, Send, MessageCircle, ArrowRight, Loader2, CheckCircle2, ChevronRight, Headphones, Phone, ChevronDown, Info, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.status === 'success') {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-900 pb-20 pt-4">
      <SEO
        title="Contact Us | Expert Technical Support"
        description="Connect with the Primeprintshop team for technical support, bulk orders, or authorized hardware inquiries."
      />

      {/* --- Breadcrumbs Header --- */}
      <div className="w-full mx-auto px-6 lg:px-16 py-10 md:py-14 mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-600">
              <div className="w-1.5 h-5 bg-indigo-600 rounded-full" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Connect With Us</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-none tracking-tighter">
              Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 italic">Touch.</span>
            </h1>
          </div>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm self-center md:self-auto">
            <Headphones size={18} className="text-indigo-600" strokeWidth={2.5} />
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Expert Support Available</span>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
            <motion.div
              whileHover={{ y: -5 }}
              className="p-10 bg-white border border-slate-100 rounded-[40px] shadow-2xl shadow-indigo-100/20 group transition-all"
            >
              <div className="h-16 w-16 rounded-[20px] bg-indigo-50 flex items-center justify-center mb-10 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <Mail size={28} strokeWidth={2.5} />
              </div>
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Email Support</h4>
              <p className="text-xl font-black text-slate-900 tracking-tight italic">info@primeprintshop.shop</p>
              <p className="text-[12px] font-bold text-slate-400 mt-4 leading-relaxed">Expert response protocols active. Expect feedback within 24 hours.</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-10 bg-white border border-slate-100 rounded-[40px] shadow-2xl shadow-indigo-100/20 group transition-all"
            >
              <div className="h-16 w-16 rounded-[20px] bg-indigo-50 flex items-center justify-center mb-10 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <MapPin size={28} strokeWidth={2.5} />
              </div>
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Office Location</h4>
              <p className="text-xl font-black text-slate-900 tracking-tight italic">Pasadena, CA</p>
              <p className="text-[12px] font-bold text-slate-400 mt-4 leading-relaxed">N Rosemead Blvd, Pasadena, CA 91107, USA</p>
            </motion.div>

            <div className="p-8 bg-slate-900 rounded-[32px] text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative z-10 flex items-center gap-5">
                <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={24} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Certified Hub</p>
                  <p className="text-[13px] font-bold text-slate-300">HP Authorized Partner</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Stage */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-100 rounded-[40px] p-8 md:p-16 shadow-2xl shadow-indigo-100/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[100px] -mr-40 -mt-40 opacity-50" />

              <div className="relative z-10">
                {status === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="h-24 w-24 rounded-[32px] bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-10 shadow-sm border border-emerald-100">
                      <CheckCircle2 size={48} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Transmission Successful.</h2>
                    <p className="text-slate-500 font-medium text-lg mb-12 max-w-md mx-auto leading-relaxed">A specialist has been assigned to your case and will initiate contact shortly.</p>
                    <button onClick={() => setStatus(null)} className="px-12 py-5 bg-indigo-600 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">Initiate New Inquiry</button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Identification Name</label>
                        <input
                          required type="text" placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none text-sm font-bold text-slate-800 transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Return Email Address</label>
                        <input
                          required type="email" placeholder="Email for specialized reply"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none text-sm font-bold text-slate-800 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Communication Link</label>
                        <input
                          type="tel" placeholder="+1 (000) 000-0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none text-sm font-bold text-slate-800 transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Case Subject</label>
                        <div className="relative group">
                          <select
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none text-sm font-bold text-slate-800 transition-all appearance-none cursor-pointer"
                          >
                            <option>General Inquiry</option>
                            <option>Technical Support</option>
                            <option>Order Tracking</option>
                            <option>Bulk Hardware Quotes</option>
                            <option>Warranty Assistance</option>
                          </select>
                          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-600" size={20} strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Transmission Details</label>
                      <textarea
                        required rows="6" placeholder="Describe your technical requirements or inquiry details..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[32px] focus:bg-white focus:border-indigo-600 outline-none text-sm font-bold text-slate-800 transition-all resize-none"
                      ></textarea>
                    </div>

                    <div className="pt-4">
                      <button
                        disabled={loading}
                        className="w-full h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50 group"
                      >
                        {loading ? <Loader2 className="animate-spin" size={24} strokeWidth={3} /> : <><Send size={20} strokeWidth={2.5} /> Transmit Message <ArrowRight size={20} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" /></>}
                      </button>
                    </div>
                    {status === 'error' && (
                      <div className="flex items-center justify-center gap-2 text-red-500">
                        <Info size={14} />
                        <p className="text-[10px] font-black uppercase tracking-widest">Transmission Error. Please verify connection.</p>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}


