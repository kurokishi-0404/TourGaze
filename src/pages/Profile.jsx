import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { FiUser, FiMap, FiHeart, FiMessageSquare, FiSettings, FiBell, FiShield, FiCalendar, FiMapPin, FiMail, FiPhone, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const { user, updateProfile, wishlist, packages, bookings, formatPrice, customTrips, deleteCustomTrip } = useApp();
  const [activeTab, setActiveTab] = useState("timeline");

  // Form edit states
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [successMsg, setSuccessMsg] = useState("");

  // Options states
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  // Safe checks to prevent crashing when localStorage returns null
  const safeWishlist = wishlist || [];
  const safePackages = packages || [];
  const safeBookings = bookings || [];
  const safeCustomTrips = customTrips || [];

  // Find wishlist package objects
  const savedPackages = safePackages.filter((pkg) => safeWishlist.includes(pkg.id));

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      phone
    });
    setSuccessMsg("Profile details updated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center pt-32 pb-20 space-y-4 px-4 text-xs">
        <FiUser className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-xl font-bold text-slate-800">You are logged out</h3>
        <p className="text-slate-500">Sign in to unlock personalized statistics and travel timelines.</p>
        <Link
          to="/login"
          className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 space-y-8">
      
      {/* PROFILE BANNER / HEADER */}
      <div className="glass-card p-6 sm:p-8 border border-white/50 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        
        {/* Banner blur background design */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10 text-center sm:text-left text-xs">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-[24px] object-cover shadow-lg border-2 border-white ring-4 ring-blue-500/10"
          />
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">{user.name}</h2>
              <span className="inline-block sm:self-center px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-full shadow-sm">
                {user.membership}
              </span>
            </div>
            <p className="text-slate-400 mt-1">{user.email}</p>
            <p className="text-[10px] text-slate-500 mt-1 font-bold">Explorer Member since July 2024</p>
          </div>
        </div>

        {/* Dynamic Badges display */}
        <div className="flex space-x-2 relative z-10">
          <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-xl">
            Passports Verified
          </span>
          <span className="bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-xl">
            Frequent Flyer
          </span>
        </div>
      </div>

      {/* STATISTICS CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: "Trips Completed", val: user.tripsCompleted, icon: FiCheckCircle, color: "text-emerald-500 bg-emerald-50 border-emerald-200" },
          { label: "Countries Visited", val: user.countriesVisited, icon: FiMap, color: "text-blue-500 bg-blue-50 border-blue-200" },
          { label: "Saved Packages", val: safeWishlist.length, icon: FiHeart, color: "text-red-500 bg-red-50 border-red-200" },
          { label: "Reviews Submitted", val: user.reviewsGiven, icon: FiMessageSquare, color: "text-purple-500 bg-purple-50 border-purple-200" }
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-5 border border-white/50 shadow-md flex items-center space-x-4">
            <div className={`p-3 rounded-2xl border ${stat.color.split(" ")[1]} ${stat.color.split(" ")[2]} shrink-0`}>
              <stat.icon className={`w-5 h-5 ${stat.color.split(" ")[0]}`} />
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-slate-400 leading-snug">{stat.label}</p>
              <p className="text-lg font-extrabold text-slate-800">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TABS SELECTOR */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto whitespace-nowrap hide-scrollbar">
        {[
          { id: "timeline", name: "Upcoming Timeline", icon: FiCalendar },
          { id: "custom", name: "My Planners", icon: FiMap },
          { id: "saved", name: "Saved Packages", icon: FiHeart },
          { id: "settings", name: "Account Settings", icon: FiSettings }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 pb-4 text-xs font-bold transition-all relative ${
              activeTab === tab.id
                ? "text-blue-600 font-extrabold"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <tab.icon className="w-4 h-4 shrink-0" />
            <span>{tab.name}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}
      <div className="pt-2 text-xs">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: TIMELINE */}
          {activeTab === "timeline" && (
            <motion.div
              key="timeline-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-6"
            >
              {safeBookings.length > 0 ? (
                <div className="relative pl-6 border-l-2 border-slate-300 space-y-6">
                  {safeBookings.map((bk, idx) => (
                    <div key={bk.id} className="relative">
                      {/* Node point */}
                      <span className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-sm flex items-center justify-center"></span>
                      
                      <div className="glass-card p-5 border border-white/50 shadow-md flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex items-center space-x-3.5">
                          <img
                            src={bk.image}
                            alt={bk.packageName}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-slate-800">{bk.packageName}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center space-x-1">
                              <FiCalendar className="w-3 h-3 text-slate-400" />
                              <span>Travel Date: {bk.travelDate}</span>
                            </p>
                            <p className="text-[10px] text-slate-400 flex items-center space-x-1">
                              <FiMapPin className="w-3 h-3 text-slate-400" />
                              <span>Hotel stay: {bk.hotel}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between items-end shrink-0 text-right">
                          <span className="inline-block px-2.5 py-0.5 font-bold rounded-lg text-[9px] bg-blue-50 text-blue-700 border border-blue-150">
                            {bk.status}
                          </span>
                          <Link
                            to="/dashboard"
                            className="text-[10px] font-extrabold text-blue-600 hover:underline pt-2"
                          >
                            Manage Booking
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[24px] p-8 text-center text-slate-400">
                  No upcoming reservations listed.
                </div>
              )}
            </motion.div>
          )}

          {/* TAB: MY PLANNERS (CUSTOM TRIPS) */}
          {activeTab === "custom" && (
            <motion.div
              key="custom-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {safeCustomTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="glass-card p-5 border border-white/50 shadow-md relative group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-extrabold text-sm text-slate-800">{trip.packageName || "Custom Multi-City Trip"}</h4>
                      <button
                        onClick={() => deleteCustomTrip(trip.id)}
                        className="text-[10px] text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg font-bold transition sm:opacity-0 sm:group-hover:opacity-100"
                        title="Delete Package"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mb-4 flex items-center space-x-1">
                      <FiCalendar className="w-3 h-3" />
                      <span>Created on {trip.dateCreated}</span>
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {trip.stops?.map((stop, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded-md font-bold">
                          {stop}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-[9px] uppercase font-bold text-slate-400">Est. Total</p>
                      <p className="font-extrabold text-blue-600">{formatPrice(trip.price || 0)}</p>
                    </div>
                    <Link to="/planner" className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-bold text-[10px] hover:bg-blue-100">
                      Open Planner
                    </Link>
                  </div>
                </div>
              ))}
              
              {safeCustomTrips.length === 0 && (
                <div className="col-span-full bg-slate-50 border border-dashed border-slate-200 rounded-[24px] p-8 text-center text-slate-400">
                  You haven't built any custom trips yet.
                  <div className="mt-4">
                    <Link to="/planner" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 inline-block">
                      Start Planning
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: SAVED PACKAGES */}
          {activeTab === "saved" && (
            <motion.div
              key="saved-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {savedPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="glass-card flex flex-col justify-between h-[360px] overflow-hidden border border-white/50 relative shadow-sm"
                >
                  <div className="relative h-40 shrink-0">
                    <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <p className="text-[9px] uppercase font-bold text-slate-400">{pkg.country}</p>
                      <h4 className="font-extrabold text-sm text-slate-800 leading-snug truncate">{pkg.name}</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{pkg.description}</p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100/50">
                      <span className="font-extrabold text-blue-600">{formatPrice(pkg.price)}</span>
                      <Link to="/packages" className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold">
                        Book Tour
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {savedPackages.length === 0 && (
                <div className="col-span-full bg-slate-50 border border-dashed border-slate-200 rounded-[24px] p-8 text-center text-slate-400">
                  No saved travel packages in your wishlist.
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: ACCOUNT SETTINGS */}
          {activeTab === "settings" && (
            <motion.div
              key="settings-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Form details */}
              <div className="lg:col-span-7 glass-card p-6 border border-white/50 shadow-md space-y-5">
                <h4 className="font-extrabold text-xs text-slate-800 flex items-center space-x-1.5 uppercase tracking-wider">
                  <FiUser className="w-4 h-4 text-blue-600" />
                  <span>Personal Details</span>
                </h4>

                {successMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-bold text-[10px]">
                    {successMsg}
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4 font-semibold text-slate-600">
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-semibold text-slate-700 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-semibold text-slate-700 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-semibold text-slate-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition"
                  >
                    Save Modifications
                  </button>
                </form>
              </div>

              {/* Preferences settings */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Notifications settings */}
                <div className="glass-card p-5 border border-white/50 shadow-md space-y-4">
                  <h4 className="font-extrabold text-xs text-slate-800 flex items-center space-x-1.5 uppercase tracking-wider">
                    <FiBell className="w-4 h-4 text-blue-600" />
                    <span>Notifications settings</span>
                  </h4>

                  <div className="space-y-3 font-bold text-slate-700">
                    <label className="flex items-center space-x-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={emailNotif}
                        onChange={() => setEmailNotif(!emailNotif)}
                        className="w-4 h-4 rounded text-blue-600 border-slate-300"
                      />
                      <span>Receive email notifications</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={pushNotif}
                        onChange={() => setPushNotif(!pushNotif)}
                        className="w-4 h-4 rounded text-blue-600 border-slate-300"
                      />
                      <span>Receive push alerts</span>
                    </label>
                  </div>
                </div>

                {/* Security settings */}
                <div className="glass-card p-5 border border-white/50 shadow-md space-y-4">
                  <h4 className="font-extrabold text-xs text-slate-800 flex items-center space-x-1.5 uppercase tracking-wider">
                    <FiShield className="w-4 h-4 text-blue-600" />
                    <span>Security & Access</span>
                  </h4>

                  <div className="space-y-3 font-bold text-slate-700">
                    <label className="flex items-center space-x-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={twoFactor}
                        onChange={() => setTwoFactor(!twoFactor)}
                        className="w-4 h-4 rounded text-blue-600 border-slate-300"
                      />
                      <span>Enable Two-Factor Authentication</span>
                    </label>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
};

export default Profile;
