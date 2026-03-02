import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { motion } from "framer-motion";
import API_BASE_URL from "../config";

import 'swiper/css';
import 'swiper/css/navigation';

export default function BrandStripSlider() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/brands`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setBrands(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching brands:", err);
        setLoading(false);
      });
  }, []);

  if (loading || brands.length === 0) return null;

  return (
    <section className="font-sans py-16 bg-[#f8fafc]">
      <div className="w-full mx-auto px-4 lg:px-16">
        <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-6">
          <div className="space-y-3">
            <span className="text-indigo-600 font-black text-[11px] uppercase tracking-[0.3em]">Industry Leaders</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 italic">brand.</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              id="brand-prev"
              className="h-12 w-12 bg-white border border-slate-200 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm group"
              aria-label="Previous"
            >
              <ChevronLeft size={20} className="group-active:scale-90 transition-transform" />
            </button>
            <button
              id="brand-next"
              className="h-12 w-12 bg-white border border-slate-200 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm group"
              aria-label="Next"
            >
              <ChevronRight size={20} className="group-active:scale-90 transition-transform" />
            </button>
          </div>
        </div>

        <div className="relative">
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={20}
            slidesPerView={2}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            navigation={{
              prevEl: '#brand-prev',
              nextEl: '#brand-next',
            }}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 6 }
            }}
            className="brand-swiper"
          >
            {brands.map((brand, idx) => (
              <SwiperSlide key={brand.id || idx}>
                <motion.div whileHover={{ y: -5 }}>
                  <Link
                    to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                    className="h-32 bg-white border border-slate-100 rounded-[32px] flex items-center justify-center p-8 hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all group"
                  >
                    <img
                      src={
                        brand.logo?.startsWith("http")
                          ? brand.logo
                          : `/${String(brand.logo || "").replaceAll("\\", "/")}`
                      }
                      alt={brand.name}
                      className="max-h-10 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </Link>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
