import React from "react";
import { useApp } from "../context/AppContext";
import { FiHeart, FiStar, FiClock, FiTrash, FiBriefcase, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Wishlist = () => {
  const { wishlist, toggleWishlist, packages, customTrips, deleteCustomTrip, formatPrice } = useApp();

  // Find actual package objects matching IDs in wishlist
  const savedPackages = packages.filter((pkg) => wishlist.includes(pkg.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">My Wishlist</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">Your curated collection of travel packages, custom trip plans, and dream destinations.</p>
      </div>

      {/* 1. SAVED PACKAGES SECTION */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-sm text-slate-800 flex items-center space-x-2 uppercase tracking-wider">
          <FiHeart className="w-4 h-4 text-red-500 fill-current" />
          <span>Saved Tour Packages</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {savedPackages.map((pkg) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                className="glass-card flex flex-col justify-between h-[380px] overflow-hidden border border-white/50 shadow-lg relative group"
              >
                {/* Banner */}
                <div className="relative h-44 shrink-0 overflow-hidden shadow-inner">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white font-extrabold text-[8px] tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                    {pkg.duration}
                  </span>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => toggleWishlist(pkg.id)}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl shadow-sm hover:bg-red-600 transition"
                    title="Remove from wishlist"
                  >
                    <FiTrash className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                      <span>{pkg.country}</span>
                      <span className="flex items-center text-amber-500">
                        <FiStar className="w-3 h-3 fill-current mr-0.5" />
                        <span>{pkg.rating} ({pkg.reviewsCount})</span>
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-800 leading-snug truncate">
                      {pkg.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100/50">
                    <div>
                      <p className="text-[8px] uppercase tracking-wider font-extrabold text-slate-400">Starting price</p>
                      <p className="text-base font-extrabold text-blue-600">{formatPrice(pkg.price)}</p>
                    </div>

                    <Link
                      to={`/packages`}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold shadow-sm transition"
                    >
                      Book Tour
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {savedPackages.length === 0 && (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[24px] p-8 text-center text-xs text-slate-400">
            No saved tour packages in your wishlist yet.
          </div>
        )}
      </div>

      {/* 2. SAVED CUSTOM TRIPS SECTION */}
      <div className="space-y-4 pt-4">
        <h3 className="font-extrabold text-sm text-slate-800 flex items-center space-x-2 uppercase tracking-wider">
          <FiBriefcase className="w-4 h-4 text-blue-600" />
          <span>My Custom Trip Designs</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {customTrips.map((trip) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                className="glass-card p-5 border border-white/50 shadow-md space-y-4 relative"
              >
                {/* Trash button */}
                <button
                  onClick={() => deleteCustomTrip(trip.id)}
                  className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition"
                  title="Delete Custom Trip"
                >
                  <FiTrash className="w-3.5 h-3.5" />
                </button>

                <div className="space-y-1.5 pr-6">
                  <h4 className="font-extrabold text-sm text-slate-800 truncate">{trip.name}</h4>
                  <p className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <FiCalendar className="w-3 h-3 text-slate-400" />
                    <span>Departure: {trip.travelDate}</span>
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3 text-xs space-y-2">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Stops Sequence</p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-slate-600">{trip.startPoint}</span>
                    {trip.stops.map((stop) => (
                      <React.Fragment key={stop}>
                        <span className="text-slate-400">→</span>
                        <span className="font-bold text-slate-700">{stop}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[8px] uppercase tracking-wider font-extrabold text-slate-400 block">Total Est</span>
                    <span className="font-extrabold text-blue-600 text-sm">{formatPrice(trip.costs.total)}</span>
                  </div>
                  <Link
                    to="/planner"
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-[10px]"
                  >
                    Edit Route
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {customTrips.length === 0 && (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[24px] p-8 text-center text-xs text-slate-400">
            No custom designed trips saved yet.
          </div>
        )}
      </div>

    </div>
  );
};

export default Wishlist;
