import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiGlobe, FiSearch, FiBell, FiMenu, FiX, FiUser, FiHeart, FiSettings, FiLogOut, FiBriefcase, FiMap, FiCalendar, FiMessageSquare } from "react-icons/fi";
import { FaTelegramPlane } from "react-icons/fa";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout, wishlist } = useApp();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Explore Packages", path: "/packages" },
    { name: "Trip Planner", path: "/planner" },
    { name: "Travel Map", path: "/map" },
    { name: "Reviews", path: "/reviews" },
    { name: "About", path: "/about" },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Sticky Main Header */}
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm transition-all duration-300 py-3">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Left side: Logo */}
            <Link to="/" onClick={handleLinkClick} className="flex items-center space-x-2 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 shadow-sm text-blue-600 group-hover:scale-105 transition-transform duration-300">
                <FiGlobe className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
                <FaTelegramPlane className="w-3.5 h-3.5 text-emerald-500 absolute -top-1 -right-1 rotate-12 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
                Tour<span className="text-blue-600">Gaze</span>
              </span>
            </Link>

            {/* Center links: Desktop */}
            <div className="hidden lg:flex items-center justify-center flex-1 space-x-10">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className={`relative text-sm font-bold transition-colors duration-300 ${
                      isActive
                        ? "text-slate-900"
                        : "text-slate-400 hover:text-slate-800"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right side controls: Desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              
              {/* Search Shortcut */}
              <Link
                to="/packages"
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition"
                title="Search Packages"
              >
                <FiSearch className="w-5 h-5" />
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsProfileDropdownOpen(false);
                  }}
                  className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition relative"
                >
                  <FiBell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                </button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-xl backdrop-blur-lg ring-1 ring-black/5"
                    >
                      <h4 className="font-bold text-slate-800 text-sm mb-3">Notifications</h4>
                      <div className="space-y-3">
                        <div className="flex space-x-3 p-2 rounded-xl hover:bg-slate-50 transition duration-200">
                          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">Booking Confirmed!</p>
                            <p className="text-[10px] text-slate-500">Your trip to Dubai is confirmed.</p>
                          </div>
                        </div>
                        <div className="flex space-x-3 p-2 rounded-xl hover:bg-slate-50 transition duration-200">
                          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">Visa Ready</p>
                            <p className="text-[10px] text-slate-500">E-Visa issued for Tokyo itinerary.</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {user ? (
                <div className="relative ml-6">
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(!isProfileDropdownOpen);
                      setIsNotificationsOpen(false);
                    }}
                    className="flex items-center space-x-3 px-1.5 py-1.5 rounded-[30px] bg-[#01c5c4] hover:bg-[#00b0af] transition duration-200 shadow-md shadow-[#01c5c4]/30"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shrink-0 overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <FiUser className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-white pr-4">{user.name.split(" ")[0]}</span>
                  </button>

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-100 bg-white/95 p-2 shadow-xl backdrop-blur-lg ring-1 ring-black/5"
                      >
                        <div className="px-4 py-3 border-b border-slate-100 mb-1">
                          <p className="text-xs font-bold text-slate-800">{user.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                          <span className="inline-block mt-1.5 text-[9px] px-2 py-0.5 font-bold text-white bg-blue-600 rounded-full">
                            {user.membership}
                          </span>
                        </div>

                        <Link
                          to="/profile"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                        >
                          <FiUser className="w-4 h-4 text-slate-500" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                        >
                          <FiBriefcase className="w-4 h-4 text-slate-500" />
                          <span>Booking Dashboard</span>
                        </Link>
                        <Link
                          to="/wishlist"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                        >
                          <FiHeart className="w-4 h-4 text-slate-500" />
                          <span>Wishlist ({wishlist.length})</span>
                        </Link>
                        
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            logout();
                          }}
                          className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition mt-1 border-t border-slate-100"
                        >
                          <FiLogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-6 ml-6">
                  <Link
                    to="/signup"
                    className="text-sm font-bold text-slate-400 hover:text-slate-800 transition"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center space-x-3 px-1.5 py-1.5 rounded-[30px] bg-[#01c5c4] hover:bg-[#00b0af] transition duration-200 shadow-md shadow-[#01c5c4]/30"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shrink-0">
                      <FiUser className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-white pr-4">Log In</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger menu trigger */}
            <div className="flex items-center space-x-2 lg:hidden">
              {user && (
                <Link to="/profile" className="flex items-center">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-500/20"
                  />
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-full"
              >
                {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
            
          </div>
        </div>

        {/* Mobile Full Screen Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-b border-slate-100 bg-white/95 backdrop-blur-lg overflow-hidden shadow-lg"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={handleLinkClick}
                      className={`block px-4 py-3 text-sm font-semibold rounded-xl transition ${
                        isActive
                          ? "text-blue-600 bg-blue-50"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                <div className="pt-4 border-t border-slate-100 space-y-2 px-4">
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={handleLinkClick}
                        className="block py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600"
                      >
                        Booking Dashboard
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={handleLinkClick}
                        className="block py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600"
                      >
                        Wishlist ({wishlist.length})
                      </Link>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          logout();
                        }}
                        className="block w-full text-left py-2.5 text-sm font-bold text-red-600 hover:text-red-700"
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-2 pt-2">
                      <Link
                        to="/login"
                        onClick={handleLinkClick}
                        className="w-full text-center py-2.5 text-sm font-bold text-slate-700 border border-slate-200 rounded-xl"
                      >
                        Log In
                      </Link>
                      <Link
                        to="/signup"
                        onClick={handleLinkClick}
                        className="w-full text-center py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Floating Bottom Nav for Mobile Screens */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="glass-panel border border-white/40 flex items-center justify-around py-3 px-2 rounded-2xl shadow-xl backdrop-blur-lg">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`flex flex-col items-center justify-center space-y-0.5 text-[10px] font-bold ${
              location.pathname === "/" ? "text-blue-600" : "text-slate-500"
            }`}
          >
            <FiGlobe className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link
            to="/packages"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`flex flex-col items-center justify-center space-y-0.5 text-[10px] font-bold ${
              location.pathname === "/packages" ? "text-blue-600" : "text-slate-500"
            }`}
          >
            <FiBriefcase className="w-5 h-5" />
            <span>Packages</span>
          </Link>
          <Link
            to="/planner"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`flex flex-col items-center justify-center space-y-0.5 text-[10px] font-bold ${
              location.pathname === "/planner" ? "text-blue-600" : "text-slate-500"
            }`}
          >
            <FiCalendar className="w-5 h-5" />
            <span>Planner</span>
          </Link>
          <Link
            to="/map"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`flex flex-col items-center justify-center space-y-0.5 text-[10px] font-bold ${
              location.pathname === "/map" ? "text-blue-600" : "text-slate-500"
            }`}
          >
            <FiMap className="w-5 h-5" />
            <span>Map</span>
          </Link>
          <Link
            to="/dashboard"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`flex flex-col items-center justify-center space-y-0.5 text-[10px] font-bold ${
              location.pathname === "/dashboard" ? "text-blue-600" : "text-slate-500"
            }`}
          >
            <FiBriefcase className="w-5 h-5" />
            <span>Bookings</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
