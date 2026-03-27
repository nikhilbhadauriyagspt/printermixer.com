import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import API_BASE_URL from "../config";

export default function CartDrawer() {
  const { isCartDrawerOpen, closeCartDrawer, cart, removeFromCart, updateQuantity, cartCount } = useCart();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCartDrawer}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1000]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[480px] bg-white z-[1001] shadow-2xl flex flex-col font-sans border-l border-slate-100 rounded-l-[40px] overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Selection.</h2>
                <p className="text-[11px] font-black text-[#0978CD] mt-1 uppercase tracking-widest">{cartCount} items</p>              </div>
              <button
                onClick={closeCartDrawer}
                className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-all border border-slate-100"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
              {cart.length > 0 ? (
                <div className="space-y-8">
                  {cart.map((item) => {
                    const getImagePath = (images) => {
                      try {
                        const imgs = typeof images === "string" ? JSON.parse(images) : images;
                        const first = Array.isArray(imgs) && imgs.length ? imgs[0] : null;
                        if (!first) return "https://via.placeholder.com/150";
                        const cleaned = String(first).replaceAll("\\", "/");
                        return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
                      } catch {
                        return "https://via.placeholder.com/150";
                      }
                    };

                    return (
                      <div key={item.id} className="flex gap-6 group pb-8 border-b border-slate-50 last:border-0 relative">
                        <div className="h-28 w-28 rounded-3xl bg-slate-50 p-4 flex items-center justify-center flex-shrink-0 border border-slate-50 group-hover:bg-indigo-50/30 group-hover:border-indigo-100 transition-all duration-500 overflow-hidden">
                          <img
                            src={getImagePath(item.images)}
                            alt={item.name}
                            className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/100x100?text=Hardware"; }}
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-1 pr-10">
                              <p className="text-[10px] font-black text-[#0978CD] uppercase tracking-widest">{item.brand_name || 'Verified'}</p>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="absolute top-0 right-0 p-2 text-slate-300 hover:text-red-500 transition-colors"
                                title="Remove unit"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            <h3 className="text-[15px] font-bold text-slate-800 leading-tight line-clamp-2 hover:text-[#0978CD] transition-colors">
                              <Link to={`/product/${item.slug}`} onClick={closeCartDrawer}>
                                {item.name}
                              </Link>
                            </h3>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4 bg-slate-50 rounded-xl px-4 py-2 border border-slate-100 shadow-inner">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="text-slate-400 hover:text-[#0978CD] transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={16} strokeWidth={3} />
                              </button>
                              <span className="text-sm font-black min-w-[20px] text-center text-slate-900">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-slate-400 hover:text-[#0978CD] transition-colors"
                              >
                                <Plus size={16} strokeWidth={3} />
                              </button>
                            </div>
                            <span className="text-lg font-black text-slate-900 italic tracking-tight">
                              ${(Number(item.price || 0) * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="h-32 w-32 rounded-[40px] bg-slate-50 flex items-center justify-center mb-10 shadow-inner">
                    <ShoppingBag size={48} className="text-slate-200" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">System cache empty.</h3>
                  <p className="text-slate-500 font-medium max-w-[280px] mb-12 text-base leading-relaxed">Your selection doesn't contain any hardware items at this time.</p>                  <button
                    onClick={closeCartDrawer}
                    className="px-12 py-5 bg-[#0978CD] text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                  >
                    Scan Catalog
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 bg-slate-50/50 border-t border-slate-100 backdrop-blur-md">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Aggregate valuation</span>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase mt-1 flex items-center gap-1">
                      <ShieldCheck size={12} /> Secure Transaction
                    </p>
                  </div>
                  <span className="text-4xl font-black text-slate-900 tracking-tighter italic">${total.toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <Link
                    to="/checkout"
                    onClick={closeCartDrawer}
                    className="w-full h-16 bg-[#0978CD] text-white rounded-2xl flex items-center justify-center gap-4 font-black text-[11px] uppercase tracking-[0.25em] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 group active:scale-95"
                  >
                    Authenticate Checkout
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/cart"
                    onClick={closeCartDrawer}
                    className="w-full h-16 bg-white text-slate-900 border border-slate-200 rounded-2xl flex items-center justify-center font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                  >
                    View Selection
                  </Link>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Lock size={12} /> Hardware-level 256-bit encryption active
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
