import { Link } from "react-router-dom";
import { ArrowRight, Printer, Zap, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

export default function ShopByCategoryGrid({ categories = [] }) {
  const printerParent = categories.find(
    (c) => c.slug === "printers" || c.id === 46
  );
  const displayCategories = printerParent?.children || [];

  const getImagePath = (image) => {
    if (!image) return null;
    return image.startsWith("/") ? image : `/${image}`;
  };

  const getIcon = (slug) => {
    if (slug.includes('laser')) return <Zap size={20} />;
    if (slug.includes('all-in-one')) return <LayoutGrid size={20} />;
    return <Printer size={20} />;
  };

  if (!displayCategories.length) return null;

  return (
    <section className="font-sans py-16 bg-[#f8fafc]">
      <div className="w-full mx-auto px-4 lg:px-16">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-[#0978CD] font-black text-[11px] uppercase tracking-[0.3em]">Hardware Categories</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0978CD] to-blue-500 italic">Industry.</span>
            </h2>
          </div>
          <Link to="/shop" className="group flex items-center gap-3 text-[12px] font-black uppercase tracking-widest text-slate-400 hover:text-[#0978CD] transition-colors">
            View All Series <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.slice(0, 8).map((cat, idx) => (
            <motion.div
              key={cat.id || idx}
              whileHover={{ y: -8 }}
              className="group relative bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-indigo-100/20 overflow-hidden flex flex-col h-full"
            >
              {/* Background Decor */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-100/50 transition-colors" />

              {/* Image Section */}
              <Link
                to={`/shop?category=${cat.slug}`}
                className="relative aspect-[4/3] w-full mb-8 flex items-center justify-center rounded-2xl bg-slate-50 group-hover:bg-indigo-50/30 transition-colors p-6"
              >
                <img
                  src={cat.image ? getImagePath(cat.image) : `https://ui-avatars.com/api/?name=${encodeURIComponent(cat.name || 'C')}&background=f1f5f9&color=4f46e5&bold=true&size=128`}
                  alt={cat.name}
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                />
              </Link>

              {/* Text Section */}
              <div className="relative z-10 flex flex-col flex-1">


                <h3 className="text-xl font-black text-slate-900 leading-tight mb-4 group-hover:text-[#0978CD] transition-colors">
                  {cat.name}
                </h3>

                <div className="mt-auto">
                  <Link
                    to={`/shop?category=${cat.slug}`}
                    className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#0978CD] transition-all"
                  >
                    Explore Hardware <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
