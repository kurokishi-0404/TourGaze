import React from "react";
import { FiGlobe, FiCpu, FiAward, FiUsers, FiMapPin, FiShield } from "react-icons/fi";

const About = () => {
  const values = [
    {
      title: "Optimized Routing",
      desc: "Our platform implements geographic sorting filters to sequence stop connections, reducing layovers and transit expenses.",
      icon: FiGlobe
    },
    {
      title: "Complete Price Breakdown",
      desc: "Track grand totals including airfare estimation, lodging options, excursion fees, and visa processing rules.",
      icon: FiCpu
    },
    {
      title: "Robust State Tracking",
      desc: "Store bookings data in Local Storage. Undo edits dynamically and revert changes with a single click.",
      icon: FiShield
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">About TourGaze</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
          TourGaze is a next-generation travel platform built to help international adventurers plan, compare, book, and manage multi-city trips from a single modern interface.
        </p>
      </div>

      {/* Hero Banner Grid */}
      <div className="glass-card p-6 sm:p-8 border border-white/50 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-xs">
        <div className="space-y-4">
          <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Our Mission
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-tight">Explore The World Smarter</h2>
          <p className="text-slate-500 leading-relaxed font-semibold">
            Traditional travel platforms leave users scrambling across multiple browser tabs comparing hotels, checking visa rules, converting currencies, and plotting routes.
          </p>
          <p className="text-slate-500 leading-relaxed font-semibold">
            TourGaze solves this fragmentation by consolidating route optimization maps, currency matrix widgets, booking status trackers, and cancellation timelines into a single liquid-glass dashboard.
          </p>
        </div>

        <div className="relative h-64 rounded-2xl overflow-hidden shadow-md">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"
            alt="Planning trip"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      </div>

      {/* CORE VALUES */}
      <div className="space-y-6">
        <h3 className="text-lg font-extrabold text-slate-800 text-center uppercase tracking-wider">Our Core Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((val) => (
            <div key={val.title} className="glass-card p-6 border border-white/50 shadow-md text-center space-y-3 text-xs">
              <div className="p-3.5 bg-blue-600/10 text-blue-600 rounded-2xl inline-block">
                <val.icon className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-800">{val.title}</h4>
              <p className="text-slate-500 leading-relaxed font-semibold">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TECH STACK LOGO BOXES */}
      <div className="glass-card p-6 sm:p-8 border border-white/50 shadow-xl space-y-6 text-xs text-center">
        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Architected Stack & Modules</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-bold text-slate-600">
          {[
            { name: "ReactJS", detail: "Functional Hooks" },
            { name: "Tailwind CSS", detail: "CSS-First v4" },
            { name: "Framer Motion", detail: "Glass Transitions" },
            { name: "React Router", detail: "Navigation Route Logs" },
            { name: "Recharts", detail: "Data Analytics Graphs" },
            { name: "Local Storage", detail: "State Preservation Logs" }
          ].map((item) => (
            <div key={item.name} className="bg-slate-50 border border-slate-200/50 rounded-xl p-3.5 space-y-1">
              <p className="text-slate-800 font-extrabold">{item.name}</p>
              <p className="text-[10px] text-slate-400 font-medium">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default About;
