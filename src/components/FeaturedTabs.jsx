import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Printer,
  MousePointer2,
  Eye,
  ShoppingCart,
  Star,
  ShieldCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

export default function FeaturedTabs({ printers = [], accessories = [], loading = false }) {
  const [activeTab, setActiveTab] = useState("printers");
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const tabs = useMemo(
    () => [
      { id: "printers", label: "Printer Hardware", icon: Printer, count: printers.length, data: printers },
      { id: "accessories", label: "Supplies & Ink", icon: MousePointer2, count: accessories.length, data: accessories },
    ],
    [printers.length, accessories.length, printers, accessories]
  );

  const activeData = useMemo(
    () => (tabs.find((t) => t.id === activeTab)?.data || []).slice(0, 15),
    [tabs, activeTab]
  );

  const getImagePath = (images) => {
    try {
      const imgs = typeof images === "string" ? JSON.parse(images) : images;
      return Array.isArray(imgs) && imgs.length > 0
        ? `/${imgs[0]}`
        : "https://via.placeholder.com/600x600?text=Product";
    } catch {
      return "https://via.placeholder.com/600x600?text=Product";
    }
  };

  return (
    <section className="py-20 bg-white font-sans overflow-hidden">
      <div className="w-full mx-auto lg:px-16 px-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <div className="text-center md:text-left space-y-3">
            <span className="text-indigo-600 font-black text-[11px] uppercase tracking-[0.3em]">Handpicked for you</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 italic">Hardware.</span>
            </h2>
          </div>

          {/* Custom Tabs */}
          <div className="flex p-1.5 bg-slate-100 rounded-[20px] shadow-inner">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-3.5 rounded-[16px] text-[13px] font-black uppercase tracking-wider transition-all flex items-center gap-3 ${activeTab === tab.id
                    ? "bg-white text-indigo-600 shadow-xl shadow-indigo-100/50"
                    : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                <tab.icon size={18} strokeWidth={2.5} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slider Controls */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/shop" className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors">
            Explore Store <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center gap-2">
            <button id="feat-prev" className="h-10 w-10 rounded-xl border border-slate-100 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all"><ChevronLeft size={20} /></button>
            <button id="feat-next" className="h-10 w-10 rounded-xl border border-slate-100 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all"><ChevronRight size={20} /></button>
          </div>
        </div>

        {/* Product Slider */}
        <div className="relative">
          <Swiper
            key={activeTab}
            modules={[Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              prevEl: '#feat-prev',
              nextEl: '#feat-next',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
              1440: { slidesPerView: 5 }
            }}
            className="featured-swiper !pb-12"
          >
            {activeData.map((p) => (
              <SwiperSlide key={p.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative bg-slate-50/50 rounded-[32px] p-6 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/50 transition-all h-full flex flex-col"
                >
                  {/* Badge */}
                  <div className="absolute top-6 left-6 z-10">
                    <span className="px-3 py-1 bg-white/80 backdrop-blur-md border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
                      {p.brand_name || 'Original'}
                    </span>
                  </div>

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(p)}
                    className={`absolute top-6 right-6 z-10 p-2.5 rounded-xl transition-all shadow-sm ${isInWishlist(p.id)
                        ? "bg-red-50 text-red-500"
                        : "bg-white text-slate-300 hover:text-red-400"
                      }`}
                  >
                    <Heart size={18} fill={isInWishlist(p.id) ? "currentColor" : "none"} />
                  </button>

                  {/* Image */}
                  <Link
                    to={`/product/${p.slug}`}
                    className="block aspect-square w-full mb-6 p-4 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={getImagePath(p.images)}
                      alt={p.name}
                      className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex flex-col flex-1">


                    <Link to={`/product/${p.slug}`}>
                      <h3 className="text-[15px] font-bold text-slate-800 leading-tight line-clamp-2 h-10 group-hover:text-indigo-600 transition-colors">
                        {p.name}
                      </h3>
                    </Link>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-xl font-black text-slate-900">${parseFloat(p.price || 0).toLocaleString()}</span>
                      <button
                        onClick={() => addToCart(p)}
                        className="h-12 w-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-90"
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
