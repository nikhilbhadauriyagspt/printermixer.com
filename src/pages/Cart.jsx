import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, ShieldCheck, Zap, ChevronLeft, Package, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartCount } = useCart();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#f8fafc] font-sans text-center">
        <div className="h-32 w-32 rounded-[40px] bg-white flex items-center justify-center mb-10 shadow-2xl shadow-indigo-100 border border-slate-100">
          <ShoppingCart size={48} className="text-slate-200" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Your Cart Is Empty</h2>
        <p className="text-slate-500 font-medium text-base mb-12 max-w-md leading-relaxed">You haven't added any authorized hardware to your selection yet.</p>
        <Link to="/shop" className="px-12 py-5 bg-indigo-600 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-20 pt-4">
      
      {/* --- Breadcrumbs --- */}
      <div className="w-full mx-auto px-6 lg:px-16 py-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-600">
              <div className="w-1.5 h-5 bg-indigo-600 rounded-full" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Order Review</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-none tracking-tighter">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 italic">Shopping Cart.</span>
            </h1>
          </div>
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm self-center md:self-auto">
            <span className="text-slate-900 font-black">{cartCount}</span> 
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Items In Selection</span>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-20">

          {/* Cart Items */}
          <div className="xl:col-span-8 space-y-6">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-[32px] border border-slate-100 p-8 flex flex-col sm:flex-row items-center gap-10 group hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500"
                >
                  <Link to={`/product/${item.slug}`} className="h-44 w-44 rounded-3xl bg-slate-50 p-8 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-50/30 transition-colors duration-500 overflow-hidden">
                    <img
                      src={item.images ? `${(typeof item.images === 'string' ? JSON.parse(item.images)[0] : item.images[0])}` : ''}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/150x150?text=Hardware"; }}
                    />
                  </Link>

                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-col mb-8">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2">{item.brand_name || 'Verified hardware'}</span>
                      <Link to={`/product/${item.slug}`}>
                        <h3 className="text-2xl font-bold text-slate-800 hover:text-indigo-600 transition-colors leading-tight line-clamp-2">{item.name}</h3>
                      </Link>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-8 border-t border-slate-50 pt-8">
                      <div className="flex items-center gap-12">
                        <div className="h-14 px-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-8">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-slate-400 hover:text-indigo-600 transition-colors"><Minus size={18} strokeWidth={3} /></button>
                          <span className="text-lg font-black text-slate-900 w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-slate-400 hover:text-indigo-600 transition-colors"><Plus size={18} strokeWidth={3} /></button>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Unit Price</span>
                          <span className="text-2xl font-black text-slate-900 tracking-tight italic">${item.price.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-10">
                        <div className="space-y-1 text-right">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Total</span>
                          <span className="text-3xl font-black text-indigo-600 tracking-tighter">${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                        <div className="h-12 w-px bg-slate-100 hidden sm:block" />
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="h-12 w-12 text-slate-300 bg-slate-50 rounded-2xl flex items-center justify-center hover:text-red-500 hover:bg-red-50 transition-all"
                          aria-label="Remove item"
                        >
                          <Trash2 size={22} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link to="/shop" className="group inline-flex items-center gap-3 text-[11px] font-black text-slate-400 hover:text-indigo-600 transition-all pt-12 uppercase tracking-[0.25em]">
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-indigo-600 transition-all">
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              </div>
              Continue Shopping
            </Link>
          </div>

          {/* Summary Module */}
          <div className="xl:col-span-4">
            <div className="bg-white rounded-[40px] p-10 lg:p-14 text-slate-900 border border-slate-100 shadow-2xl shadow-indigo-100/30 sticky top-32">
              <div className="flex items-center gap-5 mb-12 pb-10 border-b border-slate-50">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[20px] flex items-center justify-center shadow-sm">
                   <Package size={26} strokeWidth={2.5} />
                </div>
                <div>
                   <h3 className="text-sm font-black uppercase tracking-[0.2em]">Order Summary</h3>
                   <p className="text-[11px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Authorized Transaction</p>
                </div>
              </div>

              <div className="space-y-8 mb-12">
                <div className="flex justify-between items-center pb-8 border-b border-slate-50">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Subtotal</span>
                  <span className="text-xl font-bold text-slate-900 tracking-tight italic">${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-8 border-b border-slate-50">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Logistics</span>
                  <span className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-4 py-1.5 border border-indigo-100 rounded-full tracking-widest">Next-Day Ship</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-[12px] font-black uppercase tracking-[0.25em] text-slate-900">Grand Total</span>
                  <span className="text-5xl font-black text-indigo-600 leading-none tracking-tighter italic">${total.toLocaleString()}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.25em] transition-all shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 group"
              >
                Proceed to Checkout
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="mt-12 pt-10 border-t border-slate-50 space-y-8">
                <div className="flex items-center gap-5 text-slate-400">
                  <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
                    <ShieldCheck size={24} className="text-indigo-600" />
                  </div>
                  <p className="text-[11px] font-bold leading-relaxed uppercase tracking-wider">
                    HP Authorized Merchant. Your purchase is protected by brand warranty protocols.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
