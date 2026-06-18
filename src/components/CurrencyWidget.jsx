import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { FiDollarSign, FiRefreshCw, FiChevronUp, FiChevronDown, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const CurrencyWidget = () => {
  const { activeCurrency, setActiveCurrency, exchangeRates, currencySymbols } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("1000");

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "AED", name: "UAE Dirham", symbol: "AED" }
  ];

  const handleAmountChange = (e) => {
    // allow only numbers
    const val = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(val);
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            className="w-72 glass-card p-5 border border-white/40 shadow-2xl relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
            >
              <FiX className="w-4 h-4" />
            </button>

            <h3 className="font-extrabold text-sm text-slate-800 flex items-center space-x-2 mb-4">
              <FiRefreshCw className="w-4 h-4 text-blue-600 animate-spin-slow" />
              <span>Currency Converter</span>
            </h3>

            {/* Quick Toggle list */}
            <div className="mb-4">
              <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-2">
                Active Currency
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => setActiveCurrency(curr.code)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition border ${
                      activeCurrency === curr.code
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                        : "bg-white/60 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                    title={curr.name}
                  >
                    {curr.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Calculator */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">
                  Enter USD Amount
                </label>
                <div className="relative flex items-center">
                  <FiDollarSign className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full pl-8 pr-3 py-2 text-xs font-semibold bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                    placeholder="1000"
                  />
                </div>
              </div>

              {/* Conversions Output */}
              <div className="bg-slate-50/70 border border-slate-200/50 rounded-xl p-3 space-y-2">
                <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">
                  Estimates
                </label>
                {currencies
                  .filter((c) => c.code !== "USD")
                  .map((curr) => {
                    const usdVal = parseFloat(amount) || 0;
                    const converted = usdVal * exchangeRates[curr.code];
                    const formatted = curr.code === "INR" 
                      ? converted.toLocaleString("en-IN", { maximumFractionDigits: 2 })
                      : converted.toLocaleString("en-US", { maximumFractionDigits: 2 });
                    
                    return (
                      <div key={curr.code} className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-500">{curr.name}</span>
                        <span className="font-bold text-slate-800">
                          {curr.symbol} {formatted}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Floating FAB Toggle Button */
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-full shadow-lg hover:shadow-blue-500/20 transition-all font-bold text-xs border border-white/20 backdrop-blur-md"
          >
            <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center font-extrabold text-[10px]">
              {currencySymbols[activeCurrency].trim()}
            </span>
            <span>Convert ({activeCurrency})</span>
            <FiChevronUp className="w-4 h-4 shrink-0" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrencyWidget;
