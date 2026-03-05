import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import API_BASE_URL from '../config';
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Headphones,
  Truck,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function Header() {
  const { cartCount, wishlistCount, openCartDrawer, cartTotal, openSearch } = useCart();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const catWrapRef = useRef(null);   // wrapper (button + dropdown)
  const catBtnRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);

    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') setCategories(data.data);
      })
      .catch(err => console.error(err));

    fetch(`${API_BASE_URL}/products?limit=8`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') setFeaturedProducts(data.data);
      })
      .catch(err => console.error(err));

    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    checkUser();
    window.addEventListener('storage', checkUser);

    const handleClickOutside = (e) => {
      if (catWrapRef.current && !catWrapRef.current.contains(e.target)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkUser);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { name: 'SHOP', path: '/shop' },
    { name: 'PRODUCTS', path: '/shop', hasSubmenu: true },
    { name: 'FAQ', path: '/faq' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <header
      className={`w-full fixed top-0 left-0 z-[150] bg-white font-sans transition-all duration-300 ${scrolled ? 'shadow-xl' : 'shadow-none border-b border-slate-100'
        }`}
    >
      {/* 1. TOP ANNOUNCEMENT BAR (Sleek & Minimal) */}
      <div className="bg-indigo-600 py-2 hidden md:block">
        <div className="w-full mx-auto px-16 flex justify-between items-center text-[11px] font-bold text-white uppercase tracking-[0.1em]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Truck size={14} /> Free Express Shipping</span>
            <span className="w-px h-3 bg-indigo-400" />
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Genuine HP Partner</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-indigo-200 transition-colors">Support</Link>
            <Link to="/faq" className="hover:text-indigo-200 transition-colors">Help Center</Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Logo | Search | Icons) */}
      <div className="w-full mx-auto px-16 py-5 flex items-center justify-between gap-12">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 transition-transform active:scale-95">
          <img
            src="/logo/logo.png"
            alt="Printer Mixer"
            className="h-10 md:h-12 object-contain"
          />
        </Link>

        {/* Massive Search Centerpiece */}
        <div className="flex-1 max-w-3xl relative hidden md:block">
          <div className="relative group">
            <input
              type="text"
              onClick={openSearch}
              readOnly
              placeholder="Search for premium printers, ink tanks, toners..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-12 py-3.5 text-sm font-semibold text-slate-800 cursor-text group-hover:bg-white group-hover:border-indigo-200 group-hover:shadow-lg group-hover:shadow-indigo-50 transition-all outline-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-600 transition-colors" size={20} />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="hidden lg:block text-[10px] font-bold text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded bg-white">Ctrl + K</span>
            </div>
          </div>
        </div>

        {/* User Action Center */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative group">
            <Link
              to={user ? '/profile' : '/login'}
              className="flex flex-col items-center p-1.5 cursor-pointer"
            >
              <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                <User size={22} strokeWidth={1.5} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase group-hover:text-indigo-600 transition-colors">Account</span>
            </Link>

            {/* Account Dropdown on Hover */}
            {user && (
              <div className="absolute top-full right-0 mt-2 w-52 bg-white shadow-2xl rounded-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[200] p-2 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-50 mb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Signed in as</p>
                  <p className="text-[13px] font-black text-slate-800 truncate">{user.name || 'User'}</p>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2.5 text-[13px] font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  className="block px-4 py-2.5 text-[13px] font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                >
                  Orders History
                </Link>
                <div className="h-px bg-slate-50 my-1 mx-2" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center gap-2"
                >
                  <X size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>

          <Link
            to="/wishlist"
            className="flex flex-col items-center group p-1.5 relative"
          >
            <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
              <Heart size={22} strokeWidth={1.5} />
            </div>
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 h-5 w-5 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                {wishlistCount}
              </span>
            )}
            <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase group-hover:text-indigo-600 transition-colors">Saved</span>
          </Link>

          <button
            onClick={openCartDrawer}
            className="flex flex-col items-center group p-1.5 relative"
          >
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl group-hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              <ShoppingCart size={22} strokeWidth={1.5} />
            </div>
            <span className="absolute top-1 right-1 h-5 w-5 bg-white text-indigo-600 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-indigo-600">
              {cartCount}
            </span>
            <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase group-hover:text-indigo-600 transition-colors">Cart</span>
          </button>

          <button
            className="lg:hidden p-2.5 text-slate-600 bg-slate-50 rounded-xl"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* 3. NAVIGATION STRIP (Category | Nav Links | Support) */}
      <div className="border-t border-slate-100 hidden lg:block bg-slate-50/50 backdrop-blur-md">
        <div className="w-full mx-auto px-16 flex items-center justify-between">

          <div className="flex items-center gap-10">
            {/* Unique Category Trigger */}
            <div
              ref={catWrapRef}
              className="relative"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <button
                ref={catBtnRef}
                className={`flex items-center gap-3 px-6 py-4 bg-white border-x border-slate-100 font-black text-[13px] uppercase tracking-wider transition-all ${isCategoryOpen ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-800'}`}
              >
                <div className="flex flex-col gap-1 w-4">
                  <span className={`h-0.5 w-full bg-current transition-all ${isCategoryOpen ? 'w-full' : 'w-full'}`} />
                  <span className={`h-0.5 w-full bg-current transition-all ${isCategoryOpen ? 'w-1/2' : 'w-full'}`} />
                  <span className={`h-0.5 w-full bg-current transition-all ${isCategoryOpen ? 'w-3/4' : 'w-full'}`} />
                </div>
                Shop All Collections
              </button>

              {/* Dropdown with Modern Animation */}
              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    className="absolute left-0 top-full w-[320px] bg-white shadow-2xl border border-slate-100 z-[200] py-4 rounded-b-2xl overflow-hidden"
                  >
                    <div className="max-h-[70vh] overflow-y-auto px-2 custom-scrollbar">
                      {categories.filter(cat => cat.name.toLowerCase().includes('printer')).map((cat) => (
                        <div key={cat.id} className="mb-2 last:mb-0">
                          <Link
                            to={`/shop?category=${cat.slug}`}
                            onClick={() => setIsCategoryOpen(false)}
                            className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-indigo-50 group/cat transition-all"
                          >
                            <span className="text-[14px] font-black text-slate-800 group-hover/cat:text-indigo-600 uppercase tracking-tight">{cat.name}</span>
                            <ChevronRight size={14} className="text-slate-300 group-hover/cat:translate-x-1 transition-all" />
                          </Link>

                          {/* Render Children (Sub-categories) */}
                          {cat.children && cat.children.length > 0 && (
                            <div className="mt-1 ml-4 space-y-1 border-l-2 border-slate-50 pl-2">
                              {cat.children.map(child => (
                                <Link
                                  key={child.id}
                                  to={`/shop?category=${child.slug}`}
                                  onClick={() => setIsCategoryOpen(false)}
                                  className="block px-4 py-1.5 text-[13px] font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/30 rounded-lg transition-all"
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Nav Links */}
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group py-4">
                  <Link
                    to={link.path}
                    className={`text-[13px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 ${location.pathname === link.path ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
                  >
                    {link.name}
                    {link.hasSubmenu && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />}
                  </Link>

                  {/* Mega Menu logic can be simplified or enhanced here */}
                  {link.hasSubmenu && link.name === 'PRODUCTS' && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[850px] bg-white shadow-2xl rounded-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-10 px-10 z-[200] grid grid-cols-3 gap-12">
                      {/* Categories Column */}
                      <div className="space-y-6 max-h-[450px] overflow-y-auto pr-4 custom-scrollbar">
                        <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Hardware Catalog</h4>
                        <div className="flex flex-col gap-6">
                          {categories.filter(cat => cat.name.toLowerCase().includes('printer')).map(cat => (
                            <div key={cat.id} className="space-y-2.5">
                              <Link
                                to={`/shop?category=${cat.slug}`}
                                className="text-[14px] font-black text-slate-900 hover:text-indigo-600 transition-all flex items-center gap-2"
                              >
                                {cat.name}
                              </Link>

                              {/* Sub-categories */}
                              {cat.children && cat.children.length > 0 && (
                                <div className="ml-3 flex flex-col gap-2 border-l border-slate-100 pl-3">
                                  {cat.children.map(child => (
                                    <Link
                                      key={child.id}
                                      to={`/shop?category=${child.slug}`}
                                      className="text-[13px] font-bold text-slate-500 hover:text-indigo-600 transition-all"
                                    >
                                      {child.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Featured Column (Larger) */}
                      <div className="col-span-2 bg-slate-50/50 rounded-3xl p-8 flex flex-col justify-center border border-slate-100 overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Featured Arrivals</h4>
                          <Link to="/shop" className="text-[11px] font-bold text-indigo-600 hover:underline tracking-wider">Explore Full Catalog →</Link>
                        </div>

                        <Swiper
                          modules={[Autoplay, FreeMode]}
                          spaceBetween={20}
                          slidesPerView={2.2}
                          freeMode={true}
                          autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                          }}
                          className="w-full"
                        >
                          {featuredProducts.map(p => (
                            <SwiperSlide key={p.id}>
                              <Link to={`/product/${p.slug}`} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 hover:shadow-indigo-100/30 transition-all flex flex-col gap-4 group/prod h-full">
                                <div className="aspect-square w-full bg-slate-50 rounded-xl p-4 flex items-center justify-center group-hover/prod:scale-105 transition-transform">
                                  <img src={p.images ? (typeof p.images === 'string' ? JSON.parse(p.images)[0] : p.images[0]) : ''} alt="" className="max-w-full max-h-full object-contain" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[13px] font-bold text-slate-800 line-clamp-2 group-hover/prod:text-indigo-600 transition-colors leading-tight h-8">{p.name}</p>
                                  <p className="text-[15px] font-black text-indigo-600 mt-2">${p.price}</p>
                                </div>
                              </Link>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Expert Support CTA */}
          <div className="flex items-center gap-6">
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Support Mail</p>
                <p className="text-[13px] font-black text-slate-900 mt-1 hover:text-indigo-600 transition-colors cursor-pointer">info@printermixer.com</p>
              </div>
              <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center animate-pulse">
                <Mail size={20} strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[380px] bg-white z-[210] flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b flex items-center justify-between bg-slate-50/50">
                <img
                  src="/logo/logo.png"
                  alt="Logo"
                  className="h-9 object-contain"
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:bg-white rounded-full transition-colors shadow-sm"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div
                  onClick={() => { setIsMobileMenuOpen(false); openSearch(); }}
                  className="mb-10 group"
                >
                  <div className="w-full bg-slate-100 rounded-2xl px-6 py-4 text-sm text-slate-400 flex items-center justify-between border border-transparent group-hover:border-indigo-100 transition-all">
                    <span>Search Products...</span>
                    <Search size={20} className="text-slate-400 group-hover:text-indigo-500" />
                  </div>
                </div>

                <nav className="space-y-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-2xl font-black text-slate-800 hover:text-indigo-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                <div className="mt-16 pt-12 border-t border-slate-100 space-y-8">
                  <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Shop By Category
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/shop?category=${cat.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-[16px] font-bold text-slate-700 hover:text-indigo-600 flex items-center justify-between group"
                      >
                        {cat.name}
                        <ChevronDown size={18} className="-rotate-90 text-slate-300 group-hover:text-indigo-600" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full py-4.5 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full py-4.5 bg-indigo-600 text-white text-center font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                  >
                    Sign In to Account
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

