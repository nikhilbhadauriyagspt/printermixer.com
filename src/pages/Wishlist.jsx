import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ChevronLeft, ChevronRight, Sparkles, ShoppingCart, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart, wishlistCount } = useCart();

  const getImagePath = (images) => {
    try {
      const imgs = typeof images === 'string' ? JSON.parse(images) : images;
      if (Array.isArray(imgs) && imgs.length > 0) return `/${imgs[0]}`;
    } catch (e) { }
    return "https://via.placeholder.com/400x400?text=No+Image";
  };

  if (wishlistCount === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#f8fafc] font-sans text-center">
        <div className="h-32 w-32 rounded-[40px] bg-white flex items-center justify-center mb-10 shadow-2xl shadow-indigo-100 border border-slate-100">
          <Heart size={48} className="text-slate-200" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">Your Wishlist Is Empty</h2>
        <p className="text-slate-500 font-medium text-base mb-12 max-w-md leading-relaxed">Save your favorite hardware units here for future acquisition.</p>
        <Link to="/shop" className="px-12 py-5 bg-[#0978CD] text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-20 pt-4">

      {/* --- Breadcrumbs Header --- */}
      <div className="w-full mx-auto px-6 lg:px-16 py-10 md:py-14 mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#0978CD]">
              <div className="w-1.5 h-5 bg-[#0978CD] rounded-full" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Saved Hardware</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-none tracking-tighter">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0978CD] to-blue-500 italic">Favorites List.</span>
            </h1>
          </div>
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm self-center md:self-auto">
            <span className="text-slate-900 font-black">{wishlistCount}</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Reserved Units</span>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {wishlist.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative flex flex-col bg-white border border-slate-100 p-8 rounded-[40px] hover:shadow-2xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all duration-500"
              >
                <div className="relative aspect-square flex items-center justify-center mb-8 bg-slate-50 rounded-[32px] overflow-hidden group-hover:bg-indigo-50/30 transition-colors">
                  <button
                    onClick={() => toggleWishlist(p)}
                    className="absolute top-4 right-4 h-11 w-11 bg-white text-slate-300 rounded-2xl shadow-sm flex items-center justify-center z-10 hover:text-red-500 transition-all active:scale-90"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={20} strokeWidth={2.5} />
                  </button>

                  <Link to={`/product/${p.slug}`} className="w-full h-full flex items-center justify-center p-6 transition-transform duration-700 group-hover:scale-110">
                    <img
                      src={getImagePath(p.images)}
                      alt={p.name}
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                    />
                  </Link>

                  <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => addToCart(p)}
                      className="w-full h-14 bg-[#0978CD] text-white rounded-[20px] flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 hover:bg-indigo-700"
                    >
                      <ShoppingCart size={18} strokeWidth={2.5} /> Add to Cart
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#0978CD] uppercase tracking-[0.2em]">{p.brand_name || 'Verified'}</span>
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <Link to={`/product/${p.slug}`}>
                    <h3 className="text-[15px] font-bold text-slate-800 group-hover:text-[#0978CD] transition-colors leading-tight line-clamp-2 h-10">{p.name}</h3>
                  </Link>
                  <p className="text-2xl font-black text-slate-900 tracking-tight pt-4 border-t border-slate-50 italic">${parseFloat(p.price).toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-20 pt-12 border-t border-slate-100">
          <Link to="/shop" className="group inline-flex items-center gap-3 text-[11px] font-black text-slate-400 hover:text-[#0978CD] transition-all uppercase tracking-[0.25em]">
            <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-[#0978CD] transition-all">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            Back to store inventory
          </Link>
        </div>
      </div>
    </div>
  );
}
