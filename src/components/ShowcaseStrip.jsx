import { Truck, BadgeDollarSign, Headset, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function ServiceHighlights() {
  const items = [
    {
      title: "Worldwide Delivery",
      desc: "Fast shipping to your doorstep",
      icon: Truck,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      title: "Authorized Partner",
      desc: "Genuine HP products guaranteed",
      icon: ShieldCheck,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      title: "Service Hub",
      desc: "Expert assistance desk",
      icon: Headset,
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    {
      title: "Secure Payments",
      desc: "100% encrypted transactions",
      icon: ShieldCheck,
      color: "text-amber-500",
      bg: "bg-amber-50"
    },
  ];

  return (
    <section className="relative z-20 mt-[-40px] md:mt-[50px] font-sans">
      <div className="w-full mx-auto px-4 lg:px-16">
        <div className="bg-white rounded-[32px] shadow-2xl shadow-indigo-100/50 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden">
          {items.map((it, idx) => {
            const Icon = it.icon;
            return (
              <div
                key={it.title}
                className={`flex items-center gap-5 px-8 py-10 transition-all hover:bg-slate-50 group border-slate-50 ${idx !== items.length - 1 ? "lg:border-r" : ""
                  }`}
              >
                <div className={`w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl ${it.bg} ${it.color} transition-transform group-hover:scale-110 duration-300 shadow-sm`}>
                  <Icon size={28} strokeWidth={2} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-[15px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1.5">
                    {it.title}
                  </h3>
                  <p className="text-[13px] font-bold text-slate-400 leading-snug">
                    {it.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
