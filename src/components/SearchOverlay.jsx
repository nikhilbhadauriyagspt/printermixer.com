import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, History, ChevronRight, CornerDownLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API_BASE_URL from '../config';

export default function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSearchOpen]);

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeSearch]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const res = await fetch(`${API_BASE_URL}/products?search=${encodeURIComponent(searchQuery)}&limit=6`);
          const data = await res.json();
          if (data.status === 'success') {
            setSuggestions(data.data);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      closeSearch();
      setSearchQuery('');
    }
  };

  const handleQuickSearch = (query, type = 'search') => {
    if (type === 'category') {
      navigate(`/shop?category=${encodeURIComponent(query)}`);
    } else {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
    }
    closeSearch();
    setSearchQuery('');
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-[2000] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4">
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          {/* Command Palette Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-[700px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col"
          >
            {/* Search Input Area */}
            <div className="relative flex items-center px-6 py-5 border-b border-slate-100">
              <Search className="text-[#0978CD] shrink-0" size={24} strokeWidth={2.5} />
              <form onSubmit={handleSearch} className="flex-1 ml-4">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xl font-bold text-slate-800 placeholder:text-slate-300 outline-none bg-transparent"
                />
              </form>
              <button
                onClick={closeSearch}
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Results / Quick Links Area */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar bg-white">
              {searchQuery.length > 1 ? (
                <div className="p-4 space-y-2">
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#0978CD] uppercase tracking-widest">
                      {isSearching ? 'Scanning Catalog...' : 'Matched Hardware'}
                    </span>
                    {!isSearching && suggestions.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-400">Press Enter to see all</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {suggestions.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          navigate(`/product/${product.slug}`);
                          closeSearch();
                        }}
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all text-left group w-full border border-transparent hover:border-slate-100"
                      >
                        <div className="w-14 h-14 bg-white border border-slate-100 rounded-xl p-2 flex items-center justify-center shrink-0 shadow-sm">
                          <img
                            src={product.images ? (typeof product.images === 'string' ? JSON.parse(product.images)[0] : product.images[0]) : ''}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 text-[14px] truncate group-hover:text-[#0978CD]">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[#0978CD] font-black text-[15px]">${product.price}</span>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">In Stock</span>
                          </div>
                        </div>
                        <CornerDownLeft size={16} className="text-slate-200 opacity-0 group-hover:opacity-100 transition-all mr-2" />
                      </button>
                    ))}

                    {!isSearching && suggestions.length === 0 && (
                      <div className="py-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search size={24} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 text-sm font-bold">No hardware found matching "{searchQuery}"</p>
                        <button
                          onClick={() => setSearchQuery('')}
                          className="mt-4 text-[#0978CD] text-xs font-black underline"
                        >
                          Clear Search
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {/* Popular Searches */}
                  <div className="p-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <TrendingUp size={14} className="text-indigo-500" /> Trending Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'HP LaserJet Pro', query: 'LaserJet Pro' },
                        { label: 'Smart Tank', query: 'Smart Tank' },
                        { label: 'Ink & Toner', query: 'Ink' },
                        { label: 'Wireless', query: 'Wireless' },
                        { label: 'Color LaserJet', query: 'Color LaserJet' }
                      ].map((tag) => (
                        <button
                          key={tag.label}
                          onClick={() => handleQuickSearch(tag.query)}
                          className="px-4 py-2 bg-slate-50 hover:bg-indigo-50 hover:text-[#0978CD] rounded-xl text-[13px] font-bold text-slate-600 transition-all border border-slate-100 hover:border-indigo-100"
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Categories */}
                  <div className="p-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <History size={14} className="text-indigo-500" /> Quick Access
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { label: 'All-in-One Printers', slug: 'all-in-one-printers' },
                        { label: 'Laser Printers', slug: 'laser-printers' },
                        { label: 'Inkjet Printers', slug: 'inkjet-printers' },
                        { label: 'Printer Accessories', slug: 'printer-accessories' }
                      ].map((cat) => (
                        <button
                          key={cat.label}
                          onClick={() => handleQuickSearch(cat.slug, 'category')}
                          className="flex items-center justify-between w-full p-3.5 hover:bg-slate-50 rounded-2xl group transition-all text-left"
                        >
                          <span className="font-bold text-slate-700 text-[14px] group-hover:text-[#0978CD]">{cat.label}</span>
                          <ChevronRight size={16} className="text-slate-200 group-hover:text-[#0978CD] group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer Help */}
                  <div className="p-4 bg-slate-50/50 flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1"><kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] shadow-sm text-slate-500 font-sans">ESC</kbd> to close</span>
                      <span className="flex items-center gap-1"><kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] shadow-sm text-slate-500 font-sans">ENTER</kbd> to search</span>
                    </div>
                    <Link to="/contact" className="text-[#0978CD] hover:underline">Contact Support</Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
