import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { FiBookOpen, FiChevronDown, FiChevronUp, FiDollarSign, FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const RulesHub = () => {
  const { formatPrice, packages, activeCurrency, exchangeRates, currencySymbols } = useApp();
  const [activeAccordion, setActiveAccordion] = useState(0);

  // Accordion Items
  const accordionItems = [
    {
      title: "Visa Information & E-Visa Processing",
      content: "Indian passport holders require valid Schengen Visas for European transits. E-Visas for Japan require online application on Visit Japan Web at least 7 days before departures. UAE Visas are processed in 48-72 hours via flight bookings. Bali is Visa-on-Arrival (VOA) valid for 30 days."
    },
    {
      title: "Hotel Policies & Stay Rules",
      content: "Standard check-in across international destinations is 2:00 PM and check-out is 11:00 AM. Government-issued passports must be presented at the front desk. Tourism Taxes are collected locally in select European cities (€2-7 per night per occupant)."
    },
    {
      title: "Travel Transit Requirements",
      content: "All travelers must possess passports with minimum 6 months validity from date of return. Return flight confirmations and hotel reservations must be available at immigration counters. Mandatory travel insurance covering medical emergency expenses up to €30,000 is required for Europe."
    },
    {
      title: "Cancellation & Refund Policies",
      content: "Cancellations made 15+ days prior to departure receive 100% refund of base package costs. Hotel check-in rules carry separate policies. Flights carry airline-specific cancellation penalties. Processing refunds can take 7 to 10 working days to credit bank accounts."
    }
  ];

  const handleAccordionClick = (idx) => {
    setActiveAccordion(activeAccordion === idx ? null : idx);
  };

  // Cost estimates for currency table
  const selectedPackage = packages[0]; // European Grand Tour

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      
      {/* Page Header */}
      <div className="mb-10 text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">Rules Hub & Refunds</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">Verify international entry requirements, cancellation terms, and view live currency estimates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Accordions for Policies */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center space-x-2 uppercase tracking-wider">
            <FiBookOpen className="w-4 h-4 text-blue-600" />
            <span>Official Policy Documents</span>
          </h3>

          <div className="space-y-4">
            {accordionItems.map((item, idx) => {
              const isOpen = activeAccordion === idx;
              return (
                <div
                  key={idx}
                  className="glass-card overflow-hidden border border-white/50 shadow-md"
                >
                  <button
                    onClick={() => handleAccordionClick(idx)}
                    className="w-full flex justify-between items-center p-5 text-left font-bold text-xs sm:text-sm text-slate-700 hover:text-blue-600 transition"
                  >
                    <span>{item.title}</span>
                    {isOpen ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-xs text-slate-500 leading-relaxed border-t border-slate-100">
                          {item.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Cancellation timeline center */}
          <div className="glass-card p-6 border border-white/50 shadow-xl space-y-5">
            <h3 className="font-extrabold text-sm text-slate-800 flex items-center space-x-2 uppercase tracking-wider">
              <FiClock className="w-4 h-4 text-blue-600" />
              <span>Cancellation & Refund Center</span>
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              Our tiered refund system is calculated relative to booking dates. Verify eligibility and percentage structures below:
            </p>

            {/* Timeline UI graphic */}
            <div className="relative pl-6 border-l-2 border-emerald-400 space-y-6 text-xs pt-2">
              
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border border-white shadow-sm flex items-center justify-center text-white text-[8px] font-extrabold">
                  ✓
                </span>
                <div>
                  <h4 className="font-bold text-slate-700">15+ Days Before Travel</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Eligible for <span className="font-extrabold text-emerald-600">100% Refund</span> of package and lodging charges.</p>
                </div>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-blue-500 border border-white shadow-sm flex items-center justify-center text-white text-[8px] font-extrabold">
                  ✓
                </span>
                <div>
                  <h4 className="font-bold text-slate-700">7 to 14 Days Before Travel</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Eligible for <span className="font-extrabold text-blue-600">75% Refund</span>. 25% administrative levy applied.</p>
                </div>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-amber-500 border border-white shadow-sm flex items-center justify-center text-white text-[8px] font-extrabold">
                  !
                </span>
                <div>
                  <h4 className="font-bold text-slate-700">3 to 6 Days Before Travel</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Eligible for <span className="font-extrabold text-amber-600">50% Refund</span>. Lodging credits processed as travel vouchers.</p>
                </div>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-red-500 border border-white shadow-sm flex items-center justify-center text-white text-[8px] font-extrabold">
                  ✕
                </span>
                <div>
                  <h4 className="font-bold text-slate-700">Within 48 Hours / No Show</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5"><span className="font-extrabold text-red-600">0% Refund Eligibility</span>. Booking locked and marked as non-refundable.</p>
                </div>
              </div>

            </div>

            <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-4 flex items-start space-x-3">
              <FiAlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Visa application charges, E-Visa processing feeds, and flight ticket cancellation penalties are determined by third parties and are non-refundable.
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Converted Trip estimates grid */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center space-x-2 uppercase tracking-wider">
            <FiDollarSign className="w-4 h-4 text-blue-600" />
            <span>Currency Conversion Estimates</span>
          </h3>

          <div className="glass-card p-5 border border-white/50 shadow-xl space-y-4">
            <div>
              <h4 className="font-bold text-xs text-slate-700 leading-snug">{selectedPackage.name} Estimate</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Base Tour cost set for <span className="font-bold text-slate-700">{formatPrice(selectedPackage.price)}</span> ({activeCurrency}).</p>
            </div>

            <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 space-y-3 text-xs">
              <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Conversion Matrix</p>
              
              {Object.keys(exchangeRates).map((currCode) => {
                const converted = selectedPackage.price * exchangeRates[currCode];
                const formatted = currCode === "INR"
                  ? converted.toLocaleString("en-IN", { maximumFractionDigits: 0 })
                  : converted.toLocaleString("en-US", { maximumFractionDigits: 0 });
                const symbol = currencySymbols[currCode];

                return (
                  <div key={currCode} className="flex justify-between items-center py-0.5">
                    <span className="font-semibold text-slate-500">{currCode} Currency</span>
                    <span className="font-extrabold text-slate-800">
                      {symbol}{formatted}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <p className="text-[9px] text-slate-400 leading-normal italic text-center">
              Exchange estimates are updated relative to default rates. Toggles in the floating converter pill update the platform globally.
            </p>
          </div>

          <div className="bg-blue-600/5 border border-blue-500/10 rounded-[24px] p-5 space-y-3 text-xs text-slate-600">
            <h4 className="font-bold text-slate-800">Need Help with Payments?</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              TourGaze uses multi-currency processing routing. Your local bank card will be charged in local equivalent funds.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default RulesHub;
