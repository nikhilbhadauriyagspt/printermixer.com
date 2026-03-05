import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Truck, ShieldCheck, ArrowRight, Lock, MapPin, Mail, Loader2, Navigation, CheckCircle2, Package, Sparkles, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PayPalButtons } from "@paypal/react-paypal-js";
import API_BASE_URL from '../config';

export default function Checkout() {
  const { cart, cartCount, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const finalTotal = total;

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'cod' // default
  });

  const [detectingLocation, setDetectingLocation] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();

          if (data.address) {
            const addr = data.address;
            const streetAddress = [
              addr.house_number,
              addr.road,
              addr.suburb,
              addr.neighbourhood
            ].filter(Boolean).join(', ');

            setFormData(prev => ({
              ...prev,
              address: streetAddress || data.display_name,
              city: addr.city || addr.town || addr.village || addr.state || '',
              zipCode: addr.postcode || ''
            }));
          }
        } catch (err) {
          console.error("Location detection error:", err);
          alert("Could not detect address. Please enter it manually.");
        } finally {
          setDetectingLocation(false);
        }
      },
      (error) => {
        setDetectingLocation(false);
        alert("Location access denied or unavailable.");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrderSuccess = async (paymentDetails = null) => {
    setLoading(true);
    try {
      const orderData = {
        ...formData,
        address: `${formData.address} (via printermixer.com)`,
        user_id: user?.id,
        total: finalTotal,
        items: cart,
        payment_details: paymentDetails,
        source: 'printermixer.com',
        notes: `Order from printermixer.com | ${formData.notes || ''}`
      };

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await response.json();
      if (data.status === 'success') {
        setOrderId(data.order_id);
        setStep(3);
        clearCart();
      } else {
        alert('Error placing order: ' + data.message);
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      window.scrollTo(0, 0);
    } else {
      if (formData.paymentMethod === 'cod') {
        await handleOrderSuccess();
      }
    }
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#f8fafc] font-sans text-center">
        <div className="h-32 w-32 rounded-[40px] bg-white flex items-center justify-center mb-10 shadow-2xl shadow-indigo-100 border border-slate-100">
          <Package size={48} className="text-slate-200" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">No Hardware in Session</h2>
        <p className="text-slate-500 font-medium text-base mb-12 max-w-md mx-auto leading-relaxed">Please add authorized items to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="px-12 py-5 bg-indigo-600 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">Return to Catalog</Link>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#f8fafc] font-sans text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="h-32 w-32 rounded-[40px] bg-emerald-500 text-white flex items-center justify-center mb-10 shadow-2xl shadow-emerald-200"
        >
          <CheckCircle2 size={56} strokeWidth={2.5} />
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 uppercase italic leading-none">Order Confirmed.</h1>
        <p className="text-slate-500 font-medium text-lg mb-12 max-w-xl mx-auto leading-relaxed">Your authorized hardware is scheduled for immediate dispatch to your logistics destination.</p>
        <div className="bg-white p-12 rounded-[40px] border border-slate-100 mb-12 max-w-md w-full shadow-2xl shadow-indigo-100/30 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16" />
          <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-4 relative z-10">Order Reference</p>
          <p className="text-4xl font-black text-slate-900 uppercase tracking-widest relative z-10 italic">#PTP-{orderId || 'PENDING'}</p>
        </div>
        <Link to="/" className="px-12 py-5 bg-indigo-600 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-20 pt-4">

      {/* --- Breadcrumbs Header --- */}
      <div className="w-full mx-auto px-6 lg:px-16 py-10 md:py-14 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-4">
            <Link to="/cart" className="group inline-flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-[0.25em]">
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-indigo-600 transition-all">
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              </div>
              Back to selection
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-none tracking-tighter">
              Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 italic">Checkout.</span>
            </h1>
          </div>

          <div className="flex items-center gap-6 bg-white px-8 py-5 rounded-[24px] border border-slate-100 shadow-sm">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-sm font-black transition-all border-2 ${step >= 1 ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'border-slate-100 text-slate-200'}`}>1</div>
            <div className={`h-[2px] w-10 rounded-full transition-all ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-100'}`} />
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-sm font-black transition-all border-2 ${step >= 2 ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'border-slate-100 text-slate-200'}`}>2</div>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-6 lg:px-16">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24">

          {/* Main Module */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-12 bg-white p-10 md:p-16 border border-slate-100 rounded-[40px] shadow-2xl shadow-indigo-100/20">

            {step === 1 ? (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                <div className="space-y-8">
                  <div className="flex items-center gap-5 pb-6 border-b border-slate-50">
                    <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                      <Mail size={22} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-900">Contact Information</h3>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Authorized Recipient Email</label>
                    <input required name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Email address for specialized order updates" className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none text-sm font-bold text-slate-800 transition-all placeholder:text-slate-300" />
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-slate-50">
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                        <MapPin size={22} strokeWidth={2.5} />
                      </div>
                      <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-900">Logistics Destination</h3>
                    </div>
                    <button
                      type="button" onClick={detectLocation} disabled={detectingLocation}
                      className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all disabled:opacity-50 shadow-xl shadow-black/10 active:scale-95"
                    >
                      {detectingLocation ? <Loader2 className="animate-spin" size={16} /> : <Navigation size={16} />}
                      {detectingLocation ? 'Locating...' : 'Auto-Detect Address'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">First Name</label>
                      <input required name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Recipient's first name" className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none text-sm font-bold text-slate-800 transition-all placeholder:text-slate-300" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Last Name</label>
                      <input required name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Recipient's last name" className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none text-sm font-bold text-slate-800 transition-all placeholder:text-slate-300" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Complete Logistics Address</label>
                    <input required name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter full street, building and suite details" className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none text-sm font-bold text-slate-800 transition-all placeholder:text-slate-300" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">City / Region</label>
                      <input required name="city" value={formData.city} onChange={handleInputChange} placeholder="Pasadena, CA" className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none text-sm font-bold text-slate-800 transition-all placeholder:text-slate-300" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Postal Code</label>
                      <input required name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="Zip code" className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none text-sm font-bold text-slate-800 transition-all placeholder:text-slate-300" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mobile Communication Link</label>
                    <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="+1 (000) 000-0000" className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none text-sm font-bold text-slate-800 transition-all placeholder:text-slate-300" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                <div className="space-y-10">
                  <div className="flex items-center gap-5 pb-6 border-b border-slate-50">
                    <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                      <CreditCard size={22} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-900">Payment Selection</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div
                      onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                      className={`p-10 rounded-[32px] border-2 transition-all cursor-pointer relative overflow-hidden group ${formData.paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-50/30 shadow-2xl shadow-indigo-100' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}`}
                    >
                      <div className="flex items-center justify-between mb-10">
                        <div className={`h-8 w-8 rounded-xl border-2 flex items-center justify-center transition-all ${formData.paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white'}`}>
                          {formData.paymentMethod === 'cod' && <CheckCircle2 size={16} strokeWidth={3} />}
                        </div>
                        <Truck size={40} className={formData.paymentMethod === 'cod' ? 'text-indigo-600' : 'text-slate-200'} strokeWidth={1.5} />
                      </div>
                      <h4 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Cash on Delivery</h4>
                      <p className="text-[10px] font-black text-slate-400 mt-3 uppercase tracking-[0.2em]">Pay upon hardware arrival</p>
                    </div>

                    <div
                      onClick={() => setFormData({ ...formData, paymentMethod: 'paypal' })}
                      className={`p-10 rounded-[32px] border-2 transition-all cursor-pointer relative overflow-hidden group ${formData.paymentMethod === 'paypal' ? 'border-indigo-600 bg-indigo-50/30 shadow-2xl shadow-indigo-100' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}`}
                    >
                      <div className="flex items-center justify-between mb-10">
                        <div className={`h-8 w-8 rounded-xl border-2 flex items-center justify-center transition-all ${formData.paymentMethod === 'paypal' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white'}`}>
                          {formData.paymentMethod === 'paypal' && <CheckCircle2 size={16} strokeWidth={3} />}
                        </div>
                        <div className="text-slate-900 font-black text-3xl italic tracking-tighter">PayPal</div>
                      </div>
                      <h4 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">PayPal Express</h4>
                      <p className="text-[10px] font-black text-slate-400 mt-3 uppercase tracking-[0.2em]">Instant encrypted payment</p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {formData.paymentMethod === 'paypal' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="space-y-10 pt-10 mt-10 border-t border-slate-50">
                          <div className="p-10 bg-slate-900 rounded-[32px] text-white text-center border border-slate-800 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 rounded-full blur-[60px] opacity-20" />
                            <div className="relative z-10">
                              <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-slate-400 flex items-center justify-center gap-2"><Lock size={12} /> Secured with SSL Encryption Protocols.</p>
                              <div className="inline-flex items-center gap-3 px-8 py-3 bg-white/10 rounded-full text-[11px] font-black uppercase tracking-widest border border-white/10 shadow-sm">
                                <ShieldCheck size={20} className="text-indigo-400" /> Certified Hub Checkout
                              </div>
                            </div>
                          </div>
                          <div className="relative z-0">
                            <PayPalButtons
                              style={{ layout: "vertical", shape: "pill", height: 60 }}
                              createOrder={(data, actions) => {
                                return actions.order.create({
                                  purchase_units: [{
                                    amount: { value: finalTotal.toString() },
                                    description: `Printer Mixer Hardware Procurement - ${cartCount} Units`,
                                  }],
                                });
                              }}
                              onApprove={async (data, actions) => {
                                const details = await actions.order.capture();
                                await handleOrderSuccess(details);
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-6 pt-12 border-t border-slate-50 mt-12">
              {step === 2 && (
                <button type="button" onClick={() => setStep(1)} className="px-12 h-16 bg-slate-50 border border-slate-100 text-slate-500 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-indigo-600 transition-all active:scale-95 shadow-sm">Back to details</button>
              )}
              {formData.paymentMethod === 'cod' || step === 1 ? (
                <button
                  type="submit" disabled={loading}
                  className="flex-1 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.25em] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 active:scale-95 disabled:opacity-50 group"
                >
                  {loading ? 'Finalizing system link...' : (step === 1 ? 'Configure Payment' : 'Complete Acquisition')}
                  {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              ) : null}
            </div>
          </div>

          {/* Summary Module */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-[40px] p-10 lg:p-14 border border-slate-100 sticky top-32 shadow-2xl shadow-indigo-100/30">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-1.5 h-5 bg-indigo-600 rounded-full" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">Order Contents</span>
              </div>

              <div className="space-y-8 mb-12 max-h-[450px] overflow-y-auto pr-4 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-6 group items-center">
                    <div className="h-20 w-20 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shrink-0 group-hover:bg-indigo-50/30 group-hover:border-indigo-100 transition-all overflow-hidden">
                      <img src={item.images ? (typeof item.images === 'string' ? JSON.parse(item.images)[0] : item.images[0]) : ''} className="max-w-[70%] max-h-[70%] object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13px] font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors leading-tight mb-2 uppercase tracking-tight">{item.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity: {item.quantity}</span>
                        <span className="text-[14px] font-black text-slate-900 italic">${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-8 border-t border-slate-50 pt-10">
                <div className="flex justify-between items-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-slate-900 text-base italic font-bold">${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Logistics link</span>
                  <span className="text-emerald-500 text-[10px] font-black uppercase bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 tracking-[0.1em]">Free Delivery</span>
                </div>
                <div className="flex justify-between items-end pt-8 border-t border-slate-50">
                  <span className="text-[12px] font-black uppercase tracking-[0.25em] text-slate-900">Grand Total</span>
                  <span className="text-5xl font-black text-indigo-600 leading-none tracking-tighter italic">${finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-12 p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 flex items-center gap-5 group hover:bg-white transition-all duration-500 shadow-sm">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:shadow-indigo-100 transition-all">
                  <ShieldCheck size={24} className="text-indigo-600" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Hardware-Secured <br /><span className="text-slate-900">Encrypted checkout.</span></p>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

