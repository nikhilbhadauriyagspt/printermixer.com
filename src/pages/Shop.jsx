import { useState, useEffect } from 'react';
import { useSearchParams, Link, useParams, useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import { useCart } from '../context/CartContext';
import {
  Search,
  ChevronDown,
  LayoutGrid,
  List,
  Heart,
  X,
  Loader2,
  SlidersHorizontal,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Eye,
  CheckCircle2,
  Filter,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config';

export default function Shop() {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { category: pathCategory, brand: pathBrand } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(true);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [expandedCategories, setExpandedCategories] = useState({});

  // Filters
  const category = searchParams.get('category') || pathCategory || '';
  const brand = searchParams.get('brand') || pathBrand || '';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(d => {
        if (d.status === 'success') {
          const printers = d.data.find(c => c.slug === 'printers' || c.id === 46);
          setCategories(printers ? printers.children : []);
        }
      });
    fetch(`${API_BASE_URL}/brands`).then(res => res.json()).then(d => setBrands(d.data));
  }, []);

  useEffect(() => {
    if (pathCategory) {
      navigate(`/shop?category=${pathCategory}`, { replace: true });
      return;
    }
    if (pathBrand) {
      navigate(`/shop?brand=${encodeURIComponent(pathBrand)}`, { replace: true });
      return;
    }

    setLoading(true);
    const params = new URLSearchParams(searchParams);
    params.set('limit', '1000');

    fetch(`${API_BASE_URL}/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const filteredProducts = data.data.filter(p =>
            !p.name.toLowerCase().includes('laptop') &&
            !p.name.toLowerCase().includes('macbook') &&
            !p.name.toLowerCase().includes('notebook')
          );
          setProducts(filteredProducts);
          setTotal(filteredProducts.length);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchParams, pathCategory, pathBrand, navigate]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const getImagePath = (images) => {
    try {
      const imgs = typeof images === "string" ? JSON.parse(images) : images;
      return Array.isArray(imgs) && imgs.length > 0 ? `/${imgs[0]}` : "https://via.placeholder.com/600x600?text=Product";
    } catch {
      return "https://via.placeholder.com/600x600?text=Product";
    }
  };

  const toggleCategory = (catId) => {
    setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-900">
      <SEO title="Shop Authorized Printers | Printer Mixer" />

      {category === 'all-in-one-printers' && (
        <div className="w-full">
          <img
            src="/banner/shopbaner.jpg"
            alt="Shop Banner"
            className="w-full h-[900px] object-cover block"
          />
        </div>
      )}

      {/* --- Page Header --- */}
      <div className="bg-white border-b border-slate-100">
        <div className="w-full mx-auto px-6 lg:px-16 py-10 md:py-14">
          <nav className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <ChevronRight size={14} className="text-slate-300" />
            <Link to="/shop" className="hover:text-indigo-600 transition-colors">Catalog</Link>
            {category && (
              <>
                <ChevronRight size={14} className="text-slate-300" />
                <span className="text-indigo-600">{category.replace('-', ' ')}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter capitalize leading-none">
                {category ? category.replace('-', ' ') : brand || 'Store Catalog'}
              </h1>
              <p className="text-slate-500 font-medium text-base max-w-2xl">
                Precision engineering meets modern performance. Discover <span className="text-indigo-600 font-bold">{total}</span> premium solutions.
              </p>
            </div>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 shadow-sm self-start md:self-auto">
              <ShieldCheck size={18} strokeWidth={2.5} />
              <span className="text-[11px] font-black uppercase tracking-widest">Authorized Inventory</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-6 lg:px-16 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* --- Sidebar Filters --- */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-32 space-y-12">

              {/* Category Filter */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-5 bg-indigo-600 rounded-full" />
                  <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em]">Hardware Type</h3>
                </div>

                <div className="space-y-1.5">
                  <button
                    onClick={() => updateFilter('category', '')}
                    className={`w-full text-left px-5 py-3 rounded-2xl text-[13px] font-bold transition-all ${!category ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-indigo-50'}`}
                  >
                    All Collections
                  </button>
                  <div className="space-y-1 mt-2">
                    {categories.map(cat => (
                      <div key={cat.id} className="space-y-1">
                        <div className={`flex items-center justify-between group rounded-2xl transition-all ${category === cat.slug ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-white border border-transparent hover:border-slate-100'}`}>
                          <button
                            onClick={() => updateFilter('category', cat.slug)}
                            className={`flex-1 text-left px-5 py-3 text-[13px] font-bold transition-colors ${category === cat.slug ? 'text-indigo-600' : 'text-slate-500 group-hover:text-indigo-600'}`}
                          >
                            {cat.name}
                          </button>
                          {cat.children && cat.children.length > 0 && (
                            <button onClick={() => toggleCategory(cat.id)} className="p-3 text-slate-300 hover:text-indigo-600">
                              {expandedCategories[cat.id] ? <Minus size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />}
                            </button>
                          )}
                        </div>

                        {expandedCategories[cat.id] && cat.children && (
                          <div className="ml-6 flex flex-col gap-1 py-1 border-l-2 border-slate-50 pl-4 mt-1">
                            {cat.children.map(child => (
                              <button
                                key={child.id}
                                onClick={() => updateFilter('category', child.slug)}
                                className={`text-left py-2 text-[12.5px] font-semibold transition-colors ${category === child.slug ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}
                              >
                                {child.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-5 bg-amber-400 rounded-full" />
                  <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em]">Manufacturers</h3>
                </div>
                <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                  {brands.map(b => (
                    <button
                      key={b.id}
                      onClick={() => updateFilter('brand', brand === b.name ? '' : b.name)}
                      className={`flex items-center justify-between px-5 py-3 rounded-2xl text-[13px] font-bold transition-all border ${brand === b.name ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-600'}`}
                    >
                      <span>{b.name}</span>
                      {brand === b.name && <CheckCircle2 size={14} strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Support CTA */}
              <div className="p-8 bg-slate-900 rounded-[32px] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative z-10 space-y-4">
                  <h4 className="text-xl font-black leading-tight tracking-tight italic">Need Expert Advice?</h4>
                  <p className="text-slate-400 text-[13px] font-medium leading-relaxed">Our hardware specialists are ready to assist you with selection.</p>
                  <Link to="/contact" className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-black/20">
                    Consult Specialist <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* --- Main Content --- */}
          <div className="flex-1">

            {/* Control Strip */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-6">
                <div className="text-[12px] font-black uppercase tracking-[0.1em] text-slate-400">
                  Showing <span className="text-slate-900">{total}</span> Hardware
                </div>
                <div className="h-6 w-px bg-slate-100 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-300 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                    <LayoutGrid size={20} />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-300 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                    <List size={20} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search premium catalog..."
                    value={search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    className="w-full pl-11 pr-5 py-3 bg-slate-50 border border-transparent focus:border-indigo-100 focus:bg-white rounded-xl text-[13px] font-bold text-slate-800 outline-none transition-all"
                  />
                </div>

                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => updateFilter('sort', e.target.value)}
                    className="appearance-none bg-white border border-slate-100 pl-5 pr-12 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest text-slate-700 outline-none cursor-pointer hover:border-indigo-100 transition-colors"
                  >
                    <option value="newest">Latest arrivals</option>
                    <option value="price_low">Price: Low-High</option>
                    <option value="price_high">Price: High-Low</option>
                    <option value="name_asc">Alphabetical</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] mb-10 shadow-xl shadow-indigo-100"
            >
              <Filter size={16} strokeWidth={2.5} /> Refine hardware selection
            </button>

            {/* Grid Display */}
            {loading ? (
              <div className="py-40 flex flex-col items-center justify-center bg-white rounded-[32px] border border-slate-100 shadow-sm">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-6" strokeWidth={3} />
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Scanning inventory...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-32 text-center bg-white rounded-[32px] border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search size={32} className="text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">No hardware found</h3>
                <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 text-base px-6">Adjust your refinement parameters or search keywords to find what you need.</p>
                <button onClick={() => navigate('/shop')} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-100">Reset All Filters</button>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                {products.map((p) => (
                  <motion.div
                    layout
                    key={p.id}
                    className={`group relative flex flex-col h-full bg-white border border-slate-100 rounded-[32px] hover:shadow-2xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all duration-500 ${viewMode === 'list' ? 'sm:flex-row gap-10 items-center p-8' : 'p-6'}`}
                  >
                    {/* Visual Card */}
                    <Link
                      to={`/product/${p.slug}`}
                      className={`relative block overflow-hidden flex-shrink-0 bg-slate-50 group-hover:bg-indigo-50/30 transition-colors rounded-2xl ${viewMode === 'list' ? 'w-full sm:w-64 aspect-square' : 'aspect-square mb-6'}`}
                    >
                      <div className="w-full h-full flex items-center justify-center p-6 transition-transform duration-700 group-hover:scale-110">
                        <img
                          src={getImagePath(p.images)}
                          alt={p.name}
                          className="max-w-full max-h-full object-contain mix-blend-multiply"
                        />
                      </div>

                      <button
                        onClick={(e) => { e.preventDefault(); toggleWishlist(p); }}
                        className={`absolute top-4 right-4 h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center transition-all ${isInWishlist(p.id) ? 'text-red-500' : 'text-slate-300 hover:text-red-500'}`}
                      >
                        <Heart size={20} fill={isInWishlist(p.id) ? "currentColor" : "none"} strokeWidth={2.5} />
                      </button>
                    </Link>

                    {/* Content Section */}
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">{p.brand_name || 'Verified Merchant'}</span>                        <div className="flex gap-1">
                          {[1, 2, 3].map(s => <div key={s} className="w-1 h-1 rounded-full bg-indigo-100" />)}
                        </div>
                      </div>

                      <Link to={`/product/${p.slug}`} className="block mb-4">
                        <h3 className={`font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2 ${viewMode === 'list' ? 'text-2xl' : 'text-[15px] h-10'}`}>
                          {p.name}
                        </h3>
                      </Link>

                      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                        <p className="text-xl font-black text-slate-900 tracking-tight">${parseFloat(p.price).toLocaleString()}</p>
                        <button
                          onClick={(e) => { e.preventDefault(); addToCart(p); }}
                          className="h-12 w-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-90 shadow-xl shadow-indigo-100"
                        >
                          <ShoppingCart size={20} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Mobile Filter Drawer --- */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-slate-900/60 z-[300] backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-[380px] bg-white z-[310] flex flex-col lg:hidden shadow-2xl rounded-l-[40px]"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-tl-[40px]">
                <span className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">Refine hardware.</span>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2.5 bg-white shadow-sm rounded-xl text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Departments</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => { updateFilter('category', cat.slug); setIsMobileFilterOpen(false); }}
                        className={`text-left py-4 px-6 text-sm font-bold rounded-2xl transition-all ${category === cat.slug ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50/50 rounded-bl-[40px]">
                <button
                  onClick={() => { navigate('/shop'); setIsMobileFilterOpen(false); }}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl"
                >
                  Reset selection
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

