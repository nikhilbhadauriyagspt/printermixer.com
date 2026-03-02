import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, ShieldCheck, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function SpecialsPromotions() {
  const IMG = {
    left: "/banner/promo-left.jpg",
    topRight: "/banner/promo-top-right.jpg",
    bottomLeft: "/banner/promo-bottom-left.jpg",
    bottomRight: "/banner/promo-bottom-right.jpg",
  };

  return (
    <section className="font-sans py-20 bg-[#f8fafc]">
      <div className="w-full mx-auto px-4 lg:px-16">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 text-center md:text-left">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Exclusive <span className="text-indigo-600">deals.</span>
            </h2>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Premium Hardware • Certified Supplies • Elite Support</p>
          </div>
          <Link to="/shop" className="px-8 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-[13px] hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm">
            View full inventory
          </Link>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 1. LARGE WIDE CARD (TOP LEFT) */}
          <div className="lg:col-span-2">
            <PromoCard
              image={IMG.left}
              tag="Bestseller"
              title="Enterprise LaserJet Pro"
              subtitle="The gold standard for high-volume office printing."
              price="Starting at $299"
              link="/shop?category=laser-printers"
              height="h-[450px]"
            />
          </div>

          {/* 2. SMALL SQUARE CARD (TOP RIGHT) */}
          <div className="lg:col-span-1">
            <PromoCard
              image={IMG.topRight}
              tag="Save $50"
              title="Smart Tank Series"
              subtitle="Ultra-low cost per page."
              link="/shop?category=supertank-printers"
              height="h-[450px]"
              overlay="strong"
            />
          </div>

          {/* 3. SMALL SQUARE CARD (BOTTOM LEFT) */}
          <div className="lg:col-span-1">
            <PromoCard
              image={IMG.bottomLeft}
              tag="Certified"
              title="Original supplies"
              subtitle="Keep your prints brilliant."
              link="/shop?category=printer-accessories"
              height="h-[450px]"
              overlay="strong"
            />
          </div>

          {/* 4. LARGE WIDE CARD (BOTTOM RIGHT) */}
          <div className="lg:col-span-2">
            <PromoCard
              image={IMG.bottomRight}
              tag="New Tech"
              title="Advanced color solutions"
              subtitle="Precision color for design professionals and studios."
              price="Exclusive partnership"
              link="/shop"
              height="h-[450px]"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

function PromoCard({ image, tag, title, subtitle, price, link, height = "h-full", overlay = "soft" }) {
  const overlayClass =
    overlay === "strong"
      ? "bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"
      : "bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent";

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={`relative overflow-hidden rounded-[40px] group shadow-2xl shadow-indigo-100/30 border border-white ${height}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
        />
      </div>

      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayClass}`} />

      {/* Content */}
      <div className="relative z-10 h-full p-10 flex flex-col justify-end">
        <div className="space-y-4">
          <span className="inline-block px-4 py-1.5 bg-indigo-600/90 backdrop-blur-md text-white text-[11px] font-bold rounded-full shadow-lg">
            {tag}
          </span>
          
          <h3 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
            {title}
          </h3>
          
          <p className="text-slate-300 text-sm md:text-base font-medium max-w-xs leading-relaxed">
            {subtitle}
          </p>

          {price && (
            <p className="text-indigo-400 font-extrabold text-xl tracking-tight">
              {price}
            </p>
          )}

          <div className="pt-4">
            <Link
              to={link}
              className="inline-flex items-center gap-3 text-white text-[14px] font-bold group/link"
            >
              Explore now <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/link:bg-indigo-600 transition-all"><ArrowRight size={14} /></div>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
