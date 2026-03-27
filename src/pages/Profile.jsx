import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config';
import {
  User,
  Lock,
  ShoppingBag,
  Package,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'orders', 'security'
  const [isUpdating, setIsSearching] = useState(false);
  const { showToast } = useCart();
  const navigate = useNavigate();

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [securityForm, setSecurityForm] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders?user_id=${user.id}`);
      const data = await response.json();
      if (data.status === 'success') setOrders(data.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      const data = await response.json();
      if (data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(data.data));
        setUser(data.data);
        showToast("System profile updated.");
      }
    } catch (err) {
      showToast("Update failed", "error");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSecurityUpdate = async (e) => {
    e.preventDefault();
    if (securityForm.password !== securityForm.confirmPassword) {
      showToast("Mismatch in credentials", "error");
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: securityForm.password })
      });
      const data = await response.json();
      if (data.status === 'success') {
        showToast("Protocol updated.");
        setSecurityForm({ password: '', confirmPassword: '' });
      }
    } catch (err) {
      showToast("Update failed", "error");
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20 font-sans selection:bg-[#0978CD] selection:text-white">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* --- DASHBOARD HEADER --- */}
        <div className="mb-12">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              <Link to="/" className="hover:text-[#0978CD] transition-colors">Home</Link>
              <ChevronRight size={12} className="text-slate-300" />
              <span className="text-[#0978CD]">Account Dashboard</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-4 text-center md:text-left">
              <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                Control <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0978CD] to-blue-500 italic">Panel.</span>
              </h1>
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm self-center md:self-auto">
                <ShieldCheck size={18} className="text-[#0978CD]" strokeWidth={2.5} />
                <div className="h-4 w-px bg-slate-100" />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Authenticated session</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Sidebar Modular Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-2xl shadow-indigo-100/20 sticky top-32">
              <div className="flex flex-col items-center text-center mb-12">
                <div className="h-24 w-24 rounded-[32px] bg-[#0978CD] text-white flex items-center justify-center text-3xl font-black mb-6 shadow-xl shadow-indigo-200">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-black text-slate-900 capitalize tracking-tight">{user.name}</h2>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">{user.email}</p>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'profile', label: 'Identity Settings', icon: User },
                  { id: 'orders', label: 'Procurement History', icon: Package },
                  { id: 'security', label: 'Access Protocols', icon: Lock }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                      ? 'bg-[#0978CD] text-white shadow-xl shadow-indigo-100 translate-x-1'
                      : 'text-slate-400 hover:bg-slate-50 hover:text-[#0978CD]'
                      }`}
                  >
                    <tab.icon size={18} strokeWidth={2.5} />
                    {tab.label}
                  </button>
                ))}

                <div className="h-px bg-slate-50 my-6" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-6 py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-500 bg-red-50 hover:bg-red-100 transition-all"
                >
                  <LogOut size={18} strokeWidth={2.5} />
                  Terminate Session
                </button>
              </div>
            </div>
          </div>

          {/* Main Stage Panel */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-[40px] p-8 md:p-16 border border-slate-100 shadow-2xl shadow-indigo-100/20"
                >
                  <div className="flex items-center gap-5 mb-12">
                    <div className="h-14 w-14 rounded-[20px] bg-indigo-50 text-[#0978CD] flex items-center justify-center shadow-sm">
                      <User size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Personal Identity.</h3>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Update your verified contact data</p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Display Name</label>
                        <input
                          required value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#0978CD] outline-none text-sm font-bold text-slate-800 transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Phone Link</label>
                        <input
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#0978CD] outline-none text-sm font-bold text-slate-800 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Deployment Address</label>
                      <textarea
                        rows="4" value={profileForm.address}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[32px] focus:bg-white focus:border-[#0978CD] outline-none text-sm font-bold text-slate-800 transition-all resize-none"
                        placeholder="Enter your complete logistics address"
                      ></textarea>
                    </div>
                    <div className="pt-4">
                      <button
                        disabled={isUpdating}
                        className="h-16 px-12 bg-[#0978CD] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 active:scale-95"
                      >
                        {isUpdating ? "Syncing hardware profile..." : "Apply system changes"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-2xl shadow-indigo-100/20 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-[20px] bg-indigo-50 text-[#0978CD] flex items-center justify-center shadow-sm">
                        <ShoppingBag size={28} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Orders.</h3>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{orders.length} verified records</p>
                      </div>
                    </div>
                    <Link to="/shop" className="px-6 py-3 bg-slate-50 hover:bg-indigo-50 text-[#0978CD] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">New Acquisition</Link>
                  </div>

                  {orders.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-24 text-center border border-slate-100 shadow-sm">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Package size={40} className="text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-black uppercase text-[11px] tracking-[0.3em]">No procurement records found.</p>
                      <Link to="/shop" className="inline-block mt-8 text-[#0978CD] font-black uppercase text-[10px] tracking-widest underline underline-offset-8">Explore Hardware Catalog</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-[32px] border border-slate-100 overflow-hidden group hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500">
                          <div className="p-8 flex items-center justify-between border-b border-slate-50">
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ID #PTP-{order.id}</p>
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-[#0978CD] border-indigo-100'}`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-black text-slate-900 tracking-tighter italic">${parseFloat(order.total_amount).toLocaleString()}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="p-6 bg-slate-50/50 group-hover:bg-white transition-colors">
                            <Link to="/orders" className="flex items-center justify-center gap-3 text-[11px] font-black text-[#0978CD] uppercase tracking-widest group-hover:gap-5 transition-all">
                              Track Hardware Shipment <ArrowRight size={16} />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'security' && (activeTab === 'security' && (
                <motion.div
                  key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-[40px] p-8 md:p-16 border border-slate-100 shadow-2xl shadow-indigo-100/20"
                >
                  <div className="flex items-center gap-5 mb-12">
                    <div className="h-14 w-14 rounded-[20px] bg-red-50 text-red-500 flex items-center justify-center shadow-sm">
                      <Lock size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Access Protocols.</h3>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your authentication layer</p>
                    </div>
                  </div>

                  <form onSubmit={handleSecurityUpdate} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">New Protocol Code</label>
                      <div className="relative group">
                        <input
                          type={showPass ? "text" : "password"} required
                          value={securityForm.password} onChange={(e) => setSecurityForm({ ...securityForm, password: e.target.value })}
                          className="w-full h-16 pl-6 pr-14 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#0978CD] outline-none text-sm font-bold text-slate-800 transition-all"
                          placeholder="Enter high-entropy password"
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#0978CD] transition-colors">
                          {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Verify Protocol</label>
                      <input
                        type={showPass ? "text" : "password"} required
                        value={securityForm.confirmPassword} onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                        className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#0978CD] outline-none text-sm font-bold text-slate-800 transition-all"
                        placeholder="Repeat protocol code"
                      />
                    </div>
                    <div className="pt-4">
                      <button
                        disabled={isUpdating}
                        className="h-16 px-12 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#0978CD] transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50"
                      >
                        {isUpdating ? "Processing update..." : "Update access credentials"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
