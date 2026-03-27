import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingCart, Eye, Sparkles, Star, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

const SkeletonSpotlightItem = () => (
  <div className="block py-6 border-b border-slate-100 last:border-0 animate-pulse">
    <div className="flex items-center gap-5">
      <div className="w-[80px] h-[65px] bg-slate-100 rounded-xl shrink-0"></div>
      <div className="min-w-0 flex-1">
        <div className="h-3 w-12 bg-slate-100 rounded mb-2"></div>
        <div className="h-4 w-full bg-slate-100 rounded mb-3"></div>
        <div className="h-3 w-20 bg-slate-100 rounded"></div>
      </div>
    </div>
  </div>
);

const SpotlightBlock = ({ title, icon: Icon, data, colIndex, loading = false }) => {
  const perPage = 3;
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const maxPage = Math.max(0, Math.ceil((data?.length || 0) / perPage) - 1);

  const goPrev = () => {
    setDirection(-1);
    setPage((p) => Math.max(0, p - 1));
  };
  const goNext = () => {
    setDirection(1);
    setPage((p) => Math.min(maxPage, p + 1));
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 30 : -30,
      opacity: 0,
    }),
  };

  const getImagePath = (images) => {
    try {
      const imgs = typeof images === "string" ? JSON.parse(images) : images;
      const first = Array.isArray(imgs) && imgs.length ? imgs[0] : null;
      if (!first) return null;
      const cleaned = String(first).replaceAll("\\", "/");
      return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
    } catch {
      return null;
    }
  };

  const pageItems = (data || []).slice(page * perPage, page * perPage + perPage);

  return (
    <div className={`bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-indigo-100/20 flex flex-col h-full`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-[#0978CD] rounded-xl">
            <Icon size={20} strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={goPrev}
            disabled={page === 0}
            className="h-8 w-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#0978CD] hover:text-white transition-all group"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={goNext}
            disabled={page === maxPage}
            className="h-8 w-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#0978CD] hover:text-white transition-all group"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative min-h-[320px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 400, damping: 35 },
              opacity: { duration: 0.2 }
            }}
            className="space-y-1"
          >
            {loading ? (
              [...Array(3)].map((_, i) => <SkeletonSpotlightItem key={`skel-${i}`} />)
            ) : pageItems.length ? (
              pageItems.map((p) => (
                <div
                  key={p.id}
                  className="group relative flex items-center gap-5 p-4 rounded-2xl hover:bg-indigo-50/50 border border-transparent hover:border-indigo-100/50 transition-all cursor-pointer"
                  onClick={() => navigate(`/product/${p.slug}`)}
                >
                  <div className="w-[80px] h-[65px] bg-white rounded-xl border border-slate-100 p-2 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                    <img
                      src={getImagePath(p.images) || "https://via.placeholder.com/120x90?text=Product"}
                      alt={p.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                      onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/120x90?text=Product"; }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[#0978CD] font-black text-sm mb-1 block">
                      ${Number(p?.price || 0).toLocaleString()}
                    </span>
                    <h4 className="text-[13px] font-bold text-slate-800 line-clamp-1 group-hover:text-[#0978CD] transition-colors">
                      {p.name}
                    </h4>

                    <div className="mt-2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#0978CD] transition-colors"
                      >
                        Add to Cart
                      </button>
                      <span className="w-1 h-1 bg-slate-200 rounded-full" />
                      <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#0978CD] transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-slate-400 text-sm font-bold">No products found.</div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function TripleSpotlightSection({
  newArrivals = [],
  topRated = [],
  popular = [],
  loading = false
}) {
  const normalizeList = (input) => {
    if (Array.isArray(input)) return input;
    if (input && Array.isArray(input.data)) return input.data;
    return [];
  };

  return (
    <section className="font-sans py-20 bg-[#f8fafc]">
      <div className="w-full mx-auto px-4 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <SpotlightBlock
            title="New Arrivals"
            icon={Sparkles}
            data={normalizeList(newArrivals)}
            colIndex={0}
            loading={loading}
          />
          <SpotlightBlock
            title="Top Rated"
            icon={Star}
            data={normalizeList(topRated)}
            colIndex={1}
            loading={loading}
          />
          <SpotlightBlock
            title="Most Popular"
            icon={TrendingUp}
            data={normalizeList(popular)}
            colIndex={2}
            loading={loading}
          />
        </div>
      </div>
    </section>
  );
}
