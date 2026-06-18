import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiGlobe, FiSearch, FiBell, FiMenu, FiX, FiUser, FiHeart,
  FiLogOut, FiBriefcase, FiMap, FiCalendar, FiChevronDown,
  FiBookOpen, FiMessageSquare, FiInfo, FiShield, FiUsers,
  FiCheckSquare, FiGrid, FiLayers
} from "react-icons/fi";
import { FaTelegramPlane } from "react-icons/fa";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout, wishlist } = useApp();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // "resources" | "admin" | null

  const dropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
        setIsProfileDropdownOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const primaryLinks = [
    { name: "Explore", path: "/packages" },
    { name: "Plan Trip", path: "/planner" },
    { name: "Travel Map", path: "/map" },
  ];

  const resourcesLinks = [
    { name: "Reviews", path: "/reviews", icon: FiMessageSquare },
    { name: "Agency Rules Hub", path: "/rules", icon: FiBookOpen },
    { name: "About", path: "/about", icon: FiInfo },
  ];

  const adminLinks = [
    { name: "Dashboard", path: "/admin", icon: FiGrid },
    { name: "Booking Queue", path: "/admin?tab=queue", icon: FiLayers },
    { name: "Pass Verification", path: "/admin?tab=verify", icon: FiCheckSquare },
    { name: "Guide Management", path: "/admin?tab=guides", icon: FiUsers },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleDropdown = (name) => {
    setActiveDropdown(prev => prev === name ? null : name);
    setIsProfileDropdownOpen(false);
    setIsNotificationsOpen(false);
  };

  const isActive = (path) => {
    if (path.includes("?")) return location.pathname + location.search === path;
    return location.pathname === path;
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 8, scale: 0.97 },
  };

  const isAdmin = user?.role === "admin";

  return (
    <>
      <nav ref={dropdownRef} className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 transition-all duration-300">
        <div className={`${isAdmin ? "w-full" : "max-w-[1440px] mx-auto"} px-4 sm:px-6 lg:px-8`}>
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" onClick={handleLinkClick} className="flex items-center space-x-2.5 group shrink-0">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-600 group-hover:scale-105 transition-transform duration-300">
                <FiGlobe className="w-4.5 h-4.5 animate-[spin_12s_linear_infinite]" />
                <FaTelegramPlane className="w-3 h-3 text-emerald-500 absolute -top-1 -right-1 rotate-12 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                Tour<span className="text-blue-600">Gaze</span>
              </span>
            </Link>

            {/* Center: Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1 ml-12">
              <div className="flex items-center space-x-1">

                {/* Primary Links */}
                {!isAdmin && primaryLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => { setActiveDropdown(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                      isActive(link.path)
                        ? "text-blue-600 bg-blue-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Resources Dropdown */}
                {!isAdmin && (
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown("resources")}
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                        activeDropdown === "resources" || resourcesLinks.some(l => isActive(l.path))
                          ? "text-blue-600 bg-blue-50"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <span>Resources</span>
                      <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "resources" ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === "resources" && (
                        <motion.div
                          variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl border border-slate-100 shadow-lg shadow-slate-200/50 p-1.5 z-50"
                        >
                          {resourcesLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                              <Link
                                key={link.name}
                                to={link.path}
                                onClick={handleLinkClick}
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                                  isActive(link.path)
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                }`}
                              >
                                <Icon className="w-4 h-4 text-slate-400" />
                                <span>{link.name}</span>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Admin Dropdown */}
                {isAdmin && (
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown("admin")}
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                        activeDropdown === "admin" || location.pathname === "/admin"
                          ? "text-blue-600 bg-blue-50"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <span>Admin Tools</span>
                      <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "admin" ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === "admin" && (
                        <motion.div
                          variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl border border-slate-100 shadow-lg shadow-slate-200/50 p-1.5 z-50"
                        >
                          {adminLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                              <Link
                                key={link.name}
                                to={link.path}
                                onClick={handleLinkClick}
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                                  isActive(link.path)
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                }`}
                              >
                                <Icon className="w-4 h-4 text-slate-400" />
                                <span>{link.name}</span>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            {/* Right Controls: Desktop */}
            <div className="hidden lg:flex items-center space-x-2 shrink-0">
              {/* Search */}
              {!isAdmin && (
                <Link
                  to="/packages"
                  className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all duration-200"
                  title="Search Packages"
                >
                  <FiSearch className="w-[18px] h-[18px]" />
                </Link>
              )}

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsProfileDropdownOpen(false);
                    setActiveDropdown(null);
                  }}
                  className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all duration-200 relative"
                >
                  <FiBell className="w-[18px] h-[18px]" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                </button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-100 bg-white p-4 shadow-lg shadow-slate-200/50 z-50"
                    >
                      <h4 className="font-bold text-slate-800 text-sm mb-3">Notifications</h4>
                      <div className="space-y-2">
                        <div className="flex space-x-3 p-2.5 rounded-lg hover:bg-slate-50 transition duration-200">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">Booking Confirmed!</p>
                            <p className="text-[11px] text-slate-500">Your trip to Dubai is confirmed.</p>
                          </div>
                        </div>
                        <div className="flex space-x-3 p-2.5 rounded-lg hover:bg-slate-50 transition duration-200">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 shrink-0"></div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">Visa Ready</p>
                            <p className="text-[11px] text-slate-500">E-Visa issued for Tokyo itinerary.</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-slate-200 mx-1"></div>

              {/* Profile / Auth */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(!isProfileDropdownOpen);
                      setIsNotificationsOpen(false);
                      setActiveDropdown(null);
                    }}
                    className="flex items-center space-x-2.5 pl-1 pr-3 py-1 rounded-full hover:bg-slate-50 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white shrink-0 overflow-hidden ring-2 ring-slate-200">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <FiUser className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-[13px] font-semibold text-slate-700">{user.name.split(" ")[0]}</span>
                    <FiChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg shadow-slate-200/50 z-50"
                      >
                        <div className="px-3 py-3 border-b border-slate-100 mb-1">
                          <p className="text-sm font-bold text-slate-800">{user.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                          <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 font-bold text-white bg-blue-600 rounded-full">
                            {user.membership}
                          </span>
                        </div>

                        {!isAdmin && (
                          <>
                            <Link to="/profile" onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition">
                              <FiUser className="w-4 h-4 text-slate-400" /><span>My Profile</span>
                            </Link>
                            <Link to="/dashboard" onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition">
                              <FiBriefcase className="w-4 h-4 text-slate-400" /><span>My Bookings</span>
                            </Link>
                            <Link to="/wishlist" onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition">
                              <FiHeart className="w-4 h-4 text-slate-400" /><span>Wishlist ({wishlist.length})</span>
                            </Link>
                          </>
                        )}

                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button
                            onClick={() => { setIsProfileDropdownOpen(false); logout(); }}
                            className="flex items-center space-x-2.5 w-full text-left px-3 py-2.5 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50 transition"
                          >
                            <FiLogOut className="w-4 h-4" /><span>Log Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/signup" className="text-[13px] font-semibold text-slate-500 hover:text-slate-800 transition">
                    Sign Up
                  </Link>
                  <Link to="/login"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-semibold transition-all duration-200 shadow-sm"
                  >
                    <FiUser className="w-3.5 h-3.5" />
                    <span>Log In</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center space-x-2 lg:hidden">
              {user && (
                <Link to="/profile" className="flex items-center">
                  <img src={user.avatar} alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-200" />
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Full Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-100 bg-white overflow-hidden shadow-lg"
            >
              <div className="px-4 pt-3 pb-6 space-y-1 max-h-[80vh] overflow-y-auto overscroll-contain">

                {/* Primary */}
                {!isAdmin && (
                  <>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3 pt-2 pb-1">Navigate</p>
                    <Link to="/" onClick={handleLinkClick} className={`block px-3 py-2.5 text-[13px] font-semibold rounded-lg transition ${location.pathname === "/" ? "text-blue-600 bg-blue-50" : "text-slate-700 hover:bg-slate-50"}`}>Home</Link>
                    {primaryLinks.map((link) => (
                      <Link key={link.name} to={link.path} onClick={handleLinkClick}
                        className={`block px-3 py-2.5 text-[13px] font-semibold rounded-lg transition ${isActive(link.path) ? "text-blue-600 bg-blue-50" : "text-slate-700 hover:bg-slate-50"}`}>
                        {link.name}
                      </Link>
                    ))}

                    {/* Resources */}
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3 pt-4 pb-1">Resources</p>
                    {resourcesLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link key={link.name} to={link.path} onClick={handleLinkClick}
                          className={`flex items-center space-x-2.5 px-3 py-2.5 text-[13px] font-semibold rounded-lg transition ${isActive(link.path) ? "text-blue-600 bg-blue-50" : "text-slate-700 hover:bg-slate-50"}`}>
                          <Icon className="w-4 h-4 text-slate-400" /><span>{link.name}</span>
                        </Link>
                      );
                    })}
                  </>
                )}

                {/* Admin */}
                {isAdmin && (
                  <>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3 pt-4 pb-1">Admin Tools</p>
                    {adminLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link key={link.name} to={link.path} onClick={handleLinkClick}
                          className={`flex items-center space-x-2.5 px-3 py-2.5 text-[13px] font-semibold rounded-lg transition ${isActive(link.path) ? "text-blue-600 bg-blue-50" : "text-slate-700 hover:bg-slate-50"}`}>
                          <Icon className="w-4 h-4 text-slate-400" /><span>{link.name}</span>
                        </Link>
                      );
                    })}
                  </>
                )}

                {/* User actions */}
                <div className="border-t border-slate-100 mt-3 pt-3 space-y-1">
                  {user ? (
                    <>
                      <Link to="/dashboard" onClick={handleLinkClick} className="block px-3 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">My Bookings</Link>
                      <Link to="/wishlist" onClick={handleLinkClick} className="block px-3 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">Wishlist ({wishlist.length})</Link>
                      <button onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                        className="block w-full text-left px-3 py-2.5 text-[13px] font-bold text-red-600 hover:bg-red-50 rounded-lg">
                        Log Out
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-2 pt-2">
                      <Link to="/login" onClick={handleLinkClick} className="w-full text-center py-2.5 text-[13px] font-bold text-slate-700 border border-slate-200 rounded-lg">Log In</Link>
                      <Link to="/signup" onClick={handleLinkClick} className="w-full text-center py-2.5 text-[13px] font-bold text-white bg-slate-900 rounded-lg">Sign Up</Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200 flex items-center justify-around py-3 px-2 rounded-2xl shadow-lg">
          {!isAdmin ? (
            <>
              <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={`flex flex-col items-center justify-center space-y-0.5 text-[10px] font-bold ${location.pathname === "/" ? "text-blue-600" : "text-slate-500"}`}>
                <FiGlobe className="w-5 h-5" /><span>Home</span>
              </Link>
              <Link to="/packages" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={`flex flex-col items-center justify-center space-y-0.5 text-[10px] font-bold ${location.pathname === "/packages" ? "text-blue-600" : "text-slate-500"}`}>
                <FiBriefcase className="w-5 h-5" /><span>Explore</span>
              </Link>
              <Link to="/planner" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={`flex flex-col items-center justify-center space-y-0.5 text-[10px] font-bold ${location.pathname === "/planner" ? "text-blue-600" : "text-slate-500"}`}>
                <FiCalendar className="w-5 h-5" /><span>Planner</span>
              </Link>
              <Link to="/map" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={`flex flex-col items-center justify-center space-y-0.5 text-[10px] font-bold ${location.pathname === "/map" ? "text-blue-600" : "text-slate-500"}`}>
                <FiMap className="w-5 h-5" /><span>Map</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/admin" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={`flex flex-col items-center justify-center space-y-0.5 text-[10px] font-bold ${location.pathname === "/admin" ? "text-blue-600" : "text-slate-500"}`}>
                <FiShield className="w-5 h-5" /><span>Dashboard</span>
              </Link>
              <Link to="/admin?tab=queue" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={`flex flex-col items-center justify-center space-y-0.5 text-[10px] font-bold ${location.search.includes("queue") ? "text-blue-600" : "text-slate-500"}`}>
                <FiLayers className="w-5 h-5" /><span>Queue</span>
              </Link>
              <Link to="/admin?tab=verify" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={`flex flex-col items-center justify-center space-y-0.5 text-[10px] font-bold ${location.search.includes("verify") ? "text-blue-600" : "text-slate-500"}`}>
                <FiCheckSquare className="w-5 h-5" /><span>Verify</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
