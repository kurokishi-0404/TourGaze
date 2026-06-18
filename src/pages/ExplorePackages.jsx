import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { FiHeart, FiStar, FiClock, FiSearch, FiFilter, FiBookOpen, FiPlus, FiChevronRight, FiCheck, FiX, FiCheckCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const ExplorePackages = () => {
  const { packages, wishlist, toggleWishlist, addBooking, formatPrice } = useApp();

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [maxBudget, setMaxBudget] = useState(3000);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [visaFreeOnly, setVisaFreeOnly] = useState(false);
  const [familyOnly, setFamilyOnly] = useState(false);
  const [sortBy, setSortBy] = useState("Popular");

  // Selected package details modal
  const [selectedPkg, setSelectedPkg] = useState(null);
  
  // Booking Wizard Modal
  const [bookingWizardPkg, setBookingWizardPkg] = useState(null);
  const [bookingDate, setBookingDate] = useState("2026-07-20");
  const [travelersCount, setTravelersCount] = useState(2);
  const [selectedHotel, setSelectedHotel] = useState("");

  const countries = ["All", ...new Set(packages.map((p) => p.country))];

  // Filtering Logic
  const filteredPackages = packages
    .filter((pkg) => {
      const matchesSearch =
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.country.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBudget = pkg.price <= maxBudget;
      
      const matchesCountry = selectedCountry === "All" || pkg.country === selectedCountry;
      
      const matchesDuration =
        selectedDuration === "All" ||
        (selectedDuration === "Short" && pkg.durationDays <= 6) ||
        (selectedDuration === "Medium" && pkg.durationDays >= 7 && pkg.durationDays <= 8) ||
        (selectedDuration === "Long" && pkg.durationDays >= 9);

      const matchesRating = pkg.rating >= minRating;
      const matchesVisa = !visaFreeOnly || pkg.visaFree;
      const matchesFamily = !familyOnly || pkg.familyFriendly;

      return matchesSearch && matchesBudget && matchesCountry && matchesDuration && matchesRating && matchesVisa && matchesFamily;
    })
    .sort((a, b) => {
      if (sortBy === "PriceAsc") return a.price - b.price;
      if (sortBy === "PriceDesc") return b.price - a.price;
      if (sortBy === "Rating") return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount; // Popular
    });

  const handleOpenBookingWizard = (pkg) => {
    setBookingWizardPkg(pkg);
    setSelectedHotel(pkg.hotels[0].name);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!bookingWizardPkg) return;

    addBooking({
      packageId: bookingWizardPkg.id,
      packageName: bookingWizardPkg.name,
      stops: bookingWizardPkg.stops,
      hotel: selectedHotel,
      travelDate: bookingDate,
      duration: bookingWizardPkg.duration,
      price: bookingWizardPkg.price,
      travelers: travelersCount,
      image: bookingWizardPkg.image
    });

    setBookingWizardPkg(null);

    // Fire premium celebratory confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#10b981", "#ffffff"]
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      
      {/* Page Header */}
      <div className="mb-10 text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">Explore Travel Packages</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">Discover tailored tours, curated hotels, and visa-optimized itineraries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* FILTERS PANEL */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-5 border border-white/50 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-xs text-slate-800 flex items-center space-x-1.5 uppercase tracking-wider">
                <FiFilter className="w-4 h-4 text-blue-600" />
                <span>Filters</span>
              </h3>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setMaxBudget(3000);
                  setSelectedCountry("All");
                  setSelectedDuration("All");
                  setMinRating(0);
                  setVisaFreeOnly(false);
                  setFamilyOnly(false);
                  setSortBy("Popular");
                }}
                className="text-[10px] text-blue-600 font-extrabold hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Keyword Search</label>
              <div className="relative flex items-center">
                <FiSearch className="absolute left-3.5 text-slate-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Country or destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/70 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Budget Limit Slider */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 flex justify-between">
                <span>Budget Limit</span>
                <span className="text-blue-600 font-extrabold">{formatPrice(maxBudget)}</span>
              </label>
              <input
                type="range"
                min="500"
                max="6000"
                step="100"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Destination Country Filter */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-white/70 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
              >
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Filter */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Trip Duration</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: "All", value: "All" },
                  { label: "≤ 6 Days", value: "Short" },
                  { label: "7-8 Days", value: "Medium" },
                  { label: "9+ Days", value: "Long" }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setSelectedDuration(item.value)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold border transition ${
                      selectedDuration === item.value
                        ? "bg-slate-800 border-slate-800 text-white shadow-sm"
                        : "bg-white/60 border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Minimum Rating</label>
              <div className="flex justify-between">
                {[0, 4.5, 4.7, 4.8].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(stars)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center space-x-1 ${
                      minRating === stars
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white/60 border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{stars === 0 ? "Any" : stars}</span>
                    {stars !== 0 && <FiStar className="w-3 h-3 fill-current shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Features Checkbox */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-bold text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={visaFreeOnly}
                  onChange={(e) => setVisaFreeOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>Visa-Free / Easy Visa</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-bold text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={familyOnly}
                  onChange={(e) => setFamilyOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>Family Friendly</span>
              </label>
            </div>

          </div>
        </div>

        {/* PACKAGES DISPLAY GRID */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Sorting controls */}
          <div className="flex justify-between items-center bg-white/40 border border-white/40 rounded-2xl px-5 py-3 shadow-sm backdrop-blur-md">
            <span className="text-xs font-extrabold text-slate-500">
              Found {filteredPackages.length} package(s)
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="Popular">Most Popular</option>
                <option value="PriceAsc">Lowest Price</option>
                <option value="PriceDesc">Highest Price</option>
                <option value="Rating">Highest Rating</option>
              </select>
            </div>
          </div>

          {/* Grid of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => {
              const isSaved = wishlist.includes(pkg.id);
              return (
                <motion.div
                  key={pkg.id}
                  layout
                  className="glass-card flex flex-col justify-between h-[390px] group overflow-hidden border border-white/50 relative"
                >
                  
                  {/* Card top banner with actions */}
                  <div className="relative h-44 shrink-0 overflow-hidden shadow-inner">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Visa / Badges */}
                    <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start">
                      <span className="bg-black/60 backdrop-blur-md text-white font-extrabold text-[8px] tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                        {pkg.duration}
                      </span>
                      {pkg.visaFree && (
                        <span className="bg-emerald-500 text-white font-extrabold text-[8px] tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-white/10 shadow-sm">
                          Visa Free
                        </span>
                      )}
                    </div>

                    {/* Wishlist Toggle Button */}
                    <button
                      onClick={() => toggleWishlist(pkg.id)}
                      className={`absolute top-3.5 right-3.5 p-2 rounded-xl transition backdrop-blur-md border ${
                        isSaved
                          ? "bg-red-500 border-red-500 text-white"
                          : "bg-white/80 border-white/20 text-slate-600 hover:text-red-500 hover:bg-white"
                      }`}
                    >
                      <FiHeart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Card Info details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                        <span>{pkg.country}</span>
                        <span className="flex items-center text-amber-500">
                          <FiStar className="w-3 h-3 fill-current mr-0.5" />
                          <span>{pkg.rating} ({pkg.reviewsCount})</span>
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-800 leading-snug line-clamp-1 group-hover:text-blue-600 transition">
                        {pkg.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100/50">
                      <div>
                        <p className="text-[8px] uppercase tracking-wider font-extrabold text-slate-400">Total Price</p>
                        <p className="text-base font-extrabold text-blue-600">{formatPrice(pkg.price)}</p>
                      </div>

                      <div className="flex space-x-1">
                        <button
                          onClick={() => setSelectedPkg(pkg)}
                          className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-lg text-[10px] font-bold text-slate-700 transition"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleOpenBookingWizard(pkg)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold shadow-sm transition"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty display */}
          {filteredPackages.length === 0 && (
            <div className="bg-white/40 border border-white/40 rounded-[30px] p-12 text-center space-y-3">
              <p className="text-sm font-bold text-slate-600">No packages match your search filters</p>
              <p className="text-xs text-slate-400">Try loosening your budget parameters or select 'All Countries'.</p>
            </div>
          )}

        </div>

      </div>

      {/* A. PACKAGE DETAILS DRAWER / OVERLAY */}
      <AnimatePresence>
        {selectedPkg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]"
            >
              
              {/* Header Image */}
              <div className="relative h-60 shrink-0">
                <img
                  src={selectedPkg.image}
                  alt={selectedPkg.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
                <button
                  onClick={() => setSelectedPkg(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white hover:bg-black/80 rounded-full transition"
                >
                  <FiX className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-5 right-5 text-white space-y-1">
                  <p className="text-[10px] uppercase font-bold text-blue-400">{selectedPkg.country}</p>
                  <h3 className="font-extrabold text-lg sm:text-xl leading-tight">{selectedPkg.name}</h3>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                
                {/* Description */}
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-800 text-sm">Package Description</h4>
                  <p className="text-slate-600 leading-relaxed">{selectedPkg.description}</p>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3">
                    <p className="text-[10px] text-slate-400 font-bold mb-0.5">Duration</p>
                    <p className="font-bold text-slate-800">{selectedPkg.duration}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3">
                    <p className="text-[10px] text-slate-400 font-bold mb-0.5">Best Season</p>
                    <p className="font-bold text-slate-800 leading-snug">{selectedPkg.bestSeason}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3">
                    <p className="text-[10px] text-slate-400 font-bold mb-0.5">Visa Difficulty</p>
                    <p className="font-bold text-slate-800">{selectedPkg.visaDifficulty}</p>
                  </div>
                </div>

                {/* Key Stop List */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-800 text-sm">Route Highlights</h4>
                  <div className="flex items-center space-x-2.5">
                    {selectedPkg.stops.map((stop, idx) => (
                      <React.Fragment key={stop}>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-1.5 font-bold text-blue-700">
                          {stop}
                        </div>
                        {idx !== selectedPkg.stops.length - 1 && (
                          <FiChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Hotel Options */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-800 text-sm">Luxury Stays Included</h4>
                  <div className="space-y-2">
                    {selectedPkg.hotels.map((hotel) => (
                      <div key={hotel.name} className="flex justify-between items-center bg-slate-50 border border-slate-200/50 rounded-xl p-3">
                        <span className="font-bold text-slate-700">{hotel.name}</span>
                        <div className="flex items-center space-x-4 text-slate-500">
                          <span className="font-semibold text-amber-500">★ {hotel.rating}</span>
                          <span className="font-bold text-slate-700">{formatPrice(hotel.price)}/night</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activities Checklist */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-800 text-sm">Activities Timeline</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {selectedPkg.activities.map((act) => (
                      <div key={act.name} className="flex justify-between items-center bg-slate-50 border border-slate-200/50 rounded-xl p-2.5">
                        <span className="font-semibold text-slate-600 line-clamp-1">{act.name}</span>
                        <span className="font-bold text-emerald-600 shrink-0 ml-2">+{formatPrice(act.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visa & Rules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-800">Visa Requirements</h5>
                    <p className="text-[10px] text-slate-500 leading-relaxed">{selectedPkg.visaRequirements}</p>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-800">Travel Instructions</h5>
                    <p className="text-[10px] text-slate-500 leading-relaxed">{selectedPkg.travelRules}</p>
                  </div>
                </div>

              </div>

              {/* Action buttons */}
              <div className="p-4 border-t border-slate-100 shrink-0 bg-slate-50 flex justify-between items-center">
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block">Package Price</span>
                  <span className="text-base font-extrabold text-blue-600">{formatPrice(selectedPkg.price)}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      toggleWishlist(selectedPkg.id);
                    }}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl font-bold text-slate-700"
                  >
                    {wishlist.includes(selectedPkg.id) ? "Saved in Wishlist" : "Save Package"}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPkg(null);
                      handleOpenBookingWizard(selectedPkg);
                    }}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm"
                  >
                    Book Trip Now
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* B. BOOKING WIZARD MODAL */}
      <AnimatePresence>
        {bookingWizardPkg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 p-6 flex flex-col space-y-5"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="font-extrabold text-sm text-slate-800">Booking Reservation Wizard</h3>
                <button
                  onClick={() => setBookingWizardPkg(null)}
                  className="p-1 hover:bg-slate-100 rounded-full transition"
                >
                  <FiX className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200/50 rounded-2xl">
                <img
                  src={bookingWizardPkg.image}
                  alt={bookingWizardPkg.name}
                  className="w-14 h-14 object-cover rounded-xl shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{bookingWizardPkg.country}</p>
                  <p className="font-bold text-xs text-slate-800 truncate leading-snug">{bookingWizardPkg.name}</p>
                  <p className="text-[10px] font-bold text-blue-600">{bookingWizardPkg.duration}</p>
                </div>
              </div>

              <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
                {/* Travel Date */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Travel Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {/* Travelers Count */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Travelers</label>
                  <select
                    value={travelersCount}
                    onChange={(e) => setTravelersCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} Traveler{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Hotel */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Select Premium Hotel</label>
                  <select
                    value={selectedHotel}
                    onChange={(e) => setSelectedHotel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    {bookingWizardPkg.hotels.map((hotel) => (
                      <option key={hotel.name} value={hotel.name}>
                        {hotel.name} ({formatPrice(hotel.price)}/n)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Costs breakdown */}
                <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 space-y-2">
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Costs Breakdown</p>
                  <div className="flex justify-between items-center">
                    <span>Base package price</span>
                    <span className="font-bold text-slate-700">{formatPrice(bookingWizardPkg.price)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Flights (estimate)</span>
                    <span>+{formatPrice(bookingWizardPkg.flightsCost)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Visa & processing fee</span>
                    <span>+{formatPrice(bookingWizardPkg.visaCost)}</span>
                  </div>
                  <div className="border-t border-slate-200/60 my-1.5"></div>
                  <div className="flex justify-between items-center font-bold text-slate-800">
                    <span>Total Estimate</span>
                    <span className="text-blue-600 font-extrabold text-sm">
                      {formatPrice((bookingWizardPkg.price + bookingWizardPkg.flightsCost + bookingWizardPkg.visaCost) * travelersCount)}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-400 text-right">Calculated for {travelersCount} traveler(s)</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-500 hover:shadow-lg hover:shadow-blue-500/10 text-white font-bold rounded-xl text-center transition"
                >
                  Confirm Flight & Hotel Booking
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ExplorePackages;
