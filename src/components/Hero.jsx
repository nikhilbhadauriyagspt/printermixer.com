import React from "react";
import { ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion } from "framer-motion";

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

// Import assets
import banner1 from "@/assets/bannerr/hero-1.jpg";
import banner2 from "@/assets/bannerr/hero-2.jpg";
import banner3 from "@/assets/bannerr/hero-3.jpg";
import bgRight from "@/assets/bannerr/featured-supplies.jpg";

const slides = [
  {
    image: banner1,
    tag: "Best Selling Printers",
    title: "Upgrade Your Printing Experience",
    subtitle:
      "Explore a wide range of high-performance printers for home and business use. From fast laser models to versatile all-in-one machines, find reliable solutions at competitive prices.",
    color: "text-indigo-400"
  },
  {
    image: banner2,
    tag: "Ink & Toner",
    title: "Reliable Supplies That Deliver",
    subtitle:
      "Keep your printer running smoothly with quality ink cartridges and toner refills. Enjoy sharp text, vibrant colors, and consistent results for everyday printing needs.",
    color: "text-blue-400"
  },
  {
    image: banner3,
    tag: "Fast & Secure Shipping",
    title: "Shop With Confidence Online",
    subtitle:
      "We provide trusted products, secure checkout, and fast nationwide delivery. Upgrade your office setup or restock supplies with ease and complete peace of mind.",
    color: "text-slate-300"
  }
];

export default function Hero() {
  return (
    <div className="w-full bg-[#f8fafc] font-sans">
      <div className="w-full mx-auto px-4 lg:px-16 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 h-[450px] md:h-[550px] lg:h-[600px]">

          {/* LEFT SECTION - MAIN SLIDER (70%) */}
          <div className="lg:w-[70%] relative overflow-hidden rounded-3xl shadow-2xl shadow-indigo-100 bg-white group border border-slate-100">
            <Swiper
              modules={[Autoplay, Pagination, EffectFade]}
              effect="fade"
              speed={1000}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet !w-12 !h-1 !rounded-full !bg-white/30 !opacity-100 !transition-all',
                bulletActiveClass: '!bg-white !w-20'
              }}
              className="h-full w-full"
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-full overflow-hidden">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-105"
                    />
                    {/* Gradient Overlay for Text Visibility */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

                    {/* Text Content */}
                    <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 text-white">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <span className="inline-block px-4 py-1.5 bg-indigo-600 rounded-full text-[10px] font-black  tracking-[0.2em] mb-6">
                          {slide.tag}
                        </span>
                        <h2 className="text-4xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                          {slide.title.split(' ').slice(0, -1).join(' ')} <br />
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-300 italic">{slide.title.split(' ').slice(-1)}</span>
                        </h2>
                        <p className="text-lg text-slate-300 max-w-xl font-medium mb-12 leading-relaxed hidden md:block">
                          {slide.subtitle}
                        </p>
                        <Link
                          to="/shop"
                          className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all group/btn shadow-xl shadow-black/20"
                        >
                          Browse Inventory <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* RIGHT SECTION - FEATURED PROMO (30%) */}
          <div className="lg:w-[30%] relative flex flex-col gap-6">
            {/* Sub-banner Top */}
            <div className="relative flex-1 bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200 group border border-slate-100">
              <img
                src={bgRight}
                alt="Special Offer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

              <div className="absolute bottom-8 left-8 right-8 text-white">

                <h3 className="text-2xl font-extrabold leading-tight mb-4 tracking-tight">
                  Original Ink <br /> & Supplies
                </h3>
                <Link to="/shop" className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all">
                  Browse Inventory <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Simple Trust Strip - Clickable */}
            <Link
              to="/shop"
              className="h-24 bg-indigo-600 rounded-3xl flex items-center px-8 text-white hover:bg-indigo-700 transition-all group shadow-lg shadow-indigo-100/20 active:scale-95"
            >
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Express Hub</p>
                <p className="text-sm font-black uppercase">Priority Dispatch</p>
              </div>
              <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight size={20} />
              </div>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
