import React from "react";
import { Link } from "react-router-dom";
import { FiGlobe, FiGithub, FiTwitter, FiInstagram, FiMail } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="glass-panel-dark text-slate-300 mt-20 rounded-t-[40px] border-t border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/80 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* About TourGaze */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400">
                <FiGlobe className="w-4 h-4 animate-spin-slow" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Tour<span className="text-blue-400">Gaze</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              TourGaze is a premium international travel platform combining route optimization, interactive planning widgets, cost calculation, and booking dashboards to deliver smart travel solutions.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition duration-200">
                <FiTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition duration-200">
                <FiInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition duration-200">
                <FiGithub className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Discover</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/packages" className="hover:text-blue-400 transition">Explore Packages</Link>
              </li>
              <li>
                <Link to="/planner" className="hover:text-blue-400 transition">Multi-City Trip Planner</Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-blue-400 transition">Travel Maps</Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-blue-400 transition">Customer Reviews</Link>
              </li>
            </ul>
          </div>

          {/* Support / Help */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Support</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/rules" className="hover:text-blue-400 transition">Visa Requirements</Link>
              </li>
              <li>
                <Link to="/rules" className="hover:text-blue-400 transition">Cancellation & Refunds</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition">Privacy & Policies</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm mb-4">Join Newsletter</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sign up to receive travel tips, flight deals, and destination recommendations directly.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center bg-white/5 rounded-xl border border-white/10 p-1">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none px-3 py-2 w-full"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 transition shrink-0"
              >
                <FiMail className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-white/5 mt-12 pt-8 text-center text-[10px] text-slate-500">
          <p>© {new Date().getFullYear()} TourGaze Inc. Built with ReactJS & Tailwind CSS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
