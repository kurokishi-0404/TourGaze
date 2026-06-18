import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { FiBookOpen, FiChevronDown, FiChevronUp, FiDollarSign, FiClock, FiAlertCircle, FiSearch, FiShield, FiHome, FiGlobe, FiFileText } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const RulesHub = () => {
  const { formatPrice, packages, activeCurrency, exchangeRates, currencySymbols } = useApp();
  const [activeTab, setActiveTab] = useState("hotel");
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { key: "hotel", label: "Hotel Policies", icon: FiHome },
    { key: "cancellation", label: "Cancellation & Refunds", icon: FiClock },
    { key: "travel", label: "Travel Requirements", icon: FiGlobe },
    { key: "visa", label: "Visa Information", icon: FiFileText },
  ];

  const policySections = {
    hotel: [
      {
        title: "Check-in & Check-out Standards",
        content: "Standard check-in across international destinations is 2:00 PM and check-out is 11:00 AM. Government-issued passports must be presented at the front desk. Early check-in may be available upon request subject to room availability."
      },
      {
        title: "Tourism Taxes & Local Levies",
        content: "Tourism Taxes are collected locally in select European cities (€2-7 per night per occupant). City taxes in Rome, Paris, and Barcelona apply. These charges are not included in the base package price."
      },
      {
        title: "Room Amenity & Service Policies",
        content: "All partnered hotels include complimentary Wi-Fi, daily housekeeping, and 24-hour front desk. Minibar charges and room service are billed separately. Pets are not allowed in most partner properties."
      },
    ],
    cancellation: [
      {
        title: "Full Refund Window (15+ Days)",
        content: "Cancellations made 15+ days prior to departure receive 100% refund of base package costs. Hotel check-in rules carry separate policies. Flights carry airline-specific cancellation penalties."
      },
      {
        title: "Partial Refund Window (7-14 Days)",
        content: "Eligible for 75% refund. A 25% administrative levy is applied. Hotel credits are processed as travel vouchers valid for 12 months."
      },
      {
        title: "Late Cancellation (3-6 Days)",
        content: "Eligible for 50% refund. Lodging credits processed as travel vouchers. Flight cancellation fees determined by third-party airlines."
      },
      {
        title: "No-Show / Within 48 Hours",
        content: "0% refund eligibility. Booking locked and marked as non-refundable. No travel vouchers issued. Processing refunds can take 7 to 10 working days to credit bank accounts."
      },
    ],
    travel: [
      {
        title: "Passport Validity Requirements",
        content: "All travelers must possess passports with minimum 6 months validity from date of return. Return flight confirmations and hotel reservations must be available at immigration counters."
      },
      {
        title: "Travel Insurance Requirements",
        content: "Mandatory travel insurance covering medical emergency expenses up to €30,000 is required for Europe. Insurance documents must be available digitally and in print."
      },
      {
        title: "Health & Vaccination Records",
        content: "COVID-19 vaccination certificates or negative PCR tests within 48 hours may be required for transit in some countries. Yellow fever vaccination required for certain African and South American destinations."
      },
    ],
    visa: [
      {
        title: "Schengen Visa Processing",
        content: "Indian passport holders require valid Schengen Visas for European transits. Requires bank statements (3 months), confirmed accommodation, travel insurance, and round-trip tickets."
      },
      {
        title: "E-Visa for Japan",
        content: "E-Visas for Japan require online application on Visit Japan Web at least 7 days before departure. Simple 3-day online processing for eligible countries."
      },
      {
        title: "UAE Tourist Visa",
        content: "UAE Visas are processed in 48-72 hours via flight bookings. Require flight ticket and passport copy. Valid for 30 days."
      },
      {
        title: "Indonesia Visa on Arrival",
        content: "Bali is Visa-on-Arrival (VOA) valid for 30 days. Renewable once. Price approx USD 35. Tourist levy of IDR 150,000 paid online before arrival."
      },
    ],
  };

  const handleAccordionClick = (idx) => {
    setActiveAccordion(activeAccordion === idx ? null : idx);
  };

  const currentPolicies = policySections[activeTab] || [];
  const filteredPolicies = currentPolicies.filter(
    p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPackage = packages[0];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Agency Rules Hub</h1>
        <p className="text-sm text-slate-500 mt-1">International entry requirements, cancellation terms, and currency estimates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Policies */}
        <div className="lg:col-span-8 space-y-6">

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setActiveAccordion(0); setSearchQuery(""); }}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-md text-[12px] font-semibold transition-all duration-200 ${
                    activeTab === tab.key
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search policies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Accordion Policies */}
          <div className="space-y-3">
            {filteredPolicies.map((item, idx) => {
              const isOpen = activeAccordion === idx;
              return (
                <div key={idx} className="bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => handleAccordionClick(idx)}
                    className="w-full flex justify-between items-center px-5 py-4 text-left text-[13px] font-semibold text-slate-700 hover:text-blue-600 transition"
                  >
                    <span>{item.title}</span>
                    {isOpen ? <FiChevronUp className="w-4 h-4 shrink-0" /> : <FiChevronDown className="w-4 h-4 shrink-0" />}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-[13px] text-slate-500 leading-relaxed border-t border-slate-100">
                          {item.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {filteredPolicies.length === 0 && (
              <div className="bg-white border border-slate-200/60 rounded-xl p-10 text-center">
                <FiBookOpen className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-500">No policies match your search.</p>
              </div>
            )}
          </div>

          {/* Refund Timeline (visible on cancellation tab) */}
          {activeTab === "cancellation" && (
            <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <FiClock className="w-4 h-4 text-blue-600" />
                <span>Refund Timeline</span>
              </h3>

              <div className="relative pl-6 border-l-2 border-emerald-400 space-y-6 text-[13px] pt-1">
                {[
                  { period: "15+ Days Before", refund: "100% Refund", color: "emerald", icon: "✓" },
                  { period: "7-14 Days Before", refund: "75% Refund", color: "blue", icon: "✓" },
                  { period: "3-6 Days Before", refund: "50% Refund", color: "amber", icon: "!" },
                  { period: "Within 48 Hours", refund: "0% Refund", color: "red", icon: "✕" },
                ].map((item) => {
                  const colorMap = { emerald: "bg-emerald-500", blue: "bg-blue-500", amber: "bg-amber-500", red: "bg-red-500" };
                  const textMap = { emerald: "text-emerald-600", blue: "text-blue-600", amber: "text-amber-600", red: "text-red-600" };
                  return (
                    <div key={item.period} className="relative">
                      <span className={`absolute -left-[29px] top-0.5 w-4 h-4 rounded-full ${colorMap[item.color]} border-2 border-white shadow-sm flex items-center justify-center text-white text-[8px] font-bold`}>
                        {item.icon}
                      </span>
                      <div>
                        <h4 className="font-semibold text-slate-700">{item.period}</h4>
                        <p className={`text-[12px] mt-0.5 font-semibold ${textMap[item.color]}`}>{item.refund}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-amber-50 border border-amber-200/50 rounded-lg p-4 flex items-start space-x-3">
                <FiAlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  Visa application charges, E-Visa processing fees, and flight ticket cancellation penalties are determined by third parties and are non-refundable.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Currency Estimates */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <FiDollarSign className="w-4 h-4 text-blue-600" />
              <span>Currency Estimates</span>
            </h3>

            <div>
              <p className="text-[13px] font-semibold text-slate-700">{selectedPackage.name}</p>
              <p className="text-[12px] text-slate-500 mt-0.5">Base: <span className="font-semibold text-slate-700">{formatPrice(selectedPackage.price)}</span> ({activeCurrency})</p>
            </div>

            <div className="bg-slate-50 border border-slate-200/50 rounded-lg p-4 space-y-2.5 text-[13px]">
              <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Conversion Matrix</p>
              {Object.keys(exchangeRates).map((currCode) => {
                const converted = selectedPackage.price * exchangeRates[currCode];
                const formatted = currCode === "INR"
                  ? converted.toLocaleString("en-IN", { maximumFractionDigits: 0 })
                  : converted.toLocaleString("en-US", { maximumFractionDigits: 0 });
                const symbol = currencySymbols[currCode];
                return (
                  <div key={currCode} className="flex justify-between items-center py-0.5">
                    <span className="font-medium text-slate-600">{currCode}</span>
                    <span className="font-bold text-slate-800">{symbol}{formatted}</span>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-400 italic text-center leading-normal">
              Rates are approximate. Use the floating converter for live updates.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200/50 rounded-xl p-5 space-y-2">
            <h4 className="text-[13px] font-bold text-slate-800">Need Help?</h4>
            <p className="text-[12px] text-slate-600 leading-relaxed">
              TourGaze uses multi-currency processing. Your local bank card will be charged in local equivalent funds.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RulesHub;
