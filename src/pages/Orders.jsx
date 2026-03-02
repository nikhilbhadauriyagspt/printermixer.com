import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Search, Loader2, Calendar, CreditCard, Truck, X, CheckCircle2, Clock, MapPin, ChevronLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guestEmail, setGuestEmail] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const statusMap = [
    { key: 'pending', label: 'Order Placed', icon: Clock, desc: 'We have received your order' },
    { key: 'processing', label: 'Processing', icon: Package, desc: 'Your items are being prepared' },
    { key: 'shipped', label: 'Shipped', icon: Truck, desc: 'Package has left our facility' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin, desc: 'Courier is on the way' },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2, desc: 'Successfully delivered' }
  ];

  const getStatusIndex = (status) => statusMap.findIndex(s => s.key === status);

  const fetchOrders = async (email = null) => {
    setLoading(true);
    try {
      const identifier = user ? `user_id=${user.id}` : `email=${email}`;
      const response = await fetch(`${API_BASE_URL}/orders?${identifier}`);
      const data = await response.json();
      if (data.status === 'success') {
        setOrders(data.data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, []);

  const handleGuestSearch = (e) => {
    e.preventDefault();
    if (guestEmail) fetchOrders(guestEmail);
  };

  if (!user && orders.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-40 pb-20 font-sans px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="h-24 w-24 rounded-[32px] bg-white flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-100 border border-slate-100">
            <Package size={40} className="text-indigo-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 leading-none">Track your order.</h1>
          <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[11px] mb-12">Login to see your full history or enter your guest email below.</p>

          <form onSubmit={handleGuestSearch} className="flex flex-col sm:flex-row gap-4 mb-12 bg-white p-2 rounded-[32px] border border-slate-100 shadow-xl shadow-indigo-100/30">
            <input
              type="email" required
              placeholder="ENTER REGISTERED GUEST EMAIL"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="flex-1 h-16 px-8 bg-transparent outline-none text-[13px] font-black uppercase transition-all placeholder:text-slate-300"
            />
            <button className="h-16 px-12 bg-slate-900 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-black/20">
              Find acquisition
            </button>
          </form>

          <div className="pt-10 border-t border-slate-100">
            <Link to="/login" className="text-indigo-600 font-black text-[11px] uppercase tracking-[0.25em] hover:underline underline-offset-8 decoration-2">Or Login to your professional account</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20 font-sans selection:bg-indigo-600 selection:text-white">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* --- DASHBOARD HEADER --- */}
        <div className="mb-12">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
              <ChevronRight size={12} className="text-slate-300" />
              <span className="text-indigo-600">Order Management</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-4 text-center md:text-left">
              <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                Procurement <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 italic">History.</span>
              </h1>
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm self-center md:self-auto">
                <span className="text-slate-900 font-black">{orders.length}</span> 
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Units Tracked</span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[40px] border border-slate-100 shadow-sm">
            <Loader2 className="animate-spin h-12 w-12 text-indigo-600 mb-6" strokeWidth={3} />
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Retrieving Records...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Package size={40} className="text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No History Detected.</h3>
            <p className="text-slate-500 font-medium text-base mb-10">You haven't initiated any hardware acquisitions yet.</p>
            <Link to="/shop" className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">Begin Shopping</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                key={order.id}
                className="bg-white rounded-[40px] border border-slate-100 overflow-hidden group hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500"
              >
                <div className="p-10 border-b border-slate-50 flex flex-wrap items-center justify-between gap-10">
                  <div className="flex items-center gap-8">
                    <div className="h-16 w-16 rounded-[20px] bg-slate-50 text-indigo-600 flex items-center justify-center shadow-sm">
                      <Package size={28} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">RECORD #PTP-{order.id}</p>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight italic uppercase">System Acquisition</h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-12">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Calendar size={12} className="text-indigo-600" /> Stamp
                      </p>
                      <p className="text-base font-bold text-slate-900">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <CreditCard size={12} className="text-indigo-600" /> Protocol
                      </p>
                      <p className="text-base font-bold text-slate-900 uppercase">{order.payment_method}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current status</p>
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Valuation</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter italic">${parseFloat(order.total_amount).toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-10 bg-slate-50/20">
                  <div className="space-y-5">
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between group/item p-4 rounded-2xl hover:bg-white transition-all">
                        <div className="flex items-center gap-6">
                          <div className="h-12 w-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[11px] font-black text-slate-900">
                            {item.quantity}x
                          </div>
                          <p className="text-[14px] font-bold text-slate-600 capitalize line-clamp-1 max-w-[500px]">{item.product_name}</p>
                        </div>
                        <p className="text-base font-black text-slate-900 tracking-tight italic">${parseFloat(item.price).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-3 text-slate-400">
                      <MapPin size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest">Logistics link</p>
                         <p className="text-[13px] font-bold text-slate-900 mt-1">{order.address}, {order.city}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 group"
                    >
                      Track Live Stream <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* --- TRACKING MODAL --- */}
        <AnimatePresence>
          {selectedOrder && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedOrder(null)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[1000]"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[48px] z-[1001] shadow-2xl p-12 lg:p-16 border border-slate-100 font-sans"
              >
                <div className="flex items-center justify-between mb-16">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Track Session.</h2>
                    <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em] mt-2">Identification Code: #PTP-{selectedOrder.id}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm">
                    <X size={24} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="relative space-y-12 mb-12">
                  <div className="absolute left-7 top-4 bottom-4 w-[2px] bg-slate-100" />

                  {statusMap.map((step, idx) => {
                    const isCompleted = getStatusIndex(selectedOrder.status) >= idx;
                    const isActive = selectedOrder.status === step.key;
                    const Icon = step.icon;

                    return (
                      <div key={step.key} className="relative flex gap-12 group">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center z-10 transition-all duration-700 border-2 ${isCompleted ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-white border-slate-50 text-slate-200'}`}>
                          <Icon size={24} className={isActive ? 'animate-pulse' : ''} />
                        </div>

                        <div className="flex-1 pt-1">
                          <h4 className={`text-[13px] font-black uppercase tracking-[0.15em] ${isCompleted ? 'text-slate-900' : 'text-slate-400/30'}`}>
                            {step.label}
                          </h4>
                          <p className={`text-[13px] font-medium mt-2 leading-relaxed ${isCompleted ? 'text-slate-500' : 'text-slate-400/30'}`}>
                            {step.desc}
                          </p>
                          {isActive && (
                            <motion.div
                              layoutId="status-pill"
                              className="inline-flex items-center gap-2 mt-5 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm"
                            >
                              <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-ping" /> Real-time active
                            </motion.div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-16 pt-10 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-10">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Truck size={12} /> System Carrier</p>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Primeprintshop Logistics</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2 justify-end"><Clock size={12} /> Expected Link</p>
                      <p className="text-sm font-black text-indigo-600 uppercase tracking-widest italic">2-3 Business Days</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

