import React from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { ShieldCheck, Zap, Heart, Globe, Award, Printer, Package, Wrench, Leaf, ChevronRight, CheckCircle2, Headphones, Sparkles, Target, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import banner1 from "@/assets/bannerr/about.png";

export default function About() {
  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-900 pb-20 pt-4">
      <SEO
        title="About Us | Our Mission & Partnership"
        description="Learn about our commitment to excellence, our journey, and the core pillars that drive our specialized hardware services."
      />

      {/* --- Breadcrumbs Header --- */}
      <div className="w-full mx-auto px-6 lg:px-16 py-10 md:py-14 mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-600">
              <div className="w-1.5 h-5 bg-indigo-600 rounded-full" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Our Story</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-none tracking-tighter">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 italic">Us.</span>
            </h1>
          </div>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm self-center md:self-auto">
            <ShieldCheck size={18} className="text-indigo-600" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-6 lg:px-16 space-y-24">

        {/* --- Section 1: The Vision --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white p-8 md:p-16 rounded-[40px] border border-slate-100 shadow-2xl shadow-indigo-100/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] -ml-32 -mt-32 opacity-60" />

          <div className="lg:col-span-7 space-y-10 relative z-10">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight italic">Built on trust <br /> and precision.</h2>
              <div className="w-16 h-1.5 bg-indigo-600 rounded-full" />
            </div>
            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
              Founded in 2026, Printer Mixer was established to solve a singular challenge: making the acquisition of high-performance printing infrastructure simple, transparent, and absolutely authentic. We bridge the gap between complex industrial solutions and a seamless, personalized experience.
            </p>
          </div>
          <div className="lg:col-span-5 relative z-10">
            <div className="relative aspect-square rounded-[32px] overflow-hidden border border-slate-100 shadow-2xl group">
              <img src={banner1} alt="Hardware Distribution" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-indigo-900/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          </div>
        </div>

        {/* --- Section 2: Core Capabilities --- */}
        <section className="space-y-16">
          <div className="flex flex-col items-center text-center gap-4">
            <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em]">Operational Scope</span>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter italic">Our core capabilities.</h2>
            <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2  gap-8">
            {[
              { icon: Printer, title: "Hardware Deployment", desc: "Expert selection of LaserJet, All-in-One, and high-volume industrial systems tailored for your specialized business needs." },
              { icon: Headphones, title: "Specialist Support", desc: "Factory-trained specialists providing troubleshooting, installation guidance, and long-term hardware maintenance protocols." }
            ].map((item, i) => (
              <motion.div
                key={i} whileHover={{ y: -8 }}
                className="p-12 bg-white border border-slate-100 rounded-[40px] shadow-xl shadow-indigo-100/20 group transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-100 transition-colors" />
                <div className="h-16 w-16 rounded-[20px] bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 mb-10 shadow-sm relative z-10">
                  <item.icon size={28} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 relative z-10 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 font-medium text-base leading-relaxed relative z-10">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- Section 3: Values Module --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-12 md:p-20 bg-slate-900 text-white space-y-10 relative overflow-hidden rounded-[40px] shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[120px] -mr-40 -mt-40 opacity-20" />
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3">
                <Target className="text-indigo-400" size={24} strokeWidth={2.5} />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Our Mission</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tighter italic">The customer <br /> standard.</h3>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                To empower professionals with reliable, efficient, and sustainable hardware solutions through original products and certified advice. We believe in hardware that works as hard as you do.
              </p>
            </div>
          </div>

          <div className="p-12 md:p-20 bg-white border border-slate-100 text-slate-900 space-y-10 relative overflow-hidden rounded-[40px] shadow-2xl shadow-indigo-100/20">
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] -ml-32 -mt-32 opacity-60" />
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3">
                <Users className="text-indigo-600" size={24} strokeWidth={2.5} />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Our Community</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tighter italic">Nationwide <br /> reach.</h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md">
                Expanding across the United States to deliver professional hardware with unmatched logistics and long-term service value. Our network ensures you are never without expert support.
              </p>
            </div>
          </div>
        </div>

        {/* --- Section 4: Advantage Grid --- */}
        <div className="bg-white p-10 md:p-20 rounded-[40px] border border-slate-100 shadow-2xl shadow-indigo-100/20 relative overflow-hidden mb-20">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] -mr-48 -mb-48 opacity-60" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 relative z-10">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">The Printer Mixer Advantage.</h2>
              <p className="text-slate-400 text-[13px] font-black uppercase tracking-[0.2em]">Certified hardware ecosystem benefits</p>
            </div>
            <Link to="/shop" className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 hover:text-indigo-700 transition-colors">
              Explore Inventory <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12 relative z-10">
            {[
              { title: "Authorized Status", icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
              { title: "Genuine Supplies", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
              { title: "Hardware Service", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
              { title: "Safe Logistics", icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50" },
              { title: "Original Hardware", icon: CheckCircle2, color: "text-indigo-600", bg: "bg-indigo-50" },
              { title: "Service Center", icon: Headphones, color: "text-blue-600", bg: "bg-blue-50" },
              { title: "Sustainable Solutions", icon: Leaf, color: "text-emerald-600", bg: "bg-emerald-50" },
              { title: "Professional Hub", icon: Wrench, color: "text-slate-600", bg: "bg-slate-50" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5 group">
                <div className={`h-14 w-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-500 shadow-sm`}>
                  <item.icon size={22} strokeWidth={2.5} />
                </div>
                <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{item.title}</h4>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

