import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, Loader2, ShieldCheck, ArrowRight, Zap, MapPin, CheckCircle2, ChevronDown, ChevronUp, Headphones } from 'lucide-react';
import { useCart } from '../context/CartContext';
import API_BASE_URL from '../config';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [printerChildren, setPrinterChildren] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const { showToast } = useCart();

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const printers = data.data.find(c => c.slug === 'printers' || c.id === 46);
          if (printers && printers.children) {
            setPrinterChildren(printers.children);
          }
        }
      });
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (data.status === 'success') {
        showToast(data.message, 'success');
        setEmail('');
      } else {
        showToast(data.message, 'info');
      }
    } catch (err) {
      showToast('Failed to subscribe. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const visibleCategories = showAll ? printerChildren : printerChildren.slice(0, 6);

  return (
    <footer className="bg-[#0f172a] font-sans text-slate-400">

      {/* --- MAIN FOOTER CONTENT --- */}
      <div className="pt-24 pb-16 md:pb-24 border-b border-white/5">
        <div className="w-full mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-20">

            {/* Column 1: Identity */}
            <div className="lg:col-span-4 space-y-10">
              <div className="space-y-8">
                <Link to="/" className="block transition-transform hover:scale-105 origin-left">
                  <img src="/logo/logo.png" alt="Printer Mixer" className="h-10 md:h-12 object-contain brightness-0 invert" />
                </Link>
                <p className="text-slate-400 font-medium leading-relaxed text-[15px] max-w-sm mt-6">
                  Delivering enterprise-grade hardware and specialized expertise to modern workspaces nationwide.
                </p>
              </div>

              <div className="space-y-6 pt-4">
                <div className="flex items-start gap-4 group">
                  <div className="mt-1 p-2 bg-white/5 rounded-lg text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <MapPin size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Corporate HQ</p>
                    <p className="text-[14px] font-bold text-slate-200">N Rosemead Blvd, Pasadena, CA 91107, USA</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="mt-1 p-2 bg-white/5 rounded-lg text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Headphones size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">24/7 Expert Support</p>
                    <p className="text-[14px] font-bold text-slate-200">info@printermixer.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div className="lg:col-span-2 space-y-8">
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Company</h4>
              <ul className="space-y-4">
                {['Home', 'About', 'Shop', 'FAQ', 'Contact Us', 'My Orders'].map((item) => (
                  <li key={item}>
                    <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-[14px] font-bold text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                      <div className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-indigo-400 transition-all" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Printer Solutions */}
            <div className="lg:col-span-3 space-y-8">
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Hardware</h4>
              <div className="flex flex-col gap-4">
                {visibleCategories.map(cat => (
                  <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="text-[14px] font-bold text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                    <div className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-indigo-400 transition-all" />
                    {cat.name}
                  </Link>
                ))}

                {printerChildren.length > 6 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="flex items-center gap-2 text-[11px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors pt-2"
                  >
                    {showAll ? 'Show Less' : `+ ${printerChildren.length - 6} More Series`}
                  </button>
                )}
              </div>
            </div>

            {/* Column 4: Trust & Partner */}
            <div className="lg:col-span-3 space-y-8">
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Transparency</h4>
              <ul className="space-y-4">
                {['Privacy Policy', 'Terms & Conditions', 'Return Policy', 'Shipping Policy'].map((item) => (
                  <li key={item}>
                    <Link to={`/${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="text-[14px] font-bold text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                      <div className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-indigo-400 transition-all" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>


            </div>

          </div>
        </div>
      </div>

      {/* --- COMPLIANCE BAR --- */}
      <div className="py-10 bg-slate-950/50">
        <div className="w-full mx-auto px-6 lg:px-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4 text-center md:text-left">
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                © 2026 Printer Mixer.
              </div>
              <div className="text-[18px] font-medium text-slate-500 max-w-2xl leading-relaxed">
                Disclaimer - For Informational only. No software installation or distribution.
              </div>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8 text-[10px] font-black tracking-widest uppercase">

              <div className="flex items-center gap-6 opacity-30 hover:opacity-100 transition-opacity grayscale invert">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 w-auto" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 w-auto" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Visa_Logo.png" alt="Visa" className="h-3 w-auto" />
              </div>
              <div className="flex items-center gap-2 text-amber-500/60">
                <Zap size={16} className="fill-amber-500/20" /> secure ssl
              </div>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}


