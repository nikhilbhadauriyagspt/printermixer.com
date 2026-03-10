import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { useCart } from '../context/CartContext';
import {
  Heart,
  ChevronRight,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Loader2,
  Plus,
  Minus,
  Share2,
  ShoppingCart,
  CheckCircle2,
  ArrowRight,
  Zap,
  Star,
  ArrowLeft,
  Info,
  Package,
  Clock,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config';

export default function ProductDetail() {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('specs');

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`${API_BASE_URL}/products/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setProduct(data.data);

          const categories = data.data.categories || [];
          const categorySlug = categories.length > 0 ? categories[0].slug : '';
          const brand = data.data.brand_name;

          let fetchUrl = `${API_BASE_URL}/products?limit=6`;
          if (categorySlug) fetchUrl += `&category=${categorySlug}`;
          else if (brand) fetchUrl += `&brand=${brand}`;

          fetch(fetchUrl)
            .then(res => res.json())
            .then(relData => {
              if (relData.status === 'success') {
                setRelatedProducts(relData.data.filter(p => p.id !== data.data.id));
              }
            });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const getImages = (images) => {
    try {
      const imgs = typeof images === 'string' ? JSON.parse(images) : images;
      return Array.isArray(imgs) ? imgs.map(img => `/${img}`) : [];
    } catch (e) { return []; }
  };

  const getImagePath = (images) => {
    try {
      const imgs = typeof images === 'string' ? JSON.parse(images) : images;
      if (Array.isArray(imgs) && imgs.length > 0) return `/${imgs[0]}`;
    } catch (e) { }
    return "https://via.placeholder.com/400x400?text=No+Image";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full mb-6"
        />
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Loading details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-[#f8fafc]">
        <div className="w-24 h-24 bg-white rounded-[32px] shadow-xl shadow-indigo-100/50 flex items-center justify-center mb-10 border border-slate-100">
          <Info size={40} className="text-slate-300" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Device Not Found</h2>
        <p className="text-slate-500 mb-12 max-w-md mx-auto text-base font-medium leading-relaxed">The requested hardware could not be located in our catalog.</p>
        <Link to="/shop" className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-100 hover:bg-indigo-700">Return to Catalog</Link>
      </div>
    );
  }

  const images = getImages(product.images);
  const mainImage = images.length > 0 ? images[activeImage] : "https://via.placeholder.com/600x600?text=No+Image";

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-900 pt-4 pb-20">
      <SEO title={product.name} description={product.description?.substring(0, 160)} />

      {/* --- Breadcrumbs --- */}
      <div className="w-full mx-auto px-6 lg:px-16 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <nav className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <ChevronRight size={14} className="text-slate-300" />
            <Link to="/shop" className="hover:text-indigo-600 transition-colors">Catalog</Link>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-indigo-600 truncate max-w-[200px]">{product.name}</span>
          </nav>

          <Link to="/shop" className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={16} /> Back to inventory
          </Link>
        </div>
      </div>

      <div className="w-full mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">

          {/* Left Stage: Visual Gallery */}
          <div className="lg:col-span-6">
            <div className="sticky top-32 space-y-8">
              <div
                className="aspect-square bg-white rounded-[40px] border border-slate-100 flex items-center justify-center p-12 overflow-hidden relative group shadow-2xl shadow-indigo-100/30"
              >
                <img
                  src={mainImage} alt={product.name}
                  className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
                />

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-8 right-8 h-14 w-14 rounded-[20px] shadow-xl flex items-center justify-center transition-all bg-white border border-slate-50 ${isInWishlist(product.id) ? 'text-red-500' : 'text-slate-300 hover:text-red-500'}`}
                >
                  <Heart size={24} fill={isInWishlist(product.id) ? "currentColor" : "none"} strokeWidth={2.5} />
                </button>

                <div className="absolute bottom-8 left-8">
                  <div className="px-5 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-xl shadow-indigo-200">
                    <Zap size={14} className="fill-white" /> Genuine Stock                  </div>
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                  {images.map((img, idx) => (
                    <button
                      key={idx} onClick={() => setActiveImage(idx)}
                      className={`h-28 w-28 rounded-2xl border-2 flex-shrink-0 flex items-center justify-center p-4 transition-all bg-white shadow-sm ${activeImage === idx ? 'border-indigo-600 shadow-indigo-100' : 'border-slate-100 hover:border-indigo-200'}`}
                    >
                      <img src={img} alt="" className="max-w-full max-h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Stage: Info & Actions */}
          <div className="lg:col-span-6">
            <div className="space-y-10 bg-white p-10 md:p-16 rounded-[40px] border border-slate-100 shadow-2xl shadow-indigo-100/30">

              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100 rounded-full">
                    {product.brand_name || 'Official hardware'}
                  </span>
                  <div className="flex items-center gap-2 text-emerald-500 text-[11px] font-black uppercase tracking-widest">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Ready for dispatch
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                  {product.name}
                </h1>

                <div className="flex items-end gap-8 pt-4">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Certified price</p>
                    <p className="text-5xl font-black text-slate-900 tracking-tighter">${parseFloat(product.price).toLocaleString()}</p>
                  </div>
                  {product.sale_price && (
                    <div className="pb-1">
                      <span className="text-xl font-bold text-slate-300 line-through">${product.sale_price}</span>
                      <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mt-1 flex items-center gap-1"><Sparkles size={12} /> Seasonal Offer</p>
                    </div>
                  )}
                </div>

                <div className="mt-10 pt-10 border-t border-slate-50">
                  <p className="text-slate-500 text-lg font-medium leading-relaxed">
                    {product.description || "Enterprise-grade hardware engineered for precision and high-performance throughput. Featuring industry-leading security protocols and specialized efficiency standards."}
                  </p>
                </div>
              </div>

              {/* Purchase Controls */}
              <div className="space-y-8 pt-4">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="h-16 px-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-10 w-full sm:w-auto">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-slate-400 hover:text-indigo-600 transition-colors">
                      <Minus size={20} strokeWidth={3} />
                    </button>
                    <span className="text-xl font-black text-slate-900 min-w-[24px] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                      <Plus size={20} strokeWidth={3} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart} disabled={isAdded}
                    className={`flex-1 h-16 rounded-2xl flex items-center justify-center gap-4 font-black text-[12px] uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-70 shadow-2xl ${isAdded ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'}`}
                  >
                    {isAdded ? <><CheckCircle2 size={22} /> Added to catalog</> : <><ShoppingCart size={20} /> Add to selection</>}
                  </button>
                </div>

                {/* Service Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl flex items-center gap-5 group hover:bg-white hover:border-indigo-100 transition-all duration-500">
                    <div className="h-12 w-12 bg-white text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Truck size={22} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">Rapid delivery</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Certified logistics</p>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl flex items-center gap-5 group hover:bg-white hover:border-indigo-100 transition-all duration-500">
                    <div className="h-12 w-12 bg-white text-amber-500 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-all">
                      <ShieldCheck size={22} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">Full Warranty</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Manufacturer backed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specs Tabs */}
              <div className="pt-12 border-t border-slate-50">
                <div className="flex gap-10 mb-10 border-b border-slate-100">
                  {[
                    { id: 'specs', label: 'Hardware specs' },
                    { id: 'support', label: 'Maintenance' }
                  ].map(tab => (
                    <button
                      key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`pb-5 text-[12px] font-black uppercase tracking-[0.2em] relative transition-all ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {tab.label}
                      {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full" />}
                    </button>
                  ))}
                </div>

                <div className="min-h-[160px]">
                  {activeTab === 'specs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-16">
                      {[
                        { label: "Manufacturer", value: product.brand_name || "Verified Retailer" },                        { label: "Model series", value: product.category_name || "Enterprise" },
                        { label: "Condition", value: "Factory New" },
                        { label: "Expert support", value: "24/7 Expert" }
                      ].map((spec, i) => (
                        <div key={i} className="flex items-center justify-between py-3.5 border-b border-slate-50">
                          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{spec.label}</span>
                          <span className="text-[13px] font-bold text-slate-800">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'support' && (
                    <div className="bg-slate-900 p-10 rounded-[32px] text-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
                      <div className="relative z-10">
                        <h4 className="text-xl font-black mb-4 tracking-tight italic">Expert configuration help.</h4>
                        <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed max-w-sm">Our certified engineering team is available to assist with setup and workflow optimization for your new hardware.</p>
                        <Link to="/contact" className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-widest bg-indigo-600 text-white px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/40">
                          Connect with Support <ExternalLink size={16} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Related Products --- */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-20 border-t border-slate-100">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 text-center md:text-left">
              <div className="space-y-3">
                <span className="text-indigo-600 font-black text-[11px] uppercase tracking-[0.3em]">Hardware combinations</span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
                  Related <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 italic">solutions.</span>
                </h2>
              </div>
              <Link to="/shop" className="group flex items-center gap-3 text-[12px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
                View Full Catalog <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  to={`/product/${p.slug}`}
                  key={p.id}
                  className="group relative flex flex-col bg-white border border-slate-100 p-6 rounded-[32px] hover:shadow-2xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all duration-500"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <div className="aspect-square flex items-center justify-center p-4 mb-6 bg-slate-50 rounded-2xl overflow-hidden group-hover:bg-indigo-50/30 transition-colors">
                    <img src={getImagePath(p.images)} alt="" className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" />
                  </div>
                  <div className="space-y-3">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{p.brand_name || 'Merchant'}</span>                    <h4 className="text-[13px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2 h-8">{p.name}</h4>
                    <p className="text-lg font-black text-slate-900 tracking-tight pt-2 border-t border-slate-50">${parseFloat(p.price).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
